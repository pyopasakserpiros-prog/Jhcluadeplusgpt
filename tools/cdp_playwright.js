'use strict';
/**
 * Zero-dependency Playwright Chromium compatibility driver over Chrome DevTools Protocol (CDP).
 * Launches local headless Chromium (/usr/bin/chromium) and implements the Playwright API subset
 * used by test/browser.js, test/browser2.js, test/browser3.js, test/gesture.js, test/perf.js,
 * and test/browser_mobile_perf.js.
 */
const { spawn } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { URL, fileURLToPath } = require('url');

function findChromiumExecutable() {
  const candidates = [
    process.env.CHROMIUM_PATH,
    '/usr/lib/chromium/chromium',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable'
  ].filter(Boolean);
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error('No Chromium executable found');
}

const LOCAL_STORAGE_SHIM = `<script>
(function(){
  try {
    window.localStorage.setItem('__cdp_test__', '1');
    window.localStorage.removeItem('__cdp_test__');
  } catch (e) {
    var store = Object.create(null);
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      enumerable: true,
      value: {
        getItem: function(k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
        setItem: function(k, v) { store[k] = String(v); },
        removeItem: function(k) { delete store[k]; },
        clear: function() { store = Object.create(null); }
      }
    });
  }
})();
</script>`;

function bundleFileUrlHtml(url) {
  let filePath = url.startsWith('file://') ? fileURLToPath(url) : url;
  const dir = path.dirname(filePath);
  let html = fs.readFileSync(filePath, 'utf8');
  html = html.replace(/<link[^>]+href="([^"]+)"[^>]*>/g, (m, rel) => {
    const p = path.resolve(dir, rel);
    if (fs.existsSync(p)) return '<style>\n' + fs.readFileSync(p, 'utf8') + '\n</style>';
    return m;
  });
  html = html.replace(/<script src="([^"]+)"><\/script>/g, (m, rel) => {
    const p = path.resolve(dir, rel);
    if (fs.existsSync(p)) {
      return '<script>\n/* ' + rel + ' */\n' + fs.readFileSync(p, 'utf8').replace(/<\/script/gi, '<\\/script') + '\n</script>';
    }
    return m;
  });
  if (html.includes('<head>')) {
    html = html.replace('<head>', '<head>\n' + LOCAL_STORAGE_SHIM);
  } else {
    html = LOCAL_STORAGE_SHIM + '\n' + html;
  }
  return html;
}

class SimpleWebSocket {
  constructor(wsUrl) {
    this.url = new URL(wsUrl);
    this.socket = null;
    this.buffer = Buffer.alloc(0);
    this.onmessage = null;
    this.onclose = null;
  }
  connect() {
    return new Promise((resolve, reject) => {
      const key = crypto.randomBytes(16).toString('base64');
      const port = +(this.url.port || 80);
      const host = this.url.hostname || '127.0.0.1';
      const req = http.request({
        host,
        port,
        path: this.url.pathname + this.url.search,
        headers: {
          Connection: 'Upgrade',
          Upgrade: 'websocket',
          'Sec-WebSocket-Key': key,
          'Sec-WebSocket-Version': '13'
        }
      });
      req.on('upgrade', (res, socket, head) => {
        this.socket = socket;
        if (head && head.length) this._onData(head);
        socket.on('data', chunk => this._onData(chunk));
        socket.on('close', () => { if (this.onclose) this.onclose(); });
        socket.on('error', () => {});
        resolve(this);
      });
      req.on('error', reject);
      req.end();
    });
  }
  send(str) {
    if (!this.socket || this.socket.destroyed) return;
    const payload = Buffer.from(str, 'utf8');
    const len = payload.length;
    let header;
    if (len < 126) {
      header = Buffer.alloc(6);
      header[0] = 0x81;
      header[1] = 0x80 | len;
    } else if (len < 65536) {
      header = Buffer.alloc(8);
      header[0] = 0x81;
      header[1] = 0x80 | 126;
      header.writeUInt16BE(len, 2);
    } else {
      header = Buffer.alloc(14);
      header[0] = 0x81;
      header[1] = 0x80 | 127;
      header.writeBigUInt64BE(BigInt(len), 2);
    }
    const mask = crypto.randomBytes(4);
    mask.copy(header, header.length - 4);
    const masked = Buffer.alloc(len);
    for (let i = 0; i < len; i++) masked[i] = payload[i] ^ mask[i & 3];
    this.socket.write(Buffer.concat([header, masked]));
  }
  _onData(chunk) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    while (this.buffer.length >= 2) {
      const b0 = this.buffer[0], b1 = this.buffer[1];
      const opcode = b0 & 0x0f;
      const masked = (b1 & 0x80) !== 0;
      let len = b1 & 0x7f;
      let offset = 2;
      if (len === 126) {
        if (this.buffer.length < 4) return;
        len = this.buffer.readUInt16BE(2);
        offset = 4;
      } else if (len === 127) {
        if (this.buffer.length < 10) return;
        len = Number(this.buffer.readBigUInt64BE(2));
        offset = 10;
      }
      const maskLen = masked ? 4 : 0;
      if (this.buffer.length < offset + maskLen + len) return;
      let data = this.buffer.subarray(offset + maskLen, offset + maskLen + len);
      if (masked) {
        const mask = this.buffer.subarray(offset, offset + 4);
        const unmasked = Buffer.alloc(len);
        for (let i = 0; i < len; i++) unmasked[i] = data[i] ^ mask[i & 3];
        data = unmasked;
      }
      this.buffer = this.buffer.subarray(offset + maskLen + len);
      if (opcode === 0x1 && this.onmessage) {
        this.onmessage(data.toString('utf8'));
      } else if (opcode === 0x8) {
        this.close();
        return;
      }
    }
  }
  close() {
    if (this.socket && !this.socket.destroyed) {
      try { this.socket.destroy(); } catch (e) {}
    }
  }
}

class CDPSession {
  constructor(ws) {
    this.ws = ws;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
    ws.onmessage = raw => {
      let msg;
      try { msg = JSON.parse(raw); } catch (e) { return; }
      if (msg.id) {
        const p = this.pending.get(msg.id);
        if (p) {
          this.pending.delete(msg.id);
          if (msg.error) p.reject(new Error(msg.error.message || JSON.stringify(msg.error)));
          else p.resolve(msg.result || {});
        }
      } else if (msg.method) {
        const key = (msg.sessionId ? msg.sessionId + ':' : '') + msg.method;
        const handlers = this.listeners.get(key) || [];
        for (const h of handlers) h(msg.params || {});
      }
    };
  }
  send(method, params = {}, sessionId = null) {
    const id = this.nextId++;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify(payload));
    });
  }
  on(method, handler, sessionId = null) {
    const key = (sessionId ? sessionId + ':' : '') + method;
    const list = this.listeners.get(key) || [];
    list.push(handler);
    this.listeners.set(key, list);
  }
}

class Page {
  constructor(cdp, sessionId, targetId, opts = {}) {
    this.cdp = cdp;
    this.sessionId = sessionId;
    this.targetId = targetId;
    this.opts = opts;
    this.handlers = { pageerror: [], console: [] };
    this._mx = 0;
    this._my = 0;
    this._buttons = 0;

    this.cdp.on('Runtime.exceptionThrown', params => {
      const d = params.exceptionDetails || {};
      const desc = (d.exception && (d.exception.description || d.exception.value)) || d.text || 'Page exception';
      const err = new Error(desc);
      for (const fn of this.handlers.pageerror) fn(err);
    }, sessionId);

    this.cdp.on('Runtime.consoleAPICalled', params => {
      const text = (params.args || []).map(a => a.value !== undefined ? String(a.value) : (a.description || '')).join(' ');
      const msg = {
        type: () => params.type || 'log',
        text: () => text
      };
      for (const fn of this.handlers.console) fn(msg);
    }, sessionId);

    this.mouse = {
      move: async (x, y, options = {}) => {
        const steps = Math.max(1, options.steps || 1);
        const x0 = this._mx, y0 = this._my;
        for (let i = 1; i <= steps; i++) {
          const cx = x0 + (x - x0) * (i / steps);
          const cy = y0 + (y - y0) * (i / steps);
          this._mx = cx;
          this._my = cy;
          await this.cdp.send('Input.dispatchMouseEvent', {
            type: 'mouseMoved',
            x: cx,
            y: cy,
            button: this._buttons ? 'left' : 'none',
            buttons: this._buttons
          }, this.sessionId);
        }
      },
      down: async () => {
        this._buttons = 1;
        await this.cdp.send('Input.dispatchMouseEvent', {
          type: 'mousePressed',
          x: this._mx,
          y: this._my,
          button: 'left',
          buttons: 1,
          clickCount: 1
        }, this.sessionId);
      },
      up: async () => {
        this._buttons = 0;
        await this.cdp.send('Input.dispatchMouseEvent', {
          type: 'mouseReleased',
          x: this._mx,
          y: this._my,
          button: 'left',
          buttons: 0,
          clickCount: 1
        }, this.sessionId);
      },
      click: async (x, y) => {
        await this.mouse.move(x, y);
        await this.mouse.down();
        await this.mouse.up();
      },
      wheel: async (deltaX, deltaY) => {
        await this.cdp.send('Input.dispatchMouseEvent', {
          type: 'mouseWheel',
          x: this._mx,
          y: this._my,
          deltaX: deltaX || 0,
          deltaY: deltaY || 0
        }, this.sessionId);
      }
    };
  }

  async _init() {
    await this.cdp.send('Page.enable', {}, this.sessionId);
    await this.cdp.send('Runtime.enable', {}, this.sessionId);
    const vp = this.opts.viewport || { width: 1280, height: 800 };
    await this.setViewportSize(vp, this.opts.deviceScaleFactor, this.opts.isMobile);
    if (this.opts.hasTouch) {
      await this.cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true }, this.sessionId);
    }
  }

  async setViewportSize(viewport, deviceScaleFactor, isMobile) {
    this.opts.viewport = viewport;
    const dpr = deviceScaleFactor || this.opts.deviceScaleFactor || 1;
    const mobile = isMobile !== undefined ? !!isMobile : !!this.opts.isMobile;
    await this.cdp.send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: dpr,
      mobile
    }, this.sessionId);
  }

  on(event, fn) {
    if (!this.handlers[event]) this.handlers[event] = [];
    this.handlers[event].push(fn);
  }

  locator(selector) {
    return {
      boundingBox: async () => {
        return this.evaluate(sel => {
          const el = document.querySelector(sel);
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height };
        }, selector);
      }
    };
  }

  async goto(url) {
    if (url.startsWith('file://')) {
      const html = bundleFileUrlHtml(url);
      const tree = await this.cdp.send('Page.getFrameTree', {}, this.sessionId);
      const frameId = tree.frameTree.frame.id;
      await this.cdp.send('Page.setDocumentContent', { frameId, html }, this.sessionId);
    } else {
      await this.cdp.send('Page.navigate', { url }, this.sessionId);
    }
    const deadline = Date.now() + 15000;
    while (Date.now() < deadline) {
      try {
        const r = await this.evaluate(() => document.readyState);
        if (r === 'complete' || r === 'interactive') {
          await this.waitForTimeout(80);
          return;
        }
      } catch (e) {}
      await this.waitForTimeout(40);
    }
  }

  async waitForTimeout(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  async waitForSelector(selector, options = {}) {
    const timeout = options.timeout || 10000;
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      const ok = await this.evaluate(sel => !!document.querySelector(sel), selector);
      if (ok) return true;
      await this.waitForTimeout(40);
    }
    throw new Error('Timeout waiting for selector: ' + selector);
  }

  async click(selector) {
    await this.waitForSelector(selector);
    const info = await this.evaluate(sel => {
      const el = document.querySelector(sel);
      if (!el) return null;
      if (el.scrollIntoView) el.scrollIntoView({ block: 'center', inline: 'center' });
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const isCanvas = el.tagName === 'CANVAS';
      if (!isCanvas) {
        el.click();
        return { clickedDom: true, x: cx, y: cy };
      }
      return { clickedDom: false, x: cx, y: cy };
    }, selector);
    if (!info) throw new Error('Element not found for click: ' + selector);
    if (!info.clickedDom) {
      await this.mouse.click(info.x, info.y);
    }
  }

  async evaluate(pageFunction, ...args) {
    let expr;
    if (typeof pageFunction === 'function') {
      const serializedArgs = args.map(a => JSON.stringify(a)).join(',');
      expr = `(${pageFunction.toString()})(${serializedArgs})`;
    } else {
      expr = String(pageFunction);
    }
    const res = await this.cdp.send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true
    }, this.sessionId);
    if (res.exceptionDetails) {
      const d = res.exceptionDetails;
      const msg = (d.exception && (d.exception.description || d.exception.value)) || d.text || 'Evaluation failed';
      throw new Error(msg);
    }
    return res.result ? res.result.value : undefined;
  }

  async screenshot(options = {}) {
    const res = await this.cdp.send('Page.captureScreenshot', { format: 'png' }, this.sessionId);
    const buf = Buffer.from(res.data, 'base64');
    if (options.path) {
      fs.mkdirSync(path.dirname(options.path), { recursive: true });
      fs.writeFileSync(options.path, buf);
    }
    return buf;
  }
}

class Browser {
  constructor(proc, ws, cdp, userDataDir) {
    this.proc = proc;
    this.ws = ws;
    this.cdp = cdp;
    this.userDataDir = userDataDir;
  }
  async newContext(opts = {}) {
    return {
      newPage: (pOpts = {}) => this.newPage(Object.assign({}, opts, pOpts)),
      close: async () => {}
    };
  }
  async newPage(opts = {}) {
    const { targetId } = await this.cdp.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await this.cdp.send('Target.attachToTarget', { targetId, flatten: true });
    const page = new Page(this.cdp, sessionId, targetId, opts);
    await page._init();
    return page;
  }
  async close() {
    try { this.ws.close(); } catch (e) {}
    if (this.proc) {
      try { process.kill(-this.proc.pid, 'SIGKILL'); } catch (e) {}
      try { this.proc.kill('SIGKILL'); } catch (e) {}
    }
    if (this.userDataDir) {
      try { fs.rmSync(this.userDataDir, { recursive: true, force: true }); } catch (e) {}
    }
  }
}

const chromium = {
  async launch(opts = {}) {
    const exe = findChromiumExecutable();
    const userDataDir = `/tmp/cdp_profile_${process.pid}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    fs.mkdirSync(userDataDir, { recursive: true });
    const args = [
      '--headless',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-pings',
      '--media-router=0',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--remote-debugging-port=0',
      `--user-data-dir=${userDataDir}`,
      'about:blank'
    ];
    const proc = spawn(exe, args, { detached: true, stdio: ['ignore', 'ignore', 'pipe'] });
    const cleanup = () => { try { process.kill(-proc.pid, 'SIGKILL'); } catch (e) {} try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {} };
    process.on('exit', cleanup);
    const wsUrl = await new Promise((resolve, reject) => {
      let stderr = '';
      const timer = setTimeout(() => reject(new Error('Timed out waiting for Chromium DevTools URL: ' + stderr)), 10000);
      proc.stderr.on('data', chunk => {
        stderr += chunk.toString('utf8');
        const m = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
        if (m) {
          clearTimeout(timer);
          resolve(m[1]);
        }
      });
      proc.on('exit', code => {
        clearTimeout(timer);
        reject(new Error(`Chromium exited prematurely with code ${code}: ${stderr}`));
      });
    });
    const ws = new SimpleWebSocket(wsUrl);
    await ws.connect();
    const cdp = new CDPSession(ws);
    return new Browser(proc, ws, cdp, userDataDir);
  }
};

module.exports = { chromium };

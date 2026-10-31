'use strict';
// รวม index.html + css + js ทั้งหมดเป็นไฟล์เดียว: node tools/build_single.js
const fs = require('fs'), path = require('path'); const root = path.join(__dirname, '..');
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
html = html.replace(/<link[^>]+href="(css\/[^"]+)"[^>]*>/g, (m, f) => '<style>\n' + fs.readFileSync(path.join(root, f), 'utf8') + '\n</style>');
html = html.replace(/<script src="([^"]+)"><\/script>/g, (m, f) => '<script>\n/* ' + f + ' */\n' + fs.readFileSync(path.join(root, f), 'utf8').replace(/<\/script/gi, '<\\/script') + '\n</script>');
fs.writeFileSync(path.join(root, 'JianghuSect_single.html'), html); console.log('single file', Math.round(html.length / 1024), 'KB');

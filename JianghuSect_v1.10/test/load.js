'use strict';
const path = require('path');
const root = path.join(__dirname, '..');
['data/data_core.js','data/data_cult.js','data/data_items.js','data/data_bt.js','data/data_cb.js','data/data_cp.js','data/data_tech.js','data/data_beasts.js','data/data_expansion.js','data/data_martial.js','data/data_ecology.js','js/util.js','js/human_core.js','js/world_map.js','js/cultivation.js','js/economy.js','js/sect.js','js/ai.js','js/combat.js','js/expedition.js','js/explore.js','js/bottleneck.js','js/skills.js','js/stats.js','js/cpeco.js','js/external_market.js','js/content.js','js/martial.js','js/proficiency.js','js/knowledge.js','js/retraining.js','js/cognition.js','js/wildlife.js','js/sim.js'].forEach(f => require(path.join(root, f)));
module.exports = globalThis;

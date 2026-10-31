# LEGENDARY_WEAPON_RESEARCH — Jin Yong, Gu Long & Original Legendary Weapons Catalog

**Date**: 2026-10-30  
**Scope**: Literary verification, canonical provenance vs. game adaptation analysis, and mechanical/visual design for the 11 Legendary Weapons added across all 7 supported weapon families (`SWORD`, `BLADE`, `SPEAR`, `STAFF`, `FIST`, `BOW`, `FOCUS`) in `JianghuSect_v1.12`.

---

## 1. Research Methodology & Attribution Policy

1. **Primary Literary Focus**: Per Section 14 of `NEXT_VISITORS_CLUES_LEGENDARY_WEAPONS_PROMPT.txt`, candidates were researched from works by **Jin Yong (金庸)** and **Gu Long (古龙)** first, cross-checked against standard encyclopedic references (Wikipedia Chinese editions for individual weapons, novels, and weapon lists, accessed 2026-10-30).
2. **Strict Separation of Canon vs. Game Adaptation**:
   - **Canonical Novel Fact**: What the novel actually states about the weapon's bearer, physical traits, and origin.
   - **Game Adaptation (`ADAPTATION_FROM_CANON`)**: How the weapon is translated into JianghuSect's native 5-path cultivation system, 12-stat combat model (`hp, atk, matk, def, mdef, crit, critDmg, eva, acc, pen, cast, move`), and bounded passive/proc combat engine (`js/combat.js`, `js/stats.js`).
   - **Original Creation (`ORIGINAL`)**: Where Jin Yong and Gu Long novels do not feature a fitting iconic artifact for a specific game weapon family (such as `BOW` or cultivation `FOCUS`, or a second `FIST` archetype), we explicitly author an original wuxia/xianxia artifact and mark it `ORIGINAL` rather than fabricating a literary citation.

---

## 2. Candidate Evaluation & Selection Matrix (11 Selected, 2 Rejected)

### 2.1 Family: `SWORD` (กระบี่) — 2 Selected

#### 1. `LEG_WPN_YITIAN_SWORD` — กระบี่อิงฟ้าพิฆาตมาร (倚天剑 / Heaven-Reliant Sword)
- **Chinese Name / Transliteration**: 倚天剑 (*Yǐtiān Jiàn* / Heaven-Reliant Sword)
- **Author & Work**: Jin Yong (金庸), *The Heaven Sword and Dragon Saber* (《倚天屠龙记》, 1961)
- **Canonical Bearer & Provenance**: Reforged before the fall of Xiangyang by Guo Jing (郭靖) and Huang Rong (黄蓉) using metal from Yang Guo's Black-Iron Heavy Sword (玄铁重剑) and the Gentleman/Lady Swords (君子剑、淑女剑); passed to their daughter Guo Xiang (郭襄), founder of the Emei Sect (峨眉派), and wielded by Abbess Miejue (灭绝师太) and Zhou Zhiruo (周芷若). Famous for the martial-world adage: 「武林至尊，宝刀屠龙，号令天下，莫敢不从！倚天不出，谁与争锋？」
- **Verified Reference**: [倚天劍 - 維基百科](https://zh.wikipedia.org/zh-tw/%E5%80%9A%E5%A4%A9%E5%8A%8D) & [倚天屠龍記 - 維基百科](https://zh.wikipedia.org/zh-tw/%E5%80%9A%E5%A4%A9%E5%B1%A0%E9%BE%8D%E8%A8%98) (Accessed 2026-10-30).
- **Physical Traits**: Razor-sharp, cold-gleaming pale青-jade/silver blade that cleaves ordinary iron like mud without nicking.
- **Provenance Category**: `ADAPTATION_FROM_CANON`
- **Game Family / Subtype / Tier**: `SWORD` / `celestial_jian` / Tier 7 (`minStage: 5`, `unique: true`)
- **Gameplay Adaptation & Signature Effect**:
  - **Base Identity**: High `atk`, `matk`, `acc`, `crit` (+9%), `pen` (+16%), `cast` (+10).
  - **Signature Combat Effect (`EFX_LEG_YITIAN_SEVER`)**: *คมกระบี่อิงฟ้าตัดเกราะและม่านปราณ* — When striking a shielded or guard-buffed target, shatters 35% of active shield capacity and applies `armorbreak` (`-18% def/mdef` for 8 ticks, ICD 8 ticks). Synergizes with `SWORD_IMMORTAL` and `MIND_SWORD_TELEKINESIS`.
- **Visual Key**: `vis_yitian_sword` (Slender luminous frost-jade blade with gold Emei lotus guard and cyan tassel).

#### 2. `LEG_WPN_XUANTIE_HEAVY_SWORD` — กระบี่เหล็กนิลไร้คม (玄铁重剑 / Black-Iron Heavy Sword)
- **Chinese Name / Transliteration**: 玄铁重剑 (*Xuántiě Zhòngjiàn*)
- **Author & Work**: Jin Yong (金庸), *The Return of the Condor Heroes* (《神雕侠侣》, 1959)
- **Canonical Bearer & Provenance**: Wielded by Sword Demon Dugu Qiubai (独孤求败) before age forty and buried at the Sword Grave (剑冢) with the inscription: 「重剑无锋，大巧不工。四十岁前恃之横行天下。」 Later discovered and wielded by Yang Guo (杨过). Weighs 81 *jin* (or 64 *jin* in later revisions) of deep black meteoric iron with blunt edges and a rounded tip.
- **Verified Reference**: [玄鐵重劍 - 維基百科](https://zh.wikipedia.org/zh-tw/%E7%8E%84%E9%90%B5%E9%87%8D%E5%8A%8D) & [獨孤求敗 - 維基百科](https://zh.wikipedia.org/zh-tw/%E7%8D%A8%E5%AD%A4%E6%B1%82%E6%95%97) (Accessed 2026-10-30).
- **Provenance Category**: `ADAPTATION_FROM_CANON`
- **Game Family / Subtype / Tier**: `SWORD` / `heavy_jian` / Tier 7 (`minStage: 5`, `unique: true`)
- **Gameplay Adaptation & Signature Effect**:
  - **Base Identity**: Massive `atk` and `pen` (+24%) and `def` (+18%), traded against `-8 move` and `-6 cast` (reflecting its immense physical weight). Requires `physiology.strength >= 58` for full efficiency; weaker bearers suffer a movement/cast penalty.
  - **Signature Combat Effect (`EFX_LEG_XUANTIE_CRUSH`)**: *ไร้คมแต่หนักหน่วงดั่งขุนเขา* — Every hit converts physical weight into crushing internal force, dealing `+16%` bonus damage when the bearer's `physiology.strength >= 65` and staggering the target (`slow` for 6 ticks, ICD 10 ticks).
- **Visual Key**: `vis_xuantie_heavy_sword` (Broad, matte-charcoal blunt greatsword with bronze crossguard).

---

### 2.2 Family: `BLADE` (ดาบ / มีดบิน) — 3 Selected

#### 3. `LEG_WPN_TULONG_SABER` — ดาบฆ่ามังกรบัญชาหล้า (屠龙刀 / Dragon-Slaying Saber)
- **Chinese Name / Transliteration**: 屠龙刀 (*Túlóng Dāo*)
- **Author & Work**: Jin Yong (金庸), *The Heaven Sword and Dragon Saber* (《倚天屠龙记》, 1961)
- **Canonical Bearer & Provenance**: Forged alongside the Yitian Sword from Yang Guo's Black-Iron Heavy Sword mingled with western essence gold (西方精金); carried by Golden-Haired Lion King Xie Xun (谢遜) and later Zhang Wuji (张无忌). Weighs over a hundred *jin*, pitch-black with a heavy curved spine.
- **Verified Reference**: [屠龍刀 - 維基百科](https://zh.wikipedia.org/zh-tw/%E5%B1%A0%E9%BE%8D%E5%88%80) (Accessed 2026-10-30).
- **Provenance Category**: `ADAPTATION_FROM_CANON`
- **Game Family / Subtype / Tier**: `BLADE` / `heavy_saber` / Tier 7 (`minStage: 5`, `unique: true`)
- **Gameplay Adaptation & Signature Effect**:
  - **Base Identity**: Supreme physical `atk`, `hp`, `def`, and `critDmg` (+26%).
  - **Signature Combat Effect (`EFX_LEG_TULONG_DECREE`)**: *ราชันศาสตราข่มขวัญยุทธภพ* — On hit or skill cast, emits a dragon-roar shockwave that applies `weaken` (`-15% atk/matk` for 8 ticks) and grants the bearer `morale` (`+12% atk/def` for 8 ticks, ICD 10 ticks).
- **Visual Key**: `vis_tulong_saber` (Massive dark-obsidian dragon-backed broadsaber with golden dragon-head pommel).

#### 4. `LEG_WPN_FULL_MOON_SCIMITAR` — ดาบโค้งจันทร์เพ็ญสะท้อนเงา (圆月弯刀 / Full Moon Scimitar)
- **Chinese Name / Transliteration**: 圆月弯刀 (*Yuányuè Wāndāo*)
- **Author & Work**: Gu Long (古龙), *Full Moon Scimitar* (《圆月弯刀》, 1976–1978)
- **Canonical Bearer & Provenance**: Wielded by Ding Peng (丁鹏) after gaining the Demon Sect's curved blade inheritance; inscribed with the poetic line 「小楼一夜听春雨」 ("In the small pavilion, listening all night to the spring rain").
- **Verified Reference**: [圓月彎刀 - 維基百科](https://zh.wikipedia.org/zh-tw/%E5%9C%93%E6%9C%88%E5%BD%8E%E5%88%80) & [古龍筆下武功列表 - 維基百科](https://zh.wikipedia.org/zh-tw/%E5%8F%A4%E9%BE%8D%E7%AD%86%E4%B8%8B%E6%AD%A6%E5%8A%9F%E5%88%97%E8%A1%A8) (Accessed 2026-10-30).
- **Provenance Category**: `ADAPTATION_FROM_CANON`
- **Game Family / Subtype / Tier**: `BLADE` / `crescent_scimitar` / Tier 6 (`minStage: 4`, `unique: true`)
- **Gameplay Adaptation & Signature Effect**:
  - **Base Identity**: High `atk`, `eva`, `crit` (+11%), `critDmg` (+24%), and `move` (+8).
  - **Signature Combat Effect (`EFX_LEG_MOON_ARC`)**: *จันทร์เสี้ยวฟังพิรุณยามวิกาล* — On critical hit or when fighting at night, unleashes a crescent moon-shadow follow-up (`+18%` bonus damage and `bleed` for 6 ticks, ICD 7 ticks).
- **Visual Key**: `vis_full_moon_scimitar` (Silver-cyan crescent scimitar with moon-ring guard).

#### 5. `LEG_WPN_XIAOLI_HEART_DAGGER` — มีดสั้นเสี่ยวหลี่สะท้านภพ (小李飞刀 / Little Li's Flying Dagger)
- **Chinese Name / Transliteration**: 小李飞刀 (*Xiǎolǐ Fēidāo*)
- **Author & Work**: Gu Long (古龙), *Sentimental Swordsman, Ruthless Sword* (《多情剑客无情剑》, 1969) & *Border-Town Prodigal* (《边城浪子》)
- **Canonical Bearer & Provenance**: Wielded by "Little Li Tanhua" Li Xunhuan (李寻欢) and inherited by Ye Kai (叶开). Ranked 3rd on Bai Xiaosheng's *Weapons Spectrum* (百晓生《兵器谱》), yet undefeated in spirit because it is Forged of ordinary steel by an ordinary smith (three *cun* and seven *fen* long) — its true power is the wielder's focused heart, restraint, and compassion ("例不虚发" — never thrown in vain).
- **Verified Reference**: [小李飛刀 - 維基百科](https://zh.wikipedia.org/zh-tw/%E5%B0%8F%E6%9D%8E%E9%A3%9B%E5%88%80) & [李尋歡 - 維基百科](https://zh.wikipedia.org/zh-tw/%E6%9D%8E%E5%B0%8B%E6%AD%A1) (Accessed 2026-10-30).
- **Provenance Category**: `ADAPTATION_FROM_CANON` (Explicitly adapted as a unique physical dagger token forged and consecrated by a master craftsman; mapped to `gearType: 'BLADE'`, `visualSubtype: 'DAGGER'` so it never misclassifies as `FOCUS`).
- **Game Family / Subtype / Tier**: `BLADE` / `throwing_dagger` / Tier 7 (`minStage: 5`, `unique: true`)
- **Gameplay Adaptation & Signature Effect**:
  - **Base Identity**: Exceptional `acc` (+28%), `crit` (+14%), `critDmg` (+32%), `pen` (+20%), and `cast` (+12).
  - **Signature Combat Effect (`EFX_LEG_XIAOLI_TRUE_STRIKE`)**: *มีดบินไม่เคยพลาดเป้า* — Consumes 4% max Qi on an active skill or critical strike (ICD 9 ticks) to guarantee an un-dodgeable strike (`forced: true`) with `+22%` armor penetration and `expose` (`exposed` for 6 ticks). Separate from `LEG_MANTRA_LITTLE_LI_HEART_BLADE`, though they share a thematic synergy if a practitioner earns both independently.
- **Visual Key**: `vis_xiaoli_dagger` (Compact gleaming silver throwing dagger with crimson silk cord and a restrained golden intent arc).

---

### 2.3 Family: `STAFF` (พลอง) — 1 Selected

#### 6. `LEG_WPN_DAGOU_JADE_STAFF` — พลองหยกเขียวตีสุนัข (打狗棒 / Dog-Beating Staff)
- **Chinese Name / Transliteration**: 打狗棒 (*Dǎgǒu Bàng*)
- **Author & Work**: Jin Yong (金庸), *The Legend of the Condor Heroes* (《射雕英雄传》, 1957), *The Return of the Condor Heroes* (《神雕侠侣》), & * Demi-Gods and Semi-Devils* (《天龙八部》)
- **Canonical Bearer & Provenance**: Sacred symbol of authority of the Beggar Sect Chief (丐帮帮主), wielded by Qiao Feng (乔峰), Hong Qigong (洪七公), and Huang Rong (黄蓉). Crafted of supple, emerald-green bamboo/jade-like material, light yet unbreakable.
- **Verified Reference**: [打狗棒法 - 維基百科](https://zh.wikipedia.org/zh-tw/%E6%89%93%E7%8B%97%E6%A3%92%E6%B3%95) & [金庸筆下兵器列表 - 維基百科](https://zh.wikipedia.org/zh-tw/%E9%87%91%E5%BA%B8%E7%AD%86%E4%B8%8B%E5%85%B5%E5%99%A8%E5%88%97%E8%A1%A8) (Accessed 2026-10-30).
- **Provenance Category**: `ADAPTATION_FROM_CANON`
- **Game Family / Subtype / Tier**: `STAFF` / `jade_bamboo_staff` / Tier 6 (`minStage: 4`, `unique: true`)
- **Gameplay Adaptation & Signature Effect**:
  - **Base Identity**: High `def` (+20%), `eva` (+18%), `acc` (+16%), `atk`, and `move` (+10).
  - **Signature Combat Effect (`EFX_LEG_DAGOU_REDIRECTION`)**: *พลองหยกแปดเคล็ดพันสกัด* — Grants a bounded counter-trip proc (`onStruck`, ICD 8 ticks) that trips/slows the attacker (`slow` for 7 ticks) and grants the bearer `counter` or `evadeUp` for 6 ticks.
- **Visual Key**: `vis_dagou_jade_staff` (Translucent emerald-jade bamboo staff with segmented nodes and brass caps).

---

### 2.4 Family: `SPEAR` (หอก / ทวน) — 2 Selected

#### 7. `LEG_WPN_OVERLORD_SPEAR` — ทวนราชันย์พิชิตพยัคฆ์ (霸王枪 / Overlord Spear)
- **Chinese Name / Transliteration**: 霸王枪 (*Bàwáng Qiāng*)
- **Author & Work**: Gu Long (古龙), *The Overlord Spear* (《霸王枪》, 1974–1975, Fifth of the *Seven Weapons* 《七种武器》 series)
- **Canonical Bearer & Provenance**: Wielded by Wang Wanwu (王万物) and his daughter Wang Daxiaojie (王大小姐), and faced by Ding Xi (丁喜) and Baili Changqing (百里长青). The spear is 1 *zhang*, 3 *chi*, 7 *cun*, and 3 *fen* long, weighing 73 *jin* 8 *liang* of gleaming steel; in Gu Long's *Seven Weapons* philosophy, the true meaning of the Overlord Spear is **Courage (勇气)** — the courage to face overwhelming odds.
- **Verified Reference**: [霸王槍 - 維基百科](https://zh.wikipedia.org/zh-tw/%E9%9C%B8%E7%8E%8B%E6%A7%8D) & [七種武器 - 維基百科](https://zh.wikipedia.org/zh-tw/%E4%B8%83%E7%A7%8D%E6%AD%A6%E5%99%A8) (Accessed 2026-10-30).
- **Provenance Category**: `ADAPTATION_FROM_CANON`
- **Game Family / Subtype / Tier**: `SPEAR` / `cavalry_great_spear` / Tier 6 (`minStage: 4`, `unique: true`)
- **Gameplay Adaptation & Signature Effect**:
  - **Base Identity**: High `atk`, `pen` (+22%), `acc`, and `critDmg` (+20%).
  - **Signature Combat Effect (`EFX_LEG_OVERLORD_COURAGE`)**: *ทวนราชันย์คือความกล้าหาญ* — Scales with `personality.courage` (and grants `+15%` damage when fighting an enemy with higher combat power or when outnumbered), piercing enemy `def` and restoring 4% stamina/qi on hit (ICD 8 ticks).
- **Visual Key**: `vis_overlord_spear` (Long silver-steel halberd-spear with a blazing crimson horsehair tassel and gold dragon collar).

#### 8. `LEG_WPN_OATHBREAKER_DRAGON_LANCE` — ทวนเกล็ดมังกรครามสัตย์สาบาน (苍龙誓约枪 / Azure Dragon Oath Lance)
- **Provenance Category**: `ORIGINAL` (Created to provide a Tier-7 Divine/Body `SPEAR` counterpart for `GOD` / `WAR_DEITY` / `BLOOD_DRAGON` cultivators).
- **Game Family / Subtype / Tier**: `SPEAR` / `dragon_lance` / Tier 7 (`minStage: 5`, `unique: true`)
- **Gameplay Adaptation & Signature Effect**:
  - **Base Identity**: Balanced high `atk`, `matk`, `def`, `mdef`, and `pen` (+18%).
  - **Signature Combat Effect (`EFX_LEG_DRAGON_LANCE_WARD`)**: *คมทวนมังกรครามพิทักษ์สัตย์* — On skill cast or hit (ICD 9 ticks), forms a protective dragon-scale barrier (`shield` equal to 12% max HP for 8 ticks) and deals bonus lightning/spirit pierce damage.
- **Visual Key**: `vis_azure_dragon_lance` (Coiled azure-gold dragon spear with twin crescent side-blades).

---

### 2.5 Family: `FIST` (สนับหมัด / กรงเล็บ) — 1 Selected

#### 9. `LEG_WPN_WRATHFUL_TIGER_GAUNTLETS` — สนับหมัดพยัคฆ์พิโรธสะท้านผา (愤怒铁拳套 / Wrathful Tiger Gauntlets)
- **Literary Inspiration & Provenance**: Inspired by Gu Long's *Fist* / *The Angry Little Horse* (《拳头》 / 《愤怒的小马》, 1975, spin-off of *Overlord Spear* set at Mount Lang 狼山, protagonist Xiao Ma 小马, where the true strength behind the fist is loyalty to friends and unyielding resolve), adapted as a tangible pair of meteoric-iron and tiger-tendon gauntlets (`ADAPTATION_FROM_CANON` / `ORIGINAL` hybrid).
- **Verified Reference**: [拳頭 (小說) - 維基百科](https://zh.wikipedia.org/zh-hans/%E6%8B%B3%E9%A0%AD_(%E5%B0%8F%E8%AA%AC)) & [七種武器 - 維基百科](https://zh.wikipedia.org/zh-tw/%E4%B8%83%E7%A7%8D%E6%AD%A6%E5%99%A8) (Accessed 2026-10-30).
- **Game Family / Subtype / Tier**: `FIST` / `heavy_gauntlets` / Tier 6 (`minStage: 4`, `unique: true`)
- **Gameplay Adaptation & Signature Effect**:
  - **Base Identity**: High `atk`, `cast` (+14), `crit` (+8%), `def`, and `hp`.
  - **Signature Combat Effect (`EFX_LEG_TIGER_FIST_RESOLVE`)**: *หมัดเหล็กพิทักษ์สหาย* — As the bearer's HP drops below 70% or when fighting alongside allies, grants surging counter-force (`+16% atk`, restores 5% HP on hit, ICD 8 ticks).
- **Visual Key**: `vis_wrathful_tiger_gauntlets` (Crimson-and-gold armored tiger-claw bracers with amber qi knuckles).

---

### 2.6 Family: `BOW` (ธนู) — 1 Selected

#### 10. `LEG_WPN_CONDOR_METEOR_BOW` — ธนูเหล็กไหลยิงอินทรีคู่ (射雕陨铁神弓 / Condor-Shooting Meteor Bow)
- **Literary Inspiration & Provenance**: Inspired by Jin Yong's *The Legend of the Condor Heroes* (《射雕英雄传》, 1957), where Guo Jing (郭靖), trained by哲别 (Jebe) on the Mongolian steppe, draws a heavy horn-and-iron warbow to loose a single arrow piercing two vultures/eagles (一箭双雕). Because Guo Jing's bow in the novel is a masterwork steppe warbow rather than a named supernatural artifact, this weapon is explicitly labeled **`ADAPTATION_FROM_CANON` / `ORIGINAL`** elevated into a Tier-6 legendary bow forged from steppe horn and meteoric iron (`MAT_ORE_METEOR_IRON_5`).
- **Verified Reference**: [射鵰英雄傳 - 維基百科](https://zh.wikipedia.org/zh-tw/%E5%B0%84%E9%B5%B0%E8%8B%B1%E9%9B%84%E5%82%B3) (Accessed 2026-10-30).
- **Game Family / Subtype / Tier**: `BOW` / `warbow` / Tier 6 (`minStage: 4`, `unique: true`)
- **Gameplay Adaptation & Signature Effect**:
  - **Base Identity**: High `atk`, `acc` (+26%), `crit` (+10%), `critDmg` (+22%), and `pen` (+15%).
  - **Signature Combat Effect (`EFX_LEG_TWIN_CONDOR_SHOT`)**: *ศรเดียวทะลวงอินทรีคู่* — On hit or skill cast (ICD 8 ticks), fires a secondary wind-splitting arrow that hits a second nearby enemy (or pierces the primary target for `+20%` damage if single-target) and applies `armorbreak`.
- **Visual Key**: `vis_condor_meteor_bow` (Recurve black-iron and golden-horn warbow with glowing cyan wind-string).

---

### 2.7 Family: `FOCUS` (สื่อปราณ) — 1 Selected

#### 11. `LEG_WPN_PEACOCK_PLUME_FOCUS` — ขนนกยูงทองคำกลไกสวรรค์ (孔雀翎 / Peacock Plume)
- **Chinese Name / Transliteration**: 孔雀翎 (*Kǒngquè Líng*)
- **Author & Work**: Gu Long (古龙), *The Peacock Plume* (《孔雀翎》, 1974, Second of the *Seven Weapons* 《七种武器》 series)
- **Canonical Bearer & Provenance**: Supreme treasure of Peacock Villa (孔雀山庄), handed down by the Qiu family (秋凤梧 / 小武) and lent to Gao Li (高立). Externally a pure gold cylinder with two triggers; when activated, it dazzles like a peacock spreading its tail feathers before unleashing unavoidable needles. In the novel's finale, the real Peacock Plume had already been lost years earlier — revealing that its true power is **Confidence (信心)**.
- **Verified Reference**: [孔雀翎 - 維基百科](https://zh.wikipedia.org/zh-tw/%E5%AD%94%E9%9B%80%E7%BF%8E) & [七種武器 - 維基百科](https://zh.wikipedia.org/zh-tw/%E4%B8%83%E7%A7%8D%E6%AD%A6%E5%99%A8) (Accessed 2026-10-30).
- **Provenance Category**: `ADAPTATION_FROM_CANON` (Mapped to `gearType: 'FOCUS'`, `visualSubtype: 'PEACOCK_CYLINDER'`, as an intricate golden qi-mechanism focus that channels spiritual/mental precision and confidence).
- **Game Family / Subtype / Tier**: `FOCUS` / `golden_plume_cylinder` / Tier 7 (`minStage: 5`, `unique: true`)
- **Gameplay Adaptation & Signature Effect**:
  - **Base Identity**: High `matk`, `acc` (+25%), `cast` (+16), `crit` (+12%), and `mdef` (+16%).
  - **Signature Combat Effect (`EFX_LEG_PEACOCK_RADIANCE`)**: *ขนนกยูงรำแพนคือความเชื่อมั่น* — Grants the bearer unwavering focus (reduces `heartDemon` and `fear`, grants `morale`), and on skill cast (ICD 10 ticks) unleashes an iridescent fan of qi needles (`blind` / `-eva` on target + bonus `matk` burst).
- **Visual Key**: `vis_peacock_plume_focus` (Floating golden cylinder with an iridescent emerald-and-sapphire peacock-feather aura fan).

---

## 3. Candidates Evaluated and Rejected / Deferred

| Candidate | Author / Work | Reason for Rejection / Deferral |
|---|---|---|
| **Golden Serpent Sword (金蛇剑)** | Jin Yong, *Sword Stained with Royal Blood* (《碧血剑》) | Already well-covered by `SWORD` having both the precision/shield-breaking `LEG_WPN_YITIAN_SWORD` and heavy/armor-crushing `LEG_WPN_XUANTIE_HEAVY_SWORD`. Avoiding weapon-family bloat per Section 15 ("One strong distinctive original is better than three renamed stat sticks"). |
| **Tear-Stained Sword (泪痕剑) / Box of No Tears (一口箱子)** | Gu Long, *Heroes Shed No Tears* (《英雄无泪》) | Overlaps mechanically with `LEG_WPN_PEACOCK_PLUME_FOCUS` (hidden mechanism box) and `LEG_WPN_YITIAN_SWORD`. |

---

## 4. Summary of Family Coverage (11 Legendary Weapons across 7 Families)

| Weapon Family (`gearType`) | Count | Implemented Item IDs | Tiers |
|---|---|---|---|
| **`SWORD` (กระบี่)** | 2 | `LEG_WPN_YITIAN_SWORD`, `LEG_WPN_XUANTIE_HEAVY_SWORD` | T7, T7 |
| **`BLADE` (ดาบ / มีดบิน)** | 3 | `LEG_WPN_TULONG_SABER`, `LEG_WPN_FULL_MOON_SCIMITAR`, `LEG_WPN_XIAOLI_HEART_DAGGER` | T7, T6, T7 |
| **`SPEAR` (หอก / ทวน)** | 2 | `LEG_WPN_OVERLORD_SPEAR`, `LEG_WPN_OATHBREAKER_DRAGON_LANCE` | T6, T7 |
| **`STAFF` (พลอง)** | 1 | `LEG_WPN_DAGOU_JADE_STAFF` | T6 |
| **`FIST` (สนับหมัด)** | 1 | `LEG_WPN_WRATHFUL_TIGER_GAUNTLETS` | T6 |
| **`BOW` (ธนู)** | 1 | `LEG_WPN_CONDOR_METEOR_BOW` | T6 |
| **`FOCUS` (สื่อปราณ)** | 1 | `LEG_WPN_PEACOCK_PLUME_FOCUS` | T7 |
| **Total** | **11** | **11 Unique Legendary Weapons** | **5 × T6, 6 × T7** |

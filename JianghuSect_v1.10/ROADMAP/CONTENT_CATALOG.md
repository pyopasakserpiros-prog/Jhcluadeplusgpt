# Content catalogue — v1.10.0

Counts computed from loaded registries:3 major paths,27 specializations,249 techniques +47 mantras,86 materials,134 recipes,72 base named items,25 beasts. This patch adds3 specializations,9 manuals,25 ingredients,8 recipes (3 premium medicines /5 equipment),5 matched beasts,4 regions. See CONTENT_COUNTS.json.

## Regions

| ID | Name | Danger / days | Min party power | Resources | Formula/manual routes |
|---|---|---|---|---|---|
| SRC110_MW_ENV_01_ANCIENT_CANOPY | พงไพรบรรพกาลเร้นเมฆา | 1 / 3 | 30 | 13 | 4/4 |
| SRC110_MW_ENV_03_FROZEN_HIGHLANDS | ทุ่งทุนดราเหมันต์เก้าชั้นฟ้า | 2 / 5 | 90 | 1 | 1/2 |
| SRC110_MW_ENV_04_VOLCANIC_CALDERA | แอ่งอัคคีหินหนืดผลาญฟ้า | 3 / 6 | 160 | 5 | 2/1 |
| SRC110_MW_ENV_11_CELESTIAL_GARDEN_RUINS | ซากอุทยานสวรรค์ร่วงหล่น | 3 / 7 | 200 | 6 | 1/2 |

Shared resources have cap24/renew3perday at tier1 and cap12/renew1perday above. Hunting requires a matching defeated creature. Gatherers avoid hunt-only sites. Forest supplies basics, frozen supplies warm goat blood/frost manuals, volcano supplies fire medicine/talisman inputs, ruins supply formation media/advanced manuals. Cross-region dependencies encourage tradeoffs.

## Recipes

| ID | Output | Craft | Tier / mastery | Inputs | Native slot |
|---|---|---|---|---|---|
| SRC110_MW_REC_001 | โอสถหมอกม่วงสมานชีพจร | ALCHEMY | 1/22 | รากโสมหมอกม่วงซ่อนปราณ ×2, หญ้าน้ำค้างหยกขาว ×1, เขี้ยวโค้งงูไม้หนาม ×1 | — |
| SRC110_MW_REC_005 | โอสถถั่งเช่าหนอนศิลา | ALCHEMY | 2/34 | เห็ดถั่งเช่าหนอนศิลา ×2, รากบัวศิลาต้านพิษ ×1, เลือดอุ่นแพะภูผาหิมะ ×1 | — |
| SRC110_MW_REC_006 | โอสถขิงเพลิงขับเหมันต์ | ALCHEMY | 2/35 | รากขิงเพลิงหินผา ×2, พริกไทยอัคคีลมกรด ×1, น้ำพุร้อนกำมะถันล้างไขกระดูก ×1 | — |
| SRC110_MW_REC_021 | ดาบเหล็กสนิมเลือดเขี้ยวงู | FORGING | 1/22 | ก้อนแร่เหล็กสนิมเลือดดิบ ×2, ไม้แก่นเหล็กพันปี ×1, เขี้ยวโค้งงูไม้หนาม ×2 | WEAPON |
| SRC110_MW_REC_022 | เกราะสนับแขนปูศิลาลำธาร | FORGING | 1/24 | หินชนวนหยกเทาแผ่นเรียบ ×2, กระดองปูศิลาลำธาร ×2, หนังกบหมอกพิษลายจุด ×1 | ARMOR |
| SRC110_MW_REC_044 | พู่กันขนเมฆาไผ่หยก | TALISMAN | 1/22 | ขนหางกระรอกบินเมฆา ×2, ผงเขม่าสนดำพันปี ×1, ไม้ไผ่หยกกลวงสื่อเสียง ×1 | ACCESSORY |
| SRC110_MW_REC_045 | ชุดยันต์อัคคีกำมะถันสะท้อนแสง | TALISMAN | 2/34 | แร่กำมะถันเพลิงเหลือง ×2, แร่ไมกาเกล็ดเงินสะท้อนแสง ×1, ขี้ผึ้งอสูรหยกผนึกปราณ ×1, กระดาษยันต์เยื่อไผ่หยก ×2 | WEAPON |
| SRC110_MW_REC_048 | จานค่ายกลแปดทิศอสนีพิทักษ์ | ARRAY | 3/48 | จานศิลาแปดทิศหยินหยาง ×1, เกลือสายฟ้าสีคราม ×2, แผ่นธงอาคมผ้าไหมคราม ×2, ผลึกควอตซ์ม่วงสะกดวิญญาณ ×1 | ACCESSORY |

Discovery, sect recipe tier and facilities gate production; supervised action tolerance is skill+20≥minMastery. Source TALISMAN_VESSEL uses native gear-slot inference: balanced talismans become ACCESSORY; offensive fire talisman becomes WEAPON. Unsupported source craft/study/foundation effects remain metadata.

## Combat manuals

| ID | Name | Path / specialization | Required stage | Behavior |
|---|---|---|---|---|
| SRC110_NW_ART_002 | เพลงกระบี่สายฝนพรำเจ็ดก้าว | XIAN/SWORD_IMMORTAL | 1 | flurry / ดินโลหะ |
| SRC110_NW_ART_047 | ดัชนีเข็มวิญญาณสะกดขวัญ | XIAN/PHANTOM_SOUL | 2 | control / หยินเงา |
| SRC110_NW_ART_075 | หมัดพยัคฆ์ลงจากขุนเขา | BODY/TIGER_SOVEREIGN | 1 | flurry / ดินโลหะ |
| SRC110_NW_ART_083 | หมัดเกล็ดมังกรทลายคลื่น | BODY/BLOOD_DRAGON | 1 | pierce / น้ำแข็ง |
| SRC110_NW_ART_126 | เพลงทวนเทพสงครามฝ่าทัพ | GOD/WAR_DEITY | 2 | sweep / ดินโลหะ |
| SRC110_NW_ART_146 | กระบวนท่าโซ่ตรวนยมทูตล่ามวิญญาณ | GOD/UNDERWORLD_JUDGE | 2 | control / หยินเงา |
| SRC110_ART_V112_XIAN_MOON_MIRROR_T3 | เคล็ดกระจกน้ำแข็งสะท้อนจันทร์ | XIAN/FROST_MOON_IMMORTAL | 2 | counter / น้ำแข็ง |
| SRC110_ART_V112_BODY_IRONWOOD_BARK_T3 | เคล็ดเกราะไม้ตะเคียนเหล็กพันปี | BODY/WOOD_SPRING_BODY | 2 | guard / พฤกษา |
| SRC110_ART_V112_GOD_LOTUS_SANCTUARY_T3 | เคล็ดฉัตรดอกบัวทองคุ้มภัย | GOD/MEDICINE_BODHI_GOD | 2 | guard / หยางแสง |

Imported manuals are absent from starting curriculum/prelearned NPCs. Discovery can be retained privately or donated; accepted manuals require actual library ownership plus rank/stage/subpath/CP gates.

## Ingredients

| ID | Name | Category / tier | Value | Region |
|---|---|---|---|---|
| SRC110_MW_MAT_BP_141 | เขี้ยวโค้งงูไม้หนาม | BEAST_PART/1 | 6 | forest |
| SRC110_MW_MAT_BP_142 | กระดองปูศิลาลำธาร | BEAST_PART/1 | 6 | forest |
| SRC110_MW_MAT_BP_143 | ขนหางกระรอกบินเมฆา | BEAST_PART/1 | 6 | forest |
| SRC110_MW_MAT_BP_145 | หนังกบหมอกพิษลายจุด | BEAST_PART/1 | 6 | forest |
| SRC110_MW_MAT_BP_153 | เลือดอุ่นแพะภูผาหิมะ | BEAST_PART/2 | 10 | frozen |
| SRC110_MW_MAT_EXO_101 | ไม้แก่นเหล็กพันปี | HERB/2 | 10 | forest |
| SRC110_MW_MAT_EXO_102 | ไม้ไผ่หยกกลวงสื่อเสียง | HERB/2 | 10 | forest |
| SRC110_MW_MAT_EXO_111 | ขี้ผึ้งอสูรหยกผนึกปราณ | TALISMAN_MAT/2 | 10 | forest |
| SRC110_MW_MAT_EXO_117 | น้ำพุร้อนกำมะถันล้างไขกระดูก | SPIRIT_LIQUID/2 | 10 | volcano |
| SRC110_MW_MAT_EXO_125 | เกลือสายฟ้าสีคราม | ORE/3 | 17 | ruins |
| SRC110_MW_MAT_EXO_126 | ผงเขม่าสนดำพันปี | TALISMAN_MAT/2 | 10 | forest |
| SRC110_MW_MAT_EXO_130 | แผ่นธงอาคมผ้าไหมคราม | ORE/2 | 10 | ruins |
| SRC110_MW_MAT_EXO_131 | จานศิลาแปดทิศหยินหยาง | ORE/3 | 17 | ruins |
| SRC110_MW_MAT_HERB_001 | รากโสมหมอกม่วงซ่อนปราณ | HERB/1 | 6 | forest |
| SRC110_MW_MAT_HERB_008 | เห็ดถั่งเช่าหนอนศิลา | HERB/2 | 10 | forest |
| SRC110_MW_MAT_HERB_010 | รากขิงเพลิงหินผา | HERB/2 | 10 | volcano |
| SRC110_MW_MAT_HERB_050 | หญ้าน้ำค้างหยกขาว | HERB/1 | 6 | forest |
| SRC110_MW_MAT_HERB_051 | รากบัวศิลาต้านพิษ | HERB/2 | 10 | forest |
| SRC110_MW_MAT_HERB_052 | พริกไทยอัคคีลมกรด | HERB/2 | 10 | volcano |
| SRC110_MW_MAT_ORE_056 | ก้อนแร่เหล็กสนิมเลือดดิบ | ORE/1 | 6 | ruins |
| SRC110_MW_MAT_ORE_058 | หินชนวนหยกเทาแผ่นเรียบ | ORE/1 | 6 | ruins |
| SRC110_MW_MAT_ORE_067 | ผลึกควอตซ์ม่วงสะกดวิญญาณ | CRYSTAL/3 | 17 | ruins |
| SRC110_MW_MAT_ORE_086 | แร่กำมะถันเพลิงเหลือง | ORE/2 | 10 | volcano |
| SRC110_MW_MAT_ORE_087 | แร่ไมกาเกล็ดเงินสะท้อนแสง | ORE/2 | 10 | volcano |
| SRC110_NW_MAT_191 | กระดาษยันต์เยื่อไผ่หยก | TALISMAN_MAT/1 | 6 | forest |

## Matched creatures

| ID | Name | Native power | Active drops |
|---|---|---|---|
| SRC110_MW_BEAST_001 | งูไม้หนามพรางใบ | 95 | SRC110_MW_MAT_BP_141 |
| SRC110_MW_BEAST_002 | กระรอกบินหางเมฆา | 105 | SRC110_MW_MAT_BP_143 |
| SRC110_MW_BEAST_010 | กบหมอกพิษลายจุดเจ็ดสี | 114 | SRC110_MW_MAT_BP_145 |
| SRC110_MW_BEAST_013 | หอยทากศิลาพิษกลืนแร่ | 209 | SRC110_MW_MAT_BP_142 |
| SRC110_MW_BEAST_018 | แพะภูผาหิมะเขาเกลียว | 209 | SRC110_MW_MAT_BP_153 |

Stable IDs and source original paths/effect exclusions are listed in SOURCE_REFERENCE/migration/mapping.json. Complete baseline content remains in data/data_*.js; unported source content remains in SOURCE_REFERENCE.

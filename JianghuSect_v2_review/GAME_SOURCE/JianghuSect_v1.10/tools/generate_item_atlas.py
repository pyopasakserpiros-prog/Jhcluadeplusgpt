#!/usr/bin/env python3
"""
Generate a coherent 8x8 (64-cell, 512x512px, 64x64px per cell) Wuxia Item Icon Sprite Atlas
(`assets/wuxia_item_atlas.png`) and exact metadata (`docs/ITEM_ICON_ATLAS_MAP.json`).

Guarantees:
- Regular 8x8 grid, 64x64px per cell.
- 4px transparent margin on all 4 sides of every cell (all artwork strictly inside [4..59, 4..59]).
- Zero boundary overlap across all 64 cells, verified programmatically before saving.
- Every existing legendary weapon (11) and every existing legendary technique (22) has its own
  distinct, recognizable icon cell (cells 0..32).
- Ordinary items reuse cells 33..61 by real item properties (pill effects, weapon family, armor slot,
  material family, manual/crystal/recipe type, provisions/currency).
- Cells 62 and 63 provide obvious graceful fallbacks for unknown legendary items and unknown generic items.
"""
import os
import json
import math
import base64
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(ROOT, "assets")
DOCS_DIR = os.path.join(ROOT, "docs")
os.makedirs(ASSETS_DIR, exist_ok=True)
os.makedirs(DOCS_DIR, exist_ok=True)

CELL_SIZE = 64
COLS = 8
ROWS = 9
ATLAS_W = CELL_SIZE * COLS
ATLAS_H = CELL_SIZE * ROWS
PAD = 5  # Artwork strictly inside [5..58] so [0..3] and [60..63] are 100% transparent

CELL_DEFS = [
    # 0..10: 11 Legendary Weapons
    {"cell": 0,  "key": "LEG_WPN_YITIAN_SWORD",            "group": "legendary_weapon", "shape": "sword",     "primary": "#7fd8ff", "secondary": "#e6f9ff", "accent": "#ffd966", "motif": "star_halo"},
    {"cell": 1,  "key": "LEG_WPN_XUANTIE_HEAVY_SWORD",     "group": "legendary_weapon", "shape": "greatsword","primary": "#4a5262", "secondary": "#8c96a8", "accent": "#ff8552", "motif": "heavy_waves"},
    {"cell": 2,  "key": "LEG_WPN_TULONG_SABER",            "group": "legendary_weapon", "shape": "saber",     "primary": "#ff6b3d", "secondary": "#ffd166", "accent": "#fff0b3", "motif": "dragon_flame"},
    {"cell": 3,  "key": "LEG_WPN_FULL_MOON_SCIMITAR",      "group": "legendary_weapon", "shape": "scimitar",  "primary": "#c7b8ff", "secondary": "#f3efff", "accent": "#7ce0ff", "motif": "full_moon"},
    {"cell": 4,  "key": "LEG_WPN_XIAOLI_HEART_DAGGER",     "group": "legendary_weapon", "shape": "dagger",    "primary": "#ff5c77", "secondary": "#ffe3e8", "accent": "#ffd166", "motif": "heart_ray"},
    {"cell": 5,  "key": "LEG_WPN_DAGOU_JADE_STAFF",        "group": "legendary_weapon", "shape": "staff",     "primary": "#3ddc97", "secondary": "#b8f7d4", "accent": "#ffd966", "motif": "bamboo_rings"},
    {"cell": 6,  "key": "LEG_WPN_OVERLORD_SPEAR",          "group": "legendary_weapon", "shape": "spear",     "primary": "#e63946", "secondary": "#ffd166", "accent": "#ffffff", "motif": "crimson_tassel"},
    {"cell": 7,  "key": "LEG_WPN_OATHBREAKER_DRAGON_LANCE","group": "legendary_weapon", "shape": "lance",     "primary": "#5e9eff", "secondary": "#d6e6ff", "accent": "#ffd166", "motif": "lightning_dragon"},
    {"cell": 8,  "key": "LEG_WPN_WRATHFUL_TIGER_GAUNTLETS","group": "legendary_weapon", "shape": "gauntlet",  "primary": "#f4a261", "secondary": "#ffe5b4", "accent": "#e63946", "motif": "tiger_claws"},
    {"cell": 9,  "key": "LEG_WPN_CONDOR_METEOR_BOW",       "group": "legendary_weapon", "shape": "bow",       "primary": "#ffd166", "secondary": "#fff3b0", "accent": "#ff5c77", "motif": "meteor_arrow"},
    {"cell": 10, "key": "LEG_WPN_PEACOCK_PLUME_FOCUS",     "group": "legendary_weapon", "shape": "fan_tube",  "primary": "#2ec4b6", "secondary": "#cbf3f0", "accent": "#ffd166", "motif": "peacock_eye"},

    # 11..32: 22 Legendary Techniques
    {"cell": 11, "key": "LEG_MANTRA_TAIXUAN_SCRIPTURE",       "group": "legendary_tech", "shape": "stele_scroll", "primary": "#7fd8ff", "secondary": "#e0f7ff", "accent": "#ffd166", "motif": "runes"},
    {"cell": 12, "key": "LEG_MANTRA_SIX_MERIDIAN_QI",         "group": "legendary_tech", "shape": "tome_scroll",  "primary": "#5ec2ff", "secondary": "#ffffff", "accent": "#ffd166", "motif": "six_beams"},
    {"cell": 13, "key": "LEG_MANTRA_DRAGON_ELEPHANT_PRAJNA",  "group": "legendary_tech", "shape": "tome_scroll",  "primary": "#f4a261", "secondary": "#ffe8cc", "accent": "#ffd166", "motif": "gold_wheel"},
    {"cell": 14, "key": "LEG_MANTRA_DIAMOND_INDESTRUCTIBLE",  "group": "legendary_tech", "shape": "tome_scroll",  "primary": "#ffd166", "secondary": "#fff7d6", "accent": "#ff9f1c", "motif": "vajra_shield"},
    {"cell": 15, "key": "LEG_MANTRA_EIGHT_DESOLATIONS_GOD",   "group": "legendary_tech", "shape": "tome_scroll",  "primary": "#ff758f", "secondary": "#ffe0e6", "accent": "#ffd166", "motif": "sun_octagon"},
    {"cell": 16, "key": "LEG_MANTRA_CELESTIAL_MANDATE_CANON", "group": "legendary_tech", "shape": "jade_tablet",  "primary": "#a882ff", "secondary": "#efe8ff", "accent": "#ffd166", "motif": "heaven_seal"},
    {"cell": 17, "key": "LEG_MANTRA_ASHURA_BLOOD_SEA",        "group": "legendary_tech", "shape": "tome_scroll",  "primary": "#d90429", "secondary": "#ff8fa3", "accent": "#ffd166", "motif": "blood_wave"},
    {"cell": 18, "key": "LEG_MANTRA_TEN_THOUSAND_GU_MONARCH", "group": "legendary_tech", "shape": "tome_scroll",  "primary": "#70e000", "secondary": "#ccff33", "accent": "#9d4edd", "motif": "venom_crest"},
    {"cell": 19, "key": "LEG_MANTRA_NINE_YIN_SOUL_MIRROR",    "group": "legendary_tech", "shape": "mirror_tome",  "primary": "#9d4edd", "secondary": "#e0aaff", "accent": "#7fd8ff", "motif": "crescent_eye"},
    {"cell": 20, "key": "LEG_MANTRA_LITTLE_LI_HEART_BLADE",   "group": "legendary_tech", "shape": "jade_tablet",  "primary": "#ff4d6d", "secondary": "#ffccd5", "accent": "#ffd166", "motif": "blade_heart"},
    {"cell": 21, "key": "LEG_COMBAT_DUGU_NINE_SWORDS",        "group": "legendary_tech", "shape": "combat_manual","primary": "#4ea8de", "secondary": "#caf0f8", "accent": "#ffd166", "motif": "nine_swords"},
    {"cell": 22, "key": "LEG_COMBAT_DRAGON_SUBDUING_PALMS",   "group": "legendary_tech", "shape": "combat_manual","primary": "#ff9f1c", "secondary": "#ffbf69", "accent": "#fff3b0", "motif": "palm_dragon"},
    {"cell": 23, "key": "LEG_COMBAT_FEIXIAN_ONE_SWORD",       "group": "legendary_tech", "shape": "combat_manual","primary": "#72efdd", "secondary": "#ffffff", "accent": "#ffd166", "motif": "sky_sword"},
    {"cell": 24, "key": "LEG_AUX_QIANKUN_SHIFT",              "group": "legendary_tech", "shape": "diagram_scroll","primary": "#b5179e", "secondary": "#f72585", "accent": "#ffd166", "motif": "yinyang_orbit"},
    {"cell": 25, "key": "LEG_AUX_LINGXI_ONE_FINGER",          "group": "legendary_tech", "shape": "diagram_scroll","primary": "#ffd166", "secondary": "#fff3b0", "accent": "#ff4d6d", "motif": "phoenix_wings"},
    {"cell": 26, "key": "LEG_LIGHT_LINGBO_STEP",              "group": "legendary_tech", "shape": "cloud_scroll", "primary": "#48cae4", "secondary": "#caf0f8", "accent": "#ffffff", "motif": "lotus_ripples"},
    {"cell": 27, "key": "LEG_LIGHT_MOON_BAT_SHADOW",          "group": "legendary_tech", "shape": "cloud_scroll", "primary": "#5a189a", "secondary": "#c77dff", "accent": "#e0aaff", "motif": "bat_moon"},
    {"cell": 28, "key": "LEG_FORB_STAR_ABSORBING_VORTEX",     "group": "legendary_tech", "shape": "forbidden_tome","primary": "#3a0ca3", "secondary": "#4cc9f0", "accent": "#f72585", "motif": "dark_vortex"},
    {"cell": 29, "key": "LEG_FORB_BLOOD_LOTUS_SACRIFICE",     "group": "legendary_tech", "shape": "forbidden_tome","primary": "#9b0000", "secondary": "#ff4d6d", "accent": "#ffd166", "motif": "crimson_lotus"},
    {"cell": 30, "key": "LEG_PASS_MINGYU_IMMORTAL_QI",        "group": "legendary_tech", "shape": "jade_disc",    "primary": "#80ffdb", "secondary": "#e8fff9", "accent": "#72efdd", "motif": "ice_lotus"},
    {"cell": 31, "key": "LEG_PASS_NINE_YANG_MERIDIAN",        "group": "legendary_tech", "shape": "jade_disc",    "primary": "#ff6d00", "secondary": "#ffba08", "accent": "#fff3b0", "motif": "nine_suns"},
    {"cell": 32, "key": "LEG_PASS_DUGU_SWORD_HEART",          "group": "legendary_tech", "shape": "jade_disc",    "primary": "#64dfdf", "secondary": "#ffffff", "accent": "#ffd166", "motif": "sword_heart"},

    # 33..38: 6 Pill Variants (by real effect / property)
    {"cell": 33, "key": "PILL_HEAL_RED",       "group": "pill", "shape": "pill_gourd", "primary": "#e63946", "secondary": "#ffb3c1", "accent": "#ffd166", "motif": "vital_cross"},
    {"cell": 34, "key": "PILL_QI_AZURE",       "group": "pill", "shape": "pill_orb",   "primary": "#3a86ff", "secondary": "#caf0f8", "accent": "#ffd166", "motif": "qi_swirl"},
    {"cell": 35, "key": "PILL_BREAK_GOLD",     "group": "pill", "shape": "pill_orb",   "primary": "#ffb703", "secondary": "#fff3b0", "accent": "#ffffff", "motif": "sun_burst"},
    {"cell": 36, "key": "PILL_DETOX_EMERALD",  "group": "pill", "shape": "pill_gourd", "primary": "#2ec4b6", "secondary": "#cbf3f0", "accent": "#a7c957", "motif": "leaf_drop"},
    {"cell": 37, "key": "PILL_CALM_VIOLET",    "group": "pill", "shape": "pill_orb",   "primary": "#8338ec", "secondary": "#e0aaff", "accent": "#7fd8ff", "motif": "calm_lotus"},
    {"cell": 38, "key": "PILL_BODY_AMBER",     "group": "pill", "shape": "pill_gourd", "primary": "#fb8500", "secondary": "#ffd166", "accent": "#ffe5d9", "motif": "body_spark"},

    # 39..45: 7 Ordinary Weapon Families
    {"cell": 39, "key": "WPN_SWORD_COMMON",    "group": "weapon", "shape": "sword",      "primary": "#98c1d9", "secondary": "#e0fbfc", "accent": "#c9a227", "motif": "plain"},
    {"cell": 40, "key": "WPN_SABER_COMMON",    "group": "weapon", "shape": "saber",      "primary": "#adb5bd", "secondary": "#dee2e6", "accent": "#d97706", "motif": "plain"},
    {"cell": 41, "key": "WPN_SPEAR_COMMON",    "group": "weapon", "shape": "spear",      "primary": "#ced4da", "secondary": "#f8f9fa", "accent": "#c1121f", "motif": "plain"},
    {"cell": 42, "key": "WPN_STAFF_COMMON",    "group": "weapon", "shape": "staff",      "primary": "#9c6644", "secondary": "#ddb892", "accent": "#52b788", "motif": "plain"},
    {"cell": 43, "key": "WPN_DAGGER_COMMON",   "group": "weapon", "shape": "dagger",     "primary": "#a8dadc", "secondary": "#f1faee", "accent": "#e63946", "motif": "plain"},
    {"cell": 44, "key": "WPN_GAUNTLET_COMMON", "group": "weapon", "shape": "gauntlet",   "primary": "#b08968", "secondary": "#e6ccb2", "accent": "#ffd166", "motif": "plain"},
    {"cell": 45, "key": "WPN_BOW_COMMON",      "group": "weapon", "shape": "bow",        "primary": "#bc6c25", "secondary": "#dda15e", "accent": "#fefae0", "motif": "plain"},

    # 46..51: 6 Armor / Accessory Variants
    {"cell": 46, "key": "EQP_ARMOR_ROBE",      "group": "armor", "shape": "robe",        "primary": "#457b9d", "secondary": "#a8dadc", "accent": "#ffd166", "motif": "cloud_trim"},
    {"cell": 47, "key": "EQP_ARMOR_HEAVY",     "group": "armor", "shape": "plate_armor", "primary": "#6c757d", "secondary": "#ced4da", "accent": "#e09f3e", "motif": "scale_trim"},
    {"cell": 48, "key": "EQP_HELM_CROWN",      "group": "armor", "shape": "crown",       "primary": "#d4a373", "secondary": "#faedcd", "accent": "#2ec4b6", "motif": "jade_gem"},
    {"cell": 49, "key": "EQP_BOOTS_STEP",      "group": "armor", "shape": "boots",       "primary": "#3d5a80", "secondary": "#98c1d9", "accent": "#ffd166", "motif": "wind_wing"},
    {"cell": 50, "key": "EQP_RING_PENDANT",    "group": "armor", "shape": "jade_ring",   "primary": "#40916c", "secondary": "#95d5b2", "accent": "#ffd166", "motif": "spirit_cord"},
    {"cell": 51, "key": "EQP_TALISMAN_RELIC",  "group": "armor", "shape": "talisman",    "primary": "#f4a261", "secondary": "#feefc3", "accent": "#e63946", "motif": "seal_script"},

    # 52..57: 6 Material Families
    {"cell": 52, "key": "MAT_HERB_LEAF",       "group": "material", "shape": "herb",      "primary": "#52b788", "secondary": "#b7e4c7", "accent": "#ffd166", "motif": "dew"},
    {"cell": 53, "key": "MAT_FLOWER_ROOT",     "group": "material", "shape": "lotus_root","primary": "#ff758f", "secondary": "#ffccd5", "accent": "#ffd166", "motif": "petals"},
    {"cell": 54, "key": "MAT_ORE_INGOT",       "group": "material", "shape": "ore",       "primary": "#6c757d", "secondary": "#adb5bd", "accent": "#4cc9f0", "motif": "crystal_vein"},
    {"cell": 55, "key": "MAT_JADE_CRYSTAL",    "group": "material", "shape": "crystal",   "primary": "#48cae4", "secondary": "#caf0f8", "accent": "#ffd166", "motif": "glow"},
    {"cell": 56, "key": "MAT_BEAST_CORE",      "group": "material", "shape": "beast_core","primary": "#e63946", "secondary": "#ff8fa3", "accent": "#ffd166", "motif": "flame_core"},
    {"cell": 57, "key": "MAT_BEAST_PART",      "group": "material", "shape": "beast_claw","primary": "#d4a373", "secondary": "#faedcd", "accent": "#e63946", "motif": "fang"},

    # 58..61: 4 Manuals / Crystals / Recipes / Provisions
    {"cell": 58, "key": "BOOK_TECH_SCROLL",    "group": "manual", "shape": "tome_scroll", "primary": "#3a86ff", "secondary": "#dbeafe", "accent": "#ffd166", "motif": "plain"},
    {"cell": 59, "key": "BOOK_SUBPATH_CRYSTAL","group": "manual", "shape": "jade_disc",   "primary": "#9d4edd", "secondary": "#f3e8ff", "accent": "#72efdd", "motif": "plain"},
    {"cell": 60, "key": "BOOK_RECIPE_SCROLL",  "group": "manual", "shape": "recipe_roll", "primary": "#e09f3e", "secondary": "#fff3b0", "accent": "#e63946", "motif": "gourd_seal"},
    {"cell": 61, "key": "ITEM_PROVISION_STONE","group": "other",  "shape": "pouch_bowl",  "primary": "#c9a227", "secondary": "#fae588", "accent": "#52b788", "motif": "coins"},

    # 62..63: 2 Explicit Fallbacks
    {"cell": 62, "key": "FALLBACK_UNKNOWN_LEGENDARY", "group": "fallback", "shape": "mythic_seal", "primary": "#ffd166", "secondary": "#fff3b0", "accent": "#ff4d6d", "motif": "question_star"},
    {"cell": 63, "key": "FALLBACK_GENERIC",           "group": "fallback", "shape": "chest_box",   "primary": "#8d99ae", "secondary": "#edf2f4", "accent": "#ffd166", "motif": "plain"},

    # 64..71: 8 Southern River Fishing, Culinary & Mysterious Container Variants
    {"cell": 64, "key": "FISH_COMMON_SILVER",          "group": "fish",      "shape": "fish",        "primary": "#8ecae6", "secondary": "#e0fbfc", "accent": "#52b788", "motif": "stream_scale"},
    {"cell": 65, "key": "FISH_REFINED_GOLD",           "group": "fish",      "shape": "fish",        "primary": "#ffb703", "secondary": "#fff3b0", "accent": "#fb8500", "motif": "gold_scale"},
    {"cell": 66, "key": "FISH_RARE_KOI_EEL",           "group": "fish",      "shape": "fish_koi",    "primary": "#72efdd", "secondary": "#ffffff", "accent": "#ff4d6d", "motif": "jade_koi"},
    {"cell": 67, "key": "FISH_EXCEPTIONAL_STAR",       "group": "fish",      "shape": "fish_star",   "primary": "#7b2cbf", "secondary": "#e0aaff", "accent": "#ffd166", "motif": "nine_stars"},
    {"cell": 68, "key": "FISH_APEX_DRAGON",            "group": "fish",      "shape": "fish_dragon", "primary": "#00b4d8", "secondary": "#caf0f8", "accent": "#ffd166", "motif": "dragon_whisker"},
    {"cell": 69, "key": "FOOD_SPIRIT_FISH_DISH",       "group": "food",      "shape": "fish_dish",   "primary": "#e07a5f", "secondary": "#f4f1de", "accent": "#81b29a", "motif": "steam_herbs"},
    {"cell": 70, "key": "ITEM_MYSTERY_RIVER_CONTAINER","group": "container", "shape": "river_chest", "primary": "#7f5539", "secondary": "#ddb892", "accent": "#48cae4", "motif": "water_seal"},
    {"cell": 71, "key": "TRASH_RIVER_DEBRIS",          "group": "trash",     "shape": "river_trash", "primary": "#5c677d", "secondary": "#979dac", "accent": "#6b705c", "motif": "driftwood"},
]

def hex_rgba(h, a=255):
    h = h.lstrip("#")
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)

def draw_cell_icon(cell_def):
    img = Image.new("RGBA", (CELL_SIZE, CELL_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    p = hex_rgba(cell_def["primary"])
    s = hex_rgba(cell_def["secondary"])
    a = hex_rgba(cell_def["accent"])
    grp = cell_def["group"]
    shp = cell_def["shape"]
    idx = cell_def["cell"]

    # Backing medallion inside [6..57]
    is_leg = grp in ("legendary_weapon", "legendary_tech") or idx == 62
    bg_fill = (28, 22, 38, 235) if is_leg else (20, 26, 36, 220)
    border_col = a if is_leg else (p[0], p[1], p[2], 195)
    d.rounded_rectangle([6, 6, 57, 57], radius=11, fill=bg_fill, outline=border_col, width=2)

    # Subtle inner corner ornaments for legendary cells so each is unmistakably mythic
    if is_leg:
        d.arc([8, 8, 55, 55], start=0, end=360, fill=(a[0], a[1], a[2], 90), width=1)
        for cx, cy in ((11, 11), (52, 11), (11, 52), (52, 52)):
            d.ellipse([cx - 1, cy - 1, cx + 1, cy + 1], fill=a)

    # Draw primary silhouette by shape
    if shp == "sword":
        d.line([(16, 48), (47, 17)], fill=s, width=4)
        d.line([(17, 47), (48, 16)], fill=p, width=2)
        d.polygon([(44, 15), (50, 14), (49, 20)], fill=s)
        d.line([(19, 37), (27, 45)], fill=a, width=3)
        d.line([(13, 51), (21, 43)], fill=a, width=3)
        if idx == 0:  # Yitian Sword star halo
            d.ellipse([24, 14, 34, 24], outline=a, width=1)
    elif shp == "greatsword":
        d.polygon([(16, 46), (22, 49), (49, 20), (47, 14), (41, 16)], fill=p, outline=s)
        d.line([(21, 44), (45, 19)], fill=a, width=2)
        d.line([(15, 37), (27, 49)], fill=a, width=4)
        d.line([(12, 51), (19, 44)], fill=s, width=3)
    elif shp == "saber":
        d.polygon([(15, 46), (20, 49), (49, 22), (48, 13), (36, 20)], fill=p, outline=s)
        d.line([(17, 38), (27, 47)], fill=a, width=3)
        if is_leg:
            d.arc([22, 14, 50, 42], start=200, end=340, fill=a, width=2)
    elif shp == "scimitar":
        d.arc([14, 14, 50, 50], start=210, end=60, fill=s, width=5)
        d.arc([16, 16, 48, 48], start=215, end=55, fill=p, width=3)
        d.ellipse([22, 22, 36, 36], fill=(a[0], a[1], a[2], 95))
    elif shp == "dagger":
        d.polygon([(20, 44), (25, 46), (47, 18), (39, 22)], fill=s, outline=p)
        d.line([(15, 49), (24, 40)], fill=a, width=3)
        if is_leg:
            d.ellipse([36, 14, 48, 26], outline=a, width=2)
    elif shp == "staff":
        d.line([(14, 50), (50, 14)], fill=p, width=5)
        d.line([(15, 49), (49, 15)], fill=s, width=2)
        for t in (0.28, 0.52, 0.76):
            qx = int(14 + 36 * t)
            qy = int(50 - 36 * t)
            d.ellipse([qx - 3, qy - 3, qx + 3, qy + 3], outline=a, width=2)
    elif shp in ("spear", "lance"):
        d.line([(13, 51), (43, 21)], fill=p, width=3)
        d.polygon([(39, 25), (50, 14), (45, 29)], fill=s, outline=a)
        d.ellipse([36, 22, 43, 29], fill=a)
        if shp == "lance":
            d.line([(20, 32), (34, 18), (28, 36), (44, 22)], fill=a, width=2)
    elif shp == "gauntlet":
        d.rounded_rectangle([18, 22, 44, 46], radius=6, fill=p, outline=s, width=2)
        for gx in (21, 28, 35, 42):
            d.line([(gx, 22), (gx + 3, 13)], fill=a, width=2)
    elif shp == "bow":
        d.arc([14, 12, 48, 52], start=250, end=110, fill=p, width=4)
        d.line([(26, 14), (26, 50)], fill=s, width=1)
        d.line([(16, 32), (48, 32)], fill=a, width=2)
        d.polygon([(44, 28), (51, 32), (44, 36)], fill=a)
    elif shp == "fan_tube":
        d.rounded_rectangle([18, 30, 36, 48], radius=4, fill=a, outline=s, width=2)
        for ang in (-35, -18, 0, 18, 35):
            rad = math.radians(ang - 45)
            ex = int(28 + 22 * math.cos(rad))
            ey = int(38 + 22 * math.sin(rad))
            d.line([(28, 38), (ex, ey)], fill=p, width=3)
            d.ellipse([ex - 3, ey - 3, ex + 3, ey + 3], fill=s, outline=a)
    elif shp in ("stele_scroll", "tome_scroll", "jade_tablet", "mirror_tome", "combat_manual", "diagram_scroll", "cloud_scroll", "forbidden_tome"):
        # Distinct book/tablet/scroll silhouettes + unique emblem per cell index
        if shp == "jade_tablet":
            d.polygon([(22, 13), (42, 13), (46, 20), (46, 50), (18, 50), (18, 20)], fill=p, outline=s)
        elif shp == "mirror_tome":
            d.ellipse([16, 14, 48, 46], fill=p, outline=s, width=2)
            d.rectangle([28, 45, 36, 52], fill=a)
        elif shp == "cloud_scroll":
            d.rounded_rectangle([15, 18, 49, 46], radius=8, fill=p, outline=s, width=2)
        else:
            d.rounded_rectangle([17, 14, 47, 50], radius=4, fill=p, outline=s, width=2)
            d.line([(22, 14), (22, 50)], fill=a, width=2)
        # Unique inner emblem per cell index (11..32, 58)
        em = idx % 7
        if em == 0:
            d.ellipse([25, 24, 39, 38], outline=a, width=2)
            d.line([(32, 20), (32, 42)], fill=s, width=2)
        elif em == 1:
            d.polygon([(32, 20), (41, 32), (32, 44), (23, 32)], outline=a, fill=(s[0], s[1], s[2], 120))
        elif em == 2:
            for ry in (23, 30, 37, 43):
                d.line([(26, ry), (41, ry)], fill=s, width=2)
        elif em == 3:
            d.polygon([(32, 19), (42, 41), (22, 41)], outline=a, width=2)
            d.ellipse([29, 29, 35, 35], fill=s)
        elif em == 4:
            d.arc([23, 21, 41, 39], start=0, end=270, fill=a, width=3)
            d.ellipse([30, 28, 36, 34], fill=s)
        elif em == 5:
            d.line([(25, 40), (39, 22)], fill=a, width=3)
            d.line([(25, 22), (39, 40)], fill=s, width=2)
        else:
            d.rectangle([26, 24, 38, 38], outline=a, width=2)
            d.ellipse([29, 27, 35, 33], fill=s)
    elif shp == "jade_disc":
        d.ellipse([15, 15, 49, 49], fill=p, outline=s, width=3)
        d.ellipse([26, 26, 38, 38], fill=bg_fill, outline=a, width=2)
        for ang in range(0, 360, 60):
            rad = math.radians(ang + idx * 15)
            px = int(32 + 13 * math.cos(rad))
            py = int(32 + 13 * math.sin(rad))
            d.ellipse([px - 2, py - 2, px + 2, py + 2], fill=a)
    elif shp == "pill_gourd":
        d.ellipse([22, 16, 42, 33], fill=p, outline=s, width=2)
        d.ellipse([18, 29, 46, 51], fill=p, outline=s, width=2)
        d.rectangle([29, 11, 35, 17], fill=a)
        d.ellipse([27, 35, 37, 45], fill=s)
    elif shp == "pill_orb":
        d.ellipse([17, 17, 47, 47], fill=p, outline=s, width=2)
        d.ellipse([22, 21, 31, 30], fill=s)
        d.arc([13, 13, 51, 51], start=30, end=160, fill=a, width=2)
    elif shp == "robe":
        d.polygon([(22, 16), (42, 16), (50, 26), (44, 31), (41, 25), (41, 49), (23, 49), (23, 25), (20, 31), (14, 26)], fill=p, outline=s)
        d.line([(26, 16), (34, 28), (38, 16)], fill=a, width=2)
        d.rectangle([23, 33, 41, 37], fill=a)
    elif shp == "plate_armor":
        d.polygon([(20, 16), (44, 16), (48, 25), (42, 49), (22, 49), (16, 25)], fill=p, outline=s)
        d.line([(32, 16), (32, 49)], fill=a, width=2)
        d.line([(20, 28), (44, 28)], fill=a, width=2)
    elif shp == "crown":
        d.polygon([(16, 42), (19, 22), (27, 31), (32, 17), (37, 31), (45, 22), (48, 42)], fill=p, outline=s)
        d.ellipse([29, 27, 35, 33], fill=a)
    elif shp == "boots":
        d.polygon([(24, 16), (38, 16), (38, 36), (48, 42), (48, 48), (20, 48), (20, 38)], fill=p, outline=s)
        d.line([(22, 24), (38, 24)], fill=a, width=2)
    elif shp == "jade_ring":
        d.line([(32, 11), (32, 21)], fill=a, width=2)
        d.ellipse([18, 20, 46, 48], outline=p, width=6)
        d.ellipse([20, 22, 44, 46], outline=s, width=2)
    elif shp == "talisman":
        d.polygon([(22, 13), (42, 13), (46, 21), (42, 50), (22, 50), (18, 21)], fill=p, outline=s)
        d.line([(32, 18), (32, 44)], fill=a, width=3)
        d.line([(25, 26), (39, 36)], fill=a, width=2)
    elif shp == "herb":
        d.line([(20, 48), (42, 18)], fill=a, width=2)
        d.ellipse([26, 16, 46, 30], fill=p, outline=s)
        d.ellipse([16, 26, 36, 40], fill=p, outline=s)
    elif shp == "lotus_root":
        for ang in (-40, 0, 40):
            d.ellipse([22 + ang // 5, 18, 42 + ang // 5, 44], fill=p, outline=s)
        d.ellipse([26, 28, 38, 40], fill=a)
    elif shp == "ore":
        d.polygon([(16, 42), (22, 20), (38, 16), (49, 30), (43, 48), (24, 49)], fill=p, outline=s)
        d.line([(24, 28), (36, 24), (40, 38)], fill=a, width=2)
    elif shp == "crystal":
        d.polygon([(32, 12), (45, 26), (39, 50), (25, 50), (19, 26)], fill=p, outline=s)
        d.line([(32, 12), (32, 50)], fill=s, width=2)
    elif shp == "beast_core":
        d.ellipse([18, 18, 46, 46], fill=p, outline=a, width=3)
        d.polygon([(32, 21), (40, 32), (32, 43), (24, 32)], fill=s)
    elif shp == "beast_claw":
        for ox in (-8, 0, 8):
            d.polygon([(26 + ox, 46), (30 + ox, 16), (35 + ox, 44)], fill=s, outline=p)
    elif shp == "recipe_roll":
        d.rounded_rectangle([16, 20, 48, 44], radius=5, fill=p, outline=s, width=2)
        d.ellipse([28, 27, 36, 37], fill=a)
    elif shp == "pouch_bowl":
        d.ellipse([18, 24, 46, 50], fill=p, outline=s, width=2)
        d.polygon([(24, 16), (40, 16), (36, 26), (28, 26)], fill=a, outline=s)
    elif shp == "mythic_seal":
        d.polygon([(32, 12), (38, 25), (51, 27), (41, 37), (44, 50), (32, 43), (20, 50), (23, 37), (13, 27), (26, 25)], fill=p, outline=s)
        d.ellipse([28, 28, 36, 36], fill=a)
    elif shp in ("fish", "fish_koi", "fish_star", "fish_dragon"):
        # Curved swimming Wuxia fish silhouette with tail fin, dorsal fin, eye, and tier accents
        d.ellipse([16, 22, 44, 42], fill=p, outline=s, width=2)
        d.polygon([(41, 32), (51, 21), (49, 32), (51, 43)], fill=a, outline=s)
        d.polygon([(26, 22), (34, 15), (37, 23)], fill=a)
        d.ellipse([20, 28, 24, 32], fill=s)
        if shp == "fish_koi":
            d.ellipse([27, 26, 35, 34], fill=a)
        elif shp == "fish_star":
            for sx, sy in ((26, 28), (31, 31), (36, 28), (29, 35)):
                d.ellipse([sx - 1, sy - 1, sx + 1, sy + 1], fill=a)
        elif shp == "fish_dragon":
            d.line([(16, 30), (10, 23)], fill=a, width=2)
            d.line([(16, 34), (10, 41)], fill=a, width=2)
            d.arc([20, 17, 44, 41], start=200, end=340, fill=a, width=2)
    elif shp == "fish_dish":
        # Porcelain platter/bowl with steamed fish and rising aroma
        d.ellipse([13, 28, 51, 49], fill=s, outline=p, width=2)
        d.ellipse([18, 32, 46, 44], fill=p, outline=a, width=2)
        d.polygon([(41, 38), (48, 33), (48, 43)], fill=a)
        for sx in (24, 32, 40):
            d.line([(sx, 24), (sx + 2, 16)], fill=a, width=2)
    elif shp == "river_chest":
        # Waterlogged ancient wood chest with glowing cyan water seal & ribbon
        d.rounded_rectangle([15, 21, 49, 48], radius=4, fill=p, outline=s, width=2)
        d.line([(15, 31), (49, 31)], fill=a, width=2)
        d.rectangle([28, 27, 36, 36], fill=a, outline=s)
        d.ellipse([19, 15, 25, 21], fill=a)
        d.ellipse([41, 16, 46, 21], fill=a)
    elif shp == "river_trash":
        # Driftwood and tangled river weeds
        d.line([(16, 44), (46, 22)], fill=p, width=5)
        d.line([(20, 22), (44, 44)], fill=s, width=4)
        d.arc([18, 20, 46, 46], start=20, end=210, fill=a, width=2)
    else:  # chest_box
        d.rounded_rectangle([16, 22, 48, 48], radius=4, fill=p, outline=s, width=2)
        d.line([(16, 32), (48, 32)], fill=a, width=2)
        d.rectangle([29, 29, 35, 36], fill=a)

    # Strictly clear outer 4px margin on all 4 sides to guarantee zero bleed
    px = img.load()
    for y in range(CELL_SIZE):
        for x in range(CELL_SIZE):
            if x < 4 or x >= CELL_SIZE - 4 or y < 4 or y >= CELL_SIZE - 4:
                px[x, y] = (0, 0, 0, 0)
    return img

def main():
    atlas = Image.new("RGBA", (ATLAS_W, ATLAS_H), (0, 0, 0, 0))
    cell_records = []

    for cdef in CELL_DEFS:
        idx = cdef["cell"]
        col = idx % COLS
        row = idx // COLS
        cimg = draw_cell_icon(cdef)
        x0 = col * CELL_SIZE
        y0 = row * CELL_SIZE
        atlas.paste(cimg, (x0, y0))

        # Audit cell boundaries and non-empty pixels
        cpx = cimg.load()
        non_empty = 0
        border_bleed = 0
        for y in range(CELL_SIZE):
            for x in range(CELL_SIZE):
                a = cpx[x, y][3]
                if a > 0:
                    non_empty += 1
                    if x < 4 or x >= CELL_SIZE - 4 or y < 4 or y >= CELL_SIZE - 4:
                        border_bleed += 1
        assert non_empty >= 400, f"Cell {idx} ({cdef['key']}) has too few pixels: {non_empty}"
        assert border_bleed == 0, f"Cell {idx} ({cdef['key']}) bled into 4px safety margin: {border_bleed}"

        cell_records.append({
            "cell": idx,
            "col": col,
            "row": row,
            "x": x0,
            "y": y0,
            "w": CELL_SIZE,
            "h": CELL_SIZE,
            "key": cdef["key"],
            "group": cdef["group"],
            "shape": cdef["shape"],
            "primary": cdef["primary"],
            "secondary": cdef["secondary"],
            "accent": cdef["accent"],
            "motif": cdef["motif"],
            "nonEmptyPixels": non_empty,
            "borderBleedPixels": border_bleed
        })

    atlas_path = os.path.join(ASSETS_DIR, "wuxia_item_atlas.png")
    atlas.save(atlas_path, format="PNG", optimize=True)
    with open(atlas_path, "rb") as f:
        b64_png = base64.b64encode(f.read()).decode("ascii")

    meta = {
        "atlasVersion": "1.12.1",
        "atlasFile": "assets/wuxia_item_atlas.png",
        "width": ATLAS_W,
        "height": ATLAS_H,
        "cols": COLS,
        "rows": ROWS,
        "cellSize": CELL_SIZE,
        "marginPx": 4,
        "totalCells": len(cell_records),
        "legendaryWeaponsCount": 11,
        "legendaryTechniquesCount": 22,
        "ordinaryVariantCellsCount": 29,
        "fallbackCellsCount": 2,
        "fileSizeBytes": os.path.getsize(atlas_path),
        "dataUri": "data:image/png;base64," + b64_png,
        "cells": cell_records
    }
    meta_path = os.path.join(DOCS_DIR, "ITEM_ICON_ATLAS_MAP.json")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)

    print(f"Saved {atlas_path} ({meta['fileSizeBytes']} bytes) and {meta_path} ({len(cell_records)} cells verified, 0 border bleed).")

if __name__ == "__main__":
    main()

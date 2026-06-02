import { useState, useEffect } from "react";

const TODAY = new Date().toISOString().split("T")[0];
const GOAL_CALORIES = 1800;
const GOAL_PROTEIN = 160;
const GOAL_FAT = 63;
const GOAL_CARBS = Math.round((GOAL_CALORIES - GOAL_PROTEIN * 4 - GOAL_FAT * 9) / 4);
const GOAL_FIBER = 35;
const GOAL_WATER = 3500;
const GOAL_SUGAR = 25;
const BMR = Math.round(10 * 108 + 6.25 * 183 - 5 * 24 + 5);
const TDEE = Math.round(BMR * 1.55);

const APP = { minHeight: "100vh", background: "#0a0a0a", color: "#f0f0f0", fontFamily: "system-ui,sans-serif", paddingBottom: 80 };
const HDR = { background: "#0f0f0f", borderBottom: "1px solid #1a1a1a", padding: "14px 16px 0", position: "sticky", top: 0, zIndex: 100 };
const SEC = { padding: "14px 16px" };
const LBL = { fontSize: 10, color: "#555", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 };
const INP = { background: "#161616", border: "1px solid #252525", borderRadius: 8, padding: "10px 12px", color: "#f0f0f0", fontSize: 13, width: "100%", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
const ROW = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 };
const CHIP = { background: "#141414", border: "1px solid #222", borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#ccc", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 };
const TIP = { background: "#111", border: "1px solid #1e1e1a", borderRadius: 10, padding: "11px 13px", fontSize: 12, color: "#777", lineHeight: 1.6, marginBottom: 12 };
const XBTN = { background: "none", border: "none", color: "#444", fontSize: 16, cursor: "pointer", padding: "0 4px", flexShrink: 0 };
function card(extra) { return { background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: 14, marginBottom: 12, ...(extra || {}) }; }
function btn(bg, fg) { return { background: bg || "#e8ff4a", color: fg || "#000", border: "none", borderRadius: 8, padding: "10px 14px", fontWeight: 800, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }; }
function mac(c) { return { fontSize: 11, color: c, fontWeight: 700 }; }

const FOOD_DB = [
  // ── Meat & Poultry (per 100g cooked/grilled) ──
  { name: "Chicken Breast — Half Chicken Style (100g) grilled skinless", cal: 162, p: 30, c: 0, f: 4.5, fb: 0, s: 0 },
  { name: "Chicken Breast — Grilled Fillet / Pané (100g) skinless", cal: 155, p: 31, c: 0, f: 3.4, fb: 0, s: 0 },
  { name: "Chicken Thigh (100g) grilled skinless", cal: 170, p: 25, c: 0, f: 7.5, fb: 0, s: 0 },
  { name: "Beef / Meat (100g) grilled cooked", cal: 215, p: 26, c: 0, f: 12, fb: 0, s: 0 },
  { name: "Kofta (100g) grilled cooked", cal: 220, p: 18, c: 4, f: 15, fb: 0, s: 0 },
  { name: "Pastrami (100g)", cal: 330, p: 27, c: 3, f: 23, fb: 0, s: 0 },
  { name: "Turkey Breast (100g) grilled", cal: 135, p: 30, c: 0, f: 1, fb: 0, s: 0 },
  { name: "Beef Liver (100g) cooked", cal: 135, p: 21, c: 4, f: 4, fb: 0, s: 0 },
  // ── Fish & Seafood (per 100g) ──
  { name: "Tuna canned in water (100g)", cal: 116, p: 26, c: 0, f: 1, fb: 0, s: 0 },
  { name: "Salmon grilled (100g)", cal: 208, p: 20, c: 0, f: 13, fb: 0, s: 0 },
  { name: "Sardines in water (100g)", cal: 135, p: 23, c: 0, f: 5, fb: 0, s: 0 },
  { name: "Grilled Fish Fillet (100g)", cal: 130, p: 26, c: 0, f: 3, fb: 0, s: 0 },
  { name: "Grilled Sea Bass (100g)", cal: 124, p: 24, c: 0, f: 3, fb: 0, s: 0 },
  { name: "Shrimp cooked (100g)", cal: 99, p: 24, c: 0, f: 0.3, fb: 0, s: 0 },
  // ── Eggs (whole egg ~50g, white ~30g) ──
  { name: "Boiled Egg (50g / 1 egg)", cal: 78, p: 6, c: 0.6, f: 5, fb: 0, s: 0 },
  { name: "Fried Egg (50g / 1 egg)", cal: 90, p: 6, c: 0.4, f: 7, fb: 0, s: 0 },
  { name: "Egg White (30g / 1 white)", cal: 17, p: 3.6, c: 0.2, f: 0, fb: 0, s: 0 },
  // ── Protein Supplements (per 30g scoop) ──
  { name: "Whey Protein (30g / 1 scoop)", cal: 120, p: 25, c: 3, f: 2, fb: 0, s: 0 },
  { name: "Casein Protein (30g / 1 scoop)", cal: 115, p: 24, c: 4, f: 1.5, fb: 0, s: 0 },
  // ── HiPRO (per full container — fixed serving) ──
  { name: "HiPRO Danone Plain (200g container)", cal: 148, p: 20, c: 11, f: 2.4, fb: 0, s: 0 },
  { name: "HiPRO Danone Strawberry (200g container)", cal: 158, p: 20, c: 13, f: 2.4, fb: 0, s: 0 },
  { name: "HiPRO Danone Cookies and Cream (260g container)", cal: 187, p: 20, c: 18, f: 2.5, fb: 0, s: 0 },
  // ── Juhayna Greek Yogurt (per 180g container) ──
  { name: "Juhayna Greek Yogurt 0.2% fat (180g)", cal: 90, p: 15, c: 6, f: 0.4, fb: 0, s: 0 },
  { name: "Juhayna Greek Yogurt 2% fat (180g)", cal: 120, p: 15, c: 7, f: 3.6, fb: 0, s: 0 },
  { name: "Juhayna Greek Yogurt 5% fat (180g)", cal: 170, p: 15, c: 7, f: 9, fb: 0, s: 0 },
  { name: "Juhayna Greek Yogurt 7% fat (180g)", cal: 200, p: 13, c: 7, f: 13, fb: 0, s: 0 },
  // ── Juhayna Milk (per 100ml) ──
  { name: "Juhayna Full Cream Milk (100ml)", cal: 57, p: 3, c: 4.5, f: 3, fb: 0, s: 0 },
  { name: "Juhayna Half Cream Milk (100ml)", cal: 44, p: 3, c: 4.5, f: 1.5, fb: 0, s: 0 },
  { name: "Juhayna Skimmed Milk (100ml)", cal: 34, p: 3.3, c: 4.8, f: 0.1, fb: 0, s: 0 },
  { name: "Juhayna 0% Fat Milk (100ml)", cal: 30, p: 3, c: 4.5, f: 0, fb: 0, s: 0 },
  { name: "Juhayna Plain Yogurt (100g)", cal: 65, p: 3.8, c: 7.6, f: 2.4, fb: 0, s: 0 },
  { name: "Juhayna Rayeb (100ml)", cal: 65, p: 3.5, c: 5, f: 3.5, fb: 0, s: 0 },
  { name: "Juhayna Turkish Labneh (100g)", cal: 170, p: 8, c: 4, f: 14, fb: 0, s: 0 },
  { name: "Juhayna Almond Milk (100ml)", cal: 13, p: 0.4, c: 1.6, f: 0.6, fb: 0, s: 0 },
  // ── Almarai (per 100g or 100ml) ──
  { name: "Activia Yogurt (100g)", cal: 68, p: 3.8, c: 10, f: 1.3, fb: 0, s: 0 },
  { name: "Almarai Full Fat Yogurt (100g)", cal: 90, p: 4.5, c: 9, f: 4, fb: 0, s: 0 },
  { name: "Almarai Low Fat Yogurt (100g)", cal: 60, p: 4.5, c: 8, f: 1, fb: 0, s: 0 },
  { name: "Almarai Fresh Milk Full Fat (100ml)", cal: 63, p: 3.3, c: 4.9, f: 3.5, fb: 0, s: 0 },
  { name: "Almarai Fresh Milk Skimmed (100ml)", cal: 36, p: 3.5, c: 5, f: 0.1, fb: 0, s: 0 },
  { name: "Almarai Laban (100ml)", cal: 55, p: 3, c: 5, f: 2.5, fb: 0, s: 0 },
  // ── Cheese (per 100g) ──
  { name: "Almarai Cream Cheese (100g)", cal: 300, p: 6.7, c: 3.3, f: 30, fb: 0, s: 0 },
  { name: "Almarai Butter Unsalted (100g)", cal: 750, p: 0.5, c: 0.1, f: 83, fb: 0, s: 0 },
  { name: "Feta Cheese (100g)", cal: 250, p: 13.3, c: 4, f: 20, fb: 0, s: 0 },
  { name: "Gouda / Romy Cheese (100g)", cal: 337, p: 23.3, c: 1.3, f: 26.7, fb: 0, s: 0 },
  { name: "Cottage Cheese full fat (100g)", cal: 98, p: 11, c: 3.4, f: 4.3, fb: 0, s: 0 },
  { name: "Cottage Cheese low fat (100g)", cal: 72, p: 12, c: 2.7, f: 1, fb: 0, s: 0 },
  { name: "Cottage Cheese 0% fat (100g)", cal: 55, p: 11, c: 2.5, f: 0.2, fb: 0, s: 0 },
  { name: "Light Mozzarella (100g)", cal: 190, p: 24, c: 1.5, f: 10, fb: 0, s: 0 },
  { name: "Full Fat Mozzarella (100g)", cal: 267, p: 18.3, c: 2, f: 21, fb: 0, s: 0 },
  { name: "Cheddar Cheese (100g)", cal: 400, p: 25, c: 0.4, f: 33, fb: 0, s: 0 },
  { name: "Light Cheddar (100g)", cal: 253, p: 30, c: 0.4, f: 15, fb: 0, s: 0 },
  { name: "Halloumi (100g)", cal: 300, p: 20, c: 1, f: 23, fb: 0, s: 0 },
  { name: "String Cheese (100g)", cal: 286, p: 25, c: 3.6, f: 17.9, fb: 0, s: 0 },
  { name: "Labneh (100g)", cal: 170, p: 8, c: 4, f: 14, fb: 0, s: 0 },
  { name: "Whole Milk (100ml)", cal: 61, p: 3.3, c: 4.8, f: 3.5, fb: 0, s: 0 },
  { name: "Skimmed Milk (100ml)", cal: 35, p: 3.5, c: 5, f: 0.1, fb: 0, s: 0 },
  // ── Coffee & Drinks (fixed-size items — no sensible 100g base) ──
  { name: "Nescafe Latte Can (250ml)", cal: 140, p: 3.5, c: 22, f: 4.5, fb: 0, s: 20 },
  { name: "Nescafe Cappuccino Can (250ml)", cal: 130, p: 3, c: 20, f: 4, fb: 0, s: 18 },
  { name: "Nescafe Mocha Can (250ml)", cal: 150, p: 3, c: 24, f: 5, fb: 0, s: 22 },
  { name: "Black Coffee (240ml cup)", cal: 5, p: 0.3, c: 0.5, f: 0, fb: 0, s: 0 },
  { name: "Starbucks Latte Tall (355ml)", cal: 190, p: 13, c: 19, f: 7, fb: 0, s: 18 },
  { name: "Starbucks Latte Grande (473ml)", cal: 250, p: 17, c: 25, f: 9, fb: 0, s: 23 },
  { name: "Starbucks Cappuccino Tall (355ml)", cal: 120, p: 8, c: 12, f: 4, fb: 0, s: 10 },
  { name: "Starbucks Americano (355ml)", cal: 15, p: 1, c: 2, f: 0, fb: 0, s: 0 },
  { name: "Starbucks Caramel Macchiato Tall (355ml)", cal: 250, p: 10, c: 34, f: 7, fb: 0, s: 32 },
  { name: "Starbucks Frappuccino Caramel Tall (355ml)", cal: 300, p: 4, c: 53, f: 8, fb: 0, s: 50 },
  { name: "Starbucks Cold Brew Tall (355ml)", cal: 5, p: 0.5, c: 0, f: 0, fb: 0, s: 0 },
  { name: "Turkish Coffee unsweetened (60ml)", cal: 5, p: 0.3, c: 0.5, f: 0, fb: 0, s: 0 },
  { name: "Turkish Coffee with sugar (60ml)", cal: 25, p: 0.3, c: 5, f: 0, fb: 0, s: 4 },
  { name: "Fresh Orange Juice (100ml)", cal: 44, p: 0.7, c: 10, f: 0.2, fb: 0.3, s: 9 },
  { name: "Fresh Lemon Mint (100ml)", cal: 27, p: 0.2, c: 6.7, f: 0.1, fb: 0.1, s: 6 },
  { name: "Diet Pepsi / Coke Zero (330ml can)", cal: 1, p: 0, c: 0.3, f: 0, fb: 0, s: 0 },
  { name: "Regular Pepsi / Coke (330ml can)", cal: 140, p: 0, c: 35, f: 0, fb: 0, s: 35 },
  { name: "Red Bull (250ml can)", cal: 113, p: 1, c: 28, f: 0, fb: 0, s: 27 },
  { name: "Green Tea unsweetened (100ml)", cal: 1, p: 0.2, c: 0.2, f: 0, fb: 0, s: 0 },
  // ── Bread (per 100g — a standard slice ~30g, pita ~80g) ──
  { name: "Rich Bake Brown Toast (100g)", cal: 248, p: 11.5, c: 46, f: 3.8, fb: 7.7, s: 0 },
  { name: "Rich Bake High Protein Toast (100g)", cal: 267, p: 19, c: 38, f: 5.7, fb: 9.6, s: 0 },
  { name: "White Toast Bread (100g)", cal: 265, p: 9, c: 49, f: 3.2, fb: 2.7, s: 0 },
  { name: "Aish Baladi / Pita (100g)", cal: 213, p: 7.5, c: 44, f: 1.3, fb: 3.8, s: 0 },
  { name: "Aish Fino / White Roll (100g)", cal: 277, p: 8.5, c: 53, f: 3.2, fb: 2.1, s: 0 },
  { name: "Whole Wheat Bread (100g)", cal: 265, p: 13.8, c: 46, f: 3.8, fb: 7.3, s: 0 },
  // ── Rice, Grains & Carbs (per 100g cooked unless noted) ──
  { name: "White Rice cooked (100g)", cal: 130, p: 2.7, c: 28, f: 0.3, fb: 0.4, s: 0 },
  { name: "Brown Rice cooked (100g)", cal: 122, p: 2.5, c: 25, f: 1, fb: 1.8, s: 0 },
  { name: "Pasta cooked (100g)", cal: 158, p: 6, c: 31, f: 0.9, fb: 1.8, s: 0 },
  { name: "Oats dry (100g)", cal: 389, p: 17, c: 66, f: 7, fb: 10, s: 0 },
  { name: "Quinoa cooked (100g)", cal: 120, p: 4.4, c: 21, f: 1.9, fb: 2.8, s: 0 },
  // ── Vegetables (per 100g) ──
  { name: "Potato boiled (100g)", cal: 87, p: 1.9, c: 20, f: 0.1, fb: 1.8, s: 0 },
  { name: "Sweet Potato baked (100g)", cal: 86, p: 1.6, c: 20, f: 0.1, fb: 3, s: 0 },
  { name: "Broccoli (100g)", cal: 34, p: 2.8, c: 7, f: 0.4, fb: 2.6, s: 0 },
  { name: "Cucumber (100g)", cal: 16, p: 0.7, c: 3.6, f: 0.1, fb: 0.5, s: 0 },
  { name: "Tomato (100g)", cal: 18, p: 0.9, c: 3.9, f: 0.2, fb: 1.2, s: 0 },
  { name: "Lettuce / Salad Leaves (100g)", cal: 15, p: 1.4, c: 2.9, f: 0.2, fb: 1.3, s: 0 },
  { name: "Spinach raw (100g)", cal: 23, p: 2.9, c: 3.6, f: 0.4, fb: 2.2, s: 0 },
  { name: "Cooked Spinach (100g)", cal: 35, p: 3.5, c: 4, f: 1, fb: 2.4, s: 0 },
  { name: "Carrots (100g)", cal: 41, p: 0.9, c: 10, f: 0.2, fb: 2.8, s: 0 },
  { name: "Courgette / Zucchini (100g)", cal: 17, p: 1.2, c: 3.1, f: 0.3, fb: 1, s: 0 },
  { name: "Bell Pepper Red (100g)", cal: 31, p: 1, c: 6, f: 0.3, fb: 2.1, s: 0 },
  { name: "Bell Pepper Green (100g)", cal: 20, p: 0.9, c: 4.6, f: 0.2, fb: 1.7, s: 0 },
  { name: "Bell Pepper Yellow (100g)", cal: 27, p: 1, c: 6.3, f: 0.1, fb: 0.9, s: 0 },
  { name: "Eggplant / Aubergine (100g)", cal: 25, p: 1, c: 6, f: 0.2, fb: 3, s: 0 },
  { name: "Mushrooms (100g)", cal: 22, p: 3.1, c: 3.3, f: 0.3, fb: 1, s: 0 },
  { name: "Onion (100g)", cal: 40, p: 1.1, c: 9.3, f: 0.1, fb: 1.7, s: 0 },
  { name: "Garlic (100g)", cal: 149, p: 6.4, c: 33, f: 0.5, fb: 2.1, s: 1 },
  { name: "Cooked Okra / Bamia (100g)", cal: 45, p: 2, c: 8, f: 0.5, fb: 3.2, s: 0 },
  { name: "Peas cooked (100g)", cal: 84, p: 5.4, c: 15, f: 0.4, fb: 5.5, s: 6 },
  { name: "Brussels Sprouts (100g)", cal: 43, p: 3.4, c: 9, f: 0.3, fb: 3.8, s: 0 },
  { name: "Edamame cooked (100g)", cal: 121, p: 11, c: 9, f: 5, fb: 5.2, s: 0 },
  { name: "Artichoke cooked (100g)", cal: 53, p: 2.9, c: 11.4, f: 0.2, fb: 5.7, s: 1.1 },
  // ── Egyptian Soups & Dishes (per 100g) ──
  { name: "Spinach in Red Soup (100g)", cal: 43, p: 2.3, c: 4, f: 2, fb: 1.3, s: 0 },
  { name: "Okra / Bamia Stew (100g)", cal: 37, p: 1.7, c: 4.7, f: 1.3, fb: 1.7, s: 0 },
  { name: "Taro / 2al2as Stew (100g)", cal: 58, p: 1.3, c: 11.7, f: 1, fb: 1.3, s: 0 },
  { name: "Molokhia (100g)", cal: 35, p: 1.7, c: 3.3, f: 1.7, fb: 1, s: 0 },
  { name: "Lentil Soup (100g)", cal: 55, p: 3.3, c: 9.3, f: 0.7, fb: 2.7, s: 0 },
  { name: "Vegetable Soup (100g)", cal: 23, p: 1, c: 4, f: 0.5, fb: 1, s: 0 },
  // ── Egyptian Staples (per 100g) ──
  { name: "Ful Medames (100g)", cal: 95, p: 6.5, c: 15, f: 1, fb: 4.5, s: 0 },
  { name: "Ful with Oil and Lemon (100g)", cal: 120, p: 6.5, c: 15, f: 4, fb: 4.5, s: 0 },
  { name: "Falafel / Ta3meya (100g)", cal: 333, p: 14.7, c: 35.3, f: 17.6, fb: 8.8, s: 0 },
  { name: "Koshari (100g)", cal: 127, p: 4, c: 24, f: 1.7, fb: 2.3, s: 0 },
  { name: "Macarona Bechamel (100g)", cal: 160, p: 7, c: 17.5, f: 6.5, fb: 1, s: 0 },
  { name: "Hawawshi (100g)", cal: 233, p: 13.3, c: 18.7, f: 10.7, fb: 0.7, s: 0 },
  { name: "Shawarma Chicken (100g)", cal: 190, p: 14, c: 17.5, f: 6, fb: 1, s: 0 },
  { name: "Stuffed Vine Leaves / Wara2 3enab (100g)", cal: 142, p: 3.3, c: 18.3, f: 5.8, fb: 1.7, s: 0 },
  { name: "Mahshi Kousa (100g)", cal: 100, p: 3.9, c: 11.1, f: 4.4, fb: 1.1, s: 0 },
  { name: "Hummus (100g)", cal: 166, p: 8, c: 14, f: 10, fb: 6, s: 0 },
  { name: "Tahini (100g)", cal: 595, p: 17, c: 21.3, f: 53.8, fb: 4.7, s: 0 },
  { name: "Baba Ghanoush (100g)", cal: 88, p: 2, c: 9, f: 5, fb: 2.5, s: 0 },
  { name: "Fattoush Salad (100g)", cal: 60, p: 1.5, c: 9, f: 2.5, fb: 1.5, s: 0 },
  { name: "Tomato Cucumber Salad (100g)", cal: 20, p: 1, c: 4, f: 0.3, fb: 1, s: 0 },
  // ── Fast Food (fixed portion — hard to convert to 100g meaningfully) ──
  { name: "McDonalds Big Mac (200g)", cal: 550, p: 28, c: 46, f: 28, fb: 3, s: 0 },
  { name: "McDonalds McChicken Sandwich (160g)", cal: 430, p: 22, c: 44, f: 18, fb: 2, s: 0 },
  { name: "McDonalds French Fries Medium (114g)", cal: 320, p: 4, c: 43, f: 15, fb: 3, s: 0 },
  { name: "McDonalds McNuggets 6pc (100g)", cal: 280, p: 15, c: 18, f: 16, fb: 0, s: 0 },
  { name: "McDonalds McFlurry Oreo (250g)", cal: 340, p: 9, c: 54, f: 10, fb: 0, s: 45 },
  { name: "Pizza Hut Pepperoni Slice (100g)", cal: 266, p: 12, c: 31, f: 11, fb: 1.8, s: 0 },
  { name: "Pizza Hut Chicken Supreme Slice (100g)", cal: 248, p: 13, c: 30, f: 9.2, fb: 1.8, s: 0 },
  { name: "Pizza Hut Wings (100g)", cal: 233, p: 18.7, c: 8, f: 14.7, fb: 0, s: 0 },
  { name: "Smash Burger Single Patty (170g)", cal: 300, p: 22, c: 25, f: 14, fb: 1, s: 0 },
  { name: "Smash Burger Double Patty (280g)", cal: 550, p: 40, c: 28, f: 30, fb: 1, s: 0 },
  { name: "Smash Burger Fries (150g)", cal: 300, p: 4, c: 40, f: 14, fb: 3, s: 0 },
  { name: "Hawawshi Sandwich — Akleh (180g)", cal: 420, p: 24, c: 35, f: 20, fb: 2, s: 0 },
  { name: "Liver Sandwich / Kibda (150g)", cal: 350, p: 22, c: 32, f: 15, fb: 2, s: 0 },
  // ── Fruits (per 100g) ──
  { name: "Banana (100g)", cal: 89, p: 1.1, c: 23, f: 0.3, fb: 2.6, s: 12 },
  { name: "Apple (100g)", cal: 52, p: 0.3, c: 14, f: 0.2, fb: 2.4, s: 10 },
  { name: "Orange (100g)", cal: 47, p: 0.9, c: 12, f: 0.1, fb: 2.4, s: 9.4 },
  { name: "Pear (100g)", cal: 57, p: 0.4, c: 15, f: 0.1, fb: 3.1, s: 9.8 },
  { name: "Watermelon (100g)", cal: 30, p: 0.6, c: 7.6, f: 0.2, fb: 0.4, s: 6.2 },
  { name: "Mango (100g)", cal: 60, p: 0.8, c: 15, f: 0.4, fb: 1.6, s: 13 },
  { name: "Dates (100g)", cal: 277, p: 1.8, c: 75, f: 0.2, fb: 6.7, s: 63 },
  { name: "Strawberries (100g)", cal: 32, p: 0.7, c: 7.7, f: 0.3, fb: 2, s: 4.9 },
  { name: "Grapes (100g)", cal: 69, p: 0.7, c: 18, f: 0.2, fb: 0.9, s: 15 },
  { name: "Pomegranate (100g)", cal: 83, p: 1.7, c: 19, f: 1.2, fb: 4, s: 14 },
  { name: "Guava (100g)", cal: 68, p: 2.6, c: 14, f: 1, fb: 5.4, s: 9 },
  { name: "Kiwi (100g)", cal: 61, p: 1.1, c: 15, f: 0.5, fb: 3, s: 9 },
  { name: "Melon / Cantaloupe (100g)", cal: 34, p: 0.8, c: 8, f: 0.2, fb: 0.9, s: 7.3 },
  { name: "Blueberries (100g)", cal: 57, p: 0.7, c: 14, f: 0.3, fb: 2.4, s: 10 },
  { name: "Raspberries (100g)", cal: 52, p: 1.2, c: 12, f: 0.7, fb: 6.5, s: 4.4 },
  { name: "Blackberries (100g)", cal: 43, p: 1.4, c: 10, f: 0.5, fb: 5.3, s: 4.9 },
  { name: "Avocado (100g)", cal: 160, p: 2, c: 9, f: 15, fb: 6.7, s: 0.7 },
  { name: "Passion Fruit (100g)", cal: 97, p: 2.2, c: 23, f: 0.7, fb: 10.4, s: 11 },
  { name: "Fig fresh (100g)", cal: 74, p: 0.8, c: 19, f: 0.3, fb: 2.9, s: 16 },
  { name: "Dried Figs (100g)", cal: 249, p: 3.3, c: 64, f: 0.9, fb: 9.8, s: 48 },
  { name: "Prunes dried (100g)", cal: 240, p: 2.2, c: 64, f: 0.4, fb: 7.1, s: 38 },
  // ── Nuts, Seeds & Oils (per 100g) ──
  { name: "Peanut Butter (100g)", cal: 588, p: 25, c: 20, f: 50, fb: 6, s: 6 },
  { name: "Almonds (100g)", cal: 579, p: 21, c: 22, f: 50, fb: 12.5, s: 0 },
  { name: "Cashews (100g)", cal: 553, p: 18, c: 30, f: 43.8, fb: 3.3, s: 0 },
  { name: "Walnuts (100g)", cal: 654, p: 15.2, c: 13.7, f: 65.2, fb: 6.7, s: 0 },
  { name: "Pistachios (100g)", cal: 562, p: 20, c: 27.2, f: 45.3, fb: 10.6, s: 0 },
  { name: "Chia Seeds (100g)", cal: 486, p: 17, c: 42, f: 31, fb: 34.4, s: 0 },
  { name: "Flaxseeds (100g)", cal: 534, p: 18.3, c: 28.9, f: 42.2, fb: 27.3, s: 1.5 },
  { name: "Sunflower Seeds (100g)", cal: 584, p: 20.8, c: 20, f: 51.5, fb: 8.6, s: 2.6 },
  { name: "Olive Oil (100g)", cal: 884, p: 0, c: 0, f: 100, fb: 0, s: 0 },
  { name: "Dark Chocolate 70% (100g)", cal: 546, p: 7.8, c: 45.9, f: 39.7, fb: 10.9, s: 27.8 },
  // ── Legumes (per 100g cooked) ──
  { name: "Lentils cooked (100g)", cal: 116, p: 9, c: 20, f: 0.4, fb: 8, s: 0 },
  { name: "Chickpeas cooked (100g)", cal: 164, p: 9, c: 27, f: 2.6, fb: 7.6, s: 0 },
  { name: "Black Beans cooked (100g)", cal: 132, p: 8.9, c: 24, f: 0.5, fb: 8.7, s: 0 },
  { name: "Kidney Beans cooked (100g)", cal: 127, p: 8.7, c: 23, f: 0.5, fb: 7.4, s: 0 },
  // ── Fiber Supplements ──
  { name: "Psyllium Husk (100g)", cal: 200, p: 2, c: 88, f: 1, fb: 71, s: 0 },
  { name: "Limitless Chromax (1 sachet ~10g)", cal: 9, p: 0, c: 2, f: 0, fb: 4.2, s: 0 },
  // ── Condiments (per 100g) ──
  { name: "Ketchup (100g)", cal: 112, p: 1.4, c: 26.7, f: 0.1, fb: 0.7, s: 22 },
  { name: "Mayonnaise (100g)", cal: 680, p: 1, c: 3.6, f: 75, fb: 0, s: 0 },
  { name: "Hot Sauce / Shatta (100g)", cal: 35, p: 1.5, c: 6, f: 0.7, fb: 2, s: 0 },
  { name: "Tahini (100g)", cal: 595, p: 17, c: 21.3, f: 53.8, fb: 4.7, s: 0 },
  // ── Packaged / Ready-to-eat ──
  { name: "Really Good Eat Choc Banana Overnight Oats (180g)", cal: 320, p: 9, c: 52, f: 8, fb: 6, s: 22 },
  { name: "Really Good Eat Date Caramel Overnight Oats (180g)", cal: 340, p: 8, c: 58, f: 7, fb: 5, s: 28 },
  { name: "Homemade Cake (100g)", cal: 350, p: 4, c: 52, f: 14, fb: 1, s: 30 },
  // ── Vitamins & Supplements (0 cal — log for tracking) ──
  { name: "Vitamin C (500mg)", cal: 0, p: 0, c: 0, f: 0, fb: 0, s: 0 },
  { name: "Vitamin C (1000mg)", cal: 0, p: 0, c: 0, f: 0, fb: 0, s: 0 },
  { name: "Vitamin B12 (500mcg)", cal: 0, p: 0, c: 0, f: 0, fb: 0, s: 0 },
  { name: "Vitamin B12 (1000mcg)", cal: 0, p: 0, c: 0, f: 0, fb: 0, s: 0 },
  { name: "Vitamin D3 (1000 IU)", cal: 0, p: 0, c: 0, f: 0, fb: 0, s: 0 },
  { name: "Vitamin D3 (2000 IU)", cal: 0, p: 0, c: 0, f: 0, fb: 0, s: 0 },
  { name: "Zinc (10mg)", cal: 0, p: 0, c: 0, f: 0, fb: 0, s: 0 },
  { name: "Zinc (25mg)", cal: 0, p: 0, c: 0, f: 0, fb: 0, s: 0 },
  { name: "Magnesium (200mg)", cal: 0, p: 0, c: 0, f: 0, fb: 0, s: 0 },
  { name: "Magnesium (400mg)", cal: 0, p: 0, c: 0, f: 0, fb: 0, s: 0 },
  { name: "Omega 3 Fish Oil (1000mg)", cal: 9, p: 0, c: 0, f: 1, fb: 0, s: 0 },
  { name: "Multivitamin (1 tablet)", cal: 0, p: 0, c: 0, f: 0, fb: 0, s: 0 },
  { name: "Iron (18mg)", cal: 0, p: 0, c: 0, f: 0, fb: 0, s: 0 },
  { name: "Creatine Monohydrate (5g)", cal: 0, p: 0, c: 0, f: 0, fb: 0, s: 0 },
  { name: "B Complex (B12 + B6 + Biotin + Folic Acid)", cal: 0, p: 0, c: 0, f: 0, fb: 0, s: 0 },
];

const POPULAR = [
  "Chicken Breast — Half Chicken Style (100g) grilled skinless",
  "Chicken Breast — Grilled Fillet / Pané (100g) skinless",
  "Chicken Thigh (100g) grilled skinless",
  "Boiled Egg (50g / 1 egg)",
  "Egg White (30g / 1 white)",
  "Tuna canned in water (100g)",
  "HiPRO Danone Plain (200g container)",
  "HiPRO Danone Strawberry (200g container)",
  "HiPRO Danone Cookies and Cream (260g container)",
  "Juhayna Greek Yogurt 0.2% fat (180g)",
  "Juhayna Greek Yogurt 2% fat (180g)",
  "Juhayna 0% Fat Milk (100ml)",
  "Rich Bake Brown Toast (100g)",
  "Rich Bake High Protein Toast (100g)",
  "White Rice cooked (100g)",
  "Nescafe Latte Can (250ml)",
  "Nescafe Mocha Can (250ml)",
  "Banana (100g)",
  "Oats dry (100g)",
  "Lentil Soup (100g)",
  "Molokhia (100g)",
  "Taro / 2al2as Stew (100g)",
  "Okra / Bamia Stew (100g)",
  "Limitless Chromax (1 sachet ~10g)",
  "Psyllium Husk (100g)",
  "Pastrami (100g)",
  "Whey Protein (30g / 1 scoop)",
];

const MEALS_DB = [
  { name: "Chia Yogurt Bowl (360g yogurt + 25g chia)", cal: 301, p: 34.2, c: 24.5, f: 8.5, fb: 8.3, s: 0, desc: "2x Juhayna Greek Yogurt 0.2% (180g each) + 25g chia seeds" },
  { name: "Egg Power Bowl (3 eggs + 3 whites + 200g cottage cheese)", cal: 489, p: 47.9, c: 9.6, f: 27.2, fb: 0, s: 0, desc: "3 boiled eggs (150g) + 3 egg whites (90g) + 200g full fat cottage cheese" },
  { name: "High Protein Breakfast (2 eggs + HiPRO + 60g toast)", cal: 444, p: 44, c: 39.2, f: 14.4, fb: 4, s: 11, desc: "2 boiled eggs (100g) + HiPRO Danone Strawberry (200g) + Rich Bake Brown Toast (60g)" },
  { name: "Chicken and Rice (250g chicken + 100g rice)", cal: 543, p: 79.7, c: 28, f: 9.3, fb: 0.4, s: 0, desc: "250g grilled chicken breast fillet + 100g cooked white rice" },
  { name: "Tuna Salad Plate (185g tuna + salad + 80g pita)", cal: 385, p: 48, c: 43, f: 3, fb: 5, s: 0, desc: "185g canned tuna + 100g tomato cucumber salad + 80g aish baladi" },
  { name: "Post Workout Shake (60g whey + 100g banana + 200ml milk)", cal: 399, p: 58.1, c: 39, f: 4.5, fb: 2.6, s: 12, desc: "60g whey protein (2 scoops) + 100g banana + 200ml skimmed milk" },
];

const TIPS = [
  "Drink 3-4L of water daily. Dehydration masks itself as hunger.",
  "Protein is your #1 priority every single day at 1800 kcal.",
  "Sleep 7-9hrs. Poor sleep spikes cortisol and stalls fat loss.",
  "Weigh every morning after bathroom. Track the weekly average.",
  "Progressive overload - add weight or reps each week.",
  "Veggies are basically free calories. Fill half your plate.",
  "10k steps per day burns 300-400 extra kcal without the gym.",
  "Consistency beats perfection. One bad meal changes nothing.",
];

// Starting: 105kg on Jun 2 2026, ~0.85kg/week loss
const START_WEIGHT = 105.0;
const START_DATE = "2026-06-02";

const TIMELINE = [
  { date: "15 Jun 2026", target: 103.4, dateStr: "2026-06-15" },
  { date: "01 Jul 2026", target: 101.5, dateStr: "2026-07-01" },
  { date: "15 Jul 2026", target: 99.8,  dateStr: "2026-07-15" },
  { date: "01 Aug 2026", target: 97.7,  dateStr: "2026-08-01" },
  { date: "15 Aug 2026", target: 96.0,  dateStr: "2026-08-15" },
  { date: "01 Sep 2026", target: 94.0,  dateStr: "2026-09-01" },
  { date: "15 Sep 2026", target: 92.3,  dateStr: "2026-09-15" },
  { date: "01 Oct 2026", target: 90.2,  dateStr: "2026-10-01" },
  { date: "15 Oct 2026", target: 88.5,  dateStr: "2026-10-15" },
  { date: "01 Nov 2026", target: 86.4,  dateStr: "2026-11-01" },
  { date: "15 Nov 2026", target: 84.7,  dateStr: "2026-11-15" },
  { date: "01 Dec 2026", target: 82.8,  dateStr: "2026-12-01" },
  { date: "15 Dec 2026", target: 81.1,  dateStr: "2026-12-15" },
  { date: "01 Jan 2027", target: 79.0,  dateStr: "2027-01-01" },
];

async function loadDay(date) {
  try { const d = localStorage.getItem("bodylog_" + date); return d ? JSON.parse(d) : { food: [], workouts: [], weight: null, water: 0 }; }
  catch (e) { return { food: [], workouts: [], weight: null, water: 0 }; }
}
async function saveDay(date, data) { try { localStorage.setItem("bodylog_" + date, JSON.stringify(data)); } catch (e) {} }
async function loadMeals() { try { const d = localStorage.getItem("bodylog_meals"); return d ? JSON.parse(d) : []; } catch (e) { return []; } }
async function saveMeals(meals) { try { localStorage.setItem("bodylog_meals", JSON.stringify(meals)); } catch (e) {} }
function loadCustomFoods() { try { return JSON.parse(localStorage.getItem("bodylog_custom_foods") || "[]"); } catch(e) { return []; } }
function saveCustomFoods(foods) { try { localStorage.setItem("bodylog_custom_foods", JSON.stringify(foods)); } catch(e) {} }

function Ring({ value, max, color, label }) {
  const size = 74, stroke = 7;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(value / max, 1));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)", position: "absolute" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e1e1e" strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.5s ease" }} strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: "#f0f0f0" }}>{value}</div>
          <div style={{ fontSize: 9, color: "#555" }}>/{max}</div>
        </div>
      </div>
      <div style={{ fontSize: 9, fontWeight: 700, color: color, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

// ── Interactive Timeline Row ──
function TimelineRow({ item, currentWeight, onToggle, checked, dismissed }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const milestoneDate = new Date(item.dateStr);
  milestoneDate.setHours(0, 0, 0, 0);

  const isToday = milestoneDate.getTime() === today.getTime();
  const isPast = milestoneDate < today;
  const isUnlocked = milestoneDate <= today; // today or past = actionable
  const achieved = currentWeight > 0 && currentWeight <= item.target + 0.3;
  const missed = isPast && !achieved && !checked;

  // Progress bar fill: how far along this target is on the full journey
  const totalLoss = START_WEIGHT - 75;
  const targetLoss = START_WEIGHT - item.target;
  const barFill = Math.min((targetLoss / totalLoss) * 100, 100);

  // How far user actually is toward this target
  const userLoss = currentWeight > 0 ? Math.max(0, START_WEIGHT - currentWeight) : 0;
  const userPct = Math.min((userLoss / (START_WEIGHT - item.target)) * 100, 100);

  if (dismissed) return null; // hidden once dismissed after check

  const rowBg = checked
    ? { background: "#0a1a0a", borderColor: "#1a4a1a", opacity: 0.55 }
    : isToday
    ? { background: "#0f1520", borderColor: "#1a3a6a" }
    : missed
    ? { background: "#1a0a0a", borderColor: "#3a1a1a" }
    : {};

  return (
    <div style={{
      ...card({ padding: "12px 14px", marginBottom: 10, ...rowBg }),
      transition: "all 0.3s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Checkbox — only clickable when unlocked */}
        <button
          onClick={() => isUnlocked && onToggle(item.dateStr)}
          style={{
            width: 26, height: 26, borderRadius: 7, flexShrink: 0,
            border: "2px solid",
            borderColor: checked ? "#4aff9a" : isToday ? "#4a9aff" : missed ? "#ff5a5a" : isUnlocked ? "#e8ff4a" : "#2a2a2a",
            background: checked ? "#4aff9a22" : "transparent",
            cursor: isUnlocked ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, color: checked ? "#4aff9a" : "#555",
            transition: "all 0.2s",
          }}
        >
          {checked ? "✓" : isToday ? "•" : ""}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Date + target weight row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: checked ? "#4aff9a" : isToday ? "#4a9aff" : missed ? "#ff5a5a" : isPast ? "#888" : "#666"
            }}>
              {isToday ? "📅 TODAY — " : ""}{item.date}
            </span>
            <span style={{
              fontSize: 15, fontWeight: 900,
              color: checked ? "#4aff9a" : achieved && isUnlocked ? "#4aff9a" : missed ? "#ff5a5a" : "#e8ff4a"
            }}>
              {item.target} kg
            </span>
          </div>

          {/* Dual progress bar */}
          <div style={{ position: "relative", background: "#1a1a1a", borderRadius: 20, height: 5, overflow: "hidden" }}>
            {/* Journey bar (grey bg shows how far this milestone is) */}
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: barFill + "%", background: "#222", borderRadius: 20 }} />
            {/* User progress bar */}
            <div style={{
              position: "absolute", left: 0, top: 0, height: "100%",
              width: userPct + "%",
              background: checked ? "#4aff9a" : achieved ? "#4aff9a" : missed ? "#ff5a5a55" : "#4a9aff",
              borderRadius: 20, transition: "width 0.6s ease",
            }} />
          </div>

          {/* Status label */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
            <span style={{ fontSize: 9, color: "#333" }}>
              {currentWeight > 0 ? `You: ${currentWeight}kg` : `Start: ${START_WEIGHT}kg`}
            </span>
            <span style={{
              fontSize: 9, fontWeight: 700,
              color: checked ? "#4aff9a" : achieved && isUnlocked ? "#4aff9a" : missed ? "#ff5a5a" : isToday ? "#4a9aff" : "#555"
            }}>
              {checked ? "✅ Done — dismissed next check-in" :
               achieved && isUnlocked ? "🎯 Hit! Tap to confirm" :
               missed ? `❌ Missed by ${(currentWeight - item.target).toFixed(1)}kg` :
               isToday ? "⚡ Due today" :
               isPast ? `${(currentWeight > 0 ? currentWeight - item.target : START_WEIGHT - item.target).toFixed(1)}kg away` :
               `${(currentWeight > 0 ? Math.max(0, currentWeight - item.target) : (START_WEIGHT - item.target)).toFixed(1)}kg to go`}
            </span>
          </div>
        </div>
      </div>

      {/* Confirm/dismiss after checking */}
      {checked && (
        <div style={{
          marginTop: 10, padding: "8px 10px",
          background: "#0d1f0d", borderRadius: 8, border: "1px solid #1a3a1a",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <span style={{ fontSize: 11, color: "#4aff9a" }}>🎉 Goal achieved! Remove from view?</span>
          <button
            onClick={() => onToggle(item.dateStr, true)}
            style={{ ...btn("#1a3a1a","#4aff9a"), fontSize: 10, padding: "5px 10px", border: "1px solid #2a5a2a" }}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export default function Tracker() {
  const [date, setDate] = useState(TODAY);
  const [day, setDay] = useState({ food: [], workouts: [], weight: null, water: 0 });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("food");
  const [foodSearch, setFoodSearch] = useState("");
  const [customFood, setCustomFood] = useState({ name: "", cal: "", p: "", c: "", f: "", fb: "", s: "" });
  const [tipIdx] = useState(() => Math.floor(Math.random() * TIPS.length));
  const [weightInput, setWeightInput] = useState("");
  const [showAddFood, setShowAddFood] = useState(false);
  const [showMeals, setShowMeals] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [qty, setQty] = useState("1");
  const [suggestions, setSuggestions] = useState(null);
  const [fiberSuggestions, setFiberSuggestions] = useState(null);
  const [savedMeals, setSavedMeals] = useState([]);
  const [newMealName, setNewMealName] = useState("");
  const [customFoods, setCustomFoods] = useState(() => loadCustomFoods());

  // ── Timeline state: checked = confirmed, dismissed = hidden ──
  const [milestoneState, setMilestoneState] = useState(() => {
    try { return JSON.parse(localStorage.getItem("bodylog_milestones2") || "{}"); } catch(e) { return {}; }
  });

  useEffect(() => {
    setLoading(true);
    loadDay(date).then(d => {
      setDay(d);
      setWeightInput(d.weight ? String(d.weight) : "");
      setLoading(false);
    });
    loadMeals().then(m => setSavedMeals(m));
  }, [date]);

  function update(nd) { setDay(nd); saveDay(date, nd); }

  const totals = day.food.reduce((a, f) => ({
    cal: a.cal + f.cal, p: a.p + f.p, c: a.c + f.c,
    f: a.f + f.f, fb: a.fb + (f.fb || 0), s: a.s + (f.s || 0)
  }), { cal: 0, p: 0, c: 0, f: 0, fb: 0, s: 0 });

  const calRemaining = GOAL_CALORIES - Math.round(totals.cal);
  const water = day.water || 0;
  const waterPct = Math.min((water / GOAL_WATER) * 100, 100);

  // Best logged weight across all days for milestone comparison
  const currentWeight = (() => {
    if (day.weight) return day.weight;
    // Fallback: scan last 14 days
    for (let i = 1; i <= 14; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      try {
        const stored = localStorage.getItem("bodylog_" + key);
        if (stored) { const parsed = JSON.parse(stored); if (parsed.weight) return parsed.weight; }
      } catch(e) {}
    }
    return START_WEIGHT;
  })();

  function handleMilestoneToggle(dateStr, dismiss = false) {
    const prev = milestoneState[dateStr] || {};
    let updated;
    if (dismiss) {
      updated = { ...milestoneState, [dateStr]: { checked: true, dismissed: true } };
    } else {
      // Toggle checked
      const wasChecked = prev.checked && !prev.dismissed;
      updated = { ...milestoneState, [dateStr]: { checked: !wasChecked, dismissed: false } };
    }
    setMilestoneState(updated);
    try { localStorage.setItem("bodylog_milestones2", JSON.stringify(updated)); } catch(e) {}
  }

  function addFood(food) {
    update({ ...day, food: [...day.food, { ...food, id: Date.now() }] });
    setFoodSearch(""); setShowAddFood(false); setSelectedFood(null); setQty("1");
  }
  function removeFood(id) { update({ ...day, food: day.food.filter(f => f.id !== id) }); }
  function addCustomFood() {
    if (!customFood.name || !customFood.cal) return;
    const newEntry = { name: customFood.name, cal: +customFood.cal, p: +customFood.p||0, c: +customFood.c||0, f: +customFood.f||0, fb: +customFood.fb||0, s: +customFood.s||0 };
    // Save to persistent custom foods list if not already there
    const existing = loadCustomFoods();
    if (!existing.find(f => f.name.toLowerCase() === newEntry.name.toLowerCase())) {
      const updated = [...existing, newEntry];
      saveCustomFoods(updated);
      setCustomFoods(updated);
    }
    addFood(newEntry);
    setCustomFood({ name: "", cal: "", p: "", c: "", f: "", fb: "", s: "" });
  }
  function saveWeight() { if (weightInput) update({ ...day, weight: +weightInput }); }
  function addWater(ml) { update({ ...day, water: Math.max(0, water + ml) }); }

  const ALL_FOODS = [...FOOD_DB, ...customFoods.filter(cf => !FOOD_DB.find(f => f.name.toLowerCase() === cf.name.toLowerCase()))];
  const search = foodSearch.toLowerCase();
  const filtered = search
    ? ALL_FOODS.filter(f => f.name.toLowerCase().includes(search))
        .sort((a, b) => {
          const ai = a.name.toLowerCase().indexOf(search);
          const bi = b.name.toLowerCase().indexOf(search);
          // custom foods float to top if they match
          const ac = customFoods.find(cf => cf.name === a.name) ? -1000 : 0;
          const bc = customFoods.find(cf => cf.name === b.name) ? -1000 : 0;
          return (ai + ac) - (bi + bc);
        })
    : [
        ...customFoods, // custom foods always show first in popular
        ...FOOD_DB.filter(f => POPULAR.includes(f.name))
      ];

  function generateSuggestions() {
    const calLeft = GOAL_CALORIES - Math.round(totals.cal);
    const protLeft = GOAL_PROTEIN - Math.round(totals.p);
    const scored = FOOD_DB.map(f => {
      let score = 0;
      if (protLeft > 0) score += (f.p / Math.max(f.cal, 1)) * 60;
      if (f.cal > calLeft * 0.9) score -= 30;
      score += Math.random() * 25;
      return { ...f, score };
    });
    setSuggestions(scored.sort((a, b) => b.score - a.score).slice(0, 5));
  }

  function generateFiberSuggestions() {
    const calLeft = GOAL_CALORIES - Math.round(totals.cal);
    const scored = FOOD_DB.filter(f => f.fb > 0).map(f => {
      let score = (f.fb / Math.max(f.cal, 1)) * 80;
      if (f.cal > calLeft * 0.9) score -= 40;
      score += Math.random() * 20;
      return { ...f, score };
    });
    setFiberSuggestions(scored.sort((a, b) => b.score - a.score).slice(0, 5));
  }

  const TABS = [
    { key: "food", icon: "🍽", label: "Food" },
    { key: "sugar", icon: "🍬", label: "Sugar" },
    { key: "water", icon: "💧", label: "Water" },
    { key: "suggest", icon: "💡", label: "Ideas" },
    { key: "stats", icon: "📊", label: "Stats" },
  ];

  // Visible timeline milestones (not dismissed, or upcoming)
  const visibleTimeline = TIMELINE.filter(item => {
    const ms = milestoneState[item.dateStr] || {};
    return !ms.dismissed;
  });

  return (
    <div style={APP}>
      <div style={HDR}>
        <div style={ROW}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900 }}>BODY LOG <span style={{ fontSize: 12 }}>🔥</span> <span style={{ fontSize: 10, color: "#e8ff4a" }}>v16</span></div>
            <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>108kg - 183cm - 24y - 1800 kcal</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              style={{ ...INP, width: 130, fontSize: 11, padding: "6px 10px" }} />
            <button onClick={() => window.location.reload()}
              style={{ ...btn("#1a1a1a","#888"), fontSize: 10, padding: "3px 10px", border: "1px solid #2a2a2a" }}>
              Reload
            </button>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ flex: 1, background: "none", border: "none", cursor: "pointer", padding: "8px 2px",
                borderBottom: tab === t.key ? "2px solid #e8ff4a" : "2px solid transparent",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              <span style={{ fontSize: 8, color: tab === t.key ? "#e8ff4a" : "#444", fontWeight: 700, textTransform: "uppercase" }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {loading && <div style={{ textAlign: "center", padding: 60, color: "#333" }}>Loading...</div>}

      {/* FOOD TAB */}
      {!loading && tab === "food" && (
        <div style={SEC}>
          <div style={TIP}>💡 {TIPS[tipIdx]}</div>

          <div style={card({ background: calRemaining < 0 ? "#160d0d" : "#0d160d", borderColor: calRemaining < 0 ? "#3a1a1a" : "#1a3a1a" })}>
            <div style={LBL}>Calories Today</div>
            <div style={ROW}>
              <div>
                <div style={{ fontSize: 40, fontWeight: 900, color: calRemaining < 0 ? "#ff5a5a" : "#4aff9a", lineHeight: 1 }}>{Math.round(totals.cal)}</div>
                <div style={{ fontSize: 11, color: "#444", marginTop: 3 }}>of {GOAL_CALORIES} kcal</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: calRemaining < 0 ? "#ff5a5a" : "#e8ff4a" }}>{Math.abs(calRemaining)}</div>
                <div style={{ fontSize: 10, color: "#444" }}>{calRemaining >= 0 ? "remaining" : "OVER!"}</div>
              </div>
            </div>
            <div style={{ background: "#1a1a1a", borderRadius: 4, height: 5, marginTop: 12 }}>
              <div style={{ width: Math.min((totals.cal / GOAL_CALORIES) * 100, 100) + "%", height: "100%", background: calRemaining < 0 ? "#ff5a5a" : "#4aff9a", borderRadius: 4, transition: "width 0.5s" }} />
            </div>
          </div>

          <div style={card({})}>
            <div style={LBL}>Macros Today</div>
            <div style={{ display: "flex", justifyContent: "space-around", paddingTop: 4 }}>
              <Ring value={Math.round(totals.p)} max={GOAL_PROTEIN} color="#4a9aff" label="Protein" />
              <Ring value={Math.round(totals.c)} max={GOAL_CARBS} color="#e8ff4a" label="Carbs" />
              <Ring value={Math.round(totals.f)} max={GOAL_FAT} color="#ff9a4a" label="Fat" />
              <Ring value={Math.round(totals.fb)} max={GOAL_FIBER} color="#4affca" label="Fiber" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: 8 }}>
              {[["#4a9aff", GOAL_PROTEIN+"g"], ["#e8ff4a", GOAL_CARBS+"g"], ["#ff9a4a", GOAL_FAT+"g"], ["#4affca", GOAL_FIBER+"g"]].map(item => (
                <div key={item[1]} style={{ fontSize: 9, color: item[0], textAlign: "center", opacity: 0.6 }}>goal {item[1]}</div>
              ))}
            </div>
          </div>

          <div style={LBL}>Food Log</div>
          {day.food.length === 0 && <div style={{ color: "#333", fontSize: 12, marginBottom: 12 }}>Nothing logged yet.</div>}
          {day.food.map(f => (
            <div key={f.id} style={card({ padding: "10px 12px" })}>
              <div style={ROW}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: "#ddd", marginBottom: 4 }}>{f.name}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, color: "#e8ff4a" }}>{f.cal} kcal</span>
                    <span style={mac("#4a9aff")}>P:{f.p}g</span>
                    <span style={mac("#e8ff4a")}>C:{f.c}g</span>
                    <span style={mac("#ff9a4a")}>F:{f.f}g</span>
                    {f.fb > 0 && <span style={mac("#4affca")}>Fb:{f.fb}g</span>}
                    {f.s > 0 && <span style={mac("#ff4a9a")}>S:{f.s}g</span>}
                  </div>
                </div>
                <button onClick={() => removeFood(f.id)} style={XBTN}>x</button>
              </div>
            </div>
          ))}

          {day.food.length > 0 && (
            <div style={card({ background: "#0f0f1a", borderColor: "#2a2a4a" })}>
              <div style={LBL}>Total Intake Today</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, textAlign: "center" }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#a04aff" }}>
                    {(day.food.reduce((sum, f) => {
                      const q = f.name.match(/x(\d+\.?\d*)/); const qty = q ? parseFloat(q[1]) : 1;
                      return sum + Math.round(f.cal / 1.5) * qty;
                    }, 0) / 1000).toFixed(2)}kg
                  </div>
                  <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>food weight</div>
                  <div style={{ fontSize: 9, color: "#333" }}>est.</div>
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#4a9aff" }}>{water >= 1000 ? (water/1000).toFixed(2)+"L" : water+"ml"}</div>
                  <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>water</div>
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#4aff9a" }}>
                    {((day.food.reduce((sum, f) => {
                      const q = f.name.match(/x(\d+\.?\d*)/); const qty = q ? parseFloat(q[1]) : 1;
                      return sum + Math.round(f.cal / 1.5) * qty;
                    }, 0) + water) / 1000).toFixed(2)}kg
                  </div>
                  <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>total in stomach</div>
                </div>
              </div>
            </div>
          )}

          <div style={card({})}>
            <input style={INP} placeholder={"Search " + FOOD_DB.length + " foods..."}
              value={foodSearch}
              onChange={e => { setFoodSearch(e.target.value); setSelectedFood(null); }} />
            {foodSearch && !selectedFood && (
              <div style={{ maxHeight: 280, overflowY: "auto", marginTop: 10 }}>
                {filtered.length === 0 && <div style={{ color: "#444", fontSize: 12, padding: 8 }}>No results.</div>}
                {filtered.map(f => (
                  <div key={f.name} style={CHIP} onClick={() => { setSelectedFood(f); setQty("1"); }}>
                    <span style={{ flex: 1, marginRight: 8 }}>{f.name}</span>
                    <span style={{ fontSize: 10, color: "#e8ff4a", whiteSpace: "nowrap" }}>{f.cal} kcal - P:{f.p}g</span>
                  </div>
                ))}
              </div>
            )}
            {!foodSearch && !selectedFood && (
              <div style={{ fontSize: 10, color: "#444", marginTop: 6 }}>Showing common foods - type to search all {FOOD_DB.length}</div>
            )}
          </div>

          {selectedFood && (
            <div style={card({})}>
              <div style={{ ...ROW, marginBottom: 12 }}>
                <button onClick={() => { setSelectedFood(null); setFoodSearch(""); }}
                  style={{ ...btn("#1a1a1a","#888"), fontSize: 11, padding: "6px 12px" }}>Back</button>
                <div style={{ fontSize: 12, color: "#ddd", fontWeight: 700, flex: 1, marginLeft: 8 }}>{selectedFood.name}</div>
              </div>
              <div style={LBL}>Quantity</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                <button onClick={() => setQty(v => String(Math.max(0.5, (parseFloat(v)||1) - 0.5)))}
                  style={{ ...btn("#1a1a1a","#aaa"), fontSize: 22, padding: "8px 18px", flexShrink: 0 }}>-</button>
                <input style={{ ...INP, textAlign: "center", fontSize: 22, fontWeight: 900, flex: 1, minWidth: 0 }}
                  type="number" min="0.5" step="0.5" value={qty} onChange={e => setQty(e.target.value)} />
                <button onClick={() => setQty(v => String((parseFloat(v)||1) + 0.5))}
                  style={{ ...btn("#1a1a1a","#aaa"), fontSize: 22, padding: "8px 18px", flexShrink: 0 }}>+</button>
              </div>
              <div style={{ background: "#161616", borderRadius: 10, padding: 12, marginBottom: 12, display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 4, textAlign: "center" }}>
                {[["kcal", Math.round(selectedFood.cal*(parseFloat(qty)||1)), "#e8ff4a"],
                  ["protein", (selectedFood.p*(parseFloat(qty)||1)).toFixed(1)+"g", "#4a9aff"],
                  ["carbs", (selectedFood.c*(parseFloat(qty)||1)).toFixed(1)+"g", "#e8ff4a"],
                  ["fat", (selectedFood.f*(parseFloat(qty)||1)).toFixed(1)+"g", "#ff9a4a"],
                  ["fiber", ((selectedFood.fb||0)*(parseFloat(qty)||1)).toFixed(1)+"g", "#4affca"]
                ].map(item => (
                  <div key={item[0]}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: item[2] }}>{item[1]}</div>
                    <div style={{ fontSize: 9, color: "#444" }}>{item[0]}</div>
                  </div>
                ))}
              </div>
              <button style={{ ...btn(), width: "100%" }} onClick={() => {
                const q = parseFloat(qty) || 1;
                addFood({ name: selectedFood.name + (q !== 1 ? " x"+q : ""), cal: Math.round(selectedFood.cal*q), p: +(selectedFood.p*q).toFixed(1), c: +(selectedFood.c*q).toFixed(1), f: +(selectedFood.f*q).toFixed(1), fb: +((selectedFood.fb||0)*q).toFixed(1), s: +((selectedFood.s||0)*q).toFixed(1) });
              }}>Add to Log</button>
            </div>
          )}

          <button onClick={() => { setShowMeals(!showMeals); setShowAddFood(false); setSelectedFood(null); setFoodSearch(""); }}
            style={{ ...btn("#1a2a1a","#4aff9a"), width: "100%", marginBottom: 8, border: "1px solid #2a4a2a" }}>
            {showMeals ? "- Close Meals" : "🍳 My Meals (Quick Log)"}
          </button>

          {showMeals && (
            <div style={card({})}>
              <div style={LBL}>Pre-built Meals</div>
              {MEALS_DB.concat(savedMeals).map((meal, i) => (
                <div key={i} style={card({ padding: "10px 12px", marginBottom: 8 })}>
                  <div style={{ fontSize: 12, color: "#ddd", fontWeight: 700, marginBottom: 3 }}>{meal.name}</div>
                  <div style={{ fontSize: 10, color: "#555", marginBottom: 6 }}>{meal.desc}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: "#e8ff4a" }}>{meal.cal} kcal</span>
                    <span style={mac("#4a9aff")}>P:{meal.p}g</span>
                    <span style={mac("#e8ff4a")}>C:{meal.c}g</span>
                    <span style={mac("#ff9a4a")}>F:{meal.f}g</span>
                    {meal.fb > 0 && <span style={mac("#4affca")}>Fb:{meal.fb}g</span>}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { addFood({ name: meal.name, cal: meal.cal, p: meal.p, c: meal.c, f: meal.f, fb: meal.fb, s: meal.s || 0 }); setShowMeals(false); }}
                      style={{ ...btn(), fontSize: 11, padding: "6px 12px", flex: 1 }}>+ Log This Meal</button>
                    {i >= MEALS_DB.length && (
                      <button onClick={() => { const u = savedMeals.filter((_, idx) => idx !== i - MEALS_DB.length); setSavedMeals(u); saveMeals(u); }}
                        style={{ ...btn("#1a0f0f","#ff5a5a"), fontSize: 11, padding: "6px 12px", border: "1px solid #3a1a1a" }}>Delete</button>
                    )}
                  </div>
                </div>
              ))}
              <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 12, marginTop: 4 }}>
                <div style={LBL}>Save Today's Food as a Meal</div>
                <input style={{ ...INP, marginBottom: 8 }} placeholder="Meal name e.g. My Breakfast"
                  value={newMealName} onChange={e => setNewMealName(e.target.value)} />
                <button onClick={() => {
                  if (!newMealName || day.food.length === 0) return;
                  const combined = day.food.reduce((a, f) => ({ cal: a.cal+f.cal, p: a.p+f.p, c: a.c+f.c, f: a.f+f.f, fb: a.fb+(f.fb||0), s: a.s+(f.s||0) }), { cal:0, p:0, c:0, f:0, fb:0, s:0 });
                  const meal = { name: newMealName, cal: Math.round(combined.cal), p: +combined.p.toFixed(1), c: +combined.c.toFixed(1), f: +combined.f.toFixed(1), fb: +combined.fb.toFixed(1), s: +combined.s.toFixed(1), desc: day.food.map(f => f.name).join(", ") };
                  const u = [...savedMeals, meal]; setSavedMeals(u); saveMeals(u); setNewMealName("");
                }} style={{ ...btn("#4a9aff"), width: "100%", fontSize: 12 }}>Save Today as Meal</button>
              </div>
            </div>
          )}

          <button onClick={() => setShowAddFood(!showAddFood)}
            style={{ ...btn("#161616","#666"), width: "100%", marginBottom: 12, border: "1px solid #2a2a2a", fontSize: 11 }}>
            {showAddFood ? "- Hide Custom Entry" : "+ Add Custom Food"}
          </button>
          {showAddFood && (
            <div style={card({})}>
              <div style={LBL}>Add Custom Food (auto-saved to your list)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                {[["Name","name","text"],["Calories","cal","number"],["Protein g","p","number"],["Carbs g","c","number"],["Fat g","f","number"],["Fiber g","fb","number"],["Sugar g","s","number"]].map(item => (
                  <input key={item[1]} style={{ ...INP, gridColumn: item[1] === "name" ? "1 / -1" : "auto" }} type={item[2]} placeholder={item[0]}
                    value={customFood[item[1]]} onChange={e => setCustomFood({ ...customFood, [item[1]]: e.target.value })} />
                ))}
              </div>
              <button onClick={addCustomFood} style={{ ...btn("#4a9aff"), width: "100%", marginBottom: customFoods.length > 0 ? 14 : 0 }}>
                + Add &amp; Save to My Foods
              </button>

              {customFoods.length > 0 && (
                <div>
                  <div style={{ ...LBL, marginTop: 4 }}>My Saved Custom Foods</div>
                  {customFoods.map((f, i) => (
                    <div key={i} style={{ ...ROW, paddingBottom: 8, borderBottom: "1px solid #1a1a1a", marginBottom: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, color: "#ddd", marginBottom: 2 }}>{f.name}</div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 10, color: "#e8ff4a" }}>{f.cal} kcal</span>
                          <span style={{ fontSize: 10, color: "#4a9aff" }}>P:{f.p}g</span>
                          <span style={{ fontSize: 10, color: "#ff9a4a" }}>F:{f.f}g</span>
                          {f.s > 0 && <span style={{ fontSize: 10, color: "#ff4a9a" }}>S:{f.s}g</span>}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <button onClick={() => { setSelectedFood(f); setQty("1"); setShowAddFood(false); }}
                          style={{ ...btn("#1a2a1a","#4aff9a"), fontSize: 10, padding: "5px 8px", border: "1px solid #2a4a2a" }}>Log</button>
                        <button onClick={() => {
                          const updated = customFoods.filter((_, idx) => idx !== i);
                          setCustomFoods(updated); saveCustomFoods(updated);
                        }} style={{ ...btn("#1a0f0f","#ff5a5a"), fontSize: 10, padding: "5px 8px", border: "1px solid #3a1a1a" }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SUGAR TAB */}
      {!loading && tab === "sugar" && (
        <div style={SEC}>
          <div style={card({ background: totals.s > GOAL_SUGAR ? "#1a0a0f" : "#111", borderColor: "#ff4a9a" })}>
            <div style={{ fontSize: 11, color: "#ff4a9a", fontWeight: 900, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Sugar Today</div>
            <div style={{ position: "relative", width: 150, height: 150, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={150} height={150} style={{ transform: "rotate(-90deg)", position: "absolute", top: 0, left: 0 }}>
                <circle cx={75} cy={75} r={64} fill="none" stroke="#2a0a1a" strokeWidth={13} />
                <circle cx={75} cy={75} r={64} fill="none" stroke="#ff4a9a" strokeWidth={13}
                  strokeDasharray={String(2 * 3.14159 * 64)}
                  strokeDashoffset={String(2 * 3.14159 * 64 * (1 - Math.min(totals.s / GOAL_SUGAR, 1)))}
                  style={{ transition: "stroke-dashoffset 0.6s ease" }} strokeLinecap="round" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 30, fontWeight: 900, color: totals.s > GOAL_SUGAR ? "#ff4a9a" : "#f0f0f0" }}>{Math.round(totals.s)}g</div>
                <div style={{ fontSize: 10, color: "#555" }}>of {GOAL_SUGAR}g max</div>
              </div>
            </div>
            <div style={{ background: "#2a0a1a", borderRadius: 20, height: 10, overflow: "hidden", marginBottom: 10 }}>
              <div style={{ width: Math.min((totals.s / GOAL_SUGAR) * 100, 100) + "%", height: "100%", background: "#ff4a9a", borderRadius: 20, transition: "width 0.5s" }} />
            </div>
            <div style={{ textAlign: "center", fontSize: 14, fontWeight: 900, color: totals.s > GOAL_SUGAR ? "#ff4a9a" : "#4aff9a" }}>
              {totals.s > GOAL_SUGAR ? "+" + Math.round(totals.s - GOAL_SUGAR) + "g over!" : Math.round(GOAL_SUGAR - totals.s) + "g remaining"}
            </div>
          </div>
          <div style={card({})}>
            <div style={LBL}>Sugary Foods Logged Today</div>
            {day.food.filter(f => (f.s || 0) > 0).length === 0 && <div style={{ color: "#444", fontSize: 12 }}>No sugary foods logged today.</div>}
            {day.food.filter(f => (f.s || 0) > 0).map(f => (
              <div key={f.id} style={{ ...ROW, paddingBottom: 8, borderBottom: "1px solid #1a1a1a", marginBottom: 8 }}>
                <div style={{ flex: 1, fontSize: 12, color: "#ccc" }}>{f.name}</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#ff4a9a" }}>{f.s}g</div>
              </div>
            ))}
          </div>
          <div style={card({ borderColor: "#2a1a1a" })}>
            <div style={LBL}>Worst Offenders in Your Diet</div>
            {[["Starbucks Frappuccino Caramel","50g"],["Regular Coke / Pepsi (330ml)","35g"],["Starbucks Caramel Macchiato","32g"],["Red Bull (250ml)","27g"],["Nescafe Mocha Can","22g"],["Nescafe Latte Can","20g"],["Fresh Orange Juice (200ml)","18g"],["Homemade Cake slice","30g"],["Dates (3 pieces)","16g"]].map(item => (
              <div key={item[0]} style={{ ...ROW, paddingBottom: 8, borderBottom: "1px solid #1a1a1a", marginBottom: 8 }}>
                <div style={{ flex: 1, fontSize: 11, color: "#888" }}>{item[0]}</div>
                <div style={{ fontSize: 12, fontWeight: 900, color: "#ff4a9a" }}>{item[1]}</div>
              </div>
            ))}
          </div>
          <div style={{ ...TIP, borderColor: "#2a1a2a" }}>
            WHO recommends max 25g <strong>added</strong> sugar/day for fat loss. Greek yogurt, cottage cheese and milk sugars are lactose — they don't count. Watch the canned coffees, sodas and syrups.
          </div>
        </div>
      )}

      {/* WATER TAB */}
      {!loading && tab === "water" && (
        <div style={SEC}>
          <div style={card({ background: "#0a0f1a", borderColor: "#1a2a3a", textAlign: "center", paddingTop: 20, paddingBottom: 20 })}>
            <div style={{ fontSize: 11, color: "#4a9aff", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Daily Water</div>
            <div style={{ position: "relative", width: 150, height: 150, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={150} height={150} style={{ transform: "rotate(-90deg)", position: "absolute", top: 0, left: 0 }}>
                <circle cx={75} cy={75} r={64} fill="none" stroke="#0f1f2f" strokeWidth={13} />
                <circle cx={75} cy={75} r={64} fill="none" stroke="#4a9aff" strokeWidth={13}
                  strokeDasharray={String(2 * 3.14159 * 64)}
                  strokeDashoffset={String(2 * 3.14159 * 64 * (1 - waterPct / 100))}
                  style={{ transition: "stroke-dashoffset 0.6s ease" }} strokeLinecap="round" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: "#4a9aff" }}>{water >= 1000 ? (water/1000).toFixed(1)+"L" : water+"ml"}</div>
                <div style={{ fontSize: 10, color: "#335566" }}>of 3.5L</div>
              </div>
            </div>
            <div style={{ background: "#0f1f2f", borderRadius: 20, height: 8, marginBottom: 12, overflow: "hidden" }}>
              <div style={{ width: waterPct+"%", height: "100%", background: waterPct >= 100 ? "#4aff9a" : "#4a9aff", borderRadius: 20, transition: "width 0.5s" }} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: waterPct >= 100 ? "#4aff9a" : "#4a9aff" }}>
              {waterPct >= 100 ? "Goal reached!" : (GOAL_WATER - water) + "ml remaining"}
            </div>
          </div>
          <div style={LBL}>Quick Add</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
            {[200, 330, 500, 750].map(ml => (
              <button key={ml} onClick={() => addWater(ml)}
                style={{ ...btn("#0f1f2f","#4a9aff"), border: "1px solid #1a3a5a", padding: "12px 4px", borderRadius: 10, fontSize: 12 }}>
                +{ml}ml
              </button>
            ))}
          </div>
          <div style={card({})}>
            <div style={LBL}>Custom Amount (ml)</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input id="wc" style={{ ...INP, flex: 1 }} type="number" placeholder="e.g. 600" />
              <button onClick={() => { const el = document.getElementById("wc"); const v = +el.value; if (v > 0) { addWater(v); el.value = ""; } }} style={btn("#4a9aff")}>Add</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <button onClick={() => addWater(-250)} style={{ ...btn("#1a0f0f","#ff5a5a"), flex: 1, border: "1px solid #3a1a1a", fontSize: 11 }}>Undo 250ml</button>
            <button onClick={() => update({ ...day, water: 0 })} style={{ ...btn("#1a1a1a","#555"), flex: 1, fontSize: 11 }}>Reset</button>
          </div>
          <div style={{ ...TIP, borderColor: "#1a2a3a" }}>
            At 108kg you need at least 3.5L daily. Water before meals reduces hunger. More on gym days.
          </div>
          <div style={card({})}>
            <div style={LBL}>Summary</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, textAlign: "center" }}>
              <div><div style={{ fontSize: 20 }}>💧</div><div style={{ fontSize: 15, fontWeight: 900, color: "#4a9aff", marginTop: 4 }}>{water}ml</div><div style={{ fontSize: 10, color: "#444" }}>consumed</div></div>
              <div><div style={{ fontSize: 20 }}>🎯</div><div style={{ fontSize: 15, fontWeight: 900, color: "#4a9aff", marginTop: 4 }}>3500ml</div><div style={{ fontSize: 10, color: "#444" }}>goal</div></div>
              <div><div style={{ fontSize: 20 }}>📊</div><div style={{ fontSize: 15, fontWeight: 900, color: "#4a9aff", marginTop: 4 }}>{Math.round(waterPct)}%</div><div style={{ fontSize: 10, color: "#444" }}>done</div></div>
            </div>
          </div>
        </div>
      )}

      {/* SUGGEST TAB */}
      {!loading && tab === "suggest" && (
        <div style={SEC}>
          <div style={card({})}>
            <div style={LBL}>Still Needed Today</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, textAlign: "center", marginTop: 6 }}>
              <div><div style={{ fontSize: 18, fontWeight: 900, color: calRemaining < 0 ? "#ff5a5a" : "#e8ff4a" }}>{calRemaining}</div><div style={{ fontSize: 9, color: "#444" }}>kcal</div></div>
              <div><div style={{ fontSize: 18, fontWeight: 900, color: "#4a9aff" }}>{Math.max(GOAL_PROTEIN - Math.round(totals.p), 0)}g</div><div style={{ fontSize: 9, color: "#444" }}>protein</div></div>
              <div><div style={{ fontSize: 18, fontWeight: 900, color: "#4affca" }}>{Math.max(GOAL_FIBER - Math.round(totals.fb), 0)}g</div><div style={{ fontSize: 9, color: "#444" }}>fiber</div></div>
              <div><div style={{ fontSize: 18, fontWeight: 900, color: "#60aaff" }}>{Math.max(GOAL_WATER - water, 0)}ml</div><div style={{ fontSize: 9, color: "#444" }}>water</div></div>
            </div>
          </div>
          <button onClick={generateSuggestions} style={{ ...btn(), width: "100%", padding: 14, fontSize: 13, marginBottom: 12 }}>
            {suggestions ? "Shuffle" : "Suggest What to Eat"}
          </button>
          {!suggestions && <div style={{ textAlign: "center", color: "#333", fontSize: 12, marginBottom: 20, lineHeight: 2 }}>Picks best foods based on what you still need.</div>}
          {suggestions && suggestions.map((f, i) => (
            <div key={i} style={card({ borderColor: i === 0 ? "#253525" : "#1e1e1e", marginBottom: 10 })}>
              {i === 0 && <div style={{ fontSize: 9, color: "#4aff9a", fontWeight: 900, marginBottom: 6 }}>BEST PICK</div>}
              <div style={ROW}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: "#ddd", fontWeight: 700, marginBottom: 4 }}>{f.name}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, color: "#e8ff4a" }}>{f.cal} kcal</span>
                    <span style={mac("#4a9aff")}>P:{f.p}g</span>
                    {f.fb > 0 && <span style={mac("#4affca")}>Fb:{f.fb}g</span>}
                  </div>
                </div>
                <button onClick={() => { setTab("food"); setSelectedFood(f); setQty("1"); }}
                  style={{ ...btn("#1a2a1a","#4aff9a"), fontSize: 11, padding: "6px 10px", border: "1px solid #2a4a2a", marginLeft: 8 }}>+ Add</button>
              </div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #1a1a1a", marginTop: 8, paddingTop: 16 }}>
            <div style={{ fontSize: 11, color: "#4affca", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Fiber Boost</div>
            <div style={{ fontSize: 11, color: "#555", marginBottom: 10 }}>
              {Math.round(totals.fb)}g of {GOAL_FIBER}g today. {totals.fb >= GOAL_FIBER ? "Goal hit!" : (GOAL_FIBER - Math.round(totals.fb)) + "g still needed."}
            </div>
            <button onClick={generateFiberSuggestions}
              style={{ ...btn("#0f1f1a","#4affca"), width: "100%", padding: 14, fontSize: 13, marginBottom: 12, border: "1px solid #1a3a2a" }}>
              {fiberSuggestions ? "Shuffle Fiber Foods" : "Find High Fiber Foods"}
            </button>
            {fiberSuggestions && fiberSuggestions.map((f, i) => (
              <div key={i} style={card({ borderColor: i === 0 ? "#1a352a" : "#1e1e1e", marginBottom: 10 })}>
                {i === 0 && <div style={{ fontSize: 9, color: "#4affca", fontWeight: 900, marginBottom: 6 }}>BEST FIBER PICK</div>}
                <div style={ROW}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: "#ddd", fontWeight: 700, marginBottom: 4 }}>{f.name}</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, color: "#e8ff4a" }}>{f.cal} kcal</span>
                      <span style={{ fontSize: 11, color: "#4affca", fontWeight: 700 }}>Fiber: {f.fb}g</span>
                      <span style={mac("#4a9aff")}>P:{f.p}g</span>
                    </div>
                  </div>
                  <button onClick={() => { setTab("food"); setSelectedFood(f); setQty("1"); }}
                    style={{ ...btn("#0f1f1a","#4affca"), fontSize: 11, padding: "6px 10px", border: "1px solid #1a3a2a", marginLeft: 8 }}>+ Add</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STATS TAB */}
      {!loading && tab === "stats" && (
        <div style={SEC}>
          {/* Daily weight */}
          <div style={card({ borderColor: "#2a3a2a" })}>
            <div style={LBL}>Today's Weight</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input style={{ ...INP, flex: 1 }} type="number" step="0.1" placeholder="e.g. 107.2"
                value={weightInput} onChange={e => setWeightInput(e.target.value)} />
              <button onClick={saveWeight} style={btn()}>Save</button>
            </div>
            {day.weight && (
              <div>
                <div style={{ fontSize: 12, color: "#4aff9a", marginBottom: 10 }}>Logged: {day.weight} kg</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    ["Lost so far", ((START_WEIGHT - day.weight) > 0 ? (START_WEIGHT - day.weight).toFixed(1) : 0)+"kg", (START_WEIGHT - day.weight) > 0 ? "#4aff9a" : "#ff5a5a"],
                    ["To goal (85kg)", ((day.weight - 85) > 0 ? (day.weight - 85).toFixed(1) : 0)+"kg", "#e8ff4a"],
                    ["Current BMI", (day.weight / (1.83 * 1.83)).toFixed(1), "#4a9aff"],
                    ["Est. weeks to goal", Math.max(0, Math.ceil((day.weight - 85) / 0.85))+"w", "#ff9a4a"],
                  ].map(item => (
                    <div key={item[0]} style={{ background: "#161616", borderRadius: 8, padding: 10 }}>
                      <div style={{ fontSize: 9, color: "#444", textTransform: "uppercase", letterSpacing: 1 }}>{item[0]}</div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: item[2], marginTop: 2 }}>{item[1]}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── INTERACTIVE TIMELINE ── */}
          <div style={card({ borderColor: "#1a2a3a" })}>
            <div style={LBL}>Weight Loss Timeline</div>
            <div style={{ fontSize: 10, color: "#555", marginBottom: 6 }}>
              Started {START_WEIGHT}kg on May 29. ~0.85kg/week at 1800 kcal + gym 3–4x.
            </div>

            {/* Current weight vs next target banner */}
            {(() => {
              const next = visibleTimeline.find(item => {
                const ms = milestoneState[item.dateStr] || {};
                return !ms.checked;
              });
              if (!next) return <div style={{ fontSize: 12, color: "#4aff9a", marginBottom: 12 }}>🏆 All milestones complete!</div>;
              const kg2go = Math.max(0, currentWeight - next.target).toFixed(1);
              return (
                <div style={{ background: "#0a1520", border: "1px solid #1a3a5a", borderRadius: 10, padding: "10px 12px", marginBottom: 14 }}>
                  <div style={{ fontSize: 9, color: "#4a9aff", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Next Target</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: "#e8ff4a" }}>{next.target} kg</div>
                      <div style={{ fontSize: 10, color: "#555" }}>by {next.date}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: "#4a9aff" }}>{kg2go} kg</div>
                      <div style={{ fontSize: 10, color: "#555" }}>to go</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div style={{ fontSize: 9, color: "#333", marginBottom: 10 }}>
              Tap ✓ when you hit a target. Tap "Dismiss" to remove it and keep the list clean.
            </div>

            {visibleTimeline.map(item => {
              const ms = milestoneState[item.dateStr] || {};
              return (
                <TimelineRow
                  key={item.dateStr}
                  item={item}
                  currentWeight={currentWeight}
                  checked={!!ms.checked && !ms.dismissed}
                  dismissed={!!ms.dismissed}
                  onToggle={handleMilestoneToggle}
                />
              );
            })}

            {visibleTimeline.length === 0 && (
              <div style={{ textAlign: "center", padding: 20, color: "#4aff9a", fontSize: 13, fontWeight: 700 }}>
                🏆 All milestones dismissed. You're crushing it!
              </div>
            )}
          </div>

          {/* Targets */}
          <div style={card({ borderColor: "#2a2a1a" })}>
            <div style={LBL}>Your Targets</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
              {[
                ["BMR", BMR+" kcal", "Calories at rest"],
                ["TDEE", TDEE+" kcal", "Moderate activity"],
                ["Daily Target", GOAL_CALORIES+" kcal", "~1190 kcal deficit"],
                ["Protein", GOAL_PROTEIN+"g", "1.48g per kg"],
                ["Carbs", GOAL_CARBS+"g", "optimised for cutting"],
                ["Fat", GOAL_FAT+"g", "hormonal health"],
                ["Fiber", GOAL_FIBER+"g", "daily minimum"],
                ["Water", "3.5L", "daily minimum"],
              ].map(item => (
                <div key={item[0]} style={{ background: "#161616", borderRadius: 8, padding: 10 }}>
                  <div style={{ fontSize: 9, color: "#444", letterSpacing: 1, textTransform: "uppercase" }}>{item[0]}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#e8ff4a", marginTop: 2 }}>{item[1]}</div>
                  <div style={{ fontSize: 9, color: "#444", marginTop: 2 }}>{item[2]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div style={card({})}>
            <div style={LBL}>Key Milestones</div>
            {[[105,"First 3kg","#4a9aff"],[100,"Under 100kg","#e8ff4a"],[95,"Halfway","#ff9a4a"],[85,"Goal Weight","#4aff9a"]].map(item => (
              <div key={item[0]} style={{ ...ROW, marginBottom: 10 }}>
                <div style={{ fontSize: 12, color: item[2], fontWeight: 700 }}>{item[1]}</div>
                <div style={{ fontSize: 11, color: "#444" }}>{currentWeight <= item[0] ? "✅ Done!" : (currentWeight - item[0]).toFixed(1)+"kg to go"}</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: item[2] }}>{item[0]}kg</div>
              </div>
            ))}
          </div>

          <div style={{ ...TIP, borderColor: "#1a2a2a" }}>
            Started at {START_WEIGHT}kg. Target 85kg. At 0.85kg/week that is about {Math.ceil((START_WEIGHT - 85) / 0.85)} weeks from May 29.
          </div>
        </div>
      )}
    </div>
  );
}

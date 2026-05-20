import { useState, useEffect } from "react";

const TODAY = new Date().toISOString().split("T")[0];
const GOAL_CALORIES = 1800;
const GOAL_PROTEIN = 160;
const GOAL_FAT_G = 63;
const GOAL_CARBS = Math.round((GOAL_CALORIES - GOAL_PROTEIN * 4 - GOAL_FAT_G * 9) / 4);
const GOAL_FAT = GOAL_FAT_G;
const GOAL_FIBER = 35;
const GOAL_WATER = 3500;
const GOAL_SUGAR = 25; // WHO recommendation for fat loss — added sugars only
const BMR = Math.round(10 * 108 + 6.25 * 183 - 5 * 24 + 5);
const TDEE = Math.round(BMR * 1.55);

const FOOD_DB = [
  { name: "Chicken Breast (100g) raw", cal: 165, p: 31, c: 0, f: 3.6, fb: 0 },
  { name: "Chicken Breast (250g) raw", cal: 413, p: 77, c: 0, f: 9, fb: 0 },
  { name: "Chicken Thigh (100g) raw", cal: 209, p: 26, c: 0, f: 11, fb: 0 },
  { name: "Chicken Thigh (250g) raw", cal: 523, p: 65, c: 0, f: 27.5, fb: 0 },
  { name: "Grilled Chicken (100g) cooked", cal: 155, p: 30, c: 0, f: 3.4, fb: 0 },
  { name: "Beef / Meat (100g) raw", cal: 195, p: 25, c: 0, f: 10, fb: 0 },
  { name: "Beef / Meat (250g) raw", cal: 488, p: 62, c: 0, f: 26, fb: 0 },
  { name: "Kofta (100g) cooked", cal: 220, p: 18, c: 4, f: 15, fb: 0 },
  { name: "Tuna canned (100g)", cal: 116, p: 26, c: 0, f: 1, fb: 0 },
  { name: "Tuna canned (185g full can)", cal: 175, p: 40, c: 0, f: 1.5, fb: 0 },
  { name: "Salmon (100g)", cal: 208, p: 20, c: 0, f: 13, fb: 0 },
  { name: "Sardines in water (100g)", cal: 135, p: 23, c: 0, f: 5, fb: 0 },
  { name: "Grilled Fish Fillet (100g)", cal: 130, p: 26, c: 0, f: 3, fb: 0 },
  { name: "Grilled Sea Bass (100g)", cal: 124, p: 24, c: 0, f: 3, fb: 0 },
  { name: "Shrimp cooked (100g)", cal: 99, p: 24, c: 0, f: 0.3, fb: 0 },
  { name: "Turkey Breast (100g)", cal: 135, p: 30, c: 0, f: 1, fb: 0 },
  { name: "Beef Liver (100g)", cal: 135, p: 21, c: 4, f: 4, fb: 0 },
  { name: "Boiled Egg (1)", cal: 78, p: 6, c: 0.6, f: 5, fb: 0 },
  { name: "Fried Egg (1)", cal: 90, p: 6, c: 0.4, f: 7, fb: 0 },
  { name: "Egg White (1)", cal: 17, p: 3.6, c: 0.2, f: 0, fb: 0 },
  { name: "Egg White (3)", cal: 51, p: 10.8, c: 0.6, f: 0, fb: 0 },
  { name: "Egg White (6)", cal: 102, p: 21.6, c: 1.2, f: 0, fb: 0 },
  { name: "Whey Protein (1 scoop 30g)", cal: 120, p: 25, c: 3, f: 2, fb: 0 },
  { name: "Casein Protein (1 scoop 30g)", cal: 115, p: 24, c: 4, f: 1.5, fb: 0 },
  { name: "Apple (1 medium)", cal: 95, p: 0.5, c: 25, f: 0.3, fb: 4.4, s: 19 },
  { name: "Orange (1 medium)", cal: 62, p: 1.2, c: 15, f: 0.2, fb: 3.1, s: 12 },
  { name: "Pear (1 medium)", cal: 101, p: 0.6, c: 27, f: 0.2, fb: 5.5, s: 17 },
  { name: "Watermelon (200g)", cal: 60, p: 1.2, c: 15, f: 0.2, fb: 0.6, s: 12 },
  { name: "Mango (100g)", cal: 60, p: 0.8, c: 15, f: 0.4, fb: 1.6, s: 13 },
  { name: "Juhayna Full Cream Milk (200ml)", cal: 114, p: 6, c: 9, f: 6, fb: 0 },
  { name: "Juhayna Half Cream Milk (200ml)", cal: 88, p: 6, c: 9, f: 3, fb: 0 },
  { name: "Juhayna Skimmed Milk (200ml)", cal: 68, p: 6.5, c: 9.5, f: 0.2, fb: 0 },
  { name: "Juhayna 0% Fat Milk (200ml)", cal: 60, p: 6, c: 9, f: 0, fb: 0 },
  { name: "Juhayna Lactose Free Milk (200ml)", cal: 114, p: 6, c: 9, f: 6, fb: 0 },
  { name: "Juhayna Greek Yogurt 5% (100g)", cal: 97, p: 9, c: 4, f: 5, fb: 0 },
  { name: "Juhayna Greek Yogurt 5% (200g)", cal: 194, p: 18, c: 8, f: 10, fb: 0 },
  { name: "Juhayna Greek Yogurt 0.2% (100g)", cal: 57, p: 9.4, c: 4.1, f: 0.25, fb: 0 },
  { name: "Juhayna Greek Yogurt 0.2% (200g)", cal: 114, p: 18.8, c: 8.2, f: 0.5, fb: 0 },
  { name: "Juhayna Plain Yogurt (105g)", cal: 68, p: 4, c: 8, f: 2.5, fb: 0 },
  { name: "Juhayna Rayeb (200ml)", cal: 130, p: 7, c: 10, f: 7, fb: 0 },
  { name: "Juhayna Turkish Labneh (100g)", cal: 170, p: 8, c: 4, f: 14, fb: 0 },
  { name: "Juhayna Almond Milk (250ml)", cal: 32, p: 1, c: 4, f: 1.5, fb: 0 },
  { name: "Activia Yogurt (120g)", cal: 81, p: 4.5, c: 12, f: 1.5, fb: 0 },
  { name: "Labneh (100g)", cal: 170, p: 8, c: 4, f: 14, fb: 0 },
  { name: "Really Good Eat Choc Banana Overnight Oats (180g)", cal: 320, p: 9, c: 52, f: 8, fb: 6, s: 22 },
  { name: "Really Good Eat Date Caramel Overnight Oats (180g)", cal: 340, p: 8, c: 58, f: 7, fb: 5, s: 28 },
  { name: "Cottage Cheese low fat (100g)", cal: 72, p: 12, c: 2.7, f: 1, fb: 0, s: 2.5 },
  { name: "Cottage Cheese 0% fat (100g)", cal: 55, p: 11, c: 2.5, f: 0.2, fb: 0, s: 2 },
  { name: "Light Mozzarella (30g)", cal: 57, p: 7, c: 0.5, f: 3, fb: 0, s: 0 },
  { name: "Light Mozzarella (100g)", cal: 190, p: 24, c: 1.5, f: 10, fb: 0, s: 0 },
  { name: "Full Fat Mozzarella (30g)", cal: 80, p: 5.5, c: 0.6, f: 6.3, fb: 0, s: 0 },
  { name: "Full Fat Mozzarella (100g)", cal: 266, p: 18, c: 2, f: 21, fb: 0, s: 0 },
  { name: "Cheddar Cheese (30g)", cal: 120, p: 7.5, c: 0.1, f: 10, fb: 0, s: 0 },
  { name: "Light Cheddar (30g)", cal: 76, p: 9, c: 0.1, f: 4.5, fb: 0, s: 0 },
  { name: "Parmesan (20g)", cal: 83, p: 7.5, c: 0.7, f: 5.5, fb: 0, s: 0 },
  { name: "Cream Cheese full fat (30g)", cal: 100, p: 2, c: 1.2, f: 10, fb: 0, s: 1 },
  { name: "Light Cream Cheese (30g)", cal: 60, p: 3, c: 1.5, f: 5, fb: 0, s: 1 },
  { name: "Halloumi (30g)", cal: 90, p: 6, c: 0.3, f: 7, fb: 0, s: 0 },
  { name: "Halloumi grilled (30g)", cal: 93, p: 6.5, c: 0.3, f: 7.5, fb: 0, s: 0 },
  { name: "Ricotta (100g)", cal: 136, p: 9, c: 3, f: 10, fb: 0, s: 2 },
  { name: "Light Ricotta (100g)", cal: 98, p: 9, c: 3.5, f: 6, fb: 0, s: 2 },
  { name: "Edam Cheese (30g)", cal: 105, p: 8, c: 0.2, f: 8, fb: 0, s: 0 },
  { name: "String Cheese / Mozzarella Stick (1 piece 28g)", cal: 80, p: 7, c: 1, f: 5, fb: 0, s: 0 },
  { name: "Gouda / Romy Cheese (30g)", cal: 101, p: 7, c: 0.4, f: 8, fb: 0 },
  { name: "Whole Milk (200ml)", cal: 122, p: 6.6, c: 9.6, f: 7, fb: 0 },
  { name: "Skimmed Milk (200ml)", cal: 70, p: 7, c: 10, f: 0.2, fb: 0 },
  { name: "Almarai Butter Unsalted (10g)", cal: 75, p: 0, c: 0, f: 8, fb: 0 },
  { name: "Almarai Butter Unsalted (100g)", cal: 750, p: 0.8, c: 0.6, f: 81, fb: 0 },
  { name: "Nescafe Latte Can (250ml)", cal: 140, p: 3.5, c: 22, f: 4.5, fb: 0, s: 20 },
  { name: "Nescafe Cappuccino Can (250ml)", cal: 130, p: 3, c: 20, f: 4, fb: 0, s: 18 },
  { name: "Nescafe Mocha Can (250ml)", cal: 150, p: 3, c: 24, f: 5, fb: 0, s: 22 },
  { name: "Black Coffee", cal: 5, p: 0.3, c: 0.5, f: 0, fb: 0, s: 0 },
  { name: "Starbucks Latte (Tall 355ml)", cal: 190, p: 13, c: 19, f: 7, fb: 0, s: 18 },
  { name: "Starbucks Latte (Grande 473ml)", cal: 250, p: 17, c: 25, f: 9, fb: 0, s: 23 },
  { name: "Starbucks Cappuccino (Tall)", cal: 120, p: 8, c: 12, f: 4, fb: 0, s: 10 },
  { name: "Starbucks Americano (any size)", cal: 15, p: 1, c: 2, f: 0, fb: 0, s: 0 },
  { name: "Starbucks Caramel Macchiato (Tall)", cal: 250, p: 10, c: 34, f: 7, fb: 0, s: 32 },
  { name: "Starbucks Frappuccino Caramel (Tall)", cal: 300, p: 4, c: 53, f: 8, fb: 0, s: 50 },
  { name: "Starbucks Matcha Latte (Tall)", cal: 240, p: 12, c: 34, f: 6, fb: 1, s: 32 },
  { name: "Starbucks Cold Brew (Tall)", cal: 5, p: 0.5, c: 0, f: 0, fb: 0, s: 0 },
  { name: "Regular Pepsi / Coke (330ml)", cal: 140, p: 0, c: 35, f: 0, fb: 0, s: 35 },
  { name: "Diet Pepsi / Coke Zero (330ml)", cal: 1, p: 0, c: 0.3, f: 0, fb: 0, s: 0 },
  { name: "Fresh Orange Juice (200ml)", cal: 88, p: 1.4, c: 20, f: 0.4, fb: 0.5, s: 18 },
  { name: "Red Bull (250ml)", cal: 113, p: 1, c: 28, f: 0, fb: 0, s: 27 },
  { name: "Banana (1 medium)", cal: 89, p: 1.1, c: 23, f: 0.3, fb: 2.6, s: 12 },
  { name: "Dates (3 pieces)", cal: 70, p: 0.5, c: 18, f: 0.1, fb: 1.8, s: 16 },
  { name: "Homemade Cake slice (100g)", cal: 350, p: 4, c: 52, f: 14, fb: 1, s: 30 },
  { name: "Homemade Cake slice small (60g)", cal: 210, p: 2.5, c: 31, f: 8.5, fb: 0.5, s: 18 },
  { name: "McDonalds McFlurry Oreo", cal: 340, p: 9, c: 54, f: 10, fb: 0, s: 45 },
  { name: "HiPRO Danone Plain (200g)", cal: 148, p: 20, c: 11, f: 2.4, fb: 0, s: 9 },
  { name: "HiPRO Danone Strawberry (200g)", cal: 158, p: 20, c: 13, f: 2.4, fb: 0, s: 11 },
  { name: "HiPRO Danone Cookies and Cream (260g)", cal: 187, p: 20, c: 18, f: 2.5, fb: 0, s: 14 },
  { name: "Rich Bake Brown Toast (1 slice)", cal: 65, p: 3, c: 12, f: 1, fb: 2 },
  { name: "Rich Bake Brown Toast (2 slices)", cal: 130, p: 6, c: 24, f: 2, fb: 4 },
  { name: "Rich Bake High Protein Toast (1 slice)", cal: 70, p: 5, c: 10, f: 1.5, fb: 2.5 },
  { name: "Rich Bake High Protein Toast (2 slices)", cal: 140, p: 10, c: 20, f: 3, fb: 5 },
  { name: "Reef Chia Seeds Bread (1 loaf)", cal: 15, p: 1, c: 2.5, f: 0.1, fb: 2.9 },
  { name: "Reef Chia Seeds Bread (2 loaves)", cal: 30, p: 2, c: 5, f: 0.2, fb: 5.8 },
  { name: "Reef Oats Bread (1 loaf)", cal: 10, p: 0.8, c: 1.5, f: 0.1, fb: 2.7 },
  { name: "Reef Oats Bread (2 loaves)", cal: 20, p: 1.6, c: 3, f: 0.2, fb: 5.4 },
  { name: "Reef Barley Bread (1 loaf)", cal: 11, p: 0.8, c: 1.8, f: 0.1, fb: 2.8 },
  { name: "Reef Barley Bread (2 loaves)", cal: 22, p: 1.6, c: 3.6, f: 0.2, fb: 5.6 },
  { name: "Reef High Fiber Bread (1 loaf)", cal: 48, p: 2, c: 8, f: 0, fb: 3.6 },
  { name: "Reef High Fiber Bread (2 loaves)", cal: 96, p: 4, c: 16, f: 0, fb: 7.2 },
  { name: "Toast Bread (2 slices)", cal: 134, p: 5, c: 24, f: 2, fb: 1.2 },
  { name: "Aish Baladi / Pita (1 loaf)", cal: 170, p: 6, c: 35, f: 1, fb: 3 },
  { name: "Aish Fino (1 roll)", cal: 130, p: 4, c: 25, f: 1.5, fb: 1 },
  { name: "White Rice (100g) cooked", cal: 130, p: 2.7, c: 28, f: 0.3, fb: 0.4 },
  { name: "Brown Rice (100g) cooked", cal: 122, p: 2.5, c: 25, f: 1, fb: 1.8 },
  { name: "Pasta (100g) cooked", cal: 158, p: 6, c: 31, f: 0.9, fb: 1.8 },
  { name: "Really Good Eat Choc Banana Overnight Oats (180g)", cal: 320, p: 9, c: 52, f: 8, fb: 6, s: 22 },
  { name: "Really Good Eat Date Caramel Overnight Oats (180g)", cal: 340, p: 8, c: 58, f: 7, fb: 5, s: 28 },
  { name: "Oats (100g) dry", cal: 389, p: 17, c: 66, f: 7, fb: 10 },
  { name: "Potato (100g) boiled", cal: 87, p: 1.9, c: 20, f: 0.1, fb: 1.8 },
  { name: "Potato (200g) boiled", cal: 174, p: 3.8, c: 40, f: 0.2, fb: 3.6 },
  { name: "Sweet Potato (100g)", cal: 86, p: 1.6, c: 20, f: 0.1, fb: 3 },
  { name: "Broccoli (100g)", cal: 34, p: 2.8, c: 7, f: 0.4, fb: 2.6 },
  { name: "Cucumber (100g)", cal: 16, p: 0.7, c: 3.6, f: 0.1, fb: 0.5 },
  { name: "Tomato (1 medium)", cal: 22, p: 1, c: 4.8, f: 0.2, fb: 1.5 },
  { name: "Lettuce / Salad Leaves (100g)", cal: 15, p: 1.4, c: 2.9, f: 0.2, fb: 1.3 },
  { name: "Spinach raw (100g)", cal: 23, p: 2.9, c: 3.6, f: 0.4, fb: 2.2 },
  { name: "Carrots (100g)", cal: 41, p: 0.9, c: 10, f: 0.2, fb: 2.8 },
  { name: "Courgette (100g)", cal: 17, p: 1.2, c: 3.1, f: 0.3, fb: 1 },
  { name: "Spinach in Red Soup (300g)", cal: 130, p: 7, c: 12, f: 6, fb: 4 },
  { name: "Okra in Green Soup / bamia (300g)", cal: 110, p: 5, c: 14, f: 4, fb: 5 },
  { name: "Taro in Green Soup / 2al2as (300g)", cal: 175, p: 4, c: 35, f: 3, fb: 4 },
  { name: "Molokhia (bowl 300ml)", cal: 105, p: 5, c: 10, f: 5, fb: 3 },
  { name: "Lentil Soup (bowl 300ml)", cal: 165, p: 10, c: 28, f: 2, fb: 8 },
  { name: "Vegetable Soup (bowl 300ml)", cal: 70, p: 3, c: 12, f: 1.5, fb: 3 },
  { name: "Cooked Spinach (100g)", cal: 35, p: 3.5, c: 4, f: 1, fb: 2.4 },
  { name: "Cooked Okra / bamia (100g)", cal: 45, p: 2, c: 8, f: 0.5, fb: 3.2 },
  { name: "Stuffed Vine Leaves (5 pieces)", cal: 170, p: 4, c: 22, f: 7, fb: 2 },
  { name: "Mahshi Kousa (2 pieces)", cal: 180, p: 7, c: 20, f: 8, fb: 2 },
  { name: "Ful Medames (200g)", cal: 190, p: 13, c: 30, f: 2, fb: 9 },
  { name: "Ful with Oil and Lemon (200g)", cal: 240, p: 13, c: 30, f: 8, fb: 9 },
  { name: "Falafel / ta3meya (1 piece)", cal: 57, p: 2.5, c: 6, f: 3, fb: 1.5 },
  { name: "Koshari (300g bowl)", cal: 380, p: 12, c: 72, f: 5, fb: 7 },
  { name: "Macarona Bechamel (200g)", cal: 320, p: 14, c: 35, f: 13, fb: 2 },
  { name: "Hawawshi (1 piece 150g)", cal: 350, p: 20, c: 28, f: 16, fb: 1 },
  { name: "Shawarma Chicken (wrap)", cal: 380, p: 28, c: 35, f: 12, fb: 2 },
  { name: "Hummus (100g)", cal: 166, p: 8, c: 14, f: 10, fb: 6 },
  { name: "Tahini (1 tbsp)", cal: 89, p: 2.6, c: 3.2, f: 8, fb: 0.7 },
  { name: "Baba Ghanoush (100g)", cal: 88, p: 2, c: 9, f: 5, fb: 2.5 },
  { name: "Fattoush Salad (200g)", cal: 120, p: 3, c: 18, f: 5, fb: 3 },
  { name: "Tomato Cucumber Salad (200g)", cal: 40, p: 2, c: 8, f: 0.5, fb: 2 },
  { name: "Lentils cooked (100g)", cal: 116, p: 9, c: 20, f: 0.4, fb: 8 },
  { name: "Chickpeas cooked (100g)", cal: 164, p: 9, c: 27, f: 2.6, fb: 7.6 },
  { name: "Chia Seeds (1 tbsp)", cal: 58, p: 2, c: 5, f: 3.7, fb: 4 },
  { name: "Flaxseeds (1 tbsp)", cal: 55, p: 1.9, c: 3, f: 4.3, fb: 2.8 },
  { name: "Limitless Chromax (1 sachet)", cal: 9, p: 0, c: 2, f: 0, fb: 4.2, s: 0 },
  { name: "Psyllium Husk (1 tsp 5g)", cal: 20, p: 0, c: 5, f: 0, fb: 3.5, s: 0 },
  { name: "Psyllium Husk (1 tbsp 10g)", cal: 35, p: 0, c: 9, f: 0, fb: 7, s: 0 },
  { name: "Avocado (half)", cal: 120, p: 1.5, c: 6, f: 11, fb: 5, s: 0.5 },
  { name: "Banana (1 medium)", cal: 89, p: 1.1, c: 23, f: 0.3, fb: 2.6, s: 12 },
  { name: "Apple (1 medium)", cal: 95, p: 0.5, c: 25, f: 0.3, fb: 4.4, s: 19 },
  { name: "Orange (1 medium)", cal: 62, p: 1.2, c: 15, f: 0.2, fb: 3.1, s: 12 },
  { name: "Pear (1 medium)", cal: 101, p: 0.6, c: 27, f: 0.2, fb: 5.5, s: 17 },
  { name: "Watermelon (200g)", cal: 60, p: 1.2, c: 15, f: 0.2, fb: 0.6, s: 12 },
  { name: "Mango (100g)", cal: 60, p: 0.8, c: 15, f: 0.4, fb: 1.6, s: 13 },
  { name: "Dates (3 pieces)", cal: 70, p: 0.5, c: 18, f: 0.1, fb: 1.8, s: 16 },
  { name: "Peanut Butter (1 tbsp)", cal: 94, p: 4, c: 3, f: 8, fb: 1, s: 1 },
  { name: "Almonds (30g)", cal: 174, p: 6, c: 6, f: 15, fb: 3.5, s: 0 },
  { name: "Olive Oil (1 tbsp)", cal: 119, p: 0, c: 0, f: 14, fb: 0, s: 0 },

  // 🧀 More Dairy & Branded
  { name: "Danone Activia Strawberry (120g)", cal: 90, p: 4, c: 14, f: 1.8, fb: 0 },
  { name: "Danone Activia Plain (120g)", cal: 81, p: 4.5, c: 12, f: 1.5, fb: 0 },
  { name: "Danone Petit Filous (50g)", cal: 52, p: 3, c: 7, f: 1.2, fb: 0 },
  { name: "Almarai Full Fat Yogurt (100g)", cal: 90, p: 4.5, c: 9, f: 4, fb: 0 },
  { name: "Almarai Low Fat Yogurt (100g)", cal: 60, p: 4.5, c: 8, f: 1, fb: 0 },
  { name: "Almarai Fresh Milk Full Fat (200ml)", cal: 126, p: 6.6, c: 9.8, f: 7, fb: 0 },
  { name: "Almarai Fresh Milk Skimmed (200ml)", cal: 72, p: 7, c: 10, f: 0.2, fb: 0 },
  { name: "Almarai Laban (200ml)", cal: 110, p: 6, c: 10, f: 5, fb: 0 },
  { name: "Almarai Cream Cheese (30g)", cal: 90, p: 2, c: 1, f: 9, fb: 0 },
  { name: "Juhayna Flavored Yogurt Strawberry (120g)", cal: 95, p: 4, c: 16, f: 1.5, fb: 0 },
  { name: "Juhayna Flavored Yogurt Mango (120g)", cal: 98, p: 4, c: 17, f: 1.5, fb: 0 },
  { name: "Juhayna Laban (200ml)", cal: 108, p: 6, c: 10, f: 5, fb: 0 },
  { name: "Juhayna Cream (100ml)", cal: 292, p: 2, c: 3.5, f: 30, fb: 0 },

  // ☕ Coffee Shops & Starbucks
  { name: "Cafe Latte with whole milk (250ml)", cal: 150, p: 8, c: 12, f: 6, fb: 0, s: 10 },
  { name: "Cafe Latte with skimmed milk (250ml)", cal: 100, p: 8, c: 12, f: 1.5, fb: 0, s: 10 },
  { name: "Flat White (250ml)", cal: 160, p: 10, c: 14, f: 6, fb: 0, s: 11 },
  { name: "Espresso (single shot)", cal: 5, p: 0.3, c: 0.5, f: 0, fb: 0, s: 0 },
  { name: "Turkish Coffee (unsweetened)", cal: 5, p: 0.3, c: 0.5, f: 0, fb: 0, s: 0 },
  { name: "Turkish Coffee (with sugar 1 tsp)", cal: 25, p: 0.3, c: 5, f: 0, fb: 0, s: 4 },

  // 🍔 McDonald's Egypt
  { name: "McDonalds Big Mac", cal: 550, p: 28, c: 46, f: 28, fb: 3 },
  { name: "McDonalds McChicken Sandwich", cal: 430, p: 22, c: 44, f: 18, fb: 2 },
  { name: "McDonalds Crispy Chicken Sandwich", cal: 490, p: 25, c: 48, f: 22, fb: 2 },
  { name: "McDonalds McDouble", cal: 400, p: 25, c: 34, f: 18, fb: 2 },
  { name: "McDonalds French Fries Medium", cal: 320, p: 4, c: 43, f: 15, fb: 3 },
  { name: "McDonalds French Fries Large", cal: 440, p: 6, c: 59, f: 21, fb: 4 },
  { name: "McDonalds McNuggets 6pc", cal: 280, p: 15, c: 18, f: 16, fb: 0 },
  { name: "McDonalds McNuggets 9pc", cal: 420, p: 22, c: 27, f: 24, fb: 0 },
  { name: "McDonalds McFlurry Oreo", cal: 340, p: 9, c: 54, f: 10, fb: 0 },
  { name: "McDonalds Filet O Fish", cal: 390, p: 18, c: 40, f: 16, fb: 2 },

  // 🍕 Pizza Hut Egypt
  { name: "Pizza Hut Pepperoni Slice (1 slice med)", cal: 290, p: 13, c: 34, f: 12, fb: 2 },
  { name: "Pizza Hut Chicken Supreme Slice (1 slice)", cal: 270, p: 14, c: 33, f: 10, fb: 2 },
  { name: "Pizza Hut Margherita Slice (1 slice)", cal: 240, p: 11, c: 33, f: 8, fb: 2 },
  { name: "Pizza Hut Garlic Bread (2 pieces)", cal: 200, p: 5, c: 30, f: 7, fb: 1 },
  { name: "Pizza Hut Pasta Arrabiata (1 serving)", cal: 420, p: 14, c: 62, f: 12, fb: 4 },
  { name: "Pizza Hut Wings (6 pieces)", cal: 350, p: 28, c: 12, f: 22, fb: 0 },

  // 🍔 Smash Burger
  { name: "Smash Burger Single Patty (100g patty)", cal: 300, p: 22, c: 25, f: 14, fb: 1 },
  { name: "Smash Burger Double Patty", cal: 550, p: 40, c: 28, f: 30, fb: 1 },
  { name: "Smash Burger with Cheese Single", cal: 380, p: 26, c: 27, f: 20, fb: 1 },
  { name: "Smash Burger with Cheese Double", cal: 650, p: 46, c: 30, f: 38, fb: 1 },
  { name: "Smash Burger Fries (regular)", cal: 300, p: 4, c: 40, f: 14, fb: 3 },

  // 🥙 Akleh & Egyptian Street
  { name: "Akleh Feteer Meshaltet (100g)", cal: 340, p: 8, c: 42, f: 16, fb: 1 },
  { name: "Akleh Hawawshi Sandwich", cal: 420, p: 24, c: 35, f: 20, fb: 2 },
  { name: "Akleh Kofta Sandwich", cal: 380, p: 22, c: 32, f: 18, fb: 2 },
  { name: "Ta3meya Sandwich (falafel in bread)", cal: 320, p: 10, c: 45, f: 12, fb: 5 },
  { name: "Grilled Chicken Sandwich", cal: 380, p: 30, c: 34, f: 12, fb: 2 },
  { name: "Liver Sandwich / Kibda", cal: 350, p: 22, c: 32, f: 15, fb: 2 },
  { name: "Sausage / Sogo2 (100g)", cal: 280, p: 14, c: 2, f: 24, fb: 0 },
  { name: "Pastirma (30g)", cal: 100, p: 8, c: 1, f: 7, fb: 0 },

  // 🫑 More Vegetables
  { name: "Bell Pepper Red (1 medium)", cal: 37, p: 1.2, c: 7, f: 0.3, fb: 2.5 },
  { name: "Bell Pepper Green (1 medium)", cal: 24, p: 1, c: 5.5, f: 0.2, fb: 2 },
  { name: "Bell Pepper Yellow (1 medium)", cal: 50, p: 1.9, c: 12, f: 0.2, fb: 1.7 },
  { name: "Garlic (1 clove)", cal: 5, p: 0.2, c: 1, f: 0, fb: 0.1 },
  { name: "Onion (1 medium)", cal: 44, p: 1.2, c: 10, f: 0.1, fb: 1.9 },
  { name: "Eggplant / Aubergine (100g)", cal: 25, p: 1, c: 6, f: 0.2, fb: 3 },
  { name: "Cauliflower (100g)", cal: 25, p: 1.9, c: 5, f: 0.3, fb: 2 },
  { name: "Green Beans (100g)", cal: 31, p: 1.8, c: 7, f: 0.1, fb: 3.4 },
  { name: "Peas (100g)", cal: 81, p: 5.4, c: 14, f: 0.4, fb: 5.5 },
  { name: "Corn (100g cooked)", cal: 96, p: 3.4, c: 21, f: 1.5, fb: 2.4 },
  { name: "Celery (100g)", cal: 16, p: 0.7, c: 3, f: 0.2, fb: 1.6 },
  { name: "Leek (100g)", cal: 61, p: 1.5, c: 14, f: 0.3, fb: 1.8 },
  { name: "Mushrooms (100g)", cal: 22, p: 3.1, c: 3.3, f: 0.3, fb: 1 },
  { name: "Beetroot (100g)", cal: 43, p: 1.6, c: 10, f: 0.2, fb: 2.8 },

  // 🍋 More Fruits
  { name: "Strawberries (100g)", cal: 32, p: 0.7, c: 7.7, f: 0.3, fb: 2, s: 4.9 },
  { name: "Grapes (100g)", cal: 69, p: 0.7, c: 18, f: 0.2, fb: 0.9, s: 15 },
  { name: "Pomegranate (100g)", cal: 83, p: 1.7, c: 19, f: 1.2, fb: 4, s: 14 },
  { name: "Guava (1 medium 100g)", cal: 68, p: 2.6, c: 14, f: 1, fb: 5.4, s: 9 },
  { name: "Kiwi (1 medium)", cal: 61, p: 1.1, c: 15, f: 0.5, fb: 3, s: 9 },
  { name: "Peach (1 medium)", cal: 58, p: 1.4, c: 14, f: 0.4, fb: 2.3, s: 13 },
  { name: "Melon / Cantaloupe (200g)", cal: 68, p: 1.7, c: 16, f: 0.4, fb: 1.8, s: 14 },
  { name: "Figs fresh (2 medium)", cal: 74, p: 0.7, c: 19, f: 0.3, fb: 2.9, s: 16 },
  { name: "Lemon juice (1 tbsp)", cal: 3, p: 0.1, c: 1, f: 0, fb: 0.1, s: 0 },

  // 🥜 Nuts & Snacks
  { name: "Cashews (30g)", cal: 157, p: 5, c: 9, f: 12, fb: 0.9 },
  { name: "Walnuts (30g)", cal: 196, p: 4.6, c: 4, f: 19.6, fb: 2 },
  { name: "Peanuts (30g)", cal: 170, p: 7.7, c: 5, f: 14.7, fb: 2.3 },
  { name: "Pistachios (30g)", cal: 159, p: 5.7, c: 8, f: 12.8, fb: 3 },
  { name: "Sunflower Seeds (30g)", cal: 175, p: 6, c: 6, f: 15, fb: 2.4 },
  { name: "Pumpkin Seeds (30g)", cal: 163, p: 8.5, c: 4, f: 14, fb: 1.8 },
  { name: "Rice Cakes (1 plain)", cal: 35, p: 0.7, c: 7.3, f: 0.3, fb: 0.4 },
  { name: "Dark Chocolate 70% (30g)", cal: 163, p: 2.3, c: 14, f: 12, fb: 3.1 },
  { name: "Milk Chocolate (30g)", cal: 160, p: 2.5, c: 19, f: 9, fb: 0.8 },

  // 🫙 Condiments & Sauces
  { name: "Ketchup (1 tbsp)", cal: 15, p: 0.2, c: 3.7, f: 0, fb: 0.1 },
  { name: "Mayonnaise (1 tbsp)", cal: 90, p: 0.1, c: 0.5, f: 10, fb: 0 },
  { name: "Mustard (1 tsp)", cal: 3, p: 0.2, c: 0.3, f: 0.2, fb: 0.2 },
  { name: "Soy Sauce (1 tbsp)", cal: 10, p: 1, c: 1, f: 0, fb: 0 },
  { name: "Hot Sauce / Shatta (1 tbsp)", cal: 5, p: 0.2, c: 0.8, f: 0.1, fb: 0.3 },
  { name: "Tomato Paste (1 tbsp)", cal: 13, p: 0.7, c: 3, f: 0.1, fb: 0.5 },

  // 🍹 Drinks
  { name: "Fresh Mango Juice (200ml)", cal: 120, p: 1, c: 28, f: 0.5, fb: 0.8, s: 26 },
  { name: "Fresh Lemon Mint (300ml)", cal: 80, p: 0.5, c: 20, f: 0.2, fb: 0.3, s: 18 },
  { name: "Green Tea unsweetened (250ml)", cal: 2, p: 0.5, c: 0.5, f: 0, fb: 0, s: 0 },
  { name: "Protein Milk (200ml carton)", cal: 130, p: 15, c: 10, f: 3, fb: 0, s: 8 },

  // 🍚 More Carbs & Grains
  { name: "Quinoa (100g) cooked", cal: 120, p: 4.4, c: 21, f: 1.9, fb: 2.8 },
  { name: "Whole Wheat Bread (1 slice)", cal: 69, p: 3.6, c: 12, f: 1, fb: 1.9 },
  { name: "Crackers / Biscuit (5 pieces)", cal: 100, p: 2, c: 16, f: 3.5, fb: 0.5 },
  { name: "Cereal Corn Flakes (30g)", cal: 113, p: 2.4, c: 25, f: 0.2, fb: 0.9 },
];


const POPULAR = [
  "Chicken Breast (100g) raw", "Boiled Egg (1)", "HiPRO Danone Plain (200g)",
  "HiPRO Danone Strawberry (200g)", "HiPRO Danone Cookies and Cream (260g)",
  "Juhayna Greek Yogurt 0.2% (200g)", "Juhayna 0% Fat Milk (200ml)",
  "Rich Bake Brown Toast (2 slices)", "Rich Bake High Protein Toast (2 slices)",
  "Reef High Fiber Bread (1 loaf)", "Reef Chia Seeds Bread (1 loaf)",
  "Reef Barley Bread (1 loaf)", "Reef Oats Bread (1 loaf)",
  "White Rice (100g) cooked", "Oats (50g) dry", "Tuna canned (185g full can)",
  "Nescafe Latte Can (250ml)", "Nescafe Mocha Can (250ml)",
  "Banana (1 medium)", "Chicken Thigh (100g) raw",
  "Taro in Green Soup / 2al2as (300g)", "Okra in Green Soup / bamia (300g)",
  "Lentil Soup (bowl 300ml)", "Ful Medames (200g)", "Molokhia (bowl 300ml)",
  "Limitless Chromax (1 sachet)", "Psyllium Husk (1 tsp 5g)",
];

const WORKOUT_DB = [
  "Bench Press","Incline Bench Press","Decline Bench Press","Cable Fly","Chest Dips","Push-ups","Incline Dumbbell Press",
  "Deadlift","Pull-ups","Lat Pulldown","Seated Cable Row","Bent Over Row","T-Bar Row","Face Pulls","Straight Arm Pulldown",
  "Shoulder Press","Lateral Raises","Front Raises","Rear Delt Fly","Arnold Press","Upright Row",
  "Squat","Leg Press","Romanian Deadlift","Lunges","Leg Curl","Leg Extension","Calf Raises","Bulgarian Split Squat","Hack Squat",
  "Bicep Curl","Hammer Curl","Preacher Curl","Tricep Dip","Tricep Pushdown","Overhead Tricep Extension","Skull Crushers",
  "Plank","Crunches","Leg Raises","Russian Twists","Ab Wheel",
  "Running","Cycling","Jump Rope","Stairmaster","Elliptical","Walking (30min)",
  "Barbell Hip Thrust","Clean and Press","Farmer Walk","Battle Ropes","Box Jumps","Sled Push",
];

const TIPS = [
  "Drink 3-4L of water daily. Dehydration masks itself as hunger.",
  "Protein is your #1 priority every single day at 1800 kcal.",
  "Sleep 7-9hrs. Poor sleep spikes cortisol and stalls fat loss.",
  "Weigh every morning after bathroom. Track the weekly average.",
  "Progressive overload — add weight or reps each week.",
  "Veggies are basically free calories. Fill half your plate.",
  "At 1800 kcal you should lose more than 1kg per week. Stay consistent.",
  "10k steps per day burns 300-400 extra kcal without the gym.",
  "Don't skip breakfast — it regulates hunger hormones all day.",
  "Consistency beats perfection. One bad meal changes nothing.",
];

async function loadDay(date) {
  try {
    const d = localStorage.getItem("bodylog_" + date);
    if (d) {
      const parsed = JSON.parse(d);
      return parsed;
    }
    return { food: [], workouts: [], weight: null, water: 0 };
  } catch(e) {
    return { food: [], workouts: [], weight: null, water: 0 };
  }
}

async function saveDay(date, data) {
  try {
    localStorage.setItem("bodylog_" + date, JSON.stringify(data));
    // verify it saved
    localStorage.getItem("bodylog_" + date);
  } catch(e) {
    console.log("Storage full or unavailable:", e);
  }
}

function Ring({ value, max, color, label }) {
  const size = 74;
  const stroke = 7;
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

// Pre-built compound meals
const MEALS_DB = [
  {
    name: "Chia Yogurt Bowl (2x Juhayna 0.2% 170g + 25g chia)",
    cal: 315,
    p: 36.2,
    c: 24.4,
    f: 8.55,
    fb: 8.3,
    s: 0,
    desc: "2x Juhayna Greek Yogurt 0.2% fat (170g each) + 25g chia seeds"
  },
  {
    name: "Egg Power Bowl (3 eggs + 3 whites + 150g cottage cheese)",
    cal: Math.round(3*78 + 3*17 + 1.5*98),
    p: +(3*6 + 3*3.6 + 1.5*11).toFixed(1),
    c: +(3*0.6 + 3*0.2 + 1.5*3.4).toFixed(1),
    f: +(3*5 + 3*0 + 1.5*4.3).toFixed(1),
    fb: 0, s: +(1.5*3).toFixed(1),
    desc: "3 boiled eggs + 3 egg whites + 150g full fat cottage cheese"
  },
  {
    name: "High Protein Breakfast (2 eggs + 2 HiPRO + Rich Bake toast)",
    cal: 2*78 + 158 + 130,
    p: +(2*6 + 20 + 6).toFixed(1),
    c: +(2*0.6 + 13 + 24).toFixed(1),
    f: +(2*5 + 2.4 + 2).toFixed(1),
    fb: +(0 + 0 + 4).toFixed(1), s: +(0 + 11 + 0).toFixed(1),
    desc: "2 boiled eggs + HiPRO Danone Strawberry + Rich Bake Brown Toast 2 slices"
  },
  {
    name: "Chicken & Rice (250g chicken + 100g rice)",
    cal: 413 + 130,
    p: +(77 + 2.7).toFixed(1),
    c: +(0 + 28).toFixed(1),
    f: +(9 + 0.3).toFixed(1),
    fb: 0.4, s: 0,
    desc: "250g raw chicken breast + 100g cooked white rice"
  },
  {
    name: "Tuna Salad Plate (185g tuna + salad + 1 pita)",
    cal: 175 + 40 + 170,
    p: +(40 + 2 + 6).toFixed(1),
    c: +(0 + 8 + 35).toFixed(1),
    f: +(1.5 + 0.5 + 1).toFixed(1),
    fb: +(0 + 2 + 3).toFixed(1), s: 0,
    desc: "185g canned tuna + tomato cucumber salad + 1 aish baladi"
  },
  {
    name: "Post Workout Shake (2 scoops whey + banana + skimmed milk)",
    cal: 2*120 + 89 + 70,
    p: +(2*25 + 1.1 + 7).toFixed(1),
    c: +(2*3 + 23 + 10).toFixed(1),
    f: +(2*2 + 0.3 + 0.2).toFixed(1),
    fb: 2.6, s: +(0 + 12 + 0).toFixed(1),
    desc: "2 whey protein scoops + 1 banana + 200ml skimmed milk"
  },
];

async function loadMeals() {
  try {
    const d = localStorage.getItem("bodylog_meals");
    return d ? JSON.parse(d) : [];
  } catch(e) { return []; }
}
async function saveMeals(meals) {
  try { localStorage.setItem("bodylog_meals", JSON.stringify(meals)); } catch(e) {}
}

export default function Tracker() {
  const [date, setDate] = useState(TODAY);
  const [day, setDay] = useState({ food: [], workouts: [], weight: null, water: 0 });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("food");
  const [foodSearch, setFoodSearch] = useState("");
  const [customFood, setCustomFood] = useState({ name: "", cal: "", p: "", c: "", f: "", fb: "", s: "" });
  const [workoutSearch, setWorkoutSearch] = useState("");
  const [newSet, setNewSet] = useState({ exercise: "", sets: "", reps: "", weight: "" });
  const [tipIdx] = useState(() => Math.floor(Math.random() * TIPS.length));
  const [weightInput, setWeightInput] = useState("");
  const [showAddFood, setShowAddFood] = useState(false);
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [qty, setQty] = useState("1");
  const [suggestions, setSuggestions] = useState(null);
  const [fiberSuggestions, setFiberSuggestions] = useState(null);
  const [savedMeals, setSavedMeals] = useState([]);
  const [showMeals, setShowMeals] = useState(false);
  const [newMealName, setNewMealName] = useState("");

  useEffect(() => {
    setLoading(true);
    loadDay(date).then(function(d) {
      setDay(d);
      setWeightInput(d.weight ? String(d.weight) : "");
      setLoading(false);
    });
    loadMeals().then(function(m) { setSavedMeals(m); });
  }, [date]);

  function update(newDay) {
    setDay(newDay);
    saveDay(date, newDay);
  }

  var totals = day.food.reduce(function(a, f) {
    return { cal: a.cal + f.cal, p: a.p + f.p, c: a.c + f.c, f: a.f + f.f, fb: a.fb + (f.fb || 0), s: a.s + (f.s || 0) };
  }, { cal: 0, p: 0, c: 0, f: 0, fb: 0, s: 0 });

  var calRemaining = GOAL_CALORIES - Math.round(totals.cal);
  var water = day.water || 0;
  var waterPct = Math.min((water / GOAL_WATER) * 100, 100);

  function addFood(food) {
    update({ ...day, food: [...day.food, { ...food, id: Date.now() }] });
    setFoodSearch(""); setShowAddFood(false); setSelectedFood(null); setQty("1");
  }
  function removeFood(id) { update({ ...day, food: day.food.filter(function(f) { return f.id !== id; }) }); }
  function addCustomFood() {
    if (!customFood.name || !customFood.cal) return;
    addFood({ name: customFood.name, cal: +customFood.cal, p: +customFood.p||0, c: +customFood.c||0, f: +customFood.f||0, fb: +customFood.fb||0, s: +customFood.s||0 });
    setCustomFood({ name: "", cal: "", p: "", c: "", f: "", fb: "", s: "" });
  }
  function addWorkout() {
    if (!newSet.exercise) return;
    update({ ...day, workouts: [...day.workouts, { ...newSet, id: Date.now() }] });
    setNewSet({ exercise: "", sets: "", reps: "", weight: "" }); setShowAddWorkout(false);
  }
  function removeWorkout(id) { update({ ...day, workouts: day.workouts.filter(function(w) { return w.id !== id; }) }); }
  function saveWeight() { if (weightInput) update({ ...day, weight: +weightInput }); }

  function addWater(ml) {
    var newWater = Math.max(0, water + ml);
    update({ ...day, water: newWater });
  }

  var search = foodSearch.toLowerCase();
  var filtered = search
    ? FOOD_DB.filter(function(f) { return f.name.toLowerCase().includes(search); })
    : FOOD_DB.filter(function(f) { return POPULAR.includes(f.name); });

  function generateSuggestions() {
    var calLeft = GOAL_CALORIES - Math.round(totals.cal);
    var protLeft = GOAL_PROTEIN - Math.round(totals.p);
    var fiberLeft = GOAL_FIBER - Math.round(totals.fb);
    var scored = FOOD_DB.map(function(f) {
      var score = 0;
      if (protLeft > 0) score += (f.p / Math.max(f.cal, 1)) * 60;
      if (fiberLeft > 0) score += (f.fb / Math.max(f.cal, 1)) * 20;
      if (f.cal > calLeft * 0.9) score -= 30;
      score += Math.random() * 25;
      return { ...f, score: score };
    });
    setSuggestions(scored.sort(function(a, b) { return b.score - a.score; }).slice(0, 5));
  }

  function generateFiberSuggestions() {
    var calLeft = GOAL_CALORIES - Math.round(totals.cal);
    var scored = FOOD_DB.filter(function(f) { return f.fb > 0; }).map(function(f) {
      var score = (f.fb / Math.max(f.cal, 1)) * 80;
      if (f.cal > calLeft * 0.9) score -= 40;
      score += Math.random() * 20;
      return { ...f, score: score };
    });
    setFiberSuggestions(scored.sort(function(a, b) { return b.score - a.score; }).slice(0, 5));
  }

  var S = {
    app: { minHeight: "100vh", background: "#0a0a0a", color: "#f0f0f0", fontFamily: "system-ui,sans-serif", paddingBottom: 80 },
    hdr: { background: "#0f0f0f", borderBottom: "1px solid #1a1a1a", padding: "14px 16px 0", position: "sticky", top: 0, zIndex: 100 },
    sec: { padding: "14px 16px" },
    card: function(ex) { return { background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: 14, marginBottom: 12, ...(ex||{}) }; },
    lbl: { fontSize: 10, color: "#555", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 },
    inp: { background: "#161616", border: "1px solid #252525", borderRadius: 8, padding: "10px 12px", color: "#f0f0f0", fontSize: 13, width: "100%", outline: "none", fontFamily: "inherit", boxSizing: "border-box" },
    btn: function(bg, fg) { return { background: bg||"#e8ff4a", color: fg||"#000", border: "none", borderRadius: 8, padding: "10px 14px", fontWeight: 800, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }; },
    row: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
    chip: { background: "#141414", border: "1px solid #222", borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#ccc", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
    tip: { background: "#111", border: "1px solid #1e1e1a", borderRadius: 10, padding: "11px 13px", fontSize: 12, color: "#777", lineHeight: 1.6, marginBottom: 12 },
    xbtn: { background: "none", border: "none", color: "#444", fontSize: 16, cursor: "pointer", padding: "0 4px", flexShrink: 0 },
  };

  var TABS = [
    { key: "food", icon: "🍽", label: "Food" },
    { key: "sugar", icon: "🍬", label: "Sugar" },
    { key: "water", icon: "💧", label: "Water" },
    { key: "suggest", icon: "💡", label: "Ideas" },
    { key: "stats", icon: "📊", label: "Stats" },
  ];

  return (
    <div style={S.app}>
      <div style={S.hdr}>
        <div style={S.row}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900 }}>BODY LOG 🔥 <span style={{ fontSize: 10, color: "#e8ff4a", fontWeight: 400 }}>v12</span></div>
            <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>108kg · 183cm · 24y · 1800 kcal</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
            <input type="date" value={date} onChange={function(e) { setDate(e.target.value); }}
              style={{ ...S.inp, width: 130, fontSize: 11, padding: "6px 10px" }} />
            <button onClick={function() { window.location.reload(); }}
              style={{ ...S.btn("#1a1a1a", "#888"), fontSize: 10, padding: "3px 10px", border: "1px solid #2a2a2a" }}>
              ↺ Reload
            </button>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          {TABS.map(function(t) {
            return (
              <button key={t.key} onClick={function() { setTab(t.key); }}
                style={{ flex: 1, background: "none", border: "none", cursor: "pointer", padding: "8px 2px",
                  borderBottom: tab === t.key ? "2px solid #e8ff4a" : "2px solid transparent",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <span style={{ fontSize: 18 }}>{t.icon}</span>
                <span style={{ fontSize: 8, color: tab === t.key ? "#e8ff4a" : "#444", fontWeight: 700, textTransform: "uppercase" }}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {loading && <div style={{ textAlign: "center", padding: 60, color: "#333" }}>Loading...</div>}

      {/* ── FOOD ── */}
      {!loading && tab === "food" && (
        <div style={S.sec}>
          <div style={S.tip}>💡 {TIPS[tipIdx]}</div>

          <div style={S.card({ background: calRemaining < 0 ? "#160d0d" : "#0d160d", borderColor: calRemaining < 0 ? "#3a1a1a" : "#1a3a1a" })}>
            <div style={S.lbl}>Calories Today</div>
            <div style={S.row}>
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

          <div style={S.card({})}>
            <div style={S.lbl}>Macros Today</div>
            <div style={{ display: "flex", justifyContent: "space-around", paddingTop: 4 }}>
              <Ring value={Math.round(totals.p)} max={GOAL_PROTEIN} color="#4a9aff" label="Protein" />
              <Ring value={Math.round(totals.c)} max={GOAL_CARBS} color="#e8ff4a" label="Carbs" />
              <Ring value={Math.round(totals.f)} max={GOAL_FAT} color="#ff9a4a" label="Fat" />
              <Ring value={Math.round(totals.fb)} max={GOAL_FIBER} color="#4affca" label="Fiber" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: 8 }}>
              {[["#4a9aff", GOAL_PROTEIN+"g"], ["#e8ff4a", GOAL_CARBS+"g"], ["#ff9a4a", GOAL_FAT+"g"], ["#4affca", GOAL_FIBER+"g"]].map(function(item) {
                return <div key={item[1]} style={{ fontSize: 9, color: item[0], textAlign: "center", opacity: 0.6 }}>goal {item[1]}</div>;
              })}
            </div>
          </div>

          <div style={S.lbl}>Food Log</div>
          {day.food.length === 0 && <div style={{ color: "#333", fontSize: 12, marginBottom: 12 }}>Nothing logged yet.</div>}
          {day.food.map(function(f) {
            return (
              <div key={f.id} style={S.card({ padding: "10px 12px" })}>
                <div style={S.row}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: "#ddd", marginBottom: 4 }}>{f.name}</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, color: "#e8ff4a" }}>{f.cal} kcal</span>
                      <span style={{ fontSize: 11, color: "#4a9aff", fontWeight: 700 }}>P:{f.p}g</span>
                      <span style={{ fontSize: 11, color: "#e8ff4a", fontWeight: 700 }}>C:{f.c}g</span>
                      <span style={{ fontSize: 11, color: "#ff9a4a", fontWeight: 700 }}>F:{f.f}g</span>
                      {f.fb > 0 && <span style={{ fontSize: 11, color: "#4affca", fontWeight: 700 }}>Fb:{f.fb}g</span>}
                      {f.s > 0 && <span style={{ fontSize: 11, color: "#ff4a9a", fontWeight: 700 }}>Sugar:{f.s}g</span>}
                    </div>
                  </div>
                  <button onClick={function() { removeFood(f.id); }} style={S.xbtn}>✕</button>
                </div>
              </div>
            );
          })}

          <button onClick={function() { setShowAddFood(!showAddFood); setSelectedFood(null); setFoodSearch(""); }}
            style={{ ...S.btn(), width: "100%", marginBottom: 8 }}>
            {showAddFood ? "- Close" : "+ Add Food"}
          </button>

          <button onClick={function() { setShowMeals(!showMeals); setShowAddFood(false); }}
            style={{ ...S.btn("#1a2a1a", "#4aff9a"), width: "100%", marginBottom: 12, border: "1px solid #2a4a2a" }}>
            {showMeals ? "- Close" : "🍳 My Meals (Quick Log)"}
          </button>

          {showMeals && (
            <div style={S.card({})}>
              <div style={S.lbl}>Pre-built Meals</div>
              {MEALS_DB.concat(savedMeals).map(function(meal, i) {
                return (
                  <div key={i} style={{ ...S.card({ padding: "10px 12px", marginBottom: 8 }) }}>
                    <div style={{ fontSize: 12, color: "#ddd", fontWeight: 700, marginBottom: 4 }}>{meal.name}</div>
                    <div style={{ fontSize: 10, color: "#555", marginBottom: 6 }}>{meal.desc}</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: "#e8ff4a" }}>{meal.cal} kcal</span>
                      <span style={{ fontSize: 11, color: "#4a9aff", fontWeight: 700 }}>P:{meal.p}g</span>
                      <span style={{ fontSize: 11, color: "#e8ff4a", fontWeight: 700 }}>C:{meal.c}g</span>
                      <span style={{ fontSize: 11, color: "#ff9a4a", fontWeight: 700 }}>F:{meal.f}g</span>
                      {meal.fb > 0 && <span style={{ fontSize: 11, color: "#4affca", fontWeight: 700 }}>Fb:{meal.fb}g</span>}
                      {meal.s > 0 && <span style={{ fontSize: 11, color: "#ff4a9a", fontWeight: 700 }}>S:{meal.s}g</span>}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={function() {
                        addFood({ name: meal.name, cal: meal.cal, p: meal.p, c: meal.c, f: meal.f, fb: meal.fb, s: meal.s || 0 });
                        setShowMeals(false);
                      }} style={{ ...S.btn(), fontSize: 11, padding: "6px 12px", flex: 1 }}>+ Log This Meal</button>
                      {i >= MEALS_DB.length && (
                        <button onClick={function() {
                          var updated = savedMeals.filter(function(_, idx) { return idx !== i - MEALS_DB.length; });
                          setSavedMeals(updated);
                          saveMeals(updated);
                        }} style={{ ...S.btn("#1a0f0f", "#ff5a5a"), fontSize: 11, padding: "6px 12px", border: "1px solid #3a1a1a" }}>Delete</button>
                      )}
                    </div>
                  </div>
                );
              })}

              <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 12, marginTop: 4 }}>
                <div style={S.lbl}>Save Current Log as a Meal</div>
                <div style={{ fontSize: 11, color: "#555", marginBottom: 8 }}>
                  Log all your foods first, then save them as a reusable meal.
                </div>
                <input style={{ ...S.inp, marginBottom: 8 }} placeholder="Meal name e.g. My Breakfast"
                  value={newMealName} onChange={function(e) { setNewMealName(e.target.value); }} />
                <button onClick={function() {
                  if (!newMealName || day.food.length === 0) return;
                  var combined = day.food.reduce(function(a, f) {
                    return { cal: a.cal+f.cal, p: a.p+f.p, c: a.c+f.c, f: a.f+f.f, fb: a.fb+(f.fb||0), s: a.s+(f.s||0) };
                  }, { cal: 0, p: 0, c: 0, f: 0, fb: 0, s: 0 });
                  var meal = {
                    name: newMealName,
                    cal: Math.round(combined.cal), p: +combined.p.toFixed(1),
                    c: +combined.c.toFixed(1), f: +combined.f.toFixed(1),
                    fb: +combined.fb.toFixed(1), s: +combined.s.toFixed(1),
                    desc: day.food.map(function(f) { return f.name; }).join(", ")
                  };
                  var updated = [...savedMeals, meal];
                  setSavedMeals(updated);
                  saveMeals(updated);
                  setNewMealName("");
                }} style={{ ...S.btn("#4a9aff"), width: "100%", fontSize: 12 }}>
                  Save Today's Food as Meal
                </button>
              </div>
            </div>
          )}

          {showAddFood && (
            <div style={S.card({})}>
              {!selectedFood ? (
                <div>
                  <input style={{ ...S.inp, marginBottom: 10 }} placeholder={"Search " + FOOD_DB.length + " foods..."}
                    value={foodSearch} onChange={function(e) { setFoodSearch(e.target.value); }} autoFocus />
                  {!foodSearch && <div style={{ fontSize: 10, color: "#444", marginBottom: 8 }}>Showing common foods — type to search all</div>}
                  <div style={{ maxHeight: 260, overflowY: "auto", marginBottom: 12 }}>
                    {filtered.length === 0 && <div style={{ color: "#444", fontSize: 12 }}>No results. Add custom below.</div>}
                    {filtered.map(function(f) {
                      return (
                        <div key={f.name} style={S.chip} onClick={function() { setSelectedFood(f); setQty("1"); }}>
                          <span style={{ flex: 1, marginRight: 8 }}>{f.name}</span>
                          <span style={{ fontSize: 10, color: "#e8ff4a", whiteSpace: "nowrap" }}>{f.cal} kcal · P:{f.p}g</span>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 12 }}>
                    <div style={S.lbl}>Custom Entry</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                      {[["Name","name","text"],["Calories","cal","number"],["Protein g","p","number"],["Carbs g","c","number"],["Fat g","f","number"],["Fiber g","fb","number"],["Sugar g","s","number"]].map(function(item) {
                        return (
                          <input key={item[1]} style={S.inp} type={item[2]} placeholder={item[0]}
                            value={customFood[item[1]]} onChange={function(e) { setCustomFood({ ...customFood, [item[1]]: e.target.value }); }} />
                        );
                      })}
                    </div>
                    <button onClick={addCustomFood} style={S.btn("#4a9aff")}>Add Custom</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ ...S.row, marginBottom: 12 }}>
                    <button onClick={function() { setSelectedFood(null); }}
                      style={{ background: "none", border: "1px solid #252525", borderRadius: 8, padding: "7px 11px", color: "#777", fontSize: 11, cursor: "pointer" }}>Back</button>
                    <div style={{ fontSize: 12, color: "#ddd", fontWeight: 700, flex: 1, marginLeft: 8 }}>{selectedFood.name}</div>
                  </div>
                  <div style={S.lbl}>Quantity</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                    <button onClick={function() { setQty(function(v) { return String(Math.max(0.5, (parseFloat(v)||1) - 0.5)); }); }}
                      style={{ ...S.btn("#1a1a1a","#aaa"), fontSize: 22, padding: "6px 16px" }}>-</button>
                    <input style={{ ...S.inp, textAlign: "center", fontSize: 22, fontWeight: 900 }}
                      type="number" min="0.5" step="0.5" value={qty} onChange={function(e) { setQty(e.target.value); }} />
                    <button onClick={function() { setQty(function(v) { return String((parseFloat(v)||1) + 0.5); }); }}
                      style={{ ...S.btn("#1a1a1a","#aaa"), fontSize: 22, padding: "6px 16px" }}>+</button>
                  </div>
                  <div style={{ background: "#161616", borderRadius: 10, padding: 12, marginBottom: 12, display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 4, textAlign: "center" }}>
                    {[
                      ["kcal", Math.round(selectedFood.cal * (parseFloat(qty)||1)), "#e8ff4a"],
                      ["protein", (selectedFood.p * (parseFloat(qty)||1)).toFixed(1)+"g", "#4a9aff"],
                      ["carbs", (selectedFood.c * (parseFloat(qty)||1)).toFixed(1)+"g", "#e8ff4a"],
                      ["fat", (selectedFood.f * (parseFloat(qty)||1)).toFixed(1)+"g", "#ff9a4a"],
                      ["fiber", ((selectedFood.fb||0) * (parseFloat(qty)||1)).toFixed(1)+"g", "#4affca"],
                      ["sugar", ((selectedFood.s||0) * (parseFloat(qty)||1)).toFixed(1)+"g", "#ff4a9a"],
                  ].map(function(item) {
                      return (
                        <div key={item[0]}>
                          <div style={{ fontSize: 14, fontWeight: 900, color: item[2] }}>{item[1]}</div>
                          <div style={{ fontSize: 9, color: "#444" }}>{item[0]}</div>
                        </div>
                      );
                    })}
                  </div>
                  <button style={{ ...S.btn(), width: "100%" }} onClick={function() {
                    var q = parseFloat(qty) || 1;
                    addFood({ name: selectedFood.name + (q !== 1 ? " x"+q : ""), cal: Math.round(selectedFood.cal*q), p: +(selectedFood.p*q).toFixed(1), c: +(selectedFood.c*q).toFixed(1), f: +(selectedFood.f*q).toFixed(1), fb: +((selectedFood.fb||0)*q).toFixed(1), s: +((selectedFood.s||0)*q).toFixed(1) });
                  }}>Add to Log</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── SUGAR ── */}
      {!loading && tab === "sugar" && (
        <div style={S.sec}>
          <div style={S.card({ background: totals.s > GOAL_SUGAR ? "#1a0a0f" : "#111", borderColor: "#ff4a9a" })}>
            <div style={{ fontSize: 11, color: "#ff4a9a", letterSpacing: 1, textTransform: "uppercase", fontWeight: 900, marginBottom: 12 }}>🍬 Sugar Today</div>
            <div style={{ position: "relative", width: 150, height: 150, margin: "0 auto 16px" }}>
              <svg width={150} height={150} style={{ transform: "rotate(-90deg)", position: "absolute" }}>
                <circle cx={75} cy={75} r={64} fill="none" stroke="#2a0a1a" strokeWidth={13} />
                <circle cx={75} cy={75} r={64} fill="none" stroke="#ff4a9a" strokeWidth={13}
                  strokeDasharray={String(2 * 3.14159 * 64)}
                  strokeDashoffset={String(2 * 3.14159 * 64 * (1 - Math.min(totals.s / GOAL_SUGAR, 1)))}
                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                  strokeLinecap="round" />
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
              {totals.s > GOAL_SUGAR ? "+" + Math.round(totals.s - GOAL_SUGAR) + "g over limit!" : Math.round(GOAL_SUGAR - totals.s) + "g remaining"}
            </div>
          </div>

          <div style={S.card({})}>
            <div style={S.lbl}>Sugar in Today's Food</div>
            {day.food.filter(function(f) { return (f.s || 0) > 0; }).length === 0 && (
              <div style={{ color: "#444", fontSize: 12 }}>No sugary foods logged yet today.</div>
            )}
            {day.food.filter(function(f) { return (f.s || 0) > 0; }).map(function(f) {
              return (
                <div key={f.id} style={{ ...S.row, paddingBottom: 8, borderBottom: "1px solid #1a1a1a", marginBottom: 8 }}>
                  <div style={{ flex: 1, fontSize: 12, color: "#ccc" }}>{f.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#ff4a9a" }}>{f.s}g</div>
                </div>
              );
            })}
          </div>

          <div style={S.card({ borderColor: "#2a1a1a" })}>
            <div style={S.lbl}>Worst Offenders in Your Diet</div>
            {[
              ["Starbucks Frappuccino Caramel", "50g"],
              ["Regular Coke / Pepsi (330ml)", "35g"],
              ["Starbucks Caramel Macchiato", "32g"],
              ["Starbucks Matcha Latte", "32g"],
              ["Red Bull (250ml)", "27g"],
              ["Nescafe Mocha Can", "22g"],
              ["Nescafe Latte Can", "20g"],
              ["Fresh Orange Juice (200ml)", "18g"],
              ["Homemade Cake slice", "30g"],
              ["Dates (3 pieces)", "16g"],
            ].map(function(item) {
              return (
                <div key={item[0]} style={{ ...S.row, paddingBottom: 8, borderBottom: "1px solid #1a1a1a", marginBottom: 8 }}>
                  <div style={{ flex: 1, fontSize: 11, color: "#888" }}>{item[0]}</div>
                  <div style={{ fontSize: 12, fontWeight: 900, color: "#ff4a9a" }}>{item[1]}</div>
                </div>
              );
            })}
          </div>

          <div style={{ ...S.tip, borderColor: "#2a1a2a", color: "#888" }}>
            WHO recommends max 25g added sugar/day for fat loss. One Nescafe Latte can = 20g — nearly your entire budget. Switch to black coffee or Americano and save 20g instantly every day.
          </div>
        </div>
      )}

      {/* ── WATER ── */}
      {!loading && tab === "water" && (
        <div style={S.sec}>
          <div style={S.card({ background: "#0a0f1a", borderColor: "#1a2a3a", textAlign: "center", paddingTop: 20, paddingBottom: 20 })}>
            <div style={{ fontSize: 11, color: "#4a9aff", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Daily Water</div>
            <div style={{ position: "relative", width: 150, height: 150, margin: "0 auto 16px" }}>
              <svg width={150} height={150} style={{ transform: "rotate(-90deg)", position: "absolute" }}>
                <circle cx={75} cy={75} r={64} fill="none" stroke="#0f1f2f" strokeWidth={13} />
                <circle cx={75} cy={75} r={64} fill="none" stroke="#4a9aff" strokeWidth={13}
                  strokeDasharray={String(2 * 3.14159 * 64)}
                  strokeDashoffset={String(2 * 3.14159 * 64 * (1 - waterPct / 100))}
                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                  strokeLinecap="round" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#4a9aff" }}>
                  {water >= 1000 ? (water/1000).toFixed(1)+"L" : water+"ml"}
                </div>
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

          <div style={S.lbl}>Quick Add</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
            {[200, 330, 500, 750].map(function(ml) {
              return (
                <button key={ml} onClick={function() { addWater(ml); }}
                  style={{ ...S.btn("#0f1f2f","#4a9aff"), border: "1px solid #1a3a5a", padding: "12px 4px", borderRadius: 10, fontSize: 12 }}>
                  +{ml}ml
                </button>
              );
            })}
          </div>

          <div style={S.card({})}>
            <div style={S.lbl}>Custom Amount (ml)</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input id="wc" style={{ ...S.inp, flex: 1 }} type="number" placeholder="e.g. 600" />
              <button onClick={function() {
                var el = document.getElementById("wc");
                var v = +el.value;
                if (v > 0) { addWater(v); el.value = ""; }
              }} style={S.btn("#4a9aff")}>Add</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <button onClick={function() { addWater(-250); }}
              style={{ ...S.btn("#1a0f0f","#ff5a5a"), flex: 1, border: "1px solid #3a1a1a", fontSize: 11 }}>Undo 250ml</button>
            <button onClick={function() { update({ ...day, water: 0 }); }}
              style={{ ...S.btn("#1a1a1a","#555"), flex: 1, fontSize: 11 }}>Reset</button>
          </div>

          <div style={{ ...S.tip, borderColor: "#1a2a3a" }}>
            At 108kg you need at least 3.5L daily. Water before meals reduces hunger. More on gym days.
          </div>

          <div style={S.card({})}>
            <div style={S.lbl}>Summary</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, textAlign: "center" }}>
              <div><div style={{ fontSize: 20 }}>💧</div><div style={{ fontSize: 15, fontWeight: 900, color: "#4a9aff", marginTop: 4 }}>{water}ml</div><div style={{ fontSize: 10, color: "#444" }}>consumed</div></div>
              <div><div style={{ fontSize: 20 }}>🎯</div><div style={{ fontSize: 15, fontWeight: 900, color: "#4a9aff", marginTop: 4 }}>3500ml</div><div style={{ fontSize: 10, color: "#444" }}>goal</div></div>
              <div><div style={{ fontSize: 20 }}>📊</div><div style={{ fontSize: 15, fontWeight: 900, color: "#4a9aff", marginTop: 4 }}>{Math.round(waterPct)}%</div><div style={{ fontSize: 10, color: "#444" }}>done</div></div>
            </div>
          </div>
        </div>
      )}

      {/* ── SUGGEST ── */}
      {!loading && tab === "suggest" && (
        <div style={S.sec}>
          <div style={S.card({})}>
            <div style={S.lbl}>Still Needed Today</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, textAlign: "center", marginTop: 6 }}>
              <div><div style={{ fontSize: 18, fontWeight: 900, color: calRemaining < 0 ? "#ff5a5a" : "#e8ff4a" }}>{calRemaining}</div><div style={{ fontSize: 9, color: "#444" }}>kcal</div></div>
              <div><div style={{ fontSize: 18, fontWeight: 900, color: "#4a9aff" }}>{Math.max(GOAL_PROTEIN - Math.round(totals.p), 0)}g</div><div style={{ fontSize: 9, color: "#444" }}>protein</div></div>
              <div><div style={{ fontSize: 18, fontWeight: 900, color: "#4affca" }}>{Math.max(GOAL_FIBER - Math.round(totals.fb), 0)}g</div><div style={{ fontSize: 9, color: "#444" }}>fiber</div></div>
              <div><div style={{ fontSize: 18, fontWeight: 900, color: "#60aaff" }}>{Math.max(GOAL_WATER - water, 0)}ml</div><div style={{ fontSize: 9, color: "#444" }}>water</div></div>
            </div>
          </div>

          <div style={{ fontSize: 11, color: "#555", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Best Foods For Your Goals</div>
          <button onClick={generateSuggestions} style={{ ...S.btn(), width: "100%", padding: 14, fontSize: 13, marginBottom: 12 }}>
            {suggestions ? "Shuffle" : "Suggest What to Eat"}
          </button>
          {!suggestions && <div style={{ textAlign: "center", color: "#333", fontSize: 12, marginBottom: 20, lineHeight: 2 }}>Picks best foods based on your remaining calories and protein.</div>}
          {suggestions && suggestions.map(function(f, i) {
            return (
              <div key={i} style={S.card({ borderColor: i===0 ? "#253525" : "#1e1e1e", marginBottom: 10 })}>
                {i === 0 && <div style={{ fontSize: 9, color: "#4aff9a", fontWeight: 900, marginBottom: 6 }}>BEST PICK</div>}
                <div style={S.row}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: "#ddd", fontWeight: 700, marginBottom: 4 }}>{f.name}</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, color: "#e8ff4a" }}>{f.cal} kcal</span>
                      <span style={{ fontSize: 11, color: "#4a9aff", fontWeight: 700 }}>P:{f.p}g</span>
                      {f.fb > 0 && <span style={{ fontSize: 11, color: "#4affca", fontWeight: 700 }}>Fb:{f.fb}g</span>}
                    </div>
                  </div>
                  <button onClick={function() { setTab("food"); setShowAddFood(true); setSelectedFood(f); setQty("1"); }}
                    style={{ ...S.btn("#1a2a1a","#4aff9a"), fontSize: 11, padding: "6px 10px", border: "1px solid #2a4a2a", marginLeft: 8 }}>
                    + Add
                  </button>
                </div>
              </div>
            );
          })}

          <div style={{ borderTop: "1px solid #1a1a1a", marginTop: 8, paddingTop: 16 }}>
            <div style={{ fontSize: 11, color: "#4affca", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Fiber Boost</div>
            <div style={{ fontSize: 11, color: "#555", marginBottom: 10 }}>
              {Math.round(totals.fb)}g of {GOAL_FIBER}g fiber today.
              {totals.fb >= GOAL_FIBER ? " Goal hit!" : " " + (GOAL_FIBER - Math.round(totals.fb)) + "g still needed."}
            </div>
            <button onClick={generateFiberSuggestions}
              style={{ ...S.btn("#0f1f1a","#4affca"), width: "100%", padding: 14, fontSize: 13, marginBottom: 12, border: "1px solid #1a3a2a" }}>
              {fiberSuggestions ? "Shuffle Fiber Foods" : "Find High Fiber Foods"}
            </button>
            {!fiberSuggestions && <div style={{ textAlign: "center", color: "#333", fontSize: 12, lineHeight: 2 }}>Ignoring fiber causes bloating and constant hunger. Tap to fix it.</div>}
            {fiberSuggestions && fiberSuggestions.map(function(f, i) {
              return (
                <div key={i} style={S.card({ borderColor: i===0 ? "#1a352a" : "#1e1e1e", marginBottom: 10 })}>
                  {i === 0 && <div style={{ fontSize: 9, color: "#4affca", fontWeight: 900, marginBottom: 6 }}>BEST FIBER PICK</div>}
                  <div style={S.row}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: "#ddd", fontWeight: 700, marginBottom: 4 }}>{f.name}</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, color: "#e8ff4a" }}>{f.cal} kcal</span>
                        <span style={{ fontSize: 11, color: "#4affca", fontWeight: 700 }}>Fiber: {f.fb}g</span>
                        <span style={{ fontSize: 11, color: "#4a9aff", fontWeight: 700 }}>P:{f.p}g</span>
                      </div>
                    </div>
                    <button onClick={function() { setTab("food"); setShowAddFood(true); setSelectedFood(f); setQty("1"); }}
                      style={{ ...S.btn("#0f1f1a","#4affca"), fontSize: 11, padding: "6px 10px", border: "1px solid #1a3a2a", marginLeft: 8 }}>
                      + Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── STATS ── */}
      {!loading && tab === "stats" && (
        <div style={S.sec}>
          <div style={S.card({ borderColor: "#2a2a1a" })}>
            <div style={S.lbl}>Your Targets</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
              {[
                ["BMR", BMR+" kcal", "Calories at rest"],
                ["TDEE", TDEE+" kcal", "Moderate activity"],
                ["Daily Target", GOAL_CALORIES+" kcal", "~1190 kcal deficit"],
                ["Protein", GOAL_PROTEIN+"g", "1.85g per kg"],
                ["Carbs", GOAL_CARBS+"g", "optimised for cutting"],
                ["Fat", GOAL_FAT+"g", "hormonal health"],
                ["Fiber", GOAL_FIBER+"g", "daily minimum"],
                ["Water", "3.5L", "daily minimum"],
              ].map(function(item) {
                return (
                  <div key={item[0]} style={{ background: "#161616", borderRadius: 8, padding: 10 }}>
                    <div style={{ fontSize: 9, color: "#444", letterSpacing: 1, textTransform: "uppercase" }}>{item[0]}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#e8ff4a", marginTop: 2 }}>{item[1]}</div>
                    <div style={{ fontSize: 9, color: "#444", marginTop: 2 }}>{item[2]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={S.card({})}>
            <div style={S.lbl}>Milestones</div>
            {[[105,"First 3kg","#4a9aff"],[100,"Under 100kg","#e8ff4a"],[95,"Halfway","#ff9a4a"],[85,"Goal Weight","#4aff9a"]].map(function(item) {
              return (
                <div key={item[0]} style={{ ...S.row, marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: item[2], fontWeight: 700 }}>{item[1]}</div>
                  <div style={{ fontSize: 11, color: "#444" }}>{108 > item[0] ? "Done!" : (108 - item[0])+"kg to go"}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: item[2] }}>{item[0]}kg</div>
                </div>
              );
            })}
          </div>

          <div style={{ ...S.tip, borderColor: "#1a2a2a" }}>
            BMI: {(108 / (1.83 * 1.83)).toFixed(1)} — target 85-90kg. At 1kg+ per week that is about 3 months. Protect muscle with 200g protein daily.
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// FOOD DATABASE - Comprehensive nutrition data
// ============================================================================

export const FOOD_DATABASE = [
    // ===== PROTEÍNAS =====
    { id: 'chicken_breast', name: 'Pechuga de pollo', category: 'proteinas', serving: '100g', calories: 165, protein: 31, carbs: 0, fats: 3.6, fiber: 0, sugar: 0, sodium: 74, barcode: '8410000000001' },
    { id: 'chicken_thigh', name: 'Muslo de pollo', category: 'proteinas', serving: '100g', calories: 209, protein: 26, carbs: 0, fats: 11, fiber: 0, sugar: 0, sodium: 84, barcode: '8410000000002' },
    { id: 'beef_steak', name: 'Filete de ternera', category: 'proteinas', serving: '100g', calories: 271, protein: 26, carbs: 0, fats: 18, fiber: 0, sugar: 0, sodium: 54, barcode: '8410000000003' },
    { id: 'ground_beef', name: 'Carne picada (90/10)', category: 'proteinas', serving: '100g', calories: 176, protein: 20, carbs: 0, fats: 10, fiber: 0, sugar: 0, sodium: 66, barcode: '8410000000004' },
    { id: 'pork_loin', name: 'Lomo de cerdo', category: 'proteinas', serving: '100g', calories: 143, protein: 26, carbs: 0, fats: 3.5, fiber: 0, sugar: 0, sodium: 48, barcode: '8410000000005' },
    { id: 'salmon', name: 'Salmón', category: 'proteinas', serving: '100g', calories: 208, protein: 20, carbs: 0, fats: 13, fiber: 0, sugar: 0, sodium: 59, barcode: '8410000000006' },
    { id: 'tuna_fresh', name: 'Atún fresco', category: 'proteinas', serving: '100g', calories: 144, protein: 23, carbs: 0, fats: 5, fiber: 0, sugar: 0, sodium: 39, barcode: '8410000000007' },
    { id: 'tuna_canned', name: 'Atún en lata (agua)', category: 'proteinas', serving: '100g', calories: 116, protein: 26, carbs: 0, fats: 1, fiber: 0, sugar: 0, sodium: 320, barcode: '8410000000008' },
    { id: 'cod', name: 'Bacalao', category: 'proteinas', serving: '100g', calories: 82, protein: 18, carbs: 0, fats: 0.7, fiber: 0, sugar: 0, sodium: 54, barcode: '8410000000009' },
    { id: 'shrimp', name: 'Gambas', category: 'proteinas', serving: '100g', calories: 99, protein: 24, carbs: 0, fats: 0.3, fiber: 0, sugar: 0, sodium: 111, barcode: '8410000000010' },
    { id: 'eggs_whole', name: 'Huevo entero', category: 'proteinas', serving: '1 unidad (50g)', calories: 72, protein: 6, carbs: 0.4, fats: 5, fiber: 0, sugar: 0.2, sodium: 71, barcode: '8410000000011' },
    { id: 'egg_whites', name: 'Clara de huevo', category: 'proteinas', serving: '100g', calories: 52, protein: 11, carbs: 0.7, fats: 0.2, fiber: 0, sugar: 0.7, sodium: 166, barcode: '8410000000012' },
    { id: 'turkey_breast', name: 'Pechuga de pavo', category: 'proteinas', serving: '100g', calories: 135, protein: 30, carbs: 0, fats: 1, fiber: 0, sugar: 0, sodium: 50, barcode: '8410000000013' },
    { id: 'ham_serrano', name: 'Jamón serrano', category: 'proteinas', serving: '100g', calories: 241, protein: 31, carbs: 0, fats: 13, fiber: 0, sugar: 0, sodium: 2300, barcode: '8410000000014' },

    // ===== LÁCTEOS =====
    { id: 'milk_whole', name: 'Leche entera', category: 'lacteos', serving: '250ml', calories: 149, protein: 8, carbs: 12, fats: 8, fiber: 0, sugar: 12, sodium: 105, barcode: '8410000000020' },
    { id: 'milk_semi', name: 'Leche semidesnatada', category: 'lacteos', serving: '250ml', calories: 115, protein: 8, carbs: 12, fats: 4, fiber: 0, sugar: 12, sodium: 105, barcode: '8410000000021' },
    { id: 'milk_skim', name: 'Leche desnatada', category: 'lacteos', serving: '250ml', calories: 83, protein: 8, carbs: 12, fats: 0.2, fiber: 0, sugar: 12, sodium: 105, barcode: '8410000000022' },
    { id: 'greek_yogurt', name: 'Yogur griego natural', category: 'lacteos', serving: '170g', calories: 100, protein: 17, carbs: 6, fats: 0.7, fiber: 0, sugar: 4, sodium: 65, barcode: '8410000000023' },
    { id: 'yogurt_natural', name: 'Yogur natural', category: 'lacteos', serving: '125g', calories: 69, protein: 5, carbs: 7, fats: 2, fiber: 0, sugar: 7, sodium: 70, barcode: '8410000000024' },
    { id: 'cottage_cheese', name: 'Queso cottage', category: 'lacteos', serving: '100g', calories: 98, protein: 11, carbs: 3.4, fats: 4.3, fiber: 0, sugar: 2.7, sodium: 364, barcode: '8410000000025' },
    { id: 'mozzarella', name: 'Mozzarella', category: 'lacteos', serving: '100g', calories: 280, protein: 28, carbs: 3, fats: 17, fiber: 0, sugar: 1, sodium: 627, barcode: '8410000000026' },
    { id: 'cheddar', name: 'Queso cheddar', category: 'lacteos', serving: '100g', calories: 403, protein: 25, carbs: 1.3, fats: 33, fiber: 0, sugar: 0.5, sodium: 621, barcode: '8410000000027' },
    { id: 'parmesan', name: 'Queso parmesano', category: 'lacteos', serving: '30g', calories: 117, protein: 10, carbs: 1, fats: 8, fiber: 0, sugar: 0.3, sodium: 449, barcode: '8410000000028' },
    { id: 'cream_cheese', name: 'Queso crema', category: 'lacteos', serving: '30g', calories: 99, protein: 2, carbs: 1, fats: 10, fiber: 0, sugar: 1, sodium: 91, barcode: '8410000000029' },
    { id: 'whey_protein', name: 'Proteína whey', category: 'lacteos', serving: '30g (1 scoop)', calories: 120, protein: 24, carbs: 3, fats: 1.5, fiber: 0, sugar: 2, sodium: 50, barcode: '8410000000030' },

    // ===== CARBOHIDRATOS =====
    { id: 'rice_white', name: 'Arroz blanco (cocido)', category: 'carbohidratos', serving: '100g', calories: 130, protein: 2.7, carbs: 28, fats: 0.3, fiber: 0.4, sugar: 0, sodium: 1, barcode: '8410000000040' },
    { id: 'rice_brown', name: 'Arroz integral (cocido)', category: 'carbohidratos', serving: '100g', calories: 112, protein: 2.6, carbs: 24, fats: 0.9, fiber: 1.8, sugar: 0, sodium: 1, barcode: '8410000000041' },
    { id: 'pasta_cooked', name: 'Pasta (cocida)', category: 'carbohidratos', serving: '100g', calories: 131, protein: 5, carbs: 25, fats: 1.1, fiber: 1.8, sugar: 0.6, sodium: 1, barcode: '8410000000042' },
    { id: 'bread_white', name: 'Pan blanco', category: 'carbohidratos', serving: '1 rebanada (30g)', calories: 79, protein: 2.7, carbs: 15, fats: 1, fiber: 0.6, sugar: 1.5, sodium: 147, barcode: '8410000000043' },
    { id: 'bread_whole', name: 'Pan integral', category: 'carbohidratos', serving: '1 rebanada (30g)', calories: 69, protein: 3.5, carbs: 12, fats: 1.1, fiber: 1.9, sugar: 1.4, sodium: 132, barcode: '8410000000044' },
    { id: 'oats', name: 'Avena', category: 'carbohidratos', serving: '40g', calories: 152, protein: 5.3, carbs: 27, fats: 2.7, fiber: 4, sugar: 0.4, sodium: 2, barcode: '8410000000045' },
    { id: 'potato', name: 'Patata (cocida)', category: 'carbohidratos', serving: '100g', calories: 87, protein: 1.9, carbs: 20, fats: 0.1, fiber: 1.8, sugar: 0.8, sodium: 4, barcode: '8410000000046' },
    { id: 'sweet_potato', name: 'Boniato (cocido)', category: 'carbohidratos', serving: '100g', calories: 90, protein: 2, carbs: 21, fats: 0.1, fiber: 3, sugar: 6.5, sodium: 27, barcode: '8410000000047' },
    { id: 'quinoa', name: 'Quinoa (cocida)', category: 'carbohidratos', serving: '100g', calories: 120, protein: 4.4, carbs: 21, fats: 1.9, fiber: 2.8, sugar: 0.9, sodium: 7, barcode: '8410000000048' },
    { id: 'tortilla_wrap', name: 'Tortilla/Wrap', category: 'carbohidratos', serving: '1 unidad (60g)', calories: 180, protein: 5, carbs: 30, fats: 4, fiber: 2, sugar: 1, sodium: 400, barcode: '8410000000049' },
    { id: 'cereal_cornflakes', name: 'Cereales (corn flakes)', category: 'carbohidratos', serving: '30g', calories: 112, protein: 2, carbs: 25, fats: 0.3, fiber: 0.9, sugar: 2.4, sodium: 200, barcode: '8410000000050' },

    // ===== VERDURAS =====
    { id: 'broccoli', name: 'Brócoli', category: 'verduras', serving: '100g', calories: 34, protein: 2.8, carbs: 7, fats: 0.4, fiber: 2.6, sugar: 1.7, sodium: 33, barcode: '8410000000060' },
    { id: 'spinach', name: 'Espinacas', category: 'verduras', serving: '100g', calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, fiber: 2.2, sugar: 0.4, sodium: 79, barcode: '8410000000061' },
    { id: 'tomato', name: 'Tomate', category: 'verduras', serving: '100g', calories: 18, protein: 0.9, carbs: 3.9, fats: 0.2, fiber: 1.2, sugar: 2.6, sodium: 5, barcode: '8410000000062' },
    { id: 'lettuce', name: 'Lechuga', category: 'verduras', serving: '100g', calories: 15, protein: 1.4, carbs: 2.9, fats: 0.2, fiber: 1.3, sugar: 0.8, sodium: 28, barcode: '8410000000063' },
    { id: 'cucumber', name: 'Pepino', category: 'verduras', serving: '100g', calories: 16, protein: 0.7, carbs: 3.6, fats: 0.1, fiber: 0.5, sugar: 1.7, sodium: 2, barcode: '8410000000064' },
    { id: 'carrot', name: 'Zanahoria', category: 'verduras', serving: '100g', calories: 41, protein: 0.9, carbs: 10, fats: 0.2, fiber: 2.8, sugar: 4.7, sodium: 69, barcode: '8410000000065' },
    { id: 'onion', name: 'Cebolla', category: 'verduras', serving: '100g', calories: 40, protein: 1.1, carbs: 9.3, fats: 0.1, fiber: 1.7, sugar: 4.2, sodium: 4, barcode: '8410000000066' },
    { id: 'pepper_bell', name: 'Pimiento', category: 'verduras', serving: '100g', calories: 31, protein: 1, carbs: 6, fats: 0.3, fiber: 2.1, sugar: 4.2, sodium: 4, barcode: '8410000000067' },
    { id: 'zucchini', name: 'Calabacín', category: 'verduras', serving: '100g', calories: 17, protein: 1.2, carbs: 3.1, fats: 0.3, fiber: 1, sugar: 2.5, sodium: 8, barcode: '8410000000068' },
    { id: 'mushrooms', name: 'Champiñones', category: 'verduras', serving: '100g', calories: 22, protein: 3.1, carbs: 3.3, fats: 0.3, fiber: 1, sugar: 2, sodium: 5, barcode: '8410000000069' },
    { id: 'asparagus', name: 'Espárragos', category: 'verduras', serving: '100g', calories: 20, protein: 2.2, carbs: 3.9, fats: 0.1, fiber: 2.1, sugar: 1.9, sodium: 2, barcode: '8410000000070' },
    { id: 'green_beans', name: 'Judías verdes', category: 'verduras', serving: '100g', calories: 31, protein: 1.8, carbs: 7, fats: 0.1, fiber: 3.4, sugar: 1.4, sodium: 6, barcode: '8410000000071' },

    // ===== FRUTAS =====
    { id: 'banana', name: 'Plátano', category: 'frutas', serving: '1 unidad (120g)', calories: 105, protein: 1.3, carbs: 27, fats: 0.4, fiber: 3.1, sugar: 14, sodium: 1, barcode: '8410000000080' },
    { id: 'apple', name: 'Manzana', category: 'frutas', serving: '1 unidad (180g)', calories: 95, protein: 0.5, carbs: 25, fats: 0.3, fiber: 4.4, sugar: 19, sodium: 2, barcode: '8410000000081' },
    { id: 'orange', name: 'Naranja', category: 'frutas', serving: '1 unidad (150g)', calories: 62, protein: 1.2, carbs: 15, fats: 0.2, fiber: 3.1, sugar: 12, sodium: 0, barcode: '8410000000082' },
    { id: 'strawberries', name: 'Fresas', category: 'frutas', serving: '100g', calories: 32, protein: 0.7, carbs: 7.7, fats: 0.3, fiber: 2, sugar: 4.9, sodium: 1, barcode: '8410000000083' },
    { id: 'blueberries', name: 'Arándanos', category: 'frutas', serving: '100g', calories: 57, protein: 0.7, carbs: 14, fats: 0.3, fiber: 2.4, sugar: 10, sodium: 1, barcode: '8410000000084' },
    { id: 'grapes', name: 'Uvas', category: 'frutas', serving: '100g', calories: 69, protein: 0.7, carbs: 18, fats: 0.2, fiber: 0.9, sugar: 16, sodium: 2, barcode: '8410000000085' },
    { id: 'watermelon', name: 'Sandía', category: 'frutas', serving: '100g', calories: 30, protein: 0.6, carbs: 7.6, fats: 0.2, fiber: 0.4, sugar: 6.2, sodium: 1, barcode: '8410000000086' },
    { id: 'mango', name: 'Mango', category: 'frutas', serving: '100g', calories: 60, protein: 0.8, carbs: 15, fats: 0.4, fiber: 1.6, sugar: 14, sodium: 1, barcode: '8410000000087' },
    { id: 'avocado', name: 'Aguacate', category: 'frutas', serving: '100g', calories: 160, protein: 2, carbs: 9, fats: 15, fiber: 7, sugar: 0.7, sodium: 7, barcode: '8410000000088' },
    { id: 'pineapple', name: 'Piña', category: 'frutas', serving: '100g', calories: 50, protein: 0.5, carbs: 13, fats: 0.1, fiber: 1.4, sugar: 10, sodium: 1, barcode: '8410000000089' },

    // ===== GRASAS Y ACEITES =====
    { id: 'olive_oil', name: 'Aceite de oliva', category: 'grasas', serving: '1 cucharada (15ml)', calories: 119, protein: 0, carbs: 0, fats: 13.5, fiber: 0, sugar: 0, sodium: 0, barcode: '8410000000090' },
    { id: 'butter', name: 'Mantequilla', category: 'grasas', serving: '10g', calories: 72, protein: 0.1, carbs: 0, fats: 8, fiber: 0, sugar: 0, sodium: 82, barcode: '8410000000091' },
    { id: 'almonds', name: 'Almendras', category: 'grasas', serving: '30g', calories: 173, protein: 6, carbs: 6, fats: 15, fiber: 3.5, sugar: 1.2, sodium: 0, barcode: '8410000000092' },
    { id: 'walnuts', name: 'Nueces', category: 'grasas', serving: '30g', calories: 196, protein: 4.6, carbs: 4, fats: 20, fiber: 2, sugar: 0.8, sodium: 1, barcode: '8410000000093' },
    { id: 'peanut_butter', name: 'Crema de cacahuete', category: 'grasas', serving: '30g', calories: 188, protein: 8, carbs: 6, fats: 16, fiber: 2, sugar: 3, sodium: 136, barcode: '8410000000094' },
    { id: 'coconut_oil', name: 'Aceite de coco', category: 'grasas', serving: '1 cucharada (15ml)', calories: 121, protein: 0, carbs: 0, fats: 13.5, fiber: 0, sugar: 0, sodium: 0, barcode: '8410000000095' },
    { id: 'chia_seeds', name: 'Semillas de chía', category: 'grasas', serving: '15g', calories: 73, protein: 2.5, carbs: 6, fats: 4.6, fiber: 5.1, sugar: 0, sodium: 2, barcode: '8410000000096' },

    // ===== LEGUMBRES =====
    { id: 'chickpeas', name: 'Garbanzos (cocidos)', category: 'legumbres', serving: '100g', calories: 164, protein: 9, carbs: 27, fats: 2.6, fiber: 8, sugar: 4.8, sodium: 7, barcode: '8410000000100' },
    { id: 'lentils', name: 'Lentejas (cocidas)', category: 'legumbres', serving: '100g', calories: 116, protein: 9, carbs: 20, fats: 0.4, fiber: 8, sugar: 1.8, sodium: 2, barcode: '8410000000101' },
    { id: 'black_beans', name: 'Alubias negras (cocidas)', category: 'legumbres', serving: '100g', calories: 132, protein: 9, carbs: 24, fats: 0.5, fiber: 8.7, sugar: 0.3, sodium: 1, barcode: '8410000000102' },
    { id: 'tofu', name: 'Tofu', category: 'legumbres', serving: '100g', calories: 76, protein: 8, carbs: 1.9, fats: 4.8, fiber: 0.3, sugar: 0.6, sodium: 7, barcode: '8410000000103' },
    { id: 'edamame', name: 'Edamame', category: 'legumbres', serving: '100g', calories: 121, protein: 11, carbs: 10, fats: 5, fiber: 5, sugar: 2, sodium: 6, barcode: '8410000000104' },

    // ===== BEBIDAS =====
    { id: 'coffee_black', name: 'Café solo', category: 'bebidas', serving: '250ml', calories: 2, protein: 0.3, carbs: 0, fats: 0, fiber: 0, sugar: 0, sodium: 5, barcode: '8410000000110' },
    { id: 'coffee_latte', name: 'Café con leche', category: 'bebidas', serving: '300ml', calories: 135, protein: 7, carbs: 11, fats: 6, fiber: 0, sugar: 10, sodium: 85, barcode: '8410000000111' },
    { id: 'orange_juice', name: 'Zumo de naranja', category: 'bebidas', serving: '250ml', calories: 112, protein: 2, carbs: 26, fats: 0.5, fiber: 0.5, sugar: 21, sodium: 2, barcode: '8410000000112' },
    { id: 'coca_cola', name: 'Coca-Cola', category: 'bebidas', serving: '330ml', calories: 139, protein: 0, carbs: 35, fats: 0, fiber: 0, sugar: 35, sodium: 10, barcode: '8410000000113' },
    { id: 'coca_cola_zero', name: 'Coca-Cola Zero', category: 'bebidas', serving: '330ml', calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0, sodium: 10, barcode: '8410000000114' },
    { id: 'beer', name: 'Cerveza', category: 'bebidas', serving: '330ml', calories: 153, protein: 1.6, carbs: 13, fats: 0, fiber: 0, sugar: 0, sodium: 14, barcode: '8410000000115' },
    { id: 'red_wine', name: 'Vino tinto', category: 'bebidas', serving: '150ml', calories: 125, protein: 0.1, carbs: 4, fats: 0, fiber: 0, sugar: 0.9, sodium: 6, barcode: '8410000000116' },

    // ===== SNACKS =====
    { id: 'dark_chocolate', name: 'Chocolate negro 70%', category: 'snacks', serving: '30g', calories: 170, protein: 2, carbs: 13, fats: 12, fiber: 3, sugar: 7, sodium: 6, barcode: '8410000000120' },
    { id: 'protein_bar', name: 'Barrita proteica', category: 'snacks', serving: '1 unidad (60g)', calories: 200, protein: 20, carbs: 22, fats: 6, fiber: 5, sugar: 3, sodium: 150, barcode: '8410000000121' },
    { id: 'rice_cakes', name: 'Tortitas de arroz', category: 'snacks', serving: '2 unidades (20g)', calories: 78, protein: 1.6, carbs: 17, fats: 0.4, fiber: 0.4, sugar: 0.1, sodium: 50, barcode: '8410000000122' },
    { id: 'popcorn', name: 'Palomitas (sin mantequilla)', category: 'snacks', serving: '30g', calories: 110, protein: 3, carbs: 22, fats: 1.3, fiber: 4, sugar: 0.3, sodium: 2, barcode: '8410000000123' },

    // ===== SALSAS Y CONDIMENTOS =====
    { id: 'ketchup', name: 'Ketchup', category: 'salsas', serving: '15g', calories: 17, protein: 0.2, carbs: 4, fats: 0, fiber: 0, sugar: 3.5, sodium: 154, barcode: '8410000000130' },
    { id: 'mayonnaise', name: 'Mayonesa', category: 'salsas', serving: '15g', calories: 94, protein: 0.1, carbs: 0.1, fats: 10, fiber: 0, sugar: 0.1, sodium: 88, barcode: '8410000000131' },
    { id: 'mustard', name: 'Mostaza', category: 'salsas', serving: '10g', calories: 7, protein: 0.4, carbs: 0.5, fats: 0.4, fiber: 0.3, sugar: 0.3, sodium: 175, barcode: '8410000000132' },
    { id: 'soy_sauce', name: 'Salsa de soja', category: 'salsas', serving: '15ml', calories: 9, protein: 1.3, carbs: 0.8, fats: 0, fiber: 0, sugar: 0.1, sodium: 879, barcode: '8410000000133' },
    { id: 'hummus', name: 'Hummus', category: 'salsas', serving: '30g', calories: 81, protein: 2.4, carbs: 4.5, fats: 6, fiber: 1.8, sugar: 0.4, sodium: 146, barcode: '8410000000134' },

    // ===== COMIDAS PREPARADAS COMUNES =====
    { id: 'pizza_margarita', name: 'Pizza Margarita', category: 'preparados', serving: '1 porción (100g)', calories: 266, protein: 11, carbs: 33, fats: 10, fiber: 2, sugar: 3.6, sodium: 598, barcode: '8410000000140' },
    { id: 'burger', name: 'Hamburguesa completa', category: 'preparados', serving: '1 unidad', calories: 540, protein: 25, carbs: 40, fats: 31, fiber: 2, sugar: 8, sodium: 950, barcode: '8410000000141' },
    { id: 'burrito', name: 'Burrito de pollo', category: 'preparados', serving: '1 unidad', calories: 450, protein: 22, carbs: 45, fats: 18, fiber: 4, sugar: 3, sodium: 980, barcode: '8410000000142' },
    { id: 'sushi_roll', name: 'Sushi roll (8 piezas)', category: 'preparados', serving: '8 piezas', calories: 350, protein: 9, carbs: 50, fats: 12, fiber: 2, sugar: 8, sodium: 500, barcode: '8410000000143' },
    { id: 'caesar_salad', name: 'Ensalada César', category: 'preparados', serving: '1 ración', calories: 360, protein: 15, carbs: 12, fats: 28, fiber: 3, sugar: 2, sodium: 800, barcode: '8410000000144' },
    { id: 'chicken_wrap', name: 'Wrap de pollo', category: 'preparados', serving: '1 unidad', calories: 380, protein: 28, carbs: 35, fats: 14, fiber: 3, sugar: 4, sodium: 720, barcode: '8410000000145' },
    { id: 'paella', name: 'Paella', category: 'preparados', serving: '300g', calories: 420, protein: 18, carbs: 52, fats: 15, fiber: 2, sugar: 2, sodium: 650, barcode: '8410000000146' },
    { id: 'tortilla_espanola', name: 'Tortilla española', category: 'preparados', serving: '150g', calories: 220, protein: 10, carbs: 15, fats: 14, fiber: 1.5, sugar: 1, sodium: 380, barcode: '8410000000147' },
];

// Food categories for filtering
export const FOOD_CATEGORIES = [
    { id: 'all', name: 'Todos', emoji: '🍽️' },
    { id: 'proteinas', name: 'Proteínas', emoji: '🥩' },
    { id: 'lacteos', name: 'Lácteos', emoji: '🥛' },
    { id: 'carbohidratos', name: 'Carbos', emoji: '🍚' },
    { id: 'verduras', name: 'Verduras', emoji: '🥦' },
    { id: 'frutas', name: 'Frutas', emoji: '🍎' },
    { id: 'grasas', name: 'Grasas', emoji: '🥑' },
    { id: 'legumbres', name: 'Legumbres', emoji: '🫘' },
    { id: 'bebidas', name: 'Bebidas', emoji: '🥤' },
    { id: 'snacks', name: 'Snacks', emoji: '🍫' },
    { id: 'salsas', name: 'Salsas', emoji: '🫙' },
    { id: 'preparados', name: 'Preparados', emoji: '🍕' },
];

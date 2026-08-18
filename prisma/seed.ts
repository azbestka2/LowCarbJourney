import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Categories
  const categories = await Promise.all([
    prisma.productCategory.upsert({
      where: { name: 'Białka' },
      update: {},
      create: { name: 'Białka', icon: '🥩' },
    }),
    prisma.productCategory.upsert({
      where: { name: 'Warzywa' },
      update: {},
      create: { name: 'Warzywa', icon: '🥦' },
    }),
    prisma.productCategory.upsert({
      where: { name: 'Tłuszcze' },
      update: {},
      create: { name: 'Tłuszcze', icon: '🫒' },
    }),
    prisma.productCategory.upsert({
      where: { name: 'Nabiał' },
      update: {},
      create: { name: 'Nabiał', icon: '🧀' },
    }),
    prisma.productCategory.upsert({
      where: { name: 'Przekąski' },
      update: {},
      create: { name: 'Przekąski', icon: '🥜' },
    }),
    prisma.productCategory.upsert({
      where: { name: 'Owoce' },
      update: {},
      create: { name: 'Owoce', icon: '🥑' },
    }),
  ]);

  const [bialka, warzywa, tluszcze, nabial, przekaski, owoce] = categories;

  // Products
  const products = await Promise.all([
    // Białka
    prisma.product.upsert({ where: { id: 'p-chicken' }, update: {}, create: { id: 'p-chicken', name: 'Pierś kurczaka', categoryId: bialka.id, caloriesPer100g: 165, proteinPer100g: 31, fatPer100g: 3.6, carbsPer100g: 0 } }),
    prisma.product.upsert({ where: { id: 'p-turkey' }, update: {}, create: { id: 'p-turkey', name: 'Pierś indyka', categoryId: bialka.id, caloriesPer100g: 135, proteinPer100g: 30, fatPer100g: 1, carbsPer100g: 0 } }),
    prisma.product.upsert({ where: { id: 'p-beef' }, update: {}, create: { id: 'p-beef', name: 'Wołowina', categoryId: bialka.id, caloriesPer100g: 250, proteinPer100g: 26, fatPer100g: 15, carbsPer100g: 0 } }),
    prisma.product.upsert({ where: { id: 'p-pork' }, update: {}, create: { id: 'p-pork', name: 'Wieprzowina', categoryId: bialka.id, caloriesPer100g: 242, proteinPer100g: 27, fatPer100g: 14, carbsPer100g: 0 } }),
    prisma.product.upsert({ where: { id: 'p-salmon' }, update: {}, create: { id: 'p-salmon', name: 'Łosoś', categoryId: bialka.id, caloriesPer100g: 208, proteinPer100g: 20, fatPer100g: 13, carbsPer100g: 0 } }),
    prisma.product.upsert({ where: { id: 'p-tuna' }, update: {}, create: { id: 'p-tuna', name: 'Tuńczyk', categoryId: bialka.id, caloriesPer100g: 130, proteinPer100g: 29, fatPer100g: 1, carbsPer100g: 0 } }),
    prisma.product.upsert({ where: { id: 'p-shrimp' }, update: {}, create: { id: 'p-shrimp', name: 'Krewetki', categoryId: bialka.id, caloriesPer100g: 99, proteinPer100g: 24, fatPer100g: 0.3, carbsPer100g: 0.2 } }),
    prisma.product.upsert({ where: { id: 'p-eggs' }, update: {}, create: { id: 'p-eggs', name: 'Jajka', categoryId: bialka.id, caloriesPer100g: 155, proteinPer100g: 13, fatPer100g: 11, carbsPer100g: 1.1 } }),
    prisma.product.upsert({ where: { id: 'p-tofu' }, update: {}, create: { id: 'p-tofu', name: 'Tofu', categoryId: bialka.id, caloriesPer100g: 76, proteinPer100g: 8, fatPer100g: 4.8, carbsPer100g: 1.9 } }),
    prisma.product.upsert({ where: { id: 'p-bacon' }, update: {}, create: { id: 'p-bacon', name: 'Boczek', categoryId: bialka.id, caloriesPer100g: 541, proteinPer100g: 37, fatPer100g: 42, carbsPer100g: 1.4 } }),

    // Warzywa
    prisma.product.upsert({ where: { id: 'p-broccoli' }, update: {}, create: { id: 'p-broccoli', name: 'Brokuły', categoryId: warzywa.id, caloriesPer100g: 34, proteinPer100g: 2.8, fatPer100g: 0.4, carbsPer100g: 7 } }),
    prisma.product.upsert({ where: { id: 'p-spinach' }, update: {}, create: { id: 'p-spinach', name: 'Szpinak', categoryId: warzywa.id, caloriesPer100g: 23, proteinPer100g: 2.9, fatPer100g: 0.4, carbsPer100g: 3.6 } }),
    prisma.product.upsert({ where: { id: 'p-zucchini' }, update: {}, create: { id: 'p-zucchini', name: 'Cukinia', categoryId: warzywa.id, caloriesPer100g: 17, proteinPer100g: 1.2, fatPer100g: 0.3, carbsPer100g: 3.1 } }),
    prisma.product.upsert({ where: { id: 'p-pepper' }, update: {}, create: { id: 'p-pepper', name: 'Papryka', categoryId: warzywa.id, caloriesPer100g: 31, proteinPer100g: 1, fatPer100g: 0.3, carbsPer100g: 6 } }),
    prisma.product.upsert({ where: { id: 'p-cauliflower' }, update: {}, create: { id: 'p-cauliflower', name: 'Kalafior', categoryId: warzywa.id, caloriesPer100g: 25, proteinPer100g: 1.9, fatPer100g: 0.3, carbsPer100g: 5 } }),
    prisma.product.upsert({ where: { id: 'p-celery' }, update: {}, create: { id: 'p-celery', name: 'Seler korzeń', categoryId: warzywa.id, caloriesPer100g: 42, proteinPer100g: 1.5, fatPer100g: 0.3, carbsPer100g: 9 } }),
    prisma.product.upsert({ where: { id: 'p-carrot' }, update: {}, create: { id: 'p-carrot', name: 'Marchewka', categoryId: warzywa.id, caloriesPer100g: 41, proteinPer100g: 0.9, fatPer100g: 0.2, carbsPer100g: 10 } }),
    prisma.product.upsert({ where: { id: 'p-avocado' }, update: {}, create: { id: 'p-avocado', name: 'Awokado', categoryId: warzywa.id, caloriesPer100g: 160, proteinPer100g: 2, fatPer100g: 15, carbsPer100g: 9 } }),
    prisma.product.upsert({ where: { id: 'p-tomato' }, update: {}, create: { id: 'p-tomato', name: 'Pomidor', categoryId: warzywa.id, caloriesPer100g: 18, proteinPer100g: 0.9, fatPer100g: 0.2, carbsPer100g: 3.9 } }),
    prisma.product.upsert({ where: { id: 'p-cucumber' }, update: {}, create: { id: 'p-cucumber', name: 'Ogórek', categoryId: warzywa.id, caloriesPer100g: 15, proteinPer100g: 0.7, fatPer100g: 0.1, carbsPer100g: 3.6 } }),
    prisma.product.upsert({ where: { id: 'p-radish' }, update: {}, create: { id: 'p-radish', name: 'Rzodkiewka', categoryId: warzywa.id, caloriesPer100g: 16, proteinPer100g: 0.7, fatPer100g: 0.1, carbsPer100g: 3.4 } }),
    prisma.product.upsert({ where: { id: 'p-cabbage' }, update: {}, create: { id: 'p-cabbage', name: 'Kapusta', categoryId: warzywa.id, caloriesPer100g: 25, proteinPer100g: 1.3, fatPer100g: 0.1, carbsPer100g: 5.8 } }),
    prisma.product.upsert({ where: { id: 'p-kimchi' }, update: {}, create: { id: 'p-kimchi', name: 'Kiszona kapusta', categoryId: warzywa.id, caloriesPer100g: 15, proteinPer100g: 1.1, fatPer100g: 0.1, carbsPer100g: 2.4 } }),
    prisma.product.upsert({ where: { id: 'p-pickle' }, update: {}, create: { id: 'p-pickle', name: 'Kiszone ogórki', categoryId: warzywa.id, caloriesPer100g: 11, proteinPer100g: 0.4, fatPer100g: 0.2, carbsPer100g: 2.3 } }),
    prisma.product.upsert({ where: { id: 'p-onion' }, update: {}, create: { id: 'p-onion', name: 'Cebula', categoryId: warzywa.id, caloriesPer100g: 40, proteinPer100g: 1.1, fatPer100g: 0.1, carbsPer100g: 9.3 } }),
    prisma.product.upsert({ where: { id: 'p-greenbeans' }, update: {}, create: { id: 'p-greenbeans', name: 'Fasolka szparagowa', categoryId: warzywa.id, caloriesPer100g: 31, proteinPer100g: 1.8, fatPer100g: 0.1, carbsPer100g: 7 } }),
    prisma.product.upsert({ where: { id: 'p-celerystick' }, update: {}, create: { id: 'p-celerystick', name: 'Seler naciowy', categoryId: warzywa.id, caloriesPer100g: 14, proteinPer100g: 0.7, fatPer100g: 0.2, carbsPer100g: 3 } }),
    prisma.product.upsert({ where: { id: 'p-mushrooms' }, update: {}, create: { id: 'p-mushrooms', name: 'Pieczarki', categoryId: warzywa.id, caloriesPer100g: 22, proteinPer100g: 3.1, fatPer100g: 0.3, carbsPer100g: 3.3 } }),

    // Tłuszcze
    prisma.product.upsert({ where: { id: 'p-oliveoil' }, update: {}, create: { id: 'p-oliveoil', name: 'Oliwa z oliwek', categoryId: tluszcze.id, caloriesPer100g: 884, proteinPer100g: 0, fatPer100g: 100, carbsPer100g: 0 } }),
    prisma.product.upsert({ where: { id: 'p-butter' }, update: {}, create: { id: 'p-butter', name: 'Masło', categoryId: tluszcze.id, caloriesPer100g: 717, proteinPer100g: 0.9, fatPer100g: 81, carbsPer100g: 0.1 } }),
    prisma.product.upsert({ where: { id: 'p-coconutoil' }, update: {}, create: { id: 'p-coconutoil', name: 'Olej kokosowy', categoryId: tluszcze.id, caloriesPer100g: 862, proteinPer100g: 0, fatPer100g: 100, carbsPer100g: 0 } }),

    // Nabiał
    prisma.product.upsert({ where: { id: 'p-cheese' }, update: {}, create: { id: 'p-cheese', name: 'Ser żółty', categoryId: nabial.id, caloriesPer100g: 402, proteinPer100g: 25, fatPer100g: 33, carbsPer100g: 1.3 } }),
    prisma.product.upsert({ where: { id: 'p-feta' }, update: {}, create: { id: 'p-feta', name: 'Ser feta', categoryId: nabial.id, caloriesPer100g: 264, proteinPer100g: 14, fatPer100g: 21, carbsPer100g: 4 } }),
    prisma.product.upsert({ where: { id: 'p-mozzarella' }, update: {}, create: { id: 'p-mozzarella', name: 'Mozzarella', categoryId: nabial.id, caloriesPer100g: 280, proteinPer100g: 28, fatPer100g: 17, carbsPer100g: 3.1 } }),
    prisma.product.upsert({ where: { id: 'p-cottage' }, update: {}, create: { id: 'p-cottage', name: 'Twarożek', categoryId: nabial.id, caloriesPer100g: 98, proteinPer100g: 11, fatPer100g: 4.3, carbsPer100g: 3.4 } }),
    prisma.product.upsert({ where: { id: 'p-grekyogurt' }, update: {}, create: { id: 'p-grekyogurt', name: 'Jogurt grecki', categoryId: nabial.id, caloriesPer100g: 59, proteinPer100g: 10, fatPer100g: 0.7, carbsPer100g: 3.6 } }),
    prisma.product.upsert({ where: { id: 'p-cream' }, update: {}, create: { id: 'p-cream', name: 'Śmietana', categoryId: nabial.id, caloriesPer100g: 193, proteinPer100g: 2.1, fatPer100g: 20, carbsPer100g: 3.3 } }),
    prisma.product.upsert({ where: { id: 'p-cottagese' }, update: {}, create: { id: 'p-cottagese', name: 'Serek wiejski', categoryId: nabial.id, caloriesPer100g: 72, proteinPer100g: 12, fatPer100g: 2, carbsPer100g: 3 } }),

    // Przekąski
    prisma.product.upsert({ where: { id: 'p-walnuts' }, update: {}, create: { id: 'p-walnuts', name: 'Orzechy włoskie', categoryId: przekaski.id, caloriesPer100g: 654, proteinPer100g: 15, fatPer100g: 65, carbsPer100g: 14 } }),
    prisma.product.upsert({ where: { id: 'p-almonds' }, update: {}, create: { id: 'p-almonds', name: 'Migdały', categoryId: przekaski.id, caloriesPer100g: 579, proteinPer100g: 21, fatPer100g: 50, carbsPer100g: 22 } }),
    prisma.product.upsert({ where: { id: 'p-cashews' }, update: {}, create: { id: 'p-cashews', name: 'Orzechy nerkowca', categoryId: przekaski.id, caloriesPer100g: 553, proteinPer100g: 18, fatPer100g: 44, carbsPer100g: 30 } }),
    prisma.product.upsert({ where: { id: 'p-chia' }, update: {}, create: { id: 'p-chia', name: 'Nasiona chia', categoryId: przekaski.id, caloriesPer100g: 486, proteinPer100g: 17, fatPer100g: 31, carbsPer100g: 42 } }),
    prisma.product.upsert({ where: { id: 'p-olives' }, update: {}, create: { id: 'p-olives', name: 'Oliwki', categoryId: przekaski.id, caloriesPer100g: 115, proteinPer100g: 0.8, fatPer100g: 11, carbsPer100g: 6 } }),
    prisma.product.upsert({ where: { id: 'p-darkchoco' }, update: {}, create: { id: 'p-darkchoco', name: 'Gorzka czekolada', categoryId: przekaski.id, caloriesPer100g: 546, proteinPer100g: 5, fatPer100g: 31, carbsPer100g: 60 } }),
    prisma.product.upsert({ where: { id: 'p-sesame' }, update: {}, create: { id: 'p-sesame', name: 'Sezam', categoryId: przekaski.id, caloriesPer100g: 573, proteinPer100g: 18, fatPer100g: 50, carbsPer100g: 23 } }),

    // Owoce (dozwolone w małych ilościach)
    prisma.product.upsert({ where: { id: 'p-lemon' }, update: {}, create: { id: 'p-lemon', name: 'Cytryna', categoryId: owoce.id, caloriesPer100g: 29, proteinPer100g: 1.1, fatPer100g: 0.3, carbsPer100g: 9.3 } }),
    prisma.product.upsert({ where: { id: 'p-blueberries' }, update: {}, create: { id: 'p-blueberries', name: 'Jagody', categoryId: owoce.id, caloriesPer100g: 57, proteinPer100g: 0.7, fatPer100g: 0.3, carbsPer100g: 14 } }),
    prisma.product.upsert({ where: { id: 'p-raspberries' }, update: {}, create: { id: 'p-raspberries', name: 'Maliny', categoryId: owoce.id, caloriesPer100g: 52, proteinPer100g: 1.2, fatPer100g: 0.7, carbsPer100g: 12 } }),
    prisma.product.upsert({ where: { id: 'p-strawberries' }, update: {}, create: { id: 'p-strawberries', name: 'Truskawki', categoryId: owoce.id, caloriesPer100g: 33, proteinPer100g: 0.7, fatPer100g: 0.3, carbsPer100g: 8 } }),
  ]);

  const productMap = Object.fromEntries(products.map((p) => [p.id, p.id]));

  // Recipes
  const recipesData = [
    {
      id: 'r-omlet-avocado',
      name: 'Omlet z Awokado',
      mealType: 'breakfast',
      difficulty: 'easy',
      caloriesPerServing: 320,
      proteinPerServing: 18,
      fatPerServing: 25,
      carbsPerServing: 6,
      servingSizeG: 250,
      ketoTip: 'Zamień ser feta na kozi dla niższej zawartości laktozy.',
      steps: JSON.stringify([
        'Roztrzep jajka i wymieszaj z solą i pieprzem.',
        'Smaż jajka na oliwie, dodaj plasterki awokado i pokrojone pomidorki.',
        'Posyp feta i podawaj na ciepło.',
      ]),
      ingredients: [
        { productId: 'p-eggs', amountG: 120 },
        { productId: 'p-avocado', amountG: 80 },
        { productId: 'p-feta', amountG: 30 },
        { productId: 'p-oliveoil', amountG: 15 },
        { productId: 'p-tomato', amountG: 50 },
      ],
    },
    {
      id: 'r-salatka-grecka',
      name: 'Sałatka Grecka',
      mealType: 'lunch',
      difficulty: 'easy',
      caloriesPerServing: 280,
      proteinPerServing: 12,
      fatPerServing: 22,
      carbsPerServing: 10,
      servingSizeG: 300,
      ketoTip: 'Unikaj gotowych sosów - użyj tylko oliwy i cytryny.',
      steps: JSON.stringify([
        'Pokrój pomidory, ogórek i paprykę w kostkę.',
        'Dodaj pokrojony ser feta i oliwki.',
        'Polej oliwą z oliwek i sokiem z cytryny.',
        'Posyp oregano i wymieszaj delikatnie.',
      ]),
      ingredients: [
        { productId: 'p-tomato', amountG: 100 },
        { productId: 'p-cucumber', amountG: 80 },
        { productId: 'p-pepper', amountG: 60 },
        { productId: 'p-feta', amountG: 60 },
        { productId: 'p-olives', amountG: 30 },
        { productId: 'p-oliveoil', amountG: 15 },
        { productId: 'p-lemon', amountG: 15 },
      ],
    },
    {
      id: 'r-losos-warzywa',
      name: 'Łosoś z Warzywami',
      mealType: 'dinner',
      difficulty: 'medium',
      caloriesPerServing: 350,
      proteinPerServing: 25,
      fatPerServing: 18,
      carbsPerServing: 8,
      servingSizeG: 320,
      ketoTip: 'Podawaj z surówką z kapusty kiszonej.',
      steps: JSON.stringify([
        'Rozgrzej piekarnik do 200°C.',
        'Ułóż łososia na blasze, dopraw solą i pieprzem.',
        'Obok ułóż brokuły i cukinię pokrojone w plastry.',
        'Polej warzywa oliwą z oliwek.',
        'Piecz przez 15-20 minut aż łosoś będzie miękki.',
      ]),
      ingredients: [
        { productId: 'p-salmon', amountG: 150 },
        { productId: 'p-broccoli', amountG: 100 },
        { productId: 'p-zucchini', amountG: 80 },
        { productId: 'p-oliveoil', amountG: 15 },
        { productId: 'p-lemon', amountG: 20 },
      ],
    },
    {
      id: 'r-orzechy-ser',
      name: 'Orzechy z Serem',
      mealType: 'snack',
      difficulty: 'easy',
      caloriesPerServing: 250,
      proteinPerServing: 12,
      fatPerServing: 20,
      carbsPerServing: 5,
      servingSizeG: 80,
      ketoTip: 'Wybieraj orzechy niesolone.',
      steps: JSON.stringify([
        'Pokrój ser w kostkę.',
        'Podaj z garścią orzechów włoskich.',
      ]),
      ingredients: [
        { productId: 'p-walnuts', amountG: 30 },
        { productId: 'p-cheese', amountG: 40 },
      ],
    },
    {
      id: 'r-jajecznica-szpinak',
      name: 'Jajecznica ze Szpinakiem',
      mealType: 'breakfast',
      difficulty: 'easy',
      caloriesPerServing: 290,
      proteinPerServing: 20,
      fatPerServing: 22,
      carbsPerServing: 3,
      servingSizeG: 220,
      ketoTip: 'Dodaj ząbek czosnku dla wzmocnienia smaku.',
      steps: JSON.stringify([
        'Podsmaż szpinak na maśle przez 2 minuty.',
        'Roztrzep jajka i wlej na patelnię.',
        'Mieszaj aż jajka będą ścięte.',
        'Dopraw solą, pieprzem i gałką muszkatołową.',
      ]),
      ingredients: [
        { productId: 'p-eggs', amountG: 150 },
        { productId: 'p-spinach', amountG: 80 },
        { productId: 'p-butter', amountG: 10 },
      ],
    },
    {
      id: 'r-curry-indyka',
      name: 'Curry z Indyka',
      mealType: 'lunch',
      difficulty: 'medium',
      caloriesPerServing: 340,
      proteinPerServing: 30,
      fatPerServing: 18,
      carbsPerServing: 12,
      servingSizeG: 350,
      ketoTip: 'Podawaj bez ryżu - z sałatką z ogórka.',
      steps: JSON.stringify([
        'Pokrój indyka w kostkę i obsmaż na oliwie.',
        'Dodaj pokrojoną cebulę i paprykę.',
        'Wsyp curry i kurkumę, zamieszaj.',
        'Wlej śmietanę i duś 15 minut.',
        'Dopraw solą i pieprzem.',
      ]),
      ingredients: [
        { productId: 'p-turkey', amountG: 150 },
        { productId: 'p-onion', amountG: 50 },
        { productId: 'p-pepper', amountG: 80 },
        { productId: 'p-cream', amountG: 50 },
        { productId: 'p-oliveoil', amountG: 15 },
      ],
    },
    {
      id: 'r-steak-broccoli',
      name: 'Stek Wołowy z Brokułami',
      mealType: 'dinner',
      difficulty: 'hard',
      caloriesPerServing: 420,
      proteinPerServing: 35,
      fatPerServing: 28,
      carbsPerServing: 5,
      servingSizeG: 350,
      ketoTip: 'Stek rare/medium-rare ma więcej składników odżywczych.',
      steps: JSON.stringify([
        'Wyjmij steek z lodówki 30 minut przed smażeniem.',
        'Rozgrzej patelnię żeliwną do wysokiej temperatury.',
        'Smaż steek 3-4 min z każdej strony (medium-rare).',
        'Odstaw na 5 minut przed krojeniem.',
        'Brokuły ugotuj na parze i dopraw masłem.',
      ]),
      ingredients: [
        { productId: 'p-beef', amountG: 200 },
        { productId: 'p-broccoli', amountG: 120 },
        { productId: 'p-butter', amountG: 15 },
        { productId: 'p-oliveoil', amountG: 10 },
      ],
    },
    {
      id: 'r-salatka-tunel',
      name: 'Sałatka z Tuńczykiem',
      mealType: 'lunch',
      difficulty: 'easy',
      caloriesPerServing: 310,
      proteinPerServing: 28,
      fatPerServing: 18,
      carbsPerServing: 8,
      servingSizeG: 280,
      ketoTip: 'Używaj tuńczyka w oliwie, nie w wodzie.',
      steps: JSON.stringify([
        'Odcedź tuńczyka z puszki.',
        'Pokrój jajka na ćwiartki.',
        'Ułóż sałatkę na liściach szpinaku.',
        'Polej oliwą z oliwek i dopraw.',
      ]),
      ingredients: [
        { productId: 'p-tuna', amountG: 120 },
        { productId: 'p-eggs', amountG: 100 },
        { productId: 'p-spinach', amountG: 60 },
        { productId: 'p-oliveoil', amountG: 15 },
        { productId: 'p-cucumber', amountG: 50 },
      ],
    },
    {
      id: 'r-kotlety-cukinia',
      name: 'Kotlety z Cukinii',
      mealType: 'dinner',
      difficulty: 'medium',
      caloriesPerServing: 280,
      proteinPerServing: 15,
      fatPerServing: 18,
      carbsPerServing: 10,
      servingSizeG: 250,
      ketoTip: 'Podawaj z sosem czosnkowym.',
      steps: JSON.stringify([
        'Zetrzyj cukinię i odciśnij nadmiar wody.',
        'Wymieszaj z jajkiem, serem i przyprawami.',
        'Formuj kotlety i obtocz w sezamie.',
        'Smaż na oliwie na złoty kolor z obu stron.',
      ]),
      ingredients: [
        { productId: 'p-zucchini', amountG: 200 },
        { productId: 'p-eggs', amountG: 50 },
        { productId: 'p-feta', amountG: 40 },
        { productId: 'p-sesame', amountG: 15 },
        { productId: 'p-oliveoil', amountG: 15 },
      ],
    },
    {
      id: 'r-omlet-grzyby',
      name: 'Omlet z Grzybami',
      mealType: 'breakfast',
      difficulty: 'easy',
      caloriesPerServing: 310,
      proteinPerServing: 22,
      fatPerServing: 23,
      carbsPerServing: 4,
      servingSizeG: 230,
      ketoTip: 'Grzyby podsmaż osobno przed dodaniem do omletu.',
      steps: JSON.stringify([
        'Pokrój pieczarki i podsmaż na maśle.',
        'Roztrzep jajka z solą i pieprzem.',
        'Wlej jajka na patelnię z grzybami.',
        'Gdy spód się zetnie, złóż omlet na pół.',
      ]),
      ingredients: [
        { productId: 'p-eggs', amountG: 150 },
        { productId: 'p-mushrooms', amountG: 80 },
        { productId: 'p-butter', amountG: 10 },
        { productId: 'p-cheese', amountG: 20 },
      ],
    },
    {
      id: 'r-salatka-kurczak',
      name: 'Sałatka z Kurczakiem',
      mealType: 'lunch',
      difficulty: 'easy',
      caloriesPerServing: 345,
      proteinPerServing: 32,
      fatPerServing: 18,
      carbsPerServing: 8,
      servingSizeG: 320,
      ketoTip: 'Kurczaka możesz przygotować na grillu.',
      steps: JSON.stringify([
        'Ugrilluj lub usmaż pierś kurczaka.',
        'Pokrój na plastry.',
        'Ułóż na sałacie z pomidorami i ogórkiem.',
        'Polej oliwą i sokiem z cytryny.',
      ]),
      ingredients: [
        { productId: 'p-chicken', amountG: 150 },
        { productId: 'p-spinach', amountG: 60 },
        { productId: 'p-tomato', amountG: 60 },
        { productId: 'p-cucumber', amountG: 50 },
        { productId: 'p-oliveoil', amountG: 15 },
      ],
    },
    {
      id: 'r-shrimp-avocado',
      name: 'Krewetki z Awokado',
      mealType: 'dinner',
      difficulty: 'medium',
      caloriesPerServing: 330,
      proteinPerServing: 28,
      fatPerServing: 20,
      carbsPerServing: 6,
      servingSizeG: 260,
      ketoTip: 'Krewetki smakują najlepiej z czosnkiem i pietruszką.',
      steps: JSON.stringify([
        'Obsmaż krewetki na oliwie z czosnkiem.',
        'Pokrój awokado w plastry.',
        'Ułóż krewetki na awokado.',
        'Polej oliwą i posyp natką.',
      ]),
      ingredients: [
        { productId: 'p-shrimp', amountG: 150 },
        { productId: 'p-avocado', amountG: 100 },
        { productId: 'p-oliveoil', amountG: 15 },
        { productId: 'p-lemon', amountG: 15 },
      ],
    },
    {
      id: 'r-wrap-szpinak',
      name: 'Wrap ze Szpinakiem i Serem',
      mealType: 'lunch',
      difficulty: 'easy',
      caloriesPerServing: 300,
      proteinPerServing: 18,
      fatPerServing: 20,
      carbsPerServing: 8,
      servingSizeG: 200,
      ketoTip: 'Użyj placków z mąki kokosowej lub jajecznych.',
      steps: JSON.stringify([
        'Usmaż placek z mąki kokosowej lub jajeczny.',
        'Posmaruj serkiem wiejskim.',
        'Dodaj szpinak i pokrojone awokado.',
        'Zwiń w rulon i pokrój na kawałki.',
      ]),
      ingredients: [
        { productId: 'p-eggs', amountG: 80 },
        { productId: 'p-spinach', amountG: 50 },
        { productId: 'p-cottage', amountG: 60 },
        { productId: 'p-avocado', amountG: 50 },
      ],
    },
    {
      id: 'r-lasagne-cukinia',
      name: 'Lasagne z Cukinii',
      mealType: 'dinner',
      difficulty: 'hard',
      caloriesPerServing: 380,
      proteinPerServing: 28,
      fatPerServing: 24,
      carbsPerServing: 10,
      servingSizeG: 350,
      ketoTip: 'Cukinię pokrój wzdłuż cienkimi plastry.',
      steps: JSON.stringify([
        'Pokrój cukinię w cienkie plastry wzdłuż.',
        'Usmaż mięso mielone z cebulą i sosem pomidorowym.',
        'Na dnie naczynia ułóż plastry cukinii.',
        'Przełóż mięsem i serem mozzarella.',
        'Powtarzaj warstwy.',
        'Piecz 25 minut w 180°C.',
      ]),
      ingredients: [
        { productId: 'p-zucchini', amountG: 200 },
        { productId: 'p-beef', amountG: 120 },
        { productId: 'p-mozzarella', amountG: 80 },
        { productId: 'p-tomato', amountG: 60 },
        { productId: 'p-oliveoil', amountG: 15 },
        { productId: 'p-onion', amountG: 40 },
      ],
    },
    {
      id: 'r-chia-pudding',
      name: 'Pudding Chia',
      mealType: 'breakfast',
      difficulty: 'easy',
      caloriesPerServing: 220,
      proteinPerServing: 8,
      fatPerServing: 14,
      carbsPerServing: 12,
      servingSizeG: 200,
      ketoTip: 'Przygotuj wieczorem - rano będzie gotowy.',
      steps: JSON.stringify([
        'Wymieszaj nasiona chia z jogurtem greckim.',
        'Dodaj odrobinę ekstraktu waniliowego.',
        'Odstaw na noc do lodówki.',
        'Rano udekoruj jagodami.',
      ]),
      ingredients: [
        { productId: 'p-chia', amountG: 30 },
        { productId: 'p-grekyogurt', amountG: 150 },
        { productId: 'p-blueberries', amountG: 30 },
      ],
    },
    {
      id: 'r-twarozek-awokado',
      name: 'Twarożek z Awokado',
      mealType: 'breakfast',
      difficulty: 'easy',
      caloriesPerServing: 270,
      proteinPerServing: 16,
      fatPerServing: 20,
      carbsPerServing: 5,
      servingSizeG: 200,
      ketoTip: 'Dodaj szczypiorek dla świeżości.',
      steps: JSON.stringify([
        'Rozgnieć awokado widelcem.',
        'Wymieszaj z twarożkiem.',
        'Dopraw solą, pieprzem i sokiem z cytryny.',
        'Podaj z ulubionymi warzywami.',
      ]),
      ingredients: [
        { productId: 'p-avocado', amountG: 80 },
        { productId: 'p-cottage', amountG: 120 },
        { productId: 'p-lemon', amountG: 10 },
      ],
    },
    {
      id: 'r-broccoli-ser',
      name: 'Brokuły z Serem',
      mealType: 'dinner',
      difficulty: 'easy',
      caloriesPerServing: 260,
      proteinPerServing: 14,
      fatPerServing: 18,
      carbsPerServing: 8,
      servingSizeG: 250,
      ketoTip: 'Brokuły gotuj al dente.',
      steps: JSON.stringify([
        'Ugotuj brokuły na półmiękko.',
        'Przełóż do naczynia żaroodpornego.',
        'Posyp startym serem żółtym.',
        'Zapiekaj 10 minut w 190°C.',
      ]),
      ingredients: [
        { productId: 'p-broccoli', amountG: 200 },
        { productId: 'p-cheese', amountG: 40 },
        { productId: 'p-butter', amountG: 10 },
      ],
    },
    {
      id: 'r-salatka-kapusta',
      name: 'Surówka z Kapusty',
      mealType: 'snack',
      difficulty: 'easy',
      caloriesPerServing: 80,
      proteinPerServing: 2,
      fatPerServing: 5,
      carbsPerServing: 5,
      servingSizeG: 120,
      ketoTip: 'Kiszona kapusta jest bogata w probiotyki.',
      steps: JSON.stringify([
        'Drobn pokrój kapustę kiszoną.',
        'Dodaj startą marchewkę.',
        'Polej oliwą i wymieszaj.',
      ]),
      ingredients: [
        { productId: 'p-kimchi', amountG: 80 },
        { productId: 'p-carrot', amountG: 30 },
        { productId: 'p-oliveoil', amountG: 10 },
      ],
    },
    {
      id: 'r-jajka-sadzone',
      name: 'Jajka Sadzone z Boczkiem',
      mealType: 'breakfast',
      difficulty: 'easy',
      caloriesPerServing: 350,
      proteinPerServing: 24,
      fatPerServing: 28,
      carbsPerServing: 1,
      servingSizeG: 200,
      ketoTip: 'Idealne na śniadanie ketogeniczne.',
      steps: JSON.stringify([
        'Usmaż boczek na patelni aż będzie chrupki.',
        'Na tłuszczu z boczku usmaż jajka sadzone.',
        'Dopraw solą i pieprzem.',
        'Podaj z ulubionymi warzywami.',
      ]),
      ingredients: [
        { productId: 'p-eggs', amountG: 120 },
        { productId: 'p-bacon', amountG: 50 },
      ],
    },
    {
      id: 'r-mus-wolowy',
      name: 'Gulasz Wołowy',
      mealType: 'dinner',
      difficulty: 'hard',
      caloriesPerServing: 400,
      proteinPerServing: 32,
      fatPerServing: 22,
      carbsPerServing: 10,
      servingSizeG: 380,
      ketoTip: 'Im dłużej gotujesz, tym mięśniejsze mięso.',
      steps: JSON.stringify([
        'Pokrój wołowinę w kostkę.',
        'Obsmaż na oliwie na mocnym ogniu.',
        'Dodaj cebulę i czosnek.',
        'Wlej bulion i duś pod przykryciem 1.5 godziny.',
        'Dodaj pieczarki na最后 15 minut.',
      ]),
      ingredients: [
        { productId: 'p-beef', amountG: 200 },
        { productId: 'p-onion', amountG: 60 },
        { productId: 'p-mushrooms', amountG: 80 },
        { productId: 'p-oliveoil', amountG: 20 },
      ],
    },
  ];

  for (const recipeData of recipesData) {
    const { ingredients, ...recipeFields } = recipeData;
    const recipe = await prisma.recipe.upsert({
      where: { id: recipeFields.id },
      update: recipeFields,
      create: recipeFields,
    });

    // Clear existing ingredients
    await prisma.recipeIngredient.deleteMany({ where: { recipeId: recipe.id } });

    for (const ing of ingredients) {
      await prisma.recipeIngredient.create({
        data: {
          recipeId: recipe.id,
          productId: ing.productId,
          amountG: ing.amountG,
        },
      });
    }
  }

  console.log('Seed completed!');
  console.log(`Created ${products.length} products`);
  console.log(`Created ${recipesData.length} recipes`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

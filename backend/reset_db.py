from pymongo import MongoClient
import time

def reset_db():
    client = MongoClient('localhost', 27017)
    db = client['recipe_db']
    recipes = db['recipes']

    recipes.delete_many({})  # delete all entries in database

    current_time = int(time.time() * 1000) # miliseconds since the epoch

    recipes.insert_one({'name': 'Meatballs',
                        'ingredients': [{'name': 'ground beef', 'notes': '1lb, preferrably 80%% or above'},
                                        {'name': 'mild sausage', 'notes': '1/2lb'}],
                        'time_mins': 45,
                        'energy': 'moderate',
                        'meal_type': 'dinner',
                        'utensils': ['measuring spoons', '1 bowl', 'stovetop', 'pan', 'baking sheet'],
                        'instructions': '''1) Preheat Oven to 400℉
2) Mix all ingredients but the olive oil in a medium bowl
3) Using your hands, take about 2tbs worth of meat mixture, and form it into a packed ball. Continue this until your bowl is empty and you have an army of uncooked meatballs.
4) Oil a pan using the olive oil and, over medium heat, give each meatball a couple minutes of cooking on 3 sides. I know they’re spheres and don’t have sides.
5) Transfer the half-cooked meatballs to a foil-lined baking tray and bake for 20 minutes or until the insides are up to temp.''',
                        'views': 1,
                        'date_added': int(time.mktime((2023, 3, 26, 6, 36, 48, 6, 85, -1)) * 1000),
                        'image_path': '/images/meatball.jpg'
                        })

    recipes.insert_one({'name': 'Brownies',
                        'ingredients': [{'name': 'semi sweet chocolate', 'notes': '8oz, chopped'},
                                        {'name': 'butter', 'notes': '12tbsp, melted'}],
                        'time_mins': 45,
                        'energy': 'moderate',
                        'meal_type': 'sweets',
                        'utensils': ['measuring spoons', '1 bowl', 'stovetop', '8x8 pan', 'spatula', 'parchment paper', 'whisk', 'some patience'],
                        'instructions': '''1) Preheat Oven to 350℉
2) Line an 8x8 pan with parchment paper and grease
3) Melt 4oz of the chopped chocolate in the microwave.
4) In a large bowl, cream the butter and sugar together with a mixer, then beat in the eggs and vanilla fro 2 minutes until the mixture becomes light and fluffy.
5) Whisk in the melted chocolate. Sift in the flour, cocoa powder, and salt, incorporating them by folding with a spatula.
6) Fold in the remaining 4oz of chopped chocolate and transfer batter to the prepared 8x8 pan.
7) Bake for 20-25 minutes- check using the toothpick method
8) Eat and burn your mouth because you forgot to let them cool''',
                        'views': 3,
                        'date_added': current_time,
                        'image_path': '/images/brownie.jpg'
                        })

    recipes.insert_one({'name': 'Slow Cooker Mashed Potatoes',
                        'ingredients': [{'name': 'potatoes', 'notes': '4lbs'},
                                        {'name': 'butter', 'notes': '1 1/2cups'}],
                        'time_mins': 240,
                        'energy': 'moderate',
                        'meal_type': 'side dish',
                        'utensils': ['measuring spoons', 'cutting board', 'slow cooker', 'knife'],
                        'instructions': '''1) Peel and dice potatoes into ~1in cubes
2) Dump all ingredients except for the milk into crock pot
3) Cook on high for 4 hours
4) Remove the lid and mash the potatoes, mixing in the milk as you go.
5) Eat''',
                        'views': 1,
                        'date_added': int(time.mktime((2022, 4, 13, 23, 2, 27, 2, 103, -1)) * 1000),
                        'image_path': '/images/mashed-potatoes.jpg'
                        })

    recipes.insert_one({'name': 'Snickerdoodles',
                        'ingredients': [{'name': 'all purpose flour', 'notes': '2 3/4 cups'},
                                        {'name': 'cream of tartar', 'notes': '2tsp'},
                                        {'name': 'salt', 'notes': '1/2 tsp'},
                                        {'name': 'baking powder', 'notes': '1 tsp'},
                                        {'name': 'unsalted butter', 'notes': '1 cup'},
                                        {'name': 'eggs', 'notes': '2'},
                                        {'name': 'vanilla extract', 'notes': '1 tsp'}],
                        'time_mins': 20,
                        'energy': 'moderate',
                        'meal_type': 'sweets',
                        'utensils': ['measuring spoons', '2 bowls', 'stove', 'baking sheet'],
                        'instructions': '''1) Preheat Oven to 350℉
2) In a large bowl, cream together butter and sugar. Then add eggs and vanilla and blend well.
3) Mix flour, cream of tartar, baking soda, and salt together in another bowl and then slowly combine wet and dry ingredients.
4) Combine sugar and cinnamon for the cinnamon sugar coating.
5) Scoop out dough and roll into a ball. Roll the ball into the cinnamon sugar coating and set onto an ungreased baking sheet 2 inches apart.
6) Bake for 8-10 minutes''',
                        'views': 4,
                        'date_added': int(time.mktime((2022, 11, 15, 15, 22, 50, 1, 319, -1)) * 1000),
                        'image_path': '/images/snickerdoodles.jpg'
                        })

    recipes.insert_one({'name': 'Slow Cooker Honey Teriyaki Chicken',
                        'ingredients': [{'name': 'chicken breasts', 'notes': '2lbs'},
                                        {'name': 'soy sauce', 'notes': '1/2 cup'},
                                        {'name': 'honey', 'notes': '1/2 cup'},
                                        {'name': 'rice wine vinegar',
                                            'notes': '1/4 cup'},
                                        {'name': 'chopped onion', 'notes': '1/2'},
                                        {'name': 'garlic', 'notes': '2 cloves'},
                                        {'name': 'ginger', 'notes': '1 tsp'},
                                        {'name': 'corn flour', 'notes': '3 tbsp'},
                                        {'name': 'water', 'notes': '1/4 cup'}, ],
                        'time_mins': 260,
                        'energy': 'easy',
                        'meal_type': 'dinner',
                        'utensils': ['measuring spoons', 'slow cooker', 'spoon'],
                        'instructions': '''1) Reminder to set your rice to cook if serving over rice.
                    2) You could mix the sauce in a separate bowl, but that adds on dishes to do later. Alternatively: mix the soy sauce, ginger, onion, rice wine vinegar, garlic, and pepper inside the crock pot first.
3) Add oil to the mixture as well as the chicken breasts.
4) Because we took a shortcut and didn’t mix the sauce in a separate bowl, make sure to mix the sauce thoroughly over the chicken.
5) Cover and cook on high for 3-4hrs.
6) Remove chicken and drain. Sred using a couple of forks and some determination. 
7) Return the sauce drained to the now shredded chicken and mix.
8) Serve on top of rice.
    ''',
                        'views': 8,
                        'date_added': int(time.mktime((2021, 1, 1, 1, 1, 1, 4, 1, -1)) * 1000), # Converted to UNIX time
                        'image_path': '/images/teriyaki-chicken.jpeg'
                        })

    recipes.insert_one({'name': 'Slow Cooker Beef Stew',
                        'ingredients': [{'name': 'flour', 'notes': '1/4 cup'},
                                        {'name': 'black pepper', 'notes': '1/2 tsp'},
                                        {'name': 'garlic powder', 'notes': '1/2 tsp'},
                                        {'name': 'salt', 'notes': '1 tsp'},
                                        {'name': 'stew meat (or cut up chuck roast)',
                                        'notes': '2 lbs'},
                                        {'name': 'olive oil', 'notes': '4 tbsp'},
                                        {'name': 'butter', 'notes': '3 tbsp'},
                                        {'name': 'onion', 'notes': '2 cups'},
                                        {'name': 'garlic', 'notes': '4 cloves'},
                                        {'name': 'red wine',
                                        'notes': '(optional) 1 cup'},
                                        {'name': 'beef broth', 'notes': '4 cups'},
                                        {'name': 'beef bouillon', 'notes': '2 cubes'},
                                        {'name': 'worcestershire sauce',
                                            'notes': '2 tbsp'},
                                        {'name': 'tomato paste', 'notes': '3 tbsp'},
                                        {'name': 'medium carrots',
                                            'notes': '5 carrots'},
                                        {'name': 'golden potatoes', 'notes': '1 lb'},
                                        {'name': 'bay leaves', 'notes': '2 leaves'},
                                        {'name': 'rosemary', 'notes': '1 sprig'},
                                        {'name': 'cold water', 'notes': '1/4 cup'},
                                        {'name': 'cornstarch', 'notes': '3 tbsp'}, ],
                        'time_mins': 260,
                        'energy': 'moderate',
                        'meal_type': 'dinner',
                        'utensils': ['measuring spoons', '1 bowl', 'crock pot', 'knife', 'cutting board'],
                        'instructions': '''1) Cut meat, potatoes, onions, and carrots into 1” pieces.
2) Mix everything but the water, cornstarch, and 2 tbsp butter into the crock pot.
3) Cook on high for 4 hrs.
4) After cooking, mix the leftover water and cornstarch together and add to the pot. Mix to thicken.
5) Then, add the last 2 tbsp of butter and mix.
6) Serve.
    ''',
                        'views': 2,
                        'date_added': int(time.mktime((1993, 8, 7, 0, 2, 17, 5, 219, -1)) * 1000), # Converted to UNIX time
                        'image_path': '/images/beef-stew.jpg'
                        })
    
    recipes.insert_one({"name":"Banana Bread","energy":"moderate","utensils":["Measuring Spoons","1 Bowl","oven","fork","loaf pan 8x4"],"ingredients":[{"name":"bananas","notes":"2-3 ripe "},{"name":"butter","notes":"1/3 cup"},{"name":"baking soda","notes":"1/2 tsp"},{"name":"salt","notes":"pinch"},{"name":"sugar","notes":"3/4 cup"},{"name":"egg","notes":"1"},{"name":"vanilla extract","notes":"1 tsp"},{"name":"all purpose flour","notes":"1.5 cups"},{"name":"chocolate chips","notes":"1/2 cup"}],"views":0,"date_added":1682522815804,"instructions":"1) Preheat Oven to 350℉\n2) Grease a loaf pan 8x4.\n3) Mash the bananas in a bowl. Melt the butter and incorporate into the mashed bananas.\n4) Beat the egg and add it. Then add the sugar and vanilla, baking soda, and salt. Stir.\n5) Mix in the flour. It will be lumpy. \n6) Make it more lumpy by mixing in the chocolate chips.\n7) Pour the batter into the greased loaf pan and bake for 55-65 minutes. Make sure to check the center with a toothpick.\n8) If the outside is brown, but the center is wet, cover with foil and continue cooking until cooked through.","time_mins":470,"meal_type":"sweets","image_path":"/images/l5gJmRGKSoiwVkLF.avif"})
    recipes.insert_one({"name":"Fajitas","energy":"easy","utensils":["Pan ","Stovetop","Measuring Spoons ","Cutting Board"],"ingredients":[{"name":"Chicken breasts","notes":"1lb"},{"name":"Bell Pepper","notes":"1 Thinly Sliced "},{"name":"chopped onion","notes":""},{"name":"olive oil","notes":"2 tablespoons "},{"name":"chili powder","notes":"1/2 tablespoon"},{"name":"ground cumin","notes":"1/2 tablespoon"},{"name":"garlic powder","notes":"1 teaspoon"},{"name":"paprika","notes":"1/2 teaspoon"},{"name":"oregano","notes":"1/2 teaspoon"},{"name":"salt","notes":"1/2 teaspoon"},{"name":"pepper","notes":"1/4 teaspoon"},{"name":"Tortillas","notes":""}],"views":0,"date_added":1682522475180,"instructions":"1) Mix seasonings in a small bowl\n2) Coat chicken in the seasoning, pressing the seasoning into the chicken\n3) In a skillet on medium heat, cook chicken in olive oil for ~7min on each side or until cooked through (165degrees)\n4) Set the chicken aside and add the bell peppers and onions to the pan. Saute until satisfied\n5) When the veggies are done, chop the chicken into strips and add back into the pan\n6) Serve Immediately on a tortilla with sour cream and rice\n","time_mins":30,"meal_type":"lunch","image_path":"/images/Flavorful-Chicken-Fajitas_EXPS_CIW19_12540_B08_30_6b.jpg"})
    recipes.insert_one({"name":"French Toast","energy":"easy","utensils":["Measuring Spoons","1 Bowl","Stove","Pan ","Spatula ","Whisk"],"ingredients":[{"name":"bread","notes":"6 Thick Slices "},{"name":"eggs","notes":"2"},{"name":"milk","notes":"2/3 cup"},{"name":"vanilla extract","notes":"1 tsp"},{"name":"ground cinnamon","notes":"1/4 tsp"},{"name":"salt","notes":"to taste"},{"name":"butter","notes":"1 tbsp"}],"views":0,"date_added":1682522553692,"instructions":"1) Whisk the milk, eggs, vanilla, cinnamon, and salt together in a bowl.\n2) Butter the pan and heat over medium heat.\n3) Dunk each slice of bread into the egg mixture, making sure to coat both sides.\n4) Transfer the wet egg bread to the heated pan and cook on each side until golden brown.\n5) Serve.\n","time_mins":15,"meal_type":"breakfast","image_path":"/images/Simply-Recipes-French-Toast-Lead-Shot-3b-c3a68a576a9548f5bd43cce3d2d7f4b7.jpg"})
    client.close()


if __name__ == "__main__":
    reset_db()
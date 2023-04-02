from pymongo import MongoClient

client = MongoClient('localhost', 27017)

db = client['test_recipe_db']
recipes = db['recipes']

input("WARNING this will delete all entries in the recipe database, press Ctrl+C to cancel, press enter to continue")
recipes.delete_many({}) # delete all entries in database

recipes.insert_one({'name':'Meatballs',
                'ingredients':[{'name':'ground beef', 'notes':'1lb, preferrably 80% or above'},
                               {'name':'mild sausage', 'notes':'1/2lb'}],
                'time_mins':45,
                'energy':'moderate',
                'type':'dinner',
                'utensils':['measuring spoons', '1 bowl', 'stovetop', 'pan', 'baking sheet'],
                'instructions':'''1) Preheat Oven to 400℉
2) Mix all ingredients but the olive oil in a medium bowl
3) Using your hands, take about 2tbs worth of meat mixture, and form it into a packed ball. Continue this until your bowl is empty and you have an army of uncooked meatballs.
4) Oil a pan using the olive oil and, over medium heat, give each meatball a couple minutes of cooking on 3 sides. I know they’re spheres and don’t have sides.
5) Transfer the half-cooked meatballs to a foil-lined baking tray and bake for 20 minutes or until the insides are up to temp.'''
                })

results = recipes.find()
first_result = results[0]
for res in results:
    print(res)
print()
print(f"name is {first_result['name']}, time is {first_result['time_mins']} minutes")

import scraper
import csv

nib_scrape = scraper.UrlScraper("https://umassdining.com/locations-menus/worcester/menu",
                                headers={'User-Agent': 'Mozilla/5.0'})

with open('Nibby.csv', 'w+', newline='') as csvfile:
    csvWriter = csv.writer(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    csvWriter.writerow(['Name', 'Serving Size', 'Calories', 'Fat Cal', 'Total Fat', 'Daily Value Total Fat',
                        'Saturated Fat', 'Daily Value Saturated Fat', 'Trans Fat', 'Cholesterol',
                        'Daily Value Cholesterol', 'Sodium', 'Daily Value Sodium', 'Total Carbs',
                        'Daily Value Total Carbs', 'Fiber', 'Daily Value Fiber', 'Sugar', 'Protein',
                        'Dietary Restrictions', 'Allergens', "Ingredients"])  # headers

    nib_scrape.move_to('Breakfast Entrees')
    csvWriter.writerow(['Breakfast Entrees'])
    for x in range(200):
        # grab calories, fat cal, total fat, name, cholesterol, sodium, total carbohydrate,
        # protein,
        nib_scrape.move_to('data-ingredient-list')
        ingredients = nib_scrape.pull_from_to("=\"", "\"")

        nib_scrape.move_to('data-allergens')
        allergens = nib_scrape.pull_from_to("=\"", "\"")

        nib_scrape.move_to('data-clean-diet-str')
        diet = nib_scrape.pull_from_to("=\"", "\"")

        nib_scrape.move_to('data-serving-size')
        servingsize = nib_scrape.pull_from_to("=\"", "\"")

        nib_scrape.move_to('data-calories')
        cal = nib_scrape.pull_from_to("=\"", "\"")

        nib_scrape.move_to('data-calories-from-fat')
        fatcal = nib_scrape.pull_from_to("=\"", "\"")

        nib_scrape.move_to('data-total-fat')
        totFat = nib_scrape.pull_from_to("=\"", "\"")

        nib_scrape.move_to('data-total-fat-dv')
        totFatdv = nib_scrape.pull_from_to("=\"", "\"")

        nib_scrape.move_to('data-sat-fat')
        satfat = nib_scrape.pull_from_to("=\"", "\"")

        nib_scrape.move_to('data-sat-fat-dv')
        satfatdv = nib_scrape.pull_from_to("=\"", "\"")

        nib_scrape.move_to('data-trans-fat')
        transfat = nib_scrape.pull_from_to("=\"", "\"")

        nib_scrape.move_to('data-cholesterol')
        cholesterol = nib_scrape.pull_from_to("=\"", "\"")

        nib_scrape.move_to('data-cholesterol_dv')
        cholesteroldv = nib_scrape.pull_from_to("=\"", "\"")

        nib_scrape.move_to('data-sodium')
        sodium = nib_scrape.pull_from_to("=\"", "\"")

        nib_scrape.move_to('data-sodium-dv')
        sodiumdv = nib_scrape.pull_from_to("=\"", "\"")

        nib_scrape.move_to('data-total-carb')
        totcarb = nib_scrape.pull_from_to("=\"", "\"")

        nib_scrape.move_to('data-total-carb-dv')
        totcarbdv = nib_scrape.pull_from_to("=\"", "\"")

        nib_scrape.move_to('data-dietary-fiber')
        fiber = nib_scrape.pull_from_to("=\"", "\"")

        nib_scrape.move_to('data-dietary-fiber-dv')
        fiberdv = nib_scrape.pull_from_to("=\"", "\"")

        nib_scrape.move_to('data-sugars')
        sugar = nib_scrape.pull_from_to("=\"", "\"")

        nib_scrape.move_to('data-sugars-dv')
        sugardv = nib_scrape.pull_from_to("=\"", "\"")

        nib_scrape.move_to('data-protein')
        protein = nib_scrape.pull_from_to("=\"", "\"")

        nib_scrape.move_to('data-protein-dv')
        proteindv = nib_scrape.pull_from_to("=\"", "\"")

        nib_scrape.move_to('data-dish-name')
        name = nib_scrape.pull_from_to("=\"", "\"")

        csvWriter.writerow([name, servingsize, cal, fatcal, totFat, totFatdv, satfat, satfatdv, transfat,
                            cholesterol, cholesteroldv, sodium, sodiumdv, totcarb, totcarbdv, fiber, fiberdv,
                            sugar, protein, diet, allergens, ingredients])

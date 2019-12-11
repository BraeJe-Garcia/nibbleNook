import scraper
import csv


def scrape_nutrients(csvWriter, nib_scrape,
                     cutoff):  # grabs the nutrient values, cutoff is the point where we stop scraping
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

    nib_scrape.move_to('data-protein')
    protein = nib_scrape.pull_from_to("=\"", "\"")

    nib_scrape.move_to('data-dish-name')
    name = nib_scrape.pull_from_to("=\"", "\"")

    if nib_scrape.scout(cutoff) != -1:
        csvWriter.writerow([name, servingsize, cal, fatcal, totFat, totFatdv, satfat, satfatdv, transfat,
                            cholesterol, cholesteroldv, sodium, sodiumdv, totcarb, totcarbdv, fiber, fiberdv,
                            sugar, protein, diet, allergens, ingredients])


def build_csv(csv_name, dhall_scraper):  # builds csv line by line,
    with open(csv_name, 'w+', newline='') as csvfile:
        csvWriter = csv.writer(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        csvWriter.writerow(['Name', 'Serving Size', 'Calories', 'Fat Cal', 'Total Fat', 'Daily Value Total Fat',
                            'Saturated Fat', 'Daily Value Saturated Fat', 'Trans Fat', 'Cholesterol',
                            'Daily Value Cholesterol', 'Sodium', 'Daily Value Sodium', 'Total Carbs',
                            'Daily Value Total Carbs', 'Fiber', 'Daily Value Fiber', 'Sugar', 'Protein',
                            'Dietary Restrictions', 'Allergens', "Ingredients"])  # headers of the csv

        dhall_scraper.move_to('Breakfast Entrees')  # Breakfast
        csvWriter.writerow(['Breakfast Entrees'])
        for x in range(200):  # scrapes all the breakfast foods, stops when lunch foods start, 200 just catch all
            if dhall_scraper.scout('lunch_fp') == -1:
                break
            else:
                scrape_nutrients(csvWriter, dhall_scraper, 'lunch_fp')

        dhall_scraper.move_to('lunch_fp')  # Lunch
        csvWriter.writerow(['Lunch'])
        for x in range(200):  # scrapes all the lunch foods, stops when dinner foods start, 200 is just big number
            if dhall_scraper.scout('dinner_fp') == -1:
                break
            else:
                scrape_nutrients(csvWriter, dhall_scraper, 'dinner_fp')

        dhall_scraper.move_to('dinner_fp')  # Dinner
        csvWriter.writerow(['Dinner'])
        for x in range(200):  # scrapes all the dinner foods, stops when grab and go foods start, 200 is just big number
            if dhall_scraper.scout("Grab' n Go") == -1:
                break
            else:
                scrape_nutrients(csvWriter, dhall_scraper, "Grab' n Go")

        dhall_scraper.move_to("Grab' n Go")  # Grab and Go
        csvWriter.writerow(["Grab n' Go"])
        for x in range(200):  # scrapes all the grabgo foods, stops when latenight foods start, 200 is just big number
            if dhall_scraper.scout("latenight_fp") == -1:
                break
            else:
                scrape_nutrients(csvWriter, dhall_scraper, "latenight_fp")

        dhall_scraper.move_to("latenight_fp")  # Late night
        csvWriter.writerow(["Late Night"])
        for x in range(200):  # scrapes all the latenight foods, stops when reachs next menu, 200 is just big number
            if dhall_scraper.scout("Upcoming Menus") == -1:
                break
            else:
                scrape_nutrients(csvWriter, dhall_scraper, "Upcoming Menus")


#########################

if __name__ == '__main__':
    # Berk URL https://umassdining.com/locations-menus/berkshire/menu
    # Hamp URL https://umassdining.com/locations-menus/hampshire/menu
    # Frank URL https://umassdining.com/locations-menus/franklin/menu
    # Woo URL https://umassdining.com/locations-menus/worcester/menu

    berk_scrape = scraper.UrlScraper("https://umassdining.com/locations-menus/berkshire/menu",
                                     headers={'User-Agent': 'Mozilla/5.0'})
    hamp_scrape = scraper.UrlScraper("https://umassdining.com/locations-menus/hampshire/menu",
                                     headers={'User-Agent': 'Mozilla/5.0'})
    frank_scrape = scraper.UrlScraper("https://umassdining.com/locations-menus/franklin/menu",
                                      headers={'User-Agent': 'Mozilla/5.0'})
    woo_scrape = scraper.UrlScraper("https://umassdining.com/locations-menus/worcester/menu",
                                    headers={'User-Agent': 'Mozilla/5.0'})

    dhalls = {berk_scrape: 'Berk.csv', hamp_scrape: 'Hamp.csv', frank_scrape: 'Frank.csv', woo_scrape: 'Woo.csv'}

    for scrape, csvname in dhalls.items():
        build_csv(csvname, scrape)

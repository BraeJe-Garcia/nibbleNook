function filter(data, filters) {
  for (meal of mealKeys) {
    if (!filters.includes(meal) && Object.keys(data).includes(meal)) {
      if (data[meal].length > 0) {
        data[meal] = [];
      }
    }
  }
  for (allg of allergiesKeys) {
    if (filters.includes(allg)) {
      data = removeAllg(data, allg);
    }
  }
  
  for (diet of dietKeys) {
    if(filters.includes(diet)) {
      data = findDiet(data, diet);
    }
  }
  console.log(data);
}

function removeAllg(data, allg) {
  for (meal of Object.values(data)) {
    for (var i = 0; i < meal.length; i++) {
      if (meal[i].Allergens.includes(allg)) {
        meal.splice(i, 1);
        i--;
      }
    }
  }
  return data;
}

function findDiet(data, diet) {
  for (meal of Object.values(data)) {
    for (var i = 0; i < meal.length; i++) {
      if(!meal[i]['Dietary Restrictions'].includes(diet)) {
        meal.splice(i, 1);
        i--;
      }
    }
  }
  return data;
}

//converts csv text to json-like structure
function objectify(data) {
  var items = data.split("\n");
  // removes first item which is the list of labels
  var labels = items.shift().split(",");
  
  var menu = {};
  var currMeal = "";
  for (item of items) {
    // ignores empty lines in csv
    if (item !== "") {
      // tests whether csv line is header
      if (item.indexOf(",") == -1) {
        var meal = (item.toLowerCase()).replace(/\s/g, "");
        currMeal = meal;
        menu[meal] = [];
      }
      else {
        var dish = rowToObj(item, labels);
        menu[currMeal].push(dish);
      }
    }
  }
  return menu;
}

//converts menu item row from csv into object
function rowToObj(text, labels) {
  var lists = text.split('"');
  
  clean(lists);
  // 1st element is simply the nutrient attributes which are ignored by the list section
  var nutrients = lists.shift().split(",");
  clean(nutrients);
  if (lists.length < 3) {
    lists.unshift(nutrients.pop());
  }
  
  //converts allergens and diets list into arrays
  for (var i = 0; i < lists.length - 1; i++) {
    lists[i] = lists[i].split(",");
    clean(lists[i]);
  }
  
  var item = [];
  for (elem of nutrients) {
    item.push(elem);
  }
  item = item.concat(lists);
  var dish = {};
  for (var j = 0; j < labels.length; j++) {
    dish[labels[j]] = item[j];
  }
  return dish;
}

//gets rid of unnecessary array elements and trims the preceding and trailing whitespaces off the necessary ones
function clean(arr) {
  for (var i = 0; i < arr.length; i++) {
    if (!(/\w/).test(arr[i])) {
      arr.splice(i, 1);
      i--;
    }
    else {
      arr[i] = arr[i].replace(/^\s+|\s+$/g, "");
    }
  }
}

//converts html value attribute to csv label
function translate(filters) {
  var dcValues = ["berk", "hamp", "woo", "frank"];
  var dietValues = ["10", "11", "12", "13", "14", "15", "16"];
  var allergiesValues = ["21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "20555"];
  var mealValues = ["breakfast", "lunch", "dinner", "late night"];
  
  dcKeys = ["Berkshire", "Hampshire", "Franklin", "Worcester"];
  dietKeys = ["Vegetarian", "Vegan", "Local", "Whole Grain", "Halal", "Antiobiotic Free", "Sustainable"];
  allergiesKeys = ["Milk", "Peanuts", "Shellfish", "Eggs", "Gluten", "Tree Nuts", "Fish", "Soy", "Corn", "Sesame"];
  mealKeys = ["breakfastentrees", "lunch", "dinner", "latenight"];

  for (i = 0; i < filters.length; i++) {
    if (dcValues.includes(filters[i])) {
      filters[i] = dcKeys[dcValues.indexOf(filters[i])];
    }
    else if (dietValues.includes(filters[i])) {
      filters[i] = dietKeys[dietValues.indexOf(filters[i])];
    }
    else if (allergiesValues.includes(filters[i])) {
      filters[i] = allergiesKeys[allergiesValues.indexOf(filters[i])];
    }
    else if (mealValues.includes(filters[i])) {
      filters[i] = mealKeys[mealValues.indexOf(filters[i])];
    }
  }
  return filters;
}

function ready() {
  setTimeout(function() {
    console.log("Ready");
    var filters = [];

    $(":checked").each(function(elem) {
      filters.push($(this).val());
    });
    filters = translate(filters);

    $.get("Nibby.csv", function(data) {
      filter(objectify(data), filters);
    }, "text").fail(function(jqXHR) {
      console.log("There was a problem contacting the server: " + jqXHR.status + " " + jqXHR.responseText);
    });
  }, 5000);
  
}

$(document).ready(ready);




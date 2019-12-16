$(document).ready(function() {
    setupToggled();
    setupAccordion();
    setupDropdown();
    $('body').addClass('javascript');
});
function setupToggled() {
    $('.toggled').each(function() {
        var node = $(this);
        var open_toggles = $('.' + node.attr('id') + "_open");
        var close_toggles = $('.' + node.attr('id') + "_close");
        if (node.hasClass('open')) {
            close_toggles.each(function() {
                $(this).show();
            });
            open_toggles.each(function() {
                $(this).hide();
            });
        } else {
            node.hide();
            close_toggles.each(function() {
                $(this).hide();
            });
            open_toggles.each(function() {
                $(this).show();
            });
        }
        open_toggles.each(function() {
            $(this).click(function(e) {
                if ($(this).attr('href') == '#') {
                    e.preventDefault();
                }
                node.show();
                open_toggles.each(function() {
                    $(this).hide();
                });
                close_toggles.each(function() {
                    $(this).show();
                });
            });
        });
        close_toggles.each(function() {
            $(this).click(function(e) {
                if ($(this).attr('href') == '#') {
                    e.preventDefault();
                }
                node.hide();
                close_toggles.each(function() {
                    $(this).hide();
                });
                open_toggles.each(function() {
                    $(this).show();
                });
            });
        });
    });
}

function setupDropdown() {
    $('#header').find('.dropdown').attr("aria-haspopup", true);
    $('#header').find('.dropdown, .dropdown .actions').children('a').attr({
        'class': 'dropdown-toggle',
        'data-toggle': 'dropdown',
        'data-target': '#'
    });
    $('.dropdown').find('.menu').addClass("dropdown-menu");
    $('.dropdown').find('.menu').children('li').attr("role", "menu-item");
}

function setupAccordion() {
	$(".expandable").each(function() {
		var pane = $(this);
		if (!pane.hasClass("hidden")) {
			pane.addClass("hidden");
		}
		;pane.prev().removeClass("hidden").addClass("collapsed").click(function(e) {
			var expander = $(this);
			if (expander.attr('href') == '#') {
				e.preventDefault();
			}
			;expander.toggleClass("collapsed").toggleClass("expanded").next().toggleClass("hidden");
		});
	});
}

function toggleFilter() {
    document.getElementById("work-filters").classList.toggle("narrow-hidden");
}

function display(data) {
  for (meal of Object.keys(data)) {
    if (data[meal].length > 0) {
      $("<ul class='results'>" + meal + "</ul>").insertAfter("a.close");
      // data[meal].sort(function(a, b) {
      //   return relevance(b) - relevance(a);
      // });
      var i = 0;
      for (item of data[meal]) {
        // if (i >= 5) {
        //   break;
        // }
        $("<li>" + item.Name + "</li>").appendTo("ul.results");
        i++;
      }
    }
  }
}

function relevance(meal) {
  var ratio = nutrition.calories / meal.Calories;
  var relevance = 0;

  var vals = Object.keys(nutrition);
  var keys = translateNutr(Object.keys(nutrition))
  for (var i = 1; i < vals.length; i++) {
    var key = keys[i];
    var val = vals[i];
    var mealkey = parseFloat(removeGram(meal[key]));
    relevance = relevance + (mealkey*ratio - nutrition[val]);
  }
  return relevance;
}

function removeGram(str) {
  if (str.indexOf("g") != -1) {
    str = str.substring(0, str.length - 1);
  }
  return str;
}

function filter(data, filters) {
  console.log(filters);
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
    if (filters.includes(diet)) {
      data = findDiet(data, diet);
    }
  }
  display(data);
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
        var meal = (item.toLowerCase()).replace(/\s/g, "").replace(/'/g, "");
        currMeal = meal;
        menu[meal] = [];
      }
      else {
        if (validRow(item)) {
          var dish = rowToObj(item, labels);
          menu[currMeal].push(dish);
        }
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
  nutrients.splice(nutrients.length - 1, 1);
  if (lists.length < 3) {
    var first = lists[0].split(',');
    for (i in first) {
      first[i] = first[i].replace(/^\s+|\s+$/g, "");
    }
    if (contains(first, allergiesKeys)) {
      //dietary restrictions attribute got stuck in nutrients array
      lists.unshift(nutrients.pop());
    }
    else if (contains(first, dietKeys)) {
      var temp = lists.pop().split(',');
      //one of allergens and ingredients is empty
      if (count(temp) >= 2) {
        if (temp[0] === '') {
          clean(temp);
          temp.unshift('');
        }
        else {
          temp.push('');
        }
      }
      else {
        clean(temp);
      }
      for (elem of temp) {
        lists.push(elem);
      }
    }
    //must contain ingredients
    else {
      lists.unshift(nutrients.pop());
      lists.unshift(nutrients.pop());
    }
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

function contains(arr1, arr2) {
  for (elem of arr1) {
    if (!(arr2.includes(elem))) {
      return false;
    }
  }
  return true;
}

//gets rid of unnecessary array elements and trims the preceding and trailing whitespaces off the necessary ones
function clean(arr) {
  for (var i = 0; i < arr.length; i++) {
    if (!(/,.*,+|\w/).test(arr[i])) {
      arr.splice(i, 1);
      i--;
    }
    else {
      arr[i] = arr[i].replace(/^\s+|\s+$/g, "");
    }
  }
}
 
//returns count of unnecessary elements in array
function count(arr) {
  var count = 0;
  for (var i = 0; i < arr.length; i++) {
    if (!(/,.*,+|\w/).test(arr[i])) {
      count++;
    }
  }
  return count;
}

function validRow(str) {
  return !(/\d?"/).test(str.substring(0, 2));
}

//converts html value attribute to csv label
function translate(filters) {
  var dcValues = ["berk", "hamp", "frank", "woo"];
  var dietValues = ["10", "11", "12", "13", "14", "15", "16"];
  var allergiesValues = ["21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "20555"];
  var mealValues = ["breakfast", "lunch", "dinner", "late night", "grab n go"];
  
  dcKeys = ["Berk", "Hamp", "Frank", "Woo"]
  dietKeys = ["Vegetarian", "Vegan", "Local", "Whole Grain", "Halal", "Antibiotic Free", "Sustainable"];
  allergiesKeys = ["Milk", "Peanuts", "Shellfish", "Eggs", "Gluten", "Tree Nuts", "Fish", "Soy", "Corn", "Sesame"];
  mealKeys = ["breakfastentrees", "lunch", "dinner", "latenight", "grabngo"];

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

function translateNutr(arr) {
  nutrValues = ["calories", "fat", "cholesterol", "sodium", "carbohydrates", "protein"];
  nutrKeys = ["Calories", "Total Fat", "Cholesterol", "Sodium", "Total Carbs", "Protein"];
  for (i = 0; i < arr.length; i++) {
    arr[i] = nutrKeys[nutrValues.indexOf(arr[i])];
  }
  return arr;
}

function onSubmit() {
    console.log("Ready");
    var filters = [];
    //hardcoded for testing
    nutrition = {calories: 100, fat: 100, cholesterol: 100, sodium: 100, carbohydrates: 100, protein: 100};
    
    $(":checked").each(function(elem) {
      filters.push($(this).val());
    });
    filters = translate(filters);
    
    var filenames = [];
    for (dc of dcKeys) {
      if (filters.includes(dc)) {
        filenames.push(dc + ".csv");
      }
    }
    console.log(filenames);
    for (filename of filenames) {
      $.get(filename, function(data) {
        filter(objectify(data), filters);
      }, "text").fail(function(jqXHR) {
        console.log("There was a problem contacting the server: " + jqXHR.status + " " + jqXHR.responseText);
      });
      
    }
}

/* globals: $ */
var $ = window.$,
    jQuery = window.jQuery,
    todos
    categoryNames = [];

// adds usability to the tabs
var createTabs = function () {
    "use strict";
    var target = $(this).attr("href");
    // add/removes active class from tab
    $(".active").removeClass("active");
    $(this).addClass("active");
    $("#" + target).addClass("active");
    //
    return false;
};

// fills the categories with the items in them
var fillCategory = function (category_name) {
    "use strict";
    // adds a div with the id of the category name
    $("<div class='category' id='" + category_name + "'></div>").appendTo("#categorized");
    // adds a header to the category name div
    $("<h2>" + category_name + "</h2>").appendTo("#" + category_name);
    // checks if the item being looked at has the category currently being
    // added to, if it does, it appends it to the paragraph
    todos.forEach(function (todo) {
        todo.categories.forEach(function (category) {
            // checks if the item's category matches the current category
            if (category === category_name) {
                // adds the item to a paragraph
                $("<p><i class='icon-remove'></i>" + todo.description + "</p>").appendTo("#" + category_name);
            }
        });
    });
};

// adds each item/category to the all list
var refreshMainList = function () {
    "use strict";
    var list_item;
    // empties the category so there isn't double-click overlap
    $("#all-items").empty();
    todos.forEach(function (todo, itemIndex) {
        // adds a paragraph, adds the remove button to the paragraph
        list_item = "<p id='title_and_category' data-attribute='" + itemIndex + "'><i class='icon-remove'></i>";
        // adds each description to the string
        list_item += todo.description + "<span id='categories'>";
        // adds each category to the string
        todo.categories.forEach(function (category) {
            list_item += category;
            // only adds comma if it's the last category
            if (todo.categories[todo.categories.length - 1] !== category) {
                list_item += ", ";
            }
        });
        list_item += "</span></p>";
        // finally adds string to the div
        $(list_item).appendTo("#all-items");
    });
};

// determines if the category has been used before
var addUnseenCategoryToArray = function (category) {
    // check to see if the current category is in the array
    // -1 means it is not in the array, and it adds to the array
    // console.log(category);
    "use strict";
    if (categoryNames.indexOf(category) === -1) {
        categoryNames.push(category);
    }
    return categoryNames;
};

var populateCategoryNames = function () {
    "use strict";
    // drills down to get each category
    todos.forEach(function (todo) {
        todo.categories.forEach(function (category) {
            // addUnseenCategoryToArray updates categoryNames array
            categoryNames = addUnseenCategoryToArray(category);
            // console.log(categoryNames);
        });
    });
    return categoryNames;
};

// refreshes categorized tab
var refreshCategorizedList = function () {
    console.log("Emptying categorized list");
    $("#categorized").empty();
    // add all the items for each item in the array
    categoryNames.forEach(function (category) {
        fillCategory(category);
    });
};

// removes item when user clicks remove button
var removeItem = function () {
    "use strict";
    var currentItem,
        currentItemIndex;
    // gets the parent
    currentItem = $(this).parent();
    // removes the parent
    currentItem.fadeOut(400, function () {
        currentItem.remove();
    });
    // gets the index of the current item
    currentItemIndex = currentItem.attr("data-attribute");
    // removes the current item
    todos.splice(currentItemIndex, 1);
};

var editTab = function () {
    "use strict";
    var newItem,
        newItemCategories,
        newItemObject = {},
        categoryKnapsack = [];
    // gets items the user submits
    newItem = $("#user_title").val();
    newItemCategories = $("#user_categories").val();
    // clears out the inputs
    $("#user_title").val("");
    $("#user_categories").val("");
    // splits the list into separate strings based on spaces
    newItemCategories.split(",").map(function (element) {
        // removes the spaces and adds to knapsack
        categoryKnapsack.push(element.trim());
    });
    // adds the new items/categories to an object
    newItemObject.description = newItem;
    newItemObject.categories = categoryKnapsack;
    // adds the new items/categories to the todos array
    todos.push(newItemObject);
    refreshMainList();
};

// submits form on enter key
var submitOnEnter = function (e) {
    if (e.keyCode === 13) {    // 13 is the enter key
        $(".user_input_button").click();
    }
};

// runs all the functions
var main = function () {
    "use strict";
    $(".tabs > .tab").click(createTabs);
    // gets the JSON file.  critical.
    $.getJSON("all.json", function (json_todos) {
        todos = json_todos;
        refreshMainList();
        populateCategoryNames();
        categoryNames.sort();
        $("#tab-categorized").click(refreshCategorizedList);
        $(".icon-remove").click(removeItem);
        $(".user_input_button").click(editTab);
        $(".user_input").keypress(submitOnEnter);
    });
};

$(document).ready(main);
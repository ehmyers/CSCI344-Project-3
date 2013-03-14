/* globals: $ */
var $ = window.$,
    jQuery = window.jQuery,
    todos,
    highestId = 0,
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

// adds a new id to each item at beginning
var initializeTodos = function () {
    "use strict";
    todos.forEach(function (todo) {
        todo.id = highestId;
        highestId += 1;
    });
};

// adds a div with the id of the category name
var addCategoryDiv = function (category_name) {
    "use strict";
    var header;
    // adds a header to the category name div
    header = "<h2>" + category_name + "</h2>";
    // appends all to div
    $("<div class='category' id='" + category_name + "'>" + header + "</div>").appendTo("#categorized");
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
        });
    });
    categoryNames.sort();
    return categoryNames;
};

// fills the categories with the items in them
var fillCategory = function (category_name) {
    "use strict";
    addCategoryDiv(category_name);
    // checks if the item being looked at has the category currently being
    // added to, if it does, it appends it to the paragraph
    todos.forEach(function (todo) {
        todo.categories.forEach(function (category) {
            // checks if the item's category matches the current category
            if (category === category_name) {
                // adds the item to a paragraph
                $("<p data-id='" + todo.id + "'><i class='icon-remove'></i>" + todo.description + "</p>").appendTo("#" + category_name);
            }
            if (categoryNames.indexOf(category) === -1) {
                addUnseenCategoryToArray(category);
                //console.log(categoryNames);
            }
        });
    });
};

// adds each item/category to the all list
var refreshMainList = function () {
    "use strict";
    var list_item;
    // empties the category so there isn't double-click overlap
    $("#all_items").empty();
    todos.forEach(function (todo) {
        // adds a paragraph, adds the remove button to the paragraph
        list_item = "<p id='title_and_category' data-id='" + todo.id + "'><i class='icon-remove'></i>";
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
        $(list_item).appendTo("#all_items");
    });
};

// gets the index of an item based on id
var idToIndex = function (id) {
    "use strict";
    var newIndex;
    todos.forEach(function (item, index) {
        //console.log("the item.id is " + item.id);
        //console.log("the id is " + id);
        if (Number(id) === Number(item.id)) {
            //console.log("the matched item is " + index);
            newIndex = index;
        }
    });
    //console.log(newIndex);
    return newIndex;
};

// removes empty header categories from the categories tab
var removeEmptyCategories = function () {
    "use strict";
    var item;
    // checks to see if category is empty, removes if so
    $(".category").each(function (index, item) {
        item = $(this);
        //console.log(item.parent());
        if (item.find("p").length === 0) {
            console.log("nothing found!");
            item.remove();
        }
    });
};

// removes item when user clicks remove button
var removeItem = function () {
    "use strict";
    var currentItem,
        currentItemId,
        currentItemIndex;
    // gets the parent
    currentItem = $(this).parent();
    // gets the index of the current item
    currentItemId = currentItem.attr("data-id");
    currentItemIndex = idToIndex(currentItemId);
    // removes the parent
    $("[data-id='" + currentItemId + "']").fadeOut(400, function () {
        $(this).remove();
    });
    // removes the current item
    todos.splice(currentItemIndex, 1);
    removeEmptyCategories();
};

// refreshes categorized tab
var refreshCategorizedList = function () {
    "use strict";
    $("#categorized").empty();
    populateCategoryNames();
    // add all the items for each item in the array
    categoryNames.forEach(function (category) {
        fillCategory(category);
    });
    // binds the icon-remove's to the removeItem function
    $(".icon-remove").click(removeItem);
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
        //console.log(categoryKnapsack);
    });
    // adds the new items/categories to an object
    newItemObject.description = newItem;
    newItemObject.categories = categoryKnapsack;
    // adds an id to the object, increments
    newItemObject.id = highestId + 1;
    highestId += 1;
    // adds the new items/categories to the todos array
    todos.push(newItemObject);
    refreshMainList();
};

// submits form on enter key
var submitOnEnter = function (e) {
    "use strict";
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
        initializeTodos();
        refreshMainList();
        $(".icon-remove").click(removeItem);
        $("#tab_categorized").click(refreshCategorizedList);
        $("#tab_all").click(refreshMainList);
        $(".user_input_button").click(editTab);
        $(".user_input").keypress(submitOnEnter);
    });
};

$(document).ready(main);
/* globals: $ */
var $ = window.$,
    jQuery = window.jQuery;

var main = function () {
    var user_input,
    categories,
    categoryNames = ["shopping", "work", "home"],
    list_item;

    // adds usability to the tabs
    $(".tabs > .tab").click(function () {
        var target = $(this).attr("href");
        // add/removes active class from tab
        $(".active").removeClass("active");
        $(this).addClass("active");
        $("#" + target).addClass("active");
        
        return false;
    });

    // prints all out, along with categories
    $.getJSON("all.json", function (todos) { // gets the JSON file.  critical.

        // fills the categories with the items in them
        var fillCategory = function (category_name) {
            // adds a div with the id of the category name
            $("<div class='category' id='" + category_name + "'></div>").appendTo("#categorized");
            // empties the category so there isn't double-click overlap
            $("#" + category_name).empty();
            // adds a header to the category name div
            $("<h2>" + category_name + "</h2>").appendTo("#" + category_name);
            // checks if the item being looked at has the category currently being
            // added to, if it does, it appends it to the paragraph
            todos.forEach(function (todo) {
                todo.categories.forEach(function (category) {
                    // checks if the item's category matches the current category
                    if (category === category_name) {
                        // adds the item to the current paragraph
                        $("<p>" + todo.description + "</p>").appendTo("#" + category_name);
                        console.log(todo.description);
                    }
                });
            });
        }

        // adds each item/category to the all list
        todos.forEach(function (todo) {
            // adds each description to the string
            list_item = "<p id='title_and_category'>" + todo.description + "<span id='categories'>";
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

        // recalculates to do list for categorized tab
        $(".tabs > .tab").click(function () {
            var target = $(this).attr("href");
            //console.log("you clicked tab " + target);
            if (target === "categorized") {
                categoryNames.forEach(function (category) {
                    fillCategory(category);
                });
            }
        });
    });

    // $(user_input).split(",").map(function (element) {
    //     return element.trim(); // <-- removes all the spaces!!
    //     categories = $("input_box").split(",");
    // });
}

$(document).ready(main);
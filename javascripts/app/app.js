/* globals: $ */
var $ = window.$,
    jQuery = window.jQuery;

var main = function () {
    var user_input,
    categories,
    list_item;

    // adds usability to the tabs
    $(".tabs > .tab").click(function () {
        var target = $(this).attr("href");
        
        $(".active").removeClass("active");
        $(this).addClass("active");
        $("#" + target).addClass("active");
        
        return false;
    });

    // prints all out, along with categories
    $.getJSON("all.json", function (todos) {

        var fillCategory = function (category_name) {
            $("#" + category_name).empty(); // make this categorized later.
            todos.forEach(function (todo) {
                todo.categories.forEach(function (category) {
                    if (category === category_name) {
                        $("<p>" + todo.description + "</p>").appendTo("#" + category_name);
                        console.log(todo.description);
                    }
                });
            });
        }

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
                fillCategory("shopping");
            }
        });
    });

    // $(user_input).split(",").map(function (element) {
    //     return element.trim(); // <-- removes all the spaces!!
    //     categories = $("input_box").split(",");
    // });
}

$(document).ready(main);
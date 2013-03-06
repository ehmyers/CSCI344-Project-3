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
        todos.forEach(function (todo) {
            list_item = "<p id='title_and_category'>" + todo.description + "<span id='categories'>";
            todo.categories.forEach(function (category) {
                list_item += category;
                // only adds comma if it's the last category
                if (todo.categories[todo.categories.length - 1] !== category) {
                    list_item += ", ";
                }
            });
            list_item += "</span></p>";
            $(list_item).appendTo("#all-items");
        });  
    });

    // $(user_input).split(",").map(function (element) {
    //     return element.trim(); // <-- removes all the spaces!!
    //     categories = $("input_box").split(",");
    // });
}

$(document).ready(main);
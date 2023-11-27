// Global variables.
var data = [];
var itemsPerPage = 9;
var linkList = document.querySelector(".link-list");
var showNoMatch = false;
var filteredList;
var highlightedNamesArr = [];
// Fetch data from an API.
var url = "https://randomuser.me/api/?results=42&inc=name, picture, email, dob &noinfo &nat=US";
fetch(url)
    .then(function (res) { return res.json(); })
    .then(function (res) { return res.results; })
    .then(extractData)
    .catch(function (err) { return alert(err); });
// Extract student info by destructuring the fetched data.
function extractData(fetchedData) {
    fetchedData.forEach(function (student) {
        var _a = student.name, first = _a.first, last = _a.last, email = student.email, date = student.dob.date, img = student.picture.large;
        var dob = /\d{4}-\d{2}-\d{2}/.exec(date)[0];
        data.push({ name: "".concat(first, " ").concat(last), email: email, dob: dob, img: img });
    });
    // Display unfiltered student list and pagination buttons.
    showPageAndPagination(data);
}
// Build html to inject and display 9 student cards per page.
function showPage(list, page) {
    var firstIndex = (page * itemsPerPage) - itemsPerPage;
    var lastIndex = (page * itemsPerPage) - 1;
    var studentList = document.querySelector(".student-list");
    studentList.innerHTML = "";
    var html = "";
    list.forEach(function (student, index) {
        var name = student.name, email = student.email, img = student.img, dob = student.dob;
        if (index >= firstIndex && index <= lastIndex) {
            var fullName = highlightedNamesArr[index] || name;
            html +=
                "<li class=\"student-item cf\">\n          <div class=\"student-details\">\n            <img class=\"avatar\" src=".concat(img, " alt=\"Profile Picture\">\n            <h3>").concat(fullName, "</h3>\n            <span class=\"email\">").concat(email, "</span>\n          </div>\n          <div class=\"joined-details\">\n            <span class=\"date\">Born ").concat(dob, "</span>\n          </div>\n        </li>");
        }
    });
    studentList.innerHTML = html;
}
// Build html to inject and display pagination buttons.
function addPagination(list) {
    linkList.innerHTML = "";
    if (list.length === 0)
        return; // No search matches.
    var numberOfPages = Math.ceil(list.length / itemsPerPage);
    var html = "";
    for (var i = 1; i <= numberOfPages; i++) {
        html += "<li><button type=\"button\">".concat(i, "</button></li>");
    }
    linkList.innerHTML = html;
    var firstBtn = document.querySelector(".pagination button");
    firstBtn.classList.add("active");
}
// Listener for pagination button clicks.
linkList.addEventListener("click", function (_a) {
    var target = _a.target;
    if (target.closest("button")) {
        document.querySelector(".active").classList.remove("active");
        target.classList.add("active");
        var pageNumber = parseInt(target.textContent);
        // Default to data if filteredList is undefined
        var list = filteredList || data;
        showPage(list, pageNumber);
    }
});
// Insert html for a search field.
var htmlSearch = "<label for=\"search\" class=\"student-search\">\n    <span>Search by name</span>\n    <input id=\"search\" placeholder=\"Search by name...\">\n    <button type=\"button\"><img src=\"./assets/img/icn-search.svg\" alt=\"Search icon\"></button>\n  </label>";
var header = document.querySelector(".header");
header.insertAdjacentHTML("beforeend", htmlSearch);
// Filter student list.
var searchField = document.getElementById("search");
searchField.addEventListener("input", getStudentsByName);
function getStudentsByName() {
    var input = searchField.value.toLowerCase();
    filteredList = data.filter(function (student) {
        var name = student.name;
        return name.toLowerCase().includes(input);
    });
    // Replace name's string matching part with the same text in a highlighted span element.
    highlightedNamesArr = [];
    filteredList.forEach(function (student) {
        var name = student.name;
        var input = searchField.value.toLowerCase();
        var fullNameLC = name.toLowerCase();
        var matchingPart = name.substring(fullNameLC.indexOf(input), fullNameLC.indexOf(input) + input.length);
        var highlightedMatch = "<span class=\"highlight\">".concat(matchingPart, "</span>");
        var highlightedFullName = name.replace(matchingPart, highlightedMatch);
        highlightedNamesArr.push(highlightedFullName);
    });
    // Display student list and pagination buttons.
    showPageAndPagination(filteredList);
    // If no matches found, display a warning message.
    if (filteredList.length === 0) {
        var msg = "<div class=\"warning\">\n        <img class=\"warning-icon\" src=\"./assets/img/warning.svg\" alt=\"warning icon\">\n        <div class=\"warning-content\">\n          <p class=\"warning-title\">Oops!</p>\n          <p class=\"warning-msg\">No matches found</p>\n        </div>\n        <button class=\"warning-close\">&#x2715</button>\n      </div>";
        if (!showNoMatch) {
            document.querySelector(".header").insertAdjacentHTML("afterend", msg);
            showNoMatch = true;
            // Warning close button listener.
            var closeBtn = document.querySelector(".warning-close");
            closeBtn.addEventListener("click", function () {
                document.querySelector(".warning").remove();
                showNoMatch = false;
            });
        }
    }
    // If matches found, remove the warning.
    else if (showNoMatch) {
        var warning = document.querySelector(".warning");
        warning.remove();
        showNoMatch = false;
    }
}
// Display everything.
function showPageAndPagination(list) {
    showPage(list, 1);
    addPagination(list);
}
// Search field auto-focus on load.
setTimeout(searchFocus, 1600);
function searchFocus() {
    searchField.focus();
    document.querySelector(".student-search").classList.add("js-focus-anim");
}

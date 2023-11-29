"use strict";
var _a;
// Global variables.
const itemsPerPage = 9;
const data = [];
let filteredList;
let highlightedNamesArr = [];
let showNoMatch = false;
// Fetch students' data from an API.
const url = `https://randomuser.me/api/?results=42&inc=name, picture, email, dob &noinfo &nat=US`;
fetch(url)
    .then(res => {
    if (!res.ok) {
        throw Error("Could not fetch the resource");
    }
    return res.json();
})
    .then(res => res.results)
    .then(extractData)
    .catch(err => {
    // Display a modal with an error message.
    displayWarning(err.message);
    // Close button click listener for the modal.
    const closeBtn = document.querySelector(".warning-close");
    closeBtn.addEventListener("click", () => { var _a; return (_a = document.querySelector(".warning")) === null || _a === void 0 ? void 0 : _a.remove(); });
});
// Insert a modal into the document with a specified message.
function displayWarning(msg) {
    var _a;
    // Warning modal.
    const warning = `<div class="warning">
    <img class="warning-icon" src="./assets/img/warning.svg" alt="warning icon">
    <div class="warning-content">
      <p class="warning-title">Oops!</p>
      <p class="warning-msg">${msg}</p>
    </div>
    <button class="warning-close">&#x2715</button>
  </div>`;
    // Insert the modal.
    (_a = document.querySelector(".header")) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML("afterend", warning);
}
// Extract student info by destructuring the fetched data.
function extractData(fetchedData) {
    fetchedData.forEach((student) => {
        const { name: { first, last }, email, dob: { date }, picture: { large: img } } = student;
        const dob = /\d{4}-\d{2}-\d{2}/.exec(date)[0];
        data.push({ name: `${first} ${last}`, email, dob, img });
    });
    // Display an unfiltered student list and pagination buttons.
    showPageAndPagination(data);
}
// Build html to inject and display 9 student cards per page.
function showPage(list, page) {
    const firstIndex = (page * itemsPerPage) - itemsPerPage;
    const lastIndex = (page * itemsPerPage) - 1;
    const studentList = document.querySelector(".student-list");
    studentList.innerHTML = "";
    let html = "";
    list.forEach((student, index) => {
        const { name, email, img, dob } = student;
        if (index >= firstIndex && index <= lastIndex) {
            const fullName = highlightedNamesArr[index] || name;
            html +=
                `<li class="student-item cf">
          <div class="student-details">
            <img class="avatar" src=${img} alt="Profile Picture">
            <h3>${fullName}</h3>
            <span class="email">${email}</span>
          </div>
          <div class="joined-details">
            <span class="date">Born ${dob}</span>
          </div>
        </li>`;
        }
    });
    studentList.innerHTML = html;
}
// List with pagination buttons.
const linkList = document.querySelector(".link-list");
// Build html to inject and display pagination buttons.
function addPagination(list) {
    linkList.innerHTML = "";
    if (list.length === 0)
        return; // No search matches.
    const numberOfPages = Math.ceil(list.length / itemsPerPage);
    let html = "";
    for (let i = 1; i <= numberOfPages; i++) {
        html += `<li><button type="button">${i}</button></li>`;
    }
    linkList.innerHTML = html;
    const firstBtn = document.querySelector(".pagination button");
    firstBtn.classList.add("active");
}
// Listener for pagination button clicks.
linkList.addEventListener("click", (event) => {
    var _a;
    const target = event.target;
    if (target.closest("button")) {
        (_a = document.querySelector(".active")) === null || _a === void 0 ? void 0 : _a.classList.remove("active");
        target.classList.add("active");
        const pageNumber = parseInt(target.textContent);
        // Default to data if the filteredList is undefined
        const list = filteredList || data;
        showPage(list, pageNumber);
    }
});
// Insert html for a search field.
const htmlSearch = `<label for="search" class="student-search">
    <span>Search by name</span>
    <input id="search" placeholder="Search by name...">
    <button type="button"><img src="./assets/img/icn-search.svg" alt="Search icon"></button>
  </label>`;
const header = document.querySelector(".header");
header.insertAdjacentHTML("beforeend", htmlSearch);
// Filter student list.
const searchField = document.getElementById("search");
searchField.addEventListener("input", getStudentsByName);
function getStudentsByName() {
    const input = searchField.value.toLowerCase();
    filteredList = data.filter((student) => {
        const { name } = student;
        return name.toLowerCase().includes(input);
    });
    // Replace name's string matching part with the same text in a highlighted span element.
    highlightedNamesArr = [];
    filteredList.forEach((student) => {
        const { name } = student;
        const input = searchField.value.toLowerCase();
        const fullNameLC = name.toLowerCase();
        const matchingPart = name.substring(fullNameLC.indexOf(input), fullNameLC.indexOf(input) + input.length);
        const highlightedMatch = `<span class="highlight">${matchingPart}</span>`;
        const highlightedFullName = name.replace(matchingPart, highlightedMatch);
        highlightedNamesArr.push(highlightedFullName);
    });
    // Display student list and pagination buttons.
    showPageAndPagination(filteredList);
    // If no matches found, display a warning message.
    if (filteredList.length === 0) {
        if (!showNoMatch) {
            displayWarning("No matches found");
            showNoMatch = true;
            // Warning close button listener.
            const closeBtn = document.querySelector(".warning-close");
            closeBtn.addEventListener("click", () => {
                var _a;
                (_a = document.querySelector(".warning")) === null || _a === void 0 ? void 0 : _a.remove();
                showNoMatch = false;
            });
        }
    }
    // If matches found, remove the warning.
    else if (showNoMatch) {
        const warning = document.querySelector(".warning");
        warning.remove();
        showNoMatch = false;
    }
}
// Display everything.
function showPageAndPagination(list) {
    showPage(list, 1);
    addPagination(list);
}
// Search field auto-focus and a focus animation on load.
setTimeout(searchFocus, 1600);
function searchFocus() {
    var _a;
    searchField.focus();
    (_a = document.querySelector(".student-search")) === null || _a === void 0 ? void 0 : _a.classList.add("js-focus-anim");
}
// Open or close a card modal.
(_a = document.querySelector(".student-list")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (event) => {
    const target = event === null || event === void 0 ? void 0 : event.target;
    // If the click event bubbled up from a student card, insert the card modal into the page.
    if (target.closest(".student-item")) {
        const targetCard = target.closest(".student-item");
        const avatarSource = targetCard === null || targetCard === void 0 ? void 0 : targetCard.querySelector(".avatar").getAttribute("src");
        const name = targetCard === null || targetCard === void 0 ? void 0 : targetCard.querySelector("h3").textContent;
        const email = targetCard === null || targetCard === void 0 ? void 0 : targetCard.querySelector(".email").textContent;
        // Open card modal on click.
        const cardModalHTML = `<div id="card-modal">
      <div class="modal-content">
        <button class="close">&#x2715;</button>
        <img class="avatar" src="${avatarSource}" alt="Profile picture">
        <p class="name">${name}</p>
        <p class="email">${email}</p>
      </div>
    </div>`;
        document.body.insertAdjacentHTML("beforeend", cardModalHTML);
        // Close card modal on click.
        const cardModal = document.getElementById("card-modal");
        cardModal.addEventListener("click", (event) => {
            const target = event === null || event === void 0 ? void 0 : event.target;
            if (target === cardModal || target.closest(".close")) {
                cardModal.remove();
            }
        });
    }
});

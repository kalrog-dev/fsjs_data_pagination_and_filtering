/*
Treehouse Techdegree:
FSJS Project 2 - Data Pagination and Filtering
*/

// Global variables
const itemsPerPage = 9;
const linkList = document.querySelector(".link-list");
let showNoMatch = false;
let filteredList;

// Build html to inject and display 9 student cards per page
function showPage(list, page) {
  const firstIndex = (page * itemsPerPage) - itemsPerPage;
  const lastIndex = (page * itemsPerPage) - 1;
  const studentList = document.querySelector(".student-list");
  studentList.innerHTML = "";
  let html = "";
  
  list.forEach((student, index) => {
    if (index >= firstIndex && index <= lastIndex) {
      html += 
        `<li class="student-item cf">
          <div class="student-details">
            <img class="avatar" src=${student.picture.large} alt="Profile Picture">
            <h3>${student.name.first} ${student.name.last}</h3>
            <span class="email">${student.email}</span>
          </div>
          <div class="joined-details">
            <span class="date">Joined ${student.registered.date}</span>
          </div>
        </li>`
    }
  });
  studentList.innerHTML = html;
}

// Build html to inject and display pagination buttons
function addPagination(list) {
  linkList.innerHTML = "";
  if (list.length === 0) return;    // No search matches

  const numberOfPages = Math.ceil( list.length / itemsPerPage );
  let html = "";
  for (let i = 1; i <= numberOfPages; i++) {
    html += `<li><button type="button">${i}</button></li>`
  }
  linkList.innerHTML = html;

  const firstBtn = document.querySelector(".pagination button");
  firstBtn.classList.add("active");
}

// Display unfiltered student list and pagination buttons
showPageAndPagination(data);

// Listener for pagination button clicks
linkList.addEventListener("click", (event) => {
  if (event.target.closest("button")) {
    document.querySelector(".active").classList.remove("active");
    event.target.classList.add("active");
    const pageNumber = parseInt(event.target.textContent);
    // Grab data if filteredList is undefined
    const list = filteredList || data;
    showPage(list, pageNumber);
  }
});

// Insert html for a search field
const htmlSearch = 
  `<label for="search" class="student-search">
    <span>Search by name</span>
    <input id="search" placeholder="Search by name...">
    <button type="button"><img src="./assets/img/icn-search.svg" alt="Search icon"></button>
  </label>`;
const header = document.querySelector(".header");
header.insertAdjacentHTML("beforeend", htmlSearch);

// Filter student list
const searchField = document.getElementById("search");
searchField.addEventListener("input", getStudentsByName);
function getStudentsByName() {
  const input = searchField.value.toLowerCase();
  filteredList = data.filter(student => {
    const fullName = `${student.name.first} ${student.name.last}`.toLowerCase();
    return fullName.includes(input) ? true : false;
  });
  showPageAndPagination(filteredList);

  // If no matches found, display a warning message
  if (filteredList.length === 0) {
    const msg = 
      `<div class="warning">
        <img class="warning-icon" src="./assets/img/warning.svg" alt="warning icon">
        <div class="warning-content">
          <p class="warning-title">Oops!</p>
          <p class="warning-msg">No matches found</p>
        </div>
      </div>`;
    if (!showNoMatch) {
      document.querySelector(".header").insertAdjacentHTML("afterend", msg);
      showNoMatch = true;
    }
  } 
  // If matches found, remove the warning
  else if (showNoMatch) {
    const warning = document.querySelector(".warning");
    warning.remove();
    showNoMatch = false;
  }
}

// Display everything
function showPageAndPagination(list) {
  showPage(list, 1);
  addPagination(list);
}
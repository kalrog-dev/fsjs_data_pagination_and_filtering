/*
Treehouse Techdegree:
FSJS Project 2 - Data Pagination and Filtering
*/

// Global variables
const itemsPerPage = 9;
const linkList = document.querySelector(".link-list");

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
  const numberOfPages = Math.ceil( list.length / itemsPerPage );
  linkList.innerHTML = "";
  let html = "";
  for (let i = 1; i <= numberOfPages; i++) {
    html += `<li><button type="button">${i}</button></li>`
  }
  linkList.innerHTML = html;
  const firstBtn = document.querySelector(".pagination button");
  firstBtn.classList.add("active");
}

// Call functions
showPage(data, 1);
addPagination(data);

// Listener for clicks on the .link-list element
linkList.addEventListener("click", (event) => {
  if (event.target.closest("button")) {
    document.querySelector(".active").classList.remove("active");
    event.target.classList.add("active");
    const pageNumber = parseInt(event.target.textContent);
    showPage(data, pageNumber);
  }
});
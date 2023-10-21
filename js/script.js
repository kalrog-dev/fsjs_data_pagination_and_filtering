/*
Treehouse Techdegree:
FSJS Project 2 - Data Pagination and Filtering
*/

// Create and insert/append the elements needed to display a "page" of nine students
function showPage(list, page) {
  const itemsPerPage = 9;
  const firstIndex = (page * itemsPerPage) - itemsPerPage;
  const lastIndex = (page * itemsPerPage) - 1;
  const studentList = document.querySelector(".student-list");
  studentList.innerHTML = "";
  let html = "";

  list.forEach((student, index, array) => {
    if (index >= firstIndex && index <= lastIndex) {
      html += `
        <li class="student-item cf">
          <div class="student-details">
            <img class="avatar" src=${student.picture.large} alt="Profile Picture">
            <h3>${student.name.first} ${student.name.last}</h3>
            <span class="email">${student.email}</span>
          </div>
          <div class="joined-details">
            <span class="date">Joined ${student.registered.date}</span>
          </div>
        </li>
      `
    }
  });

  studentList.innerHTML = html;
}

/*
Create the `addPagination` function
This function will create and insert/append the elements needed for the pagination buttons
*/


// Call functions
showPage(data, 1);
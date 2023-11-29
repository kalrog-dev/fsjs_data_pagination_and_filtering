// Types of the selected information for each student.
interface StudentData {
  name: string,
  email: string,
  dob: string,
  img: string
}

// Types of destructured and other properties from the fetched student data.
interface RawStudentData {
  name: {
    first: string,
    last: string
  },
  email: string,
  dob: {
    date: string
  },
  picture: {
    large: string
  },
  [key: string]: any;
}

// Global variables.
const itemsPerPage: number = 9;
const data: Readonly<StudentData>[] = [];
let filteredList: Readonly<StudentData>[];
let highlightedNamesArr: string[] = [];
let showNoMatch: boolean = false;

// Fetch students' data from an API.
const url: string = `https://randomuser.me/api/?results=42&inc=name, picture, email, dob &noinfo &nat=US`;
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
    const closeBtn = document.querySelector(".warning-close") as HTMLButtonElement;
    closeBtn.addEventListener("click", () => document.querySelector(".warning")?.remove());
  });

// Insert a modal into the document with a specified message.
function displayWarning(msg: string): void {
  // Warning modal.
  const warning: string = 
  `<div class="warning">
    <img class="warning-icon" src="./assets/img/warning.svg" alt="warning icon">
    <div class="warning-content">
      <p class="warning-title">Oops!</p>
      <p class="warning-msg">${msg}</p>
    </div>
    <button class="warning-close">&#x2715</button>
  </div>`;

  // Insert the modal.
  document.querySelector(".header")?.insertAdjacentHTML("afterend", warning);
}

// Extract student info by destructuring the fetched data.
function extractData(fetchedData: Readonly<RawStudentData>[]): void {
  fetchedData.forEach((student: Readonly<RawStudentData>) => {
    const { name: { first, last }, email, dob: { date }, picture: { large: img } } = student;
    const dob: string = /\d{4}-\d{2}-\d{2}/.exec(date)![0];
    data.push({name: `${first} ${last}`, email, dob, img});
  });
  // Display an unfiltered student list and pagination buttons.
  showPageAndPagination(data);
}

// Build html to inject and display 9 student cards per page.
function showPage(list: Readonly<StudentData>[], page: number): void {
  const firstIndex: number = (page * itemsPerPage) - itemsPerPage;
  const lastIndex: number = (page * itemsPerPage) - 1;
  const studentList = document.querySelector(".student-list") as HTMLUListElement;
  studentList.innerHTML = "";
  let html: string = "";
  
  list.forEach((student: Readonly<StudentData>, index: number) => {
    const { name, email, img, dob }: Readonly<StudentData> = student;
    if (index >= firstIndex && index <= lastIndex) {
      const fullName: string = highlightedNamesArr[index] || name;
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
        </li>`
    }
  });
  studentList.innerHTML = html;
}

// List with pagination buttons.
const linkList = document.querySelector(".link-list") as HTMLUListElement;

// Build html to inject and display pagination buttons.
function addPagination(list: Readonly<StudentData>[]): void {
  linkList.innerHTML = "";
  if (list.length === 0) return;    // No search matches.

  const numberOfPages = Math.ceil( list.length / itemsPerPage );
  let html: string = "";
  for (let i = 1; i <= numberOfPages; i++) {
    html += `<li><button type="button">${i}</button></li>`
  }
  linkList.innerHTML = html;

  const firstBtn = document.querySelector(".pagination button") as HTMLButtonElement;
  firstBtn.classList.add("active");
}

// Listener for pagination button clicks.
linkList.addEventListener("click", (event) => {
  const target = event.target as HTMLButtonElement;
  if (target.closest("button")) {
    document.querySelector(".active")?.classList.remove("active");
    target.classList.add("active");
    const pageNumber: number = parseInt(target.textContent!);
    // Default to data if the filteredList is undefined
    const list = filteredList || data;
    showPage(list, pageNumber);
  }
});

// Insert html for a search field.
const htmlSearch: string = 
  `<label for="search" class="student-search">
    <span>Search by name</span>
    <input id="search" placeholder="Search by name...">
    <button type="button"><img src="./assets/img/icn-search.svg" alt="Search icon"></button>
  </label>`;
const header = document.querySelector(".header") as HTMLElement;
header.insertAdjacentHTML("beforeend", htmlSearch);

// Filter student list.
const searchField = document.getElementById("search") as HTMLInputElement;
searchField.addEventListener("input", getStudentsByName);
function getStudentsByName(): void {
  const input: string = searchField.value.toLowerCase();
  filteredList = data.filter((student: Readonly<StudentData>) => {
    const { name } = student;
    return name.toLowerCase().includes(input);
  });

  // Replace name's string matching part with the same text in a highlighted span element.
  highlightedNamesArr = [];
  filteredList.forEach((student: Readonly<StudentData>) => {
    const { name } = student;
    const input: string = searchField.value.toLowerCase();
    const fullNameLC: string = name.toLowerCase()
    const matchingPart: string = name.substring(fullNameLC.indexOf(input), fullNameLC.indexOf(input) + input.length);
    const highlightedMatch: string = `<span class="highlight">${matchingPart}</span>`;
    const highlightedFullName: string = name.replace(matchingPart, highlightedMatch);
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
      const closeBtn = document.querySelector(".warning-close") as HTMLButtonElement;
      closeBtn.addEventListener("click", () => {
        document.querySelector(".warning")?.remove();
        showNoMatch = false;
      });
    }
  } 
  // If matches found, remove the warning.
  else if (showNoMatch) {
    const warning = document.querySelector(".warning") as HTMLDivElement;
    warning.remove();
    showNoMatch = false;
  }
}

// Display everything.
function showPageAndPagination(list: Readonly<StudentData>[]): void {
  showPage(list, 1);
  addPagination(list);
}

// Search field auto-focus and a focus animation on load.
setTimeout(searchFocus, 1600);
function searchFocus(): void {
  searchField.focus();
  document.querySelector(".student-search")?.classList.add("js-focus-anim");
}

// Open or close a card modal.
document.querySelector(".student-list")?.addEventListener("click", (event) => {
  const target = event?.target as HTMLElement;

  // If the click event bubbled up from a student card, insert the card modal into the page.
  if (target.closest(".student-item")) {
    const targetCard = target.closest(".student-item") as HTMLLIElement;
    const avatarSource = targetCard?.querySelector(".avatar")!.getAttribute("src") as string;
    const name = targetCard?.querySelector("h3")!.textContent as string;
    const email = targetCard?.querySelector(".email")!.textContent as string;

    // Open card modal on click.
    const cardModalHTML: string = 
    `<div id="card-modal">
      <div class="modal-content">
        <button class="close">&#x2715;</button>
        <img class="avatar" src="${avatarSource}" alt="Profile picture">
        <p class="name">${name}</p>
        <p class="email">${email}</p>
      </div>
    </div>`;

    document.body.insertAdjacentHTML("beforeend", cardModalHTML);

    // Close card modal on click.
    const cardModal = document.getElementById("card-modal") as HTMLDivElement;
    cardModal.addEventListener("click", (event) => {
      const target = event?.target as HTMLElement;

      if (target === cardModal || target.closest(".close")) {
        cardModal.remove();
      }
    });
  }
})
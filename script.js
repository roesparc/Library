class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }
}

const myLibrary = [
  new Book("The Hobbit", "J.R.R. Tolkien", 295, "Read"),
  new Book(
    "Harry Potter and the Philosopher's Stone",
    "J. K. Rowling",
    223,
    "Not Read"
  ),
  new Book("A Tale of Two Cities", "Charles Dickens", 448, "Not Read"),
];

function displayForm() {
  document.querySelector("form").style.display = "block";
  document.querySelector(".overlay").style.display = "block";
}

function hideForm() {
  document.querySelector(".overlay").style.display = "none";
  document.querySelector("form").style.display = "none";
}

function displayBook() {
  const bookContainer = document.querySelector(".book-container");

  while (bookContainer.childNodes[2]) {
    bookContainer.removeChild(bookContainer.childNodes[2]);
  }

  for (let i = 0; i < myLibrary.length; i++) {
    const book = document.createElement("div");
    const bookTitle = document.createElement("div");
    const bookAuthor = document.createElement("div");
    const bookPages = document.createElement("div");
    const toggleRead = document.createElement("button");
    const removeBtn = document.createElement("button");

    book.classList.add("book");
    bookTitle.classList.add("book-title");
    bookAuthor.classList.add("book-author");
    toggleRead.classList.add("toggle-read");
    removeBtn.classList.add("remove-book");

    removeBtn.setAttribute("onclick", `removeBook(${[i]})`);
    toggleRead.setAttribute("onclick", `toggleRead(${[i]})`);

    bookTitle.textContent = myLibrary[i].title;
    bookAuthor.textContent = myLibrary[i].author;
    bookPages.textContent = myLibrary[i].pages;
    toggleRead.textContent = myLibrary[i].read;
    removeBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

    if (toggleRead.textContent === "Read") {
      toggleRead.classList.remove("not-read");
      toggleRead.classList.add("read");
    } else {
      toggleRead.classList.remove("read");
      toggleRead.classList.add("not-read");
    }

    bookContainer.appendChild(book);
    book.appendChild(bookTitle);
    book.appendChild(bookAuthor);
    book.appendChild(bookPages);
    book.appendChild(toggleRead);
    book.appendChild(removeBtn);
  }
}

function removeBook(index) {
  myLibrary.splice(index, 1);
  displayBook();
}

function toggleRead(index) {
  myLibrary[index].read === "Not Read"
    ? (myLibrary[index].read = "Read")
    : (myLibrary[index].read = "Not Read");

  displayBook();
}

function addBookToLibrary(event) {
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const pages = document.querySelector("#pages").value;
  const preRead = document.querySelector("#status").value;
  let read = "";
  preRead === "read" ? (read = "Read") : (read = "Not Read");

  const newBook = new Book(title, author, pages, read);
  myLibrary.push(newBook);
  hideForm();
  displayBook();
  document.querySelector("form").reset();
  event.preventDefault();
}

displayBook();

const userPic = document.querySelector("#user-pic");
const userName = document.querySelector("#user-name");
const signInBtn = document.querySelector("#sign-in");
const signOutBtn = document.querySelector("#sign-out");
const userSpinner = document.querySelector(".fa-spinner");

signInBtn.addEventListener("click", signIn);
signOutBtn.addEventListener("click", signOutUser);

// FIREBASE

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCIrXgt3lYFUxAbteiGgV_e-CNmMrd74cQ",
  authDomain: "my-library-b1c95.firebaseapp.com",
  projectId: "my-library-b1c95",
  storageBucket: "my-library-b1c95.appspot.com",
  messagingSenderId: "911289976560",
  appId: "1:911289976560:web:7418369f5d7d738d072435",
};

async function signIn() {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
}

function signOutUser() {
  signOut(getAuth());
}

function initFirebaseAuth() {
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      userPic.src = user.photoURL;
      userName.textContent = user.displayName;

      userPic.removeAttribute("hidden");
      userName.removeAttribute("hidden");
      signOutBtn.removeAttribute("hidden");
      signInBtn.setAttribute("hidden", "true");
    } else {
      userPic.setAttribute("hidden", "true");
      userName.setAttribute("hidden", "true");
      signOutBtn.setAttribute("hidden", "true");
      signInBtn.removeAttribute("hidden");
    }

    userSpinner.style.display = "none";
  });
}

initializeApp(firebaseConfig);
initFirebaseAuth();

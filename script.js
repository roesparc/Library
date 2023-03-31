class Book {
  constructor(title, author, pages, readStatus, id) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.readStatus = readStatus;
    this.id = id;
  }
}

let myLibrary = [];

function displayForm() {
  document.querySelector("form").style.display = "block";
  document.querySelector("#overlay").style.display = "block";
}

function hideForm() {
  document.querySelector("#overlay").style.display = "none";
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
    const readStatus = document.createElement("button");
    const removeBtn = document.createElement("button");

    book.classList.add("book");
    bookTitle.classList.add("book-title");
    bookAuthor.classList.add("book-author");
    readStatus.classList.add("toggle-read");
    removeBtn.classList.add("remove-book");

    removeBtn.addEventListener("click", () => removeBook(i));
    readStatus.addEventListener("click", () => toggleRead(i));

    bookTitle.textContent = myLibrary[i].title;
    bookAuthor.textContent = myLibrary[i].author;
    bookPages.textContent = myLibrary[i].pages;
    readStatus.textContent = myLibrary[i].readStatus;
    removeBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

    if (readStatus.textContent === "Read") {
      readStatus.classList.remove("not-read");
      readStatus.classList.add("read");
    } else {
      readStatus.classList.remove("read");
      readStatus.classList.add("not-read");
    }

    bookContainer.appendChild(book);
    book.appendChild(bookTitle);
    book.appendChild(bookAuthor);
    book.appendChild(bookPages);
    book.appendChild(readStatus);
    book.appendChild(removeBtn);
  }
}

function removeBook(index) {
  if (myLibrary[index].id) deleteBook(myLibrary[index].id);

  myLibrary.splice(index, 1);

  displayBook();
}

function toggleRead(index) {
  let newReadStatus = "";

  myLibrary[index].readStatus === "Not Read"
    ? (newReadStatus = "Read")
    : (newReadStatus = "Not Read");

  myLibrary[index].readStatus = newReadStatus;

  if (myLibrary[index].id)
    editReadStatus(myLibrary[index].id, { readStatus: newReadStatus });

  displayBook();
}

function addBookToLibrary(book, id) {
  myLibrary.push(
    new Book(book.title, book.author, book.pages, book.readStatus, id)
  );
  hideForm();
  displayBook();
  document.querySelector("form").reset();
}

// displayBook();

const userPic = document.querySelector("#user-pic");
const userName = document.querySelector("#user-name");
const signInBtn = document.querySelector("#sign-in");
const signOutBtn = document.querySelector("#sign-out");
const userSpinner = document.querySelector("#user-spinner");
const bookSpinner = document.querySelector("#books-spinner");
const newBookBtn = document.querySelector("#new-book");
const formOverlay = document.querySelector("#overlay");
const bookForm = document.querySelector("form");

signInBtn.addEventListener("click", signIn);
signOutBtn.addEventListener("click", signOutUser);
newBookBtn.addEventListener("click", displayForm);
formOverlay.addEventListener("click", hideForm);
bookForm.addEventListener("submit", saveBook);

// FIREBASE

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";

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

async function saveBook(e) {
  e.preventDefault();

  try {
    await addDoc(collection(getFirestore(), "books"), {
      timestamp: serverTimestamp(),
      title: document.querySelector("#title").value,
      author: document.querySelector("#author").value,
      pages: document.querySelector("#pages").value,
      readStatus: document.querySelector("#status").value,
    });
  } catch (error) {
    console.error("Error writing new message to Firebase Database", error);
  }
}

function loadBooks() {
  const booksQuery = query(
    collection(getFirestore(), "books"),
    orderBy("timestamp", "asc")
  );

  onSnapshot(booksQuery, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        addBookToLibrary(change.doc.data(), change.doc.id);
      }
    });

    bookSpinner.style.display = "none";
  });
}

async function editReadStatus(bookId, newReadStatus) {
  try {
    const bookRef = doc(getFirestore(), "books", bookId);
    await updateDoc(bookRef, newReadStatus);
  } catch (error) {
    console.error("Error updating book: ", error);
  }
}

async function deleteBook(bookId) {
  try {
    await deleteDoc(doc(getFirestore(), "books", bookId));
  } catch (error) {
    console.error("Error deleting book: ", error);
  }
}

initializeApp(firebaseConfig);
initFirebaseAuth();
loadBooks();

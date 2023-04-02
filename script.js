const newBookBtn = document.querySelector("#new-book");
const formOverlay = document.querySelector("#overlay");
const bookForm = document.querySelector("form");

const bookLibrary = [];

class Book {
  constructor(title, author, pages, readStatus, id) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.readStatus = readStatus;
    this.id = id;
  }
}

function displayForm() {
  bookForm.style.display = "block";
  formOverlay.style.display = "block";
}

function hideForm() {
  formOverlay.style.display = "none";
  bookForm.style.display = "none";
}

function createBookElement(book, index) {
  const newBook = document.createElement("div");
  newBook.classList.add("book");

  const bookTitle = document.createElement("h2");
  bookTitle.classList.add("book-title");
  bookTitle.textContent = book.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.classList.add("book-author");
  bookAuthor.textContent = `By ${book.author}`;

  const bookPages = document.createElement("p");
  bookPages.classList.add("book-pages");
  bookPages.textContent = `Pages: ${book.pages}`;

  const readStatusBtn = document.createElement("button");
  readStatusBtn.textContent = book.readStatus;
  readStatusBtn.classList.add("read-status");
  book.readStatus === "Read" && readStatusBtn.classList.add("read");
  readStatusBtn.addEventListener("click", () => toggleRead(book));

  const removeBookBtn = document.createElement("button");
  removeBookBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  removeBookBtn.classList.add("remove-book");
  removeBookBtn.addEventListener("click", () => removeBook(book, index));

  newBook.appendChild(bookTitle);
  newBook.appendChild(bookAuthor);
  newBook.appendChild(bookPages);
  newBook.appendChild(readStatusBtn);
  newBook.appendChild(removeBookBtn);

  return newBook;
}

function displayBooks() {
  const bookContainer = document.querySelector("#book-container");
  bookContainer.textContent = "";

  bookLibrary.forEach((book, index) => {
    bookContainer.appendChild(createBookElement(book, index));
  });
}

function removeBook(book, index) {
  if (book.id) deleteBook(book.id);

  bookLibrary.splice(index, 1);

  displayBooks();
}

function toggleRead(book) {
  const newReadStatus = book.readStatus === "Read" ? "Not Read" : "Read";
  book.readStatus = newReadStatus;

  if (book.id) editReadStatus(book.id, { readStatus: newReadStatus });

  displayBooks();
}

function addBookToLibrary(book, id) {
  bookLibrary.push(
    new Book(book.title, book.author, book.pages, book.readStatus, id)
  );

  hideForm();
  displayBooks();
  bookForm.reset();
}

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
  where,
  serverTimestamp,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";

const userPic = document.querySelector("#user-pic");
const userName = document.querySelector("#user-name");
const signInBtn = document.querySelector("#sign-in");
const signOutBtn = document.querySelector("#sign-out");
const userSpinner = document.querySelector("#user-spinner");
const bookSpinner = document.querySelector("#books-spinner");

let unsubscribeSnapshot;

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

  bookSpinner.style.display = "block";
}

function signOutUser() {
  signOut(getAuth());
}

function initFirebaseAuth() {
  onAuthStateChanged(getAuth(), handleUserAuthChange);
}

function handleUserAuthChange(user) {
  clearLibraryDisplay();
  clearUserDisplay();

  if (user) {
    displayUser(user);
    signOutBtn.removeAttribute("hidden");
    loadBooks();
  } else {
    signInBtn.removeAttribute("hidden");
    unsubscribeBooksListener();
    bookSpinner.style.display = "none";
  }

  userSpinner.style.display = "none";
}

function clearLibraryDisplay() {
  bookLibrary.splice(0, bookLibrary.length);
  displayBooks();
}

function clearUserDisplay() {
  userPic.setAttribute("hidden", "true");
  userName.setAttribute("hidden", "true");
  signOutBtn.setAttribute("hidden", "true");
  signInBtn.setAttribute("hidden", "true");
}

function displayUser(user) {
  userPic.src = user.photoURL;
  userPic.removeAttribute("hidden");

  userName.textContent = user.displayName;
  userName.removeAttribute("hidden");
}

function unsubscribeBooksListener() {
  if (unsubscribeSnapshot) {
    unsubscribeSnapshot();
    unsubscribeSnapshot = null;
  }
}

function onBookFormSubmit(e) {
  e.preventDefault();

  const bookValues = {
    title: document.querySelector("#title").value,
    author: document.querySelector("#author").value,
    pages: document.querySelector("#pages").value,
    readStatus: document.querySelector("#status").value,
  };

  if (getAuth().currentUser) {
    saveBook(bookValues);
  } else {
    addBookToLibrary(bookValues);
  }
}

async function saveBook(bookValues) {
  try {
    await addDoc(collection(getFirestore(), "books"), {
      timestamp: serverTimestamp(),
      userId: getAuth().currentUser.uid,
      title: bookValues.title,
      author: bookValues.author,
      pages: bookValues.pages,
      readStatus: bookValues.readStatus,
    });
  } catch (error) {
    console.error("Error writing new message to Firebase Database", error);
  }
}

function createBooksQuery() {
  return query(
    collection(getFirestore(), "books"),
    where("userId", "==", getAuth().currentUser.uid),
    orderBy("timestamp", "asc")
  );
}

function subscribeToBooksQuery(booksQuery) {
  unsubscribeSnapshot = onSnapshot(booksQuery, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        addBookToLibrary(change.doc.data(), change.doc.id);
      }
    });

    bookSpinner.style.display = "none";
  });
}

function loadBooks() {
  const booksQuery = createBooksQuery();
  subscribeToBooksQuery(booksQuery);
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

// DOCUMENT LISTENERS

signInBtn.addEventListener("click", signIn);
signOutBtn.addEventListener("click", signOutUser);
newBookBtn.addEventListener("click", displayForm);
formOverlay.addEventListener("click", hideForm);
bookForm.addEventListener("submit", onBookFormSubmit);

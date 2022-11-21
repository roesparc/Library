class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }
    info() {
        return `${this.title} by
        ${this.author},
        ${this.pages} pages,
        ${this.read}.`;
    }
}

const theHobbit = new Book(
    'The Hoobit',
    'J.R.R. Tolkien',
    295,
    'Read'
);

const harryPotterPhilosopher = new Book(
    'Harry Potter and the Philosopher\'s Stone',
    'J. K. Rowling',
    223,
    'Not Read'
);

const taleTwoCities = new Book(
    'A Tale of Two Cities',
    'Charles Dickens',
    448,
    'Not Read'
);

let myLibrary = [
    theHobbit,
    harryPotterPhilosopher,
    taleTwoCities
];

function displayBook() {
    const bookContainer =
    document.querySelector('.book-container');

    while (bookContainer.childNodes[2]) {
        bookContainer.removeChild(bookContainer.childNodes[2]);
    }

    for (let i = 0; i < myLibrary.length; i++) {
        const book = document.createElement('div');
        const bookTitle = document.createElement('div');
        const bookAuthor = document.createElement('div');
        const bookPages = document.createElement('div');
        const bookInfo = document.createElement('div');
        const removeBtn = document.createElement('button');
        const toggleRead = document.createElement('button');

        book.fList.add('book');
        bookTitle.classList.add('book-title');
        bookAuthor.classList.add('book-author');
        bookInfo.classList.add('book-info');
        removeBtn.classList.add('remove-book');
        toggleRead.classList.add('toggle-read');

        removeBtn.setAttribute('onclick', `removeBook(${[i]})`);
        toggleRead.setAttribute('onclick', `toggleRead(${[i]})`);
    
        bookTitle.textContent = myLibrary[i].title;
        bookAuthor.textContent = myLibrary[i].author;
        bookPages.textContent = myLibrary[i].pages;
        bookInfo.textContent = myLibrary[i].info();
        removeBtn.textContent = 'Remove';
        toggleRead.textContent = myLibrary[i].read;

        if (toggleRead.textContent === 'Read') {
            toggleRead.classList.remove('not-read');
            toggleRead.classList.add('read');
        } else {
            toggleRead.classList.remove('read');
            toggleRead.classList.add('not-read');
        }    

        bookContainer.appendChild(book);
        book.appendChild(bookTitle);
        book.appendChild(bookAuthor);
        book.appendChild(bookPages);
        book.appendChild(bookInfo);
        book.appendChild(toggleRead);
        book.appendChild(removeBtn);
    }
}
displayBook()

function addBookToLibrary() {
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const pages = document.querySelector('#pages').value;
    const preRead = document.querySelector('#status').value;
    let read = '';
    
    if (!title || !author || !pages) {return;}
    (preRead === 'read') ? read = 'Read' : read = 'Not Read';

    const newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
    toggleForm();
    overlayOff();
    displayBook();
    document.querySelector('form').reset();
}

function toggleForm() {
    document.querySelector('form').style.display = 'block';
    document.querySelector('.overlay').style.display = 'block';
}

function overlayOff() {
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('form').style.display = 'none';
}

function removeBook(index) {
    myLibrary.splice(index, 1);
    displayBook();
}

function toggleRead(index) {
    (myLibrary[index].read === 'Not Read') ?
    myLibrary[index].read = 'Read':
    myLibrary[index].read = 'Not Read';

    displayBook();
}

let myLibrary = [];
let nextId = 0;

const background = document.querySelector("main");
const form = document.querySelector(".book-form");
const bookshelf = document.querySelector("section");

const addBookBtn = document.querySelector("#add-book");
const removeBooksBtn = document.querySelector("#remove-books");
const closeFormBtn = document.querySelector("#close-form");
const submitBtn = document.querySelector("#submit");
const reminderText = document.querySelector("#reminder-text");

function Book(title, author, numPages) {
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.completed = false;
    this.id = nextId++;
}

function updateLibrary() {
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

function addBookToLibrary(book) {
    myLibrary.push(book);
    updateLibrary();
}

function displayForm() {
    form.style.display = 'block';
    background.classList.add("blur");
}

function closeForm() {
    form.style.display = 'none';
    background.classList.remove("blur");
    reminderText.textContent = '';
}

function validateForm(title, author, numPages) {
    if (!(title && author && numPages)) {
        reminderText.textContent = 'Please fill up accordingly!';
    } else {
        reminderText.textContent = '';
        const newBook = new Book(title, author, numPages);
        addBookToLibrary(newBook);
        closeForm();
        displayBook(newBook);
        background.classList.remove("blur");
    }
}

function displayBook(book) {
    const bookContainer = document.createElement("div");
    const bookDisplay = document.createElement("div"); 
    bookContainer.setAttribute("data-id", book.id); 

    // styling
    bookContainer.classList.add("book-container");
    bookDisplay.innerText = `Title: ${book.title}\n Author: ${book.author}\n Number of Pages: ${book.numPages}\n`;
    bookDisplay.classList.add("book-display");

    // hidden buttons
    const btnContainer = document.createElement("nav");
    btnContainer.classList.add("book-button-overlay");

    // create deleteBtn
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.type = "button";
    deleteBtn.id = "delete";

    // create deleteBtn functionality
    deleteBtn.addEventListener("click", function() {
        bookshelf.removeChild(bookContainer);
        const index = myLibrary.findIndex(b => b.id === book.id);
        myLibrary.splice(index, 1);
        updateLibrary();
    });
    
    // create readBtn
    const readBtn = document.createElement("button");
    const readStatusText = document.createElement("p"); 
    readBtn.textContent = "Read";
    readBtn.type = "button";
    readBtn.id = "read";
    readBtn.addEventListener("click", function() {    
        if (!book.completed) {
            bookDisplay.classList.add("done-reading");
            readStatusText.textContent = "Read";
            readBtn.textContent = "Unread";
            bookContainer.appendChild(readStatusText);
            book.completed = true;
        } else {
            bookDisplay.classList.remove("done-reading");
            readBtn.textContent = "Read";
            readStatusText.textContent = "";
            book.completed = false;
        }
        updateLibrary();
    });

    // adding
    btnContainer.appendChild(deleteBtn);
    btnContainer.appendChild(readBtn);
    bookContainer.appendChild(btnContainer);
    bookContainer.appendChild(bookDisplay);
    bookshelf.appendChild(bookContainer);

    console.log(myLibrary); //
}

addBookBtn.addEventListener("click", displayForm);
removeBooksBtn.addEventListener("click", function() {
    const delButtons = document.querySelectorAll("#delete");
    delButtons.forEach(btn => btn.click());
    console.log(myLibrary);
});
closeFormBtn.addEventListener("click", closeForm);
submitBtn.addEventListener("click", function() {
    const title = document.querySelector("input#title").value;
    const author = document.querySelector("input#author").value;
    const numPages = document.querySelector("input#numPages").value;

    validateForm(title, author, numPages);
});

// local storage
form.addEventListener('submit', function(e) {
    e.preventDefault();
});


document.body.onload = function() {
    myLibrary = JSON.parse(localStorage.getItem("myLibrary"));
    if (myLibrary === null) {
        myLibrary = [];
    } else {
        myLibrary.forEach(book => displayBook(book));
    }
}
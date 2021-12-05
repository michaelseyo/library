let myLibrary = [];
let nextId = 0;

const background = document.querySelector(".library");
const form = document.querySelector(".book-form");
const bookshelf = document.querySelector("section");

const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const numPagesInput = document.querySelector("#numPages");

const addBookBtn = document.querySelector("#add-book-icon");
const removeBooksBtn = document.querySelector("#remove-books");
const closeFormBtn = document.querySelector("#close-form");
const submitBtn = document.querySelector("#submit");
const reminderText = document.querySelector("#reminder-text");

class Book {
    constructor(title, author, numPages, completed) {
        this.title = title;
        this.author = author;
        this.numPages = numPages;
        this.completed = completed
        this.id = nextId++;
    }

    updateLibrary(book) {
        localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
    }

    addBookToLibrary() {
        myLibrary.push(this);
        this.updateLibrary();
    }

    displayBook() {
        let self = this;
        const bookContainer = document.createElement("div");
        const bookDisplay = document.createElement("div"); 
        bookContainer.setAttribute("data-id", self.id); 

        // styling
        bookContainer.classList.add("book-container");
        bookDisplay.innerText = `Title: ${self.title}\n Author: ${self.author}\n Number of Pages: ${self.numPages}\n`;
        bookDisplay.classList.add("book-display");

        // hidden buttons
        const btnContainer = document.createElement("nav");
        btnContainer.classList.add("book-button-overlay");

        // create deleteBtn
        const deleteBtn = document.createElement("input");
        deleteBtn.type = "image";
        deleteBtn.src = "icons/bin.png";
        deleteBtn.id = "delete-icon";
        deleteBtn.addEventListener("click", self.deleteBook.bind(self, bookContainer));
        
        // create readBtn
        const readBtn = document.createElement("input");
        const readStatusText = document.createElement("p"); 
        readBtn.type = "image";
        readBtn.src = "icons/done-read.png";
        readBtn.id = "read-icon";
        readBtn.addEventListener("click", self.readBook.bind(self, bookDisplay, readStatusText, readBtn, bookContainer));

        // styling for existing books
        if (self.completed) {
            bookDisplay.classList.add("done-reading");
            readStatusText.textContent = "Read";
            readBtn.textContent = "Unread";
            bookContainer.appendChild(readStatusText);
        }

        // adding
        btnContainer.appendChild(deleteBtn);
        btnContainer.appendChild(readBtn);
        bookContainer.appendChild(btnContainer);
        bookContainer.appendChild(bookDisplay);
        bookshelf.appendChild(bookContainer);
    }

    deleteBook(bookContainer) {
        bookshelf.removeChild(bookContainer);
        const index = myLibrary.findIndex(b => b.id === this.id);
        myLibrary.splice(index, 1);
        this.updateLibrary();
        console.log(myLibrary);
    }

    readBook(bookDisplay, readStatusText, readBtn, bookContainer) {
        if (!this.completed) { // for existing books
            bookDisplay.classList.add("done-reading");
            readStatusText.textContent = "Read";
            readBtn.src = "icons/not-done-read.png";
            bookContainer.appendChild(readStatusText);
            this.completed = true;
        } else {
            bookDisplay.classList.remove("done-reading");
            readBtn.src = "icons/done-read.png";
            readStatusText.textContent = "";
            this.completed = false;
        }
        this.updateLibrary();
    }
}

function fromJson(json) {
    // retrieved information from the stored localStorage for each book (which was stored as an Object, not Book)
    let createdBook = new Book(json.title, json.author, json.numPages, json.completed);
    createdBook.displayBook();
    return createdBook;
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

function validateForm() {
    if (titleInput.checkValidity() && authorInput.checkValidity() 
        && numPagesInput.checkValidity()) {
        const title = titleInput.value;
        const author = authorInput.value;
        const numPages = numPagesInput.value;
        reminderText.textContent = '';
        const newBook = new Book(title, author, numPages, false);
        newBook.addBookToLibrary();
        closeForm();
        newBook.displayBook();
        background.classList.remove("blur");
    } else {
        reminderText.textContent = "Please fill in properly!"
    }
}

addBookBtn.addEventListener("click", displayForm);
removeBooksBtn.addEventListener("click", function() {
    const delButtons = document.querySelectorAll("#delete-icon");
    delButtons.forEach(btn => btn.click());
});
closeFormBtn.addEventListener("click", closeForm);
submitBtn.addEventListener("click", function() {
    validateForm();
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
        myLibrary = myLibrary.map(json => fromJson(json));
    }
}
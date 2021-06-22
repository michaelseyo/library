let myLibrary = [];
let nextId = 0;
const background = document.querySelector("main");

function Book(title, author, numPages) {
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.completed = false;
    this.id = nextId++;
}

function addBookToLibrary(book) {
    myLibrary.push(book);
    myLibrary.forEach(book => console.log(book));
}

function displayForm() {
    const form = document.querySelector(".book-form");
    form.style.display = 'block';
    background.classList.add("blur");
}

function closeForm() {
    const form = document.querySelector(".book-form");
    form.style.display = 'none';
    background.classList.remove("blur");
}

function displayBook(book) {
    const bookshelf = document.querySelector("section");
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
        myLibrary.forEach(book => console.log(book));
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
    });

    // adding
    btnContainer.appendChild(deleteBtn);
    btnContainer.appendChild(readBtn);
    bookContainer.appendChild(btnContainer);
    bookContainer.appendChild(bookDisplay);
    bookshelf.appendChild(bookContainer);
}

const addBookBtn = document.querySelector("#add-book");
addBookBtn.addEventListener("click", displayForm);

const closeFormBtn = document.querySelector("#close-form");
closeFormBtn.addEventListener("click", closeForm);

const submitBtn = document.querySelector("#submit");
submitBtn.addEventListener("click", function() {
    const title = document.querySelector("input#title").value;
    const author = document.querySelector("input#author").value;
    const numPages = document.querySelector("input#numPages").value;

    const newBook = new Book(title, author, numPages);
    addBookToLibrary(newBook);
    closeForm();
    displayBook(newBook);
    background.classList.remove("blur");
});
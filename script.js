document
  .getElementById("form-tambah")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let no = 0;
    let id = no + 1;
    const title = document.getElementById("judul").value;
    const author = document.getElementById("penulis").value;
    const yearInput = document.getElementById("year");
    const year = parseInt(yearInput.value, 10);

    let isComplete = false;

    if (document.getElementById("selesai").checked) {
      isComplete = true;
    }

    addBook(id, title, author, year, isComplete);
    document.getElementById("form-tambah").reset();
  });

function getBooksFromStorage() {
  let books;
  if (localStorage.getItem("books") === null) {
    books = [];
  } else {
    books = JSON.parse(localStorage.getItem("books"));
  }
  return books;
}

function saveBooksToStorage(books) {
  localStorage.setItem("books", JSON.stringify(books));
}

function addBook(id, title, author, year, isComplete) {
  const newBook = {
    id: id,
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };

  const books = getBooksFromStorage();
  books.push(newBook);
  saveBooksToStorage(books);
  displayBooks();
}

function moveBook(index, targetisCompleteStatus) {
  const books = getBooksFromStorage();
  const bookToMove = books.splice(index, 1)[0];
  bookToMove.isComplete = targetisCompleteStatus;
  books.push(bookToMove);
  saveBooksToStorage(books);
  displayBooks();
}

document
  .getElementById("belum-dibaca")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("btn-primary")) {
      const card = event.target.closest(".card");
      const index = Array.from(card.parentNode.children).indexOf(card);
      moveBook(index, true);
    }
  });

document
  .getElementById("sudah-dibaca")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("btn-primary")) {
      const card = event.target.closest(".card");
      const index = Array.from(card.parentNode.children).indexOf(card);
      moveBook(index, false);
    }
  });

function removeBook(index) {
  const books = getBooksFromStorage();
  books.splice(index, 1);

  saveBooksToStorage(books);
  displayBooks();
}

function displayBooks() {
  const books = getBooksFromStorage();

  const belumDibacaSection = document.getElementById("belum-dibaca");
  const sudahDibacaSection = document.getElementById("sudah-dibaca");

  belumDibacaSection.innerHTML = "";
  sudahDibacaSection.innerHTML = "";

  const belumDibacaHeader = document.createElement("h2");
  belumDibacaHeader.classList.add("text-light", "fs-3", "text-center");
  belumDibacaHeader.textContent = "Belum Dibaca";
  belumDibacaSection.appendChild(belumDibacaHeader);

  const sudahDibacaHeader = document.createElement("h2");
  sudahDibacaHeader.classList.add("text-light", "fs-3", "text-center");
  sudahDibacaHeader.textContent = "Sudah Dibaca";
  sudahDibacaSection.appendChild(sudahDibacaHeader);

  books.forEach((book, index) => {
    const bookCard = document.createElement("section");
    bookCard.classList.add("card", "m-2");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = book.title;

    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = book.year;

    const cardAuthor = document.createElement("h6");
    cardAuthor.classList.add("card-subtitle", "text-body-secondary");
    cardAuthor.textContent = "Penulis: " + book.author;

    const isCompleteButton = document.createElement("button");
    isCompleteButton.classList.add("btn", "btn-primary", "mt-1", "me-2");
    isCompleteButton.textContent = book.isComplete
      ? "Baca Ulang"
      : "Baca Sekarang";

    isCompleteButton.addEventListener("click", function () {
      if (book.isComplete) {
        moveBook(index, false);
      } else {
        moveBook(index, true);
      }
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "btn-danger", "mt-1");
    deleteButton.textContent = "Hapus Buku";

    deleteButton.addEventListener("click", function () {
      removeBook(index);
    });

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardAuthor);
    cardBody.appendChild(isCompleteButton);
    cardBody.appendChild(deleteButton);
    bookCard.appendChild(cardBody);

    if (book.isComplete) {
      sudahDibacaSection.appendChild(bookCard);
    } else {
      belumDibacaSection.appendChild(bookCard);
    }
  });
}
displayBooks();

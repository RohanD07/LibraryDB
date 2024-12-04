const express = require('express');
const Book = require('../models/book');
const router = express.Router();

router.get('/books/available', async (req, res) => {
  try {
    const books = await Book.find({ status: 'available' });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ISBN:req.params.id});
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/books/add", async (req, res) => {
  const { title, author, ISBN, status } = req.body;

  if (!title || !author || !ISBN) {
    return res.status(400).json({ error: "All fields (title, author, ISBN) are required" });
  }

  try {
    const existingBook = await Book.findOne({ ISBN });
    if (existingBook) {
      return res.status(409).json({ error: "A book with this ISBN already exists" });
    }

    const book = new Book({
      title,
      author,
      ISBN,
      status: status || "available",
    });

    await book.save();
    res.status(201).json({ message: "Book added successfully", book });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ error: "Server error" });
  }
});


router.post('/books/issue/:id', async (req, res) => {
  try {
    const { borrower, dueDate } = req.body;
    const book = await Book.findOne({ISBN:req.params.id});
    if (!book || book.status !== 'available')
      return res.status(400).json({ message: 'Book not available' });

    book.status = 'issued';
    book.borrower = borrower;
    await book.save();

    res.json({ message: 'Book issued successfully', book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/books/return/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ISBN:req.params.id});
    if (!book || book.status !== 'issued')
      return res.status(400).json({ message: 'Book is not issued' });

    book.status = 'available';
    book.borrower = null;
    await book.save();

    res.json({ message: 'Book returned successfully', book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/books/delete/:isbn', async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ ISBN: req.params.isbn });
    if (!book) {
      return res.status(404).json({ message: 'Book not found with the given ISBN' });
    }
    res.json({ message: 'Book deleted successfully', deletedBook: book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;

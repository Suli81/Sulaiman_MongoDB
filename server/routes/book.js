const express = require('express');
const router = express.Router();
const Book = require('../models/book');

/* Read Operation */
router.get('/', async (req, res, next) => {
  try {
    const booklist = await Book.find({}).exec();
    console.log('Retrieved book list:', booklist);
    res.render('book/list', {
      title: 'Workout Plan',
      Booklist: booklist
    });
  } catch (err) {
    console.error('Error retrieving book list:', err);
    res.status(500).send('Error retrieving book list');
  }
});


/* Add Operation */
router.get('/add', async (req, res, next) => {
  res.render('book/add', { title: 'Add Book' });
});

router.post('/add', async (req, res, next) => {
  // Add a new book to the database
  try {
    const newBook = new Book({
      name: req.body.name,
      author: req.body.author,
      published: req.body.published,
      description: req.body.description,
      price: req.body.price
    });

    await newBook.save();
    res.redirect('/book-list');
  } catch (err) {
    console.error(err);
    res.render('error', { error: err });
  }
});

/* Edit Operation */
router.get('/edit/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const bookToEdit = await Book.findById(id);
    if (!bookToEdit) {
      return res.status(404).send('Book not found');
    }
    res.render('book/edit', { title: 'Edit Workout Plan', book: bookToEdit });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching book for editing');
  }
});

router.post('/edit/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, author, published, description, price } = req.body;

    // Find the book by ID and update its details
    await Book.findByIdAndUpdate(id, {
      name,
      author,
      published,
      description,
      price
    });

    res.redirect('/book-list'); // Redirect to the book list page after successful update
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating book');
  }
});

// Delete Operation
router.delete('/delete/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedBook = await Book.findOneAndDelete({ _id: id });
    if (!deletedBook) {
      return res.status(404).send('Book not found');
    }
    res.redirect('/book-list'); // Redirect after successful deletion
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting book');
  }
});

module.exports = router;

/**
 * NaiRarm Bookshop - Admin Management Page
 * Handles Insert, Update, Delete operations
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Check if logged in
  if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
    return;
  }

  const bookList = document.getElementById('book-list');
  const bookForm = document.getElementById('book-form');
  const formTitle = document.getElementById('form-title');
  let editingId = null;

  // Load all books
  await loadBooks();

  // Handle form submission (Insert or Update)
  bookForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const bookData = {
      isbn: document.getElementById('isbn').value.trim(),
      title: document.getElementById('title').value.trim(),
      author: document.getElementById('author').value.trim(),
      price: parseFloat(document.getElementById('price').value),
      genre: document.getElementById('genre').value.trim(),
      publisher: document.getElementById('publisher').value.trim(),
      pub_date: document.getElementById('pub_date').value || null,
      synopsis: document.getElementById('synopsis').value.trim(),
      cover_url: document.getElementById('cover_url').value.trim()
    };

    try {
      let result;
      if (editingId) {
        // Update existing book
        result = await api.updateBook(editingId, bookData);
      } else {
        // Insert new book
        result = await api.insertBook(bookData);
      }

      if (result.success) {
        alert(result.message);
        resetForm();
        await loadBooks();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      alert('Connection error');
      console.error(err);
    }
  });

  // Cancel edit button
  document.getElementById('cancel-btn')?.addEventListener('click', resetForm);

  // Logout button
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = 'login.html';
  });

  /**
   * Load and display all books in admin list
   */
  async function loadBooks() {
    try {
      const result = await api.getAllBooks();
      
      if (!result.success) {
        bookList.innerHTML = '<p>Error loading books</p>';
        return;
      }

      bookList.innerHTML = result.data.map(book => `
        <tr>
          <td>${book.bookdID}</td>
          <td>${book.title}</td>
          <td>${book.author || '—'}</td>
          <td>${book.price}</td>
          <td>${book.genre || '—'}</td>
          <td>
            <button class="btn-edit" data-id="${book.id}">Edit</button>
            <button class="btn-delete" data-id="${book.id}">Delete</button>
          </td>
        </tr>
      `).join('');

      // Attach edit handlers
      document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => loadBookForEdit(btn.dataset.id));
      });

      // Attach delete handlers
      document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteBook(btn.dataset.id));
      });

    } catch (err) {
      bookList.innerHTML = '<p>Error loading books</p>';
      console.error(err);
    }
  }

  /**
   * Load a book into the form for editing
   */
  async function loadBookForEdit(id) {
    try {
      const result = await api.getBook(id);
      if (!result.success) return;

      const book = result.data;
      editingId = book.id;
      formTitle.textContent = 'Edit Book';

      document.getElementById('isbn').value = book.isbn || '';
      document.getElementById('title').value = book.title || '';
      document.getElementById('author').value = book.author || '';
      document.getElementById('price').value = book.price || '';
      document.getElementById('genre').value = book.genre || '';
      document.getElementById('publisher').value = book.publisher || '';
      document.getElementById('pub_date').value = book.pub_date?.split('T')[0] || '';
      document.getElementById('synopsis').value = book.synopsis || '';
      document.getElementById('cover_url').value = book.cover_url || '';

      document.getElementById('cancel-btn').style.display = 'inline-block';
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Delete a book
   */
  async function deleteBook(id) {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      const result = await api.deleteBook(id);
      if (result.success) {
        alert('Book deleted successfully');
        await loadBooks();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      alert('Connection error');
      console.error(err);
    }
  }

  /**
   * Reset form to "Add New" state
   */
  function resetForm() {
    editingId = null;
    formTitle.textContent = 'Add New Book';
    bookForm.reset();
    document.getElementById('cancel-btn').style.display = 'none';
  }
});

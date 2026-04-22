/**
 * NaiRarm Bookshop - Book Detail Page
 * Displays full information for a single book
 */

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get('id');

  if (!bookId) {
    showError('No book ID provided');
    return;
  }

  try {
    const result = await api.getBook(bookId);

    if (!result.success || !result.data) {
      showError('Book not found');
      return;
    }

    displayBook(result.data);
  } catch (err) {
    showError('Error loading book details');
    console.error('Detail error:', err);
  }

  function displayBook(book) {
    document.getElementById('book-title').textContent = book.title;
    document.getElementById('book-author').textContent = book.author || 'Unknown Author';
    document.getElementById('book-price').textContent = `${book.price} baht`;
    document.getElementById('book-genre').textContent = book.genre || '—';
    document.getElementById('book-publisher').textContent = book.publisher || '—';
    document.getElementById('book-date').textContent = formatDate(book.pub_date);
    document.getElementById('book-isbn').textContent = book.isbn || '—';
    document.getElementById('book-synopsis').textContent = book.synopsis || 'No synopsis available.';
    
    const coverImg = document.getElementById('book-cover');
    coverImg.src = book.cover_url || 'images/placeholder.jpg';
    coverImg.alt = book.title;
    coverImg.onerror = () => { coverImg.src = 'images/placeholder.jpg'; };

    // Update page title
    document.title = `${book.title} — NaiRarm`;
  }

  function showError(message) {
    document.querySelector('main').innerHTML = `
      <div class="error-container">
        <p>${message}</p>
        <a href="search.html" class="btn">Return to Search</a>
      </div>
    `;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
});
/**
 * Fetch author info from Open Library (Public Web Service)
 */
async function loadAuthorInfo(authorName) {
  try {
    const searchUrl = `[openlibrary.org](https://openlibrary.org/search/authors.json?q=${encodeURIComponent(authorName)})`;
    const res = await fetch(searchUrl);
    const data = await res.json();

    if (data.docs && data.docs.length > 0) {
      const author = data.docs[0];
      const authorInfoEl = document.getElementById('author-info');
      
      if (authorInfoEl) {
        authorInfoEl.innerHTML = `
          <h4>About the Author</h4>
          <p><strong>${author.name}</strong></p>
          <p>Works: ${author.work_count || 'N/A'}</p>
          <p>Top work: ${author.top_work || 'N/A'}</p>
          <a href="[openlibrary.org](https://openlibrary.org/authors/${author.key})" target="_blank">
            View on Open Library ↗
          </a>
        `;
      }
    }
  } catch (err) {
    console.log('Could not load author info from Open Library');
  }
}

// Call this in displayBook():
loadAuthorInfo(book.author);


/**
 * NaiRarm Bookshop - Search Page
 * Implements 3-criteria search as required
 */

document.addEventListener('DOMContentLoaded', async () => {
  const searchForm = document.getElementById('search-form');
  const resultsContainer = document.getElementById('search-results');
  const genreSelect = document.getElementById('genre-filter');

  // Load all books initially (no criteria search)
  await loadBooks({});

  // Handle search form submission
  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const filters = {
      title: document.getElementById('title-search').value.trim(),
      author: document.getElementById('author-search').value.trim(),
      genre: genreSelect.value
    };

    // Remove empty filters
    Object.keys(filters).forEach(key => {
      if (!filters[key]) delete filters[key];
    });

    await loadBooks(filters);
  });

  // Clear/reset button
  document.getElementById('clear-btn')?.addEventListener('click', async () => {
    searchForm.reset();
    await loadBooks({});
  });

  /**
   * Load and display books
   */
  async function loadBooks(filters) {
    resultsContainer.innerHTML = '<p class="loading">Loading...</p>';

    try {
      const result = await api.searchBooks(filters);

      if (!result.success || result.data.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">No books found matching your search.</p>';
        return;
      }

resultsContainer.innerHTML = result.data.map(book => `
  <article class="book-card">
    <img 
      src="${book.cover_url || 'images/placeholder.jpg'}" 
      alt="${book.title}"
      onerror="this.src='images/placeholder.jpg'"
    >
    <div class="book-info">
      <h3>${book.title}</h3>
      <p class="author">${book.author || 'Unknown Author'}</p>
      <p class="genre">${book.genre || ''}</p>
      <p class="price">${book.price} baht</p>
      <a href="detail.html?id=${book.id}" class="btn-detail">View Details</a>
    </div>
  </article>
`).join('');

      // Update result count
      const countEl = document.getElementById('result-count');
      if (countEl) countEl.textContent = `${result.count} book(s) found`;
    console.log(filters);
    } catch (err) {
      resultsContainer.innerHTML = '<p class="error">Error loading books. Please try again.</p>';
      console.error('Search error:', err);
    }
  }
});

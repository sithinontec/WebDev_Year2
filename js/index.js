/**
 * NaiRarm Bookshop - Homepage
 * Displays featured books
 */

document.addEventListener('DOMContentLoaded', async () => {
  const featuredContainer = document.getElementById('featured-books');

  try {
    const result = await api.getAllBooks();

    if (!result.success) {
      featuredContainer.innerHTML = '<p>Error loading books</p>';
      return;
    }

    // Display first 6 books as "featured"
    const featured = result.data.slice(0, 6);

    featuredContainer.innerHTML = featured.map(book => `
      <article class="book-card">
        <img 
          src="${book.cover_url || 'images/placeholder.jpg'}" 
          alt="${book.title}"
          onerror="this.src='images/placeholder.jpg'"
        >
        <h3>${book.title}</h3>
        <p>${book.author || 'Unknown'}</p>
        <p class="price">${book.price} baht</p>
        <a href="detail.html?id=${book.id}">View</a>
      </article>
    `).join('');

  } catch (err) {
    featuredContainer.innerHTML = '<p>Error loading books</p>';
    console.error(err);
  }
});
async function loadBooks() {
  const res = await fetch("http://localhost:3000/api/books");
  const result = await res.json();

  const container = document.querySelector('.book-grid');

  container.innerHTML = result.data.slice(0,6).map(book => `
    <div class="book-card">
      <div class="book-cover">
        <img src="${book.cover_url}" />
      </div>
      <div class="book-info">
        <span class="book-title">${book.title}</span>
        <span class="book-author">${book.author}</span>
        <span class="book-price">${book.price} baht</span>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', loadBooks);

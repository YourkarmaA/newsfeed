// Retrieve saved news data from localStorage
function getSavedNewsFromLocalStorage() {
  const savedNews = localStorage.getItem('savedNews');
  return savedNews ? JSON.parse(savedNews) : [];
}

// Render saved news cards on the saved news page
function renderSavedNews() {
  const savedNewsContainer = document.getElementById('saved-news-container');

  if (!savedNewsContainer) {
    console.error('saved-news-container element not found.');
    return;
  }

  savedNewsContainer.innerHTML = '';

  const savedNews = getSavedNewsFromLocalStorage();

  savedNews.forEach(news => {
    const newsCard = document.createElement('div');
    newsCard.classList.add('news-card');

    const category = document.createElement('p');
    category.classList.add('category');
    category.textContent = news.category;
    newsCard.appendChild(category);

    const publisher = document.createElement('p');
    publisher.textContent = news.publisher;
    newsCard.appendChild(publisher);

    const content = document.createElement('p');
    content.textContent = news.content;
    newsCard.appendChild(content);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      const savedNews = getSavedNewsFromLocalStorage();
      const updatedSavedNews = savedNews.filter(saved => saved.title !== news.title);
      localStorage.setItem('savedNews', JSON.stringify(updatedSavedNews));
      renderSavedNews();
    });
    newsCard.appendChild(deleteButton);

    const readMoreLink = document.createElement('a');
    readMoreLink.classList.add('read-more');
    readMoreLink.textContent = 'Read More';
    readMoreLink.href = news.url;
    newsCard.appendChild(readMoreLink);

    savedNewsContainer.appendChild(newsCard);
  });
}

// Fetch news data from the inshorts API based on selected category
function fetchNews(category) {
  const newsContainer = document.getElementById('news-container');

  newsContainer.innerHTML = '';

  const apiUrl = `https://content.newtonschool.co/v1/pr/64806cf8b7d605c99eecde47/news`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log(data); // Log the API response for troubleshooting

      if (data && Array.isArray(data)) {
        data.forEach(news => {
          const newsCard = document.createElement('div');
          newsCard.classList.add('news-card');

          const category = document.createElement('p');
          category.classList.add('category');
          category.textContent = news.category;
          newsCard.appendChild(category);

          const publisher = document.createElement('p');
          publisher.textContent = news.author_name;
          newsCard.appendChild(publisher);

          const content = document.createElement('p');
          content.textContent = news.title;
          newsCard.appendChild(content);

          const readMoreLink = document.createElement('a');
          readMoreLink.classList.add('read-more');
          readMoreLink.textContent = 'Read More';
          readMoreLink.href = news.link;
          newsCard.appendChild(readMoreLink);

          const likeButton = document.createElement('button');
          likeButton.classList.add('like-button');
          likeButton.textContent = 'Like';
          newsCard.appendChild(likeButton);

          likeButton.addEventListener('click', () => {
            const savedNews = getSavedNewsFromLocalStorage();
            savedNews.push(news);
            localStorage.setItem('savedNews', JSON.stringify(savedNews));
          });

          newsContainer.appendChild(newsCard);
        });
      } else {
        console.error('Invalid API response format');
      }
    })
    .catch(error => {
      console.error('Error fetching news:', error);
    });
}

// Event listener for load saved news button
document.addEventListener('DOMContentLoaded', () => {
  const loadSavedNewsButton = document.getElementById('load-saved-news');

  if (loadSavedNewsButton) {
    loadSavedNewsButton.addEventListener('click', renderSavedNews);
  } else {
    console.error('load-saved-news button not found.');
  }

  // Initial render of saved news
  renderSavedNews();

  const categorySelect = document.getElementById('category');
  const searchButton = document.getElementById('search-button');

  if (categorySelect && searchButton) {
    searchButton.addEventListener('click', () => {
      const selectedCategory = categorySelect.value;
      fetchNews(selectedCategory);
    });
  } else {
    console.error('category or search-button element not found.');
  }
});

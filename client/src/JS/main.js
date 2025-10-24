
const PIXABAY_API_KEY = "52883499-f8b872ddd9da854394a79b614";


const API_URL = "https://pixabay.com/api/";


const searchForm = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");


const state = {
  searchQuery: "",
  page: 1,
  perPage: 12,
  totalHits: 0,
};



/**
 * Асинхронна функція для отримання зображень з Pixabay API.
 * @returns {Promise<Object|null>} Об'єкт з даними або null у разі помилки.
 */
async function fetchImages() {
  const url = `${API_URL}?image_type=photo&orientation=horizontal&q=${encodeURIComponent(
    state.searchQuery
  )}&page=${state.page}&per_page=${state.perPage}&key=${PIXABAY_API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Помилка при виконанні HTTP-запиту:", error);
    alert(
      `Помилка запиту. Перевірте ключ API та підключення. Деталі: ${error.message}`
    );
    return null;
  }
}




function createImageCardMarkup(hit) {
  const {
    webformatURL,
    largeImageURL,
    likes,
    views,
    comments,
    downloads,
    tags,
  } = hit;


  return `
        <li class="photo-card" data-large-img="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="stats">
                <p class="stats-item">
                    <i class="material-icons">thumb_up</i> ${likes}
                </p>
                <p class="stats-item">
                    <i class="material-icons">visibility</i> ${views}
                </p>
                <p class="stats-item">
                    <i class="material-icons">comment</i> ${comments}
                </p>
                <p class="stats-item">
                    <i class="material-icons">cloud_download</i> ${downloads}
                </p>
            </div>
        </li>
    `;
}


function renderImages(hits) {
  const markup = hits.map(createImageCardMarkup).join("");
  gallery.insertAdjacentHTML("beforeend", markup);


  const loadedImages = state.page * state.perPage;
  if (loadedImages < state.totalHits) {
    loadMoreBtn.classList.remove("is-hidden");
  } else {
    loadMoreBtn.classList.add("is-hidden");
    if (state.totalHits > 0 && state.page > 1) {
      alert("Ви досягли кінця результатів пошуку.");
    }
  }
}


function clearGallery() {
  gallery.innerHTML = "";
  loadMoreBtn.classList.add("is-hidden");
  state.totalHits = 0;
}




async function performSearch(isNewSearch = false) {
  if (isNewSearch) {
    clearGallery();
    state.page = 1; 
  }

  loadMoreBtn.classList.add("is-hidden");

  const data = await fetchImages();

  if (!data) return;

  const { hits, totalHits } = data;
  state.totalHits = totalHits;

  if (hits.length === 0) {
    alert(
      "На жаль, за вашим запитом зображень не знайдено. Спробуйте інший запит."
    );
    return;
  }

  if (isNewSearch) {
    alert(`Знайдено ${totalHits} зображень.`);
  }

  renderImages(hits);

  
  if (!isNewSearch && state.page > 1) {
    smoothScroll();
  }
}




function onSearch(e) {
  e.preventDefault();

  const newQuery = e.currentTarget.elements.query.value.trim();

  if (newQuery === "") {
    alert("Будь ласка, введіть пошуковий запит.");
    return;
  }

  if (newQuery === state.searchQuery && state.totalHits > 0) {
    
    return;
  }

  state.searchQuery = newQuery;
  performSearch(true); 
}


function onLoadMore() {
  state.page += 1;
  performSearch(false); 
}


function onGalleryClick(e) {
  const targetCard = e.target.closest(".photo-card");

  if (targetCard) {
    const largeImageURL = targetCard.dataset.largeImg;
    if (largeImageURL) {
      
      basicLightbox
        .create(
          `
                <img src="${largeImageURL}" alt="Збільшене зображення" loading="lazy">
            `
        )
        .show();
    }
  }
}

// 


function smoothScroll() {
  
  const lastCard = gallery.lastElementChild;
  if (lastCard) {
    
    lastCard.scrollIntoView({
      behavior: "smooth",
      block: "start", 
    });
  }
}



searchForm.addEventListener("submit", onSearch);
loadMoreBtn.addEventListener("click", onLoadMore);
gallery.addEventListener("click", onGalleryClick);

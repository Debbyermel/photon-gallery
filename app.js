const URL = "https://api.pexels.com/v1/curated?per_page=15&page=1";
const auth = "563492ad6f917000010000018b850d46c8b24368a7fa085d5ed337b3";
const gallery = document.querySelector('.gallery');
let searchInput = document.querySelector('.search-input');
const form = document.querySelector('.search-form');
let searchValue;
const more = document.querySelector('.more');
let fetchLink;
let page = 1;
let currentSearch;

//Events listener
searchInput.addEventListener('input', updateInput);
form.addEventListener('submit', (e) => {
  e.preventDefault();
  currentSearch = searchValue;
  searchPhotos(searchValue);
})

more.addEventListener('click', loadMore);

function updateInput(e) {
  searchValue = e.target.value;
};

async function fetchAPI(url) {
  const dataFetch = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: auth
    }
  });
  const data = await dataFetch.json();
  return data;
}

function generatePic(data) {
  data.photos.forEach(photo => {
    const galleryImg = document.createElement('div');
    galleryImg.classList.add('gallery-img');
    galleryImg.innerHTML =
    `
    <div class="gallery-info">
      <p>${photo.photographer}</p>
      <a href=${photo.src.original} target='_blank'>Download</a>
    </div>
    <img src=${photo.src.large}> </img>
    `;
    gallery.appendChild(galleryImg);
  });
}

async function curatedPhotos() {
  const data = await fetchAPI(URL);
  generatePic(data);
}

async function searchPhotos(query) {
  clear();
  const URLSearch = `https://api.pexels.com/v1/search?query=${query}+qyery&per_page=1`
  const data = await fetchAPI(URLSearch);
  generatePic(data);
}

function clear() {
  gallery.innerHTML = "";
  searchInput = "";
}

async function loadMore() {
  page++;
  if(currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}+qyery&per_page=${page}`
  }
  else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`
  }
  const data = await fetchAPI(fetchLink);
  generatePic(data);
}

curatedPhotos();
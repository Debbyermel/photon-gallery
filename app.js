const URL = "https://api.pexels.com/v1/curated";
const auth = "563492ad6f917000010000018b850d46c8b24368a7fa085d5ed337b3";
const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('.search-input');
const form = document.querySelector('.search-form');
let searchValue;

searchInput.addEventListener('input', updateInput);
form.addEventListener('submit', (e) => {
  e.preventDefault();
  searchPhotos(searchValue);
})

function updateInput(e) {
  searchValue = e.target.value;
};

async function curatedPhotos() {
  const dataFetch = await fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: auth
    }
  });
  const data = await dataFetch.json();
  data.photos.forEach(photo => {
    const galleryImg = document.createElement('div');
    galleryImg.classList.add('gallery-img');
    galleryImg.innerHTML = `<img src=${photo.src.large}> </img>
    <p>${photo.photographer}</p>
    `;
    gallery.appendChild(galleryImg);
  });
}

  async function searchPhotos(query) {
    const URLSearch = `https://api.pexels.com/v1/search?query=${query}+qyery&per_page=1`
    const dataFetch = await fetch(URLSearch, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: auth
      }
    });
    const data = await dataFetch.json();
    data.photos.forEach(photo => {
      const galleryImg = document.createElement('div');
      galleryImg.classList.add('gallery-img');
      galleryImg.innerHTML = `<img src=${photo.src.large}> </img>
      <p>${photo.photographer}</p>
      `;
      gallery.appendChild(galleryImg);
    });
  }

curatedPhotos();
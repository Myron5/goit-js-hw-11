import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api';

let imgs_count = -1;
let page = 1;
let q = '';

const refs = {
  gallery: document.querySelector('.gallery'),
  input: document.querySelector('input'),
  btn: document.querySelector('button'),
  list: document.querySelector('.js-list'),
  guard: document.querySelector('.js-guard'),
  refreshGuard(observer) {
    this.guard = document.querySelector('.js-guard');
    observer.observe(this.guard);
  },
};

const URLparams = new URLSearchParams({
  key: '33023282-0c7c5ceb968646b6c20d323c8',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
});

const observerOptions = {
  root: null,
  rootMargin: '120px',
  threshold: 0,
  per_page: 40,
};
// --------------------------------------------------------- Observer ---------------------------------------------------------

const observer = new IntersectionObserver(onLoad, observerOptions);

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.remove();
      page += 1;
      const url = `${BASE_URL}?${URLparams}&q=${q}&page=${page}`;
      render(url);
    }
  });
}

// --------------------------------------------------------- LightBox ----------------------------------------------------------

const lightbox = new SimpleLightbox('.gallery__link', {
  captionDelay: 250,
});
lightbox.on('show.simplelightbox', e => e.preventDefault());
lightbox.on('error.simplelightbox', e => console.log(e));

// --------------------------------------------------------- Functions ---------------------------------------------------------

refs.btn.addEventListener('click', e => {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  q = refs.input.value.trim();
  const url = `${BASE_URL}?${URLparams}&q=${q}`;
  if (q) {
    render(url);
    smoothScroll();
  }
});

async function render(url) {
  try {
    const { hits: imgs } = await getCurrency(url);
    if (imgs.length == 0) throw new Error('💔 Nothing was found');
    const markup = createMarkup(imgs);
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    refs.refreshGuard(observer);
    lightbox.refresh();
  } catch (err) {
    Notiflix.Notify.failure(err.message);
  }
}

async function getCurrency(url) {
  const promise = await axios.get(url);
  const { data } = promise;
  return data;
}

function createMarkup(imgs) {
  return imgs
    .map(img => {
      imgs_count += 1;
      return `
        <li class="gallery__item">
          <a class="gallery__link" href="${img.largeImageURL}">
            <div class="gallery__card" js-idx="${imgs_count}">
              <div class="gallery__thumb">
                  <img
                    class="gallery__image"
                    src="${img.webformatURL}"
                    alt="${img.tags}"
                  />
              </div>
              <ul class="info gallery__info">
                <li>
                  <p class="info__item info__item--likes">
                  <b
                    >Likes
                    <span class="info__num">${img.likes}</span>
                  </b>
                  </p>
                </li>
                <li>
                  <p class="info__item info__item--views">
                  <b>Views</b>
                  <span class="info__num">${img.likes}</span>
                  </p>
                </li>
                <li>
                  <p class="info__item info__item--comments">
                  <b>Comments</b>
                  <span class="info__num">${img.likes}</span>
                  </p>
                </li>
                <li>
                  <p class="info__item info__item--downloads">
                  <b>Downloads</b>
                  <span class="info__num">${img.likes}</span>
                  </p>
                </li>
              </ul>
            </div>
          </a>
        </li>`;
    })
    .concat('<div class="js-guard"></div>')
    .join('');
}

function smoothScroll() {
  const firstCard = refs.gallery.firstElementChild;

  if (firstCard) {
    const { height: cardHeight } = firstCard.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}

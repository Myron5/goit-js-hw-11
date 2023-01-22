import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api';

let imgIdx = 1;
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
    if (this.guard) observer.observe(this.guard);
  },
};

const URLparams = new URLSearchParams({
  key: '33023282-0c7c5ceb968646b6c20d323c8',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
});

const observerOptions = {
  root: null,
  rootMargin: '120px',
  threshold: 0,
};
// --------------------------------------------------------- Observer ---------------------------------------------------------

const observer = new IntersectionObserver(onLoad, observerOptions);

const lastObserver = new IntersectionObserver(onLastObserver, observerOptions);

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

function onLastObserver(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      Notiflix.Notify.warning(
        "🔚 We're sorry, but you've reached the end of search results."
      );
    }
  });
}

// --------------------------------------------------------- LightBox ----------------------------------------------------------

const lightbox = new SimpleLightbox('.gallery__link', {
  captionDelay: 250,
});
lightbox.on('show.simplelightbox', e => e.preventDefault());
lightbox.on('error.simplelightbox', e => console.log(e));

// ------------------------------------------------------- Evt Listeners -------------------------------------------------------

refs.btn.addEventListener('click', onEnterData);

document.addEventListener('keydown', e => {
  if (e.code === 'Enter') onEnterData(e);
});

async function onEnterData(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  q = refs.input.value.trim();
  const url = `${BASE_URL}?${URLparams}&q=${q}`;
  if (q) {
    const imgsCount = await render(url);
    smoothScroll();
    if (imgsCount)
      Notiflix.Notify.success(`📸 Hooray! We found ${imgsCount} images.`);
  }
}

// --------------------------------------------------------- Functions ---------------------------------------------------------

async function render(url) {
  try {
    const data = await getCurrency(url);
    const { hits: imgs, total: imgsCount } = data;
    const isEnd = imgIdx + 40 >= imgsCount;

    if (!imgsCount)
      throw new Error(
        '💔 Sorry, there are no images matching your search query. Please try again.'
      );

    const markup = createMarkup(imgs, isEnd);
    refs.gallery.insertAdjacentHTML('beforeend', markup);

    if (isEnd) lastObserver.observe(document.querySelector('.js-last-guard'));

    refs.refreshGuard(observer);
    lightbox.refresh();

    return imgsCount;
  } catch (err) {
    Notiflix.Notify.failure(err.message);
    console.log(err.message);
  }
}

async function getCurrency(url) {
  const promise = await axios.get(url);
  const { data } = promise;
  return data;
}

function createMarkup(imgs, isEnd) {
  let markup = '';
  imgs.map(img => {
    markup += `
        <li class="gallery__item">
          <a class="gallery__link" href="${img.largeImageURL}">
            <div class="gallery__card" js-idx="${imgIdx}">
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
    imgIdx += 1;
  });
  if (!isEnd) markup += '<div class="js-guard"></div>';
  else markup += '<div class="js-last-guard"></div>';

  return markup;
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

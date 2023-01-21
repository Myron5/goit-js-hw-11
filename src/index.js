import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  gallery: document.querySelector('.gallery'),
  images: document.querySelectorAll('.gallery__image'),
  links: document.querySelectorAll('.gallery__link'),
};

const BASE_URL = 'https://pixabay.com/api';
let imgs_count = -1;
const params = new URLSearchParams({
  key: '33023282-0c7c5ceb968646b6c20d323c8',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
});

async function getCurrency(url) {
  const promise = await axios.get(url);
  const { data } = promise;
  return data;
}

const q = 'cats';
const url = `${BASE_URL}?${params}&q=${q}`;

async function render(url) {
  try {
    const { hits: imgs } = await getCurrency(url);
    const markup = creatMarkup(imgs);
    refs.gallery.insertAdjacentHTML('beforeend', markup);
  } catch (err) {
    console.log(Notiflix.Notify.failure(err.message));
  }
}
render(url);

function creatMarkup(imgs) {
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
    .join('');
}

const lightbox = new SimpleLightbox('.gallery__link', {
  captionDelay: 250,
});
lightbox.on('show.simplelightbox', e => e.preventDefault());
lightbox.on('error.simplelightbox', e => console.log(e));

// --------------------------------------------------------- DILIMITER ---------------------------------------------------------

// const list = document.querySelector('.js-list');
// const guard = document.querySelector('.js-guard');
// let page = 1;
// const options = {
//   root: null,
//   rootMargin: '300px',
//   threshold: 0,
// };

// let observer = new IntersectionObserver(onLoad, options);
// // document.addEventListener('scroll', onScroll)
// // let test = 0

// // function onScroll() {
// //     test += 1
// //     console.log('scroll',test);
// // }

// // let observTest = 0

// function onLoad(entries, observer) {
//   // observTest += 1;
//   // console.log('observer',observTest);
//   entries.forEach(entry => {
//     console.log(entry);
//     if (entry.isIntersecting) {
//       page += 1;
//       lordOfTheRingsAPI(page)
//         .then(data => {
//           createMarkup(data.docs);
//           if (data.page === data.pages) {
//             observer.unobserve(guard);
//           }
//         })
//         .catch(err => console.log(err));
//     }
//   });
// }

// function lordOfTheRingsAPI(page = 1) {
//   const BASE_URL = 'https://the-one-api.dev/v2/character';
//   const TOKEN = 'XJlq9OFMcHAy8pAQK7xj';
//   const options = {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${TOKEN}`,
//     },
//   };

//   return fetch(
//     `${BASE_URL}?limit=100&page=${page}&sort=name:asc`,
//     options
//   ).then(resp => {
//     if (!resp.ok) {
//       throw new Error(resp.statusText);
//     }

//     return resp.json();
//   });
// }

// function createMarkup(arr) {
//   const markup = arr
//     .map(
//       ({ name, race }) => `<li>
//     <h2>${name}</h2>
//     <h3>${race}</h3>
// </li>`
//     )
//     .join('');

//   list.insertAdjacentHTML('beforeend', markup);
// }

// lordOfTheRingsAPI()
//   .then(data => {
//     createMarkup(data.docs);
//     observer.observe(guard);
//   })
//   .catch(err => console.log(err));

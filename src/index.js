import Notiflix from 'notiflix';
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api';
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
    const imgs = await getCurrency(url);
    console.log(imgs);
  } catch (err) {
    console.log(err.message);
  }
}
render(url);

Notiflix.Notify.success('Sol lucet omnibus');
Notiflix.Notify.failure('Qui timide rogat docet negare');

import axios from 'axios';

export default async function getCurrency(url) {
  const promise = await axios.get(url);
  const { data } = promise;
  return data;
}

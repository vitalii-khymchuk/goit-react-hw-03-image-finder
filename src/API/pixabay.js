import axios from 'axios';

const KEY = '30038991-f32bd01169e2b8884a35adff1';
const baseURL = 'https://pixabay.com/api/';

const pixabayAPI = axios.create({ baseURL });

function get({ query, currentPage = 1 }) {
  return pixabayAPI.get(
    `?key=${KEY}&q=${query}&page=${currentPage}&image_type=photo&orientation=horizontal&per_page=12`
  );
}

export const pixabay = { get };


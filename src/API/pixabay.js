import axios from 'axios';

const KEY = '30038991-f32bd01169e2b8884a35adff1';
const baseURL = 'https://pixabay.com/api/';

const pixabayAPI = axios.create({ baseURL });

async function get({ query, currentPage = 1 }) {
  const {
    data: { totalHits, hits },
  } = await pixabayAPI.get(
    `?key=${KEY}&q=${query}&page=${currentPage}&image_type=photo&orientation=horizontal&per_page=12`
  );
  const normalizedHits = normalizeHits(hits);
  const totalPages = getTotalPages(totalHits);
  return { totalPages, normalizedHits };
}

function normalizeHits(hits) {
  return hits.map(({ id, webformatURL, largeImageURL, tags }) => {
    return { id, webformatURL, largeImageURL, tags };
  });
}

function getTotalPages(totalHits) {
  const imagesPerPage = 12;
  return Math.ceil(totalHits / imagesPerPage);
}

export const pixabay = { get };

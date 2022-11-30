import { BasicLightBox } from 'basiclightbox';

function create(url) {
  BasicLightBox.create(url).show();
}

export const gallery = { create };

import PropTypes from 'prop-types';
import { ImageGalleryList } from './ImageGallery.styled';
import ImageGalleryItem from 'components/ImageGalleryItem';

export default function ImageGallery({ images, addLargeImgToState }) {
  return (
    <ImageGalleryList>
      {images.map(({ id, webformatURL, largeImageURL, tags }) => {
        return (
          <ImageGalleryItem
            key={id}
            webformatURL={webformatURL}
            tags={tags}
            largeImageURL={largeImageURL}
            addLargeImgToState={addLargeImgToState}
          />
        );
      })}
    </ImageGalleryList>
  );
}

ImageGallery.propTypes = {
  images: PropTypes.array.isRequired,
  addLargeImgToState: PropTypes.func.isRequired,
};

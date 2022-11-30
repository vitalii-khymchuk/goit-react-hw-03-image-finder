import PropTypes from 'prop-types';
import { Card, Image } from './ImageGalleryItem.styled';

export default function ImageGalleryItem({
  webformatURL,
  tags,
  largeImageURL,
  addLargeImgToState,
}) {
  return (
    <Card onClick={() => addLargeImgToState({ largeImageURL, tags })}>
      <Image src={webformatURL} alt={tags} />
    </Card>
  );
}

ImageGalleryItem.propTypes = {
  addLargeImgToState: PropTypes.func.isRequired,
  webformatURL: PropTypes.string.isRequired,
  largeImageURL: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
};

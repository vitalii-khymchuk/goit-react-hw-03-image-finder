import PropTypes from 'prop-types';

export default function ImageGalleryItem({
  webformatURL,
  tags,
  largeImageURL,
  addLargeImgToState,
}) {
  return (
    <li
      className="ImageGalleryItem"
      onClick={() => addLargeImgToState({ largeImageURL, tags })}
    >
      <img src={webformatURL} alt={tags} className="ImageGalleryItem-image" />
    </li>
  );
}

ImageGalleryItem.propTypes = {
  addLargeImgToState: PropTypes.func.isRequired,
  webformatURL: PropTypes.string.isRequired,
  largeImageURL: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
};

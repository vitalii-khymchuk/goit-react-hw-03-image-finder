import ImageGalleryItem from 'components/ImageGalleryItem';

export default function ImageGallery({ images, addLargeImgToState }) {
  return (
    <ul className="ImageGallery">
      {images.map(({ id, webformatURL, largeImageURL, tags }) => {
        return (
          <ImageGalleryItem
            key={id}
            webformatURL={webformatURL}
            tags={tags}
            largeImageURL={largeImageURL}
            addLargeImgToState={addLargeImgToState}
            id={id}
          />
        );
      })}
    </ul>
  );
}

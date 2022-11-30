export default function ImageGalleryItem({
  webformatURL,
  tags,
  largeImageURL,
  addLargeImgToState,
}) {
  // function shouldComponentUpdate(nextProps) {
  //   return this.props.id !== nextProps.id;
  // }
  return (
    <li
      className="ImageGalleryItem"
      onClick={() => addLargeImgToState({ largeImageURL, tags })}
    >
      <img src={webformatURL} alt={tags} className="ImageGalleryItem-image" />
    </li>
  );
}

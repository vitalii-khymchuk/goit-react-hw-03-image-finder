import { Component } from 'react';
import { pixabay } from 'API';
import ImageGallery from 'components/ImageGallery';
import Modal from 'components/Modal';
import Loader from 'components/Loader';
import Button from 'components/Button';
import Searchbar from './Searchbar';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export class App extends Component {
  state = {
    searchQuery: '',
    images: [],
    modalImg: {},
    currentPage: 1,
    totalPages: null,
    status: Status.IDLE,
  };

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery: currentQuery, currentPage, images } = this.state;
    const isQueryChanged = prevState.searchQuery !== currentQuery;
    const isPageChanged = prevState.currentPage !== currentPage;
    if (isPageChanged || isQueryChanged) {
      this.setState({ status: Status.PENDING });
      pixabay
        .get({ query: currentQuery, currentPage })
        .then(this.handleReceivedData)
        .catch(this.handleError);
    }
  }

  getQuery = searchQuery => {
    this.resetCurrentData();
    this.setState({ searchQuery });
  };

  resetCurrentData = () => {
    this.setState({ currentPage: 1, images: [] });
  };

  getTotalPages = totalHits => {
    const imagesPerPage = 12;
    const totalPages = Math.ceil(totalHits / imagesPerPage);
    this.setState({ totalPages });
  };

  handleReceivedData = ({ totalHits, normalizedHits }) => {
    this.setState({ status: Status.RESOLVED });
    this.getTotalPages(totalHits);
    this.setState(({ images }) => {
      return { images: [...images, ...normalizedHits] };
    });
  };

  handleError = msg => {
    console.log(msg);
    this.setState({ status: Status.REJECTED });
  };

  addLargeImgToState = modalImg => {
    this.setState({ modalImg });
  };

  closeModal = () => {
    this.setState({ modalImg: {} });
  };

  onLoadMoreClick = () => {
    this.setState(({ currentPage }) => {
      return { currentPage: currentPage + 1 };
    });
  };

  render() {
    const { images, modalImg, status, totalPages } = this.state;
    const isModalImg = !!modalImg.largeImageURL;
    return (
      <>
        <Searchbar onSubmit={this.getQuery} />
        {status === 'pending' && (
          <>
            {images[0] && (
              <ImageGallery
                images={images}
                addLargeImgToState={this.addLargeImgToState}
              />
            )}
            <Loader />
          </>
        )}
        {status === 'resolved' && (
          <>
            <ImageGallery
              images={images}
              addLargeImgToState={this.addLargeImgToState}
            />
            {totalPages > 1 && (
              <Button onLoadMoreClick={this.onLoadMoreClick} />
            )}
            {isModalImg && (
              <Modal modalImg={modalImg} closeModal={this.closeModal} />
            )}
          </>
        )}
      </>
    );
  }
}

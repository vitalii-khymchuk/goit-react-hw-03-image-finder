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
    const { searchQuery: currentQuery, currentPage } = this.state;
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
    this.setState({ searchQuery, currentPage: 1, images: [] });
  };

  handleReceivedData = ({ totalPages, normalizedHits }) => {
    this.setState({ status: Status.RESOLVED });
    this.setState(({ images }) => {
      return { images: [...images, ...normalizedHits], totalPages };
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
    const { images, modalImg, status, totalPages, currentPage } = this.state;
    return (
      <>
        <Searchbar onSubmit={this.getQuery} />
        {!!images.length && (
          <ImageGallery
            images={images}
            addLargeImgToState={this.addLargeImgToState}
          />
        )}
        {status === 'pending' && <Loader />}
        {status === 'resolved' && (
          <>
            {totalPages > 1 && currentPage < totalPages && (
              <Button onLoadMoreClick={this.onLoadMoreClick} />
            )}
            {modalImg.largeImageURL && (
              <Modal modalImg={modalImg} closeModal={this.closeModal} />
            )}
          </>
        )}
      </>
    );
  }
}

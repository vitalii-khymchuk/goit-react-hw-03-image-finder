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
    currentPage: 1,
    modalImg: {},
    totalPages: null,
    status: Status.IDLE,
  };

  scrollPosY = 0;

  getSnapshotBeforeUpdate(prevProps, prevState) {
    const isQueryChanged = prevState.searchQuery !== this.state.searchQuery;
    if (prevState.status === 'resolved') {
      this.scrollPosY = isQueryChanged ? 0 : window.scrollY;
    }
    return null;
  }

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
    const isImagesAdded =
      prevState.images.length !== 0 &&
      prevState.images.length !== images.length;
    const scrollPosY = this.scrollPosY;
    if (isImagesAdded) {
      this.scrollPageTo(scrollPosY, 100);
    } else {
      this.scrollPageTo(scrollPosY);
    }
  }

  getTotalPages = totalHits => {
    const imagesPerPage = 12;
    const totalPages = Math.ceil(totalHits / imagesPerPage);
    this.setState({ totalPages });
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

  scrollPageTo = (yPos, extraScroll = 0) => {
    window.scrollTo(0, yPos);
    window.scrollTo({
      top: yPos + extraScroll,
      left: 0,
      behavior: 'smooth',
    });
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

  resetCurrentData = () => {
    this.setState({ currentPage: 1, images: [] });
  };

  getQuery = searchQuery => {
    this.resetCurrentData();
    this.setState({ searchQuery });
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

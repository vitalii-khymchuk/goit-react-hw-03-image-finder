import React, { Component } from 'react';
import { pixabay } from 'API';
import ImageGallery from '../ImageGallery';
import Modal from '../Modal';
import Loader from 'components/Loader';
import Button from 'components/Button';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  SHOWING: 'showing',
  REJECTED: 'rejected',
};

export default class Main extends Component {
  state = {
    images: [],
    currentPage: 1,
    modalImg: {},
    totalPages: null,
    status: Status.IDLE,
  };

  scrollPosY = 0;

  //   shouldComponentUpdate(nextProps, nextState) {

  //   }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    const isQueryChanged = prevProps.searchQuery !== this.props.currentQuery;
    const qwe = this.props.currentQuery !== '';
    if (isQueryChanged && qwe) {
      this.clearCurrentData();
    }
    if (window.scrollY !== 0) {
      this.scrollPosY = window.scrollY;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery: currentQuery } = this.props;
    const isQueryChanged = prevProps.searchQuery !== currentQuery;
    // if (isQueryChanged) {
    //   await this.clearCurrentData();
    // }
    const { currentPage } = this.state;
    const isImagesAdded =
      prevState.images.length !== 0 && prevState.images !== this.state.images;
    const isPageChanged = prevState.currentPage !== currentPage;

    // console.log(`isQueryChanged ${isQueryChanged}`);
    // console.log(`isPageChanged${isPageChanged}`);
    if (isQueryChanged || isPageChanged) {
      this.setState({ status: Status.PENDING });
      //   console.log(currentQuery);
      //   console.log(currentPage);
      pixabay
        .get({ query: currentQuery, currentPage })
        .then(data => this.handleReceivedData(data, isPageChanged))
        .catch(this.handleError);
    }
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
    this.setState({ modalImg, status: Status.SHOWING });
  };

  closeModal = () => {
    this.setState({ modalImg: {}, status: Status.RESOLVED });
  };

  normalizeHits = hits => {
    return hits.map(({ id, webformatURL, largeImageURL, tags }) => {
      return { id, webformatURL, largeImageURL, tags };
    });
  };

  onLoadMoreClick = () => {
    this.setState(({ currentPage }) => {
      return { currentPage: currentPage + 1 };
    });
  };

  // Знову ж таки без setTimeout не працювало
  scrollPageTo = (yPos, extraScroll = 0) => {
    setTimeout(() => {
      window.scrollTo(0, yPos);
      window.scrollTo({
        top: yPos + extraScroll,
        left: 0,
        behavior: 'smooth',
      });
    }, 0);
  };

  handleReceivedData = (data, isPageChanged) => {
    const {
      data: { totalHits, hits },
    } = data;
    this.setState({ status: Status.RESOLVED });
    this.getTotalPages(totalHits);
    const normalizedHits = this.normalizeHits(hits);
    if (isPageChanged) {
      this.setState(({ images }) => {
        return { images: [...images, ...normalizedHits] };
      });
      return;
    }
    this.setState({ images: normalizedHits });
  };

  handleError = msg => {
    console.log(msg);
    this.setState({ status: Status.REJECTED });
  };

  clearCurrentData = () => {
    console.log(`reset`);
    this.setState({ currentPage: 1, images: [] });
    this.scrollPosY = 0;
  };

  render() {
    const { images, modalImg, status, totalPages } = this.state;
    if (status === 'pending') {
      return (
        <>
          {images[0] && (
            <ImageGallery
              images={images}
              addLargeImgToState={this.addLargeImgToState}
            />
          )}
          <Loader />
        </>
      );
    }
    if (status === 'resolved') {
      return (
        <>
          <ImageGallery
            images={images}
            addLargeImgToState={this.addLargeImgToState}
          />
          {totalPages > 1 && <Button onLoadMoreClick={this.onLoadMoreClick} />}
        </>
      );
    }
    if (status === 'showing') {
      return <Modal modalImg={modalImg} closeModal={this.closeModal} />;
    }
  }
}

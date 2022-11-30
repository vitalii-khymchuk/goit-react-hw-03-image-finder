import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pixabay } from 'API';
import ImageGallery from 'components/ImageGallery';
import Modal from 'components/Modal';
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

  getSnapshotBeforeUpdate(prevProps, prevState) {
    const isQueryChanged = prevProps.searchQuery !== this.props.searchQuery;
    if (prevState.status === 'resolved') {
      this.scrollPosY = isQueryChanged ? 0 : window.scrollY;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery: currentQuery } = this.props;
    const { currentPage, images } = this.state;
    const isQueryChanged = prevProps.searchQuery !== currentQuery;
    const isPageChanged = prevState.currentPage !== currentPage;
    const isImagesAdded =
      prevState.images.length !== 0 &&
      prevState.images.length !== images.length;
    const didResetAfterNewQuery = isQueryChanged && currentPage === 1;
    if (isQueryChanged) {
      this.resetCurrentData();
    }
    if (isPageChanged || didResetAfterNewQuery) {
      this.setState({ status: Status.PENDING });
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

  scrollPageTo = (yPos, extraScroll = 0) => {
    window.scrollTo(0, yPos);
    window.scrollTo({
      top: yPos + extraScroll,
      left: 0,
      behavior: 'smooth',
    });
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

  resetCurrentData = () => {
    this.setState({ currentPage: 1, images: [] });
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

Main.propTypes = { searchQuery: PropTypes.string.isRequired };

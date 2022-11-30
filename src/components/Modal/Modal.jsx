import PropTypes from 'prop-types';
import { Component } from 'react';
import { Overlay, ModalWrap } from './Modal.styled';

export default class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.onKeyPress);
    // без setInterval при відкритті модалки приходить подія mouseClick і модалка закриється,
    // може підкажете рішення краще, це виглядає дуже костильно
    setTimeout(() => {
      window.addEventListener('click', this.onClick);
    }, 0);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyPress);
    window.removeEventListener('click', this.onClick);
  }
  onKeyPress = e => {
    if (e.key && e.key === 'Escape') {
      this.props.closeModal();
    }
  };
  onClick = e => {
    const modalRef = document.querySelector('.Modal');
    if (e.target.closest('.Modal') !== modalRef) {
      this.props.closeModal();
    }
  };
  render() {
    const {
      modalImg: { largeImageURL, tags },
    } = this.props;
    return (
      <Overlay>
        <ModalWrap className="Modal">
          <img src={largeImageURL} alt={tags} />
        </ModalWrap>
      </Overlay>
    );
  }
}

Modal.propTypes = {
  modalImg: PropTypes.shape({
    largeImageURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
  }).isRequired,
  closeModal: PropTypes.func.isRequired,
};

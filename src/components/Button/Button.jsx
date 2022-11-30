import PropTypes from 'prop-types';
import { Box } from 'components/reusableComponents';
import { LoadMoreBtn } from './Button.styled';

export default function Button({ onLoadMoreClick }) {
  return (
    <Box display="flex" justifyContent="center" mt="12px">
      <LoadMoreBtn type="button" onClick={onLoadMoreClick}>
        Load more
      </LoadMoreBtn>
    </Box>
  );
}

Button.propTypes = {
  onLoadMoreClick: PropTypes.func.isRequired,
};

import PropTypes from 'prop-types';
import { Box } from 'components/reusableComponents';

export default function Button({ onLoadMoreClick }) {
  return (
    <Box display="flex" justifyContent="center" mt="12px">
      <button type="button" className="Button" onClick={onLoadMoreClick}>
        Load more
      </button>
    </Box>
  );
}

Button.propTypes = {
  onLoadMoreClick: PropTypes.func.isRequired,
};

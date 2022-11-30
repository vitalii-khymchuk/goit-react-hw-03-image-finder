import { ColorRing } from 'react-loader-spinner';
import { Box } from 'components/reusableComponents';

export default function Loader() {
  return (
    <Box display="flex" justifyContent="center">
      <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{
          // position: 'absolute',
          // top: '50%',
          // left: '50%',
          // transform: 'translate(-50% -50%)',
          marginTop: '80px',
        }}
        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
      />
    </Box>
  );
}

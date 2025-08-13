import { styled } from '@mui/material/styles';

export const LogInWrapper = styled('div', {
  name: 'LogInWrapper',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    return [styles.root];
  },
})();
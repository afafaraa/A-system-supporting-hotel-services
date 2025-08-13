import { styled } from '@mui/material/styles';

export const LogInInput = styled('input', {
  name: 'LogInInput',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    return [styles.root];
  },
})();
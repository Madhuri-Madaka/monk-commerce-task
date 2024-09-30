import { Button } from '@mui/material';
import { styled } from '@mui/system';

const CustomButtonComponent = styled(Button)(({ variant }) => ({
  padding: '4px 16px !important',
  borderRadius: '4px',
  fontWeight: 600,
  textTransform: 'none', 

  ...(variant === 'outlined' && {
    border: '2px solid #008060',
    color: '#008060',
    backgroundColor: 'transparent',
  }),

  ...(variant === 'contained' && {
    backgroundColor: '#008060',
    color: '#ffffff',
    border: 'none',
    '&:hover': {
      backgroundColor: '#006a4d',
    },
  }),

  ...(variant === 'normal' && {
    border: '2px solid #c4c4c4',
    color: '#808080',
    backgroundColor: 'transparent',
  }),
}));

export const CustomButton = ({ children, variant, ...props }) => {
  return (
    <CustomButtonComponent variant={variant} {...props}>
      {children}
    </CustomButtonComponent>
  );
};

export default CustomButton;

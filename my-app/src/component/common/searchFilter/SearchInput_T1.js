
import React from 'react';

//css
import Sstyled from "styled-components"

//material-ui
import { styled, alpha } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.15),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function SearchInput_T1({ placeholder, value, onChange, goAction, onClick}) {

//   const goSearch = (e) => {
//     if(e.keyCode == 13){
//        console.log('QQQQQQQQ');
//        // put the login here
//     }
//  }

  return (
    <Search>
      <SearchIconWrapper>
        {/* <IconButton>
        <SearchIcon onClick={()=>{console.log("버튼동작");}} />
        </IconButton> */}
        <SearchIcon onClick={onClick} />
      </SearchIconWrapper>
      <StyledInputBase
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onKeyPress={(e) => {
          //console.log(`Pressed keyCode ${e.key}`);  
          if (e.key === 'Enter') {
            goAction();
            e.preventDefault();
          }
        }}
      />
    </Search>
  );
}
import React,{useState} from 'react'
// import styled from "styled-components";
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { styled , alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

function ModalSearch({ children , placeholder , value , onChange  }) {

    const [active, setactive] = useState(false);
    
    const Activable = ()=>{
        setactive(true)
    }
    return (

        <SearchInput
            // bbb={active}
            onClick={Activable}
            // label="검색"
            autoComplete='fales'
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <IconButton>{children}</IconButton>
                    </InputAdornment>
                ),
            }}
            variant="outlined"
        />


    )
}

export default ModalSearch


const SearchInput = styled(TextField)`
    width: 200px;
    transition: all 0.5s;
   :focus-within{
       width : 300px;
   }
`


//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//material-ui
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Chip from '@mui/material/Chip';
import FaceIcon from '@mui/icons-material/Face';
import Tooltip from '@mui/material/Tooltip';
import PhoneIcon from '@mui/icons-material/Phone';

//css
import styled from "styled-components"


import { Mobile, PC } from "../../../../MediaQuery"

export default function Request({ value, index, onChangeCheckEl }) {

  //... 눌렀을때(메뉴)
  const [menu, setMenu] = useState(false);
  const showModal = () => {
    setMenu(!menu);
  }

  const get_status = (tr_status) => {
    let status;
    switch (tr_status) {
      case 0:
        status = '예약 접수';
        break;
      case 1:
        status = '예약취소/해제';
        break;
      case 2:
        status = '라이브예약초대';
        break;
    }
    return status;
  }

  return (
    <>
      {/*방송 만료상태일때 CheckBox 사라져야함  tr_status:1취소*/}
      {
          <MUFormControlLabel
            value={value.prd_identity_id}
            control={       
              <Checkbox id={"check" + index}
                checked={value.isChecked}
                onChange={() => onChangeCheckEl(index)}
              />
            }
            label={
                  <div className="par-spacing">
                    <p className="capt-00">{value.create_date}_{value.tr_id}</p>
                    <p><Tooltip title="예약자"><FaceIcon /></Tooltip>{value.tr_name}&nbsp;&nbsp;{value.tr_email}</p>
                    <p><Chip label={get_status(value.tr_status)} size="small" color="primary" /></p>
                  </div>
            }
          />
        
      }

    </>
  );
}


const MUFormControlLabel = styled(FormControlLabel)`
&.MuiFormControlLabel-root .MuiFormControlLabel-label {
  width: 100%;
}
`
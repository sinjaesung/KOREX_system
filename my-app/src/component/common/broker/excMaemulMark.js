// react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

// css
import styled from "styled-components";

//mateiral-ui

const ExcMaemulMark = ({ status, startDate, endDate }) => {
  
  console.log('전속매물상태값 등 관련상태:',status,startDate,endDate);
  
  return (
    <>
      {status == 1 ?
        <Mark>
          <span>전속매물</span>
          &nbsp;&nbsp;
          <div className="flex-left-center">
            <span>{startDate}</span>
            <span>~</span>
            <span>{endDate}</span>
          </div>
        </Mark>
        :
        <Mark>
          <span>전속매물</span>
          &nbsp;&nbsp;
          <div className="flex-left-center">
            <span></span>
            <span>~</span>
            <span></span>
          </div>
        </Mark>
      }
    </>
  )
};

export default ExcMaemulMark;

const Mark = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  border:1px solid ${(props) => props.theme.palette.primary.main};
  line-height:1.125rem;
  color: ${(props)=>props.theme.palette.primary.main};
  font-size: 0.75rem;
`

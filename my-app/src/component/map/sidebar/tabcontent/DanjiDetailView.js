//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"
import 'swiper/swiper-bundle.css';

//material
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';


//img
import Arrow from "../../../../img/map/filter_next.png";
import Detail from "../../../../img/map/detail_img.png";
import Trade from "../../../../img/map/trade.png";
import Report from "../../../../img/map/report.png";
import Change from "../../../../img/member/change.png";

//swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';


// components
import { Mobile, PC } from "../../../../MediaQuery";

SwiperCore.use([Navigation, Pagination]);
// export default function SideItemDetail({openBunyang, rank, updatePageIndex,historyInfo,setMap}) {
export default function DanjiDetailView({ topDesc, list, areaIndex, setList, danjiDesc, areainfo_structure, typeIndex, setTypeIndex }) {
  console.log('===>danjdetailview시행:::', list);

  const handleTypeIndex = (event, newTypeIndex) => {
    if (newTypeIndex !== null) {
      setTypeIndex(newTypeIndex);
    }
    // !!@@ 211109_이형규>마무리 요청---토글버튼(전체,매매,전월세)로 변경하여 정상작동하려면, useEffect사용해야 할 것 같음.
    // let transaction_typelist = [];
    // for (let d = 0; d < areainfo_structure[areaIndex]['totaltransaction'].length; d++) {
    //   transaction_typelist[d] = {};
    //   transaction_typelist[d]['contract_ym'] = areainfo_structure[areaIndex]['totaltransaction'][d]['contract_ym'];
    //   transaction_typelist[d]['contract_dt'] = areainfo_structure[areaIndex]['totaltransaction'][d]['contract_dt'];
    //   transaction_typelist[d]['type'] = areainfo_structure[areaIndex]['totaltransaction'][d]['type'];
    //   transaction_typelist[d]['deposit'] = areainfo_structure[areaIndex]['totaltransaction'][d]['deposit'];
    //   transaction_typelist[d]['floor'] = areainfo_structure[areaIndex]['totaltransaction'][d]['floor'];
    // }
    // setList(transaction_typelist);

  };

  return (
    <>
      <div className="par-spacing-2p5x0 tAlign-c">
        {/* <p>공급/전용면적&nbsp;({danjiDesc['area']})</p> */}
        <Chip label={`공급/전용면적 (${danjiDesc['area']})`} />
      </div>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Toolbar className="flex-spabetween-center">
            <span>실거래가</span>
            <ToggleButtonGroup
              value={typeIndex}
              exclusive
              onChange={handleTypeIndex}
              aria-label="text alignment"
            >
              <ToggleButton value={0}>
                전체
              </ToggleButton>
              <ToggleButton value={1}>
                매매
              </ToggleButton>
              <ToggleButton value={2}>
                전월세
              </ToggleButton>
            </ToggleButtonGroup>
          </Toolbar>
          <TableContainer component={Paper}>
            <MUTable sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  {/* <TableCell>Dessert (100g serving)</TableCell> */}
                  <TableCell align="right">계약일</TableCell>
                  <TableCell align="right">거래유형</TableCell>
                  <TableCell align="right">거래금액</TableCell>
                  <TableCell align="right">층수</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((value, index) => (
                  <TableRow
                    key={value.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    {/* <TableCell component="th" scope="value">
                {value.name}
              </TableCell> */}
                    <TableCell align="right">{value.contract_ym}{value.contract_dt}</TableCell>
                    <TableCell align="right">{value.type}</TableCell>
                    <TableCell align="right">{value.deposit}</TableCell>
                    <TableCell align="right">{value.floor}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </MUTable>
          </TableContainer>
        </Paper>
      </Box>
    </>
  );
}


const MUTable = styled(Table)`
&.MuiTable-root{
   min-width: 0;
}
  
`
const TopInfo = styled.div`
  padding-left:22px;
  width:100%;
  @media ${(props) => props.theme.mobile} {
    padding-left:calc(100vw*(28/428));
  }
`
const TextLine = styled.div`
  display:flex;justify-content:flex-start;align-items:center;
  width:100%;
  margin:35px 0;
  &:last-child{margin-bottom:0}
  @media ${(props) => props.theme.mobile} {
    margin:calc(100vw*(35/428)) 0;
  }
`
const Title = styled.p`
  font-size:15px;font-weight:600;
  transform:skew(-0.1deg);color:#898989;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const Data = styled(Title)`
  color:#4a4a4a;
  margin-left:17px;
  @media ${(props) => props.theme.mobile} {
    margin-left:calc(100vw*(10/428));
  }
`
const WrapPriceList = styled.div`
  width:100%;
  margin-top:25px;padding-top:25px;
  border-top:1px solid #f2f2f2;
  @media ${(props) => props.theme.mobile} {
    margin-top:calc(100vw*(25/428));
    padding-top:0;
    border-top:none;
  }
`
const PriceListTop = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  margin-bottom:25px;
  padding:0 22px;
  @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(384/428));
    margin:0 auto calc(100vw*(25/428));
    padding:calc(100vw*(25/428)) 0 0;
    border-top:1px solid #f2f2f2;
  }
`
const TabBtn = styled.div`
  display:flex;justify-content:space-between;align-items:center;
`
const Tab = styled.div`
  font-size:15px;font-weight:600;
  transform:skew(-0.1deg);
  cursor:pointer;
  transition:all 0.3s;
  color:${({ active }) => active ? "#01684b" : "#707070"};
  font-weight:${({ active }) => active ? 800 : 600};
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
  }
`
const Part = styled.p`
  display:inline-block;
  width:1px;height:16px;
  margin:0 14px;
  vertical-align:middle;
  background:#707070;
  @media ${(props) => props.theme.mobile} {
    height:calc(100vw*(13/428));
  }
`
const PriceList = styled.table`
  width:100%;
  table-layout:fixed;
`
const DivTitle = styled.div`
  display:flex;justify-content:space-around;align-items:center;
  text-align:center;
  padding:17px 0 18px;
  background:#f8f7f7;
  @media ${(props) => props.theme.mobile} {
    padding:calc(100vw*(13/428)) 0 calc(100vw*(13/428)) calc(100vw*(0/428));
    border-top:1px solid #f8f7f7;
  }

`
const Div = styled.div`
  text-align:center;
  font-size:15px;color:#898989;
  font-weight:600;transform:skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    &:first-child{padding-left:calc(100vw*(12/428));}
    &:nth-child(3){margin-left:calc(100vw*(-2/428));}
    &:last-child{padding-left:calc(100vw*(10/428));}
  }
`
const DivCont = styled(DivTitle)`
  background:transparent; display:flex;justify-content:space-around;align-items:center;
  text-align:center;
  &:nth-child(2) div{color:#fe7a01;}
  @media ${(props) => props.theme.mobile} {
    padding-left:0;
  }
`

const TrBody = styled.tr`
  &:nth-child(1) {color:#fe7a01;}
`
const Divv = styled(Div)`
  color:#4a4a4a;
  &:nth-child(1){width:25%;}
  &:nth-child(2){width:10%;}
  &:nth-child(3){width:20%;}
  &:nth-child(4){width:10%;}
  @media ${(props) => props.theme.mobile} {
    &:first-child{padding-left:0;}
    &:nth-child(3){margin-left:0;}
    &:last-child{padding-left:0;}
  }
`

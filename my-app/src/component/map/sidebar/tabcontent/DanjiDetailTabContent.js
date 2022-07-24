//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
// import {Tabs, Tab} from 'react-bootstrap-tabs';

//css
import styled from "styled-components"
import 'swiper/swiper-bundle.css';

//img
import Arrow from "../../../../img/map/filter_next.png";
import Detail from "../../../../img/map/detail_img.png";
import Trade from "../../../../img/map/trade.png";
import Report from "../../../../img/map/report.png";
import Change from "../../../../img/member/change.png";

//material
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

//swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';


// components
import { Mobile, PC } from "../../../../MediaQuery";

SwiperCore.use([Navigation, Pagination]);
// export default function SideItemDetail({openBunyang, rank, updatePageIndex,historyInfo,setMap}) {
export default function SideItemDetail({ setDanjiDesc, setList, areainfo_structure, isArea, areaIndex, setAreaIndex, setTypeIndex, isWidth }) {

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <MUTabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        aria-label="scrollable force tabs example"
      >
        {
          areainfo_structure.map((value, index) => {
            console.log('value___________', value);
            let key_val = value['key'];
            let information = value['info'];
            return (
            < MUTab
              label={isWidth ? `${parseFloat(information['exclusive_area']).toFixed(0)}m²` : `${parseFloat(information['exclusive_area']).toFixed(0)}평`}
              onClick={() => {
                setAreaIndex(index);
                setDanjiDesc({
                  area: parseFloat(areainfo_structure[index]['info']['supply_area']).toFixed(3) + '/' + parseFloat(areainfo_structure[index]['info']['exclusive_area']).toFixed(3),
                  //typeNum: areainfo_structure[index]['sadecnt']
                });

                var transaction_typelist = [];
                for (let d = 0; d < areainfo_structure[index]['totaltransaction'].length; d++) {
                  transaction_typelist[d] = {};
                  transaction_typelist[d]['contract_ym'] = areainfo_structure[index]['totaltransaction'][d]['contract_ym'];
                  transaction_typelist[d]['contract_dt'] = areainfo_structure[index]['totaltransaction'][d]['contract_dt'];
                  transaction_typelist[d]['type'] = areainfo_structure[index]['totaltransaction'][d]['type'];
                  transaction_typelist[d]['deposit'] = areainfo_structure[index]['totaltransaction'][d]['deposit'];
                  transaction_typelist[d]['floor'] = areainfo_structure[index]['totaltransaction'][d]['floor'];
                }
                setList(

                  transaction_typelist
                );
                setTypeIndex(0);//0:전체, 1:매매,2:전월세 그 typeindex샅개밧에 따라서 디테일뷰처리펭지에서 보여주는 거래타입을 달리한다.

              }}
            />
            );
          })
        }
      </MUTabs>
    </>
  );
}



const MUTabs = styled(Tabs)``
const MUTab = styled(Tab)``
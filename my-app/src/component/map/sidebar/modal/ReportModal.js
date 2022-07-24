//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";

//css
import styled from "styled-components"
import 'swiper/swiper-bundle.css';

//img
import Close from "../../../../img/main/modal_close.png";
import Check from "../../../../img/map/radio.png";
import Checked from "../../../../img/map/radio_chk.png";

//component
import ReportModalFirst from "./ReportModalFirst";
import ReportModalSecond from "./ReportModalSecond";
import ReportModalThird from "./ReportModalThird";
import ReportModalComplete from "./ReportModalComplete";

export default function ReportModal({report,setReport}) {
  const [pageIndex , setPageIndex] = useState(0);

  const pageLoader = () =>{
    switch (pageIndex) {
      case 0: return <ReportModalFirst updatePageIndex={updatePageIndex} report={report} setReport={setReport}/>;
      case 1: return <ReportModalSecond updatePageIndex={updatePageIndex} report={report} setReport={setReport}/>;
      case 2: return <ReportModalThird updatePageIndex={updatePageIndex} report={report} setReport={setReport}/>
      case 3: return <ReportModalComplete updatePageIndex={updatePageIndex} report={report} setReport={setReport}/>
      default :return <ReportModalFirst updatePageIndex={updatePageIndex} report={report} setReport={setReport}/>;
    }
  }
  const updatePageIndex = (index) =>{
    if(index == 0)
      setPageIndex(0);
    else if(index == 1)
      setPageIndex(1);
    else
      setPageIndex(index);
  }

  if(report[0] == false)
  return null;
    return (
        <Container>
            <Bg onClick={() => {setReport(false)}}/>
            {
              pageLoader()
            }
        </Container>
  );
}

const Container = styled.div `
  width:100%;
`
const Bg = styled.div `
  position:fixed;
  width:100%;
  height:100%;left:0;top:0;
  background:rgba(0,0,0,0.2);
  display:block;
  z-index:3;
`

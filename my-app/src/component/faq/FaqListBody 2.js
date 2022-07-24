//react
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";

//theme
import { TtCon_Frame_B, TtCon_Title, TtCon_1col, } from '../../theme';

//material-ui
import ListItem from '@material-ui/core/ListItem';
import ListItemButton from '@material-ui/core/ListItemButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { styled as MUstyled } from '@material-ui/core/styles';
import Pagination from '@mui/material/Pagination';
import SortIcon from '@mui/icons-material/Sort';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


//css
import styled from "styled-components"
import RightArrow from '../../img/notice/right_arrow.png';

//server
import serverController from '../../server/serverController';



export default function SubTitle() {
  const [activeIndex, setActiveIndex] = useState(0);
  const FaqListItem = [
    {
      faq_id: 0,
      src: RightArrow,
      path: "/FaqDetail",
      title: "FAQ입니다. 질문이 많이 많이 길어질시 이렇게 표시됩니다. 질문이 많이 많이 길어질시 이렇게 표시됩니다."
    },
    {
      faq_id: 1,
      src: RightArrow,
      path: "/FaqDetail",
      title: "부동산 관리에 대해 문의드립니다."
    },
    {
      faq_id: 2,
      src: RightArrow,
      path: "/FaqDetail",
      title: "부동산 관리에 대해 문의드립니다.",
      date: "2021년 3월 8일"
    },
    {
      faq_id: 3,
      src: RightArrow,
      path: "/FaqDetail",
      title: "부동산 관리에 대해 문의드립니다.",
      date: "2021년 3월 8일"
    },
    {
      faq_id: 4,
      src: RightArrow,
      path: "/FaqDetail",
      title: "부동산 관리에 대해 문의드립니다."
    },
    {
      faq_id: 5,
      src: RightArrow,
      path: "/FaqDetail",
      title: "부동산 관리에 대해 문의드립니다."
    }
  ]

  const onClickPreNext = (bool) => {
    let newIndex = activeIndex;
    if (bool) {
      newIndex++;
    } else {
      if (newIndex == 0) { return; }
      newIndex--;
    }
    setActiveIndex(newIndex)
  }

  const [faqlist, setfaqlist] = useState([]);

  useEffect(async () => {
    let body_info = {
      type: 1,
      request_data: 'faq'
    }
    let res = await serverController.connectFetchController(`/api/commondata/request`, "POST", JSON.stringify(body_info), function () { }, function (test) { console.log(test) });
    console.log('faq listsss resultss', res);
    //alert(res);
    if (res) {
      if (res.success) {
        setfaqlist(res.result);
      }
    }

  }, []);



  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  return (
    <>
      <Wrapper>
        <p className="tit-a2">FAQ</p>
        <Sect_R2>
          {/* <WrapFaqBody> */}
          <div className="par-spacing-after">
          <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Accordion 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Accordion 2</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>Disabled Accordion</Typography>
        </AccordionSummary>
      </Accordion>

          </div>
        </Sect_R2>
      </Wrapper>
    </>
  );
}

//material-ui
const MULi = styled(ListItem)`
/* position:relative; */
   width:100%;
   height: 10%;
  display:felx;justify-content:space-between;align-items:center;flex-wrap:wrap;
  /* padding:10px 40px; */
  /* border-bottom:1px solid #f2f2f2; */
`
const MUListItemIcon = styled(ListItemIcon)`
  min-width : 0px;
`

const MUTxt = styled(ListItemText)`
  width: 97%;
  font-size:30px;color:#4a4a4a;
  font-weight:800;transform:skew(-0.1deg);
  text-overflow:ellipsis;
  overflow:hidden;
`
const MUListItemButton = styled(ListItemButton)`
  width: 100%;
`
const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Title = styled.h2``

const Sect_R2 = styled.div`
  ${TtCon_1col}
`



const RightArrowImg = styled.img`
  width:8px;
  vertical-align:middle;
  @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(10/428));
    }
`
const WrapListPagenation = styled.div`
  /* width:400px; */
  width:auto;
  margin:50px auto;
  display:flex;
  justify-content:center;
  align-items:center;
  @media ${(props) => props.theme.mobile} {
    width:100%;
    margin:calc(100vw*(40/428)) auto;
  }
`
const PrevBtn = styled.div`
`
const InPrevBtn = styled.div`
  cursor: pointer;
  font-size:15px;
  transform:skew(-0.1deg);
  color:#707070;
  font-weight:800;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(13/428));
  }
`
const WrapPageNumber = styled.div`
  display:flex;
  justify-content-content:flex-start;
  align-items:center;
  margin:0 37px;
  @media ${(props) => props.theme.mobile} {
    margin:0 calc(100vw*(33/428));
  }
`
const PageNumber = styled.div`
  margin-right:15px;
  &:last-child{margin-right:0;}
  @media ${(props) => props.theme.mobile} {
    margin-right:calc(100vw*(20/428));
  }
`
const InNumber = styled.div`
  cursor: pointer;
  font-size:15px;
  transform:skew(-0.1deg);
  font-weight:800;
  color:#707070;
  color:${({ active }) => active ? "#FE7A01" : "#979797"};
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(13/428));
  }

`
const NextBtn = styled(PrevBtn)`
`
const InNextBtn = styled(InPrevBtn)`
  cursor: pointer;
`

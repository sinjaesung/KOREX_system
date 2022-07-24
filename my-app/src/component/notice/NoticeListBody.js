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

import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

//css
import styled from "styled-components"
import RightArrow from '../../img/notice/right_arrow.png';

//server
import serverController from '../../server/serverController';

export default function SubTitle() {
  const [activeIndex, setActiveIndex] = useState(0);
  const NoticeListItem = [
    {
      notice_id: 0,
      src: RightArrow,
      path: "/NoticeDetail",
      title: "[공지] 공지사항",
      date: "2021년 3월 8일"
    },
    {
      notice_id: 1,
      src: RightArrow,
      path: "/NoticeDetail",
      title: "[공지] 공지사항 제목이 길어질시는 이렇게 처리되어집니다. 두줄로 처리됩니다. 두줄로 처리됩니다. 두줄로 처리됩니다.",
      date: "2021년 3월 6일"
    },
    {
      notice_id: 2,
      src: RightArrow,
      path: "/NoticeDetail",
      title: "[공지] 공지사항 제목이 길어질시는 이렇게 처리되어집니다. 두줄로 처리됩니다. 두줄로 처리됩니다. 두줄로 처리됩니다.",
      date: "2021년 3월 6일"
    },
    {
      notice_id: 3,
      src: RightArrow,
      path: "/NoticeDetail",
      title: "[공지] 공지사항 제목이 길어질시는 이렇게 처리되어집니다. 두줄로 처리됩니다. 두줄로 처리됩니다. 두줄로 처리됩니다.",
      date: "2021년 3월 6일"
    },
    {
      notice_id: 4,
      src: RightArrow,
      path: "/NoticeDetail",
      title: "[공지] 공지사항 제목이 길어질시는 이렇게 처리되어집니다. 두줄로 처리됩니다. 두줄로 처리됩니다. 두줄로 처리됩니다.",
      date: "2021년 3월 6일"
    },
    {
      notice_id: 5,
      src: RightArrow,
      path: "/NoticeDetail",
      title: "[공지] 공지사항 제목이 길어질시는 이렇게 처리되어집니다. 두줄로 처리됩니다. 두줄로 처리됩니다. 두줄로 처리됩니다.",
      date: "2021년 3월 6일"
    },
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

  const [noticelist, setnoticelist] = useState([]);
  useEffect(async () => {
    let body_info = {
      type: 1,
      request_data: 'board'
    }
    let res = await serverController.connectFetchController(`/api/commondata/request`, "POST", JSON.stringify(body_info), function () { }, function (test) { console.log(test) });
    console.log('board listsss resultss', res);
    //alert(res);
    if (res) {
      if (res.success) {
        setnoticelist(res.result);
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
        <p className="tit-a2">공지사항</p>
        <Sect_R2>
          <div className="mt-1 par-spacing-after">
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
              <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                <span>[공지] 타이틀타이틀타이틀</span>
                <span>2021-00-00</span>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                  malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                  sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                  sit amet blandit leo lobortis eget.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
              <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                <span>[공지] 타이틀타이틀타이틀</span>
                <span>2021-00-00</span>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                  malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                  sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                  sit amet blandit leo lobortis eget.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
              <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                <span>[공지] 타이틀타이틀타이틀</span>
                <span>2021-00-00</span>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                  malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                  sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                  sit amet blandit leo lobortis eget.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
          <div className="mt-3 par-spacing tAlign-c">
            <Pagination sx={{ display: 'inline-block' }} count={10} showFirstButton showLastButton />
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
const Sect_R2 = styled.div`
  ${TtCon_1col}
`

const Accordion = MUstyled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = MUstyled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, .05)'
        : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1),
      justifyContent: 'space-between',
    },
  }));


const AccordionDetails = MUstyled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));



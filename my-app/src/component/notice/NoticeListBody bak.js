//react
import React ,{useState, useEffect} from 'react';
import { Link, useHistory } from "react-router-dom";

//material-ui
import ListItem from '@material-ui/core/ListItem';
import ListItemButton from '@material-ui/core/ListItemButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Pagination from '@mui/material/Pagination';
//css
import styled from "styled-components"
import RightArrow from '../../img/notice/right_arrow.png';

//server
import serverController from '../../server/serverController';

export default function SubTitle() {
  const [activeIndex,setActiveIndex] = useState(0);
  const NoticeListItem =[
    {
      notice_id : 0,
      src:RightArrow,
      path:"/NoticeDetail",
      title:"[공지] 공지사항",
      date:"2021년 3월 8일"
    },
    {
      notice_id : 1,
      src:RightArrow,
      path:"/NoticeDetail",
      title:"[공지] 공지사항 제목이 길어질시는 이렇게 처리되어집니다. 두줄로 처리됩니다. 두줄로 처리됩니다. 두줄로 처리됩니다.",
      date:"2021년 3월 6일"
    },
    {
      notice_id : 2,
      src:RightArrow,
      path:"/NoticeDetail",
      title:"[공지] 공지사항 제목이 길어질시는 이렇게 처리되어집니다. 두줄로 처리됩니다. 두줄로 처리됩니다. 두줄로 처리됩니다.",
      date:"2021년 3월 6일"
    },
    {
      notice_id : 3,
      src:RightArrow,
      path:"/NoticeDetail",
      title:"[공지] 공지사항 제목이 길어질시는 이렇게 처리되어집니다. 두줄로 처리됩니다. 두줄로 처리됩니다. 두줄로 처리됩니다.",
      date:"2021년 3월 6일"
    },
    {
      notice_id : 4,
      src:RightArrow,
      path:"/NoticeDetail",
      title:"[공지] 공지사항 제목이 길어질시는 이렇게 처리되어집니다. 두줄로 처리됩니다. 두줄로 처리됩니다. 두줄로 처리됩니다.",
      date:"2021년 3월 6일"
    },
    {
      notice_id : 5,
      src:RightArrow,
      path:"/NoticeDetail",
      title:"[공지] 공지사항 제목이 길어질시는 이렇게 처리되어집니다. 두줄로 처리됩니다. 두줄로 처리됩니다. 두줄로 처리됩니다.",
      date:"2021년 3월 6일"
    },
  ]

  const onClickPreNext = (bool) => {
    let newIndex = activeIndex;
    if(bool){
      newIndex++;
    }else{
      if(newIndex==0){return;}
      newIndex--;
    }
    setActiveIndex(newIndex)
  }

  const [noticelist,setnoticelist] = useState([]);
    useEffect(async() => {
      let body_info={
        type : 1,
        request_data:'board'
      }
      let res= await serverController.connectFetchController(`/api/commondata/request`,"POST",JSON.stringify(body_info),function(){},function(test){console.log(test)});
      console.log('board listsss resultss',res);
      //alert(res);
      if(res){
        if(res.success){
          setnoticelist(res.result);
        }
      }
      
    },[]);
    return (
        <Container>
          <WrapNoticeBody>
            <NoticeList>
            {
              noticelist.map((value) => {
                let date_value=new window.Date(value['create_date']);
                let year=date_value.getFullYear();
                let month=date_value.getMonth()+1;
                let date=date_value.getDate();

                return(
                  //변경점
                  // <List>
                  //   <Link to={"NoticeDetail/"+value.board_id} className="data_link"></Link>
                  //     <NoticeTitle>
                  //       <Title>{value.board_title}</Title>
                  //       <NoticeDate>{year}년 {month}월 {date}일</NoticeDate>
                  //     </NoticeTitle>
                  //     <GoDetail>
                  //       <RightArrowImg src={RightArrow}/>
                  //     </GoDetail>
                  // </List>
                  <MULi disablePadding>
                    <MUListItemButton>
                      <Link to={value.path} className="data_link"></Link>
                      <MUTxt primary={value.title} 
                        secondary={value.date}
                      primaryTypographyProps={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        letterSpacing: 0,
                        color: "#4a4a4a",
                        lineHeight: '30px',
                        textOverflow: "ellipsis",
                        overflow: 'hidden',
                        whiteSpace: "nowrap"
                      }} />
                      <MUListItemIcon>
                        <RightArrowImg src={value.src} />
                      </MUListItemIcon>
                    </MUListItemButton>
                  </MULi>
                )
              })
            }
            </NoticeList>

            <WrapListPagenation>
            <Pagination count={100} showFirstButton showLastButton />
              {/*
            
              <PrevBtn>
                <InPrevBtn onClick={() => onClickPreNext(false)}>이전</InPrevBtn>
              </PrevBtn>
              <WrapPageNumber>
                <PageNumber>
                  <InNumber active={activeIndex == 0} onClick={()=>{setActiveIndex(0)}}>1</InNumber>
                </PageNumber>
                <PageNumber>
                  <InNumber active={activeIndex == 1} onClick={()=>{setActiveIndex(1)}}>2</InNumber>
                </PageNumber>
                <PageNumber>
                  <InNumber active={activeIndex == 2} onClick={()=>{setActiveIndex(2)}}>3</InNumber>
                </PageNumber>
                <PageNumber>
                  <InNumber active={activeIndex == 3} onClick={()=>{setActiveIndex(3)}}>4</InNumber>
                </PageNumber>
              </WrapPageNumber>
            
              <NextBtn>
                <InNextBtn onClick={() => onClickPreNext(true)}>다음</InNextBtn>
              </NextBtn>
              */}
            </WrapListPagenation>

          </WrapNoticeBody>
        </Container>
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

const Container = styled.div`
  width:100%;
  @media ${(props) => props.theme.mobile} {
        width:calc(100vw*(390/428));
        margin:0 auto;
    }
`
const WrapNoticeBody = styled.div`
  width:640px;
  margin:0 auto;
  @media ${(props) => props.theme.mobile} {
        width:100%;
        margin:0 auto;
    }
`
const NoticeList = styled.ul`
  width:100%;
  padding-top:15px;
  @media ${(props) => props.theme.mobile} {
        width:100%;
        padding-top:calc(100vw*(10/428));
    }
`
const List = styled.li`
  position:relative;
  width:100%;
  padding:25px 40px;
  border-bottom:1px solid #f2f2f2;
  display:flex;justify-content:space-between;align-items:center;
  @media ${(props) => props.theme.mobile} {
        width:100%;
        padding:calc(100vw*(21/428)) calc(100vw*(27/428));
    }
`
const NoticeTitle = styled.div`
  width:97%;
  transform:skew(0.1deg);
  @media ${(props) => props.theme.mobile} {

    }
`
const Title = styled.h2`
  width:97%;
  font-size:15px;
  margin-bottom:10px;
  color:#4a4a4a;
  font-weight:800;
  white-space:nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(15/428));
    margin-bottom:calc(100vw*(5/428));
    }
`
const NoticeDate = styled.p`
  font-size:12px;
  color:#4a4a4a;
  font-weight:600;
  transform:skew(0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(12/428));
  }
`
const GoDetail = styled.span`

`
const RightArrowImg = styled.img`
  width:8px;
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(5/428));
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
  justify-content:flex-start;
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
  color:${({active}) => active ? "#FE7A01" : "#979797"};
  @media ${(props) => props.theme.mobile} {
    font-size:calc(100vw*(13/428));
  }

`
const NextBtn = styled(PrevBtn)`
`
const InNextBtn = styled(InPrevBtn)`
  cursor: pointer;
`

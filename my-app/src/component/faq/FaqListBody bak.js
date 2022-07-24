//react
import React ,{useState, useEffect} from 'react';
import { Link, useHistory } from "react-router-dom";

//material-ui
import ListItem from '@material-ui/core/ListItem';
import ListItemButton from '@material-ui/core/ListItemButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { styled as MUstyled} from '@material-ui/core/styles';
import Pagination from '@mui/material/Pagination';

//css
import styled from "styled-components"
import RightArrow from '../../img/notice/right_arrow.png';

//server
import serverController from '../../server/serverController';

export default function SubTitle() {
  const [activeIndex,setActiveIndex] = useState(0);
  const FaqListItem =[
    {
      faq_id : 0,
      src:RightArrow,
      path:"/FaqDetail",
      title:"FAQ입니다. 질문이 많이 많이 길어질시 이렇게 표시됩니다. 질문이 많이 많이 길어질시 이렇게 표시됩니다."
    },
    {
      faq_id : 1,
      src:RightArrow,
      path:"/FaqDetail",
      title:"부동산 관리에 대해 문의드립니다."
    },
    {
      faq_id : 2,
      src:RightArrow,
      path:"/FaqDetail",
      title:"부동산 관리에 대해 문의드립니다.",
      date:"2021년 3월 8일"
    },
    {
      faq_id : 3,
      src:RightArrow,
      path:"/FaqDetail",
      title:"부동산 관리에 대해 문의드립니다.",
      date:"2021년 3월 8일"
    },
    {
      faq_id : 4,
      src:RightArrow,
      path:"/FaqDetail",
      title:"부동산 관리에 대해 문의드립니다."
    },
    {
      faq_id : 5,
      src:RightArrow,
      path:"/FaqDetail",
      title:"부동산 관리에 대해 문의드립니다."
    }
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
    
    const [faqlist,setfaqlist] = useState([]);
    useEffect(async() => {
      let body_info={
        type : 1,
        request_data:'faq'
      }
      let res= await serverController.connectFetchController(`/api/commondata/request`,"POST",JSON.stringify(body_info),function(){},function(test){console.log(test)});
      console.log('faq listsss resultss',res);
      //alert(res);
      if(res){
        if(res.success){
          setfaqlist(res.result);
        }
      }
      
    },[]);
    return (
        <Container>
          <WrapFaqBody>
            <FaqList>
            {
            faqlist.map((value) => {
              return(


                <MULi disablePadding>
                  <MUListItemButton>
                    <Link to={value.path} className="data_link"></Link>
                    <MUTxt primary={value.title} primaryTypographyProps={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      letterSpacing: 0,
                      color: "#4a4a4a",
                      lineHeight: '30px',
                      textOverflow : "ellipsis",
                      overflow: 'hidden',
                      whiteSpace : "nowrap"
                    }} />
                    <MUListItemIcon>
                      <RightArrowImg src={value.src} />
                    </MUListItemIcon>
                  </MUListItemButton>
                </MULi>




                // <List>
                //   <Link to={value.path} className="data_link"></Link>
                //     <FaqTitle>
                //       <Title>{value.title}</Title>
                //     </FaqTitle>
                //     <GoDetail>
                //       <RightArrowImg src={value.src}/>
                //     </GoDetail>
                // </List>


              )}
            )
          }
            </FaqList>
          </WrapFaqBody>


          <WrapListPagenation>
        <Pagination count={10} showFirstButton showLastButton />
 
            {/* <PrevBtn>
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
            </NextBtn> */}
          </WrapListPagenation>
        </Container>
  );
}

//material-ui
const MULi = MUstyled(ListItem)`
/* position:relative; */
   width:100%;
   height: 10%;
  display:felx;justify-content:space-between;align-items:center;flex-wrap:wrap;
  /* padding:10px 40px; */
  /* border-bottom:1px solid #f2f2f2; */
`
const MUListItemIcon = MUstyled(ListItemIcon)`
  min-width : 0px;
`

const MUTxt = MUstyled(ListItemText)`
  width: 97%;
  font-size:30px;color:#4a4a4a;
  font-weight:800;transform:skew(-0.1deg);
  text-overflow:ellipsis;
  overflow:hidden;
`
const MUListItemButton = MUstyled(ListItemButton)`
  width: 100%;
`


const Container = styled.div`
  width:100%;
`
const WrapFaqBody = styled.div`
  width:640px;
  margin:0 auto;
  @media ${(props) => props.theme.mobile} {
      width:calc(100vw*(390/428));
      margin:0 auto;
    }
`
const FaqList = styled.ul`
  width:100%;
`
const List = styled.li`
  position:relative;
  width:100%;
  padding:40px;
  border-bottom:1px solid #f2f2f2;
  display:flex;justify-content:space-between;align-items:center;
  @media ${(props) => props.theme.mobile} {
      padding: calc(100vw*(35/428)) calc(100vw*(20/428));
    }
`
const FaqTitle = styled.div`
  width:97%;
  transform:skew(0.1deg);
`
const Title = styled.h2`
  width:97%;
  font-size:15px;
  color:#4a4a4a;
  font-weight:800;
  white-space:nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
  @media ${(props) => props.theme.mobile} {
      font-size:calc(100vw*(15/428));
    }
`
const GoDetail = styled.span`

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
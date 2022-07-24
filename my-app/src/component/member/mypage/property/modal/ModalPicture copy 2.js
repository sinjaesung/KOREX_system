//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"

//material-ui
import Button from '@material-ui/core/Button';
import { styled as MUstyled } from '@material-ui/core/styles';

//img
import Picture from '../../../../../img/member/picture.png';
import Item from '../../../../../img/map/detail_img.png';
import Delete from '../../../../../img/main/modal_close.png';
import serverController from '../../../../../server/serverController';
import { useSelector } from 'react-redux';

import localStringData from '../../../../../const/localStringData';

//지도 모달
export default function ModalPicture({ setServeruploadimgs_server, setChangeaddedimgs_server, serveruploadimgs_server, changeaddedimgs_server, imgfiles, setimgfiles, prd_id, prdidinfo, offModal}) {
  console.log('사진업로드 모달창 실행>>>:');
  console.log('사진업로드 모달창 실행>>>:', imgfiles);

  const [editimgs, seteditimgs] = useState([])

  const [initimgs, setinitimgs] = useState([])

  const brokerRequest_product_data = useSelector(data => data.brokerRequest_product); //물건 수정 시 보여주는 값
  console.log('데이터는 있다', brokerRequest_product_data);

  const [changeadded_filearrays, setChangeadded_filearrays] = useState([]);//클라이언트단 업로드전 프리뷰형태의 파일스트림 표현 리스트/ 파일스트림으로 읽어져서 나오는 리스트.
  const [serveruploadimgarrays, setServeruploadimgarrays] = useState([]);//최종적 서버에 결정된 업로드 사진리스트 fileobject개체.

  //처음 랜더링 되었을 때
  // useEffect( async () => {
  //   if (brokerRequest_product_data.prdidentityid !== ''){
  //     let res = await serverController.connectFetchController(`/api/products/${brokerRequest_product_data.prdidentityid}?prd_field_all=1 `, 'get');

  //     console.log('수정 데이터', res.data.prd_imgs.split(','));
  //     console.log('수정 데이터', changeadded_filearrays);
  //     seteditimgs([...res.data.prd_imgs.split(',')])
  //     setChangeadded_filearrays([...res.data.prd_imgs.split(',')])
  //     // setChangeaddedimgs_server([...res.data.prd_imgs.split(',')])
  //   }else{
  //     setChangeadded_filearrays([...changeaddedimgs_server])
  //     changesetfileimgs([...serveruploadimgs_server])
  //     console.log('데이터 있다22', serveruploadimgs_server);
  //   }

  // }, [])

  console.log('사진나오기1', prd_id);
  console.log('사진나오기1', prdidinfo);


  useEffect(async () => {
    // if (prd_id !== '') {
    //   let res = await serverController.connectFetchController(`/api/products/${prd_id}?prd_field_all=1 `, 'get');

    //   console.log('수정 데이터', res);
    //   // console.log('수정 데이터', res.data.prd_imgs.split(','));
    //   // console.log('수정 데이터', changeadded_filearrays);
    //   // seteditimgs([...res.data.prd_imgs.split(',')])
    //   // setChangeadded_filearrays([...res.data.prd_imgs.split(',')])
    //   // setChangeaddedimgs_server([...res.data.prd_imgs.split(',')])
    // } else {
    //   setChangeadded_filearrays([...changeaddedimgs_server])
    //   changesetfileimgs([...serveruploadimgs_server])
    //   console.log('데이터 있다22', serveruploadimgs_server);
    // }
    console.log('사진나오기1', imgfiles);
    //사진이 있을때
    let res = await serverController.connectFetchController(`/api/products/${prd_id}?prd_field_all=1 `, 'get');
    if (!!res.data.prd_imgs) {
      console.log('사진나오기2');
      console.log('사진나오기2', res.data.prd_imgs.split(','));
      // seteditimgs([...res.data.prd_imgs.split(',')])
      setChangeadded_filearrays([...imgfiles,...res.data.prd_imgs.split(',')])
      setChangeaddedimgs_server([...res.data.prd_imgs.split(',')])
    }else{
      setChangeadded_filearrays([...imgfiles])

    }
    
    // console.log('사진나오기1', prd_id);
    // console.log('사진나오기1', prdidinfo);

  }, [])

  //사진관련 처리.

  // 수정 시 필요=================================================
  // console.log('데이터 있다.', serveruploadimgs_server);
  // useEffect( async () => {
  //   if (serveruploadimgs_server.length > 0){

  //     console.log('데이터 있다.', serveruploadimgs_server);

  //     var imgdata_array = [];
  //     for (let j = 0; j < serveruploadimgs_server.length; j++) {
  //       let item = serveruploadimgs_server[j];
  //       console.log('file itemss:', item);

  //       try {
  //         const filecontents = await readuploadedfile(item);
  //         console.log('filecontetnsss:', filecontents);

  //         //선택 이미지 모달창,메인 페이지 보여주가
  //         imgdata_array.push(filecontents);//흠 동기로 처리 await되기에 실행흐름순서대로 처리가능하다.
  //       } catch (e) {
  //         console.log('file read await serrreors:', e.message);
  //       }
  //     }

  //     setChangeadded_filearrays([...changeadded_filearrays, ...imgdata_array]);
  //     }
  // }, [])
  //===================================================================================================

  const [fileimgs, setfileimgs] = useState([])
  const [changefileimgs, changesetfileimgs] = useState([])

  //적용 버튼
  const insertbtn = () => {
    console.log('데이터 있다22', changeadded_filearrays); //변형 파일주소 추가 후 갯수
    console.log('데이터 있다22', imgfiles); //추가한 새 이미지 파일형태
    console.log('데이터 있다22', fileimgs); //추가한 새 이미지 파일형태
    
    
    // console.log('데이터 있다22', fileimgs); //추가한 새 이미지 파일형태
    // // console.log('데이터 있다22', editimgs);  ////변형 파일주소 추가 후 갯수
    // console.log('데이터 있다22', [...serveruploadimgs_server, ...fileimgs]); //추가한 새 이미지 파일형태
    // console.log('데이터 있다22', changeaddedimgs_server); //추가한 새 이미지 파일형태
    // console.log('데이터 있다22', changefileimgs); // 빔...
    // setChangeaddedimgs_server(editimgs) // 수정 페이지 이미지 리스트로 넘어감 , 원본파일로 넘어가야함 -> 사진 수 측정
    // setServeruploadimgs_server(editimgs) //추가 page로 넘어감
    // setServeruploadimgs_server([...fileimgs, ...changefileimgs]) //페이지로 넘김 // 원본파일
    //삭제 처리 했을 때 동작해야함
    // setServeruploadimgs_server(serveruploadimgarrays) //페이지로 넘김 // 원본파일
    
    // setServeruploadimgarrays() //
   
    // setimgfiles([...changeadded_filearrays])
    // // setChangeadded_filearrays([...changeadded_filearrays]) // 모달에서 보이는 이미지들
    // // setChangeaddedimgs_server([...changeaddedimgs_server,...changeadded_filearrays]) // 페이지에서 보이는 이미지들 리스트


    setChangeaddedimgs_server([...changeadded_filearrays]) // 페이지에서 보이는 이미지들 리스트
    setServeruploadimgs_server([...fileimgs]) //페이지로 넘김 // 원본파일
    
    // // changesetfileimgs([...fileimgs])
    offModal()
  }



  console.log('데이터 있다.', serveruploadimgs_server); // 변경 데이터
  console.log('데이터 있다.', changeaddedimgs_server); // 변경 데이터
  console.log('데이터 있다.', imgfiles); // 변경 데이터
  const readuploadedfile = (inputfile) => {
    let filereader = new FileReader();

    return new Promise((resolve, reject) => {
      filereader.onload = () => {
        console.log('대상 파일개체 다 읽음::', filereader.result);
        resolve(filereader.result);
      };
      filereader.onerror = () => {
        console.log('대상파일개체읽음 오류::');
        filereader.abort();
        reject(new DOMException('prooblme parskgin input filesss...'));
      };
      filereader.readAsDataURL(inputfile);
    });
  }

  const EditmaemulimgsChange = async (e) => {
    console.log('file upload onchanges evernt startss=============>>');
    const {
      target: { files }
    } = e;
    const theFiles = files;
    console.log('이미지 파일 확인:', theFiles);

    setfileimgs([...fileimgs,...theFiles]);//선택 파일 객체 임시 저장
    // setfileimgs([...fileimgs, ...theFiles]);//선택 파일 객체 임시 저장

    var imgdata_array = [];
    for (let j = 0; j < theFiles.length; j++) {
      let item = theFiles[j];
      console.log('이미지 파일 확인:', item);

      try {
        const filecontents = await readuploadedfile(item);

        //선택 이미지 모달창,메인 페이지 보여주가
        imgdata_array.push(filecontents);//흠 동기로 처리 await되기에 실행흐름순서대로 처리가능하다.
      } catch (e) {
        console.log('이미지 파일 확인:', e.message);
      }
    }

    // setChangeadded_filearrays([...changeadded_filearrays, ...imgdata_array])  
    setChangeadded_filearrays([...changeadded_filearrays,...imgdata_array])


    setimgfiles([...imgfiles,...imgdata_array])


    console.log('이미지 파일 확인:', changeadded_filearrays);  // 기존 파일
    console.log('이미지 파일 확인:', imgdata_array); // 새 파일
    console.log('이미지 파일 확인:', [...imgfiles, ...imgdata_array]);
    console.log('이미지 파일 확인:', [...fileimgs, ...theFiles]);

  }

  const imgdelete = async (target_index) => {
    console.log('이미지 삭제 현재 inserte되어있는 이미지 배열현황:', changeadded_filearrays, serveruploadimgarrays, target_index);

    var changeadded_filearrays_copy = [...changeadded_filearrays];
    //  var serveruploadimgarrays_copy=[...serveruploadimgarrays];//인댁스위치에 위치 가져온다.
    var serveruploadimgarrays_copy = [...serveruploadimgs_server];//인댁스위치에 위치 가져온다.

    changeadded_filearrays_copy.splice(target_index, 1);//해당 위치요소 삭제
    serveruploadimgarrays_copy.splice(target_index, 1);

    console.log('삭제데이터', serveruploadimgarrays_copy);  //파일 데이터가 있어야함
    console.log('삭제데이터', changeadded_filearrays_copy);

    //파일 처리가 안됨 부분 
    // setfileimgs([...serveruploadimgarrays_copy])  //원본파일
    setServeruploadimgarrays([...serveruploadimgarrays_copy]); //원본파일

    // setServeruploadimgs_server([...changeadded_filearrays_copy]);
    changesetfileimgs([...changeadded_filearrays_copy])
    //파일 처리가 되어야 한다.
    setChangeadded_filearrays([...changeadded_filearrays_copy]);

    changesetfileimgs([...changeadded_filearrays_copy])

    //  setChangeaddedimgs_server([...changeadded_filearrays_copy]);
  }

  //초기화
  const resetbtn = () => {
    setServeruploadimgarrays([]);
    setServeruploadimgs_server([]);
    setChangeadded_filearrays([]);
    setChangeaddedimgs_server([]);
    setimgfiles([])
  }

  useEffect(() => {
    console.log('==>>>changedaddedfilearrays,serveruploadimgarrays변경::', changeadded_filearrays, serveruploadimgarrays);
  }, [changeadded_filearrays, serveruploadimgarrays]);


  return (
    <Container>
      <ModalMapPicture>
        <PictureTxt>
          <Color>사진은 최소 3장 이상 등록하세요.</Color><br />
          대표사진은 좌측상단 썸네일입니다.<br />
          마우스를 끌어서 사진 순서를 변경할 수 있습니다.
        </PictureTxt>
        {/*
              사진추가 관련 파일이벤트 발생시에 선택하여 업로드한 복수개n개의 사진리스트가 매번 다르게 하여 추가될수있게끔 처리한다.
              */}
        <PicList>
          {/* {editimgs == '' ? */}
              {/* <AddFile type="file" id="file" multiple='multiple' onChange={EditmaemulimgsChange} /> */}
            {/* <Li>
              <AddFile type="file" id="file" multiple='multiple' onChange={maemulimgsChange} />
              <AddFileLabel for="file">사진추가d</AddFileLabel>
            </Li> */}
            {/* : */}
            <Li>
              {/* <AddFile type="file" id="file" multiple='multiple' onChange={maemulimgsChange}/> */}
              <AddFile type="file" id="file" multiple='multiple' onChange={EditmaemulimgsChange} />
              <AddFileLabel for="file">사진추가</AddFileLabel>
            </Li>
          {/* } */}



          {/* {
                    changeadded_filearrays.map((value, index) => {
                      return (
                        <Li>
                          <PicImg src={value} />
                          <Delbtn src={Delete} onClick={() => { imgdelete(index); }} />
                        </Li>
                      )
                    })
                  } */}

          {
            // editimgs == '' ?
            //   changeadded_filearrays.map((value, index) => {
            //     {console.log('동작2')}
            //     return (
            //       <Li>
            //         <PicImg src={value} />
            //         <Delbtn src={Delete} onClick={() => { imgdelete(index); }} />
            //       </Li>
            //     )
            //   })
            //   :

              changeadded_filearrays.map((value, index) => {
                {console.log('동작1')}
                if (value.includes('base64')) {
                  return (
                    <Li>
                      {console.log('여기가 동작1')}
                      {/* <PicImg src={localStringData.imagePath + value} /> */}
                      <PicImg src={value} />
                      <Delbtn src={Delete} />
                    </Li>
                  )
                  
                } else {
                  
                  return (
                    <Li>
                      {/* {console.log('여기가 동작2')} */}
                      {/* {console.log('여기가 동작2',value)} */}
                      {console.log('여기가 동작2', localStringData.imagePath + value)}
                      {/* {console.log(value.includes('base64'))} */}
                      {/* <PicImg src={localStringData.imagePath + value} /> */}
                      <PicImg src={localStringData.imagePath + value} />
                      {/* <img src={localStringData.imagePath + value} /> */}
                      <Delbtn src={Delete} />
                    </Li>
                  )
                }
              })
          }


          {/* <button onClick={()=>insertbtn}>적용</button> */}
        </PicList>
      </ModalMapPicture>
      <div className="par-spacing">
        <MUButton_Validation variant="contained" type="button" name="" active={true} onClick={insertbtn} >적용</MUButton_Validation>
        <br />
        <MUButton_Validation variant="contained" type="button" name="" active={true} onClick={resetbtn} >초기화</MUButton_Validation>
      </div>
          {/* <button onClick={insertbtn}>적용</button>
          <br />
          <button onClick={resetbtn}>초기화</button> */}
    </Container>
  );
}


const MUButton = styled(Button)``

const MUButton_Validation = MUstyled(MUButton)`
        &.MuiButtonBase-root.MuiButton-root{
          background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
        color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
        box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"};
        width:100%;
  }
`

const Pb = styled.b`
  display:block;
  @media ${(props) => props.theme.mobile} {
        display:inline;
    }
`
const Mb = styled.b`
  display:inline;
  @media ${(props) => props.theme.mobile} {
        display:block;
    }
`
const Container = styled.div`
    width:100%;
`
const ModalMapPicture = styled.div`
  padding:16px 5px;
  @media ${(props) => props.theme.modal} {
    padding:calc(100vw*(13/428)) calc(100vw*(5/428));
  }
`
const PictureTxt = styled.p`
  font-size:15px;color:#4a4a4a;font-weight:800;
  transform:skew(-0.1deg);line-height:1.33;
  text-align:center;margin-bottom:17px;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(15/428));
    margin-bottom:calc(100vw*(15/428));
  }
`
const Color = styled.span`
font-size:15px;color:#01684B;font-weight:800;
transform:skew(-0.1deg);line-height:1.33;
@media ${(props) => props.theme.modal} {
  font-size:calc(100vw*(15/428));
}
`
const PicList = styled.ul`
  width:100%;
  display:flex;justify-content:flex-start;
  align-items:center;flex-wrap:wrap;
`
const Li = styled.li`
  width:74px;height:74px;border:1px solid #e4e4e4;
  margin-right:10px;margin-bottom:10px;
  border-radius:3px;  position:relative;
  &:nth-child(5n){margin-right:0;}
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(66/428));
    height:calc(100vw*(66/428));
    margin-right:calc(100vw*(5/428));
    margin-bottom:calc(100vw*(5/428));
  }
`
const AddFile = styled.input`
  display:none;
`
const AddFileLabel = styled.label`
  display:inline-block;cursor:pointer;
  width:100%;height:100%;
  background:url(${Picture}) no-repeat 20px 10px;background-size:35px;
  padding-top:45px;
  font-size:11px;color:#707070;transform:skew(-0.1deg);
  text-align:center;
  @media ${(props) => props.theme.modal} {
    background:url(${Picture}) no-repeat calc(100vw*(20/428)) calc(100vw*(10/428));background-size:calc(100vw*(31/428));
    padding-top:calc(100vw*(45/428));
    font-size:calc(100vw*(11/428));
  }
`
const PicImg = styled.img`
  display:inline-block;cursor:pointer;
  width:100%;heigiht:100%;
  border-radius:3px;
`
const Delbtn = styled.img`
  display:inline-block;cursor:pointer;
  width:20%;height:20%;position:absolute;right:0;top:0
`;
const NoneImg = styled.div`
  width:100%;height:100%;
`

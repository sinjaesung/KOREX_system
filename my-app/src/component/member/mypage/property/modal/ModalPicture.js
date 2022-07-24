//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components"

//material-ui
import Button from '@material-ui/core/Button';
import { styled as MUstyled } from '@material-ui/core/styles';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AddIcon from '@mui/icons-material/Add';

//img
import Picture from '../../../../../img/member/picture.png';
import Item from '../../../../../img/map/detail_img.png';
import Delete from '../../../../../img/main/modal_close.png';
import serverController from '../../../../../server/serverController';
import { useSelector } from 'react-redux';

import localStringData from '../../../../../const/localStringData';

//지도 모달
export default function ModalPicture({ setServeruploadimgs_server, setChangeaddedimgs_server, serveruploadimgs_server, changeaddedimgs_server, imgfiles, setimgfiles, prd_id, offModal, originalfiles, setoriginalfiles }) {

  const [changeadded_filearrays, setChangeadded_filearrays] = useState([]);//클라이언트단 업로드전 프리뷰형태의 파일스트림 표현 리스트/ 파일스트림으로 읽어져서 나오는 리스트.
  const [serveruploadimgarrays, setServeruploadimgarrays] = useState([]);//최종적 서버에 결정된 업로드 사진리스트 fileobject개체.

  const [fileimgs, setfileimgs] = useState([])
  const [changefileimgs, changesetfileimgs] = useState([])

  const [Newfileimgs, setNewfileimgs] = useState([])


  useEffect(async () => {
    //수정의 경우 prd-id , 이미지 데이터가 있다.
    if (!!prd_id) {

      let res = await serverController.connectFetchController(`/api/products/${prd_id}?prd_field_all=1 `, 'get');

      if (!!res.data.prd_imgs) {

        console.log('사진나오기2', res.data.prd_imgs.split(','));

        setChangeadded_filearrays([...imgfiles, ...res.data.prd_imgs.split(',')])

        // setChangeaddedimgs_server([...res.data.prd_imgs.split(',')])

      } else {
        //사진이 없을때
        //그럴 경우가 없어야 한다.
      }

    } else {
      //물건 등록일 경우 prd_id , 이미지 없다.
      setChangeadded_filearrays([...imgfiles])

    }

  }, [])

  //적용 버튼
  const insertbtn = () => {
    console.log('데이터 있다22', changeadded_filearrays); //변형 파일주소 추가 후 갯수
    console.log('데이터 있다22', imgfiles);
    console.log('데이터 있다22', Newfileimgs); //추가한 새 이미지 주소 형태
    console.log('데이터 있다22', [...changeadded_filearrays, ...imgfiles, ...Newfileimgs]); //추가한 새 이미지 파일형태

    console.log('데이터 있다22', fileimgs); //추가한 새 이미지 파일형태
    console.log('데이터 있다22', serveruploadimgs_server); //추가한 새 이미지 파일형태
    console.log('데이터 있다22', [...serveruploadimgs_server, ...fileimgs]); //추가한 새 이미지 파일형태

    // setServeruploadimgs_server([...serveruploadimgs_server,...fileimgs]) //페이지로 넘김 // 원본파일
    setimgfiles([...imgfiles, ...Newfileimgs])


    // setChangeaddedimgs_server([...changeadded_filearrays,...imgfiles, ...Newfileimgs]) // 페이지에서 보이는 이미지들 리스트
    setChangeaddedimgs_server([...changeadded_filearrays]) // 페이지에서 보이는 이미지들 리스트

    setServeruploadimgs_server([...serveruploadimgs_server, ...fileimgs])



    setNewfileimgs([])
    offModal()
  }


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

    setfileimgs([...fileimgs, ...theFiles]);//선택 파일 객체 임시 저장
    // setfileimgs([...fileimgs, ...theFiles]);//선택 파일 객체 임시 저장

    // setoriginalfiles([...originalfiles, ...theFiles])

    var imgdata_array = [];
    for (let j = 0; j < theFiles.length; j++) {
      let item = theFiles[j];
      // console.log('이미지 파일 확인:', item);

      try {
        const filecontents = await readuploadedfile(item);

        //선택 이미지 모달창,메인 페이지 보여주가
        imgdata_array.push(filecontents);//흠 동기로 처리 await되기에 실행흐름순서대로 처리가능하다.
      } catch (e) {
        // console.log('이미지 파일 확인:', e.message);
      }
    }

    // setChangeadded_filearrays([...changeadded_filearrays, ...imgdata_array])  
    setChangeadded_filearrays([...changeadded_filearrays, ...imgdata_array])



    setNewfileimgs(imgdata_array)

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
    // setServeruploadimgs_server([...changeadded_filearrays_copy]);

    setChangeadded_filearrays([...changeadded_filearrays_copy]);

    setimgfiles([...changeadded_filearrays_copy])


    setServeruploadimgarrays([...serveruploadimgarrays_copy]); //원본파일
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


  return (
    <>
      <div>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="file"
          multiple
          type="file"
          onChange={EditmaemulimgsChange}
        />
        <label htmlFor="file">
          <MUButton startIcon={<AddIcon />} disableElevation variant="contained" component="span" >사진 추가</MUButton>
        </label>

        <div className="par-spacing">
          <p>사진은 최소 3장 이상 등록하세요. 등록사진 중 좌측 상단이 대표사진입니다. 마우스를 끌어서 사진 순서를 변경할 수 있습니다.</p>
        </div>
        {/*
              사진추가 관련 파일이벤트 발생시에 선택하여 업로드한 복수개n개의 사진리스트가 매번 다르게 하여 추가될수있게끔 처리한다.
              */}
        <ul className="flex-left-center fwrap">
          {/* <Li>
            <AddFile type="file" id="file" multiple='multiple' onChange={EditmaemulimgsChange} />
            <AddFileLabel for="file">사진추가</AddFileLabel>
          </Li> */}
          {
            changeadded_filearrays.map((value, index) => {
              { console.log('동작1') }
              if (value.includes('base64')) {
                return (
                  <Li>
                    {console.log('여기가 동작1')}
                    <PicImg src={value} />
                    <Delbtn src={Delete} onClick={() => { imgdelete(index); }} />
                  </Li>
                )

              } else {

                return (
                  <Li>
                    <PicImg src={localStringData.imagePath + value} />
                    <Delbtn src={Delete} onClick={() => { imgdelete(index); }} />
                  </Li>
                )
              }
            })
          }

        </ul>
      </div>
      <div className="mt-2 par-spacing tAlign-r">
        <MUButton variant="contained" onClick={insertbtn} disableElevation>적용</MUButton>
        &nbsp;&nbsp;
        <MUButton variant="text" onClick={resetbtn} >초기화</MUButton>
      </div>
      {/* <button onClick={insertbtn}>적용</button>
          <br />
          <button onClick={resetbtn}>초기화</button> */}
    </>
  );
}


const MUButton = styled(Button)``

const MUButton_Validation = MUstyled(MUButton)`
        &.MuiButtonBase-root.MuiButton-root{
          background:${({ active, theme }) => active ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)"};
        color:${({ active, theme }) => active ? theme.palette.primary.contrastText : "rgba(0, 0, 0, 0.26)"};
        box-shadow:${({ active, theme }) => active ? theme.palette.shadows : "none"};
  }
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
  width:20%;height:20%;position:absolute;right:0;top:0;
`

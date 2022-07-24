//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";


//css
import styled from "styled-components"

//img
import Picture from '../../../../../img/member/picture.png';
import Item from '../../../../../img/map/detail_img.png';
import Delete from '../../../../../img/main/modal_close.png';


//지도 모달
export default function ModalPicture({ setServeruploadimgs_server, setChangeaddedimgs_server }) {
  console.log('사진업로드 모달창 실행>>>:');

  //사진관련 처리.
  const [changeadded_filearrays, setChangeadded_filearrays] = useState([]);//클라이언트단 업로드전 프리뷰형태의 파일스트림 표현 리스트/ 파일스트림으로 읽어져서 나오는 리스트.
  const [serveruploadimgarrays, setServeruploadimgarrays] = useState([]);//최종적 서버에 결정된 업로드 사진리스트 fileobject개체.

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
  //파일 이미지 관련 처리 클라이언트단 관련 액션처리
  const maemulimgsChange = async (e) => {
    console.log('file upload onchanges evernt startss=============>>');
    const {
      target: { files }
    } = e;
    const theFiles = files;
    console.log('외부수임물건 등록페이지에서 사진 등록시에 뜨는 사진업로드 모달창관련 처리:', theFiles);

    setServeruploadimgarrays(theFiles);//업로드하기로 된 파일객체 object araryss>>
    setServeruploadimgs_server(theFiles);

    var imgdata_array = [];
    for (let j = 0; j < theFiles.length; j++) {
      let item = theFiles[j];
      console.log('file itemss:', item);

      try {
        const filecontents = await readuploadedfile(item);
        console.log('filecontetnsss:', filecontents);

        imgdata_array.push(filecontents);//흠 동기로 처리 await되기에 실행흐름순서대로 처리가능하다.
      } catch (e) {
        console.log('file read await serrreors:', e.message);
      }
    }
    console.log('>>>>upldoaed files contentss:', imgdata_array);
    setChangeadded_filearrays(imgdata_array);
    setChangeaddedimgs_server(imgdata_array);
  }

  const imgdelete = async (target_index) => {
    console.log('이미지 삭제 현재 inserte되어있는 이미지 배열현황:', changeadded_filearrays, serveruploadimgarrays, target_index);

    var changeadded_filearrays_copy = [...changeadded_filearrays];
    var serveruploadimgarrays_copy = [...serveruploadimgarrays];//인댁스위치에 위치 가져온다.

    changeadded_filearrays_copy.splice(target_index, 1);//해당 위치요소 삭제
    serveruploadimgarrays_copy.splice(target_index, 1);

    setServeruploadimgarrays(serveruploadimgarrays_copy);
    setChangeadded_filearrays(changeadded_filearrays_copy);
    setServeruploadimgs_server(serveruploadimgarrays_copy);
    setChangeaddedimgs_server(changeadded_filearrays_copy);
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
          <Li>
            <AddFile type="file" id="file" multiple='multiple' onChange={maemulimgsChange} />
            <AddFileLabel for="file">사진추가</AddFileLabel>
          </Li>
          {/*
                <Li>
                  <PicImg src={Item}/>
                </Li>
                <Li>
                  <PicImg src={Item}/>
                </Li>
                <Li>
                  <PicImg src={Item}/>
                </Li>
                <Li>
                  <NoneImg/>
                </Li>
                <Li>
                  <NoneImg/>
                </Li>
                <Li>
                  <NoneImg/>
                </Li>
                <Li>
                  <NoneImg/>
                </Li>
                <Li>
                  <NoneImg/>
                </Li>
                <Li>
                  <NoneImg/>
                </Li>
              */}
          {
            changeadded_filearrays.map((value, index) => {
              return (
                <Li>
                  <PicImg src={value} />
                  <Delbtn src={Delete} onClick={() => { imgdelete(index); }} />
                </Li>
              )
            })
          }
        </PicList>
      </ModalMapPicture>
    </Container>
  );
}

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
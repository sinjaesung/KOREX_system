//react
import React ,{useState, useEffect} from 'react';
import {Link} from "react-router-dom";


//css
import styled from "styled-components"

//img
import Change from '../../../../../img/member/change.png';
import Marker from '../../../../../img/member/marker.png';

// map
import KakaoMapSide from '../../../../map/map/KakaoMapSide';

//지도 모달
export default function ModalMapReserve({ map, setMap , addr_jibun,addr_road,prd_longitude,prd_latitude }) {
  if(map == false)
    return null;
    return (
        <Container>
          <WrapModalMap>
              <ModalMapAddress>
                <AddressTxt>{addr_road}</AddressTxt>
                <ChangeAddress>
                  <div className="cursor-p">
                    <ChangeImg src={Change}/>
                    <ChangeTxt>도로명</ChangeTxt>
                  </div>
                </ChangeAddress>
              </ModalMapAddress>
              <ShowMap>
                <KakaoMapSide cutomImg={Marker} centerLat={prd_latitude} centerLng={prd_longitude} markerLat={prd_latitude} markerLng={prd_longitude}/>
              </ShowMap>
          </WrapModalMap>
        </Container>
  );
}

const Pb = styled.b`
  display:block;
  @media ${(props) => props.theme.modal} {
        display:inline;
    }
`
const Mb = styled.b`
  display:inline;
  @media ${(props) => props.theme.modal} {
        display:block;
    }
`
const Container = styled.div`
    width:100%;
`

const WrapModalMap = styled.div`
  width:100%;
`
const ModalMapBg = styled.div`
  width:100%;height:100%;
  position:fixed;left:0;top:0;
  background:rgba(0,0,0,0.2);
  display:block;content:'';
  z-index:3;
`
const ModalMap = styled.div`
  position:fixed;
  left:50%;top:50%;transform:translate(-50%,-50%);
  width:535px;border-radius:24px;
  border:1px solid #f2f2f2;
  background:#fff;
  padding:49px 50px 60px 50px;
  z-index:3;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(395/428));
    height:calc(100vw*(458/428));
    padding:calc(100vw*(33/428)) calc(100vw*(15/428));
  }
`

const ModalMapAddress = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  padding:16px 5px;
  @media ${(props) => props.theme.modal} {
    padding:calc(100vw*(13/428)) calc(100vw*(5/428));
  }
`
const AddressTxt = styled.p`
  font-size:15px;color:#4a4a4a;font-weight:800;
  transform:skew(-0.1deg);
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(13/428));
  }
`
const ChangeAddress = styled.div`

`
const ChangeImg = styled.img`
  display:inline-block;
  width:15px;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(13/428));
  }
`
const ChangeTxt = styled.p`
  display:inline-block;
  font-size:10px;font-weight:800;
  transform:skew(-0.1deg);color:#979797;
  margin-left:8px;
  margin-top:2px;
  @media ${(props) => props.theme.modal} {
    font-size:calc(100vw*(10/428));
    margin-left:calc(100vw*(8/428));
    margin-top:calc(100vw*(2/428));
  }
`
const ShowMap = styled.div`
  width:100%;height:240px;
  position:relative;
  @media ${(props) => props.theme.modal} {
    height:calc(100vw*(240/428));
  }
`
const InMapBox = styled.div`
  width:100%;height:100%;
  background:#eee;
`
const MapMarker = styled.div`
  position:absolute;
  width:50px;height:66px;
  left:60%;
  bottom:20px;
  @media ${(props) => props.theme.modal} {
    width:calc(100vw*(50/428));
    height:auto;
    left:60%;
    bottom:calc(100vw*(20/428));
  }
`
const MapMarkerImg = styled.img`
  display:inline-block;width:100%;height:100%;
`

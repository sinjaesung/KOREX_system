
//범용 주소 검색 api입니다.

//react
import React ,{useState, useEffect} from 'react';
import DaumPostcode from 'react-daum-postcode';

export default function addressSearchApi({setSearch_address,setAddressApi,setAddressroad,setAddressjibun,setAddressdetail}) {

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';
    console.log('다음지도 api data type::',data);

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      }
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }

    console.log(fullAddress);  // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'

    var match_sido_info={
      '서울' : '서울특별시',
      '부산' : '부산광역시',
      '인천' : '인천광역시',
      '광주' : '광주광역시',
      '대전' : '대전광역시',
      '울산' : '울산광역시',
      '세종특별자치시' : '세종특별자치시',
      '경기' : '경기도',
      '강원' : '강원도',
      '충북' : '충청북도',
      '충남' : '충청남도',
     '전북' : '전라북도',
     '전남' : '전라남도',
     '경북' : '경상북도',
     '경남' : '경상남도',
     '제주특별자치도' : '제주특별자치도'
    }
    let sido=data.sido;
    let jibunaddress=data.jibunAddress.replace(sido,match_sido_info[sido]);//sido기존 문자열 시도 매치 변환문자열로 정리.
    let roadaddress=data.roadAddress.replace(sido,match_sido_info[sido]);
    let query = data.query;
    setSearch_address({query_val:query, fulladdress_val:fullAddress,sido_val:data.sido,sigungu_val:data.sigungu,jibunaddress_val:jibunaddress,roadaddress_val:roadaddress});
    setAddressApi(false);
    setAddressroad(roadaddress);
    setAddressjibun(jibunaddress);
    setAddressdetail(fullAddress);
  }

    return (
        <div>
          <DaumPostcode
            onComplete={handleComplete}
          />
        </div>
  );
}

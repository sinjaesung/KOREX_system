
//★★★★상가, 사무실 중개의뢰 입니다★★★★
//오피스텔 주소검색용.
//react
import React ,{useState, useEffect} from 'react';
import DaumPostcode from 'react-daum-postcode';

//server request
import serverController from '../../../../server/serverController';

export default function SearchStoreOfficeApi({setofficetel_addr_road,setAddressApi2}) {

  const handleComplete = async (data) => {
    console.log('===>>>data resultss search data resudlt::',data);
    let fullAddress = data.address;
    let extraAddress = '';
    let sido=data.sido;//api 시도리턴값
    let replace_sido=null;

    let sigunguCode=data.sigunguCode;
    let sidoCode=sigunguCode.substr(0,2);

    let addr_info={
      sidoCode : sidoCode
    }

    let addr_units_result=await serverController.connectFetchController('/api/matterial/addrunits_replace_search','POST',JSON.stringify(addr_info));
    if(addr_units_result){
      console.log('addr units reulsstss:',addr_units_result);
      if(addr_units_result.success){
        replace_sido = addr_units_result.result['name'];
      }else{

      }
    }
    console.log('relace sido sss:',replace_sido);

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

    if(replace_sido){
      let roadaddress=data.roadAddress;
      roadaddress=roadaddress.replace(sido,replace_sido);
      setofficetel_addr_road(roadaddress);
    }else{
      setofficetel_addr_road(data.roadAddress);
    }
    setAddressApi2(false);
  }

    return (
        <div>
          <DaumPostcode
            onComplete={handleComplete}
          />
        </div>
  );
}

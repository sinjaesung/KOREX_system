
//★★★★상가, 사무실 중개의뢰 입니다★★★★
//아파트 검색용.
//react
import React ,{useState, useEffect} from 'react';
import DaumPostcode from 'react-daum-postcode';

//server request
import serverController from '../../../../server/serverController';

export default function SearchStoreOfficeApi({setapart_addr_road,setaptname,setAddressApi}) {

  const handleComplete = async (data) => {
    console.log('==>>dataresultss serach data results:',data);
    let fullAddress = data.address;
    let extraAddress = '';
    let sido=data.sido;//시도값 가져온다.
    let replace_sido=null;

    let sigunguCode=data.sigunguCode;//시군구 코드값. 앞자리 두개가 시도코드
    let sidoCode=sigunguCode.substr(0,2)
    
    let addr_info={
      sidoCode : sidoCode
    }

    let addr_units_result=await serverController.connectFetchController('/api/matterial/addrunits_replace_search','POST',JSON.stringify(addr_info));
    if(addr_units_result){
      console.log('addrunits reulsttss:',addr_units_result);
      if(addr_units_result.success){
        replace_sido=addr_units_result.result['name'];//뭐뭐 시도, 서울특별시,충청남도, 경기도
      }else{
        //검색결과가없거나 오류있으면 기본값api 시도값으로 그대로 사용.
      }
    }
    console.log('what repalce sido valuess:',replace_sido);
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
      setapart_addr_road(roadaddress);//도로명주소가 나왔으면 그 시도명을 뭔가 addr_nuits에서 검색하여 적절한형태포맷으로 replace필요하다고 함 
    }else{
      setapart_addr_road(data.roadAddress);//기본 나오는값대로 사용.
    }
    
    setaptname(data.buildingName);//빌딩이름 건물이름(아파트 케이스의경우)

    setAddressApi(false);
  }

    return (
        <div>
          <DaumPostcode
            onComplete={handleComplete}
          />
        </div>
  );
}

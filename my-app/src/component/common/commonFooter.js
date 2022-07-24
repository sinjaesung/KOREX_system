//react
import React ,{useState, useEffect} from 'react';

import TermService from './TermsOfService';
import TermPrivacy from './TermsOfPrivacy';
import TermLocation from './TermsOfLocation';
import MainFooter from './MainFooter';

const CommonFooter = (props) => {


    const [termservice, setTermService] = useState(false);
    const openTermService = (onOff) =>{ setTermService(onOff);}
  
    //개인정보처리방침
    const [termprivacy, setTermPrivacy] = useState(false);
    const openTermPrivacy = (onOff) =>{ setTermPrivacy(onOff);}
  
    //위치기반서비스 이용약관
    const [termlocation, setTermLocation] = useState(false);
    const openTermLocation = (onOff) =>{ setTermLocation(onOff);}


    return(
        <>
          <TermService termservice={termservice} openTermService={openTermService}/>
          <TermPrivacy termprivacy={termprivacy} openTermPrivacy={openTermPrivacy}/>
          <TermLocation termlocation={termlocation} openTermLocation={openTermLocation}/>
          <MainFooter openTermService={openTermService} openTermPrivacy={openTermPrivacy} openTermLocation={openTermLocation}/>
        </>
    )
};

export default CommonFooter;
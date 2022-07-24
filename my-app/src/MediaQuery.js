import React from "react"
import { useMediaQuery } from "react-responsive"

const Mobile :React.FC = ({children}) => {
const isMobile = useMediaQuery({
  query : "(max-width:900px)"
});
return <React.Fragment>{isMobile && children}</React.Fragment>
}

const PC :React.FC = ({children}) => {
const isPc = useMediaQuery({
  query : "(min-width:901px)"
});
return <React.Fragment>{isPc && children}</React.Fragment>
}


const SM_smaller :React.FC = ({children}) => {
  const isSM_smaller = useMediaQuery({
    query : "(max-width:550px)"
  });
  return <React.Fragment>{isSM_smaller && children}</React.Fragment>
  }
  
const SM_larger :React.FC = ({children}) => {
  const isSM_larger = useMediaQuery({
    query : "(min-width:551px)"
  });
  return <React.Fragment>{isSM_larger && children}</React.Fragment>
  }

  const Landscape :React.FC = ({children}) => {
    const isLandscape = useMediaQuery({
      query : "(orientation:landscape)"
    });
    return <React.Fragment>{isLandscape && children}</React.Fragment>
    }
    
  const Portrait :React.FC = ({children}) => {
    const isPortrait = useMediaQuery({
      query : "(orientation:portrait)"
    });
    return <React.Fragment>{isPortrait && children}</React.Fragment>
    }
  

export  {Mobile,PC,SM_smaller,SM_larger,Landscape,Portrait};

import { css } from 'styled-components';

const size = {
  desktop: "1920px",
  tablet: "1700px",
  container: "1436px",
  mobile: "1024px",
  modal: "600px",

  lg: "1200px",
  md: "900px",
  sm: "550px",
}

const Layout = {
  Offset: {
    type1: { xl: '45px', }
  },
  MainHeader: {
    height: { xl: '3.7rem', }
  },
  MainMapFilter_Tab: {
    height: { xl: '3.125rem', }
  },
  MainMapSidePanel_Tap: {
    height: { xl: '3.125rem', }
  },
  MainMapSidePanel_FilterList: {
    height: { xl: '2.5rem', }
  },
}

export default function theme() {
  return {
    desktop: `(max-width: ${size.desktop})`,
    tablet: `(max-width: ${size.tablet})`,
    container: `(max-width: ${size.container})`,
    mobile: `(max-width: ${size.mobile})`,
    modal: `(max-width: ${size.modal})`,

    breakpoints: {
      lg: `(max-width: ${size.lg})`,
      md: `(max-width: ${size.md})`,
      sm: `(max-width: ${size.sm})`,
    },

    typography: {
      fontSize: { sm: '0.75rem' }
    },

    palette: {
      primary: { main: '#01684b' },
      secondary: { main: '#fe7a01' },
      mono: { main: '#f8f7f7' },
      line: { main: '#dadce0' },
    },
  }
}

export const TtCon_Frame_A = css`
    width:50%;
    margin: 0 auto;
    @media (max-width:1200px) {width:60%;}
    @media (max-width: 900px) {width:70%;}
    @media (max-width: 550px) {width:80%;}
`
export const TtCon_Frame_A2 = css`
    width:70%;
    margin: 0 auto;
    @media (max-width:1200px) {}
    @media (max-width: 900px) {}
    @media (max-width: 550px) {width:80%;}
`
export const TtCon_Frame_Portrait_A = css`
    margin: 0 auto;
    @media (max-width:1200px) and (orientation:portrait) {width:50%;}
    @media (max-width: 900px) and (orientation:portrait) {width:60%;}
    @media (max-width: 550px) and (orientation:portrait) {width:95%;}
`

export const TtCon_Frame_H = css`
    width:80%;
    padding:0.625rem 0 0.625rem;
    margin:0 auto;
    @media (max-width:1200px) {}
    @media (max-width: 900px) {width:90%; padding:0.5rem 0 0.5rem;}
    @media (max-width: 550px) {width:95%; padding:0.3rem 0 0.3rem;}
`;

export const TtCon_Frame_SubH = css`
    width:680px;
    padding:20px 0 10px;
    margin:0 auto;
    @media (max-width:1200px) {}
    @media (max-width: 900px) {width:85%;}
    @media (max-width: 550px) {width:100%;}
`;

export const TtCon_Frame_B = css`
    width:650px;
    padding:20px 0 10px;
    margin:0 auto;
    @media (max-width:1200px) {}
    @media (max-width: 900px) {width:80%;}
    @media (max-width: 550px) {width:95%;}
`;

export const TtCon_Frame_MainB = css`
    width:450px;
    margin:0 auto;
    @media (max-width: 450px) {width:95%;}
`

export const TtCon_Frame_By = css`
    width:650px;
    padding:20px 0 10px;
    margin:0 auto;
    @media (max-width:1200px) {}
    @media (max-width: 900px) {width:75%;}
    @media (max-width: 550px) {width:100%;}
`;

export const TtCon_Frame_F = css`
    width:50%;
    margin:0 auto;
    @media (max-width:1200px) {width:60%;}
    @media (max-width: 900px) {width:80%;}
    @media (max-width: 550px) {width:95%;}
`;

export const TtCon_Title = css`
    font-size:1.4rem;
    @media (max-width:1200px) {}
    @media (max-width: 900px) {font-size:1.3rem;}
    @media (max-width: 550px) {font-size:1.2rem;}
`;

//----------------------------------------
export const TtHeader_Pos = css`
    height: ${Layout.MainHeader.height.xl};
`
export const TtBody_Map_Pos = css`
    height: calc(100% - ${Layout.MainHeader.height.xl});
`
export const TtCon_MainMapFilter = css`
width:21%;
max-width:330px;
position:absolute;left:0;top:0;
left:0.5rem;top:0.5rem;

    @media (max-width:1200px) and (orientation:landscape) {width:23%;}
    @media (max-width: 900px) and (orientation:landscape) {width:24%;}
    @media (orientation:portrait) {
      width:100vw;
      max-width:none;
      top:0; left:0;
      border-radius:0;
    }
`
export const TtCon_MainMapFilter_TapPos = css`
  height: ${Layout.MainMapFilter_Tab.height.xl};
`
export const TtCon_MainMapFilter_ArticlePos = css`
  max-height: 75vh;
  @media (orientation:portrait) {
    max-height:calc(50vh - calc(${Layout.MainHeader.height.xl} + ${Layout.MainMapFilter_Tab.height.xl} + ${Layout.Offset.type1.xl}));
    }
`
export const TtCon_MainMapToolBox_pos = css`
  position:absolute;
  top:0.7rem;
  transition: top 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  @media (orientation:portrait) {
    ${({ isFilter }) => {
    return isFilter ?
      `top:calc(${Layout.MainMapFilter_Tab.height.xl} + ${Layout.Offset.type1.xl} + 0.7rem);`
      :
      ``
   }}
   @media (max-width: 550px) {
    ${({ isFilter }) => {
    return isFilter ?
      `top:calc(${Layout.MainMapFilter_Tab.height.xl} + ${Layout.Offset.type1.xl} + 0.5rem);`
      :
      `top:0.5rem;`
    }}
   }   
  }  
`

export const TtCon_MainMapSidePanel_Pos = css`
float:right;
width:22%;
height:100%;
max-width:400px;
/* position:absolute;right:0;top:0; */
    @media (max-width:1200px) and (orientation:landscape) {width:24%;}
    @media (max-width: 900px) and (orientation:landscape) {width:25%;}
    @media (orientation:portrait) {
      width:100vw;
      max-width:none;
      position: fixed;bottom:0;top: unset;
      transition: height 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
      ${({ updown }) => {
    return updown ?
      `height:calc(100% - calc(${Layout.MainHeader.height.xl} + ${Layout.MainMapFilter_Tab.height.xl} + ${Layout.Offset.type1.xl}));`
      :
      `height:${Layout.MainMapSidePanel_Tap.height.xl}; overflow:auto;`
  }}
    }
`
export const TtCon_MainMapSidePanel_ModalPos = css`
    @media (orientation:portrait) {
      height:calc(100% - calc(${Layout.MainHeader.height.xl} + ${Layout.MainMapFilter_Tab.height.xl} + ${Layout.Offset.type1.xl}));
    }
`

export const TtCon_MainMapSidePanel_TapPos = css`
  height: ${Layout.MainMapSidePanel_Tap.height.xl};
`
export const TtCon_MainMapSidePanel_FilterListPos = css`
  height: ${Layout.MainMapSidePanel_FilterList.height.xl};
`
export const TtCon_MainMapSidePanel_ArticlePos = css`
  height: calc(100% - calc(${Layout.MainMapSidePanel_Tap.height.xl} + ${Layout.MainMapSidePanel_FilterList.height.xl}) );
`
export const TtCon_MainMapSidePanel_ArticlePos_NoFilterList = css`
  height: calc(100% - calc(${Layout.MainMapSidePanel_Tap.height.xl}));
`

//-----------------------------------------------------

export const TtCon_MainMapBoard = css`
overflow: hidden;
height:100%;
position:relative;
    @media (orientation:portrait) {
      width:100vw;
    }
`
export const TtCon_TopSect = css`
  border-bottom:1px solid #dadce0;
`;

export const TtCon_BottomSect = css`
  border-bottom:1px solid #dadce0;
`;

export const TtCon_1col = css`
    width:95%;
    margin:0 auto;
    @media (max-width:1200px) {}
    @media (max-width: 900px) {}
    @media (max-width: 550px) {width:95%;}
`

export const TtCon_1col_input = css`
    /* display:flex;
    flex-direction:column; */
    width:60%;
    margin:0 auto;
    @media (max-width:1200px) {}
    @media (max-width: 900px) {width:65%;}
    @media (max-width: 550px) {width:95%;}
`;


export const TtCon_1col_input_2 = css`
    display:flex;
    flex-direction:column;
    width:50%;
    margin:0 auto;
    @media (max-width:1200px) {}
    @media (max-width: 900px) {width:65%;}
    @media (max-width: 550px) {width:85%;}
`;

export const TtBox_1 = css`
    padding: 0.375rem;
`
export const TtCon_Sub = css`
  width:90%;
  margin-left: auto;
`

import {keyframes} from "styled-components"


const opacityAni = keyframes`
  0%{
    margin-top:50px;
    opacity: 0;
  }
  100%{
    margin-top:0px;
    opacity: 1;
  }
`
function retunAnimation(aniDelay){
    return(
        `
        opacity: 0;
        animation-delay:${aniDelay}ms;
        animation-duration: 800ms;
        animation-fill-mode: forwards;
        `
    )
}
function animationDelay(index){
    if(index > 7){
        return(0)
    }
    return(100*index+1)
}

export {opacityAni, retunAnimation, animationDelay}
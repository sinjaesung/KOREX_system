

//react
import React ,{useState, useEffect} from 'react';


//css
import styled from "styled-components"

const CommonTopInfo = ({length, leftComponent}) => {

    return(
        <div className="flex-spabetween-center">
            <span>총 {length} 건</span>
            {leftComponent}
        </div>
    )
};

export default CommonTopInfo;
// React
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

// Img
import ChangeM from "../../../img/map/change_m.png";

// Css
import styled from "styled-components"

const ListEL = ({ title, desc, descM, ChangeM, isVal }) => {

  const [isDesc, setIsDesc] = useState(true);
  console.log('손주락____333', title);
  console.log('손주락____333', desc);

  return (
    <>
          <Li className="flex-spabetween-center fwrap">
            <p className="list-tag">{title}</p>
            <div className="capt-a1 flex-left-center">
              {isDesc ? desc : descM}
              {
                ChangeM &&
                <Link>
                  <ChangeMImg onClick={() => setIsDesc(!isDesc)} src={ChangeM} />
                </Link>
              }
            </div>
          </Li>
    </>
  )
};

export default ListEL;

const Li = styled.li`
  border-bottom:1px solid #f2f2f2;
  &:last-child{border-bottom:none;}
`
const SubTitle = styled.p`
  font-size:0.875rem;
`
const SubDesc = styled(SubTitle)`
`
const ChangeMImg = styled.img`
  width:20px;margin-left:10px;
  /* @media ${(props) => props.theme.mobile} {
    width:calc(100vw*(20/428));
    margin-left:calc(100vw*(10/428));
  } */
`
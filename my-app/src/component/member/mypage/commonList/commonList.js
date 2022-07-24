

//react
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

//css
import styled from "styled-components";

//material-ui
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemButton from '@material-ui/core/ListItemButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

//img
import RightArrow from '../../../../img/notice/right_arrow.png';

const CommonList = ({ array }) => {

  if (!array) { return (<></>) }

  return (
    <>
      {
        array.map((item, index) => {
          return (
            <MUListItem disablePadding>
              <MUListItemButton >
                <Link to={`/${item.link}`} className="data_link"></Link>
                {
                  item.cat ?
                    <div className="mr-0p5">
                      <Chip label={item.cat} variant="outlined" color={item.cat === '수요' ? "secondary" : "primary"} />
                    </div>
                    :
                    null
                }
                <MUListItemTxt primary={item.relate ? `[${item.relate}]__${item.title}` : item.title} />
                <ChevronRightIcon />
              </MUListItemButton>
            </MUListItem>

            // <Li key={index}>
            //   <Link to={`/${item.link}`} className="data_link"></Link>
            //   <LinkTxt>{item.title}</LinkTxt>
            //   <Arrow src={RightArrow}/>
            // </Li>
          )
        })
      }
    </>
  )
};

export default CommonList;

const MUListItem = styled(ListItem)``
const MUListItemButton = styled(ListItemButton)``
const MUListItemTxt = styled(ListItemText)``
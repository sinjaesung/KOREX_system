//react
import React from 'react';

//css
import styled from "styled-components"

export default function TextBox() {
    return (
        <Container>
            <Wrapper>
                <TestBox>어ㅏ어ㅏ어아ㅓ아</TestBox>
            </Wrapper>
        </Container>
    )

}

const Container = styled.div`
`

const Wrapper = styled.div`
position:absolute;
top:1rem;
left:1rem;
background-color: yellow;
`

const TestBox = styled.div`
width:100px;
height:100px;
`
//react
import React, { useEffect, useState } from 'react';

//css
import styled from 'styled-components';

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';

//redux
import serverController from '../../../server/serverController';

//!!@@ 1.에러---지도에서 전속매물리스트(ItemTab)의 좋아요 클릭 후, 지도 드래그 시, 매물정보 갱신되면 [좋아요_토글값]도 연동되어야 하는데, 그렇지 못함.  
//!!@@ 2.에러---좋아요 컴포넌트화 이후, 지도에서 전속매물리스트(ItemTab)에서 전속매물상세(SideBarItemDetail)로 전환시 isLike값이 오염되어, [좋아요_토글값] 에러남. 

import { exculsivesidebarmodal } from '../../../store/actionCreators';

import {useSelector} from 'react-redux';

export default function LikeCheckBtn({ mode, user, item, setListData, readOnly, setUnStlye, disable, refer_action,setexculsivesidebarlist}) {

    console.log('==>>>refer_actionsss:',refer_action);
    console.log('item_________1111', item,mode);
    //const haveIsLike = 'isLike' in item;
    //console.log('haveIsLike_________1111', haveIsLike);
    console.log('item.isLike_________1111', item.isLike);
    const [active, setActive] = useState(item.isLike);
    console.log('item.isLike_________2222', item.isLike);
    //console.log('active_________2222', active);
   // if (haveIsLike) item.isLike = active;
 
   const exculsiveSidebarmodal = useSelector(data=>data.exculsiveSidebarmodal);
   const Sidebarmodal = useSelector(data=>data.Sidebarmodal);//사이드바 모달이 열려있나 여부 열려있는상태에서/아닌 상태에서 여부구분.
    console.log('exculsivesSidebar modalsss:',exculsiveSidebarmodal,Sidebarmodal);


    async function updateList() {
        if (mode == 'ItemTabList') {
            let result = await serverController.connectFetchController(
                `/api/product/like?mem_id=${user.memid}`
                , "GET"
                , null
            );
            if (result.success == 1) setListData && setListData(result.data);
            console.log(result);
        }

        if (mode == 'BunyangTabList') {
            let result = await serverController.connectFetchController(
                ` /api/bunyang/like?mem_id=${user.memid}`
                , "GET"
                , null
            );
            if (result.success == 1) setListData && setListData(result.data);
            console.log(result);
        }
    }


    const LikeBtnEvent = (e) => {
        if (!user.memid) {
            window.location.href = "/MemberLogin";
            return;
        }
        const data = {
            mem_id: user.memid ? user.memid : 0,
            prd_id: item.prd_id ? item.prd_id : 0,
            bp_id: item.bp_id ? item.bp_id : 0,
            likes_type: 0,
        }
        serverController.connectFetchController("/api/likes/item", 'POST', JSON.stringify(data), function (res) {
           /*!!@@ 3.수정.보완 요청--- 원래 내 관심> [좋아요]버튼의 토글 스타일은 updateList기능과 무관하기 때문에,
           주석처리된 식처럼 작성되어야 하는데, 이렇게 작성하면 토글 스타일과 updateList가 매칭되지 않음.*/   
            
            updateList();

            if(refer_action=='mypage_like'){
                console.log('==>>mypage like마이페이지에서 접근한경우에는 취소처리하지 않습니다.');
                return;
            }else if(Sidebarmodal.openstatus && refer_action!='mypage_like'){
                setActive(e => !e);
                // if(!haveIsLike) updateList();   
                //haveIsLike ? setActive(e => !e) : updateList();
                console.log('likes actions aftersss:',res);
                //마이페이지 내관심에서 유입하지 않은경우이면서 사이드바모달 열린상태인경우에만 리덕스관련 처리.
                console.log('sidebarmodal open상태일때만 관련 처리!!!>>>:',item.prd_id);

                let target_list= [...exculsiveSidebarmodal.exculsive?exculsiveSidebarmodal.exculsive:[]];
                console.log('target_list whatss??:',target_list);
                let find_index;
                let target_item= target_list.filter(
                    (value,index)=>{
                        if(value.prd_id==item.prd_id){
                            find_index = index;
                        }
                    });
                console.log('==>대상 타깃 선택체크 prd_id요소 토글링 해제액션 이후 실제 리덕스에 그 형태대로 반영!',find_index);
                target_list[find_index].isLike = (!item.isLike)==false?0:1;
                exculsivesidebarmodal.updateExculsive({ exculsive: target_list });
            }else if(!Sidebarmodal.openstatus && refer_action!='mypage_like'){
                setActive(e => !e);
                // if(!haveIsLike) updateList();   
                //haveIsLike ? setActive(e => !e) : updateList();
                console.log('likes actions aftersss:',res);
            }
        });
    }

    useEffect(()=>{
        console.log('===?????>페이지 로드시점 컴포넌트 마운트로드시점:',item.isLike);//setActive처리
        setActive(item.isLike);
    },[item.isLike]);
    return (
        <>
            <Tooltip title="관심" disabled={readOnly}>
                <MUCheckbox disabled={readOnly || disable} icon={<FavoriteBorder />} checkedIcon={<Favorite color="secondary" />} checked={active} onClick={LikeBtnEvent} />
            </Tooltip>
        </>
    )

};

const MUCheckbox = styled(Checkbox)``
//react
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

//css
import styled from "styled-components";

//theme
import { TtCon_Frame_B, TtCon_1col_input, } from "../../../../theme";

//material-ui
import { styled as MUstyled } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@mui/material/InputAdornment';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
//import Select from '@mui/material/Select';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';

//img
import Check from "../../../../img/map/radio.png";
import Checked from "../../../../img/map/radio_chk.png";
import ArrowDown from "../../../../img/member/arrow_down.png";

import { Mobile, PC } from "../../../../MediaQuery";

import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";
import "../../../../react-datepicker.css";
import ko from "date-fns/locale/ko";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";

import ModalCommon from "../../../common/modal/ModalCommon";
import serverController from "../../../../server/serverController";
import { useSelector } from 'react-redux';

function checkZero(checkString) {
  return checkString.toString().length == 1 ? "0" + checkString : checkString;
}

function getDateType(date) {
  //date.setDate(date.getDate() + 1);
  var temp = `${checkZero(date.getFullYear())}/${checkZero(date.getMonth() + 1)}/${checkZero(date.getDate())}`;
  return temp;
}


function getDateTimeType(date) {
  //date.setDate(date.getDate() + 1);
  var temp = `${checkZero(date.getHours())}:${checkZero(date.getMinutes())}:00`;
  return temp;
}


export default function VisitSetting({ setCal, setAdd, setEdit, setCancle }) {
  const userInfo = useSelector(e => e.login_user);
  const bunyangTeam = useSelector(data => data.bunyangTeam);

  console.log('bunyangTaema로드 흠gma::', bunyangTeam);

  const [active, setActive] = useState(false);

  const [tourItem, setTourItem] = useState(null);
  const [onOff, setOnOff] = useState(true);

  const [menu, setMenu] = useState(false);

  const [startDate, setStartDate] = useState(setHours(setMinutes(new Date(), 30), 16));
  const [endDate, setEndDate] = useState(setHours(setMinutes(new Date(), 30), 16));

  const [StartDay, setStartDay] = useState(new Date());
  const [EndDay, setEndDay] = useState(new Date("2021/07/08"));
  const [dayArray, setDayArray] = useState([false, false, false, false, false, false, false]);

  const [Interval, setInterval] = useState(30); //간격 값 저장
  const [holiday, setHoliday] = useState(false); //주말 값 저장
  const [modalOption, setModalOption] = useState({
    show: false,
    setShow: null,
    link: "",
    title: "",
    submit: {},
    submitnone: {},
    cancle: {},
    confirm: {},
    confirmgreennone: {},
    content: {},
  });


  const change = (e) => {
    setInterval(e.target.value);
  };

  const showModal = () => {
    setMenu(!menu);
  };

  const offReservationSetting = (isActive) => {

    if (!tourItem)
      return;

    console.log('offReservationSetingss:', StartDay, EndDay, startDate, endDate, dayArray, Interval, holiday);
    let data = {
      company_id: userInfo.company_id,
      mem_id: userInfo.memid,
      tour_start_date: getDateType(StartDay),
      tour_end_date: getDateType(EndDay),
      tour_start_time: getDateTimeType(startDate),
      tour_end_time: getDateTimeType(endDate),
      tour_set_days: dayArray,//제외할 요일들.
      time_distance: Interval,//tour하나에 생성된다. tour하나가 분양bp_id프로젝트의 방문예약셋팅임. xxx분양을 공유하는 여러 임의 회원의 마이페이지있을수있고, 거기서의 리스트에서 선택한 bpid에 대해서 방문예약셋팅을 하면??이미 내역이 하나 있으면 수정되게끔 하여 insert연산없게 즉 한 분양프로젝트에서 여러회원이 달라붙을수관게될수있으나 그 분양프로젝트의 방문예약셋팅의경우 여러개 등록은 아닌것으로 보임.
      bp_id: bunyangTeam.bunyangTeam.bp_id,
      is_tour_holiday_except: holiday ? 1 : 0,
      isActive: isActive == true ? 1 : 0,
      tour_id: tourItem.tour_id,//한 분야프로젝트의 하나의 투어셋팅예약 tourid하나가 어떤 기간이며, 공휴일제외여부flag,제외되는 요일들,시간대, 간격등 다 포함하고있음.
      tour_type: 3,
    }

    serverController.connectFetchController(`/api/bunyang/reservation/setting`, 'PUT', JSON.stringify(data), function (res) {
      console.log(res);
    });
  }

  const saveVisitReservationSetting = () => {

    console.log('새로 등록또는 저장::(분양방문셋팅):', userInfo.company_id, userInfo.memid, StartDay, EndDay, startDate, endDate, dayArray, Interval, holiday, onOff);
    let data = {
      company_id: userInfo.company_id,
      mem_id: userInfo.memid,
      tour_start_date: getDateType(StartDay),
      tour_end_date: getDateType(EndDay),
      tour_start_time: getDateTimeType(startDate),
      tour_end_time: getDateTimeType(endDate),
      tour_set_days: dayArray,
      time_distance: Interval,
      bp_id: bunyangTeam.bunyangTeam.bp_id,
      is_tour_holiday_except: holiday ? 1 : 0,
      isActive: onOff ? 1 : 0,
      tour_type: 3,
      tour_group_id: new Date().getTime() + "" + userInfo.memid,
    }

    if (tourItem) {
      console.log('수정 연산진행 수정할 분양방문예약셋팅:', tourItem.tour_id);
      data.tour_id = tourItem.tour_id;
      serverController.connectFetchController(`/api/bunyang/reservation/setting`, 'PUT', JSON.stringify(data), function (res) {
        if (res.success == 1) {
          SecendComfirmModal();
        }
        else {

        }
      });
    }
    else {
      console.log('insert연산 진행 분양방문에약셋팅');
      serverController.connectFetchController(`/api/bunyang/reservation/setting`, 'POST', JSON.stringify(data), function (res) {
        if (res.success == 1) {
          console.log(data);
          SecendComfirmModal();
        }
        else {

        }
      });
    }

  }

  const offModal = () => {
    let option = JSON.parse(JSON.stringify(modalOption));
    option.show = false;
    setModalOption(option);
  };

  const initSetting = () => {
    serverController.connectFetchController(`/api/bunyang/reservation/setting?bp_id=${bunyangTeam.bunyangTeam.bp_id}&tour_type=3`, 'GET', null, function (res) {
      console.log('bunyang setting intisetting listss:', res);
      if (res.success == 1) {

        setTourItem(res.data[0]);
        let daysArray = [];
        res.data[0].tour_set_days.split(',').map((value) => { daysArray.push(value == "true" ? true : false); })
        setOnOff(res.data[0].is_active == 0 ? false : true);
        setHoliday(res.data[0].is_tour_holiday_except == 1 ? true : false);
        setDayArray([...daysArray])
        setInterval(res.data[0].time_distance);
        setStartDay(new Date(res.data[0].tour_start_date.split('.')[0].replace('T', ' ').replace(/-/gi, '/')))
        setEndDay(new Date(res.data[0].tour_end_date.split('.')[0].replace('T', ' ').replace(/-/gi, '/')))
        setStartDate(new Date(getDateType(new Date()) + " " + res.data[0].td_starttime.split('.')[0].replace('T', ' ').replace(/-/gi, '/')))
        setEndDate(new Date(getDateType(new Date()) + " " + res.data[0].td_endtime.split('.')[0].replace('T', ' ').replace(/-/gi, '/')))
      }
    });
  }

  useEffect(() => {

    console.log(bunyangTeam);
    if (!bunyangTeam.bunyangTeam || !bunyangTeam.bunyangTeam.bp_id) {
      return;
    }
    initSetting();

  }, [])

  //등록되었습니다 모달
  const comfirmModal = () => {
    console.log(onOff);
    if (onOff === false) {  //비활성화 상태
      setModalOption({
        show: true,
        setShow: offModal
        , title: "방문예약세팅",
        content: { type: "text", text: `방문예약세팅을 활성화 하시겠습니까?`, component: "", },
        submitnone: { show: true, title: "확인", event: () => { offReservationSetting(true); offModal(); setOnOff(!onOff); }, },
        cancle: { show: true, title: "취소", event: () => { offModal(); }, },
        confirm: { show: false, title: "확인", event: () => { offModal(); }, },
        confirmgreennone: { show: false, title: "확인", event: () => { offModal(); setCal(false); }, },
      });
    } else {
      setModalOption({ //활성화 상태
        show: true,
        setShow: offModal,
        title: "방문예약세팅",
        content: { type: "text", text: `방문예약세팅을 비활성화 하시겠습니까?`, component: "", },
        submitnone: { show: true, title: "확인", event: () => { offReservationSetting(false); offModal(); setOnOff(!onOff); }, },
        cancle: { show: true, title: "취소", event: () => { offModal(); }, },
        confirm: { show: false, title: "확인", event: () => { offModal(); }, },
        confirmgreennone: { show: false, title: "확인", event: () => { offModal(); setCal(false); }, },
      });
    }
  };

  const SecendComfirmModal = () => {
    setModalOption({
      show: true,
      setShow: offModal,
      title: "등록",
      content: { type: "text", text: `완료되었습니다.`, component: "" },
      submit: { show: false, title: "", event: () => { offModal(); } },
      cancle: { show: false, title: "", event: () => { offModal(); } },
      confirm: { show: true, title: "확인", event: () => { initSetting(); offModal(); } },
      confirmgreennone: { show: false, title: "확인", event: () => { offModal(); setCal(false); } }
    });
  }

  const changeHoliday = (e) => {
    console.log('change hoilodayss:', holiday);
    if (holiday) {
      setHoliday(false);
    } else {
      setHoliday(true);
    }

  }

  const setDayActive = (index) => {
    let array = JSON.parse(JSON.stringify(dayArray));
    array[index] = !array[index];
    setDayArray([...array])
  }


  return (
    <>
      <Wrapper>
        <Title>방문예약세팅</Title>
        <div className="par-spacing">
          <div className="flex-right-center">
            <FormGroup>
              <FormControlLabel control={<Checkbox id="off" checked={onOff == false ? true : false} onClick={() => {
                comfirmModal();
              }} />} label="비활성화" />
            </FormGroup>

            {/* <InputCheck type="checkbox" id="off" checked={onOff == false ? true : false}/>
          <CheckLabel
            for="off"
       
            onClick={() => {
              comfirmModal();
            }}
          >
            <Span />
            비활성화
          </CheckLabel> */}

            <ModalCommon modalOption={modalOption} />
          </div>
        </div>
        <div className="divider-a1" />
        <Sect_R2>
          {onOff ? (
            <VisitInfo>
              <div className="par-spacing">
                <FormControl component="fieldset">
                  <div className="flex-left-center">
                    <FormLabel component="legend">기간</FormLabel>
                  </div>
                  <div className="par-indent-left">
                    <WrapDate>
                      <Dates className="date_pick">
                        <DatePicker
                          className="absolute"
                          selected={StartDay}
                          onChange={(date) => setStartDay(date)}
                          selectsStart
                          startDate={StartDay}
                          endDate={EndDay}
                          dateFormat="yyyy.MM.dd"
                        />
                      </Dates>
                      <Dates className="date_pick">
                        <DatePicker
                          className="absolute"
                          selected={EndDay}
                          onChange={(date) => setEndDay(date)}
                          selectsEnd
                          startDate={StartDay}
                          endDate={EndDay}
                          minDate={StartDay}
                          dateFormat="yyyy.MM.dd"
                        />
                      </Dates>
                    </WrapDate>
                  </div>
                </FormControl>
              </div>
              {/* <Box>
                <Label>기간</Label>
                <WrapDate>
                  <Dates className="date_pick">
                    <DatePicker
                      className="absolute"
                      selected={StartDay}
                      onChange={(date) => setStartDay(date)}
                      selectsStart
                      startDate={StartDay}
                      endDate={EndDay}
                      dateFormat="yyyy.MM.dd"
                    />
                  </Dates>
                  <Dates className="date_pick">
                    <DatePicker
                      className="absolute"
                      selected={EndDay}
                      onChange={(date) => setEndDay(date)}
                      selectsEnd
                      startDate={StartDay}
                      endDate={EndDay}
                      minDate={StartDay}
                      dateFormat="yyyy.MM.dd"
                    />
                  </Dates>
                </WrapDate>
              </Box> */}

              {/* <Box>
                <Label>공휴일 제외여부{holiday == 1 ? '1' : '0'}</Label>
              <InputCheck type="checkbox" id="holiday" value={holiday} checked={holiday} onChange={changeHoliday}/>
              <CheckLabel for="holiday">
                <Span />
                공휴일 제외
              </CheckLabel>
              </Box> */}

              <div className="par-spacing">
                <FormControl component="fieldset">
                  <div className="flex-left-center">
                    <FormLabel component="legend">공휴일 제외여부{holiday == 1 ? '1' : '0'}</FormLabel>
                  </div>
                  <div className="par-indent-left">
                    <FormGroup row>
                      <FormControlLabel control={<Checkbox id="holiday" value={holiday} checked={holiday} onChange={changeHoliday} />} label="공휴일 제외" />
                    </FormGroup>
                  </div>
                </FormControl>
              </div>
              <div className="par-spacing">
                <FormControl component="fieldset">
                  <div className="flex-left-center">
                    <FormLabel component="legend">제외 요일</FormLabel>
                  </div>
                  <div className="par-indent-left">
                    <FormGroup row>
                      <FormControlLabel
                        value="bottom"
                        control={<Checkbox id="sun" checked={dayArray[0]} onChange={() => { setDayActive(0) }} />}
                        label="일"

                      />
                      <FormControlLabel
                        value="bottom"
                        control={<Checkbox id="mon" checked={dayArray[1]} onChange={() => { setDayActive(1) }} />}
                        label="월"

                      />
                      <FormControlLabel
                        value="bottom"
                        control={<Checkbox id="tue" checked={dayArray[2]} onChange={() => { setDayActive(2) }} />}
                        label="화"

                      />
                      <FormControlLabel
                        value="bottom"
                        control={<Checkbox id="wed" checked={dayArray[3]} onChange={() => { setDayActive(3) }} />}
                        label="수"

                      />
                      <FormControlLabel
                        value="bottom"
                        control={<Checkbox id="thr" checked={dayArray[4]} onChange={() => { setDayActive(4) }} />}
                        label="목"

                      />
                      <FormControlLabel
                        value="bottom"
                        control={<Checkbox id="fri" checked={dayArray[5]} onChange={() => { setDayActive(5) }} />}
                        label="금"

                      />
                      <FormControlLabel
                        value="bottom"
                        control={<Checkbox id="sat" checked={dayArray[6]} onChange={() => { setDayActive(6) }} />}
                        label="토"

                      />
                    </FormGroup>
                  </div>
                </FormControl>
              </div>
              {/* <WrapWeek>
                  <InBox>
                    <InputCheck type="checkbox" name="" id="sun" checked={dayArray[0]} onChange={() => { setDayActive(0) }} />
                    <CheckLabelInBox for="sun">
                      <SpanAbsolute />일
                    </CheckLabelInBox>
                  </InBox>
                  <InBox>
                    <InputCheck type="checkbox" name="" id="mon" checked={dayArray[1]} onChange={() => { setDayActive(1) }} />
                    <CheckLabelInBox for="mon">
                      <SpanAbsolute />월
                    </CheckLabelInBox>
                  </InBox>
                  <InBox>
                    <InputCheck type="checkbox" name="" id="tue" checked={dayArray[2]} onChange={() => { setDayActive(2) }} />
                    <CheckLabelInBox for="tue">
                      <SpanAbsolute />화
                    </CheckLabelInBox>
                  </InBox>
                  <InBox>
                    <InputCheck type="checkbox" name="" id="wed" checked={dayArray[3]} onChange={() => { setDayActive(3) }} />
                    <CheckLabelInBox for="wed">
                      <SpanAbsolute />수
                    </CheckLabelInBox>
                  </InBox>
                  <InBox>
                    <InputCheck type="checkbox" name="" id="thr" checked={dayArray[4]} onChange={() => { setDayActive(4) }} />
                    <CheckLabelInBox for="thr">
                      <SpanAbsolute />목
                    </CheckLabelInBox>
                  </InBox>
                  <InBox>
                    <InputCheck type="checkbox" name="" id="fri" checked={dayArray[5]} onChange={() => { setDayActive(5) }} />
                    <CheckLabelInBox for="fri">
                      <SpanAbsolute />금
                    </CheckLabelInBox>
                  </InBox>
                  <InBox>
                    <InputCheck type="checkbox" name="" id="sat" checked={dayArray[6]} onChange={() => { setDayActive(6) }} />
                    <CheckLabelInBox for="sat">
                      <SpanAbsolute />토
                    </CheckLabelInBox>
                  </InBox>
                </WrapWeek>*/}

              <div className="par-spacing">
                <FormControl component="fieldset">
                  <div className="flex-left-center">
                    <FormLabel component="legend">시간</FormLabel>
                  </div>
                  <div className="par-indent-left">
                    <WrapTime>
                      <Time>
                        <DatePicker
                          className="date_time_mobile"
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={Interval} //간격 설정
                          timeCaption="Time"
                          dateFormat="h:mm aa" // 시간 타입(보여주는)
                          minTime={setHours(setMinutes(new Date(), 0), 0)} //시작 시간 세팅
                          maxTime={setHours(setMinutes(new Date(), 0), 23)} // 종료 시간 세팅
                        />
                      </Time>
                      <Time>
                        <DatePicker
                          className="date_time_mobile"
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={Interval} //간격 설정
                          timeCaption="Time"
                          dateFormat="h:mm aa" // 시간 타입(보여주는)
                          minTime={setHours(setMinutes(new Date(), 0), 0)} //시작 시간 세팅
                          maxTime={setHours(setMinutes(new Date(), 0), 23)} // 종료 시간 세팅
                        />
                      </Time>
                    </WrapTime>
                  </div>
                </FormControl>
              </div>

              {/* <BoxZindex>
                <Label>시간</Label>
                <WrapTime>
                  <Time>
                    <DatePicker
                      className="date_time_mobile"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={Interval} //간격 설정
                      timeCaption="Time"
                      dateFormat="h:mm aa" // 시간 타입(보여주는)
                      minTime={setHours(setMinutes(new Date(), 0), 0)} //시작 시간 세팅
                      maxTime={setHours(setMinutes(new Date(), 0), 23)} // 종료 시간 세팅
                    />
                  </Time>
                  <Time>
                    <DatePicker
                      className="date_time_mobile"
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={Interval} //간격 설정
                      timeCaption="Time"
                      dateFormat="h:mm aa" // 시간 타입(보여주는)
                      minTime={setHours(setMinutes(new Date(), 0), 0)} //시작 시간 세팅
                      maxTime={setHours(setMinutes(new Date(), 0), 23)} // 종료 시간 세팅
                    />
                  </Time>
                </WrapTime>
              </BoxZindex> */}
              <Box>
                <Label>간격</Label>
                <SelectWd100 onChange={change}>
                  <Option selected={Interval == 30 ? true : false} value={30}>30</Option>
                  <Option selected={Interval == 60 ? true : false} value={60}>60</Option>
                </SelectWd100>
              </Box>
              <Confirm>

                <MUButton
                  variant="contained"
                  type="submit"
                  active={active}
                  onClick={saveVisitReservationSetting}>
                  확인
                </MUButton>
                {/* <ConfirmBtn
                type="submit"
                active={active}
                onClick={saveVisitReservationSetting}
              >
                확인
              </ConfirmBtn> */}
              </Confirm>
            </VisitInfo>
          ) : (
            <VisitInfo style={{ opacity: 0.5 }}>
              <Box>
                <Label>기간</Label>
                <WrapDate>
                  <InputDate type="date" placeholder="시작일" disabled />
                  <InputDate type="date" placeholder="종료일" disabled />
                </WrapDate>
              </Box>
              <Box>
                <Label>공휴일 제외여부</Label>
                <InputCheck type="checkbox" id="holiday" disabled />
                <CheckLabel for="holiday">
                  <Span />
                  공휴일 제외
                </CheckLabel>
              </Box>
              <BoxWeek>
                <Label>요일</Label>
                <WrapWeek>
                  <InBox>
                    <InputCheck type="checkbox" name="" id="sun" disabled />
                    <CheckLabelInBox for="sun">
                      <SpanAbsolute />일
                    </CheckLabelInBox>
                  </InBox>
                  <InBox>
                    <InputCheck type="checkbox" name="" id="mon" disabled />
                    <CheckLabelInBox for="mon">
                      <SpanAbsolute />월
                    </CheckLabelInBox>
                  </InBox>
                  <InBox>
                    <InputCheck type="checkbox" name="" id="tue" disabled />
                    <CheckLabelInBox for="tue">
                      <SpanAbsolute />화
                    </CheckLabelInBox>
                  </InBox>
                  <InBox>
                    <InputCheck type="checkbox" name="" id="wed" disabled />
                    <CheckLabelInBox for="wed">
                      <SpanAbsolute />수
                    </CheckLabelInBox>
                  </InBox>
                  <InBox>
                    <InputCheck type="checkbox" name="" id="thr" disabled />
                    <CheckLabelInBox for="thr">
                      <SpanAbsolute />목
                    </CheckLabelInBox>
                  </InBox>
                  <InBox>
                    <InputCheck type="checkbox" name="" id="fri" disabled />
                    <CheckLabelInBox for="fri">
                      <SpanAbsolute />금
                    </CheckLabelInBox>
                  </InBox>
                  <InBox>
                    <InputCheck type="checkbox" name="" id="sat" disabled />
                    <CheckLabelInBox for="sat">
                      <SpanAbsolute />토
                    </CheckLabelInBox>
                  </InBox>
                </WrapWeek>
              </BoxWeek>

              <Box>
                <Label>시간</Label>
                <WrapTime>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={Interval} //간격 설정
                    timeCaption="Time"
                    dateFormat="h:mm aa" // 시간 타입(보여주는)
                    minTime={setHours(setMinutes(new Date(), 0), 0)} //시작 시간 세팅
                    maxTime={setHours(setMinutes(new Date(), 0), 23)} // 종료 시간 세팅
                  />
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={Interval} //간격 설정
                    timeCaption="Time"
                    dateFormat="h:mm aa" // 시간 타입(보여주는)
                    minTime={setHours(setMinutes(startDate, 0), startDate)} //시작 시간 세팅
                    maxTime={setHours(setMinutes(new Date(), 0), 22)} // 종료 시간 세팅
                  />
                </WrapTime>
              </Box>

              <Box>
                <Label>간격</Label>
                <SelectWd100 disabled>
                  <Option selected={Interval == 30 ? true : false} value={30}>30</Option>
                  <Option selected={Interval == 60 ? true : false} value={60}>60</Option>
                </SelectWd100>
              </Box>
            </VisitInfo>
          )}
        </Sect_R2>
      </Wrapper>
    </>
  );
}

const MUButton = styled(Button)`
  width: 100%;
  height: 66px;
  line-height: 60px;
  border-radius: 11px;
  transition: all 0.3s;
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  transform: skew(-0.1deg);
  background: ${({ active }) => (active ? "#01684b" : "#979797")};
  border: ${({ active }) =>
    active ? "3px solid #04966d" : "3px solid #e4e4e4"};
`

//------------------------------------

const Wrapper = styled.div`
  ${TtCon_Frame_B}
`
const Title = styled.h2``

const Sect_R2 = styled.div`
  ${TtCon_1col_input}
`
const Desc = styled.div`
font-size:${(props) => props.theme.typography.fontSize.sm};
`




























const Container = styled.div`
  width: 680px;
  margin: 0 auto;
  padding: 24px 0 250px;
  @media ${(props) => props.theme.mobile} {
    width: calc(100vw * (380 / 428));
    padding: calc(100vw * (30 / 428)) 0 calc(100vw * (150 / 428));
  }
`;
const WrapVisit = styled.div`
  width: 100%;
`;
const TopTitle = styled.h2`
  font-size: 20px;
  color: #707070;
  text-align: left;
  padding-left: 30px;
  font-weight: 800;
  transform: skew(-0.1deg);
  @media ${(props) => props.theme.mobile} {
    font-size: calc(100vw * (14 / 428));
    padding-left: calc(100vw * (16 / 428));
  }
`;
const TopInfo = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 16px 40px;
  margin-top: 40px;
  border-top: 1px solid #f2f2f2;
  border-bottom: 1px solid #f2f2f2;
  @media ${(props) => props.theme.mobile} {
    margin-top: calc(100vw * (30 / 428));
    padding: calc(100vw * (22 / 428)) calc(100vw * (18 / 428));
  }
`;
const InputCheck = styled.input`
  display: none;
  &:checked + label span {
    background: url(${Checked}) no-repeat;
    background-size: 100% 100%;
  }
`;
const CheckLabel = styled.label`
  display: inline-block;
  font-size: 15px;
  font-weight: 600;
  transform: skew(-0.1deg);
  color: #4a4a4a;
  font-family: "NanumSquare", sans-serif;
  @media ${(props) => props.theme.mobile} {
    font-size: calc(100vw * (15 / 428));
  }
`;
const Span = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  background: url(${Check}) no-repeat;
  background-size: 100% 100%;
  margin-right: 10px;
  vertical-align: middle;
  @media ${(props) => props.theme.mobile} {
    width: calc(100vw * (20 / 428));
    height: calc(100vw * (20 / 428));
    margin-right: calc(100vw * (10 / 428));
  }
`;
const VisitInfo = styled.div`
  padding-top: 40px;
  width: 408px;
  margin: 0 auto;
  @media ${(props) => props.theme.mobile} {
    width: calc(100vw * (375 / 428));
    padding: calc(100vw * (40 / 428)) calc(100vw * (5 / 428)) 0;
    margin: 0 auto;
  }
`;
const Dates = styled.div`
  width:48%; text-align:center;position:relative;z-index:3;
  border-radius:4px;border:1px solid #e4e4e4;height:43px;
  font-size:15px;transform:skew(-0.1deg);line-height:43px;
  background:#fff;z-index:8;
  /* @media ${(props) => props.theme.modal} {
    width:100%;
    margin-bottom:calc(100vw*(15/428));
    height:calc(100vw*(43/428));line-height:calc(100vw*(43/428));
    font-size:calc(100vw*(15/428));
  } */
`
const Box = styled.div`
  margin-bottom: 35px;
  @media ${(props) => props.theme.mobile} {
    margin-bottom: calc(100vw * (35 / 428));
  }
`;
const Label = styled.label`
  display: block;
  font-size: 12px;
  color: #4a4a4a;
  font-weight: 600;
  transform: skew(-0.1deg);
  line-height: 1.33;
  margin-bottom: 10px;
  @media ${(props) => props.theme.mobile} {
    font-size: calc(100vw * (12 / 428));
    margin-bottom: calc(100vw * (10 / 428));
  }
`;
const WrapDate = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap:wrap;
`;
const InputDate = styled.input`
  display: inlnie-block;
  width: 195px;
  height: 43px;
  font-size: 15px;
  text-align: center;
  color: #707070;
  transform: skew(-0.1deg);
  font-weight: 600;
  border-radius: 4px;
  border: solid 1px #e4e4e4;
  @media ${(props) => props.theme.mobile} {
    width: calc(100vw * (170 / 428));
    height: calc(100vw * (43 / 428));
    font-size: calc(100vw * (15 / 428));
  }
`;
const BoxWeek = styled(Box)`
  padding: 0 3px 0 0;
  @media ${(props) => props.theme.mobile} {
    padding: 0 calc(100vw * (3 / 428)) 0 0;
  }
`;
const WrapWeek = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const InBox = styled.div`
  position: relative;
`;
const CheckLabelInBox = styled(CheckLabel)`
  padding-top: 25px;
  @media ${(props) => props.theme.mobile} {
    padding-top: calc(100vw * (25 / 428));
  }
`;
const SpanAbsolute = styled(Span)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
`;
const WrapTime = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Select = styled.select`
  display: inlnie-block;
  width: 195px;
  height: 43px;
  font-size: 15px;
  text-align: center;
  color: #707070;
  transform: skew(-0.1deg);
  font-weight: 600;
  border-radius: 4px;
  text-align-last: center;
  border: solid 1px #e4e4e4;
  background: url(${ArrowDown}) no-repeat 90% center;
  background-size: 11px;
  appearance: none;
  @media ${(props) => props.theme.mobile} {
    width: calc(100vw * (170 / 428));
    height: calc(100vw * (43 / 428));
    font-size: calc(100vw * (15 / 428));
    background-size:calc(100vw*(11/428));
  }
`;
const Time = styled.div`
  position:relative;
  width: 195px;
  height: 43px;
  font-size: 15px;
  text-align: center;
  color: #707070;
  transform: skew(-0.1deg);
  font-weight: 600;
  @media ${(props) => props.theme.mobile} {
    width: calc(100vw * (170 / 428));
    height: calc(100vw * (43 / 428));
    font-size: calc(100vw * (15 / 428));
  }
`
const BoxZindex = styled(Box)`
  position:relative;z-index:2;
`
const Option = styled.option`
  font-size: 15px;
  text-align: center;
  font-family: "nbg", sans-serif;
  color: #707070;
  transform: skew(-0.1deg);
  font-weight: 600;
  @media ${(props) => props.theme.mobile} {
    font-size: calc(100vw * (15 / 428));
  }
`;
const SelectWd100 = styled(Select)`
  width: 100%;
  background: url(${ArrowDown}) no-repeat 90% center;
  background-size: 11px;
  @media ${(props) => props.theme.mobile} {
    background-size: calc(100vw * (11 / 428));
  }
`;
const Confirm = styled.div`
  width: 100%;
  margin-top: 60px;
  @media ${(props) => props.theme.mobile} {
    width: 100%;
    margin-top: calc(100vw * (60 / 428));
  }
`;
const ConfirmBtn = styled.button`
  width: 100%;
  height: 66px;
  line-height: 60px;
  border-radius: 11px;
  transition: all 0.3s;
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  transform: skew(-0.1deg);
  background: ${({ active }) => (active ? "#01684b" : "#979797")};
  border: ${({ active }) =>
    active ? "3px solid #04966d" : "3px solid #e4e4e4"};
  @media ${(props) => props.theme.mobile} {
    width: 100%;
    height: calc(100vw * (60 / 428));
    line-height: calc(100vw * (54 / 428));
    font-size: calc(100vw * (15 / 428));
  }
`;

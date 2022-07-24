import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

//css
import styled from "styled-components";

//img
import SwiperImg from '../../img/main/img01.png'

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export default function MainCarousel({ bannerData }) {

  var globe_aws_url = 'https://korexdata.s3.ap-northeast-2.amazonaws.com/';

  const default_bannerdata = [
    {
      ban_label: 'default배너_111111111111111',
      ban_url: '',
      ban_image: SwiperImg,
    }, {
      ban_label: 'default배너_222222222222222',
      ban_url: '',
      ban_image: SwiperImg
    }
  ]

  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = bannerData.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const printLable = () => {
    return(bannerData[activeStep].ban_label);
  }

  return (
    <>
      <Box sx={{ maxWidth: 450, flexGrow: 1, margin: "0 auto", }}>
        <Paper
          square
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: 50,
            pl: 2,
            bgcolor: 'background.default',
          }}
        >
        <Typography>{bannerData[activeStep].ban_label}</Typography>
        {/* <Typography>{default_bannerdata[0].ban_label}</Typography> */}
        </Paper>
        <AutoPlaySwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {bannerData.map((step, index) => (

            <div key={step.ban_label}>
              {Math.abs(activeStep - index) <= 2 ? (

                <Box
                  component="img"
                  sx={{
                    height: 279,
                    display: 'block',
                    maxWidth: 450,
                    overflow: 'hidden',
                    width: '100%',
                  }}
                  //src={step.imgPath}
                  src={step.ban_image ? globe_aws_url + step.ban_image : SwiperImg}
                  alt={step.ban_label}
                />

              ) : null}
            </div>
          ))}
        </AutoPlaySwipeableViews>
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              Next
              {theme.direction === 'rtl' ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
              {theme.direction === 'rtl' ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
        />
      </Box>
    </>
  );
}
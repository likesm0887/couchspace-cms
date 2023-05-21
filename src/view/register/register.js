import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PersonalInfo from "./personalInfo";
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';


const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        width: '60%',
        marginLeft: '20%',
        marginTop: '2%',
    },
    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

function getSteps() {
    return ['填寫個人資料', '填寫諮商資訊', '諮商時段設定', '完成'];
    // return ['填寫個人資料', '填寫機構資料', '預約設定', '完成'];
}


export function Register() {
    const navigate = useNavigate();
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const steps = getSteps();
    const personalInfo = useRef();
    const isStepOptional = (step) => {
        return step === 1;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        if (activeStep === 0 && !personalInfo.current.checkAllInput()) {
            return;
        }
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        if (activeStep === 0) {
            navigate('/couchspace-cms', { replace: true });
        }
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };



    const handleReset = () => {
        setActiveStep(0);
    };
    function getStepContent(step) {
        switch (step) {
            case 0:
                return <PersonalInfo ref={personalInfo}></PersonalInfo>;
            case 1:
                return '填寫機構資料';
            case 2:
                return '設定營業時間';
            case 3:
                return '設定營業時間';
            default:
                return 'Unknown step';
        }
    }

    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};

                    if (isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            <div>
                {activeStep === steps.length ? (
                    <div>
                        <Typography className={classes.instructions}>
                            填寫已完成，待審核完畢，會再與您聯絡
                        </Typography>
                        <Button onClick={handleReset} className={classes.button}>
                            完成
                        </Button>
                    </div>
                ) : (
                    <div>
                        <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                        <div>
                            <Button onClick={handleBack} className={classes.button}>
                                {activeStep === 0 ? '返回' : '上一步'}
                            </Button>


                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNext}
                                className={classes.button}
                            >
                                {activeStep === steps.length - 1 ? '完成' : '下一步'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

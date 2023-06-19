import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PersonalInfo from "./personalInfo";
import { useLocation, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import ConsultationInfo from './consultationInfo';
import { counselorService } from '../../service/ServicePool';
import { Counselor, counselorInfo } from '../../dataContract/counselor';
import BusinessInfo from './businessInfo';
import CertificateInfo from './certificateInfo';


const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        width: '60%',
        marginLeft: '20%',
        marginTop: '2%',
        marginBottom: '2%',
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
    return ['填寫個人資料', '填寫諮商資訊', '相關諮商證照', '諮商時段設定', '完成'];
}


export function Register() {
    const navigate = useNavigate();
    const location = useLocation();
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const steps = getSteps();
    const personalInfo = useRef();
    const consultationInfo = useRef();
    const certificateInfo = useRef();
    const businessInfo = useRef();
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        console.log(location);
        setAccount(location.state.email);
        setPassword(location.state.password);
    }, []);

    const isStepOptional = (step) => {
        return step === 1;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = async () => {
        if (activeStep === 0 && !personalInfo.current.checkAllInput()) {
            return;
        }
        else if (activeStep === 1 && !consultationInfo.current.checkAllInput()) {
            return;
        }
        else if (activeStep === 2 && !certificateInfo.current.checkAllInput()) {
            return;
        }
        else if (activeStep === 3 && !businessInfo.current.checkAllInput()) {
            return;
        }
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }
        if (activeStep === 3) {
            finishRegister();
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
        console.log("activeStep", activeStep);
        console.log("steps.length", steps.length);

    };

    const handleBack = () => {
        if (activeStep === 0) {
            navigate('/couchspace-cms', { replace: true });
            counselorInfo.clearAll = null;
        }
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };



    const handleReset = () => {
        navigate('/couchspace-cms', { replace: true });
        setActiveStep(0);
        counselorInfo.clearAll = null;
    };
    const finishRegister = async () => {
        console.log("finish register");
        var result = await counselorService.register(account, password);
        console.log("result", result);
        result = await counselorService.login(account, password);
        result = await counselorService.updateCounselorInfo(counselorInfo);
        result = await counselorService.setAppointmentTime(counselorInfo.BusinessTimes);
        console.log("result", result);
    }
    function getStepContent(step) {
        console.log("step", step);
        switch (step) {
            case 0:
                return <PersonalInfo ref={personalInfo}></PersonalInfo>;
            case 1:
                return <ConsultationInfo ref={consultationInfo}></ConsultationInfo>;
            case 2:
                return <CertificateInfo ref={certificateInfo}></CertificateInfo>;
            case 3:
                return <BusinessInfo ref={businessInfo}></BusinessInfo>;
            default:
                return;
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
                {activeStep === (steps.length - 1) ? (
                    <div>
                        <Typography className={classes.instructions}>
                            填寫已完成，待審核完畢，會再與您聯絡
                        </Typography>
                        <Button onClick={handleReset} className={classes.button} variant="contained" color='primary'>
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

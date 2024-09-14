import React, { useEffect, useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PersonalInfo from "./personalInfo";
import { useLocation, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import ConsultationInfo from './consultationInfo';
import { counselorService } from '../../service/ServicePool';
import { AppointmentTime, counselorInfo } from '../../dataContract/counselor';
import BusinessInfo from './businessInfo';
import CertificateInfo from './certificateInfo';
import "./Register.css";
import { showToast, toastType } from '../../common/method';

function getSteps() {
    return ['填寫個人資料', '填寫諮商資訊', '相關諮商證照', '諮商時段設定', '完成'];
}


export function Register() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
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
            setLoading(true);
            await finishRegister();
            setLoading(false);
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
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
        try {
            let appointmentTime = new AppointmentTime();
            appointmentTime.BusinessTimes = counselorInfo.BusinessTimes;
            appointmentTime.OverrideTimes = counselorInfo.OverrideTimes;

            // step1: Register
            var result = await counselorService.register(account, password);
            if (result.status !== 200) {
                showToast(toastType.error, "註冊失敗");
                return;
            }

            // step2: Login to get token
            result = await counselorService.login(account, password);
            // console.log("Login", result);
            // step3: Upload Photo
            result = await counselorService.upload(counselorInfo.Photo);
            // console.log("Upload Photo", result);
            counselorInfo.updatePhoto = result.Photo;
            counselorInfo.updateAppointmentID = result.AppointmentTimeID;
            // console.log("counselorInfo", counselorInfo);
            // step4: Update Counselor Info and AppointmentTime
            let res1 = await counselorService.updateCounselorInfo(counselorInfo);
            let res2 = await counselorService.setAppointmentTime(appointmentTime);
            // console.log("Update Counselor Info", res1);
            // console.log("Update AppointmentTime", res2);
            if (!res1.success) {
                showToast(toastType.error, "建立諮商師資料失敗");
                return;
            }
            if (!res2.success) {
                showToast(toastType.error, "建立諮商時段失敗");
                return;
            }
            console.log("register finish");
        }
        catch (err) {
            showToast(toastType.error, `註冊失敗，請聯繫客服 (${err})`);
        }
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
        <div>
            {loading ?
                <div className="loader-container">
                    <div className="spinner"></div>
                    <div style={{ font: 'caption', fontSize: 40, color: 'white' }}>{"資料創建中..."}</div>
                </div> : null}
            <div class="container-fluid" style={{ overflowY: "scroll" }}>
                <div class="row justify-content-center" style={{ marginTop: 15 }}>
                    <div class="col-sm-12 col-lg-6 col-xxl-6">
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
                                    <Typography>
                                        填寫已完成，待審核完畢，會再與您聯絡
                                    </Typography>
                                    <Button onClick={handleReset} variant="contained" color='primary'>
                                        完成
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    <Typography>{getStepContent(activeStep)}</Typography>
                                    <div>
                                        <Button onClick={handleBack}>
                                            {activeStep === 0 ? '返回' : '上一步'}
                                        </Button>


                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleNext}
                                        >
                                            {activeStep === steps.length - 1 ? '完成' : '下一步'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

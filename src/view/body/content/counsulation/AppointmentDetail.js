import "./appointmentDetail.css"
import healthDescription from "../../../img/content/AppointmentDetail/health_description.svg"
import { useNavigate, useLocation } from 'react-router-dom';
import { counselorService } from "../../../../service/ServicePool";
import { useEffect, useState } from "react";
import {
    createTheme,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ThemeProvider
} from "@mui/material";
import { Appointment } from "../../../../dataContract/appointment"
import buttonLeft from "../../../img/content/AppointmentDetail/btn_left.svg";
const Width = (window.innerWidth * 0.9) > 900 ? (window.innerWidth * 0.9) : 900;
function AppointmentDetail() {
    const { state } = useLocation();
    let navigate = useNavigate();
    const [appointment, setAppointment] = useState(new Appointment());
    const [fee, setFee] = useState(0);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userReservedTime, setUserReservedTime] = useState("");
    const [userReservedService, setUserReservedService] = useState("");
    const [totalScore, setTotalScore] = useState(0);

    useEffect(() => {
        counselorService.getGetUserById(state.appointment.UserID).then((res) => {
            console.log("userInfo", res);
            setUserName(state.appointment.UserName);
            setUserEmail(res?.Email);
            setUserReservedTime(state.appointment.Time.Date.replaceAll("-", "/") + " " + state.appointment.Time.StartTime);
            setUserReservedService(state.appointment.Service.Type.Label);
            setTotalScore(state.appointment.SymptomRating.TotalScore);
        });
        setAppointment(state.appointment);
        console.log("state", state.appointment);
        setFee(new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'NTD', minimumFractionDigits: 0 }).format(state.appointment.Fee));
    }, [])
    const [open, setOpen] = useState(false);
    const theme = createTheme({
        palette: {
            primary: {
                // light: 如果省略將從 palette.primary.main 依照 tonalOffset 的值去計算
                main: '#88A1D2',
                // dark: 如果省略將從 palette.primary.main 依照 tonalOffset 的值去計算,
                // contrastText: 如果省略將從 palette.primary.main 依照 contrastThreshold 的值去計算
            }

        },
    })
    const showHealthDescriptionDialog = () => {
        setOpen(true);
    };
    const handleBack = () => {
        navigate("/couchspace-cms/home/consultation", { replace: true });
    }
    const handleClose = () => {
        setOpen(false);
    };
    const createDialog = () => {
        return <Dialog
            open={open}
            fullWidth={true}
            onClose={handleClose}
            value={"sm"}>
            <DialogTitle style={{ fontSize: 16 }} id="alert-dialog-title">{"評分說明"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <div style={{ fontSize: 14 }}>
                        前五題之總分：<br></br>
                        ● 得分0~5分：身心適應狀況良好。<br></br>
                        ● 得分6~9分：輕度情緒困擾，建議找家人或朋友談談，抒發情緒，給予情緒支持。<br></br>
                        ● 得分10~14分：中度情緒困擾，建議尋求心理諮商或接受專業諮詢。<br></br>
                        ● 得分＞15分：重度情緒困擾，需高關懷，建議轉介精神科治療或接受專業輔導。<br></br>
                    </div>
                    <div style={{ fontSize: 12 }}>
                        <br></br>
                        <br></br>
                        *本量表為「簡式健康量表(BSRS-5)」內容由台灣大學李明濱教授所編訂。
                    </div>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <div className={"button-content"}>
                    <button className={"acceptButton"} onClick={handleClose} color="primary">
                        關閉
                    </button>
                </div>
            </DialogActions>
        </Dialog>
    }
    const finish = () => {
        navigate("/couchspace-cms/home/consultation", { replace: true });
    }
    function num2Time(number) {
        var minute = parseInt(number / 60)
            .toString()
            .padStart(2, "0");
        var second = parseInt(number % 60)
            .toString()
            .padStart(2, "0");
        return minute + ":" + second + ":00";
    }
    function getStatusDesc(code) {
        if (code.toUpperCase() === 'NEW') {
            return "未付款"
        }
        if (code.toUpperCase() === 'UNPAID') {
            return "未付款"
        }
        if (code.toUpperCase() === 'CONFIRMED') {
            return "已確認"
        }
        if (code.toUpperCase() === 'ROOMCREATED') {
            return "即將開始"
        }

        if (code.toUpperCase() === 'CANCELLED') {
            return "已取消"
        }

        if (code.toUpperCase() === 'COMPLETED') {
            return "已完成"
        }
    }
    function getTextByScore(score) {
        let outputText = "";
        switch (score) {
            case 0:
                outputText = "完全沒有";
                break;
            case 1:
                outputText = "輕微";
                break;
            case 2:
                outputText = "中等程度";
                break;
            case 3:
                outputText = "嚴重";
                break;
            case 4:
                outputText = "非常嚴重";
                break;
            default:
                outputText = "中等程度";
                break;
        }
        return outputText;
    }
    return (
        <ThemeProvider theme={theme}>
            <div style={{ width: "100%", height: "100%", backgroundColor: "#F7F8F8", overflow: "auto" }}>
                <div className="">
                    <div className={"button-back"} onClick={() => handleBack()}>
                        <img style={{ height: 15, width: 9, marginRight: 10 }} src={buttonLeft} alt={123}></img>
                        <span>
                            返回訂單
                        </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", width: Width }}>
                        <div style={{ marginLeft: 40, marginTop: 20, width: "50%" }}>
                            <div style={{ display: 'block', width: "100%", backgroundColor: "#FFFFFF", borderRadius: 10, overflow: "hidden", perspective: 1 }}>
                                <div className="detail-title-row">
                                    <div className="detail-title-col detail-title-left">
                                        預約資訊
                                    </div>
                                    <div className="detail-title-col detail-title-right">
                                        {"訂單編號:" + appointment.AppointmentID.slice(appointment.AppointmentID.length - 5, appointment.AppointmentID.length).toUpperCase()}
                                    </div>
                                </div>
                                <div className="detail-content-row">
                                    <div className="detail-content-col detail-content-left" style={{ flex: 3 }}>
                                        姓名
                                    </div>
                                    <div className="detail-content-col detail-content-left" style={{ flex: 7 }}>
                                        {userName}
                                    </div>
                                </div>
                                <div className="detail-content-row">
                                    <div className="detail-content-col detail-content-left" style={{ flex: 3 }}>
                                        電子信箱
                                    </div>
                                    <div className="detail-content-col detail-content-left" style={{ flex: 7 }}>
                                        {userEmail}
                                    </div>
                                </div>
                                <div className="detail-content-row">
                                    <div className="detail-content-col detail-content-left" style={{ flex: 3 }}>
                                        預約時間
                                    </div>
                                    <div className="detail-content-col detail-content-left" style={{ flex: 7 }}>
                                        {userReservedTime}
                                    </div>
                                </div>
                                <div className="detail-content-row">
                                    <div className="detail-content-col detail-content-left" style={{ flex: 3 }}>
                                        預約服務
                                    </div>
                                    <div className="detail-content-col detail-content-left" style={{ flex: 7 }}>
                                        {userReservedService}
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: 20, display: 'block', width: "100%", backgroundColor: "#FFFFFF", borderRadius: 10, overflow: "hidden", perspective: 1 }}>
                                <div className="detail-title-row">
                                    <div className="detail-title-col detail-title-left">
                                        問題簡述
                                    </div>
                                </div>
                                <div className="detail-content-row">
                                    <div className="problemStatement">
                                        {appointment.ProblemStatement.length === 0 ? "未填寫" : appointment.ProblemStatement}
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: 20, display: 'block', width: "100%", backgroundColor: "#FFFFFF", borderRadius: 10, overflow: "hidden", perspective: 1 }}>
                                <div className="detail-title-row">
                                    <div className="detail-title-col detail-title-left">
                                        緊急聯絡人
                                    </div>
                                </div>
                                <div className="detail-content-row">
                                    <div className="detail-content-col detail-content-left" style={{ flex: 3 }}>
                                        姓名
                                    </div>
                                    <div className="detail-content-col detail-content-left" style={{ flex: 7 }}>
                                        {appointment.Emergency.Name}
                                    </div>
                                </div>
                                <div className="detail-content-row">
                                    <div className="detail-content-col detail-content-left" style={{ flex: 3 }}>
                                        關係
                                    </div>
                                    <div className="detail-content-col detail-content-left" style={{ flex: 7 }}>
                                        {appointment.Emergency.Relationship}
                                    </div>
                                </div>
                                <div className="detail-content-row">
                                    <div className="detail-content-col detail-content-left" style={{ flex: 3 }}>
                                        聯絡電話
                                    </div>
                                    <div className="detail-content-col detail-content-left" style={{ flex: 7 }}>
                                        {appointment.Emergency.Phone}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ marginLeft: 20, marginTop: 20, width: "40%" }}>
                            <div style={{ display: 'block', width: "100%", backgroundColor: "#FFFFFF", borderRadius: 10, overflow: "hidden", perspective: 1 }}>
                                <div className="detail-title-row">
                                    <div className="detail-title-col detail-title-left">
                                        預約狀態
                                    </div>
                                    <div className="detail-title-col detail-title-right">
                                        <div style={{ lineHeight: 2, float: "right", alignSelf: 'center', justifySelf: 'center', textAlign: "center", width: 77, color: "#FFFFFF", backgroundColor: "#F1A250", borderRadius: 20 }}>
                                            {getStatusDesc(appointment.Status)}
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: 20, display: 'block', width: "100%", backgroundColor: "#FFFFFF", borderRadius: 10, overflow: "hidden", perspective: 1 }}>
                                <div className="detail-title-row">
                                    <div className="detail-title-col detail-title-left">
                                        簡式健康量表
                                    </div>
                                </div>
                                <div className="detail-content-row">
                                    <div className="detail-content-col detail-content-left">
                                        1.睡眠困難
                                    </div>
                                    <div className="detail-content-col detail-content-right">
                                        {getTextByScore(appointment.SymptomRating.SleepDifficulty)}
                                    </div>
                                </div>
                                <div className="detail-content-row">
                                    <div className="detail-content-col detail-content-left">
                                        2.感覺緊張不安
                                    </div>
                                    <div className="detail-content-col detail-content-right">
                                        {getTextByScore(appointment.SymptomRating.Nervous)}
                                    </div>
                                </div>
                                <div className="detail-content-row">
                                    <div className="detail-content-col detail-content-left">
                                        3.覺得容易苦惱或動怒
                                    </div>
                                    <div className="detail-content-col detail-content-right">
                                        {getTextByScore(appointment.SymptomRating.Irritated)}
                                    </div>
                                </div>
                                <div className="detail-content-row">
                                    <div className="detail-content-col detail-content-left">
                                        4.感覺憂鬱，情緒低落
                                    </div>
                                    <div className="detail-content-col detail-content-right">
                                        {getTextByScore(appointment.SymptomRating.MelancholyDepressed)}
                                    </div>
                                </div>
                                <div className="detail-content-row">
                                    <div className="detail-content-col detail-content-left">
                                        5.覺得比不上別人
                                    </div>
                                    <div className="detail-content-col detail-content-right">
                                        {getTextByScore(appointment.SymptomRating.InferiorFeeling)}
                                    </div>
                                </div>
                                <div className="detail-content-row">
                                    <div className="detail-content-col detail-content-left">
                                        6.有過『自殺』的念頭
                                    </div>
                                    <div className="detail-content-col detail-content-right">
                                        {getTextByScore(appointment.SymptomRating.Suicidalthoughts)}
                                    </div>
                                </div>
                                <div className="detail-content-row">
                                    <div className="detail-content-col detail-content-left">
                                        <span style={{ fontSize: 16 }}>總分</span>
                                    </div>
                                    <div className="detail-content-col detail-content-right">
                                        <div style={{ float: 'right', display: 'flex', flexDirection: 'row', alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
                                            <span style={{ color: "#F1A250", fontSize: 16 }}>{totalScore}</span>
                                            <span style={{ color: "#555654", fontSize: 16 }}>{"/24"}</span>
                                            <div style={{ marginLeft: 5, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onClick={() => showHealthDescriptionDialog(true)}>
                                                <img style={{ height: 15, width: 15 }} src={healthDescription} alt={"123"}></img>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div style={{ marginTop: 20, display: 'block', width: "100%", backgroundColor: "#FFFFFF", borderRadius: 10, overflow: "hidden", perspective: 1 }}>
                                <div className="detail-title-row">
                                    <div className="detail-title-col detail-title-left">
                                        訂單金額
                                    </div>
                                    <div className="detail-title-col detail-title-right">
                                        <div style={{ fontSize: 16, fontFamily: "PingFang TC", lineHeight: 2, float: "right", alignSelf: 'center', justifySelf: 'center', textAlign: "center", width: 77, color: "#89A2D0", fontWeight: "bold" }}>
                                            {"NT$" + appointment.Fee}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {createDialog()}
            </div>
        </ThemeProvider>

    )
        ;
}

export default AppointmentDetail

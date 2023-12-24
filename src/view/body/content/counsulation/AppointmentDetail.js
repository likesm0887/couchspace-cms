import "./appointmentDetail.css"
import defaultUserPhoto from "../../../img/content/userPhoto.png"
import location from "../../../img/content/AppointmentDetail/location.svg"
import mail from "../../../img/content/AppointmentDetail/mail.svg"
import nickname from "../../../img/content/AppointmentDetail/nickname.svg"
import phone from "../../../img/content/AppointmentDetail/phone.svg"
import { useNavigate, useLocation } from 'react-router-dom';
import { appointmentService, memberService } from "../../../../service/ServicePool";
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

function AppointmentDetail() {
    const { state } = useLocation();
    let navigate = useNavigate();
    const [appointment, setAppointment] = useState(new Appointment());
    const [fee, setFee] = useState(0);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [userAddress, setUserAddress] = useState("");
    const [userPhoto, setUserPhoto] = useState("");
    useEffect(() => {
        memberService.getGetUserById(state.appointment.UserID).then((res) => {
            console.log("userInfo", res);
            setUserName(state.appointment.UserName);
            setUserEmail(res?.Email);
            setUserPhone(res?.Phone);
            setUserAddress(res?.AddressObject?.Address);
            setUserPhoto(res ? res.Photo : defaultUserPhoto);
        });
        setAppointment(state.appointment);
        console.log("state", state.appointment);
        setFee(new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'NTD', minimumFractionDigits: 0 }).format(state.appointment.Fee));
    }, [])
    useEffect(() => {

    }, [userName, userEmail, userAddress, userPhone])
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
    const accept = () => {
        showDialog()
    }
    const showDialog = () => {
        setOpen(true);
    };
    const handleAccept = () => {
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
            aria-labelledby="確認是否要接受"
            aria-describedby="確認是否要接受sasa"
            value={"sm"}>
            <DialogTitle id="alert-dialog-title">{"確認是否要接受阿豪的預約?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {"預約日期 " + appointment.Time.Date}
                    <br></br>
                    {"預約時間 " + appointment.Time.StartTime}
                    <br></br>
                    {"時數 " + num2Time(appointment.Time.Total)}
                    <br></br>
                    {"諮商種類 " + appointment.Service.Type.Label}
                    <br></br>
                    {"金額 " + fee}
                    <br></br>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <button className={"finishButton"} onClick={handleClose} color="primary">
                    再想想
                </button>
                <button className={"acceptButton"} onClick={handleAccept} color="primary" autoFocus>
                    確定接受
                </button>
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
            return "訂單成立(未付款)"
        }
        if (code.toUpperCase() === 'UNPAID') {
            return "訂單成立(未付款)"
        }
        if (code.toUpperCase() === 'CONFIRMED') {
            return "已確認"
        }
        if (code.toUpperCase() === 'ROOMCREATED') {
            return "諮商房間已建立"
        }

        if (code.toUpperCase() === 'CANCELLED') {
            return "已取消"
        }

        if (code.toUpperCase() === 'COMPLETED') {
            return "已完成"
        }
    }
    return (
        <ThemeProvider theme={theme}>
            <div>
                {createDialog()}
            </div>
            <div className={"AppointmentDetail"}>
                <div className={"upContent"}>
                    <div className={"userHeadShot"}>
                        <img className={"userHeadShotImg"} style={{ verticalAlign: 'middle' }} src={userPhoto} alt="123"></img>
                    </div>
                    <div className={"userInfo"}>
                        <div className={"row1"}>
                            <ul>
                                <li>
                                    <img style={{ verticalAlign: 'middle' }} src={nickname} alt="123"></img>
                                    <span className={"name"}>{userName}</span>
                                </li>
                            </ul>
                            <ul>
                                <li>
                                    <img className={"mail"} style={{ verticalAlign: 'middle' }} src={mail} alt="123"></img>
                                    <span className={"infoText"}>{userEmail}</span>
                                </li>
                            </ul>
                            <ul>
                                <li>
                                    <img className={"phone"} style={{ verticalAlign: 'middle' }} src={phone} alt="123"></img>
                                    <span className={"infoText"}>{userPhone}</span>
                                </li>
                            </ul>
                        </div>
                        <div className={"row2"}>
                            <ul>
                                <li>
                                    <img style={{ verticalAlign: 'middle' }} src={location} alt="123"></img>
                                    <span className={"infoText"}>{userAddress}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={"downContent"}>
                    <div className={"detail"}>
                        <table cellSpacing="25">

                            <tbody>
                                <tr>
                                    <td>預約日期</td>
                                    <td>{appointment.Time.Date}</td>
                                </tr>
                                <tr>
                                    <td>預約時間</td>
                                    <td>{appointment.Time.StartTime}</td>
                                </tr>
                                <tr>
                                    <td>時數</td>
                                    <td>{num2Time(appointment.Time.Total)}</td>
                                </tr>
                                <tr>
                                    <td>諮商種類</td>
                                    <td>{appointment.Service.Type.Label}</td>
                                </tr>
                                <tr>
                                    <td>狀態</td>
                                    <td>{getStatusDesc(appointment.Status)}</td>
                                </tr>
                                <tr>
                                    <td>金額</td>
                                    <td>{fee}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className={"problem"}>
                        <div className={"titleLabel"}>問題描述</div>
                        <textarea className={"problem-text"} value={appointment.ProblemStatement} readOnly={true} />
                    </div>
                </div>
                <div className={"button-content"}>
                    <button className={"finishButton"} onClick={() => finish()}>完成查閱</button>
                    {/* <button className={"acceptButton"} onClick={() => accept()}>確認接受</button> */}

                </div>

            </div>
        </ThemeProvider>

    )
        ;
}

export default AppointmentDetail

import "./appointmentDetail.css"
import userPhoto from "../../../img/content/userPhoto.png"
import location from "../../../img/content/AppointmentDetail/location.svg"
import mail from "../../../img/content/AppointmentDetail/mail.svg"
import nickname from "../../../img/content/AppointmentDetail/nickname.svg"
import phone from "../../../img/content/AppointmentDetail/phone.svg"
import {Routes, Route, useParams, useNavigate} from 'react-router-dom';
import {appointmentService} from "../../../../service/ServicePool";
import {useEffect, useState} from "react";
import {
    createTheme,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ThemeProvider
} from "@mui/material";

function AppointmentDetail() {

    let navigate = useNavigate();
    let {id} = useParams();
    useEffect(() => {

        getAppointment(id)
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


    const getAppointment = async (id) => {
        let data = await appointmentService.getAppointment(id)
        console.log(data)
    }

    const accept = () => {
        showDialog()

    }

    const showDialog = () => {
        setOpen(true);
    };
    const handleAccept = () => {
        navigate("/couchspace-cms/home/consultation", {replace: true});
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
                    預約日期 2022/06/29
                    <br></br>
                    預約時間 18:00:00
                    <br></br>
                    時數 01:00:00
                    <br></br>
                    諮商種類 諮商
                    <br></br>
                    金額 2,200NTD
                    <br></br>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <button  className={"finishButton"}  onClick={handleClose} color="primary">
                    再想想
                </button>
                <button className={"acceptButton"} onClick={handleAccept} color="primary" autoFocus>
                    確定接受
                </button>
            </DialogActions>
        </Dialog>
    }
    const finish = () => {
        navigate("/couchspace-cms/home/consultation", {replace: true});
    }

    return (
        <ThemeProvider theme={theme}>
            <div>
                {createDialog()}
            </div>
            <div className={"AppointmentDetail"}>
                <div className={"upContent"}>
                    <div className={"userHeadShot"}>
                        <img className={"userHeadShotImg"} src={userPhoto}></img>
                    </div>
                    <div className={"userInfo"}>
                        <div className={"row1"}>
                            <ul>
                                <li>
                                    <span className={"name"}><img src={nickname}></img>阿豪</span>
                                </li>
                                <li><span> <img className={"mail"} src={mail}></img>1234567@gmail</span></li>
                                <li><span><img className={"phone"} src={phone}></img>0977565089</span></li>
                            </ul>
                        </div>
                        <div className={"row2"}>
                            <ul>
                                <li><span className={"infoText"}>陳建豪 #123456</span></li>
                                <li><img src={location}></img><span className={"infoText"}>台北市大安區建國南路二段125號</span></li>
                            </ul>
                        </div>

                    </div>
                </div>
                <div className={"downContent"}>
                    <div className={"detail"}>
                        <table cellspacing="25">

                            <tbody>
                            <tr>
                                <td>預約日期</td>
                                <td>2022/06/29</td>
                            </tr>
                            <tr>
                                <td>預約時間</td>
                                <td>18:00:00</td>
                            </tr>
                            <tr>
                                <td>時數</td>
                                <td>01:00:00</td>
                            </tr>
                            <tr>
                                <td>諮商種類</td>
                                <td>諮商</td>
                            </tr>
                            <tr>
                                <td>狀態</td>
                                <td>待確認</td>
                            </tr>
                            <tr>
                                <td>金額</td>
                                <td>2,200NTD</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className={"problem"}>
                        <div className={"titleLabel"}>問題描述</div>
                        <textarea className={"problem-text"}

                                  disabled={true}>
                最近不知道是不是因為工作壓力又與女朋友吵架導致我每天都 失眠...食慾也不加，我是不是有憂郁症？
                    </textarea>

                    </div>
                </div>
                <div className={"button-content"}>
                    <button className={"finishButton"} onClick={() => finish()}>完成查閱</button>
                    <button className={"acceptButton"} onClick={() => accept()}>確認接受</button>

                </div>

            </div>
        </ThemeProvider>

    )
        ;
}

export default AppointmentDetail

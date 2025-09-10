import "../login/login.css";
import img_logo from "../img/login/logo.svg";
import img_account from "../img/login/ic_identity.svg";
import img_password from "../img/login/ic_key.svg";
import img_email from "../img/login/ic_mail.svg";
import img_dropdown from "../img/login/caret.svg";
import img_background from "../img/login/login_background.svg";
import { counselorService, service } from "../../service/ServicePool";
import { showToast, toastType, checkPassword, checkEmail } from "../../common/method";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { message } from "antd";
import { counselorInfo } from "../../dataContract/counselor";
import { ForgetPassword, ResetPassword } from "../../dataContract/counselor";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
const tabType = Object.freeze({
    "login": "login",
    "register": "register",
    "forgetPassword": "forgetPassword",
});
const screenWidth = window.innerWidth;
function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [identity, setIdentity] = useState("");
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [selectedTab, setSelectedTab] = useState(tabType.login);
    const [email, setEmail] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);
    const [verifyCode, setVerifyCode] = useState("");
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [noticeMessage, setNoticeMessage] = useState("");
    const [rememberPassword, setRememberPassword] = useState(false);

    useEffect(() => {

        window.addEventListener('keypress', keyPressHandler);
        return () => {
            window.removeEventListener('keypress', keyPressHandler);
        }
    })
    const keyPressHandler = (e) => {
        if (e.key === 'Enter') {
            switch (selectedTab) {
                case tabType.login:
                    onClickLogin();
                    break;
                case tabType.register:
                    onClickRegister();
                    break;
                case tabType.forgetPassword:
                    onClickForget();
                    break;
                default:
                    break;
            }
        }
    };
    const onClickLogin = async () => {
        try {
            if (location.pathname.includes("login")) {
                // admin
                console.log("admin login");
                var res = await service.login(account, password)
                if (res.token?.AccessToken) {
                    message.success("登入成功!");
                    navigate("/admin", { replace: true });
                } else {
                    message.error("登入失敗!");
                }
            }
            else {
                counselorInfo.clearAll = null;
                var res = await counselorService.login(account, password);
                if (res.user_id) {
                    navigate("home", { replace: true });
                }
                else {
                    // if res is token, res.message is undefined => will not show toast
                    showToast(toastType.error, res.message);
                }
            }
        }
        catch (err) { // http status not 200
            console.log(err);
            showToast(toastType.error, "帳號密碼有誤");
        }
    }
    const checkAccountExist = async () => {
        let res = await counselorService.checkAccountExist(account);
        // console.log("res", res);
        return res;
    }
    const onClickRegister = async () => {
        // console.log(account);
        var errMsg = "";
        var noticeMsg = "";
        if (identity === "") {
            errMsg = "請選擇身份";

        }
        if (!checkPassword(password)) {
            errMsg = "密碼需包含英數且至少8個字元";
        }
        else if (password !== confirmedPassword) {
            errMsg = "密碼與確認密碼不一致";
        }
        else if (("true" === await checkAccountExist())) {
            errMsg = "該信箱已註冊。";
            noticeMsg = "不同身份需使用不同帳號，請更換信箱後再試一次。";
        }
        else {
            counselorInfo.clearAll = null;
            let result = await counselorService.register(account, password, identity);
            if (result.status !== 200) {
                errMsg = "註冊異常，請聯繫客服人員。";
            }
            else {
                showToast(toastType.success, "註冊成功，請登入並填寫基本資料");
                setSelectedTab(tabType.login);
            }
        }
        if (errMsg) {
            // showToast(toastType.error, errMsg);
            setNoticeMessage(noticeMsg);
            setErrorMessage(errMsg);
            setOpen(true);
        }
    }
    const onClickSignup = () => {
        setSelectedTab(tabType.register);
        clearVariables();
    }

    const onClickBack = () => {
        setSelectedTab(tabType.login);
        clearVariables();
    }
    const onClickForget = () => {
        setSelectedTab(tabType.forgetPassword);
        clearVariables();
        // showToast(toastType.warning, "目前尚未開放唷~");
    }
    const clearVariables = () => {
        setAccount("");
        setPassword("");
        setConfirmedPassword("");
        setEmail("");
        setVerifyCode("");
    }
    async function setTimeDown() {
        let seconds = 30;
        const interval = setInterval(() => {
            setTimeLeft(seconds);
            seconds--;
            if (seconds < 0) {
                clearInterval(interval);
            }
        }, 1000);
    }
    const onClickSendForgetPasswordRequest = () => {
        if (!checkEmail(email)) {
            showToast(toastType.error, "email格式有誤");
            return;
        }

        counselorService.requestForgetPassword(new ForgetPassword(email, account)).then((res) => {
            console.log("res", res);
            console.log("res.success", res.success);
            if (!res.success) {
                showToast(toastType.error, res.message);
            }
            else {
                showToast(toastType.success, "已發送驗證碼至您指定的信箱");
                setTimeDown();
            }
        })
    }
    const onClickResetPassword = () => {
        if (!checkPassword(password)) {
            showToast(toastType.error, "密碼需包含英數且至少8個字元");
            return;
        }
        counselorService.resetPassword(new ResetPassword(account, verifyCode, password)).then((res) => {
            if (!res.success) {
                showToast(toastType.error, res.message);
            }
            else {
                showToast(toastType.success, "重設密碼成功");
                setSelectedTab(tabType.login);
                clearVariables();
            }
        })
    }
    const renderLogin = () => {
        return (
            <div className={"R-row"} style={{ paddingTop: screenWidth > 500 ? 200 : 55 }}>
                <div className={"C-col"} style={{ marginBottom: 0 }}>
                    <img className="account-icon" src={img_email} alt="123"></img>
                    <input className={"input-account"} placeholder="信箱" type={"text"} onChange={(text) => setAccount(text.target.value.trim())} value={account}></input>
                </div>
                <div className={"C-col"} style={{ marginBottom: 29, marginTop: 10 }}>
                    <span style={{ fontSize: 16, zIndex: 998, color: " #353535", textAlign: "center" }}>{"※ 每個身份需使用對應帳號登入，系統會自動導向該身份後台。"}</span>
                </div>
                <div className={"C-col"} style={{ marginBottom: 12 }}>
                    <img className="password-icon" src={img_password} alt="123"></img>
                    <input className={"input-password"} placeholder="密碼" type={"password"} onChange={(text) => setPassword(text.target.value.trim())} value={password}></input>
                </div>
                <div className={"C-col"} style={{ marginBottom: 33 }}>
                    <span className={"forget-text"} style={{ color: " #353535" }} onClick={() => onClickForget()}>
                        忘記密碼?
                    </span>
                </div>
                <div className={"C-col"} style={{ marginBottom: 20, justifyContent: "flex-start", paddingLeft: screenWidth > 500 ? 0 : "18%" }}>
                    <label style={{ display: "flex", alignItems: "center", cursor: "pointer", fontSize: 18, color: "#353535" }}>
                        <input 
                            type="checkbox" 
                            checked={rememberPassword} 
                            onChange={(e) => setRememberPassword(e.target.checked)}
                            style={{ marginRight: 8, transform: "scale(1.2)" }}
                        />
                        記住密碼
                    </label>
                </div>
                <div className={"C-col"}>
                    <span>
                        <button className={"register-text"} onClick={() => onClickSignup()}>申請帳號</button>
                    </span>
                    <span className={"login-wrap"}>
                        <button className={"login"} onClick={() => onClickLogin()}>登入</button>
                    </span>
                </div>
            </div>);
    }
    const renderRegister = () => {
        return (
            <div className={"R-row"} style={{ paddingTop: 55 }}>
                <div className={"C-col"} style={{ marginBottom: 0 }}>
                    <img className="identity-icon" src={img_account} alt="123"></img>
                    <select class={identity === "" ? "select-option" : "input-identity"} placeholder="請選擇身份" onChange={(text) => setIdentity(text.target.value.trim())} value={identity}>
                        <option value="" selected="selected" hidden="hidden">請選擇身份</option>
                        <option value="Psychologist">心理師</option>
                        <option value="HeartCoach">心教練</option>
                    </select>
                </div>
                <div className={"C-col"} style={{ marginBottom: 29, marginTop: 12 }}>
                    <span style={{ fontSize: 16, zIndex: 998, textAlign: "center" }}>{"※ 如需註冊雙重身份，每個身份需使用不同信箱註冊"}</span>
                </div>
                <div className={"C-col"}>
                    <img className="account-icon" src={img_email} alt="123"></img>
                    <input className={"input-account"} placeholder="請輸入註冊信箱" type={"text"} onChange={(text) => setAccount(text.target.value.trim())} value={account}></input>
                </div>
                <div className={"C-col"}>
                    <img className="password-icon" src={img_password} alt="123"></img>
                    <input className={"input-password"} placeholder="請輸入密碼" type={"password"} onChange={(text) => setPassword(text.target.value.trim())} value={password}></input>
                </div>
                <div className={"C-col"} style={{ marginBottom: 86 }}>
                    <img className="password-icon" src={img_password} alt="123"></img>
                    <input className={"input-password"} placeholder="再次輸入密碼" type={"password"} onChange={(text) => setConfirmedPassword(text.target.value.trim())} value={confirmedPassword}></input>
                </div>
                <div className={"C-col"}>
                    <span>
                        <button className={"back-text"} onClick={() => onClickBack()}>返回</button>
                    </span>
                    <span className={"login-wrap"}>
                        <button className={"login"} onClick={() => onClickRegister()}>註冊</button>
                    </span>
                </div>
            </div>);
    }
    const renderForget = () => {
        return (
            <div className={"R-row"} style={{ paddingTop: screenWidth > 500 ? 200 : 55 }}>
                <div className={"C-col"}>
                    <img className="account-icon" src={img_account} alt="123"></img>
                    <input className={"input-account"} placeholder="信箱" type={"text"} onChange={(text) => setAccount(text.target.value.trim())} value={account}></input>
                </div>
                <div className={"C-col"}>
                    <img className="email-icon" src={img_email} alt="123"></img>
                    <input className={"input-email"} placeholder="E-MAIL" type={"email"} onChange={(text) => setEmail(text.target.value.trim())} value={email}></input>
                </div>
                <div className={"C-col"}>
                    <span className={"send-wrap"}>
                        <button className={"send"} style={{ color: timeLeft > 0 ? "ButtonShadow" : null }} disabled={timeLeft > 0} onClick={() => onClickSendForgetPasswordRequest()}> {timeLeft > 0 ? `取得驗證碼(${timeLeft}秒)` : "取得驗證碼"}</button>
                    </span>
                </div>
                <div>
                    <div className={"C-col"}>
                        <img className="password-icon" src={img_password} alt="123"></img>
                        <input className={"input-account"} placeholder="六位數驗證碼" type={"text"} maxLength={6} onChange={(text) => setVerifyCode(text.target.value.trim())} value={verifyCode}></input>
                    </div>
                    <div className={"C-col"}>
                        <img className="password-icon" src={img_password} alt="123"></img>
                        <input className={"input-password"} placeholder="新密碼" type={"password"} onChange={(text) => setPassword(text.target.value.trim())} value={password}></input>
                    </div>
                    <div className={"C-col"}>
                        <span>
                            <button className={"back-text"} onClick={() => onClickBack()}>返回</button>
                        </span>
                        <span className={"login-wrap"}>
                            <button className={"login"} onClick={() => onClickResetPassword()}>重設密碼</button>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
    const renderScreen = (selectedTab) => {
        switch (selectedTab) {
            case tabType.login:
                return renderLogin();
            case tabType.register:
                return renderRegister();
            case tabType.forgetPassword:
                return renderForget();
            default:
                return renderLogin();
        }
    }
    const ErrorDialog = () => {
        return <Dialog
            open={open}
            fullWidth={true}
            onClose={handleClose}
            value={"sm"}>
            <DialogTitle style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }} id="alert-dialog-title">{"註冊失敗"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <div style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}>
                        <div style={{ marginBottom: 20 }}>
                            <p style={{ color: "#000000", margin: 0 }}>{errorMessage}</p>
                            <p style={{ color: "#000000", margin: 0 }}>{noticeMessage}</p>
                        </div>
                    </div>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <div className={"button-content"}>
                    <button className={"acceptButton"} onClick={handleClose} color="primary">
                        確認
                    </button>
                </div>
            </DialogActions>
        </Dialog>
    }
    const handleClose = () => {
        setErrorMessage("");
        setOpen(false);
    }
    return (
        <div class="container-fluid" style={{ height: 1024, backgroundColor: "#f7f8f8", paddingLeft: 0 }}>
            {screenWidth > 500 ?
                <div className={"content"} >
                    <div class="row" >
                        <img style={{ height: 29, width: "100%", marginTop: 87 }} src={img_logo} alt="123" />
                    </div>
                    <div>
                        <p class="login-title">
                            專業人士後台
                        </p>
                    </div>
                    {renderScreen(selectedTab)}
                    {/* <div style={{ alignSelf: "center", justifyItems: "center", textAlign: "center", position: "absolute", top: 900, color: "#a3a2a3", fontSize: 14 }}>
                        <div>
                            Copyright © 2023 Couchspace All rights reserved
                        </div>
                    </div> */}
                </div>
                :
                <div class="col-sm-12 h-100 align-items-center" style={{ justifyItems: "center" }}>
                    <div class="row">
                        <img style={{ height: 29, width: 240, marginTop: 47 }} src={img_logo} alt="123" />
                    </div>
                    <div>
                        <p class="login-title">
                            專業人士後台
                        </p>
                    </div>
                    {renderScreen(selectedTab)}
                    {/* <div class="row" style={{ width: "100%", alignSelf: "center", justifyItems: "center", textAlign: "center", position: "absolute", top: 800, color: "#a3a2a3", fontSize: 14 }}>
                        <div>
                            Copyright © 2023 Couchspace All rights reserved
                        </div>
                    </div> */}
                </div>
            }
            {ErrorDialog()}
        </div>
    )
}


export default Login;

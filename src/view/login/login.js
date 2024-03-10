import "../login/login.css";
import img_logo from "../img/login/login.svg";
import img_account from "../img/login/account.svg";
import img_password from "../img/login/password.svg";
import img_email from "../img/login/email.svg";
import { counselorService } from "../../service/ServicePool";
import { showToast, toastType, checkPassword, checkEmail } from "../../common/method";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { counselorInfo } from "../../dataContract/counselor";
import { ForgetPassword, ResetPassword } from "../../dataContract/counselor";
const tabType = Object.freeze({
    "login": "login",
    "register": "register",
    "forgetPassword": "forgetPassword",
});
function Login() {
    const navigate = useNavigate();
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [selectedTab, setSelectedTab] = useState(tabType.login);
    const [email, setEmail] = useState("");
    const [isSend, setIsSend] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [verifyCode, setVerifyCode] = useState("");
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
            counselorInfo.clearAll = null;
            // showToast(toastType.error, "213123");
            // showToast(toastType.info, "213123");
            // showToast(toastType.success, "213123");
            // showToast(toastType.warning, "213123");
            // if (!checkEmail(account)) {
            //     showToast(toastType.error, "email格式有誤");
            // }
            // console.log("account", account);
            // console.log("password", password);
            // if (!checkPassword(password)) {
            //     showToast(toastType.error, "密碼需包含英數且至少8個字元");
            // }
            // else {
            var res = await counselorService.login(account, password);
            if (res.user_id) {
                navigate("home", { replace: true });
            }
            else {
                // if res is token, res.message is undefined => will not show toast
                showToast(toastType.error, res.message);
            }
            // }
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
        if (!checkPassword(password)) {
            showToast(toastType.error, "密碼需包含英數且至少8個字元");
        }
        else if (password !== confirmedPassword) {
            showToast(toastType.error, "密碼與確認密碼不一致");
        }
        else if (("true" === await checkAccountExist())) {
            showToast(toastType.error, "此帳號已註冊過");
        }
        else {
            counselorInfo.clearAll = null;
            navigate("register", { replace: false, state: { email: account, password: password } });
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
        setIsSend(false);
    }
    async function setTimeDown() {
        let seconds = 30;
        setIsSend(true);
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
            <div className={"R-row"}>
                <div className={"C-col"}>
                    <img className="account-icon" src={img_account} alt="123"></img>
                    <input className={"input-account"} placeholder="帳號" type={"text"} onChange={(text) => setAccount(text.target.value.trim())} value={account}></input>
                </div>
                <div className={"C-col"}>
                    <img className="password-icon" src={img_password} alt="123"></img>
                    <input className={"input-password"} placeholder="密碼" type={"password"} onChange={(text) => setPassword(text.target.value.trim())} value={password}></input>
                </div>
                <div className={"C-col"}>
                    <span className={"forget-text"} onClick={() => onClickForget()}>
                        忘記密碼?
                    </span>
                </div>
                <div className={"C-col"}>
                    <span className={"register-text"} onClick={() => onClickSignup()}>
                        申請帳號
                    </span>
                    <span className={"login-wrap"}>
                        <button className={"login"} onClick={() => onClickLogin()}>登入</button>
                    </span>
                </div>
            </div>);
    }
    const renderRegister = () => {
        return (
            <div className={"R-row"}>
                <div className={"C-col"}>
                    <img className="account-icon" src={img_account} alt="123"></img>
                    <input className={"input-account"} placeholder="帳號" type={"text"} onChange={(text) => setAccount(text.target.value.trim())} value={account}></input>
                </div>
                <div className={"C-col"}>
                    <img className="password-icon" src={img_password} alt="123"></img>
                    <input className={"input-password"} placeholder="密碼" type={"password"} onChange={(text) => setPassword(text.target.value.trim())} value={password}></input>
                </div>
                <div className={"C-col"}>
                    <img className="password-icon" src={img_password} alt="123"></img>
                    <input className={"input-password"} placeholder="確認密碼" type={"password"} onChange={(text) => setConfirmedPassword(text.target.value.trim())} value={confirmedPassword}></input>
                </div>
                <div className={"C-col"}>
                    <span className={"back-text"} onClick={() => onClickBack()}>
                        返回
                    </span>
                    <span className={"login-wrap"}>
                        <button className={"login"} onClick={() => onClickRegister()}>註冊</button>
                    </span>
                </div>
            </div>);
    }
    const renderForget = () => {
        return (
            <div className={"R-row"}>
                <div className={"C-col"}>
                    <img className="account-icon" src={img_account} alt="123"></img>
                    <input className={"input-account"} placeholder="帳號" type={"text"} onChange={(text) => setAccount(text.target.value.trim())} value={account}></input>
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
                        <span className={"back-text"} onClick={() => onClickBack()}>
                            返回
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
    return (
        <div className={"content"}>
            <img className={"login-logo"} src={img_logo} alt="123" />
            <div className={"circle"}>
                <div className={"circle2"}></div>
            </div>
            {renderScreen(selectedTab)}
            <h4 className={"copyRight"}>Copyright © 2023 Couchspace All rights reserved</h4>
        </div>);
}


export default Login;

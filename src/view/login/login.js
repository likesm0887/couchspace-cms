import "../login/login.css";
import img_logo from "../img/login/login.svg";
import img_account from "../img/login/account.svg";
import img_password from "../img/login/password.svg";
import { counselorService } from "../../service/ServicePool";
import { showToast, toastType, checkPassword } from "../../common/method";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { counselorInfo } from "../../dataContract/counselor";
function Login() {
    const navigate = useNavigate();
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    useEffect(() => {

        window.addEventListener('keypress', keyPressHandler);
        return () => {
            window.removeEventListener('keypress', keyPressHandler);
        }
    })
    const keyPressHandler = (e) => {
        if (e.key === 'Enter') {
            if (isLogin) {
                onClickLogin();
            }
            else {
                onClickRegister();
            }
        }
    };
    const onClickLogin = async () => {
        try {
            // showToast(toastType.error, "213123");
            // showToast(toastType.info, "213123");
            // showToast(toastType.success, "213123");
            // showToast(toastType.warning, "213123");
            // if (!checkEmail(account)) {
            //     showToast(toastType.error, "email格式有誤");
            // }
            console.log("account", account);
            console.log("password", password);
            if (!checkPassword(password)) {
                showToast(toastType.error, "密碼需包含英數且至少8個字元");
            }
            else {
                console.log("account", account);
                console.log("password", password);
                var res = await counselorService.login(account, password);
                var info = await counselorService.getCounselorInfo();
                counselorInfo.setCounselorInfo = info;
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
        console.log("res", res);
        return res;
    }
    const onClickRegister = async () => {
        console.log(account);
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
        setIsLogin(false);
        setAccount("");
        setPassword("");
        setConfirmedPassword("");
    }

    const onClickBack = () => {
        setIsLogin(true);
        setAccount("");
        setPassword("");
        setConfirmedPassword("");
    }
    const onClickForget = () => {
        showToast(toastType.warning, "目前尚未開放唷~");
    }
    const renderLogin = () => {
        return (
            <div className={"R-row"}>
                <div className={"C-col"}>
                    <img className="account-icon" src={img_account} alt="123"></img>
                    <input className={"input-account"} placeholder="abc@gmail.com" type={"text"} onChange={(text) => setAccount(text.target.value.trim())} value={account}></input>
                </div>
                <div className={"C-col"}>
                    <img className="password-icon" src={img_password} alt="123"></img>
                    <input className={"input-password"} placeholder="PASSWORD" type={"password"} onChange={(text) => setPassword(text.target.value.trim())} value={password}></input>
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
                    <input className={"input-account"} placeholder="abc@gmail.com" type={"text"} onChange={(text) => setAccount(text.target.value.trim())} value={account}></input>
                </div>
                <div className={"C-col"}>
                    <img className="password-icon" src={img_password} alt="123"></img>
                    <input className={"input-password"} placeholder="PASSWORD" type={"password"} onChange={(text) => setPassword(text.target.value.trim())} value={password}></input>
                </div>
                <div className={"C-col"}>
                    <img className="password-icon" src={img_password} alt="123"></img>
                    <input className={"input-password"} placeholder="CONFIRMED PASSWORD" type={"password"} onChange={(text) => setConfirmedPassword(text.target.value.trim())} value={confirmedPassword}></input>
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
    return (
        <div className={"content"}>
            <img className={"login-logo"} src={img_logo} alt="123" />
            <div className={"circle"}>
                <div className={"circle2"}></div>
            </div>
            {isLogin ? renderLogin() : renderRegister()}
            <h4 className={"copyRight"}>Copyright © 2018 RoseWang All rights reserved</h4>
        </div>);
}


export default Login;

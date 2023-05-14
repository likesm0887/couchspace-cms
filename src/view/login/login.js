import "../login/login.css";
import img_logo from "../img/login/login.svg";
import img_account from "../img/login/account.svg";
import img_password from "../img/login/password.svg";
import { counselorService } from "../../service/ServicePool";
import { showToast, toastType } from "../../common/method";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
function Login() {
    const navigate = useNavigate();
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");

    const onClickLogin = async () => {
        // showToast(toastType.error, "213123");
        // showToast(toastType.info, "213123");
        // showToast(toastType.success, "213123");
        // showToast(toastType.warning, "213123");
        console.log("account", account);
        console.log("password", password);
        var res = await counselorService.login(account, password);
        console.log("res", res);
        if (res.user_id) {
            navigate("home", { replace: true });
        }
        else {
            // if res is token, res.message is undefined => will not show toast
            showToast(toastType.error, res.message);
        }
    }
    const onClickRegister = () => {
        navigate("register", { replace: false });

    }
    return (
        <div className={"content"}>
            <img className={"login-logo"} src={img_logo} alt="123" />
            <div className={"circle"}>
                <div className={"circle2"}></div>
            </div>
            <div className={"outInput"}>
                <img className="account-icon" src={img_account} alt="123"></img>
                <input className={"input-account"} placeholder="ACCOUNT" type={"text"} onChange={(text) => setAccount(text.target.value.trim())}></input>
            </div>
            <div>
                <img className="password-icon" src={img_password} alt="123"></img>
                <input className={"input-password"} placeholder="PASSWORD" type={"password"} onChange={(text) => setPassword(text.target.value.trim())}></input>
            </div>

            <span className={"login-wrap"}>
                <button className={"login"} onClick={() => onClickLogin()}>登入</button>
            </span>
            <h4 className={"register"}>
                <span className={"register-text"} onClick={() => onClickRegister()}>
                    申請帳號
                </span>
            </h4>
            <h4 className={"copyRight"}>Copyright © 2018 RoseWang All rights reserved</h4>
        </div>
    );
}

export default Login;

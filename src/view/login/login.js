import "../login/login.css"
import logo from "../img/login/login.svg"
import account from "../img/login/account.svg"
import password from "../img/login/password.svg"
function Login() {

    const login = () => {
        window.location="/home"
    }
    return (
        <div className={"content"}>
            <img className={"login-logo"} src={logo}/>
            <div className={"circle"}>
                <div className={"circle2"}></div>
            </div>
            <div className={"outInput"}>
                <img  className="account-icon" src={account}></img>
                <input className={"input-account"} placeholder="ACCOUNT" type={"text"}></input>
            </div>
            <div>
                <img className="password-icon" src={password}></img>
                <input className={"input-password"} placeholder="PASSWORD" type={"password"}></input>
            </div>

            <span className={"login-wrap"}>
                <button className={"login"} onClick={()=>login()}>登入</button>
            </span>


        </div>

    );
}

export default Login;

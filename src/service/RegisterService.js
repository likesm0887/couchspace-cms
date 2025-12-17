import cookie from "react-cookies";
import { adminAuthentication } from "../utility/ProtectedRoute";

export class RegisterService {
  constructor(base_url) {
    this.base_url = base_url;
  }

  login(account, password) {
    const api = this.base_url + "/api/v1/login";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Email: account, Password: password }),
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        this.token = result.token;
        console.log("token:" + this.token.AccessToken);
        cookie.save("token", this.token.AccessToken);
        cookie.save("admin_userId", result.user_id);
        adminAuthentication.updateAuthentication(true);
        console.log("update auth", adminAuthentication.isAuthenticated);
        return result;
      });
  }
}

export default RegisterService;

import cookie from "react-cookies";
import { appointmentService } from "./ServicePool";
import { ForgetPassword, ResetPassword } from "../dataContract/counselor";
import { jwtDecode } from "jwt-decode";
import { counselorAuthentication } from "../utility/ProtectedRoute";
export class CounselorService {
  constructor(base_url) {
    this.base_url = base_url;
    this.token = cookie.load("token_counselor");
    this.adminToken = cookie.load("token");
    console.log("token_counselor cookie:" + this.token);
  }

  checkCounselorTokenExpired() {
    console.log("checkCounselorTokenExpired");
    this.token = cookie.load("token_counselor");
    if (this.token === undefined || this.token === "") {
      return true;
    }
    console.log("counselor token:", this.token);
    let decodedPayload = jwtDecode(this.token);
    console.log("decodedPayload", decodedPayload);
    const { exp } = decodedPayload;

    const currentTime = Math.floor(Date.now() / 1000);
    console.log("current time", currentTime);

    if (exp && currentTime >= exp) {
      console.log("Token has expired. Perform logout action.");
      return true;
    } else {
      console.log("Token is still valid.");
      return false;
    }
  }
  register(account, password, identity) {
    const api = this.base_url + "/api/v1/counselors/register";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Email: account,
        Password: password,
        SubRole: identity,
      }),
    };

    return fetch(api, requestOptions);
  }
  login(account, password) {
    const api = this.base_url + "/api/v1/counselors/login";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Email: account, Password: password }),
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((result) => {
        this.token = result.token.AccessToken;
        appointmentService.setToken(result.token.AccessToken);
        counselorAuthentication.updateAuthentication(true);
        cookie.save("token_counselor", result.token.AccessToken);
        return result;
      });
  }
  logout() {
    counselorAuthentication.updateAuthentication(false);
    cookie.remove("token_counselor");
  }
  /**
   * Get Counselor Info, called by Admin
   * @param {*} id Counselor ID
   * @returns
   */
  getCounselorInfoById(id) {
    if (cookie.load("token") === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/counselor/" + id;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  }
  /**
   * Get All Counselor Info, called by Admin
   * @param {*} isFilterUnVerify Filter Unverified Counselor
   * @returns
   */
  getAllCounselorInfo(isFilterUnVerify) {
    console.log(this.adminToken);
    if (cookie.load("token") === undefined) {
      return;
    }
    console.log(isFilterUnVerify ? "Y" : "N");
    const api =
      this.base_url +
      "/api/v1/counselors/all?isFilterUnVerify=" +
      (isFilterUnVerify ? "Y" : "N");

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  }
  /**
   * Set Counselor is verified, called by Admin
   * @param {*} id Counselor ID
   * @param {*} verify
   * @returns
   */
  setCounselorVerify(id, verify) {
    if (cookie.load("token") === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/counselors/verify";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        CounselorId: id,
        Verify: verify,
      }),
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        console.log("res", res);
        return res;
      });
  }
  /**
   * Get Counselor is verified, called by Admin
   * @param {*} id Counselor ID
   * @returns
   */
  getCounselorVerify(id) {
    if (id == null || id == "") {
      return;
    }
    console.log(this.token);
    if (cookie.load("token") === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/counselors/verify/" + id;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  }
  /**
   * Get Counselor Appointment Time, called by Admin
   * @param {*} id Counselor ID
   * @returns
   */
  getAppointmentTimeById(id) {
    if (cookie.load("token") === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/appointmentTime/" + id;
    console.log(api);
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        console.log("res", res);
        return res;
      });
  }
  /**
   * Get Counselor Calender, called by Admin
   * @param {*} id
   * @returns
   */
  getCalenderById(id) {
    if (cookie.load("token") === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/calender/" + id;
    console.log(api);
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        console.log("res", res);
        return res;
      });
  }
  /**
   * Get Current Counselor Info, called by User
   * @returns
   */
  getCounselorInfo() {
    if (this.token === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/counselors";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: this.token,
        "Content-Type": "application/json",
      },
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  }
  /**
   * Update Current Counselor Info, called by User
   * @param {*} counselorInfo
   * @returns
   */
  updateCounselorInfo(counselorInfo) {
    if (this.token === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/counselors";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: this.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(counselorInfo),
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        console.log("res", res);
        return res;
      });
  }
  /**
   * Update Current Counselor Appointment Time, called by User
   * @param {*} businessTimes
   * @returns
   */
  setAppointmentTime(businessTimes) {
    if (this.token === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/appointmentTime";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: this.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(businessTimes),
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        console.log("res", res);
        return res;
      });
  }
  /**
   * Get Current Counselor Appointment Time, called by User
   * @returns
   */
  getAppointmentTime() {
    if (this.token === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/appointmentTime";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: this.token,
        "Content-Type": "application/json",
      },
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        console.log("res", res);
        console.log("type of res", typeof res);
        return res;
      });
  }
  /**
   * Upload Image to Blob and Get Url, called by User
   * @param {*} file
   * @returns
   */
  upload(file) {
    if (this.token === undefined) {
      return;
    }
    var data = new FormData();
    data.append("myFile", file);
    data.append("baseUrl", this.base_url);
    const api = this.base_url + "/api/v1/counselors/photo";
    const requestOptions = {
      method: "POST",
      headers: { Authorization: this.token },
      body: data,
    };
    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  }
  /**
   * Get User's Info, called by User
   * @param {*} userId
   * @returns
   */
  getGetUserById(userId) {
    if (this.token === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/members/information/" + userId;
    const requestOptions = {
      method: "Get",
      headers: {
        Authorization: this.token,
        "Content-Type": "application/json",
      },
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        cookie.save("Info", JSON.stringify(res));
        return res;
      });
  }
  /**
   * Check Account is existed, called by Anybody
   * @param {*} account
   * @returns
   */
  checkAccountExist(account) {
    const api = this.base_url + "/api/v1/counselors/checkAccountExist";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Account: account }),
    };
    return fetch(api, requestOptions)
      .then((res) => res.text())
      .then((res) => {
        return res;
      });
  }
  /**
   * Request for Forget Password Procedure, called by Anybody
   * @param {*} data
   * @returns
   */
  requestForgetPassword(data: ForgetPassword) {
    const api = this.base_url + "/api/v1/counselors/forget";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        console.log("type of res", typeof res);
        return res;
      });
  }
  /**
   * Reset Password for Certain Account, called by Anybody
   * @param {*} data Target Account need to be reset
   * @returns
   */
  resetPassword(data: ResetPassword) {
    console.log("data", data);
    const api = this.base_url + "/api/v1/counselors/resetPassword";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  }
}

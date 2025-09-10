import cookie from "react-cookies";

export class AppointmentService {
  constructor(base_url) {
    this.base_url = base_url;
    this.token = cookie.load("token_counselor");
    this.adminToken = cookie.load("token");
  }
  setToken(token_counselor) {
    this.token = token_counselor;
  }
  getAllAppointment() {
    const api =
      this.base_url +
      "/api/v1/appointments/all/UnPaid;roomCreated;Confirmed;Completed;CANCELLED";
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
        return res;
      });
  }
  getAllAppointmentForAdmin() {
    const api =
      this.base_url +
      "/api/v1/appointments/all/UnPaid;roomCreated;Confirmed;Completed;CANCELLED";
    const requestOptions = {
      method: "Get",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  }
  getAppointmentsByCounselorId(id) {
    if (id == null) {
      return;
    }
    const api =
      this.base_url +
      "/api/v1/appointments/all/" +
      id +
      "/roomCreated;Confirmed;Completed";
    const requestOptions = {
      method: "Get",
      headers: {
        Authorization: this.token_counselor,
        "Content-Type": "application/json",
      },
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  }
  getAppointmentsByCounselorIdByAdmin(id) {
    const api =
      this.base_url +
      "/api/v1/appointments/all/" +
      id +
      "/roomCreated;Confirmed;Completed";
    const requestOptions = {
      method: "Get",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  }
  getAppointment(AppointmentId) {
    const api = this.base_url + "/api/v1/appointments/" + AppointmentId;
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
        return res;
      });
  }

  async getAppointmentRoomToken(AppointmentId, Type) {
    const api =
      this.base_url +
      "/api/v1/appointments/" +
      AppointmentId +
      "/roomToken?sdkType=" +
      Type;
    const requestOptions = {
      method: "Get",
      headers: {
        Authorization: this.token,
        "Content-Type": "application/json",
      },
    };
    return (await fetch(api, requestOptions)).json();
  }

  async changeAppointmentTime(time) {
    console.log(time);
    const api = this.base_url + "/api/v1/appointments/time";
    const requestOptions = {
      method: "POST",
      body: JSON.stringify(time),
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
    };
    return (await fetch(api, requestOptions)).json();
  }

  async changeAdminFlag(changeAdminFlag) {
    console.log(changeAdminFlag);
    const api = this.base_url + "/api/v1/appointments/admin-flag";
    const requestOptions = {
      method: "PUT",
      body: JSON.stringify(changeAdminFlag),
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
    };
    return (await fetch(api, requestOptions)).json();
  }
}

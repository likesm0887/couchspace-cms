import cookie from "react-cookies";

export class MemberService {
  constructor(base_url) {
    this.base_url = base_url;
    this.token = cookie.load("token");
    console.log("cookie:" + cookie.load("token"));
  }
  getActiveUserCount() {
    if (cookie.load("token") === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/members/activeUser";
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

  getGetAllUser = async () => {
    // const info = cookie.load("Info");
    // if (info !== undefined) {
    //     return JSON.parse(info)
    // }
    if (cookie.load("token") === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/members/all";
    const requestOptions = {
      method: "Get",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
    };

    const res = await fetch(api, requestOptions);
    const data = await res.json();
    return data;
  };

  getGetUserById(userId) {
    // const info = cookie.load("Info");
    // if (info !== undefined) {
    //     return JSON.parse(info)
    // }
    console.log("token:" + cookie.load("token"));
    if (cookie.load("token") === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/members/information/" + userId;
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
        cookie.save("Info", JSON.stringify(res));
        return res;
      });
  }

  setMembership(memberships) {
    const api = this.base_url + "/api/v1/members/membership";
    const requestOptions = {
      method: "Post",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(memberships),
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        cookie.save("Info", JSON.stringify(res));
        return res;
      });
  }
  uploadMembership(file) {
    const api = this.base_url + "/api/v1/members/excel/membership";
    const requestOptions = {
      method: "Post",
      headers: {
        Authorization: cookie.load("token"),
      },
      body: file,
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        cookie.save("Info", JSON.stringify(res));
        return res;
      });
  }

  getGetAllPromoCode() {
    if (cookie.load("token") === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/members/promo-codes";
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
        cookie.save("Info", JSON.stringify(res));
        return res;
      });
  }
  updatePromoCode(input) {
    const api = this.base_url + "/api/v1/members/promo-codes";
    const requestOptions = {
      method: "Put",
      headers: {
        Authorization: cookie.load("token"),
      },
      body: JSON.stringify(input),
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        cookie.save("Info", JSON.stringify(res));
        return res;
      });
  }
  addPromoCode(input) {
    console.log(input);
    const api = this.base_url + "/api/v1/members/promo-codes";
    const requestOptions = {
      method: "Post",
      headers: {
        Authorization: cookie.load("token"),
      },
      body: JSON.stringify(input),
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        cookie.save("Info", JSON.stringify(res));
        return res;
      });
  }

  getPromoCode(id) {
    if (cookie.load("token") === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/members/promo-code/" + id;
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
        cookie.save("Info", JSON.stringify(res));
        return res;
      });
  }
}

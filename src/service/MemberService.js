import cookie from "react-cookies";

export class MemberService {
  constructor(base_url) {
    this.base_url = base_url;
    this.token = cookie.load("token");
    console.log("cookie:" + this.token);
  }

  getGetAllUser() {
    // const info = cookie.load("Info");
    // if (info !== undefined) {
    //     return JSON.parse(info)
    // }
    if (this.token === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/members/all";
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

  getGetUserById(userId) {
    // const info = cookie.load("Info");
    // if (info !== undefined) {
    //     return JSON.parse(info)
    // }
    if (this.token === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/members/" + userId;
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

  setMembership(memberships) {
    const api = this.base_url + "/api/v1/members/membership";
    const requestOptions = {
      method: "Post",
      headers: {
        Authorization: this.token,
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
  uploadMembership(file){
    const api = this.base_url + "/api/v1/members/excel/membership";
    const requestOptions = {
      method: "Post",
      headers: {
        Authorization: this.token,
      
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
}

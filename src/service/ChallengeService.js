import cookie from "react-cookies";

export class ChallengeService {
  constructor(base_url) {
    this.base_url = base_url;
  }

  // 取得所有挑戰
  getAllChallenges() {
    const api = this.base_url + "/api/v1/meditation/challenges";
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
        return res;
      });
  }

  // 建立挑戰
  createChallenge(challenge) {
    const api = this.base_url + "/api/v1/meditation/challenges";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(challenge),
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  }

  // 更新挑戰
  updateChallenge(challenge) {
    const api = this.base_url + "/api/v1/meditation/challenges";
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(challenge),
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  }

  // 刪除挑戰
  deleteChallenge(challengeId) {
    const api = this.base_url + `/api/v1/meditation/challenges/${challengeId}`;
    const requestOptions = {
      method: "DELETE",
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

  // 上傳挑戰圖片
  uploadChallengeImage(file) {
    const api = this.base_url + "/api/v1/meditation/challenges/upload";
    const formData = new FormData();
    formData.append("file", file);

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: cookie.load("token"),
      },
      body: formData,
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  }
}
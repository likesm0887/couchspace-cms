import cookie from "react-cookies";
export class MeditationService {
  constructor(base_url) {
    this.base_url = base_url;
    this.token = cookie.load("token");
    console.log("cookie:" + this.token);
  }

  getAllMusic() {
    // const info = cookie.load("Info");
    // if (info !== undefined) {
    //     return JSON.parse(info)
    // }
    if (this.token === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1//meditation/musics";
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

  createCourse(course) {
    const api = this.base_url + "/api/v1/meditation/courses";
    const requestOptions = {
      method: "Post",
      headers: {
        Authorization: this.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(course),
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  }

  updateCourse(course) {
    const api = this.base_url + "/api/v1/meditation/course";
    const requestOptions = {
      method: "Put",
      headers: {
        Authorization: this.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(course),
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((result) => {});
  }

  createMusic(music) {
    const api = this.base_url + "/api/v1/meditation/musics";
    const requestOptions = {
      method: "Post",
      headers: {
        Authorization: this.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(music),
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((result) => {});
  }

  updateMusic(music) {
    console.log(music);
    const api = this.base_url + "/api/v1/meditation/musics";
    const requestOptions = {
      method: "Put",
      headers: {
        Authorization: this.token,
        "Content-Type": "application/json",
      },

      body: JSON.stringify(music),
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((result) => {});
  }

  getAllCourse() {
    if (this.token === undefined) {
      return;
    }
    const api =
      this.base_url +
      "/api/v1/meditation/courses/searches?limit=1000&offset=0&order_by=desc";
    const requestOptions = {
      method: "Post",
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

  getMusicTrend(musicId) {
    if (this.token === undefined) {
      return;
    }
    const api = this.base_url +
      "/api/v1/log/record/"+musicId;
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
  getMusicById(musicId) {
    if (this.token === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/meditation/musics/" + musicId;

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
  getCourseById(courseId) {
    if (this.token === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/meditation/courses/" + courseId;

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
  addMusicInCourse(addMusicInCourse) {
    console.log(addMusicInCourse);
    const api = this.base_url + "/api/v1/meditation/courses/music";
    const requestOptions = {
      method: "Post",
      headers: {
        Authorization: this.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addMusicInCourse),
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  }

  batchQueryMusic(musicIds) {
    if (this.token === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/meditation/musics/batch";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: this.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(musicIds),
    };

    return fetch(api, requestOptions)
      .catch((err) => console.log(err))
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  }

  batchQueryCourses(courseIds) {
    if (this.token === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/meditation/courses/batch";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: this.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courseIds),
    };

    return fetch(api, requestOptions)
      .catch((err) => console.log(err))
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  }

  getAllCategory() {
    // const info = cookie.load("Info");
    // if (info !== undefined) {
    //     return JSON.parse(info)
    // }
    if (this.token === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/meditation/categories";
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

  createCategory(category) {
    // const info = cookie.load("Info");
    // if (info !== undefined) {
    //     return JSON.parse(info)
    // }
    if (this.token === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/meditation/categories";
    const requestOptions = {
      method: "Post",
      headers: {
        Authorization: this.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  }
  updateCategory(category) {
    console.log(category);
    if (this.token === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/meditation/categories";
    const requestOptions = {
      method: "Put",
      headers: {
        Authorization: this.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  }
  createTeacher(teacher) {
    console.log(teacher);
    if (this.token === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/meditation/teachers";
    const requestOptions = {
      method: "Post",
      headers: {
        Authorization: this.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teacher),
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  }

  getAllTeacher() {
    if (this.token === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/meditation/teachers";
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
  getTeacherById(teacherId) {
    if (this.token === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/meditation/teachers/" + teacherId;
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
  updateTeacher(teacher) {
    if (this.token === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/meditation/teachers";
    const requestOptions = {
      method: "Put",
      headers: {
        Authorization: this.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teacher),
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  }

  getCommonData() {
    if (this.token === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/meditation/noFilterBanner";
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


  updateCommonData(commonData) {
    if (this.token === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/meditation/common";
    const requestOptions = {
      method: "Post",
      headers: {
        Authorization: this.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commonData),
    };

    return fetch(api, requestOptions)
     
      .then((res) => {
        return res;
      });
  }

  getMusicRecordExcel() {
    console.log("HIHIH")
    if (this.token === undefined) {
      return;
    }
    const api = this.base_url + "/api/v1/trigger/printAll";
    console.log(api)
    const requestOptions = {
      method: "Get",
      headers: {
        Authorization: this.token,
        
      },
    };

    return fetch(api, requestOptions)
  }

}

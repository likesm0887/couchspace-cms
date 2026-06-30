import cookie from "react-cookies";
export class MeditationService {
  constructor(base_url) {
    this.base_url = base_url;
    console.log("cookie:" + cookie.load("token"));
  }

  getAllMusic() {
    // const info = cookie.load("Info");
    // if (info !== undefined) {
    //     return JSON.parse(info)
    // }

    const api = this.base_url + "/api/v1/meditation/musics";
    const requestOptions = {
      method: "Get",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
    };

    return fetch(api, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        return res;
      });
  }

  createCourse(course) {
    const api = this.base_url + "/api/v1/meditation/courses";
    const requestOptions = {
      method: "Post",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(course),
    };

    return fetch(api, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => {
        return result;
      });
  }

  updateCourse(course) {
    const api = this.base_url + "/api/v1/meditation/course";
    const requestOptions = {
      method: "Put",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(course),
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((result) => result);
  }

  createMusic(music) {
    const api = this.base_url + "/api/v1/meditation/musics";
    const requestOptions = {
      method: "Post",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(music),
    };

    return fetch(api, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => result);
  }

  updateMusic(music) {
    console.log(music);
    const api = this.base_url + "/api/v1/meditation/musics";
    const requestOptions = {
      method: "Put",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },

      body: JSON.stringify(music),
    };

    return fetch(api, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => result);
  }

  getAllCourse() {
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    const api =
      this.base_url +
      "/api/v1/meditation/courses/searches?limit=1000&offset=0&order_by=desc";
    const requestOptions = {
      method: "Post",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
    };

    return fetch(api, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        return res;
      });
  }

  getMusicTrend(musicId) {
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    const api = this.base_url + "/api/v1/log/record/" + musicId;
    const requestOptions = {
      method: "Get",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
    };

    return fetch(api, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        return res;
      });
  }
  getMusicById(musicId) {
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    const api = this.base_url + "/api/v1/meditation/musics/" + musicId;

    const requestOptions = {
      method: "Get",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
    };

    return fetch(api, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        return res;
      });
  }
  getCourseById(courseId) {
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    const api = this.base_url + "/api/v1/meditation/courses/" + courseId;

    const requestOptions = {
      method: "Get",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
    };

    return fetch(api, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
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
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addMusicInCourse),
    };

    return fetch(api, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => {
        return result;
      });
  }

  batchQueryMusic(musicIds) {
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    const api = this.base_url + "/api/v1/meditation/musics/batch";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(musicIds),
    };

    return fetch(api, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        return res;
      })
      .catch((err) => console.log(err));
  }

  batchQueryCourses(courseIds) {
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    const api = this.base_url + "/api/v1/meditation/courses/batch";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courseIds),
    };

    return fetch(api, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        return res;
      })
      .catch((err) => console.log(err));
  }

  getAllCategory() {
    // const info = cookie.load("Info");
    // if (info !== undefined) {
    //     return JSON.parse(info)
    // }
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    const api = this.base_url + "/api/v1/meditation/categories";
    const requestOptions = {
      method: "Get",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
    };

    return fetch(api, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        return res;
      });
  }

  createCategory(category) {
    // const info = cookie.load("Info");
    // if (info !== undefined) {
    //     return JSON.parse(info)
    // }
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    const api = this.base_url + "/api/v1/meditation/categories";
    const requestOptions = {
      method: "Post",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    };

    return fetch(api, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        return res;
      });
  }
  updateCategory(category) {
    console.log(category);
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    const api = this.base_url + "/api/v1/meditation/categories";
    const requestOptions = {
      method: "Put",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    };

    return fetch(api, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        return res;
      });
  }
  createTeacher(teacher) {
    console.log(teacher);
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    const api = this.base_url + "/api/v1/meditation/teachers";
    const requestOptions = {
      method: "Post",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teacher),
    };

    return fetch(api, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        return res;
      });
  }

  getAllTeacher() {
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    const api = this.base_url + "/api/v1/meditation/teachers";
    const requestOptions = {
      method: "Get",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
    };

    return fetch(api, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        return res;
      });
  }
  getTeacherById(teacherId) {
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    const api = this.base_url + "/api/v1/meditation/teachers/" + teacherId;
    const requestOptions = {
      method: "Get",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
    };

    return fetch(api, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        return res;
      });
  }
  updateTeacher(teacher) {
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    const api = this.base_url + "/api/v1/meditation/teachers";
    const requestOptions = {
      method: "Put",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teacher),
    };

    return fetch(api, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        return res;
      });
  }

  getCommonData() {
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    const api = this.base_url + "/api/v1/meditation/noFilterBanner";
    const requestOptions = {
      method: "Get",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
    };

    return fetch(api, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        return res;
      });
  }

  updateCommonData(commonData) {
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    const api = this.base_url + "/api/v1/meditation/common";
    const requestOptions = {
      method: "Post",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commonData),
    };

    return fetch(api, requestOptions).then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    });
  }

  getMusicRecordExcel() {
    console.log("HIHIH");
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    const api = this.base_url + "/api/v1/trigger/printAll";
    console.log(api);
    const requestOptions = {
      method: "Get",
      headers: {
        Authorization: cookie.load("token"),
      },
    };

    return fetch(api, requestOptions).then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res;
    });
  }

  getMusicStreamURL(musicId) {
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    const api = this.base_url + "/api/v1/meditation/musics/" + musicId + "/stream-url";
    const requestOptions = {
      method: "Get",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
    };

    return fetch(api, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        return res;
      });
  }

  getAudioDuration(audioUrl) {
    const api = this.base_url + "/mp3/duration";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: audioUrl }),
    };

    return fetch(api, requestOptions)
      .then((res) => res.json())
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.error("Failed to get audio duration:", error);
        throw error;
      });
  }

  getRecommendations(includeInactive = true) {
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    const api = `${this.base_url}/api/v1/meditation/recommendations?include_inactive=${includeInactive}`;
    const requestOptions = {
      method: "Get",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
    };

    return fetch(api, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        return res;
      });
  }

  updateRecommendations(recommendations) {
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    const api = `${this.base_url}/api/v1/meditation/recommendations`;
    const requestOptions = {
      method: "Put",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recommendations),
    };

    return fetch(api, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        return res;
      });
  }

  getBackgroundMusic() {
    if (cookie.load("token") === undefined) return Promise.reject(new Error("unauthorized"));
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
    };
    return fetch(
      this.base_url + "/api/v1/meditation/musics/background",
      requestOptions
    ).then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      });
  }

  deleteCourse(courseId) {
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    const api = this.base_url + "/api/v1/meditation/courses/" + courseId;
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: cookie.load("token"),
        "Content-Type": "application/json",
      },
    };

    return fetch(api, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        return res;
      });
  }

  getAllSos() {
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    return fetch(`${this.base_url}/api/v1/meditation/sos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: cookie.load("token"),
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => result);
  }

  getSosById(id) {
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    return fetch(`${this.base_url}/api/v1/meditation/sos/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: cookie.load("token"),
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => result);
  }

  createSos(data) {
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    return fetch(`${this.base_url}/api/v1/meditation/sos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: cookie.load("token"),
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result && result.success === false) {
          throw new Error(result.status_text || result.error_code || "新增失敗");
        }
        return result;
      });
  }

  updateSos(data) {
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    return fetch(`${this.base_url}/api/v1/meditation/sos`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: cookie.load("token"),
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result && result.success === false) {
          throw new Error(result.status_text || result.error_code || "更新失敗");
        }
        return result;
      });
  }

  deleteSos(id) {
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    return fetch(`${this.base_url}/api/v1/meditation/sos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: cookie.load("token"),
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => result);
  }

  uploadSosIcon(file) {
    if (cookie.load("token") === undefined) {
      return Promise.reject(new Error("unauthorized"));
    }
    const formData = new FormData();
    formData.append("myFile", file);
    return fetch(`${this.base_url}/api/v1/meditation/sos/icon/upload`, {
      method: "POST",
      headers: {
        Authorization: cookie.load("token"),
      },
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => result);
  }

  getRelaxTeacherRecommendations() {
    if (cookie.load("token") === undefined) return Promise.reject(new Error("unauthorized"));
    return fetch(`${this.base_url}/api/v1/meditation/relax/teacher-recommendations`, {
      method: "GET",
      headers: { Authorization: cookie.load("token"), "Content-Type": "application/json" },
    }).then(res => { if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`); return res.json(); });
  }

  updateRelaxTeacherRecommendations(recommendations) {
    if (cookie.load("token") === undefined) return Promise.reject(new Error("unauthorized"));
    return fetch(`${this.base_url}/api/v1/meditation/relax/teacher-recommendations`, {
      method: "PUT",
      headers: { Authorization: cookie.load("token"), "Content-Type": "application/json" },
      body: JSON.stringify(recommendations),
    }).then(res => { if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`); return res.json(); });
  }

  getCounselingTeacherRecommendations() {
    if (cookie.load("token") === undefined) return Promise.reject(new Error("unauthorized"));
    return fetch(`${this.base_url}/api/v1/meditation/counseling/teacher-recommendations`, {
      method: "GET",
      headers: { Authorization: cookie.load("token"), "Content-Type": "application/json" },
    }).then(res => { if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`); return res.json(); });
  }

  updateCounselingTeacherRecommendations(recommendations) {
    if (cookie.load("token") === undefined) return Promise.reject(new Error("unauthorized"));
    return fetch(`${this.base_url}/api/v1/meditation/counseling/teacher-recommendations`, {
      method: "PUT",
      headers: { Authorization: cookie.load("token"), "Content-Type": "application/json" },
      body: JSON.stringify(recommendations),
    }).then(res => { if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`); return res.json(); });
  }
}

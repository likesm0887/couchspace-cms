import cookie from 'react-cookies'
export class MeditationService {

    constructor(base_url) {
        this.base_url = base_url;
        this.token = cookie.load("token");
        console.log("cookie:" + this.token)
    }

    getAllMusic() {
        // const info = cookie.load("Info");
        // if (info !== undefined) {
        //     return JSON.parse(info)
        // }
        if (this.token === undefined) {
            return
        }
        const api = this.base_url + "/api/v1//meditation/musics"
        const requestOptions = {
            method: 'Get',
            headers: { "Authorization": this.token, 'Content-Type': 'application/json' },
        };

        return fetch(api, requestOptions)
            .then(res => res.json())
            .then(res => {
                cookie.save("Info", JSON.stringify(res))
                return res
            })

    }
    getAllCourse() {

        if (this.token === undefined) {
            return
        }
        const api = this.base_url + "/api/v1/meditation/courses/searches?limit=15&offset=0&order_by=desc"
        const requestOptions = {
            method: 'Post',
            headers: { "Authorization": this.token, 'Content-Type': 'application/json' },
        };

        return fetch(api, requestOptions)
            .then(res => res.json())
            .then(res => {
                cookie.save("Info", JSON.stringify(res))
                return res
            })
    }
    getMusicById(musicId) {

        if (this.token === undefined) {
            return
        }
        const api = this.base_url + "/api/v1/meditation/musics/" + musicId

        const requestOptions = {
            method: 'Get',
            headers: { "Authorization": this.token, 'Content-Type': 'application/json' },
        };

        return fetch(api, requestOptions)
            .then(res => res.json())
            .then(res => {
                cookie.save("Info", JSON.stringify(res))
                return res
            })
    }
    batchQueryMusic(musicIds) {
        
        if (this.token === undefined) {
            return
        }
        const api = this.base_url + "/api/v1/meditation/musics/batch"
        const requestOptions = {
            method: 'POST',
            headers: { "Authorization": this.token, 'Content-Type': 'application/json' },
            body: JSON.stringify(musicIds)
        };

        return fetch(api, requestOptions)
            .catch(err => console.log(err))
            .then(res => res.json())
            .then(res => {
                cookie.save("Info", JSON.stringify(res))
                return res
            })
    }

}
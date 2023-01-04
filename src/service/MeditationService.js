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
                return res
            })

    }

    createCourse(course){
        const api = this.base_url + "/api/v1/meditation/courses"
        const requestOptions = {
            method: 'Post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(course)
        };

        return fetch(api,requestOptions)
            .then(res => res.json())
            .then((result) => {
                return result
            });
    }

    updateCourse(course){
        const api = this.base_url + "/api/v1/meditation/course"
        const requestOptions = {
            method: 'Put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(course)
        };

        return fetch(api,requestOptions)
            .then(res => res.json())
            .then((result) => {
                
            });
    }

    createMusic(music){
        const api = this.base_url + "/api/v1/meditation/musics"
        const requestOptions = {
            method: 'Post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(music)
        };

        return fetch(api,requestOptions)
            .then(res => res.json())
            .then((result) => {
              
            });
    }

    updateMusic(music){
        console.log(music)
        const api = this.base_url + "/api/v1/meditation/musics"
        const requestOptions = {
            method: 'Put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(music)
        };

        return  fetch(api,requestOptions)
            .then(res => res.json())
            .then((result) => {
              
            });
    }

    getAllCourse() {

        if (this.token === undefined) {
            return
        }
        const api = this.base_url + "/api/v1/meditation/courses/searches?limit=1000&offset=0&order_by=desc"
        const requestOptions = {
            method: 'Post',
            headers: { "Authorization": this.token, 'Content-Type': 'application/json' },
    
        };

       return  fetch(api, requestOptions)
            .then(res => res.json())
            .then(res => {
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
            
                return res
            })
    }

    addMusicInCourse(addMusicInCourse){
        console.log(addMusicInCourse)
        const api = this.base_url + "/api/v1/meditation/courses/music"
        const requestOptions = {
            method: 'Post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(addMusicInCourse)
        };

        return fetch(api,requestOptions)
            .then(res => res.json())
            .then((result) => {
                return  result
            });
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
                return res
            })
    }

}
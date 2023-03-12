import cookie from 'react-cookies'

export class CounselorService {

    constructor(base_url) {
        this.base_url = base_url;
        this.token = cookie.load("token");
        console.log("cookie:" + this.token)
    }

    getGetCounselorInfo() {
        // const info = cookie.load("Info");
        // if (info !== undefined) {
        //     return JSON.parse(info)
        // }
        if (this.token===undefined){
            return
        }
        const api = this.base_url + "/api/v1/counselors/brief"
        const requestOptions = {
            method: 'Get',
            headers: {"Authorization": this.token, 'Content-Type': 'application/json'},
        };

        return fetch(api, requestOptions)
            .then(res => res.json())
            .then(res => {
                cookie.save("Info", JSON.stringify(res))
                return res
            })

    }

    setGetCounselorInfo() {

    }

}

import cookie from 'react-cookies'

export class CounselorService {

    constructor(base_url) {
        this.base_url = base_url;
        this.token = cookie.load("token_counselor");
        console.log("token_counselor cookie:" + this.token);
    }
    register(account, password) {
        const api = this.base_url + "/api/v1/counselors/register"
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Email: account, Password: password }),
        };

        fetch(api, requestOptions)
            .then(res => res.json())
            .then((result) => {
                // result is userID
                return;
            });
    }
    login(account, password) {
        const api = this.base_url + "/api/v1/counselors/login"
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Email: account, Password: password }),
        };

        fetch(api, requestOptions)
            .then(res => res.json())
            .then((result) => {
                // console.log(result)
                this.token = result.token;
                cookie.save('token_counselor', this.token.AccessToken);
            });
    }
    getCounselorInfo() {
        // const info = cookie.load("Info");
        // if (info !== undefined) {
        //     return JSON.parse(info)
        // }
        if (this.token === undefined) {
            return;
        }
        const api = this.base_url + "/api/v1/counselors";
        const requestOptions = {
            method: 'GET',
            headers: { "Authorization": this.token, 'Content-Type': 'application/json' },
        };

        return fetch(api, requestOptions)
            .then(res => res.json())
            .then(res => {
                cookie.save("Info", JSON.stringify(res))
                return res;
            });
    }

    setCounselorInfo(counselorInfo) {
        if (this.token === undefined) {
            return;
        }
        const api = this.base_url + "/api/v1/counselors"
        const requestOptions = {
            method: 'POST',
            headers: { "Authorization": this.token, 'Content-Type': 'application/json' },
            body: JSON.stringify(counselorInfo),
        };

        return fetch(api, requestOptions)
            .then(res => res.json())
            .then(res => {
                cookie.save("Info", JSON.stringify(res));
                return res;
            })
    }

}

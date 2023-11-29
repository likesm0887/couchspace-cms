import cookie from 'react-cookies'
import { appointmentService } from './ServicePool';
export class CounselorService {

    constructor(base_url) {
        this.base_url = base_url;
        this.token = cookie.load("token_counselor");
        this.adminToken = cookie.load("token");
        console.log("token_counselor cookie:" + this.token);
    }
    register(account, password) {
        const api = this.base_url + "/api/v1/counselors/register"
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Email: account, Password: password }),
        };

        return fetch(api, requestOptions);
    }
    login(account, password) {
        const api = this.base_url + "/api/v1/counselors/login"
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Email: account, Password: password }),
        };

        return fetch(api, requestOptions)
            .then(res => res.json())
            .then((result) => {
                this.token = result.token.AccessToken;
                appointmentService.setToken(result.token.AccessToken)
                cookie.save('token_counselor', result.token.AccessToken);
                return result;
            });
    }
    logout() {
        cookie.remove('token_counselor');
    }
    getCounselorInfo() {
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
            .then((result) => {
                return result;
            });
    }
    getCounselorInfoById(id) {
        if (this.adminToken === undefined) {
            return;
        }
        const api = this.base_url + "/api/v1/counselor/"+id;
        const requestOptions = {
            method: 'GET',
            headers: { "Authorization": this.adminToken, 'Content-Type': 'application/json' },
        };

        return fetch(api, requestOptions)
            .then(res => res.json())
            .then((result) => {
                return result;
            });
    }
    getAllCounselorInfo(isFilterUnVerify) {
        console.log(this.adminToken);
        if (this.adminToken === undefined) {
            return;
        }
        console.log(isFilterUnVerify?"Y":"N")
        const api = this.base_url + "/api/v1/counselors/all?isFilterUnVerify="+ (isFilterUnVerify?"Y":"N");
     
        const requestOptions = {
            method: 'GET',
            headers: { "Authorization": this.adminToken, 'Content-Type': 'application/json' },
        };

        return fetch(api, requestOptions)
            .then(res => res.json())
            .then((result) => {
                return result;
            });
    }
    setCounselorVerify(id,verify) {
        if (this.adminToken === undefined) {
            return;
        }
        const api = this.base_url + "/api/v1/counselors/verify"
        const requestOptions = {
            method: 'POST',
            headers: { "Authorization": this.adminToken, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                CounselorId:id,
                Verify:verify
            }),
        };

        return fetch(api, requestOptions)
            .then(res => res.json())
            .then(res => {
                console.log("res", res);
                return res;
            });
    }
    getCounselorVerify(id){
     
        if (id==null||id ==''){
            return
        }
        console.log(this.token);
        if (this.adminToken === undefined) {
            return;
        }
        const api = this.base_url + "/api/v1/counselors/verify/"+id;
        const requestOptions = {
            method: 'GET',
            headers: { "Authorization": this.adminToken, 'Content-Type': 'application/json' },
        };

        return fetch(api, requestOptions)
            .then(res => res.json())
            .then((result) => {
                return result;
            });
    }
    updateCounselorInfo(counselorInfo) {
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
                console.log("res", res);
                return res;
            });
    }
    setAppointmentTime(businessTimes) {
        if (this.token === undefined) {
            return;
        }
        const api = this.base_url + "/api/v1/appointmentTime"
        const requestOptions = {
            method: 'POST',
            headers: { "Authorization": this.token, 'Content-Type': 'application/json' },
            body: JSON.stringify(businessTimes),
        };

        return fetch(api, requestOptions)
            .then(res => res.json())
            .then(res => {
                console.log("res", res);
                return res;
            });
    }
    getAppointmentTimeById(id) {
        if (this.adminToken === undefined) {
            return;
        }
        const api = this.base_url + "/api/v1/appointmentTime/"+id
        console.log(api)
        const requestOptions = {
            method: 'GET',
            headers: { "Authorization": this.adminToken, 'Content-Type': 'application/json' },
        };

        return fetch(api, requestOptions)
            .then(res => res.json())
            .then(res => {
                console.log("res", res);
                return res;
            });
    }

    getCalenderById(id) {
        if (this.adminToken === undefined) {
            return;
        }
        const api = this.base_url + "/api/v1/calender/"+id
        console.log(api)
        const requestOptions = {
            method: 'GET',
            headers: { "Authorization": this.adminToken, 'Content-Type': 'application/json' },
        };

        return fetch(api, requestOptions)
            .then(res => res.json())
            .then(res => {
                console.log("res", res);
                return res;
            });
    }
    getAppointmentTime() {
        if (this.token === undefined) {
            return;
        }
        const api = this.base_url + "/api/v1/appointmentTime"
        const requestOptions = {
            method: 'GET',
            headers: { "Authorization": this.token, 'Content-Type': 'application/json' },
        };

        return fetch(api, requestOptions)
            .then(res => res.json())
            .then(res => {
                console.log("res", res);
                return res;
            });
    }
    checkAccountExist(account) {
        const api = this.base_url + "/api/v1/counselors/checkAccountExist";
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Account: account }),

        }
        return fetch(api, requestOptions)
            .then((res) => res.text())
            .then((res) => {
                return res;
            });
    }
    upload(file) {
        if (this.token === undefined) {
            return;
        }
        var data = new FormData();
        data.append("myFile", file);
        data.append("baseUrl", this.base_url);
        const api = this.base_url + "/api/v1/counselors/photo";
        const requestOptions = {
            method: 'POST',
            headers: { "Authorization": this.token },
            body: data,
        }
        return fetch(api, requestOptions)
            .then((res) => res.json())
            .then((res) => {
                return res;
            });
    }
}

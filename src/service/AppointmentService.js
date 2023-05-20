import cookie from 'react-cookies'

export class AppointmentService {

    constructor(base_url) {
        this.base_url = base_url;
        this.token = cookie.load("token_counselor");
    }
    setToken(token_counselor) {
        this.token = token_counselor;
    }
    getAllAppointment() {
        const api = this.base_url + "/api/v1/appointments"
        const requestOptions = {
            method: 'Get',
            headers: { "Authorization": this.token, 'Content-Type': 'application/json' },
        };

        return fetch(api, requestOptions)
            .then(res => res.json())
            .then(res => {
                return res;
            });

    }

    getAppointment(AppointmentId) {
        const api = this.base_url + "/appointments/" + AppointmentId
        const requestOptions = {
            method: 'Get',
            headers: { "Authorization": this.token, 'Content-Type': 'application/json' },
        };
        return fetch(api, requestOptions)
            .then(res => res.json())
            .then(res => {
                return res;
            });
    }
}

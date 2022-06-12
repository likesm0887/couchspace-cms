import cookie from 'react-cookies'

export class AppointmentService {

    constructor(base_url) {
        this.base_url = base_url;
        this.token = cookie.load("token");
    }

    getAllAppointment() {

        const api = this.base_url + "/api/v1/appointments"
        const requestOptions = {
            method: 'Get',
            headers: {"Authorization":  this.token, 'Content-Type': 'application/json'},
        };

        return fetch(api, requestOptions)

    }
}

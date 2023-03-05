import cookie from 'react-cookies'

export class RegisterService {

    constructor(base_url) {
        this.base_url = base_url;
    }

    login(account,password) {
        console.log("hhh")
        const api = this.base_url + "/api/v1/login"
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Email: account,Password:password })
        };

         fetch(api,requestOptions)
            .then(res => res.json())
            .then((result) => {
                console.log(result)
                this.token = result.token
                cookie.save('token', this.token.AccessToken);
            });
    }
}
export default RegisterService

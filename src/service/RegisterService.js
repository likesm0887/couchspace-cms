import cookie from 'react-cookies'
import { adminAuthentication } from '../utility/ProtectedRoute';

export class RegisterService {

    constructor(base_url) {
        this.base_url = base_url;
    }

    login(account, password) {
        const api = this.base_url + "/api/v1/login"
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Email: account, Password: password })
        };

        return fetch(api, requestOptions)
            .then(res => res.json())
            .then((result) => {
                // console.log(result)
                this.token = result.token
                cookie.save('token', this.token.AccessToken);
                adminAuthentication.updateAuthentication(true);
                console.log("update auth", adminAuthentication.isAuthenticated);
                return result
            });
    }

    login2(account, password) {
        return this.login(account, password);
    }

    logout() {
        adminAuthentication.updateAuthentication(false);
        cookie.remove("token");
    }
}

export default RegisterService

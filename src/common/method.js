import { toast } from 'react-toastify';
export const toastType = Object.freeze({ info: 0, success: 1, warning: 2, error: 3 });
const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
const passwordRule = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*_].{8,}$/;
export const showToast = (type, message) => {
    switch (type) {
        case toastType.info:
            toast.info(message);
            break;
        case toastType.success:
            toast.success(message);
            break;
        case toastType.warning:
            toast.warning(message);
            break;
        case toastType.error:
            toast.error(message);
            break;
        default:
            break;
    }

}

export const checkEmail = (email) => {
  if (email.search(emailRule) === -1) {
    return false;
  }
  return true;
}

export function checkPassword(password) {
  if (password.search(passwordRule) === -1) {
    return false;
  }
  return true;
}
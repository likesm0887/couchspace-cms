import { toast } from 'react-toastify';
export const toastType = Object.freeze({ info: 0, success: 1, warning: 2, error: 3 });
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
import { toast } from 'react-toastify';
export const toastType = Object.freeze({ info: 0, success: 1, warning: 2, error: 3 });
const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
const passwordRule = /^(?=.*[A-Za-z])(?=.*\d)(?=.*\S).{7,}$/;
const phoneRule = /((?=(09))[0-9]{10})$/;
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
      toast(message);
      break;
  }

}

export const checkEmail = (email) => {
  if (email.search(emailRule) === -1) {
    return false;
  }
  return true;
}

export const checkPassword = (password) => {
  if (password.search(passwordRule) === -1) {
    return false;
  }
  return true;
}

export const checkPhone = (phone) => {
  if (phone.search(phoneRule) === -1) {
    return false;
  }
  return true;

}

export const checkLines = (inputText, splitChar, count) => {
  let splitText = inputText.split(splitChar);
  if (splitText.length > count) {
    return false;
  }
  return true;
}

export function calTextLength(text: String) {
  text = text.trim();
  let chineseChars = text.match(/[\u4e00-\u9fa5]/g);
  let chineseCharsCount = chineseChars ? chineseChars.length : 0;
  let nonChineseCharsCount = text.replace(/[\u4e00-\u9fa5]/g, '').length;

  return (chineseCharsCount * 2 + nonChineseCharsCount);

}
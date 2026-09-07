// navigator.mediaDevices only exists in a secure context, so an http:// address
// (anything other than localhost) hides it entirely, as do some in-app browsers.
// Touching it blindly throws "navigator.mediaDevices is not an Object" — which is
// exactly what Zoom's own checkSystemRequirements does internally, so this has to
// be checked before the SDK is asked anything.
export const getMediaDeviceError = () => {
  if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === "function") {
    return null;
  }
  if (!window.isSecureContext) {
    return "此頁面不是以 HTTPS 開啟，瀏覽器因此不允許使用鏡頭與麥克風。請改用 https:// 網址進入。";
  }
  return "此瀏覽器無法使用鏡頭與麥克風。若是從其他 App 內開啟，請改用 Safari 或 Chrome 開啟本頁。";
};

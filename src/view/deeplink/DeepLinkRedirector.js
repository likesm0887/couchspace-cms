import { useEffect } from "react";
import { useParams } from "react-router-dom";
export default function DeepLinkRedirector({
    scheme = "couchspace://player",
    fallbackIOS = "https://apps.apple.com/app/id1641076437",
    fallbackAndroid = "https://play.google.com/store/apps/details?id=com.couchspace",
    timeout = 2000,
}) {
    const { deeplinkUrl } = useParams(); // slug = "player"
    let finalLink = scheme + "/" + deeplinkUrl;
    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor;
        console.log("userAgent", userAgent)
        const isAndroid = /android/i.test(userAgent);
        const isIOS = /iPad|iPhone|iPod|Mac/.test(userAgent);
        const ua = navigator.userAgent.toLowerCase();
        const isMessenger = ua.includes("fbmessenger");
        const isFacebook = ua.includes("fbav") || ua.includes("facebook");
        const fallbackURL = isIOS ? fallbackIOS : isAndroid ? fallbackAndroid : "";
        const start = Date.now();

        // 嘗試開 App
        if (isMessenger || isFacebook) {
        } else {
            window.location.href = finalLink;
        }

        const timer = setTimeout(() => {
            if (Date.now() - start < timeout + 200) {
                if (isMessenger || isFacebook) {
                }
                else if (isIOS) {
                    window.location.href = fallbackIOS;
                }
                else if (isAndroid) {
                    window.location.href = fallbackAndroid;
                }
                else {
                    console.log("can not detect device");
                }

            }
        }, timeout);

        return () => clearTimeout(timer);
    }, [scheme, fallbackIOS, fallbackAndroid, timeout]);

    return (
        <div style={{ padding: 20, textAlign: "center", fontSize: "1.2rem" }}>
            正在開啟 Couchspace，請稍候...
            如未自動跳轉，請使用外部瀏覽器開啟或是點選下方連結
            <p>
                <a href={finalLink}>點我開啟 Couchspace</a>
            </p>
        </div>
    );
}
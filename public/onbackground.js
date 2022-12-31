import {getMessaging} from "firebase/messaging";
import {onBackgroundMessage} from "firebase/messaging/sw";

const messaging = getMessaging();
onBackgroundMessage(messaging, (payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };
    new Notification("Hi there! ", {
        body: '\\ ^o^ /',
        icon: '/firebase-logo.png',
        tag: 'newArrival' // 設定標籤
    });

});

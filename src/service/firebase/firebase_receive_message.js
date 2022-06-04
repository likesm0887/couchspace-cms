// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.onBackgroundMessage` handler.
import {getMessaging, onMessage} from "firebase/messaging";

const messaging = getMessaging();

export const onMessageListener = () =>
    new Promise((resolve) => {
        console.log("123");
        onMessage(messaging, (payload) => {
            console.log("get");
            resolve(payload);

        });
    });


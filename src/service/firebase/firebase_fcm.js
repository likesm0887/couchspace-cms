// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getToken} from "firebase/messaging";
import {getMessaging} from "firebase/messaging/sw";


const firebaseConfig = {
    apiKey: "AIzaSyCrinK6_xY4tSxKRY00K7zqI_NmR_6z6r4",
    authDomain: "couchspace-fcm.firebaseapp.com",
    projectId: "couchspace-fcm",
    storageBucket: "couchspace-fcm.appspot.com",
    messagingSenderId: "1067564729064",
    appId: "1:1067564729064:web:3e38ea37f80471b573ff5d"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app)


export const requestForToken = () => {
    return getToken(messaging, {vapidKey: "BEusM9aapQr2fQAkoT60i1UnvteCv2ePPq81yzKriMSVRrfsqeJGWVK7d31k-d5rMUszbsB1Xb-Z2rkb3As2um0"})
        .then((currentToken) => {
            if (currentToken) {
                console.log('current token for client: ', currentToken);
                // Perform any other neccessary action with the token
            } else {
                // Show permission request UI
                console.log('No registration token available. Request permission to generate one.');
            }
        })
        .catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
        });
};



// onBackgroundMessage(messaging, (payload) => {
//     console.log('[firebase-messaging-sw.js] Received background message ', payload);
//     // Customize notification here
//     const notificationTitle = 'Background Message Title';
//     const notificationOptions = {
//         body: 'Background Message body.',
//         icon: '/firebase-logo.png'
//     };
//
//     window.self.registration.showNotification(notificationTitle,
//         notificationOptions);
// });




// Scripts for firebase and firebase messaging
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyCrinK6_xY4tSxKRY00K7zqI_NmR_6z6r4",
    authDomain: "couchspace-fcm.firebaseapp.com",
    projectId: "couchspace-fcm",
    storageBucket: "couchspace-fcm.appspot.com",
    messagingSenderId: "1067564729064",
    appId: "1:1067564729064:web:3e38ea37f80471b573ff5d"
};
const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };

    window.self.registration.showNotification(notificationTitle,
        notificationOptions);
});

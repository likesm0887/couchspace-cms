import Header from "./view/header/Header";
import Body from "./view/body/Body";
import {requestForToken} from "./service/firebase/firebase_fcm";
import {onMessageListener} from "./service/firebase/firebase_receive_message";
import {boot} from "./service/ServicePool";
import {BrowserRouter, Outlet ,HashRouter, Route, Routes} from "react-router-dom";
import Login from "./view/login/login";
import Home from "./view/home/Home";
import Meditation from "./view/body/content/Meditation";
import Consultation from "./view/body/content/Consultation";

function askForNotificationPermission() {
    Notification.requestPermission(function (result) {
        // 這裡result只會有兩種結果：一個是用戶允許(granted)，另一個是用戶封鎖(denied)
        console.log('User Choice', result);
        if (result !== 'granted') {
            console.log('No notification permission granted!');
        } else {
            new Notification("Hi there! ", {
                body: '\\ ^o^ /',
                tag: 'newArrival' // 設定標籤
            });
        }
    });
}

function App() {
    // registerServiceWorker()
    // Notification()
    boot()
    new Notification("Hi there! ", {
        body: '\\ ^o^ /',
        icon: '/firebase-logo.png',
        tag: 'newArrival' // 設定標籤
    });
    askForNotificationPermission()
    requestForToken()
    onMessageListener().then(payload => {
        console.log(payload);
    }).catch(err => console.log('failed: ', err));
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Login/>}/>
                <Route path="couchspace-cms/" element={<Login/>}/>
                <Route path="couchspace-cms/home" element={<Home/>}>
                    <Route>
                        <Route index element={<Consultation/>}/>
                        <Route path="consultation" element={<Consultation/>}/>
                        <Route path="meditation" element={<Meditation/>}/>
                    </Route>
                </Route>

            </Routes>
        </BrowserRouter>
        // <div className="App">
        //   <header className="header">
        //       <Header></Header>
        //   </header>
        //
        //     <Body></Body>
        // </div>
    );
}

export default App;

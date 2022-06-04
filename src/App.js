import Header from "./view/header/Header";
import Body from "./view/body/Body";
import {requestForToken} from "./service/firebase/firebase_fcm";
import {onMessageListener} from "./service/firebase/firebase_receive_message";
function askForNotificationPermission() {
    Notification.requestPermission(function(result) {
        // 這裡result只會有兩種結果：一個是用戶允許(granted)，另一個是用戶封鎖(denied)
        console.log('User Choice', result);
        if(result !== 'granted') {
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
    <div className="App">
      <header className="header">
          <Header></Header>
      </header>

        <Body></Body>
    </div>
  );
}

export default App;

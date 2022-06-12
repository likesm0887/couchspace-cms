import React, {useEffect, useState} from 'react'
import toast from 'react-hot-toast';

const Notification = () => {
    const [notification, setNotification] = useState({title: '', body: ''});
    const notify = () =>  toast(<ToastDisplay/>);
    function ToastDisplay() {
        return (
            <div>
                <p><b>{notification?.title}</b></p>
                <p>{notification?.body}</p>
            </div>
        );
    };

    useEffect(() => {

        if (notification?.title ){
            notify()
        }
    }, [notification])


}

export default Notification

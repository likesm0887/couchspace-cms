import {Pagination} from "@mui/material";
import "./charRoom.css"
import {createRef, useEffect, useRef, useState} from "react";


function ChatRoom() {
    const [allMessages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const bottomRef = useRef(null);
    const createMessages = () => {
        return allMessages.map(message => {
                if (message.type === "me") {
                    return <p className="from-me">{message.text}</p>
                } else {
                    return <p className="from-them">{message.text}</p>
                }
            }
        )
    }

    const send = (event) => {
        if (event.key === 'Enter') {
            setMessages( arr => [...arr, {
                type: "me",
                text: event.target.value
            }])
            setTimeout(()=>setMessages( arr => [...arr, {
                type: "them",
                text: "好的"
            }]),500)
            setInputValue('')
        }

    }
    const handleChange = event => {
        setInputValue(event.target.value);
    };
    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [allMessages]);
    return (
        <div>
            <div className="imessage">
                <p>2022/06/20 星期一 11:06上午</p>
                <p className="from-them">阿豪您好，我是郁嘉醫師，準備好就可以開始喔！</p>
                <p className="from-me">郁嘉醫師您好，好的，請等我一下，謝謝</p>
                {createMessages(allMessages)}
                <div  ref={bottomRef} ></div>
            </div>
            <div className="charRoom-input">
                <input onChange={handleChange} placeholder="發送訊息..." value={inputValue} onKeyDown={(e)=>send(e)} type="text"/>
            </div>
        </div>

    )

}

export default ChatRoom

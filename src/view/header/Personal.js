import headshot from "../img/header/photo.png";
import bell from "../img/header/bell.png";
import {counselorService} from "../../service/ServicePool";
import * as React from 'react';
import "./Personal.css"

import {Badge} from "@mui/material";
import {useEffect, useState} from "react";


function Personal() {
    const tag = "@couchspace"
    const [info, setInfo] = useState(null)
    const [show, setShow] = useState(false)
    useEffect(() => {
        counselorService.getGetCounselorInfo().then(
            res => {
                setInfo(res)
            }
        )
    }, [])

        window.addEventListener('mouseup', (event) => {
            if(event.target.className==="menu")
                return
           setShow(false)
        });

    const clickMemberManager = (event) => {

        setShow(false)
    }
    const clickLogout = (event) => {
        setShow(false)
    }
    return (
        <div>
            <img src={headshot} className="headshot" alt={"headshot"}/>
            <div>
                <a className={"name"}>{info?.UserName.Name?.FirstName + info?.UserName.Name?.LastName}</a>
                <a className={"title"}>醫師</a>
                <a className={"email"}> {tag}</a>
                <div className="arrow_down" onClick={() => setShow(prevState => !prevState)}/>
                {show && <span   className={"logout-wrap"}>
                  <span className="logout">
                      <li className={"menu"} onClick={ clickMemberManager}>
                        會員管理
                      </li>
                        <li className={"menu"} onClick={clickLogout}>登出
                      </li>
                  </span>

                </span>
                }
            </div>
            <div className={"bell"}>
                <Badge max={10} anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }} badgeContent={1} color="error">
                    <img src={bell} className="bellImg"/>
                </Badge>
            </div>
        </div>
    );

}

export default Personal;

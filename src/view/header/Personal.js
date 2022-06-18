import headshot from "../img/header/photo.png";
import bell from "../img/header/bell.png";
import {counselorService} from "../../service/ServicePool";
import * as React from 'react';
import "./Personal.css"

import {Avatar, Badge, Menu, MenuItem} from "@mui/material";
import {useEffect, useState} from "react";


function Personal() {
    const tag = "@couchspace"
    const [info, setInfo] = useState([])
    const [name,setName]=useState("adsasd")
    const [show, setShow] = useState(false)
    const getInfo = async () => {
       return await counselorService.getGetCounselorInfo();
    }
    const [anchorEl, setAnchorEl] = React.useState(null);
    useEffect(() => {
        let mounted = true;
        getInfo()
            .then(info => {

                if(mounted) {
                    console.log(info)
                    setInfo(info)
                    setName(info.UserName.Name.FirstName + info.UserName.Name.LastName)
                }
            })
        return () => mounted = false;
    }, [])

    window.addEventListener('mouseup', (event) => {
        if (event.target.className === "menu")
            return
        setShow(false)
    });

    const clickMemberManager = (event) => {

        setShow(false)
    }
    const clickLogout = (event) => {
        setShow(false)
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div className={"personal-content"}>

            <img src={headshot} className="headshot" alt={"headshot"}/>
            <div className={"info"}>
                <div className={"nameAndTitle"}>
                    <a className={"personal-name"}>{name}</a>
                    <a className={"title"}>醫師</a>
                </div>
                <div className={"emailAndArrow"}>
                    <a className={"email"}> {tag}</a>

                    <div className="arrow_down" onClick={handleClick}/>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem className={"logout"} onClick={handleClose}>會員管理</MenuItem>
                        <MenuItem className={"logout"} onClick={handleClose}>登出</MenuItem>
                    </Menu>
                </div>

                {show && <span className={"logout-wrap"}>
                  <span className="logout">
                      <li className={"menu"} onClick={clickMemberManager}>
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

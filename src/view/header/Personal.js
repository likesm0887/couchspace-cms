import selfie from "../img/header/photo.png";
import bell from "../img/header/bell.png";
import { counselorService } from "../../service/ServicePool";
import * as React from 'react';
import "./Personal.css"

import { Avatar, Badge, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";


function Personal() {
    const tag = "@couchspace"
    const [info, setInfo] = useState([])
    const [name, setName] = useState("adsasd")
    const [show, setShow] = useState(false)
    const getInfo = async () => {
        return await counselorService.getCounselorInfo();
    }
    const [anchorEl, setAnchorEl] = React.useState(null);
    useEffect(() => {
        let mounted = true;
        getInfo()
            .then(info => {

                if (mounted) {
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
        <div style={{ flex: 1, flexDirection: 'row' }} className={"personal-content"}>
            <img style={{ width: 50, height: 50, objectFit: 'contain', marginRight: 10 }} src={selfie} className="selfie" alt={"selfie"} />
            <div style={{ flex: 1, flexDirection: 'column' }} className={"info"}>

                <div className={"nameAndTitle"}>
                    <span className={"personal-name"}>{name}</span>
                    <span className={"title"}>醫師</span>
                </div>
                <div className={"emailAndArrow"}>
                    <span className={"email"}> {tag}</span>
                    <div className="arrow_down" onClick={handleClick} />
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
                    <img style={{ objectFit: 'contain' }} src={bell} className="bellImg" alt="" />
                </Badge>
            </div>
        </div>
    );

}

export default Personal;

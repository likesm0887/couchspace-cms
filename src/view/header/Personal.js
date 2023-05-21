import selfie from "../img/header/photo.png";
import bell from "../img/header/bell.png";
import * as React from 'react';
import "./Personal.css"
import { useNavigate } from "react-router-dom";
import { Avatar, Badge, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { counselorInfo } from "../../dataContract/counselor";
import { counselorService } from "../../service/ServicePool";


function Personal() {
    const navigate = useNavigate();
    const tag = "@couchspace";
    const [name, setName] = useState("adsasd");
    const [show, setShow] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    useEffect(() => {
        setName(counselorInfo.UserName.NickName);
    }, [])

    window.addEventListener('mouseup', (event) => {
        if (event.target.className === "menu")
            return
        setShow(false)
    });

    const onClickMemberManager = (event) => {
        setShow(false);
    }
    const onClickLogout = (event) => {
        setShow(false);
        counselorService.logout();
        navigate("/couchspace-cms", { replace: true, });
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
                        <MenuItem className={"logout"} onClick={onClickMemberManager}>會員管理</MenuItem>
                        <MenuItem className={"logout"} onClick={onClickLogout}>登出</MenuItem>
                    </Menu>
                </div>

                {/* {show && <span className={"logout-wrap"}>
                    <span className="logout">
                        <li className={"menu"} onClick={clickMemberManager}>
                            會員管理
                        </li>
                        <li className={"menu"} onClick={clickLogout}>登出
                        </li>
                    </span>

                </span>
                } */}

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

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
    const [email, setEmail] = useState("healthy@couchspace.com");
    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [photo, setPhoto] = useState("");
    useEffect(() => {
        setName(counselorInfo.UserName.Name.FirstName + counselorInfo.UserName.Name.LastName);
        setTitle(counselorInfo.Position);
        setPhoto(counselorInfo.Photo);
    }, [])

    window.addEventListener('mouseup', (event) => {
        if (event.target.className === "menu")
            return;
    });

    const onClickBasicInfo = () => {
        navigate("/couchspace-cms/home/basicInfo");
    }
    const onClickCounselingInfo = () => {
        navigate("/couchspace-cms/home/counselingInfo");
    }
    const onClickCounselingManagement = () => {
        navigate("/couchspace-cms/home/counselingManagement");
    }
    const onClickLogout = () => {
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
            <img style={{ alignSelf: 'center', justifySelf: 'center', width: 100, height: 100, objectFit: 'contain', marginRight: 10, borderRadius: 1000, overflow: 'hidden' }} src={photo} className="selfie" alt={"selfie"} />
            <div style={{ flexDirection: 'column' }} className={"info"}>

                <div className={"nameAndTitle"}>
                    <span className={"personal-name"}>{name}</span>
                    <span className={"title"}>{title}</span>
                </div>
                <div className={"emailAndArrow"}>
                    <span className={"email"}> {email}</span>
                    <div className="arrow_down" onClick={handleClick} />
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <li style={{ margin: 10, alignItems: 'center', justifyItems: 'center' }}>
                            <MenuItem className={"menuItem"} onClick={onClickBasicInfo}>會員資本資料</MenuItem>
                        </li>
                        <li style={{ margin: 10, alignItems: 'center', justifyItems: 'center' }}>
                            <MenuItem className={"menuItem"} onClick={onClickCounselingInfo}>我的諮商資料</MenuItem>
                        </li>
                        <li style={{ margin: 10, alignItems: 'center', justifyItems: 'center' }}>
                            <MenuItem className={"menuItem"} onClick={onClickCounselingManagement}>諮商時段管理</MenuItem>
                        </li>
                        <li style={{ margin: 10 }}>
                            <MenuItem className={"menuItem"} onClick={onClickLogout}>登出</MenuItem>
                        </li>
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

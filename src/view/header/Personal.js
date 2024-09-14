import selfie from "../img/header/photo.png";
import bell from "../img/header/bell.png";
import userInfo from "../img/header/btn_member_information.svg";
import * as React from 'react';
import "./Personal.css"
import { useNavigate } from "react-router-dom";
import { Avatar, Badge, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { counselorInfo } from "../../dataContract/counselor";
import { counselorService } from "../../service/ServicePool";

const screenWidth = window.innerWidth;
function Personal() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("healthy@couchspace.com");
    const [name, setName] = useState("");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [photo, setPhoto] = useState("");
    useEffect(() => {
        counselorService.getCounselorInfo().then((info) => {
            counselorInfo.setCounselorInfo = info;
            setEmail(counselorInfo.Email === "" ? "healthy@couchspace.com" : counselorInfo.Email);
            setName(counselorInfo.UserName.Name.LastName + counselorInfo.UserName.Name.FirstName);
            setPhoto(counselorInfo.Photo === "" ? selfie : counselorInfo.Photo);
        })
        counselorService.getAppointmentTime().then((business) => {
            counselorInfo.updateBusinessTimes = business.BusinessTimes;
            counselorInfo.updateOverrideTimes = business.OverrideTimes;
        });


    })
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
        <div>
            <div class="row row-cols-auto align-items-center justify-content-end">
                {screenWidth > 500 ?
                    <div class="col">
                        <img style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 1000, overflow: 'hidden' }} src={photo} className="selfie" alt={"selfie"} />
                    </div> : null}
                {screenWidth > 500 ?
                    <div class="col">
                        <span className={"personal-name"}>{name}</span>
                    </div> : null}
                <div class="col">
                    <img onClick={handleClick} src={userInfo} alt={"123"}></img>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <li style={{ margin: 10, alignItems: 'center', justifyItems: 'center' }}>
                            <MenuItem className={"menuItem"} onClick={onClickBasicInfo}>基本資料</MenuItem>
                        </li>
                        <li style={{ margin: 10, alignItems: 'center', justifyItems: 'center' }}>
                            <MenuItem className={"menuItem"} onClick={onClickCounselingInfo}>服務設定</MenuItem>
                        </li>
                        <li style={{ margin: 10, alignItems: 'center', justifyItems: 'center' }}>
                            <MenuItem className={"menuItem"} onClick={onClickCounselingManagement}>時段管理</MenuItem>
                        </li>
                        <li style={{ margin: 10 }}>
                            <MenuItem className={"menuItem"} onClick={onClickLogout}>登出</MenuItem>
                        </li>
                    </Menu>
                </div>
            </div>
        </div>
    );

}

export default Personal;

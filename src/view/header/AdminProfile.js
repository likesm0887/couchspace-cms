import userInfo from "../img/header/btn_member_information.svg";
import adminIcon from "../img/login/ic_psychologist.svg";
import * as React from 'react';
import "./Personal.css"
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { service } from "../../service/ServicePool";

const screenWidth = window.innerWidth;

function AdminProfile() {
    const navigate = useNavigate();
    const [name, setName] = useState("Admin");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [photo, setPhoto] = useState("");

    useEffect(() => {
        // For admin, we'll use a default name and photo for now
        // This can be extended later to fetch admin user info from API
        setName("系統管理員");
        setPhoto("https://via.placeholder.com/50x50/4CAF50/FFFFFF?text=A");
    }, [])

    const onClickLogout = () => {
        service.logout();
        navigate("/login", { replace: true });
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <div className="row row-cols-auto align-items-center justify-content-end">
                {screenWidth > 500 ?
                    <div className="col">
                        <img crossOrigin="anonymous" style={{ width: 50, height: 50, objectFit: 'contain', borderRadius: 1000, overflow: 'hidden' }} src={photo} className="selfie" alt={"admin"} />
                    </div> : null}
                {screenWidth > 500 ?
                    <div className="col">
                        <div className="row">
                            <span className={"personal-name"}>{name}</span>
                        </div>
                        <div className="row">
                            <img crossOrigin="anonymous" style={{ objectFit: 'contain' }} src={adminIcon} alt={"admin"}></img>
                        </div>
                    </div> : null}
                <div className="col">
                    <img onClick={handleClick} src={userInfo} alt={"menu"}></img>
                    <Menu
                        id="admin-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <li style={{ margin: 10 }}>
                            <MenuItem className={"menuItem"} onClick={onClickLogout}>登出</MenuItem>
                        </li>
                    </Menu>
                </div>
            </div>
        </div>
    );
}

export default AdminProfile;
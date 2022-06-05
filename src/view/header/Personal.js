import headshot from "../img/header/photo.png";
import arrow_down from "../img/header/arrow-down.png";
import bell from "../img/header/bell.png";
import {counselorService} from "../../service/ServicePool";

import "./Personal.css"
import {useEffect, useState} from "react";
import {Badge} from "@mui/material";


function Personal() {
    const tag = "@couchspace"
    const [info, setInfo] = useState(null)

    useEffect(() => {
        counselorService.getGetCounselorInfo().then(
            res => {
                setInfo(res)
            }
        )
    }, [])

    return (
        <div className="personal">
            <img src={headshot} className="headshot" alt={"headshot"}/>
            <div className={"nameAndEmail"}>
                <ul className={"list-style"}>
                    <li>
                        <a>{info?.UserName.Name?.FirstName + info?.UserName.Name?.LastName}醫生</a>
                    </li>
                    <li>
                        <a>{tag}</a>
                        <img src={arrow_down} className="arrow_down" alt={"arrow_down"}/>
                    </li>

                </ul>


            </div>
            <div className={"bell"}>
                <Badge max={10} anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }} badgeContent={1} color="error">
                    <img src={bell} className="bellImg"/>
                </Badge>
            </div>
        </div>
    );

}

export default Personal;

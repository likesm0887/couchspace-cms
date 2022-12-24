import Consultation from "./counsulation/Consultation";
import Meditation from "./Meditation";
import { Outlet } from "react-router-dom";
import "./contentRoot.css"

function ContentRoot() {
    return (
        <div className={"ContentRoot"}>

            <Outlet />
        </div>

    );

}


export default ContentRoot;

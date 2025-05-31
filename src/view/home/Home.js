import Header from "../header/Header";
import Body from "../body/Body";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { counselorService } from "../../service/ServicePool";
function Home() {
    let navigate = useNavigate();
    const checkCounselorTokenExpired = () => {
        return counselorService.checkCounselorTokenExpired();
    }
    useEffect(() => {
        if (checkCounselorTokenExpired()) {
            // token is expired, log out
            counselorService.logout();
            navigate("/couchspace-cms", { replace: true, });
        }
    }, [])
    return (
        <div style={{ height: window.innerHeight, overflow: "hidden" }}>
            <Header></Header>
            <Body></Body>
        </div>

    );

}


export default Home;

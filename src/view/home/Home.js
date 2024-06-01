import Header from "../header/Header";
import Body from "../body/Body";
import { useRef } from "react";

function Home() {
    return (
        <div style={{ height: window.innerHeight}}>
            <Header></Header>
            <Body></Body>
        </div>

    );

}


export default Home;

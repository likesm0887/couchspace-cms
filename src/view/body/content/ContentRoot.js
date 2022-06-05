import Consultation from "./Consultation";
import Meditation from "./Meditation";
import {HashRouter, Route, Routes} from 'react-router-dom';
import "./contentRoot.css"

function ContentRoot() {
    return (
        <div className={"ContentRoot"}>
            <HashRouter>
                <Routes>
                    <Route exact  path="/meditation" element={<Meditation/>}/>
                    <Route exact  path="/" element={<Consultation/>}/>
                </Routes>
            </HashRouter>
        </div>

    );

}


export default ContentRoot;

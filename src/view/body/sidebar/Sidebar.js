import "./sidebar.css"
import consultation from "../../img/slidebar/consultation.svg";
import consultation_unselect from "../../img/slidebar/consulation_unselect.svg";
import meditation from "../../img/slidebar/meditation.svg";
import article from "../../img/slidebar/article.svg";
import manager from "../../img/slidebar/manager.svg";
import {useState} from "react";
import {Link} from "react-router-dom";

function Sidebar() {
    const [currentSelected, setCurrentSelected] = useState("")
    const selectSlide = (selected) => {
        console.log(selected)
        setCurrentSelected(selected);
    };
    const getStyle = (selected) => {
        return {
            backgroundColor: currentSelected === selected ? ' #F7F8F8' : '#88A1D2',
            color: currentSelected === selected ? '#88A1D2' : ' #F7F8F8',
        }
    }
    const getImage = (selected) => {
        if (selected === "meditation")
            return consultation_unselect;
        else{
            return consultation
        }
    }
    return (
        <div className="sidebar">
            <div className={"line"}>
                <li onClick={() => selectSlide("consultation")} className={"slide-line"}
                    style={getStyle("consultation")}>
                    <img src={getImage("consultation")} alt={"123"}></img>
                    <Link to="consultation" style={getStyle("consultation")} className={"consultation"}>諮商</Link>
                </li>
                <li onClick={() => selectSlide("meditation")} className={"slide-line"}
                    style={getStyle("meditation")}>
                    <img src={meditation} alt={"123"}></img>
                    <Link to="meditation" style={getStyle("meditation")} className={"meditation"}>冥想</Link>

                </li>

                {/*<li onClick={() => selectSlide("article")} className={"slide-line"}*/}
                {/*    style={getStyle("article")}>*/}
                {/*    <img src={article} alt={"123"}></img>*/}
                {/*    <Link to="appointmentDetail" style={getStyle("article")} className={"article"}>文章</Link>*/}
                {/*</li>*/}
                <li onClick={() => selectSlide("manager")} className={"slide-line"}
                    style={getStyle("manager")}>
                    <img src={manager} alt={"123"}></img>
                    <a href="/home/manager" style={getStyle("manager")} className={"manager"}>管理</a>
                </li>
            </div>

        </div>


    );

}

export default Sidebar;

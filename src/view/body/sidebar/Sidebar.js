import "./sidebar.css"
import consultation from "../../img/slidebar/consultation.svg";
import consultation_unselect from "../../img/slidebar/consultation_unselect.svg";
import meditation from "../../img/slidebar/meditation.svg";
import meditation_unselect from "../../img/slidebar/meditation_unselect.svg";
import article from "../../img/slidebar/article.svg";
import article_unselect from "../../img/slidebar/article_unselect.svg";
import manager from "../../img/slidebar/manager.svg";
import manager_unselect from "../../img/slidebar/manager_unselect.svg";
import setting from "../../img/slidebar/setting.svg";
import setting_unselect from "../../img/slidebar/setting_unselect.svg";
import { useState } from "react";
import { Link } from "react-router-dom";

function Sidebar() {
    const [currentSelected, setCurrentSelected] = useState("consultation");
    const selectSlide = (selected) => {
        if (currentSelected === selected) return;
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
        let output = null;
        switch (selected) {
            case 'consultation':
                output = (currentSelected === selected) ? consultation : consultation_unselect;
                break;
            case 'meditation':
                output = (currentSelected === selected) ? meditation : meditation_unselect;
                break;
            case 'article':
                output = (currentSelected === selected) ? article : article_unselect;
                break;
            case 'manager':
                output = (currentSelected === selected) ? manager : manager_unselect;
                break;
            case 'setting':
                output = (currentSelected === selected) ? setting : setting_unselect;
                break;
            default:
                break;
        }
        return output;
    }
    return (
        <div className="sidebar">
            <div className={"line"}>
                <Link to="consultation" style={getStyle("consultation")} className={"consultation"}>
                    <li onClick={() => selectSlide("consultation")} className={"slide-line"} style={getStyle("consultation")}>
                        <img src={getImage("consultation")} alt={"123"}></img>
                        <span style={{ marginLeft: 10 }}>諮商</span>
                    </li>
                </Link>
                <Link to="meditation" style={getStyle("meditation")} className={"meditation"}>
                    <li onClick={() => selectSlide("meditation")} className={"slide-line"} style={getStyle("meditation")}>
                        <img src={getImage("meditation")} alt={"123"}></img>
                        <span style={{ marginLeft: 10 }}>冥想</span>
                    </li>
                </Link>

                <Link to="meditation" style={getStyle("article")} className={"article"}>
                    <li onClick={() => selectSlide("article")} className={"slide-line"} style={getStyle("article")}>
                        <img src={getImage("article")} alt={"123"}></img>
                        <span style={{ marginLeft: 10 }}>文章</span>
                    </li>
                </Link>
                <Link to="meditation" style={getStyle("manager")} className={"manager"}>
                    <li onClick={() => selectSlide("manager")} className={"slide-line"} style={getStyle("manager")}>
                        <img src={getImage("manager")} alt={"123"}></img>
                        <span style={{ marginLeft: 10 }}>管理</span>
                    </li>
                </Link>

                <Link to="meditation" style={getStyle("setting")} className={"setting"}>
                    <li onClick={() => selectSlide("setting")} className={"slide-line"} style={getStyle("setting")}>
                        <img src={getImage("setting")} alt={"123"}></img>
                        <span style={{ marginLeft: 10 }}>設定</span>
                    </li>
                </Link>

            </div>

        </div>


    );

}

export default Sidebar;

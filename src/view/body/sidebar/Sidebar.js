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
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
const SelectedTab = Object.freeze({ "Consultation": "Consultation", "Meditation": "Meditation", "Article": "Article", "Manager": "Manager", "Setting": "Setting" })
function Sidebar() {
    const location = useLocation();
    const [currentSelected, setCurrentSelected] = useState(SelectedTab.Consultation);
    const selectSlide = (selected) => {
        if (currentSelected === selected) return;
        // console.log(selected)
        setCurrentSelected(selected);
    };
    const getStyle = (selected) => {
        return {
            backgroundColor: currentSelected === selected ? '#F7F8F8' : '#88A1D2',
            color: currentSelected === selected ? '#88A1D2' : '#F7F8F8',
        }
    }
    const getImage = (selected) => {
        let output = null;
        console.log("selected", selected);
        console.log("currentSelected", currentSelected);
        switch (selected) {
            case SelectedTab.Consultation:
                output = (currentSelected === selected) ? consultation : consultation_unselect;
                break;
            case SelectedTab.Meditation:
                output = (currentSelected === selected) ? meditation : meditation_unselect;
                break;
            case SelectedTab.Article:
                output = (currentSelected === selected) ? article : article_unselect;
                break;
            case SelectedTab.Manager:
                output = (currentSelected === selected) ? manager : manager_unselect;
                break;
            case SelectedTab.Setting:
                output = (currentSelected === selected) ? setting : setting_unselect;
                break;
            default:
                break;
        }
        console.log("output", output);
        return output;
    }
    return (
        <div className={"line"}>
            <div class="row" className={"slide-line"} style={getStyle(SelectedTab.Consultation)}>
                <Link to="consultation">
                    <li onClick={() => selectSlide(SelectedTab.Consultation)}>
                        <img src={getImage(SelectedTab.Consultation)} alt={"123"}></img>
                        <span style={{ marginLeft: 10, color: currentSelected === SelectedTab.Consultation ? "#88A1D2" : "#f7f8f8" }}>諮詢</span>
                    </li>
                </Link>
            </div>
            <div class="row" className={"slide-line"} style={getStyle(SelectedTab.Meditation)}>
                <Link to="repair">
                    <li onClick={() => selectSlide(SelectedTab.Meditation)}>
                        <img src={getImage(SelectedTab.Meditation)} alt={"123"}></img>
                        <span style={{ marginLeft: 10, color: currentSelected === SelectedTab.Meditation ? "#88A1D2" : "#f7f8f8" }}>冥想</span>
                    </li>
                </Link>
            </div>
            <div class="row" className={"slide-line"} style={getStyle(SelectedTab.Article)}>
                <Link to="repair">
                    <li onClick={() => selectSlide(SelectedTab.Article)} >
                        <img src={getImage(SelectedTab.Article)} alt={"123"}></img>
                        <span style={{ marginLeft: 10, color: currentSelected === SelectedTab.Article ? "#88A1D2" : "#f7f8f8" }}>文章</span>
                    </li>
                </Link>
            </div>
            <div class="row" className={"slide-line"} style={getStyle(SelectedTab.Manager)}>
                <Link to="repair">
                    <li onClick={() => selectSlide(SelectedTab.Manager)} >
                        <img src={getImage(SelectedTab.Manager)} alt={"123"}></img>
                        <span style={{ marginLeft: 10, color: currentSelected === SelectedTab.Manager ? "#88A1D2" : "#f7f8f8" }}>管理</span>
                    </li>
                </Link>
            </div>
            <div class="row" className={"slide-line"} style={getStyle(SelectedTab.Setting)}>
                <Link to="repair">
                    <li onClick={() => selectSlide(SelectedTab.Setting)} >
                        <img src={getImage(SelectedTab.Setting)} alt={"123"}></img>
                        <span style={{ marginLeft: 10, color: currentSelected === SelectedTab.Setting ? "#88A1D2" : "#f7f8f8" }}>設定</span>
                    </li>
                </Link>
            </div>
        </div>
    );

}

export default Sidebar;

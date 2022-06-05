import "./sidebar.css"
import consultation from "../../img/slidebar/slidebar-consultation.png";
import meditation from "../../img/slidebar/slidebar-meditation.png";
import article from "../../img/slidebar/slidebar-article.png";
import manager from "../../img/slidebar/slidebar-manager.png";

function Sidebar() {
    return (

            <div className="sidebar">
                <ui>
                    <a href="/"><img  className={"slide-item"} src={consultation} alt="測試圖片" border="0"/></a>
                </ui>
                <ui>
                    <a href="#/meditation"><img  className={"slide-item"} src={meditation} alt="測試圖片" border="0"/></a>
                </ui>
                <ui>
                    <a href="#/meditation"><img  className={"slide-item"} src={article} alt="測試圖片" border="0"/></a>
                </ui>
                <ui>
                    <a href="#/meditation"><img  className={"slide-item"} src={manager} alt="測試圖片" border="0"/></a>
                </ui>

            </div>


    );

}
export default Sidebar;

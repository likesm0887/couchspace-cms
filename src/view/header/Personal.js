import headshot from "../img/header/photo.png";
import arrow_down from "../img/header/arrow-down.png";
import bell from "../img/header/bell.png";
import "./Personal.css"

function Personal() {
    const name = "陳郁嘉"
    const tag = "@couchspace"
    return (
        <div className="headshot">
            <img  src={headshot} className="headshot" alt={"headshot"}/>
            <a>{name}</a>
            <a>{tag}</a>
            <img src={arrow_down} className="arrow_down" alt={"arrow_down"}/>
            <img src={bell} className="bell"/>
        </div>
    );

}
export default Personal;

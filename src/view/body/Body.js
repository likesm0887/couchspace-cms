import ContentRoot from "./content/ContentRoot";
import Sidebar from "./sidebar/Sidebar";
import "./Body.css"

function Body() {
    return (
        <div className={"Body"}>
            <Sidebar></Sidebar>
            <ContentRoot></ContentRoot>
        </div>

    );
}

export default Body;

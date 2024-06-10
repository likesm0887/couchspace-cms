import ContentRoot from "./content/ContentRoot";
import Sidebar from "./sidebar/Sidebar";
import "./Body.css"

function Body() {
    return (
        <div class="container-fluid" style={{ height: "85%", width: "100%", backgroundColor: "#88a1d2" }}>
            <div class="row h-100">
                <div class="col-4 col-sm-2 col-lg-2 col-xxl-1 no-padding h-100">
                    <Sidebar></Sidebar>
                </div>
                <div class="col-8 col-sm-10 col-lg-10 col-xxl-11 no-padding h-100">
                    <ContentRoot></ContentRoot>
                </div>
            </div>
        </div>

    );
}

export default Body;

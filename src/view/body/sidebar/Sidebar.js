import "./sidebar.css"

function Sidebar() {
    return (
        <menu className="sidebar">
            <div >
                <li>
                    <a href="src/view/body/sidebar/Sidebar#/" className="w3-bar-item w3-button">諮商</a>
                </li>
                <li>
                    <a href="src/view/body/sidebar/Sidebar#/meditation" className="w3-bar-item w3-button">冥想</a>
                </li>
            </div>
        </menu>

    );

}
export default Sidebar;

import { useEffect, useState } from "react";
import { appointmentService } from "../../../../service/ServicePool";
import { Backdrop, CircularProgress, createTheme, Pagination } from "@mui/material";
import "./consultation.css"
import editButton from "../../../img/content/edit.svg"
import { useNavigate } from "react-router-dom";
import userIcon from "../../../img/content/userIcon.svg";
import { Appointment } from "../../../../dataContract/appointment";

function Consultation() {
    let navigate = useNavigate();
    let pageSize = 7;
    const [open, setOpen] = useState(false);
    let allAppointments: Appointment[] = [];
    const [currentPage, setCurrentPage] = useState(1)
    const [currentTableData, setCurrentTableData] = useState([]);
    const [pagesSize, setPagesSize] = useState(1);

    function calCurrentTableData(data) {
        const firstPageIndex = (currentPage - 1) * pageSize;
        const lastPageIndex = firstPageIndex + pageSize;
        return data.slice(firstPageIndex, lastPageIndex)

    }

    function calPageSize(dataSize) {
        let offset = dataSize % pageSize > 0 ? 1 : 0;
        let newDataSize = ((dataSize / pageSize) | 0)
        return newDataSize + offset
    }
    function num2Time(number) {
        var minute = parseInt(number / 60)
            .toString()
            .padStart(2, "0");
        var second = parseInt(number % 60)
            .toString()
            .padStart(2, "0");
        return minute + ":" + second + ":00";
    }

    const getData = async () => {
        const res = await appointmentService.getAllAppointment();
        console.log("getData", res);
        if (res) {
            allAppointments = res;
            setCurrentTableData(calCurrentTableData(allAppointments));
            setPagesSize(calPageSize(allAppointments.length));
        }
    }

    const handleChange = (event, value) => {
        setCurrentPage(value);
    }

    useEffect(() => {
        getData();
    }, [])
    const clickItem = (appointment) => {
        navigate("/couchspace-cms/home/consultation/" + appointment.AppointmentID, { replace: false, state: { appointment: appointment } });
    }
    const start = () => {
        setOpen(!open);
        navigate("/couchspace-cms/home/consultation/counseling", { replace: false });
    }
    function createListItem() {
        return currentTableData.map(allAppointment => {
            return (<div style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }} key={allAppointment.AppointmentID}>
                <div className="content-row" onClick={() => clickItem(allAppointment)}>
                    <div className="content-col">
                        <img style={{ verticalAlign: 'middle' }} src={userIcon} alt="123"></img>{allAppointment.UserName}
                    </div>
                    <div className="content-col">
                        {allAppointment.Time.Date}
                    </div>
                    <div className="content-col">
                        {num2Time(allAppointment.Time.Total)}
                    </div>
                    <div className="content-col">
                        {allAppointment.Service === 0 ? "諮商" : "諮商"}
                    </div>
                    <div className="content-col">
                        <span style={{ color: allAppointment.Status === "RoomCreated" ? "#88A1D2" : "#595757" }}>{allAppointment.Status === "RoomCreated" ? "已接受" : "待確認"}
                            <img src={editButton} className={"editButton"} alt={"123"}></img> </span>
                    </div>
                </div>
                <div>
                    <button className={"startButton"} onClick={() => start()}>
                        開始
                    </button>
                </div>
            </div>)
        })
    }
    function createListTitle() {
        return (<div className="title-row">
            <div className="title-col">
                預約人
            </div>
            <div className="title-col">
                預約日期及時間
            </div>
            <div className="title-col">
                預約時數
            </div>
            <div className="title-col">
                諮商種類
            </div>
            <div className="title-col">
                狀態
            </div>
        </div>);
    }
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <div style={{ display: 'block', padding: 30, overflowY: 'hidden', overflowX: 'hidden' }}>
            {createListTitle()}
            {createListItem()}
            <div className={"Page"}>
                <Pagination color="primary" count={pagesSize} defaultPage={1} onChange={handleChange} />
            </div>

            <Backdrop className={""} open={open} >
                <CircularProgress />
                <p>正在檢查您的裝置</p>
            </Backdrop>
        </div>
    );

}


export default Consultation;

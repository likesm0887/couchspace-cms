import { useEffect, useState } from "react";
import { appointmentService } from "../../../../service/ServicePool";
import { Pagination } from "react-bootstrap";
import "./consultation.css"
import editButton from "../../../img/content/edit.svg"
import { useNavigate, useLocation } from "react-router-dom";
import userIcon from "../../../img/content/userIcon.svg";
import { Appointment } from "../../../../dataContract/appointment";
const TitleType = Object.freeze({ "OnComing": "OnComing", "Cancelled": "Cancelled", "Finished": "Finished", "All": "All" })
const Width = (window.innerWidth * 0.8) > 1200 ? (window.innerWidth * 0.8) : 1200;
const screenWidth = window.innerWidth;
function Consultation() {
    let navigate = useNavigate();
    let pageSize = parseInt(window.innerHeight / 100);

    const [allAppointments, setAllAppointments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentTableData, setCurrentTableData] = useState([]);
    const [pagesSize, setPagesSize] = useState(1);
    const [titleType, setTitleType] = useState(TitleType.OnComing);

    function calCurrentTableData(data) {
        const firstPageIndex = (currentPage - 1) * pageSize;
        const lastPageIndex = firstPageIndex + pageSize;
        return data.slice(firstPageIndex, lastPageIndex)

    }

    function calPageSize(dataSize) {
        let offset = dataSize % pageSize > 0 ? 1 : 0;
        let newDataSize = ((dataSize / pageSize) | 0)
        return (newDataSize + offset) > 0 ? (newDataSize + offset) : 1
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
            await setAllAppointments(res.sort((a, b) => {
                const dateA = parseDateTime(a.Time.Date, a.Time.StartTime);
                const dateB = parseDateTime(b.Time.Date, b.Time.StartTime);
                return dateB - dateA;
            }))
            // setCurrentTableData(calCurrentTableData(allAppointments));
            // setPagesSize(calPageSize(allAppointments.length));
        }
    }
    const parseDateTime = (dateString, timeString) => {
        [dateString,] = dateString.split(" "); // old data contain date + time
        const [year, month, day] = dateString.split("-");
        const [hours, minutes] = timeString.split(":");
        return new Date(year, month - 1, day, hours, minutes);
    }
    const handleChange = (event) => {
        let selectedPage = parseInt(event.target.innerText);
        setCurrentPage(selectedPage);
    }
    const handleSelectType = (type) => {
        setCurrentPage(1);
        setTitleType(type);
    }
    const getFilterType = (titleType) => {
        let output = "";
        switch (titleType) {
            case TitleType.OnComing:
                output = "ROOMCREATED";
                break;
            case TitleType.Cancelled:
                output = "CANCELLED";
                break;
            case TitleType.Finished:
                output = "COMPLETED";
                break;
            case TitleType.All:
                break;
            default:
                output = "ROOMCREATED";
                break;
        }
        return output;
    }
    const filterAppointments = async () => {
        let filterAppointments: Appointment[] = [];
        let filterType = getFilterType(titleType);
        if (filterType === "ROOMCREATED") {
            filterAppointments = allAppointments.filter((appointment) => appointment.Status === filterType || appointment.Status === "CONFIRMED");
        }
        else if (filterType) {
            filterAppointments = allAppointments.filter((appointment) => appointment.Status === filterType);
        }
        else {
            filterAppointments = allAppointments;
        }
        setCurrentTableData(calCurrentTableData(filterAppointments));
        setPagesSize(calPageSize(filterAppointments.length));
    }
    useEffect(() => {
        getData();
    }, [])
    useEffect(() => {
        filterAppointments();
    }, [titleType, allAppointments, currentPage])
    const clickItem = (appointment) => {
        navigate("/couchspace-cms/home/consultation/" + appointment.AppointmentID, { replace: false, state: { appointment: appointment } });
    }
    const start = (ID) => {
        console.log(ID)
        navigate("/couchspace-cms/home/consultation/counseling/" + ID, { replace: false, state: { appointmentID: ID } });
    }
    function getStatusDesc(code) {
        if (code.toUpperCase() === 'NEW') {
            return "未付款"
        }
        if (code.toUpperCase() === 'UNPAID') {
            return "未付款"
        }
        if (code.toUpperCase() === 'CONFIRMED') {
            return "已確認"
        }
        if (code.toUpperCase() === 'ROOMCREATED') {
            return "即將開始"
        }

        if (code.toUpperCase() === 'CANCELLED') {
            return "已取消"
        }

        if (code.toUpperCase() === 'COMPLETED') {
            return "已完成"
        }
    }
    function getStatusBackgroundColor(code) {
        let outputColor = "#C9C9C9";
        switch (code.toUpperCase()) {
            case 'ROOMCREATED':
                outputColor = "#F1A250";
                break;
            case 'CANCELLED':
                outputColor = "#C9C9C9";
                break;
            case 'COMPLETED':
                outputColor = "#8C8C8C";
                break;
            default:
                break;
        }

        return outputColor;
    }
    function createListItem() {
        return currentTableData.map(allAppointment => {
            if (screenWidth > 500) {
                return (
                    <div style={{ width: Width, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} key={allAppointment.AppointmentID}>
                        <div className="content-row">
                            <div className="content-col text-wrap">
                                {allAppointment.AppointmentID.slice(allAppointment.AppointmentID.length - 5, allAppointment.AppointmentID.length).toUpperCase()}
                            </div>
                            <div className="content-col text-wrap">
                                {allAppointment.UserName}
                            </div>
                            <div className="content-col text-wrap" style={{ textAlign: "left", marginLeft: 10 }}>
                                {allAppointment.Time.Date.replaceAll("-", "/") + " " + allAppointment.Time.StartTime}
                            </div>
                            <div className="content-col text-wrap">
                                {num2Time(allAppointment.Time.Total)}
                            </div>
                            <div className="content-col text-wrap" style={{ textAlign: "left", marginLeft: 10 }}>
                                {allAppointment.Service.Type.Label}
                            </div>
                            <div className="content-col text-wrap">
                                <span>{getStatusDesc(allAppointment.Status)}</span>
                            </div>
                            <div className="content-col">
                                <button className={"editButton"} onClick={() => clickItem(allAppointment)}>
                                    <span style={{ verticalAlign: 'center' }}>檢視</span>
                                </button>
                            </div>
                            <div className="content-col">
                                {allAppointment.Status.toUpperCase() === "ROOMCREATED" ?
                                    <button className={"startButton-enabled startButton-enabled_hover"} onClick={() => start(allAppointment.AppointmentID)} >
                                        <span style={{ verticalAlign: 'center' }}>進入房間</span>
                                    </button>
                                    :
                                    <button className={"startButton-disabled startButton-disabled_hover"}>
                                        <span style={{ verticalAlign: 'center' }}>進入房間</span>
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                )
            }
            else {
                return (
                    <div style={{ marginBottom: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} key={allAppointment.AppointmentID}>
                        <div className="content-row-phone" style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                            <div className="content-col-phone text-wrap" style={{ textAlign: "left", marginLeft: 10 }}>
                                訂單編號
                            </div>
                            <div className="content-col-phone text-wrap" style={{ flex: 2, textAlign: "left" }}>
                                {allAppointment.AppointmentID.slice(allAppointment.AppointmentID.length - 5, allAppointment.AppointmentID.length).toUpperCase()}
                            </div>
                            <div className="content-col-phone">
                                <span style={{ width: 77, float: "right", marginRight: 6, backgroundColor: getStatusBackgroundColor(allAppointment.Status), color: "#FFFFFF", borderRadius: 20, display: "inline-block" }}>
                                    {getStatusDesc(allAppointment.Status)}
                                </span>
                            </div>
                        </div>
                        <div className="content-row-phone" style={{ borderColor: "#FFFFFF", height: 20 }}></div>
                        <div className="content-row-phone" style={{ borderColor: "#FFFFFF" }}>
                            <div className="content-col-phone text-wrap" style={{ textAlign: "left", marginLeft: 10 }}>
                                預約時間
                            </div>
                            <div className="content-col-phone" style={{ flex: 2, textAlign: "left", textWrap: "nowrap", overflow: "visible" }}>
                                {allAppointment.Time.Date.replaceAll("-", "/") + " " + allAppointment.Time.StartTime}
                            </div>
                            <div className="content-col-phone" style={{ paddingTop: 108 }}>
                                <div class="container-fluid p-0" style={{ height: 180, width: "100%" }}>
                                    <div style={{ flex: 1 }}>
                                        <button style={{ height: 88, width: 89, backgroundColor: "#89A2D0", color: "#FFFFFF", borderRadius: 10, display: "inline-block", borderColor: "transparent", marginBottom: 3, float: "right" }} onClick={() => clickItem(allAppointment)}>
                                            <span style={{ verticalAlign: 'center' }}>預約資訊</span>
                                        </button>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        {allAppointment.Status.toUpperCase() === "ROOMCREATED" ?
                                            <button style={{ height: 88, width: 89, borderRadius: 10, backgroundColor: "#89A2D0", color: "#FFFFFF", borderColor: "transparent", float: "right" }} onClick={() => start(allAppointment.AppointmentID)} >
                                                <span style={{ verticalAlign: 'center' }}>開始諮詢</span>
                                            </button>
                                            :
                                            <button style={{ height: 88, width: 89, borderRadius: 10, backgroundColor: "#C9C9C9", color: "#FFFFFF", borderColor: "transparent", float: "right" }}>
                                                <span style={{ verticalAlign: 'center' }}>開始諮詢</span>
                                            </button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="content-row-phone" style={{ borderColor: "#FFFFFF" }}>
                            <div className="content-col-phone text-wrap" style={{ textAlign: "left", marginLeft: 10 }}>
                                預約人
                            </div>
                            <div className="content-col-phone text-wrap" style={{ flex: 2, textAlign: "left" }}>
                                {allAppointment.UserName}
                            </div>
                            <div className="content-col-phone">
                            </div>
                        </div>
                        <div className="content-row-phone" style={{ borderColor: "#FFFFFF" }}>
                            <div className="content-col-phone text-wrap" style={{ textAlign: "left", marginLeft: 10 }}>
                                預約時數
                            </div>
                            <div className="content-col-phone text-wrap" style={{ flex: 2, textAlign: "left" }}>
                                {num2Time(allAppointment.Time.Total)}
                            </div>
                            <div className="content-col-phone">
                            </div>
                        </div>
                        <div className="content-row-phone" style={{ borderColor: "#FFFFFF" }}>
                            <div className="content-col-phone text-wrap" style={{ textAlign: "left", marginLeft: 10 }}>
                                預約項目
                            </div>
                            <div className="content-col-phone text-wrap" style={{ flex: 2, textAlign: "left" }}>
                                {allAppointment.Service.Type.Label}
                            </div>
                            <div className="content-col-phone">
                            </div>
                        </div>
                        <div className="content-row-phone" style={{ borderColor: "#FFFFFF", height: 20, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}></div>
                    </div>
                )
            }
        })
    }
    function createListTitleType() {
        if (screenWidth > 500) {
            return (
                <div className="titleType-row">
                    <div className={titleType === TitleType.OnComing ? "titleType-col-enabled" : "titleType-col-disabled"} onClick={() => handleSelectType(TitleType.OnComing)}>
                        即將開始
                    </div>
                    <div className={titleType === TitleType.Finished ? "titleType-col-enabled" : "titleType-col-disabled"} onClick={() => handleSelectType(TitleType.Finished)}>
                        已完成
                    </div>
                    <div className={titleType === TitleType.Cancelled ? "titleType-col-enabled" : "titleType-col-disabled"} onClick={() => handleSelectType(TitleType.Cancelled)}>
                        已取消
                    </div>
                    <div className={titleType === TitleType.All ? "titleType-col-enabled" : "titleType-col-disabled"} onClick={() => handleSelectType(TitleType.All)}>
                        全部預約
                    </div>
                </div>
            );
        }
        else {
            return (
                <div>
                    <div className="titleType-row" style={{ fontSize: 32, color: "#595757" }}>
                        諮詢
                    </div>
                    <div className="titleType-row" style={{ overflowX: "scroll" }}>
                        <div className={titleType === TitleType.OnComing ? "titleType-col-enabled" : "titleType-col-disabled"} onClick={() => handleSelectType(TitleType.OnComing)}>
                            即將開始
                        </div>
                        <div className={titleType === TitleType.Finished ? "titleType-col-enabled" : "titleType-col-disabled"} onClick={() => handleSelectType(TitleType.Finished)}>
                            已完成
                        </div>
                        <div className={titleType === TitleType.Cancelled ? "titleType-col-enabled" : "titleType-col-disabled"} onClick={() => handleSelectType(TitleType.Cancelled)}>
                            已取消
                        </div>
                        <div className={titleType === TitleType.All ? "titleType-col-enabled" : "titleType-col-disabled"} onClick={() => handleSelectType(TitleType.All)}>
                            全部預約
                        </div>
                    </div>
                </div>
            );
        }
    }
    function createListTitle() {
        if (screenWidth > 500) {
            return (
                <div className="title-row" style={{ width: Width }}>
                    <div className="title-col">
                        訂單編號
                    </div>
                    <div className="title-col">
                        預約人
                    </div>
                    <div className="title-col" style={{ textAlign: "left", marginLeft: 10 }}>
                        預約時間
                    </div>
                    <div className="title-col">
                        預約時數
                    </div>
                    <div className="title-col" style={{ textAlign: "left", marginLeft: 10 }}>
                        預約項目
                    </div>
                    <div className="title-col">
                        預約狀態
                    </div>
                    <div className="title-col">
                        預約資訊
                    </div>
                    <div className="title-col">
                    </div>
                </div>
            )
        }
        else {
            return;
        }
    }
    function createPagination() {
        let items = [];
        for (let number = 1; number <= pagesSize; number++) {
            items.push(
                <Pagination.Item key={number} active={number === currentPage} onClick={handleChange}>
                    {number}
                </Pagination.Item>
            );
        }
        return items;
    }
    return (
        <div style={{ width: "100%", height: "100%", backgroundColor: "#F7F8F8", display: "block" }}>
            <div style={{ marginBottom: 10 }}>
                {createListTitleType()}
            </div>
            <div style={{ paddingLeft: 10, display: 'block', width: "95%", height: "90%", backgroundColor: "#F7F8F8", borderRadius: 10, overflow: "auto", perspective: 1 }}>
                {createListTitle()}
                {createListItem()}
                {screenWidth > 500 ?
                    <div className={"Page"}>
                        <Pagination>
                            <Pagination.Prev onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)} />
                            {createPagination()}
                            <Pagination.Next onClick={() => setCurrentPage(currentPage < pagesSize ? currentPage + 1 : currentPage)} />
                        </Pagination>
                    </div> : null}
            </div>
        </div>
    );

}


export default Consultation;

import {useEffect, useState} from "react";
import {appointmentService} from "../../../service/ServicePool";
import {Pagination} from "@mui/material";
import "./consultation.css"
import startVideoButton from "../../img/content/start_video_button.png"


function Consultation() {
    let pageSize = 7;
    const [allAppointments, setAllAppointments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [currentTableData, setCurrentTableData] = useState([])
    const [pagesSize, setPagesSize] = useState(1)

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

    const getData = async () => {
        const res = await appointmentService.getAllAppointment()
        const data = await res.json();
        setAllAppointments(data)
        setCurrentTableData(calCurrentTableData(data))
        setPagesSize(calPageSize(data.length))
    }

    const handleChange = (event, value) => {
        setCurrentPage(value)
    }

    useEffect(() => {
        setCurrentTableData(calCurrentTableData(allAppointments))
    }, [currentPage])

    useEffect(() => {
        getData();
    }, [])

    function createListItem(currentTableData) {
        return currentTableData.map(allAppointment => {
            return <tr className={"tr"} key={allAppointment.AppointmentID}>
                <td>   {allAppointment.UserName}</td>
                <td> {allAppointment.Time.Date}</td>
                <td> {allAppointment.Time.Total/60}</td>
                <td> {allAppointment.Service}</td>
                <td> {allAppointment.Status}</td>
                <td> <img  src={startVideoButton} className="listItemStyle" alt={""}></img></td>
            </tr>
        })
    }

    function createListTitle() {
        return <tr className={"List_title"}>
            <th>預約人</th>
            <th>預約時間</th>
            <th>時數</th>
            <th>諮商種類</th>
            <th>狀態</th>
        </tr>
    }

    return (

        <div className={"Consultation"}>
            <table>
                {createListTitle()}
                {createListItem(currentTableData)}
            </table>

            <div className={"Page"}>
                <Pagination count={pagesSize} defaultPage={1} onChange={handleChange}/>
            </div>
        </div>

    );

}


export default Consultation;

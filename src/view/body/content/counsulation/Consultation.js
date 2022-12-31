import {useEffect, useState} from "react";
import {appointmentService} from "../../../../service/ServicePool";
import {Backdrop, CircularProgress, createTheme, Pagination} from "@mui/material";
import "./consultation.css"
import editButton from "../../../img/content/edit.svg"
import { useNavigate } from "react-router-dom";
import { Button } from 'react-bootstrap';
import {makeStyles} from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

function Consultation() {
    const classes = useStyles();
    let navigate = useNavigate();
    let pageSize = 7;
    const [open, setOpen] = useState(false);
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
    const clickItem = (appointmentID) => {
        navigate("/couchspace-cms/home/consultation/:"+appointmentID, { replace: true });
    }
    const start=()=>{
        setOpen(!open);
        setTimeout(()=>{
            navigate("/couchspace-cms/home/consultation/counseling", {replace: true});
        },3000)


    }
    function createListItem(currentTableData) {
        return currentTableData.map(allAppointment => {
            return <tr key={allAppointment.AppointmentID} >
                <td onClick={()=>clickItem(allAppointment.AppointmentID)}>   {allAppointment.UserName}</td>
                <td onClick={()=>clickItem(allAppointment.AppointmentID)}> {allAppointment.Time.Date}</td>
                <td onClick={()=>clickItem(allAppointment.AppointmentID)}> {"0" + allAppointment.Time.Total / 60 + ":00:00"}</td>
                <td onClick={()=>clickItem(allAppointment.AppointmentID)}> {allAppointment.Service === 0 ? "諮商" : "諮商"}</td>
                <td style={{color: allAppointment.Status === "RoomCreated" ? "#88A1D2" : "#595757"}}> {allAppointment.Status === "RoomCreated" ? "已接受" : "待確認"}
                    <img src={editButton} className={"editButton"}></img>
                </td>
                <td>
                    <div>
                        <button className={"startButton"} onClick={()=>start()}>
                            開始
                        </button>
                    </div>
                </td>
            </tr>

        })
    }

    function createListTitle() {
        return <tr className={"listTitle"}>
            <th>預約人</th>
            <th>預約時間及日期</th>
            <th>時數</th>
            <th>諮商種類</th>
            <th>狀態</th>
        </tr>
    }
    const handleClose = () => {
        setOpen(false);
    };
    return (

        <div className={"Consultation"}>
            <table className="table table-striped">
                {createListTitle()}
                {createListItem(currentTableData)}
            </table>

            <div className={"Page"}>
                <Pagination color="primary" count={pagesSize} defaultPage={1} onChange={handleChange}/>
            </div>
            <Backdrop className={classes.backdrop} open={open} >
                <CircularProgress />
                <p>正在檢查您的裝置</p>
            </Backdrop>
        </div>

    );

}


export default Consultation;
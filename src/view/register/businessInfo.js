import { Grid, Checkbox, DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText } from "@mui/material";
import "./BusinessInfo.css";
import Typography from "@material-ui/core/Typography";
import { useRef, useState } from "react";
import { forwardRef, useImperativeHandle } from "react";
import plus from "../img/register/plus.svg";
import trash from "../img/register/trash.svg";
import { Counselor, counselorInfo } from "../../dataContract/counselor";
import { TimePicker } from "antd";

// 定義多個營業時間
let businessHours = [
    { enabled: false, day: 'Sunday', periods: [] },
    { enabled: false, day: 'Monday', periods: [] },
    { enabled: false, day: 'Tuesday', periods: [] },
    { enabled: false, day: 'Wednesday', periods: [] },
    { enabled: false, day: 'Thursday', periods: [] },
    { enabled: false, day: 'Friday', periods: [] },
    { enabled: false, day: 'Saturday', periods: [] },
];
const BusinessInfo = forwardRef((props, ref) => {
    /// dialog
    const [isOpen, setIsOpen] = useState(false);
    const [consultHours, setConsultHours] = useState(businessHours);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    useImperativeHandle(ref, () => ({
        checkAllInput() {
            var output = true;
            // whether output is true or false => update info to counselor model
            let info = new Counselor();
            info.AppointmentTimeID = consultHours;
            counselorInfo.updateBusinessTime = info;
            console.log("counselorInfo", counselorInfo);

            return output;
        }
    }))
    const handleChecked = (index) => {
        businessHours[index].enabled = !businessHours[index].enabled;
        setConsultHours([...businessHours]);
    }

    const handleAddPeriod = (index) => {
        setSelectedBusiness(index);
        setIsOpen(true);

    }
    const handleDelete = (index, period_index) => {
        console.log("index %d, period_index %d", index, period_index);
        console.log("before", businessHours[index].periods);
        businessHours[index].periods = arrayRemove(businessHours[index].periods, businessHours[index].periods[period_index]);
        console.log("after", businessHours[index].periods);
        setConsultHours([...businessHours]);
    }
    const handleClose = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setIsOpen(false);
    }
    const handleAccept = () => {
        setIsOpen(false);
        console.log(selectedBusiness);
        businessHours[selectedBusiness].periods.push({ startTime: startTime.format("HH:mm"), endTime: endTime.format("HH:mm") });
        setConsultHours([...businessHours]);
        setStartTime(null);
        setEndTime(null);
    }
    const handleCancel = () => {
        setIsOpen(false);
        setStartTime(null);
        setEndTime(null);
    }
    function arrayRemove(arr, value) {

        return arr.filter(function (ele) {
            return ele != value;
        });
    }
    function disabledTimes(now: Dayjs) {
        const hours = [];
        const minutes = [];
        if (startTime === null) {
            return {
                disabledHours: () => hours,
                disabledMinutes: () => minutes,
                disabledSeconds: () => [],
            };
        }
        const startHour = startTime.format("HH:mm").split(":")[0];
        const startMinute = startTime.format("HH:mm").split(":")[1];

        if (endTime !== null) {
            const endHour = endTime.format("HH:mm").split(":")[0];
            if (endHour === startHour) {
                for (let i = 0; i <= startMinute; i += 15) {
                    minutes.push(i);
                }
            }
        }
        console.log("startHour %d, startMinute %d", startHour, startMinute);
        for (let i = 0; i < startHour; i++) {
            hours.push(i);
        }

        return {
            disabledHours: () => hours,
            disabledMinutes: () => minutes,
            disabledSeconds: () => [],
        };
    }
    const createDialog = () => {
        return <Dialog
            open={isOpen}
            fullWidth={true}
            onClose={handleClose}
            value={"sm"}>
            <DialogTitle id="alert-dialog-title">{"請選擇時段"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <div>
                        <span>開始時間</span>
                        <TimePicker
                            style={{ margin: 10 }}
                            popupStyle={{ zIndex: 9999 }}
                            format={"HH:mm"}
                            minuteStep={15}
                            hourStep={1}
                            showSecond={false}
                            value={startTime}
                            onChange={(value) => {
                                if (value === null) return;
                                console.log("startTime", value.format("HH:mm"));
                                setStartTime(value);
                                setEndTime(null);
                            }}
                            onSelect={(value) => {
                                if (value === null) return;
                                setStartTime(value);
                                setEndTime(null);
                            }
                            }
                            changeOnBlur={true}
                            showNow={false}
                        />
                        <span>結束時間</span>
                        <TimePicker
                            style={{ margin: 10 }}
                            popupStyle={{ zIndex: 9999 }}
                            format={"HH:mm"}
                            minuteStep={15}
                            hourStep={1}
                            showSecond={false}
                            value={endTime}
                            disabled={startTime === null}
                            onChange={(value) => {
                                if (value === null) return;
                                console.log("endTime", value.format("HH:mm"));
                                setEndTime(value);
                            }}
                            onSelect={(value) => {
                                if (value === null) return;
                                setEndTime(value);
                            }}
                            changeOnBlur={true}
                            disabledTime={disabledTimes}
                            showNow={false}
                        />
                    </div>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <button className={"finishButton"} onClick={handleCancel}>
                    {"取消"}
                </button>
                <button className={"acceptButton"} onClick={handleAccept} color="primary" autoFocus disabled={startTime === null || endTime === null}>
                    {"完成"}
                </button>
            </DialogActions>
        </Dialog>
    }

    return (
        <div className={"BusinessInfo"}>
            <Typography style={{ marginTop: 10 }} variant="h6" gutterBottom>
                {"填寫諮商時段(Weekly Hours)"}
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <div>
                        {consultHours.map((consultHour, index) => (
                            <li style={{ marginBottom: 30, display: 'block', width: "90%" }} key={index}>
                                <Checkbox checked={consultHour.enabled} onClick={() => {
                                    handleChecked(index);
                                }}></Checkbox>
                                <span>
                                    <strong>{consultHour.day}</strong>
                                    {consultHour.periods.map((period, period_index) => {
                                        return (<span key={period_index}> {(period.startTime + "-" + period.endTime)}
                                            <img style={{ marginLeft: 3, marginRight: 10, height: 15, width: 15, verticalAlign: 'middle' }} src={trash} alt="" onClick={() => handleDelete(index, period_index)} />
                                        </span>)
                                    })}
                                    <img style={{ position: 'absolute', right: "25%", height: 25, width: 25, verticalAlign: 'middle' }} src={plus} alt="" onClick={() => handleAddPeriod(index)}></img>
                                </span>
                            </li>
                        ))}
                    </div>
                </Grid>
            </Grid>
            <div style={{ height: 30 }}></div>
            <div>
                {createDialog()}
            </div>
        </div>

    );

})


export default BusinessInfo;

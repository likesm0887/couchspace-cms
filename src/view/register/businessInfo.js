import { Grid, Checkbox, DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText } from "@mui/material";
import "./BusinessInfo.css";
import Typography from "@material-ui/core/Typography";
import { useRef, useState } from "react";
import { forwardRef, useImperativeHandle } from "react";
import plus from "../img/register/plus.svg";
import trash from "../img/register/trash.svg";
import { Counselor, counselorInfo, WeekType, BusinessTime, Period } from "../../dataContract/counselor";
import { TimePicker } from "antd";
import { showToast, toastType } from "../../common/method";

const BusinessInfo = forwardRef((props, ref) => {
    // 定義多個營業時間
    let businessHours = [
        { enabled: false, day: WeekType.Sunday, periods: [] },
        { enabled: false, day: WeekType.Monday, periods: [] },
        { enabled: false, day: WeekType.Tuesday, periods: [] },
        { enabled: false, day: WeekType.Wednesday, periods: [] },
        { enabled: false, day: WeekType.Thursday, periods: [] },
        { enabled: false, day: WeekType.Friday, periods: [] },
        { enabled: false, day: WeekType.Saturday, periods: [] },
    ];
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
            let businessTimes: BusinessTime[] = [];
            consultHours.forEach((consultHour) => {
                let businessTime = new BusinessTime();
                businessTime.WeekOfDay = consultHour.day;
                consultHour.periods.forEach((period) => {
                    let businessPeriod = new Period();
                    businessPeriod.StartTime = period.startTime;
                    businessPeriod.EndTime = period.EndTime;
                    businessTime.Periods.push(businessPeriod);
                });
                businessTimes.push(businessTime);
            })
            counselorInfo.updateBusinessTime = businessTimes;
            console.log("counselorInfo", counselorInfo);

            return output;
        }
    }))
    const handleChecked = (index) => {
        var tempItems = consultHours;
        tempItems[index].enabled = !tempItems[index].enabled;
        setConsultHours([...tempItems]);
    }

    const handleAddPeriod = (index) => {
        setSelectedBusiness(index);
        setIsOpen(true);

    }
    const handleDelete = (index, period_index) => {
        var tempItems = consultHours;
        console.log("index %d, period_index %d", index, period_index);
        console.log("before", tempItems[index].periods);
        tempItems[index].periods = arrayRemove(tempItems[index].periods, tempItems[index].periods[period_index]);
        console.log("after", tempItems[index].periods);
        setConsultHours([...tempItems]);
    }
    const handleClose = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setIsOpen(false);
    }
    const checkWeeklyHoursOverlap = () => {
        let output = false;
        for (var i = 0; i < consultHours[selectedBusiness].periods.length; i++) {
            let tempStartTime = new Date(`2023-01-01T${consultHours[selectedBusiness].periods[i].startTime}`);
            let tempEndTime = new Date(`2023-01-01T${consultHours[selectedBusiness].periods[i].endTime}`);
            let curStartTime = new Date(`2023-01-01T${startTime.format("HH:mm")}`);
            let curEndTime = new Date(`2023-01-01T${endTime.format("HH:mm")}`);
            console.log("tempStartTime", tempStartTime);
            console.log("tempEndTime", tempEndTime);
            console.log("curStartTime", curStartTime);
            console.log("curEndTime", curEndTime);

            if (curStartTime < tempEndTime && curEndTime > tempStartTime) {
                showToast(toastType.error, startTime.format("HH:mm") + "~" + endTime.format("HH:mm") + "與" + consultHours[selectedBusiness].periods[i].startTime + "~" + consultHours[selectedBusiness].periods[i].endTime + "時間重疊，請重新選擇");
                output = true; // 重疊
                break;
            }
        }
        return output;
    }
    const bubbleSortPeriods = () => {
        var output = consultHours;
        for (var i = 0; i < output[selectedBusiness].periods.length; i++) {
            for (var j = 0; j < output[selectedBusiness].periods.length - i - 1; j++) {
                if (output[selectedBusiness].periods[j].startTime > output[selectedBusiness].periods[j + 1].startTime) {
                    var temp = output[selectedBusiness].periods[j];
                    output[selectedBusiness].periods[j] = output[selectedBusiness].periods[j + 1];
                    output[selectedBusiness].periods[j + 1] = temp;
                }
            }
        }
        return output;
    }
    const handleAccept = () => {
        if (checkWeeklyHoursOverlap()) {
            return;
        }
        var tempItems = consultHours;
        setIsOpen(false);
        console.log(selectedBusiness);
        tempItems[selectedBusiness].periods.push({ startTime: startTime.format("HH:mm"), endTime: endTime.format("HH:mm") });
        tempItems = bubbleSortPeriods();
        setConsultHours([...tempItems]);
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
            return ele !== value;
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
            // endTime 已經有選時段
            const endHour = endTime.format("HH:mm").split(":")[0];
            if (endHour === startHour) {
                for (let i = 0; i <= startMinute; i += 15) {
                    minutes.push(i);
                }
            }
        }
        else {
            // endTime 尚未選時段 => 禁止選分鐘
            for (let i = 0; i <= 45; i += 15) {
                minutes.push(i);
            }
        }
        console.log("startHour %d, startMinute %d", startHour, startMinute);
        for (let i = 0; i <= startHour; i++) {
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
                            showMinute={false} // 0607: only support hours
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
                            showMinute={false} // 0607: only support hours
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

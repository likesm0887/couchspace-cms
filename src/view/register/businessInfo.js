import { Grid, Checkbox, DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText, IconButton, Tooltip } from "@mui/material";
import "./BusinessInfo.css";
import Typography from "@material-ui/core/Typography";
import { useState, useEffect } from "react";
import { forwardRef, useImperativeHandle } from "react";
import plus from "../img/register/plus.svg";
import trash from "../img/register/trash.svg";
import { counselorInfo, WeekType, BusinessTime, Period, OverrideTime } from "../../dataContract/counselor";
import { TimePicker } from "antd";
import { showToast, toastType } from "../../common/method";
import Calender from "react-calendar";
import dayjs from "dayjs";
import 'react-calendar/dist/Calendar.css';
import {
    InfoCircleOutlined
} from "@ant-design/icons";
const BusinessInfo = forwardRef((props, ref) => {
    const currentDate = new Date();
    const maxDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, currentDate.getDate());
    const [chooseDate, setChooseDate] = useState(currentDate);
    const [checkedHours, setCheckedHours] = useState([]);
    const [overrideTimes, setOverrideTimes] = useState([]);
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
    const [isDailyHourOpen, setIsDailyHourOpen] = useState(false);
    const [isNeedSort, setIsNeedSort] = useState(false);
    const [consultHours, setConsultHours] = useState(businessHours);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const bubbleSortDailyHour = () => {
        var output = overrideTimes;
        for (var i = 0; i < output.length; i++) {
            for (var j = 0; j < output.length - i - 1; j++) {
                if (new Date(output[j].DayTime) > new Date(output[j + 1].DayTime)) {
                    var temp = output[j];
                    output[j] = output[j + 1];
                    output[j + 1] = temp;
                }
            }
        }
        return output;

    }
    useEffect(() => {
        if (isNeedSort) {
            setIsNeedSort(false);
            var sortResult = bubbleSortDailyHour();
            setOverrideTimes([...sortResult]);
        }
    }, [isNeedSort])

    useImperativeHandle(ref, () => ({
        checkAllInput() {
            var output = true;
            // whether output is true or false => update info to counselor model
            let businessTimes: BusinessTime[] = [];
            consultHours.forEach((consultHour) => {
                if (consultHour.periods.length > 0) {
                    let businessTime = new BusinessTime();
                    businessTime.WeekOfDay = consultHour.day;
                    consultHour.periods.forEach((period) => {
                        let businessPeriod = new Period();
                        businessPeriod.StartTime = period.startTime;
                        businessPeriod.EndTime = period.endTime;
                        businessTime.Periods.push(businessPeriod);
                    });
                    businessTimes.push(businessTime);
                }
            })
            counselorInfo.updateBusinessTimes = businessTimes;
            counselorInfo.updateOverrideTimes = overrideTimes;

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
        tempItems[index].periods = arrayRemove(tempItems[index].periods, tempItems[index].periods[period_index]);
        setConsultHours([...tempItems]);
    }

    const checkWeeklyHoursOverlap = () => {
        let output = false;
        for (var i = 0; i < consultHours[selectedBusiness].periods.length; i++) {
            let tempStartTime = new Date(`2023-01-01T${consultHours[selectedBusiness].periods[i].startTime}`);
            let tempEndTime = new Date(`2023-01-01T${consultHours[selectedBusiness].periods[i].endTime}`);
            let curStartTime = new Date(`2023-01-01T${startTime.format("HH:mm")}`);
            let curEndTime = new Date(`2023-01-01T${endTime.format("HH:mm")}`);

            if (curStartTime < tempEndTime && curEndTime > tempStartTime) {
                showToast(toastType.error, startTime.format("HH:mm") + "-" + endTime.format("HH:mm") + "與" + consultHours[selectedBusiness].periods[i].startTime + " - " + consultHours[selectedBusiness].periods[i].endTime + "時間重疊，請重新選擇");
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
    const handleClose = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setIsOpen(false);
    }
    const handleDailyHourAccept = async () => {
        let overrideTime = new OverrideTime();
        setCheckedHours(checkedHours.sort((a, b) => a - b));
        overrideTime.DayTime = chooseDate.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
        overrideTime.Periods = checkedHours.map((checkedHour, index) => {
            let period = new Period();
            period.StartTime = `${checkedHour}:00`;
            period.EndTime = `${checkedHour + 1}:00`;
            return period;
        })
        var searchIndex = overrideTimes.findIndex((item) => item.DayTime === overrideTime.DayTime); // find whether the DayTime is exist
        if (searchIndex !== -1) { // if exist, use latest setting
            overrideTimes.splice(searchIndex, 1);
            setOverrideTimes(overrideTimes);
        }
        if (checkedHours.length > 0) { // if period is not empty, valid override => add to overrideTimes
            setOverrideTimes([...overrideTimes, overrideTime]);
            setIsNeedSort(true);
        }
        clearAndCloseDailyHourDialog();

    }
    const handleDailyHourCancel = () => {
        clearAndCloseDailyHourDialog();
    }
    const handleDailyHourClose = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        clearAndCloseDailyHourDialog();
    }
    const clearAndCloseDailyHourDialog = () => {
        setIsDailyHourOpen(false);
        setChooseDate(currentDate);
        setCheckedHours([]);
    }

    const handleHourToggle = (hour) => {
        if (checkedHours.includes(hour)) {
            // 如果已經被勾選，則從已勾選的小時中移除
            setCheckedHours(checkedHours.filter((h) => h !== hour));
        } else {
            // 如果尚未被勾選，則加入到已勾選的小時中
            setCheckedHours([...checkedHours, hour]);
        }
    };
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
        for (let i = 0; i <= startHour; i++) {
            hours.push(i);
        }

        return {
            disabledHours: () => hours,
            disabledMinutes: () => minutes,
            disabledSeconds: () => [],
        };
    }
    const onClickDay = (value) => {
        setChooseDate(value);
        setIsDailyHourOpen(true);
    }
    const onClickDeleteDailyHour = (deletedIndex) => {
        overrideTimes.splice(deletedIndex, 1);
        setOverrideTimes(overrideTimes);
        setIsNeedSort(true);
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
                            onSelect={(value) => {
                                console.log("111 startTime", value);
                                setStartTime(value);
                            }
                            }
                            changeOnBlur={true}
                            showNow={false}
                        />
                    </div>
                    <div>
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
                            disabled={startTime == null}
                            onSelect={(value) => {
                                console.log("111 endTime", value);
                                setEndTime(value);
                            }
                            }
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
    const createDailyHourDialog = () => {
        return <Dialog
            open={isDailyHourOpen}
            fullWidth={true}
            onClose={handleDailyHourClose}
            value={"sm"}>
            <DialogTitle id="alert-dialog-title">{"請勾選時段( " + chooseDate.toLocaleDateString('zh-CN') + " )"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <div>
                        {Array.from({ length: 24 }, (_, index) => (
                            <div>
                                <label key={index}>
                                    <input
                                        type="checkbox"
                                        checked={checkedHours.includes(index)}
                                        onChange={() => handleHourToggle(index)}
                                    />
                                    {index}:00 - {index + 1}:00
                                </label>
                            </div>
                        ))}
                    </div>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <button className={"finishButton"} onClick={handleDailyHourCancel}>
                    {"取消"}
                </button>
                <button className={"acceptButton"} onClick={handleDailyHourAccept} color="primary" autoFocus>
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
                                {/* <Checkbox checked={consultHour.enabled} onClick={() => {
                                    handleChecked(index);
                                }}></Checkbox> */}
                                <span>
                                    <strong>{consultHour.day}</strong>
                                    {consultHour.periods.map((period, period_index) => {
                                        return (<span key={period_index}> {(period.startTime + " - " + period.endTime)}
                                            <Tooltip title="刪除" placement="top" arrow={true}>
                                                <img style={{ marginLeft: 3, marginRight: 10, height: 15, width: 15, verticalAlign: 'middle' }} src={trash} alt="" onClick={() => handleDelete(index, period_index)} />
                                            </Tooltip>
                                        </span>)
                                    })}
                                    <img style={{ position: 'absolute', right: "25%", height: 25, width: 25, verticalAlign: 'middle' }} src={plus} alt="" onClick={() => handleAddPeriod(index)}></img>
                                </span>
                            </li>
                        ))}
                    </div>
                </Grid>
            </Grid>
            <div style={{ flex: 1, flexDirection: 'row', display: 'inline-block' }}>
                <Typography variant="h6" gutterBottom>
                    {"填寫諮商時段(Daily Hours)"}
                    <Tooltip title="會根據您指定的日期與時段，覆蓋掉原本的Weekly Hour的時段。" placement="top" enterDelay={0} leaveDelay={200} arrow={true}>
                        <InfoCircleOutlined style={{ marginLeft: 10, verticalAlign: 0 }}></InfoCircleOutlined>
                    </Tooltip>
                </Typography>
            </div>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Calender calendarType="US" maxDate={maxDate} minDate={currentDate} locale="en" onClickDay={(value) => onClickDay(value)}></Calender>
                </Grid>
                <Grid item xs={12}>
                    {overrideTimes.map((overrideTime, index) => {
                        return (
                            <div style={{ marginBottom: 10 }}>
                                <div>
                                    <span>{overrideTime.DayTime}</span>
                                    <Tooltip title="刪除" placement="top" arrow={true}>
                                        <img style={{ marginLeft: 3, marginRight: 10, height: 15, width: 15, verticalAlign: 'middle' }} src={trash} alt="" onClick={() => onClickDeleteDailyHour(index)} />
                                    </Tooltip>
                                </div>
                                <div>
                                    {overrideTime.Periods.map((period, period_index) => {
                                        return (
                                            <span key={period_index}> {(period.StartTime + " - " + period.EndTime)}
                                                {period_index === overrideTime.Periods.length - 1 ? null : <span>{" / "}</span>}
                                            </span>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </Grid>
            </Grid>
            <div style={{ height: 30 }}></div>
            <div>
                {createDialog()}
            </div>
            <div>
                {createDailyHourDialog()}
            </div>
        </div>

    );

})


export default BusinessInfo;

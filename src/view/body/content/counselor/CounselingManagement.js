import { Grid, DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText, Button, Tooltip } from "@mui/material";
import "./counselingManagement.css";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import plus from "../../../img/register/plus.svg";
import trash from "../../../img/register/trash.svg";
import { counselorInfo, WeekType, BusinessTime, Period, OverrideTime, AppointmentTime } from "../../../../dataContract/counselor";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { showToast, toastType } from "../../../../common/method";
import Calender from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import {
    InfoCircleOutlined
} from "@ant-design/icons";
import { counselorService } from "../../../../service/ServicePool";
import dayjs from "dayjs";

const CounselingManagement = () => {
    const [disableSaveBtn, setDisabledSaveBtn] = useState(true);
    const currentDate = new Date();
    const maxDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, currentDate.getDate());
    const [chooseDate, setChooseDate] = useState(currentDate);
    const [checkedHours, setCheckedHours] = useState([]);
    const [overrideTimes, setOverrideTimes] = useState([]);
    const [unavailable, setUnavailable] = useState(false);
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
    const defaultSelectedTime = dayjs('01:00', 'HH:mm');
    const [startTime, setStartTime] = useState(defaultSelectedTime);
    const [endTime, setEndTime] = useState(defaultSelectedTime);
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
    const initialBusinessInfo = () => {
        counselorService.getAppointmentTime().then((business) => {
            counselorInfo.updateBusinessTimes = business.BusinessTimes;
            counselorInfo.updateOverrideTimes = business.OverrideTimes;
            counselorInfo.BusinessTimes.forEach((businessTime, index) => {
                let tempIndex = businessHours.findIndex((businessHour) => businessHour.day === businessTime.WeekOfDay);
                if (tempIndex !== -1) {
                    businessHours[tempIndex].enabled = true;
                    businessTime.Periods.map((period, index) => {
                        businessHours[tempIndex].periods.push({ startTime: period.StartTime, endTime: period.EndTime });
                    });
                }

            });
            setConsultHours(businessHours);
            setOverrideTimes(counselorInfo.OverrideTimes);
        });
    }
    useEffect(() => {
        if (isNeedSort) {
            setIsNeedSort(false);
            var sortResult = bubbleSortDailyHour();
            setOverrideTimes([...sortResult]);
        }
    }, [isNeedSort])
    useEffect(() => {
        initialBusinessInfo();
    }, [])
    const handleSave = async () => {
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
        if (output) {
            let backupBusinessTimes = counselorInfo.BusinessTimes;
            let backupOverrideTimes = counselorInfo.OverrideTimes;
            let appointmentTime = new AppointmentTime();
            counselorInfo.updateBusinessTimes = businessTimes;
            counselorInfo.updateOverrideTimes = overrideTimes;
            appointmentTime.BusinessTimes = businessTimes;
            appointmentTime.OverrideTimes = overrideTimes;
            let res = await counselorService.setAppointmentTime(appointmentTime);
            if (res.success) {
                showToast(toastType.success, "儲存成功");
                setDisabledSaveBtn(true);
            }
            else {
                counselorInfo.updateBusinessTimes = backupBusinessTimes;
                counselorInfo.updateOverrideTimes = backupOverrideTimes;
                showToast(toastType.error, "儲存失敗");
                setDisabledSaveBtn(false);
            }
        }
        else {
            showToast(toastType.error, "儲存失敗");
            setDisabledSaveBtn(false);
        }
    }
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
        setDisabledSaveBtn(false);
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
        if (startTime.format("HH:mm") >= endTime.format("HH:mm")) {
            showToast(toastType.error, "開始時間" + startTime.format("HH:mm") + "不可超過或等於 結束時間" + endTime.format("HH:mm"));
            return;
        }
        if (checkWeeklyHoursOverlap()) {
            return;
        }
        var tempItems = consultHours;
        setIsOpen(false);
        tempItems[selectedBusiness].periods.push({ startTime: startTime.format("HH:mm"), endTime: endTime.format("HH:mm") });
        tempItems = bubbleSortPeriods();
        setConsultHours([...tempItems]);
        setStartTime(defaultSelectedTime);
        setEndTime(defaultSelectedTime);
        setDisabledSaveBtn(false);
    }
    const handleCancel = () => {
        setIsOpen(false);
        setStartTime(defaultSelectedTime);
        setEndTime(defaultSelectedTime);
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
        overrideTime.Unavailable = unavailable;
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
        if (checkedHours.length > 0 || ((checkedHours.length === 0) && (overrideTime.Unavailable === true))) { // if period is not empty, valid override => add to overrideTimes
            setOverrideTimes([...overrideTimes, overrideTime]);
            setIsNeedSort(true);
        }
        clearAndCloseDailyHourDialog();
        setDisabledSaveBtn(false);
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
        setUnavailable(false);
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
    const clearHourToggle = (unavailable) => {
        setCheckedHours([]);
        setUnavailable(unavailable);
    }
    function arrayRemove(arr, value) {
        return arr.filter(function (ele) {
            return ele !== value;
        });
    }
    function disabledStartTimes(now: Dayjs) {
        const hours = [0, 23];
        return {
            disabledHours: () => hours,
            disabledMinutes: () => [],
            disabledSeconds: () => [],
        };
    }
    function disabledEndTimes(now: Dayjs) {
        const hours = [0, 23];
        const minutes = [];
        if (startTime === null) {
            return {
                disabledHours: () => hours,
                disabledMinutes: () => [],
                disabledSeconds: () => [],
            };
        }
        const startHour = startTime.format("HH").split(":");
        const startMinute = startTime.format("mm").split(":");
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
            disabledMinutes: () => [],
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
        setDisabledSaveBtn(false);
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
                    <div style={{ marginBottom: 10, display: 'flex', justifyItems: 'center', alignItems: 'center' }}>
                        <span style={{ marginRight: 10 }}>開始時間</span>
                        <TimePicker
                            format={"HH:mm"}
                            value={startTime}
                            onChange={(value) => {
                                setStartTime(value);
                            }
                            }
                            views={['hours']}
                            shouldDisableTime={(value, view) => {
                                let hour = parseInt(value.format("HH"));
                                if (hour === 0 || hour === 23) {
                                    return true;
                                }
                                return false;
                            }}
                            ampm={false}
                            desktopModeMediaQuery="@media (min-width: 0px)"
                        />
                    </div>
                    <div style={{ marginBottom: 10, display: 'flex', justifyItems: 'center', alignItems: 'center' }}>
                        <span style={{ marginRight: 10 }}>結束時間</span>
                        <TimePicker
                            format={"HH:mm"}
                            value={endTime}
                            onChange={(value) => {
                                setEndTime(value);
                            }
                            }
                            views={['hours']}
                            shouldDisableTime={(value, view) => {
                                let hour = parseInt(value.format("HH"));
                                if (hour === 0 || hour === 23 || hour < parseInt(startTime.format("HH"))) {
                                    return true;
                                }
                                return false;
                            }}
                            ampm={false}
                            desktopModeMediaQuery="@media (min-width: 0px)"
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
        const startHour = 1;
        const finishHour = 23;
        return <Dialog
            open={isDailyHourOpen}
            fullWidth={true}
            onClose={handleDailyHourClose}
            value={"sm"}>
            <DialogTitle id="alert-dialog-title">{"請勾選時段( " + chooseDate.toLocaleDateString('zh-CN') + " )"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <div>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={unavailable}
                                    onChange={() => clearHourToggle(!unavailable)}
                                />
                                {"無可預約時段"}
                            </label>
                        </div>
                        {Array.from({ length: finishHour - startHour }, (_, hour) => {
                            hour += startHour;
                            return (
                                <div key={hour}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={(checkedHours.includes(hour)) && (unavailable === false)}
                                            onChange={() => handleHourToggle(hour)}
                                        />
                                        {hour}:00 - {hour + 1}:00
                                    </label>
                                </div>
                            )
                        })}
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
        <div className={"CounselingManagement"} style={{ height: '100%', overflowY: 'scroll' }}>
            <Typography style={{ marginTop: 10, fontSize: 20 }} gutterBottom>
                時段管理
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                style={{ float: 'right' }}
                disabled={disableSaveBtn}
            >
                {'儲存'}
            </Button>
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
                                    <img style={{ marginLeft: 30, float: 'right', height: 25, width: 25, verticalAlign: 'middle' }} src={plus} alt="" onClick={() => handleAddPeriod(index)}></img>
                                </span>
                            </li>
                        ))}
                    </div>
                </Grid>
            </Grid>
            <div style={{ flex: 1, flexDirection: 'row', display: 'inline-block' }}>
                <Typography variant="h6" gutterBottom>
                    {"填寫時段(Daily Hours)"}
                    <Tooltip title="會根據您指定的日期與時段，覆蓋掉原本的Weekly Hour的時段。" placement="top" enterDelay={0} leaveDelay={200} arrow={true}>
                        <InfoCircleOutlined style={{ marginLeft: 10, verticalAlign: 0 }}></InfoCircleOutlined>
                    </Tooltip>
                </Typography>
            </div>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Calender calendarType="gregory" maxDate={maxDate} minDate={currentDate} locale="en" onClickDay={(value) => onClickDay(value)}></Calender>
                </Grid>
                <Grid item xs={12}>
                    {overrideTimes.map((overrideTime, index) => {
                        console.log("overrideTime", overrideTime);
                        return (
                            <div style={{ marginBottom: 10 }} key={index}>
                                <div>
                                    <span>{overrideTime.DayTime}</span>
                                    <Tooltip title="刪除" placement="top" arrow={true}>
                                        <img style={{ marginLeft: 3, marginRight: 10, height: 15, width: 15, verticalAlign: 'middle' }} src={trash} alt="" onClick={() => onClickDeleteDailyHour(index)} />
                                    </Tooltip>
                                </div>
                                {overrideTime.Unavailable ?
                                    <div>
                                        {"無可預約時段"}
                                    </div>
                                    :
                                    <div>
                                        {overrideTime.Periods.map((period, period_index) => {
                                            return (
                                                <span key={period_index}> {(period.StartTime + " - " + period.EndTime)}
                                                    {period_index === overrideTime.Periods.length - 1 ? null : <span>{" / "}</span>}
                                                </span>
                                            )
                                        })}
                                    </div>
                                }
                            </div>
                        )
                    })}
                </Grid>
            </Grid>
            <div style={{ height: 30 }}></div>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'zh-cn'} >
                {createDialog()}
            </LocalizationProvider>
            <div>
                {createDailyHourDialog()}
            </div>
        </div>

    );
}

export default CounselingManagement;
import { Grid, DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText, Button, Tooltip } from "@mui/material";
import "./counselingManagement.css";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import plus from "../../../img/register/plus.svg";
import trash from "../../../img/register/trash.svg";
import btn_delete from "../../../img/register/delete.svg";
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
import { useNavigate } from "react-router-dom";

const CounselingManagement = () => {
    let navigate = useNavigate();
    const [disableSaveBtn, setDisabledSaveBtn] = useState(true);
    const currentDate = new Date();
    const maxDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, currentDate.getDate());
    const [chooseDate, setChooseDate] = useState(currentDate);
    const [checkedHours, setCheckedHours] = useState([]);
    const [overrideTimes, setOverrideTimes] = useState([]);
    const [unavailable, setUnavailable] = useState(false);
    // 定義多個營業時間
    let businessHours = [
        { enabled: false, name: "週一", day: WeekType.Monday, periods: [] },
        { enabled: false, name: "週二", day: WeekType.Tuesday, periods: [] },
        { enabled: false, name: "週三", day: WeekType.Wednesday, periods: [] },
        { enabled: false, name: "週四", day: WeekType.Thursday, periods: [] },
        { enabled: false, name: "週五", day: WeekType.Friday, periods: [] },
        { enabled: false, name: "週六", day: WeekType.Saturday, periods: [] },
        { enabled: false, name: "週日", day: WeekType.Sunday, periods: [] },
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
    const handleBack = () => {
        navigate("/couchspace-cms/home", { replace: true });
    }
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
            <div style={{ paddingTop: 10, flex: 1, flexDirection: "row", display: "flex", position: "sticky", top: 0, zIndex: 999, background: "#F7F8F8" }}>
                <div style={{ flex: 1 }}>
                    <Typography style={{ fontSize: 24, fontFamily: "PingFang TC", fontWeight: "600", color: "#212629" }} gutterBottom>
                        時段管理
                    </Typography>
                </div>
                <div style={{ width: 86 }}>
                    <Button
                        variant="outlined"
                        onClick={handleBack}
                        style={{ backgroundColor: "#D9D9D9", borderColor: "transparent", color: "#555654" }}
                    >
                        {'返回'}
                    </Button>
                </div>
                <div style={{ width: 86 }}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleSave}
                        disabled={disableSaveBtn}
                    >
                        {'儲存'}
                    </Button>
                </div>
            </div>
            <div style={{ marginTop: 10 }}>
                <Typography style={{ lineHeight: 3, paddingLeft: 29, fontSize: 20, fontFamily: "PingFang TC", fontWeight: "600", color: "#212629", backgroundColor: "#ECF0F1", borderRadius: 6 }} gutterBottom>
                    時段選擇
                </Typography>
            </div>
            <div style={{ flex: 1, flexDirection: 'row', display: 'inline-block', paddingLeft: 29, marginTop: 30 }}>
                <Typography style={{ fontFamily: "PingFang TC", fontSize: 16, fontWeight: "400", color: "#212629" }} gutterBottom>
                    {"每日可預約時段"}
                </Typography>
                <Typography style={{ fontFamily: "PingFang TC", fontSize: 16, fontWeight: "400", color: "#707070" }}>
                    {"設定每日預設可預約的時間範圍；若某些日期無法開放，可至下方「指定日期設定」，系統將以指定內容為主。"}
                </Typography>
            </div>
            <Grid style={{ fontFamily: "PingFang TC", fontSize: 16, fontWeight: "400", color: "#212629", marginTop: 16 }} container spacing={3}>
                <Grid item xs={12}>
                    <div style={{ width: 1360, height: 438, backgroundColor: "#FFFFFF", borderRadius: 10, marginLeft: 23, alignItems: "center", justifyItems: "centers" }}>
                        <div style={{ height: 15 }}></div>
                        {consultHours.map((consultHour, index) => (
                            <li style={{ height: 48, width: 1258, marginLeft: 20, marginTop: 10, display: 'block', backgroundColor: "#F6F6F6", paddingLeft: 20, borderRadius: 10 }} key={index}>
                                {/* <Checkbox checked={consultHour.enabled} onClick={() => {
                                    handleChecked(index);
                                }}></Checkbox> */}
                                <span>
                                    <strong style={{ lineHeight: 3 }}>{consultHour.name}</strong>
                                    <Button class="btn_addTime" onClick={() => handleAddPeriod(index)}>
                                        <span class="text_addTime">{'新增時段'}</span>
                                    </Button>
                                    {consultHour.periods.map((period, period_index) => {
                                        return (
                                            <span class="btn_delete" disabled={true} key={period_index}>
                                                <span class="text_delete">{(period.startTime + "-" + period.endTime)}</span>
                                                <img class="img_delete" src={btn_delete} alt="" onClick={() => handleDelete(index, period_index)}></img>
                                            </span>
                                        )
                                    })}

                                </span>
                            </li>
                        ))}
                    </div>
                </Grid>
            </Grid>
            <div style={{ flex: 1, flexDirection: 'row', display: 'inline-block', paddingLeft: 29, marginTop: 30 }}>
                <Typography style={{ fontFamily: "PingFang TC", fontSize: 16, fontWeight: "400", color: "#212629" }} gutterBottom>
                    {"指定可預約日期時段"}
                </Typography>
                <Typography style={{ fontFamily: "PingFang TC", fontSize: 16, fontWeight: "400", color: "#707070" }}>
                    {"指定的日期與時段會覆蓋原本每日的開放時段。"}
                </Typography>
            </div>
            <Grid style={{ fontFamily: "PingFang TC", fontSize: 16, fontWeight: "400", color: "#212629", marginTop: 16 }} container spacing={3}>
                <div style={{ display: "flex", width: 1360, height: 438, backgroundColor: "#FFFFFF", borderRadius: 10, marginLeft: 47, flexDirection: "row" }}>
                    <Grid style={{ marginTop: 37, marginLeft: 28 }} item xs={12} sm={4}>
                        <Calender style={{ width: 340 }} calendarType="gregory" maxDate={maxDate} minDate={currentDate} locale="en" onClickDay={(value) => onClickDay(value)}></Calender>
                    </Grid>
                    <Grid style={{ marginTop: 37, marginLeft: 24 }} item xs={12}>
                        <Typography style={{ fontFamily: "PingFang TC", fontSize: 16, fontWeight: "400", color: "#212629" }} gutterBottom>
                            {"時段列表"}
                        </Typography>
                        {overrideTimes.map((overrideTime, index) => {
                            console.log("overrideTime", overrideTime);
                            return (
                                <div style={{ marginBottom: 10 }} key={index}>
                                    <div class="overrideTime">
                                        <span class="daytime_overrideTime">{overrideTime.DayTime}</span>
                                        {overrideTime.Unavailable ?
                                            <span class="time_overrideTime">
                                                {"無可預約時段"}
                                            </span>
                                            :
                                            <span>
                                                {overrideTime.Periods.map((period, period_index) => {
                                                    return (
                                                        <span class="time_overrideTime" key={period_index}> {(period.StartTime + "-" + period.EndTime)}</span>
                                                    )
                                                })}
                                            </span>
                                        }
                                        <img class="img_delete" style={{ float: "right" }} src={btn_delete} alt="" onClick={() => onClickDeleteDailyHour(index)}></img>
                                    </div>

                                </div>
                            )
                        })}
                    </Grid>
                </div>
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
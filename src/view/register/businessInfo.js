import { Grid, Checkbox, Button } from "@mui/material";
import "./BusinessInfo.css";
import Typography from "@material-ui/core/Typography";
import { useRef, useState } from "react";
import { forwardRef, useImperativeHandle } from "react";
import plus from "../img/register/plus.svg";
import trash from "../img/register/trash.svg";
// 定義多個營業時間
let businessHours = [
    { enabled: false, day: 'Sunday', periods: [{ startTime: '09:30', endTime: '17:30' }] },
    { enabled: false, day: 'Monday', periods: [{ startTime: '10:00', endTime: '17:00' }, { startTime: '10:50', endTime: '24:00' }] },
    { enabled: false, day: 'Tuesday', periods: [{ startTime: '09:00', endTime: '17:00' }] },
    { enabled: false, day: 'Wednesday', periods: [{ startTime: '09:30', endTime: '17:30' }] },
    { enabled: false, day: 'Thursday', periods: [{ startTime: '09:30', endTime: '17:30' }] },
    { enabled: false, day: 'Friday', periods: [{ startTime: '09:30', endTime: '17:30' }] },
    { enabled: false, day: 'Saturday', periods: [{ startTime: '09:30', endTime: '17:30' }] },
];
const BusinessInfo = forwardRef((props, ref) => {

    const [consultHours, setConsultHours] = useState(businessHours);

    useImperativeHandle(ref, () => ({
    }))

    return (
        <div className={"BusinessInfo"}>
            <Typography style={{ marginTop: 10 }} variant="h6" gutterBottom>
                {"填寫諮商時段(Weekly Hours)"}
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <div>

                        {consultHours.map((consultHour, index) => (
                            <li key={index}>
                                <Checkbox checked={consultHour.enabled} onClick={() => {
                                    businessHours[index].enabled = !businessHours[index].enabled;
                                    setConsultHours([...businessHours]);
                                }}></Checkbox>
                                <span>
                                    <strong>{consultHour.day}</strong>
                                    {consultHour.periods.map((period, index) => {
                                        return <span key={index}> {index === 0 ? (period.startTime + "-" + period.endTime) : ("," + period.startTime + "-" + period.endTime)}  </span>
                                    })}

                                    <img style={{ position: 'absolute', right: "30%", height: 25, width: 25, verticalAlign: 'middle' }} src={plus} alt=""></img>
                                    <img style={{ position: 'absolute', right: "25%", height: 25, width: 25, verticalAlign: 'middle' }} src={trash} alt=""></img>
                                </span>
                            </li>
                        ))}
                    </div>
                </Grid>
            </Grid>
            <div style={{ height: 30 }}></div>
        </div>

    );

})


export default BusinessInfo;

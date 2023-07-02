import "./counselingInfo.css";
import { Grid, TextField, FormHelperText, IconButton, Checkbox, DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText } from "@mui/material";
import Typography from "@material-ui/core/Typography";
import { useState, forwardRef, useImperativeHandle } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Counselor, counselorInfo } from '../../../../dataContract/counselor';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { checkEmail } from "../../../../common/method";
import { useEffect } from "react";
const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: 'none',
    },
}));
const CounselingInfo = forwardRef((props, ref) => {
    const counselingItems = [
        { enabled: false, label: "諮商50分鐘", fee: 0, time: 60, value: "IND_COUNSELING" },
        // { enabled: false, label: "諮商90分鐘", fee: 0, time: 90, value: "IND_COUNSELING" }, // 0607: currently not support 90 min counseling
        { enabled: false, label: "初談10分鐘", fee: 0, time: 60, value: "FIRST" },
        { enabled: false, label: "諮詢50分鐘", fee: 0, time: 60, value: "IND_CONSULTATION" },
        { enabled: false, label: "實體諮商", fee: 0, time: 0, value: "IN_PERSON" },
    ]
    const languagesItems = [
        { enabled: false, label: "中文", value: "zh" },
        { enabled: false, label: "英文", value: "en" },
        { enabled: false, label: "台語", value: "naive" },
        { enabled: false, label: "粵語", value: "yue" },
    ]
    const classes = useStyles();
    const [disabled, setDisabled] = useState(true);
    // setting columns
    /// info
    const [languages, setLanguages] = useState(counselorInfo.Languages);
    const [education, setEducation] = useState(counselorInfo.Educational); // 學歷
    const [seniority, setSeniority] = useState(counselorInfo.Seniority); // 資歷
    const [position, setPosition] = useState(counselorInfo.Position); // 職稱
    const [accumulative, setAccumulative] = useState(counselorInfo.Accumulative); // 從業時間
    const [licenseNumber, setLicenseNumber] = useState(counselorInfo.LicenseNumber); // 證照編號
    const [licenseIssuing, setLicenseIssuing] = useState(counselorInfo.LicenseIssuing); // 發證單位
    const [expertisesInfo, setExpertisesInfo] = useState(counselorInfo.ExpertisesInfo); // 諮商師的專長(自行輸入)
    const [expertises, setExpertises] = useState([]); // 諮商師的專項
    const [tags, setTags] = useState(counselorInfo.Tags); // 親子, 幫助睡眠, 感情問題
    const [consultingFees, setConsultingFees] = useState(counselorInfo.ConsultingFees); // 諮商項目: 初談、諮商60min、諮商90min

    const [errorLanguages, setErrorLanguages] = useState("");
    const [errorEducation, setErrorEducation] = useState("");
    const [errorSeniority, setErrorSeniority] = useState("");
    const [errorPosition, setErrorPosition] = useState("");
    const [errorAccumulative, setErrorAccumulative] = useState("");
    const [errorLicenseNumber, setErrorLicenseNumber] = useState("");
    const [errorLicenseIssuing, setErrorLicenseIssuing] = useState("");
    const [errorExpertises, setErrorExpertises] = useState("");
    const [errorExpertisesInfo, setErrorExpertisesInfo] = useState("");
    const [errorTags, setErrorTags] = useState("");
    const [errorConsultingFees, setErrorConsultingFees] = useState("");

    function ClearAllError() {
        setErrorLanguages("");
        setErrorEducation("");
        setErrorSeniority("");
        setErrorPosition("");
        setErrorAccumulative("");
        setErrorLicenseNumber("");
        setErrorLicenseIssuing("");
        setErrorExpertises("");
        setErrorExpertisesInfo("");
        setErrorConsultingFees("");
    }
    const initialCounselingInfo = () => {
        setLanguages(counselorInfo.Languages);
        setEducation(counselorInfo.Educational);
        setSeniority(counselorInfo.Seniority);
        setPosition(counselorInfo.Position);
        setAccumulative(counselorInfo.Accumulative);
        setLicenseNumber(counselorInfo.LicenseNumber);
        setLicenseIssuing(counselorInfo.LicenseIssuing);
        setExpertises(counselorInfo.Expertises);
        setExpertisesInfo(counselorInfo.ExpertisesInfo);
        setTags(counselorInfo.Tags);
        setConsultingFees(counselorInfo.ConsultingFees);
    }
    useImperativeHandle(ref, () => ({
        checkAllInput() {
            ClearAllError();
            var output = true;

            if (languages.every((language) => language.enabled === false)) {
                setErrorLanguages("請選擇語言");
                output = false;
            }
            if (education === "") {
                setErrorEducation("請輸入學歷");
                output = false;
            }
            if (seniority === "") {
                setErrorSeniority("請輸入諮商經歷");
                output = false;
            }
            if (position === "") {
                setErrorPosition("請輸入職稱");
                output = false;
            }
            if (!(accumulative >= 0)) {
                setErrorAccumulative("請輸入從業時間");
                output = false;
            }
            if (licenseNumber === "") {
                setErrorLicenseNumber("請輸入證照編號");
                output = false;
            }
            if (licenseIssuing === "") {
                setErrorLicenseIssuing("請輸入發證單位");
                output = false;
            }
            if (expertisesInfo.length === 0) {
                setErrorExpertisesInfo("請輸入專長");
                output = false;
            }
            if (expertises.length === 0) {
                setErrorExpertises("請選擇專項");
                output = false;
            }

            if (consultingFees.every((value, index, array) => value.enabled === false)) {
                setErrorConsultingFees("請設定諮商項目");
                output = false;
            }
            // // whether output is true or false => update info to counselor model
            // let info = new Counselor();
            // info.Languages = languages.filter((language) => language.enabled === true);
            // info.Educational = education;
            // info.Seniority = seniority;
            // info.Position = position;
            // info.Accumulative = accumulative;
            // // info.LicenseNumber = licenseNumber;
            // // info.LicenseIssuing = licenseIssuing;
            // info.Expertises = expertises.map((expertise) => {
            //     let object = new Expertise();
            //     object.Skill = expertiseList[expertise].label;
            //     return object;
            // });
            // info.ExpertisesInfo = expertisesInfo;
            // info.ConsultingFees = consultingFees.map((consultingFee) => {
            //     let object = {}
            //     object.Type = {};
            //     object.Type.Label = consultingFee.label;
            //     object.Type.Value = consultingFee.value;
            //     object.Fee = consultingFee.fee;
            //     object.Time = consultingFee.time;
            //     return object;
            // });
            // counselorInfo.updateCounselorInfo = info;
            // console.log("counselorInfo", counselorInfo);
            return output;
        }
    }))
    useEffect(() => {
        initialCounselingInfo();
    })
    return (
        <div className={"CounselingInfo"} style={{ height: '100%', overflowY: 'scroll' }}>
            <Typography style={{ marginTop: 10 }} variant="h6" gutterBottom>
                我的諮商資料
            </Typography>
            <div style={{ marginTop: 10, marginBottom: 20, color: 'red' }}>
                <span> *如需變更資料，請聯繫客服 </span>
            </div>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <div>
                        <span>語言: </span>
                        {languages.map((language, index) => {
                            return (
                                <span key={index} style={{ marginRight: 10 }}>{language}</span>
                            )
                        })}
                    </div>

                </Grid>
                <Grid item xs={12} sm={6}>
                    <div>
                        <span>學歷: </span>
                        <span>{education}</span>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <div>
                        <span>資歷: </span>
                        <span>{seniority}</span>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <div>
                        <span>職稱: </span>
                        <span>{position}</span>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div>
                        <span>從業時間: </span>
                        <span>{accumulative + " 年"}</span>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <div>
                        <span>發證號碼: </span>
                        <span>{licenseNumber}</span>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <div>
                        <span>發證單位: </span>
                        <span>{licenseIssuing}</span>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div>
                        <p>專長: </p>
                        <span>{expertisesInfo}</span>
                    </div>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <div>
                        <p>專項: </p>
                        {expertises.map((expertise, index) => {
                            return (
                                <span key={index} style={{ marginRight: 10 }}>{expertise.Skill}</span>
                            )
                        })}

                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div>
                        <p>諮商項目:</p>
                        {consultingFees.map((consultingFee, index) => {
                            return (
                                <div key={index}>
                                    <span>{consultingFee.Type.Label + " " + consultingFee.Time + " 分鐘 " + new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'NTD', minimumFractionDigits: 0 }).format(consultingFee.Fee)}</span>
                                </div>
                            )
                        })}
                    </div>
                </Grid>
            </Grid>
        </div>
    )
})

export default CounselingInfo;
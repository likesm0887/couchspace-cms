import { FormHelperText, Grid, IconButton, TextField } from "@mui/material";
import "./Consultation.css";
import 'bootstrap/dist/css/bootstrap.css';
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { forwardRef, useImperativeHandle } from "react";
import { Select } from "antd";

const ConsultationInfo = forwardRef((props, ref) => {
    const expertiseList = [
        { value: "0", label: "負面情緒", },
        { value: "1", label: "創傷修復", },
        { value: "2", label: "情緒管理", },
        { value: "3", label: "人際關係", },
        { value: "4", label: "親密關係", },
        { value: "5", label: "家庭衝突", },
        { value: "6", label: "性別議題", },
        { value: "7", label: "自我成長", },
        { value: "8", label: "職涯發展", },
        { value: "9", label: "習慣培養", },
        { value: "10", label: "表達與溝通", },
        { value: "11", label: "正向與正念", },
    ];
    const [education, setEducation] = useState("");
    const [seniority, setSeniority] = useState("");
    const [position, setPosition] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [licenseIssuing, setLicenseIssuing] = useState("");
    const [expertisesInfo, setExpertisesInfo] = useState([]);
    const [consultingFees, setConsultingFees] = useState("");

    const [errorEducation, setErrorEducation] = useState("");
    const [errorSeniority, setErrorSeniority] = useState("");
    const [errorPosition, setErrorPosition] = useState("");
    const [errorLicenseNumber, setErrorLicenseNumber] = useState("");
    const [errorLicenseIssuing, setErrorLicenseIssuing] = useState("");
    const [errorExpertisesInfo, setErrorExpertisesInfo] = useState("");
    const [errorConsultingFees, setErrorConsultingFees] = useState("");
    function ClearAllError() {
        setErrorEducation("");
        setErrorSeniority("");
        setErrorPosition("");
        setErrorLicenseNumber("");
        setErrorLicenseIssuing("");
        setErrorExpertisesInfo("");
        setErrorConsultingFees("");
    }
    useImperativeHandle(ref, () => ({
        checkAllInput() {
            ClearAllError();
            var output = true;
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
            if (licenseNumber === "") {
                setErrorLicenseNumber("請輸入證照編號");
                output = false;
            }
            if (licenseIssuing === "") {
                setErrorLicenseIssuing("請輸入發證單位");
                output = false;
            }
            if (expertisesInfo === "") {
                setErrorExpertisesInfo("請選擇專項");
                output = false;
            }
            if (consultingFees === "") {
                setErrorConsultingFees("請設定諮商項目");
                output = false;
            }
            // if output == true => update info to counselor model
            return output;
        }
    }))

    return (
        <div className={"PersonalInfo"}>
            <Typography style={{ marginTop: 10 }} variant="h6" gutterBottom>
                填寫諮商資訊
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="education"
                        name="education"
                        label="學歷"
                        fullWidth
                        autoComplete="family-name"
                        variant="standard"
                        placeholder="xx大學 oooo系/所 學/碩士"
                        value={education}
                        onChange={(text) => setEducation(text.target.value.trim())}
                        error={errorEducation !== ""}
                        helperText={errorEducation}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="seniority"
                        name="seniority"
                        label="資歷"
                        fullWidth
                        autoComplete="family-name"
                        variant="standard"
                        placeholder="xxx診所 諮商師"
                        value={seniority}
                        onChange={(text) => setSeniority(text.target.value.trim())}
                        error={errorSeniority !== ""}
                        helperText={errorSeniority}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="position"
                        name="position"
                        label="職稱"
                        fullWidth
                        autoComplete="family-name"
                        variant="standard"
                        placeholder="諮商心理師"
                        value={position}
                        onChange={(text) => setPosition(text.target.value.trim())}
                        error={errorPosition !== ""}
                        helperText={errorPosition}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="licenseNumber"
                        name="licenseNumber"
                        label="證照號碼"
                        fullWidth
                        autoComplete="family-name"
                        variant="standard"
                        placeholder="諮心字第00665號"
                        value={licenseNumber}
                        onChange={(text) => setLicenseNumber(text.target.value.trim())}
                        error={errorLicenseNumber !== ""}
                        helperText={errorLicenseNumber}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="licenseIssuing"
                        name="licenseIssuing"
                        label="發證單位"
                        fullWidth
                        autoComplete="family-name"
                        variant="standard"
                        placeholder="衛生福利部"
                        value={licenseIssuing}
                        onChange={(text) => setLicenseIssuing(text.target.value.trim())}
                        error={errorLicenseIssuing !== ""}
                        helperText={errorLicenseIssuing}
                    />
                </Grid>
                <Grid item xs={12}>

                    <TextField
                        required
                        id="expertisesInfo"
                        name="expertisesInfo"
                        label="專項"
                        fullWidth
                        autoComplete="family-name"
                        variant="standard"
                        value={expertisesInfo}
                        onChange={(text) => setExpertisesInfo(text.target.value.trim())}
                        error={errorExpertisesInfo !== ""}
                        helperText={errorExpertisesInfo}
                    />
                </Grid>
                <Grid item xs={12}>
                    <div>
                        <span style={{ color: "rgba(0,0,0,0.6)" }}>專項(最多三項)</span>
                        <div>
                            <Select
                                placeholder="請選擇..."
                                mode="multiple"
                                size="large"
                                onChange={(value) => {
                                    if (value.length <= 3) {
                                        setExpertisesInfo(value);
                                    }
                                }}
                                value={expertisesInfo}
                                tokenSeparators={[","]}
                                options={expertiseList}
                                showArrow={true}
                                showSearch={true}
                                style={{ width: "100%" }}
                            />
                            <FormHelperText error={errorExpertisesInfo !== ""}>{errorExpertisesInfo}</FormHelperText>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="consultingFees"
                        name="consultingFees"
                        label="諮商項目"
                        fullWidth
                        autoComplete="family-name"
                        variant="standard"
                        value={consultingFees}
                        onChange={(text) => setConsultingFees(text.target.value.trim())}
                        error={errorConsultingFees !== ""}
                        helperText={errorConsultingFees}
                    />
                </Grid>
            </Grid>
            <div style={{ height: 30 }}></div>
        </div>

    );

})


export default ConsultationInfo;

import { FormHelperText, Grid, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Checkbox } from "@mui/material";
import "./Consultation.css";
import Typography from "@material-ui/core/Typography";
import { useRef, useState } from "react";
import { forwardRef, useImperativeHandle } from "react";
import { Select } from "antd";

let counselingItems = [
    { enabled: false, label: "諮商60分鐘 (緩衝10分鐘)", fee: "0", time: 60 },
    { enabled: false, label: "諮商90分鐘 (緩衝10分鐘)", fee: "0", time: 90 },
    { enabled: false, label: "初探10分鐘", fee: "0", time: 10 },
    { enabled: false, label: "諮詢60分鐘 (緩衝10分鐘)", fee: 0, time: 60 },
    { enabled: false, label: "實體諮商", fee: "0", time: 0 },
]
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
    const tagList = [
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
    /// dialog
    const [isOpen, setIsOpen] = useState(false);

    /// info
    const [education, setEducation] = useState(""); // 學歷
    const [seniority, setSeniority] = useState(""); // 資歷
    const [position, setPosition] = useState(""); // 職稱
    const [licenseNumber, setLicenseNumber] = useState(""); // 證照編號
    const [licenseIssuing, setLicenseIssuing] = useState(""); // 發證單位
    const [expertises, setExpertises] = useState(""); // 諮商師的專長(自行輸入)
    const [expertisesInfo, setExpertisesInfo] = useState([]); // 諮商師的專項
    const [tags, setTags] = useState([]); // 親子, 幫助睡眠, 感情問題
    const [consultingFees, setConsultingFees] = useState(counselingItems); // 諮商項目: 初談、諮商60min、諮商90min

    const [errorEducation, setErrorEducation] = useState("");
    const [errorSeniority, setErrorSeniority] = useState("");
    const [errorPosition, setErrorPosition] = useState("");
    const [errorLicenseNumber, setErrorLicenseNumber] = useState("");
    const [errorLicenseIssuing, setErrorLicenseIssuing] = useState("");
    const [errorExpertises, setErrorExpertises] = useState("");
    const [errorExpertisesInfo, setErrorExpertisesInfo] = useState("");
    const [errorTags, setErrorTags] = useState("");
    const [errorConsultingFees, setErrorConsultingFees] = useState("");

    const inputRef = useRef();
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
    const onClickSetting = () => {
        setIsOpen(true);
    }
    const handleClose = () => {
        setIsOpen(false);
    }
    const handleAccept = () => {
        setIsOpen(false);
    }
    const createDialog = () => {
        return <Dialog
            open={isOpen}
            fullWidth={true}
            onClose={handleClose}
            value={"sm"}>
            <DialogTitle id="alert-dialog-title">{"諮商項目設定"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {consultingFees.map((item, index) => {
                        return (
                            <div style={{ display: "block", marginTop: 30 }}>
                                <Checkbox checked={item.enabled} onClick={() => {
                                    counselingItems[index].enabled = !item.enabled;
                                    setConsultingFees([...counselingItems]);
                                }}></Checkbox>
                                <span>{item.label}</span>
                                {item.enabled ?
                                    <span style={{ marginRight: 80, float: 'right' }}>
                                        {"NTD "}
                                        <input
                                            placeholder="0"
                                            min={0}
                                            ref={inputRef}
                                            onWheel={() => inputRef.current.blur()}
                                            type="number"
                                            style={{
                                                width: 80,
                                                padding: 5,
                                                borderStyle: 'solid',
                                                borderWidth: 1,
                                                borderColor: 'grey',
                                                borderRadius: 5,
                                            }}
                                            value={item.fee}
                                            onChange={(text) => {
                                                counselingItems[index].fee = Number(text.target.value).toString();
                                                setConsultingFees([...counselingItems]);
                                            }}
                                        />
                                    </span> : null}
                            </div>
                        )
                    })}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <button className={"acceptButton"} onClick={handleAccept} color="primary" autoFocus>
                    設定完成
                </button>
            </DialogActions>
        </Dialog>
    }
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
                        id="expertises"
                        name="expertises"
                        label="專長"
                        fullWidth
                        autoComplete="family-name"
                        variant="standard"
                        value={expertises}
                        onChange={(text) => setExpertises(text.target.value.trim())}
                        error={errorExpertises !== ""}
                        helperText={errorExpertises}
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
                <Grid item xs={12}>
                    <div>
                        <span style={{ color: "rgba(0,0,0,0.6)" }}>標籤(最多三項)</span>
                        <div>
                            <Select
                                placeholder="請選擇..."
                                mode="multiple"
                                size="large"
                                onChange={(value) => {
                                    if (value.length <= 3) {
                                        setTags(value);
                                    }
                                }}
                                value={tags}
                                tokenSeparators={[","]}
                                options={tagList}
                                showArrow={true}
                                showSearch={true}
                                style={{ width: "100%" }}
                            />
                            <FormHelperText error={errorExpertisesInfo !== ""}>{errorExpertisesInfo}</FormHelperText>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <div>
                        <span style={{ color: 'rgba(0,0,0,0.6)' }}>諮商項目</span>
                        <div>
                            {consultingFees.map((item, index) => {
                                return (
                                    item.enabled ?
                                        <div>
                                            <span>{item.label + "\t\t\t諮商費用 " + new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'NTD', minimumFractionDigits: 0 }).format(item.fee)}</span>
                                        </div>
                                        : null)
                            })}

                            <button type={"button"} className={"btn btn-primary"} onClick={() => onClickSetting()}>設定</button>
                        </div>
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


export default ConsultationInfo;

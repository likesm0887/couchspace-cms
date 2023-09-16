import { FormHelperText, Grid, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Checkbox } from "@mui/material";
import "./Consultation.css";
import Typography from "@material-ui/core/Typography";
import { useRef, useState } from "react";
import { forwardRef, useImperativeHandle } from "react";
import { Select } from "antd";
import { Counselor, Expertise, counselorInfo } from "../../dataContract/counselor";
import { checkLines } from "../../common/method";

const ConsultationInfo = forwardRef((props, ref) => {
    const counselingItems = [
        { enabled: false, label: "個別諮商", fee: 0, time: 50, value: "IND_COUNSELING" },
        // { enabled: false, label: "諮商90分鐘", fee: 0, time: 90, value: "IND_COUNSELING" }, // 0607: currently not support 90 min counseling
        { enabled: false, label: "初談", fee: 0, time: 10, value: "FIRST" },
        { enabled: false, label: "個別諮詢", fee: 0, time: 50, value: "IND_CONSULTATION" },
        { enabled: false, label: "實體諮商", fee: 0, time: 0, value: "IN_PERSON" },
    ]
    const languagesItems = [
        { enabled: false, label: "中文", value: "zh" },
        { enabled: false, label: "英文", value: "en" },
        { enabled: false, label: "台語", value: "naive" },
        { enabled: false, label: "粵語", value: "yue" },
    ]
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
    // const tagList = [
    //     { value: "0", label: "負面情緒", },
    //     { value: "1", label: "創傷修復", },
    //     { value: "2", label: "情緒管理", },
    //     { value: "3", label: "人際關係", },
    //     { value: "4", label: "親密關係", },
    //     { value: "5", label: "家庭衝突", },
    //     { value: "6", label: "性別議題", },
    //     { value: "7", label: "自我成長", },
    //     { value: "8", label: "職涯發展", },
    //     { value: "9", label: "習慣培養", },
    //     { value: "10", label: "表達與溝通", },
    //     { value: "11", label: "正向與正念", },
    // ];

    /// dialog
    const [isOpen, setIsOpen] = useState(false);

    /// info
    const [languages, setLanguages] = useState(languagesItems);
    const [education, setEducation] = useState(counselorInfo.Educational); // 學歷
    const [seniority, setSeniority] = useState(counselorInfo.Seniority); // 資歷
    const [position, setPosition] = useState(counselorInfo.Position); // 職稱
    const [accumulative, setAccumulative] = useState(counselorInfo.Accumulative); // 從業時間
    // const [licenseNumber, setLicenseNumber] = useState(counselorInfo.LicenseNumber); // 證照編號
    // const [licenseIssuing, setLicenseIssuing] = useState(counselorInfo.LicenseIssuing); // 發證單位
    const [expertisesInfo, setExpertisesInfo] = useState(counselorInfo.ExpertisesInfo); // 諮商師的專長(自行輸入)
    const [expertises, setExpertises] = useState([]); // 諮商師的專項
    const [tags, setTags] = useState([]); // 親子, 幫助睡眠, 感情問題
    const [consultingFees, setConsultingFees] = useState(counselingItems); // 諮商項目: 初談、諮商60min、諮商90min

    const [errorLanguages, setErrorLanguages] = useState("");
    const [errorEducation, setErrorEducation] = useState("");
    const [errorSeniority, setErrorSeniority] = useState("");
    const [errorPosition, setErrorPosition] = useState("");
    const [errorAccumulative, setErrorAccumulative] = useState("");
    // const [errorLicenseNumber, setErrorLicenseNumber] = useState("");
    // const [errorLicenseIssuing, setErrorLicenseIssuing] = useState("");
    const [errorExpertises, setErrorExpertises] = useState("");
    const [errorExpertisesInfo, setErrorExpertisesInfo] = useState("");
    const [errorTags, setErrorTags] = useState("");
    const [errorConsultingFees, setErrorConsultingFees] = useState("");

    const inputRef = useRef();
    function ClearAllError() {
        setErrorLanguages("");
        setErrorEducation("");
        setErrorSeniority("");
        setErrorPosition("");
        setErrorAccumulative("");
        // setErrorLicenseNumber("");
        // setErrorLicenseIssuing("");
        setErrorExpertises("");
        setErrorExpertisesInfo("");
        setErrorConsultingFees("");
    }
    useImperativeHandle(ref, () => ({
        checkAllInput() {
            ClearAllError();
            var output = true;

            if (languages.every((language) => language.enabled === false)) {
                setErrorLanguages("請選擇語言");
                output = false;
            }
            if (education.trim() === "") {
                setErrorEducation("請輸入學歷");
                output = false;
            }
            if (seniority.trim() === "") {
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
            // if (licenseNumber === "") {
            //     setErrorLicenseNumber("請輸入證照編號");
            //     output = false;
            // }
            // if (licenseIssuing === "") {
            //     setErrorLicenseIssuing("請輸入發證單位");
            //     output = false;
            // }
            if (expertisesInfo.trim() === "") {
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
            // whether output is true or false => update info to counselor model
            let info = new Counselor();
            info.Languages = languages.filter((language) => language.enabled === true).map((item) => item.label);
            info.Educational = education.trim();
            info.Seniority = seniority.trim();
            info.Position = position;
            info.Accumulative = accumulative;
            // info.LicenseNumber = licenseNumber;
            // info.LicenseIssuing = licenseIssuing;
            info.Expertises = expertises.map((expertise) => {
                let object = new Expertise();
                object.Skill = expertiseList[expertise].label;
                return object;
            });
            info.ExpertisesInfo = expertisesInfo.trim();
            info.ConsultingFees = consultingFees.map((consultingFee) => {
                let object = {}
                object.Type = {};
                object.Type.Label = consultingFee.label;
                object.Type.Value = consultingFee.value;
                object.Fee = consultingFee.fee;
                object.Time = consultingFee.time;
                return object;
            });
            counselorInfo.updateCounselorInfo = info;
            console.log("counselorInfo", counselorInfo);
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
                            <div style={{ display: "block", marginTop: 30 }} key={index}>
                                <Checkbox checked={item.enabled} onClick={() => {
                                    var tempItems = consultingFees;
                                    tempItems[index].enabled = !item.enabled;
                                    setConsultingFees([...tempItems]);
                                }}></Checkbox>
                                {item.time > 0 ?
                                    <span>{item.label + item.time + "分鐘"}</span> :
                                    <span>{item.label}</span>}

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
                                                var tempItems = consultingFees;
                                                tempItems[index].fee = Number(text.target.value);
                                                setConsultingFees([...tempItems]);
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
                    {"設定完成"}
                </button>
            </DialogActions>
        </Dialog>
    }
    return (
        <div className={"ConsultationInfo"}>
            <Typography style={{ marginTop: 10 }} variant="h6" gutterBottom>
                {"填寫諮商資訊"}
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="education"
                        name="education"
                        label="學歷(最多 3 項，請換行輸入)"
                        fullWidth
                        autoComplete="family-name"
                        variant="standard"
                        placeholder="couchspace大學 心理所 碩士"
                        value={education}
                        onChange={(text) => {
                            if (checkLines(text.target.value, '\n', 3)) {
                                setEducation(text.target.value)
                            }
                        }}
                        error={errorEducation !== ""}
                        helperText={errorEducation}
                        multiline={true}
                        rows={3}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="seniority"
                        name="seniority"
                        label="經歷(最多 5 項，請換行輸入)"
                        fullWidth
                        autoComplete="family-name"
                        variant="standard"
                        placeholder="couchspace診所 諮商師"
                        value={seniority}
                        onChange={(text) => {
                            if (checkLines(text.target.value, '\n', 5)) {
                                setSeniority(text.target.value)
                            }
                        }}
                        error={errorSeniority !== ""}
                        helperText={errorSeniority}
                        multiline={true}
                        rows={5}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
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
                        id="accumulative"
                        name="accumulative"
                        label="從業時間"
                        fullWidth
                        type="number"
                        autoComplete="family-name"
                        variant="standard"
                        placeholder=""
                        value={accumulative}
                        onChange={(text) => setAccumulative(parseInt(text.target.value))}
                        error={errorAccumulative !== ""}
                        helperText={errorAccumulative}
                    />
                </Grid>
                <Grid item xs={12}>
                    <div>
                        <span style={{ color: errorLanguages === "" ? 'rgba(0, 0, 0, 0.6)' : '#d32f2f' }}>{"語言 *"}</span>
                        {languages.map((item, index) => {
                            return (
                                <span style={{ marginLeft: 10 }} key={index}>
                                    <Checkbox checked={item.enabled} onClick={() => {
                                        var tempItems = languages;
                                        tempItems[index].enabled = !item.enabled;
                                        setLanguages([...tempItems]);
                                    }}></Checkbox>
                                    <span>{item.label}</span>
                                </span>
                            )
                        })}
                        <FormHelperText error={errorLanguages !== ""}>{errorLanguages}</FormHelperText>
                    </div>
                </Grid>

                {/* <Grid item xs={12} sm={6}>
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
                </Grid> */}
                <Grid item xs={12}>
                    <div>
                        <span style={{ color: errorExpertisesInfo === "" ? 'rgba(0, 0, 0, 0.6)' : '#d32f2f' }}>{"專長 *"}</span>
                        <div>
                            <textarea
                                style={{ color: 'rgba(0,0,0,0.6)', resize: 'none', width: '100%', height: 100 }}
                                onChange={(text) => setExpertisesInfo(text.target.value)}
                                value={expertisesInfo}
                                maxLength={300}
                            ></textarea>
                            <div id="the-count">
                                <span id="current">{expertisesInfo.length}</span>
                                <span id="maximum">/ 300</span>
                            </div>
                        </div>
                        <FormHelperText error={errorExpertisesInfo !== ""}>{errorExpertisesInfo}</FormHelperText>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div>
                        <span style={{ color: errorExpertises === "" ? 'rgba(0, 0, 0, 0.6)' : '#d32f2f' }}>{"專項 * (請選 1 ~ 3 項)"}</span>
                        <div>
                            <Select
                                placeholder="請選擇..."
                                mode="multiple"
                                size="large"
                                onChange={(value) => {
                                    if (value.length <= 3) {
                                        setExpertises(value);
                                    }
                                }}
                                value={expertises}
                                tokenSeparators={[","]}
                                options={expertiseList}
                                showArrow={true}
                                showSearch={true}
                                style={{ width: "100%" }}
                            />
                            <FormHelperText error={errorExpertises !== ""}>{errorExpertises}</FormHelperText>
                        </div>
                    </div>
                </Grid>
                {/* <Grid item xs={12}>
                    <div>
                        <span style={{ color: errorTags === "" ? 'rgba(0, 0, 0, 0.6)' : '#d32f2f' }}>標籤(最多三項)</span>
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
                            <FormHelperText error={errorTags !== ""}>{errorTags}</FormHelperText>
                        </div>
                    </div>
                </Grid> */}
                <Grid item xs={12} sm={6}>
                    <div>
                        <span style={{ color: errorConsultingFees === "" ? 'rgba(0, 0, 0, 0.6)' : '#d32f2f' }}>{"諮商項目 *"}</span>
                        <div>
                            {consultingFees.map((item, index) => {
                                return (
                                    item.enabled ?
                                        <div key={index}>
                                            {item.time > 0 ?
                                                <span>{item.label + item.time + "分鐘\t\t\t諮商費用 " + new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'NTD', minimumFractionDigits: 0 }).format(item.fee)}</span> :
                                                <span>{item.label + "\t\t\t諮商費用 " + new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'NTD', minimumFractionDigits: 0 }).format(item.fee)}</span>
                                            }
                                        </div>
                                        : null)
                            })}

                            <button type={"button"} className={"btn btn-primary"} onClick={() => onClickSetting()}>{"設定"}</button>
                        </div>
                        <FormHelperText error={errorConsultingFees !== ""}>{errorConsultingFees}</FormHelperText>
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

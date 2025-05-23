import "./counselingInfo.css";
import {
    Grid,
    TextField,
    FormHelperText,
    Checkbox,
    DialogActions,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    Button,
} from "@mui/material";
import { Select } from "antd";
import Typography from "@mui/material/Typography";
import { useState, forwardRef } from 'react';
import { Counselor, counselorInfo, Expertise } from '../../../../dataContract/counselor';
import { useEffect, useRef } from "react";
import { counselorService } from "../../../../service/ServicePool";
import { checkLines, showToast, toastType, calTextLength } from "../../../../common/method";
import { useNavigate } from "react-router-dom";

const CounselingInfo = () => {
    let navigate = useNavigate();
    const [disableSaveBtn, setDisabledSaveBtn] = useState(true);
    const maximumFee = 10000;
    const counselingItems = counselorInfo.SubRole !== "HeartCoach" ? [
        { enabled: false, label: "線上初談", fee: 0, time: 10, value: "FIRST" },
        { enabled: false, label: "線上諮詢", fee: 0, time: 50, value: "IND_CONSULTATION" },
        { enabled: false, label: "實體諮商", fee: 0, time: 50, value: "IN_PERSON" },
    ] : [
        { enabled: false, label: "線上體驗", fee: 0, time: 10, value: "FIRST" },
        { enabled: false, label: "線上體驗", fee: 0, time: 50, value: "IND_CONSULTATION" },
        { enabled: false, label: "實體體驗", fee: 0, time: 50, value: "IN_PERSON" },
    ]
    const languagesItems = [
        { enabled: false, label: "中文", value: "zh" },
        { enabled: false, label: "英文", value: "en" },
        { enabled: false, label: "台語", value: "naive" },
        { enabled: false, label: "粵語", value: "yue" },
    ]
    const expertiseList = counselorInfo.SubRole !== "HeartCoach" ? [
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
    ] : [
        { value: "0", label: "職涯發展", },
        { value: "1", label: "探索生命", },
        { value: "2", label: "冥想引導", },
        { value: "3", label: "正念瑜伽", },
        { value: "4", label: "催眠引導", },
        { value: "5", label: "身心療癒", },
    ];
    let licenses = [{ license: "", disabled: false }];

    /// dialog
    const [isOpen, setIsOpen] = useState(false);

    /// info
    const [languages, setLanguages] = useState(languagesItems);
    const [education, setEducation] = useState(counselorInfo.Educational); // 學歷
    const [seniority, setSeniority] = useState(counselorInfo.Seniority); // 資歷
    const [position, setPosition] = useState(counselorInfo.Position); // 職稱
    const [accumulative, setAccumulative] = useState(counselorInfo.Accumulative); // 從業時間
    const [licenseNumber, setLicenseNumber] = useState(counselorInfo.License.LicenseNumber); // 證照編號
    const [licenseIssuing, setLicenseIssuing] = useState(counselorInfo.License.LicenseIssuing); // 發證單位
    const [licenseTitle, setLicenseTitle] = useState(counselorInfo.License.LicenseTitle); // 證照名稱
    const [licenseLists, setLicenseLists] = useState([]); // 相關證照
    const [phone, setPhone] = useState(counselorInfo.Phone); // 機構電話
    const [address, setAddress] = useState(counselorInfo.Address); // 機構地址
    const [institution, setInstitution] = useState(counselorInfo.InstitutionTemp); // 機構名稱
    const [expertisesInfo, setExpertisesInfo] = useState(counselorInfo.ExpertisesInfo); // 心理師的專長(自行輸入)
    const [expertises, setExpertises] = useState([]); // 心理師的專項
    const [consultingFees, setConsultingFees] = useState(counselingItems); // 服務項目

    const [errorLanguages, setErrorLanguages] = useState("");
    const [errorEducation, setErrorEducation] = useState("");
    const [errorSeniority, setErrorSeniority] = useState("");
    const [errorPosition, setErrorPosition] = useState("");
    const [errorAccumulative, setErrorAccumulative] = useState("");
    const [errorLicenseNumber, setErrorLicenseNumber] = useState("");
    const [errorLicenseIssuing, setErrorLicenseIssuing] = useState("");
    const [errorLicenseTitle, setErrorLicenseTitle] = useState("");
    const [errorPhone, setErrorPhone] = useState("");
    const [errorAddress, setErrorAddress] = useState("");
    const [errorInstitution, setErrorInstitution] = useState("");
    const [errorExpertises, setErrorExpertises] = useState("");
    const [errorExpertisesInfo, setErrorExpertisesInfo] = useState("");
    const [errorConsultingFees, setErrorConsultingFees] = useState("");

    const inputRef = useRef();
    const checkPositionLengthIsValid = (position) => {
        let totalLength = calTextLength(position);
        if (totalLength > 16) {
            return false;
        }
        return true;
    }
    function ClearAllError() {
        setErrorLanguages("");
        setErrorEducation("");
        setErrorSeniority("");
        setErrorPosition("");
        setErrorAccumulative("");
        setErrorLicenseNumber("");
        setErrorLicenseIssuing("");
        setErrorLicenseTitle("");
        setErrorExpertises("");
        setErrorExpertisesInfo("");
        setErrorConsultingFees("");
    }
    const initialCounselingInfo = () => {
        counselorService.getCounselorInfo().then((info) => {
            counselorInfo.setCounselorInfo = info;
            let tempConsultingFees = counselingItems;
            let tempLanguages = languagesItems;
            let tempExpertiseList = [];
            counselorInfo.ConsultingFees?.map((consultingFee, index) => {
                let tempIndex = tempConsultingFees.findIndex((item) => item.label === consultingFee.Type.Label);
                if (tempIndex !== -1) {
                    tempConsultingFees[tempIndex].enabled = true;
                    tempConsultingFees[tempIndex].fee = consultingFee.Fee;
                }
                return tempConsultingFees;
            });
            counselorInfo.Languages?.map((language, index) => {
                let tempIndex = tempLanguages.findIndex((item) => item.label === language);
                if (tempIndex !== -1) {
                    tempLanguages[tempIndex].enabled = true;
                }
                return tempLanguages;
            })
            tempExpertiseList = counselorInfo.Expertises.map((expertise, index) => {
                let tempIndex = expertiseList.findIndex((item) => item.label === expertise.Skill);
                if (tempIndex !== -1) {
                    return tempIndex.toString();
                }
            })
            setLanguages(tempLanguages);
            setEducation(counselorInfo?.Educational);
            setSeniority(counselorInfo?.Seniority);
            setPosition(counselorInfo?.Position);
            setAccumulative(counselorInfo?.Accumulative);
            setLicenseNumber(counselorInfo?.License?.LicenseNumber);
            setLicenseIssuing(counselorInfo?.License?.LicenseIssuing);
            setLicenseTitle(counselorInfo?.License?.LicenseTitle);
            setPhone(counselorInfo?.Phone);
            setInstitution(counselorInfo?.InstitutionTemp);
            setAddress(counselorInfo?.Address);
            setExpertises(tempExpertiseList);
            setExpertisesInfo(counselorInfo?.ExpertisesInfo);
            setConsultingFees(tempConsultingFees);
        })
    }
    const handleBack = () => {
        navigate("/couchspace-cms/home", { replace: true });
    }
    const handleSave = async () => {
        ClearAllError();
        var output = true;

        if (languages?.every((language) => language.enabled === false)) {
            setErrorLanguages("請選擇語言");
            output = false;
        }
        if (education.trim() === "") {
            setErrorEducation("請輸入學歷");
            output = false;
        }
        if (seniority.trim() === "") {
            setErrorSeniority("請輸入經歷");
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
        if (counselorInfo.SubRole !== "HeartCoach") {
            if (licenseNumber === "") {
                setErrorLicenseNumber("請輸入證照編號");
                output = false;
            }
            if (licenseIssuing === "") {
                setErrorLicenseIssuing("請輸入發證單位");
                output = false;
            }
            if (licenseTitle === "") {
                setErrorLicenseTitle("請輸入證照名稱");
                output = false;
            }
        }

        if (expertisesInfo.trim() === "") {
            setErrorExpertisesInfo("請輸入專長");
            output = false;
        }
        if (expertises.length === 0) {
            setErrorExpertises("請選擇專項");
            output = false;
        }

        // if (consultingFees.every((value, index, array) => value.enabled === false)) {
        //     setErrorConsultingFees("請設定服務項目");
        //     output = false;
        // }
        if (checkPositionLengthIsValid(position) === false) {
            setErrorPosition("字數過長，最多中文8個字；英文16個字");
            output = false;
        }
        if (output) {
            let info = new Counselor();
            let backupInfo = counselorInfo;
            info.Languages = languages?.filter((language) => language.enabled === true)?.map((item) => item.label);
            info.Educational = education.trim();
            info.Seniority = seniority.trim();
            info.Position = position;
            info.Accumulative = accumulative;
            info.License.LicenseNumber = licenseNumber;
            info.License.LicenseIssuing = licenseIssuing;
            info.License.LicenseTitle = licenseTitle;
            info.Address = address;
            info.Phone = phone;
            info.InstitutionTemp = institution;
            info.Expertises = expertises?.map((expertise) => {
                let object = new Expertise();
                object.Skill = expertiseList[expertise].label;
                return object;
            });
            info.ExpertisesInfo = expertisesInfo.trim();
            info.ConsultingFees = consultingFees.filter((consultingFee) => consultingFee.enabled)?.map((consultingFee) => {
                let object = {}
                object.Type = {};
                object.Type.Label = consultingFee.label;
                object.Type.Value = consultingFee.value;
                object.Fee = consultingFee.fee;
                object.Time = consultingFee.time;
                return object;
            });
            counselorInfo.updateCounselorInfo = info;
            counselorInfo.updateCertificateInfo = info.License;
            counselorInfo.updateInstitution = info;
            let res = await counselorService.updateCounselorInfo(counselorInfo);
            if (res.success) {
                showToast(toastType.success, "儲存完成");
                setDisabledSaveBtn(true);
            }
            else {
                showToast(toastType.error, "儲存失敗");
                counselorInfo.updateCounselorInfo = backupInfo; // rollback
                counselorInfo.updateCertificateInfo = backupInfo.License;
                setDisabledSaveBtn(false);
            }
        }
        else {
            showToast(toastType.error, "儲存失敗");
            setDisabledSaveBtn(false);
        }
    }
    useEffect(() => {
        initialCounselingInfo();
    }, [])
    useEffect(() => {
        if (education !== counselorInfo.Educational ||
            seniority !== counselorInfo.Seniority ||
            position !== counselorInfo.Position ||
            accumulative !== counselorInfo.Accumulative ||
            licenseNumber !== counselorInfo.License.LicenseNumber ||
            licenseIssuing !== counselorInfo.License.LicenseIssuing ||
            licenseTitle !== counselorInfo.License.LicenseTitle ||
            phone !== counselorInfo.Phone ||
            address !== counselorInfo.Address ||
            institution !== counselorInfo.InstitutionTemp ||
            expertisesInfo !== counselorInfo.ExpertisesInfo) {
            setDisabledSaveBtn(false);
        }
        else {
            setDisabledSaveBtn(true);
        }
    }, [education, seniority, position, accumulative, licenseNumber, licenseIssuing, licenseTitle, phone, address, institution, expertisesInfo])
    const handleAddLicense = () => {
        let licenses = licenseLists;
        licenses.push({ license: "", disabled: "" })
        setLicenseLists([...licenses]);
    }
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
            <DialogTitle id="alert-dialog-title">{"服務項目設定(上限金額 10,000)"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {consultingFees?.map((item, index) => {
                        return (
                            <div class="container" style={{ display: "block", marginTop: 30 }} key={index}>
                                <div class="row justify-content-start">
                                    <div class="col-8">
                                        <Checkbox checked={item.enabled} onClick={() => {
                                            var tempItems = consultingFees;
                                            tempItems[index].enabled = !item.enabled;
                                            setConsultingFees([...tempItems]);
                                            setDisabledSaveBtn(false);
                                        }}></Checkbox>
                                        {item.time > 0 ?
                                            <span>{item.label + item.time + "分鐘"}</span> :
                                            <span>{item.label}</span>}
                                    </div>
                                    {item.enabled ?
                                        <div class="col-4">
                                            <span>
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
                                                        tempItems[index].fee = Number(text.target.value) <= maximumFee ? Number(text.target.value) : maximumFee;
                                                        setConsultingFees([...tempItems]);
                                                        setDisabledSaveBtn(false);
                                                    }}
                                                />
                                            </span>
                                        </div>
                                        :
                                        null
                                    }
                                </div>
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
        <div className={"CounselingInfo"} style={{ height: '100%', overflowY: 'scroll' }}>
            <div style={{ paddingTop: 10, flex: 1, flexDirection: "row", display: "flex", position: "sticky", top: 0, zIndex: 999, background: "#F7F8F8" }}>
                <div style={{ flex: 1 }}>
                    <Typography style={{ fontSize: 24, fontFamily: "PingFang TC", fontWeight: "600", color: "#212629" }} gutterBottom>
                        服務管理
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
                    專業認證
                </Typography>
            </div>
            <Grid style={{ fontFamily: "PingFang TC", fontSize: 16, fontWeight: "600", color: "#707070" }} container spacing={3}>
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
                        maxRows={3}
                        minRows={1}
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
                        placeholder="couchspace診所 心理師"
                        value={seniority}
                        onChange={(text) => {
                            if (checkLines(text.target.value, '\n', 5)) {
                                setSeniority(text.target.value)
                            }
                        }}
                        error={errorSeniority !== ""}
                        helperText={errorSeniority}
                        multiline={true}
                        maxRows={5}
                        minRows={1}
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
                        placeholder="心理師"
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
                        {languages?.map((item, index) => {
                            return (
                                <span style={{ marginLeft: 10 }} key={index}>
                                    <Checkbox checked={item.enabled} onClick={() => {
                                        var tempItems = languages;
                                        tempItems[index].enabled = !item.enabled;
                                        setLanguages([...tempItems]);
                                        setDisabledSaveBtn(false);
                                    }}></Checkbox>
                                    <span>{item.label}</span>
                                </span>
                            )
                        })}
                        <FormHelperText error={errorLanguages !== ""}>{errorLanguages}</FormHelperText>
                    </div>
                </Grid>
                {counselorInfo.SubRole !== "HeartCoach" ?
                    <>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="licenseNumber"
                                name="licenseNumber"
                                label="證照號碼"
                                fullWidth
                                autoComplete="family-name"
                                variant="standard"
                                placeholder=""
                                value={licenseNumber}
                                onChange={(text) => setLicenseNumber(text.target.value.trim())}
                                error={errorLicenseNumber !== ""}
                                helperText={errorLicenseNumber}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="licenseIssuing"
                                name="licenseIssuing"
                                label="發證單位"
                                fullWidth
                                autoComplete="family-name"
                                variant="standard"
                                placeholder=""
                                value={licenseIssuing}
                                onChange={(text) => setLicenseIssuing(text.target.value.trim())}
                                error={errorLicenseIssuing !== ""}
                                helperText={errorLicenseIssuing}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="licenseTitle"
                                name="licenseTitle"
                                label="證照名稱"
                                fullWidth
                                autoComplete="family-name"
                                variant="standard"
                                placeholder=""
                                value={licenseTitle}
                                onChange={(text) => setLicenseTitle(text.target.value.trim())}
                                error={errorLicenseTitle !== ""}
                                helperText={errorLicenseTitle}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="institution"
                                name="institution"
                                label="機構名稱"
                                fullWidth
                                variant="standard"
                                value={institution}
                                onChange={(text) => setInstitution(text.target.value)}
                                error={errorInstitution !== ""}
                                helperText={errorInstitution}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="phone"
                                name="phone"
                                label="機構電話"
                                fullWidth
                                variant="standard"
                                value={phone}
                                onChange={(text) => setPhone(text.target.value)}
                                error={errorPhone !== ""}
                                helperText={errorPhone}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="address1"
                                name="address1"
                                label="機構地址"
                                fullWidth
                                autoComplete="shipping address-line1"
                                variant="standard"
                                value={address}
                                onChange={(text) => setAddress(text.target.value)}
                                error={errorAddress !== ""}
                                helperText={errorAddress}
                            />
                        </Grid>
                    </> : <>

                        <Grid item xs={12}>
                            <TextField
                                id="licenseTitle"
                                name="licenseTitle"
                                label="相關證照"
                                fullWidth
                                autoComplete="family-name"
                                variant="standard"
                                placeholder=""
                                value={licenseTitle}
                                onChange={(text) => setLicenseTitle(text.target.value.trim())}
                                error={errorLicenseTitle !== ""}
                                helperText={errorLicenseTitle}
                            />
                        </Grid>
                        {/* 
                            <Grid item xs={12}>
                                <Typography>相關證照</Typography>
                            </Grid>
                            {licenseLists?.map((item, index) => {
                            return (
                                <>
                                    <Grid key={index} item xs={5}>
                                        <TextField
                                            style={{ flex: 10 }}
                                            required
                                            id="licenseList"
                                            name="licenseList"
                                            fullWidth
                                            autoComplete="family-name"
                                            variant="standard"
                                            placeholder=""
                                            value={item.license}
                                            onChange={(text) => item.license = text}
                                            error={errorLicenseTitle !== ""}
                                            helperText={errorLicenseTitle}
                                        ></TextField>

                                    </Grid>
                                    <Grid key={index} item xs={1}>
                                        <Checkbox checked={item.disabled} onClick={() => {
                                            var tempItems = licenseLists;
                                            tempItems[index].disabled = !item.disabled;
                                            setLicenseLists([...tempItems]);
                                            setDisabledSaveBtn(false);
                                        }}>
                                        </Checkbox>
                                    </Grid>
                                    <Grid key={index} item xs={6}></Grid>
                                </>
                            )
                        })}
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                onClick={handleAddLicense}
                                style={{ width: "50%", backgroundColor: "#D9D9D9", borderColor: "transparent", color: "#555654" }}
                            >
                                新增證照
                            </Button>
                        </Grid> */}
                    </>}
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
                                        setDisabledSaveBtn(false);
                                    }
                                }}
                                value={expertises}
                                tokenSeparators={[","]}
                                options={expertiseList}
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
                                showSearch={true}
                                style={{ width: "100%" }}
                            />
                            <FormHelperText error={errorTags !== ""}>{errorTags}</FormHelperText>
                        </div>
                    </div>
                </Grid> */}
                <Grid item xs={12} sm={6}>
                    <div>
                        <span style={{ color: errorConsultingFees === "" ? 'rgba(0, 0, 0, 0.6)' : '#d32f2f' }}>{"服務項目"}</span>
                        <div style={{ fontFamily: "PingFang TC", fontSize: 16, fontWeight: "600", color: "#707070" }}>
                            {consultingFees?.map((item, index) => {
                                return (
                                    <div class="container" style={{ display: "block" }} key={index}>
                                        <div class="row justify-content-start">
                                            <div class="col">
                                                <Checkbox checked={item.enabled} onClick={() => {
                                                    var tempItems = consultingFees;
                                                    tempItems[index].enabled = !item.enabled;
                                                    setConsultingFees([...tempItems]);
                                                    setDisabledSaveBtn(false);
                                                }}></Checkbox>
                                                {item.time > 0 ?
                                                    <span>{item.label + item.time + "分鐘"}</span> :
                                                    <span>{item.label}</span>}

                                                <span style={{ marginLeft: 20 }}>
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
                                                            tempItems[index].fee = Number(text.target.value) <= maximumFee ? Number(text.target.value) : maximumFee;
                                                            setConsultingFees([...tempItems]);
                                                            setDisabledSaveBtn(false);
                                                        }}
                                                    />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
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
}

export default CounselingInfo;
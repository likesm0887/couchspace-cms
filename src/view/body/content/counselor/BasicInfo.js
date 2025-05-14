import "./basicInfo.css";
import { Grid, TextField, FormHelperText, IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useState } from 'react';
import { Counselor, counselorInfo } from '../../../../dataContract/counselor';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { checkEmail, showToast, toastType, calTextLength } from "../../../../common/method";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useEffect } from "react";
import { counselorService } from "../../../../service/ServicePool";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useNavigate } from "react-router-dom";

const BasicInfo = () => {
    let navigate = useNavigate();
    const [disableSaveBtn, setDisabledSaveBtn] = useState(true);
    const cities = ["基隆市", "台北市", "新北市", "桃園縣", "新竹市", "新竹縣", "苗栗縣", "台中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "台南市", "高雄市", "屏東縣", "台東縣", "花蓮縣", "宜蘭縣", "澎湖縣", "金門縣", "連江縣", "海外"];

    const upload = async (event) => {
        if (event.target.files) {
            var binaryData = [];
            binaryData.push(event.target.files[0]);
            setTempPhoto(URL.createObjectURL(new File(binaryData, "newAvatar.png", { type: "image/png" })));
            setIsOpen(true);
        }
    }
    const [isOpen, setIsOpen] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [tempPhoto, setTempPhoto] = useState(null);
    const [bindingPhoto, setBindingPhoto] = useState(counselorInfo.Photo);
    const getCropData = async () => {
        if (cropper) {
            const file = await fetch(cropper.getCroppedCanvas().toDataURL())
                .then((res) => res.blob())
                .then((blob) => {
                    return new File([blob], "newAvatar.png", { type: "image/png" });
                });
            if (file) {
                setPhoto(file);
                setBindingPhoto(URL.createObjectURL(file));
            }
        }
    };
    const [cropper, setCropper] = useState(null);
    // setting columns
    const [firstName, setFirstName] = useState(counselorInfo.UserName.Name.FirstName);
    const [lastName, setLastName] = useState(counselorInfo.UserName.Name.LastName);
    const [selectedCity, setSelectedCity] = useState(counselorInfo.Location);
    const [photo, setPhoto] = useState(counselorInfo.Photo);
    const [email, setEmail] = useState(counselorInfo.Email);
    const [gender, setGender] = useState(counselorInfo.Gender);
    const [shortIntro, setShortIntro] = useState(counselorInfo.ShortIntroduction);
    const [longIntro, setLongIntro] = useState(counselorInfo.LongIntroduction);

    // error message
    const [errorFirstName, setErrorFirstName] = useState("");
    const [errorLastName, setErrorLastName] = useState("");
    const [errorCity, setErrorCity] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorGender, setErrorGender] = useState("");
    const [errorPhoto, setErrorPhoto] = useState("");
    const [errorShortIntro, setErrorShortIntro] = useState("");
    const [errorLongIntro, setErrorLongIntro] = useState("");
    const checkNameLengthIsValid = (firstName, lastName) => {
        let totalLength = calTextLength(firstName) + calTextLength(lastName);
        if (totalLength > 12) {
            return false;
        }
        return true;
    }
    function DropdownCity() {
        return (<DropdownButton id="dropdown-basic-button" size="sm" title={selectedCity.length > 0 ? selectedCity : "請選擇"}>
            {cities.map((city, index) => {
                return (<Dropdown.Item style={{ fontSize: 14 }} key={index} onClick={() => setSelectedCity(city)}>{city}</Dropdown.Item>)
            })}
        </DropdownButton>)
    }
    function ClearAllError() {
        setErrorFirstName("");
        setErrorLastName("");
        setErrorCity("");
        setErrorEmail("");
        setErrorGender("");
        setErrorPhoto("");
        setErrorShortIntro("");
        setErrorLongIntro("");
    }
    const initialBasicInfo = () => {
        counselorService.getCounselorInfo().then((info) => {
            counselorInfo.setCounselorInfo = info;
            setFirstName(counselorInfo.UserName.Name.FirstName);
            setLastName(counselorInfo.UserName.Name.LastName);
            setSelectedCity(counselorInfo.Location);
            setEmail(counselorInfo.Email);
            setGender(counselorInfo.Gender);
            setPhoto(counselorInfo.Photo);
            setBindingPhoto(counselorInfo.Photo);
            setShortIntro(counselorInfo.ShortIntroduction);
            setLongIntro(counselorInfo.LongIntroduction);
        })
    }
    const handleBack = () => {
        navigate("/couchspace-cms/home", { replace: true });
    }
    const handleSave = async () => {
        ClearAllError();
        var output = true;
        if (firstName === "") {
            setErrorFirstName("請輸入名字");
            output = false;
        }
        if (lastName === "") {
            setErrorLastName("請輸入姓氏");
            output = false;
        }
        if (selectedCity === "請選擇縣市") {
            setErrorCity("請選擇居住地區");
            output = false;
        }
        if (email === "" || !checkEmail(email)) {
            setErrorEmail("請輸入有效的電子信箱");
            output = false;
        }
        if (gender === "") {
            setErrorGender("請選擇性別");
            output = false;
        }
        if (photo === "") {
            setErrorPhoto("請上傳照片");
            output = false;
        }
        if (shortIntro.length === 0) {
            setErrorShortIntro("請輸入簡介");
            output = false;
        }
        if (longIntro.length === 0) {
            setErrorLongIntro("請輸入詳細自我介紹");
            output = false;
        }
        if (longIntro.length < 50) {
            setErrorLongIntro("至少50字以上");
            output = false;
        }
        if (checkNameLengthIsValid(firstName, lastName) === false) {
            setErrorFirstName("字數過長，姓名最多中文6個字；英文12個字");
            setErrorLastName("字數過長，姓名最多中文6個字；英文12個字");
            output = false;
        }
        if (output) {
            let info = new Counselor();
            let backupInfo = counselorInfo;
            if (photo !== counselorInfo.Photo) {
                let result = await counselorService.upload(photo);
                info.updatePhoto = result.Photo;
            }
            else {
                info.updatePhoto = counselorInfo.Photo;
            }
            info.UserName.Name.FirstName = firstName;
            info.UserName.Name.LastName = lastName;
            info.Location = selectedCity;
            info.Gender = gender;
            info.ShortIntroduction = shortIntro.trim();
            info.LongIntroduction = longIntro.trim();
            info.Email = email;
            counselorInfo.updatePersonalInfo = info;
            let res = await counselorService.updateCounselorInfo(counselorInfo);
            if (res.success) {
                showToast(toastType.success, "儲存成功");
                setDisabledSaveBtn(true);
            }
            else {
                showToast(toastType.error, "儲存失敗");
                counselorInfo.updatePersonalInfo = backupInfo; // rollback
                setDisabledSaveBtn(false);
            }

        }
        else {
            // showToast(toastType.error, "儲存失敗");
            setOpenError(true);
            setDisabledSaveBtn(false);
        }
    }
    useEffect(() => {
        initialBasicInfo();
    }, [])
    useEffect(() => {
        if (firstName !== counselorInfo.UserName.Name.FirstName ||
            lastName !== counselorInfo.UserName.Name.LastName ||
            selectedCity !== counselorInfo.Location ||
            photo !== counselorInfo.Photo ||
            email !== counselorInfo.Email ||
            gender !== counselorInfo.Gender ||
            shortIntro !== counselorInfo.ShortIntroduction ||
            longIntro !== counselorInfo.LongIntroduction) {
            setDisabledSaveBtn(false);
        }
        else {
            setDisabledSaveBtn(true);
        }
    }, [firstName, lastName, selectedCity, photo, email, gender, shortIntro, longIntro])

    const handleClose = () => {
        setIsOpen(false);
    }
    const handleAccept = () => {
        getCropData();
        setIsOpen(false);
    }
    const createDialog = () => {
        return <Dialog
            open={isOpen}
            fullWidth={true}
            onClose={handleClose}
            value={"sm"}>
            <DialogTitle id="alert-dialog-title">{"裁切圖片"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Cropper
                        src={tempPhoto}
                        style={{ maxHeight: 400, maxWidth: 400, aspectRatio: 1 }}
                        initialAspectRatio={1}
                        cropBoxResizable={false}
                        minCropBoxHeight={200}
                        minCropBoxWidth={200}
                        scalable={false}
                        rotatable={false}
                        guides={false}
                        checkOrientation={false}
                        onInitialized={(instance) => {
                            setCropper(instance);
                        }}
                    />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <button className={"acceptButton"} onClick={handleAccept} color="primary" autoFocus>
                    {"剪裁完成"}
                </button>
            </DialogActions>
        </Dialog>
    }
    const ErrorDialog = () => {
        return <Dialog
            open={openError}
            fullWidth={true}
            onClose={handleCloseError}
            value={"sm"}>
            <DialogTitle style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }} id="alert-dialog-title">{"資料未完成"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <div style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}>
                        <div style={{ marginBottom: 20 }}>
                            <p style={{ color: "#000000", margin: 0 }}>{"您已勾選身份類別，但尚未填寫對應欄位資料，"}</p>
                            <p style={{ color: "#000000", margin: 0 }}>{"請確認資料是否完整。"}</p>
                        </div>
                    </div>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <div className={"button-content"}>
                    <button className={"acceptButton"} onClick={handleCloseError} color="primary">
                        確認
                    </button>
                </div>
            </DialogActions>
        </Dialog>
    }
    const handleCloseError = () => {
        setOpenError(false);
    }
    return (
        <div className={"BasicInfo"} style={{ height: '100%', overflowY: 'scroll' }}>
            <div style={{ paddingTop: 10, flex: 1, flexDirection: "row", display: "flex", position: "sticky", top: 0, zIndex: 999, background: "#F7F8F8" }}>
                <div style={{ flex: 1 }}>
                    <Typography style={{ fontSize: 24, fontFamily: "PingFang TC", fontWeight: "600", color: "#212629" }} gutterBottom>
                        基本資料
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
                    基本資料設定
                </Typography>
            </div>
            <Grid style={{ fontFamily: "PingFang TC", fontSize: 16, fontWeight: "600", color: "#707070" }} container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="lastName"
                        name="lastName"
                        label="姓氏"
                        fullWidth
                        autoComplete="given-name"
                        variant="standard"
                        value={lastName}
                        onChange={(text) => setLastName(text.target.value.trim())}
                        error={errorLastName !== ""}
                        helperText={errorLastName}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="firstName"
                        name="firstName"
                        label="名字"
                        fullWidth
                        autoComplete="family-name"
                        variant="standard"
                        value={firstName}
                        onChange={(text) => setFirstName(text.target.value.trim())}
                        error={errorFirstName !== ""}
                        helperText={errorFirstName}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <div>
                        <span style={{ color: errorCity === "" ? 'rgba(0, 0, 0, 0.6)' : '#d32f2f' }}>{"所在地區 *"}</span>
                        {DropdownCity()}
                        <FormHelperText error={errorCity !== ""}>{errorCity}</FormHelperText>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <div>
                        <span style={{ color: errorGender === "" ? 'rgba(0, 0, 0, 0.6)' : '#d32f2f' }}>{"性別 *"}</span>

                        <div style={{ flex: 1, flexDirection: 'row' }} onChange={(value) => setGender(value.target.value)}>
                            <input style={{ marginRight: 5 }} type="radio" value="男" name="gender" checked={gender === "男"} />
                            <span style={{ marginRight: 10 }}>男</span>
                            <input style={{ marginRight: 5 }} type="radio" value="女" name="gender" checked={gender === "女"} />
                            <span style={{ marginRight: 10 }}>女</span>
                            <input style={{ marginRight: 5 }} type="radio" value="其他" name="gender" checked={gender === "其他"} />
                            <span>其他</span>
                        </div>
                        <FormHelperText error={errorGender !== ""}>{errorGender}</FormHelperText>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="email"
                        name="email"
                        label="e-mail"
                        fullWidth
                        type={"email"}
                        autoComplete="shipping country"
                        variant="standard"
                        value={email}
                        onChange={(text) => setEmail(text.target.value.trim())}
                        error={errorEmail !== ""}
                        helperText={errorEmail}
                    />
                </Grid>
                <Grid item xs={12}>
                    <div>
                        <span style={{ color: errorPhoto === "" ? 'rgba(0, 0, 0, 0.6)' : '#d32f2f' }}>{"上傳您想要顯示的照片 *"}</span>
                        <div>
                            <input accept="image/*" onChange={(e) => upload(e)} id="icon-button-file" type="file" />
                            <label htmlFor="icon-button-file">
                                <IconButton color="primary" aria-label="upload picture" component="span">
                                    <PhotoCamera />
                                </IconButton>
                                <img crossOrigin="anonymous" style={{ height: 200, width: 200, borderRadius: "50%" }} src={bindingPhoto} alt=""></img>
                            </label>
                        </div>
                        <FormHelperText error={errorPhoto !== ""}>{errorPhoto}</FormHelperText>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div>
                        <span style={{ color: errorShortIntro === "" ? 'rgba(0, 0, 0, 0.6)' : '#d32f2f' }}>{"簡介 *"}</span>
                        <div>
                            <textarea
                                style={{ color: 'rgba(0,0,0,0.6)', resize: 'none', width: '100%', height: 100 }}
                                onChange={(text) => setShortIntro(text.target.value)}
                                value={shortIntro}
                                maxLength={30}
                            ></textarea>
                            <div id="the-count">
                                <span id="current">{shortIntro.length}</span>
                                <span id="maximum">/ 30</span>
                            </div>
                        </div>
                        <FormHelperText error={errorShortIntro !== ""}>{errorShortIntro}</FormHelperText>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div style={{ marginBottom: 50 }}>
                        <span style={{ color: errorLongIntro === "" ? 'rgba(0, 0, 0, 0.6)' : '#d32f2f' }}>{"詳細自我介紹 * (50字以上)"}</span>
                        <div>
                            <textarea
                                style={{ color: 'rgba(0,0,0,0.6)', resize: 'none', width: '100%', height: 200 }}
                                onChange={(text) => setLongIntro(text.target.value)}
                                value={longIntro}
                                maxLength={300}
                            ></textarea>
                            <div id="the-count">
                                <span id="current">{longIntro.length}</span>
                                <span id="maximum">/ 300</span>
                            </div>
                        </div>
                        <FormHelperText error={errorLongIntro !== ""}>{errorLongIntro}</FormHelperText>
                    </div>
                </Grid>
            </Grid>
            {createDialog()}
            {ErrorDialog()}
        </div>

    );
}

export default BasicInfo;
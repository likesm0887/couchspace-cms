import { FormHelperText, Grid, IconButton, TextField } from "@mui/material";
import "./PersonalInfo.css";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { forwardRef, useImperativeHandle } from "react";
import { checkEmail, checkPhone } from "../../common/method";
import { Counselor, counselorInfo, genderList } from "../../dataContract/counselor";
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

const PersonalInfo = forwardRef((props, ref) => {
    const classes = useStyles();
    const cities = ["基隆市", "台北市", "新北市", "桃園縣", "新竹市", "新竹縣", "苗栗縣", "台中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "台南市", "高雄市", "屏東縣", "台東縣", "花蓮縣", "宜蘭縣", "澎湖縣", "金門縣", "連江縣", "海外"];

    const upload = (event) => {
        let imageUrl = URL.createObjectURL(event.target.files[0]);
        setPhoto(imageUrl);
    }
    // setting columns
    const [firstName, setFirstName] = useState(counselorInfo.UserName.Name.FirstName);
    const [lastName, setLastName] = useState(counselorInfo.UserName.Name.LastName);
    const [selectedCity, setSelectedCity] = useState(counselorInfo.Location);
    const [address, setAddress] = useState(counselorInfo.Address);
    const [phone, setPhone] = useState(counselorInfo.Phone);
    const [photo, setPhoto] = useState(counselorInfo.Photo);
    const [email, setEmail] = useState(counselorInfo.Email);
    const [gender, setGender] = useState(counselorInfo.Gender);
    const [shortIntro, setShortIntro] = useState(counselorInfo.ShortIntroduction);
    const [longIntro, setLongIntro] = useState(counselorInfo.LongIntroduction);

    // error message
    const [errorFirstName, setErrorFirstName] = useState("");
    const [errorLastName, setErrorLastName] = useState("");
    const [errorCity, setErrorCity] = useState("");
    const [errorAddress, setErrorAddress] = useState("");
    const [errorPhone, setErrorPhone] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorGender, setErrorGender] = useState("");
    const [errorPhoto, setErrorPhoto] = useState("");
    const [errorShortIntro, setErrorShortIntro] = useState("");
    const [errorLongIntro, setErrorLongIntro] = useState("");
    function DropdownCity() {
        return (<DropdownButton id="dropdown-basic-button" size="sm" title={selectedCity}>
            {cities.map((city, index) => {
                return (<Dropdown.Item style={{ fontSize: 14 }} key={index} onClick={() => setSelectedCity(city)}>{city}</Dropdown.Item>)
            })}
        </DropdownButton>)
    }
    function ClearAllError() {
        setErrorFirstName("");
        setErrorLastName("");
        setErrorAddress("");
        setErrorCity("");
        setErrorPhone("");
        setErrorEmail("");
        setErrorGender("");
        setErrorPhoto("");
        setErrorShortIntro("");
        setErrorLongIntro("");
    }
    useImperativeHandle(ref, () => ({
        checkAllInput() {
            ClearAllError();
            var output = true;
            if (firstName === "") {
                setErrorFirstName("請輸入姓氏");
                output = false;
            }
            if (lastName === "") {
                setErrorLastName("請輸入名字");
                output = false;
            }
            if (address === "") {
                setErrorAddress("請輸入居住地址");
                output = false;
            }
            if (selectedCity === "請選擇縣市") {
                setErrorCity("請選擇居住地區");
                output = false;
            }
            if (phone === "") {
                setErrorPhone("請輸入聯絡電話");
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
            // whether output is true or false => update info to counselor model
            let info = new Counselor();
            info.UserName.Name.FirstName = firstName;
            info.UserName.Name.LastName = lastName;
            info.Photo = photo;
            info.CoverImage = photo;
            info.Location = selectedCity;
            info.Address = address;
            info.Gender = gender;
            info.ShortIntroduction = shortIntro;
            info.LongIntroduction = longIntro;
            info.Phone = phone;
            info.Email = email;
            counselorInfo.updatePersonalInfo = info;
            return output;
        }
    }))

    return (
        <div className={"PersonalInfo"}>
            <Typography style={{ marginTop: 10 }} variant="h6" gutterBottom>
                填寫個人資料
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="firstName"
                        name="firstName"
                        label="姓氏"
                        fullWidth
                        autoComplete="given-name"
                        variant="standard"
                        value={firstName}
                        onChange={(text) => setFirstName(text.target.value.trim())}
                        error={errorFirstName !== ""}
                        helperText={errorFirstName}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="lastName"
                        name="lastName"
                        label="名字"
                        fullWidth
                        autoComplete="family-name"
                        variant="standard"
                        value={lastName}
                        onChange={(text) => setLastName(text.target.value.trim())}
                        error={errorLastName !== ""}
                        helperText={errorLastName}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <div>
                        <span style={{ color: errorCity === "" ? 'rgba(0, 0, 0, 0.6)' : '#d32f2f' }}>{"地區 *"}</span>
                        {DropdownCity()}
                        <FormHelperText error={errorCity !== ""}>{errorCity}</FormHelperText>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <div>
                        <span style={{ color: errorGender === "" ? 'rgba(0, 0, 0, 0.6)' : '#d32f2f' }}>{"性別 *"}</span>

                        <div style={{ flex: 1, flexDirection: 'row' }} onChange={(value) => setGender(value.target.value)}>
                            {genderList.map((gender, index) => {
                                return (
                                    <span>
                                        <input style={{ marginRight: 5 }} type="radio" value={gender.key} name="gender" />
                                        <span style={{ marginRight: 10 }}>{gender.value}</span>
                                    </span>
                                )
                            })}
                        </div>
                        <FormHelperText error={errorGender !== ""}>{errorGender}</FormHelperText>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="address1"
                        name="address1"
                        label="居住地址"
                        fullWidth
                        autoComplete="shipping address-line1"
                        variant="standard"
                        value={address}
                        onChange={(text) => setAddress(text.target.value.trim())}
                        error={errorAddress !== ""}
                        helperText={errorAddress}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="phone"
                        name="phone"
                        label="聯絡電話"
                        fullWidth
                        variant="standard"
                        value={phone}
                        onChange={(text) => setPhone(text.target.value.trim())}
                        error={errorPhone !== ""}
                        helperText={errorPhone}
                    />
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
                        <span style={{ color: errorPhoto === "" ? 'rgba(0, 0, 0, 0.6)' : '#d32f2f' }}>{"上傳一張你的照片 *"}</span>
                        <div>
                            <input accept="image/*" onChange={(e) => upload(e)} className={classes.input} id="icon-button-file" type="file" />
                            <label htmlFor="icon-button-file">
                                <IconButton color="primary" aria-label="upload picture" component="span">
                                    <PhotoCamera />
                                </IconButton>
                                <img src={photo} alt=""></img>
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
                                onChange={(text) => setShortIntro(text.target.value.trim())}
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
                                onChange={(text) => setLongIntro(text.target.value.trim())}
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
        </div>

    );

})


export default PersonalInfo;

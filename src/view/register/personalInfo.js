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
    const cities = ["基隆市", "台北市", "新北市", "桃園縣", "新竹市", "新竹縣", "苗栗縣", "台中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "台南市", "高雄市", "屏東縣", "台東縣", "花蓮縣", "宜蘭縣", "澎湖縣", "金門縣", "連江縣"];
    const [image, setImage] = useState("");

    const upload = (event) => {
        let imageUrl = URL.createObjectURL(event.target.files[0]);
        setImage(imageUrl)
    }
    const [firstName, setFirstName] = useState("");
    const [errorFirstName, setErrorFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [errorLastName, setErrorLastName] = useState("");
    const [selectedCity, setSelectedCity] = useState("請選擇縣市");
    const [errorCity, setErrorCity] = useState("");
    const [address, setAddress] = useState("");
    const [errorAddress, setErrorAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [errorPhone, setErrorPhone] = useState("");
    const [email, setEmail] = useState("");
    const [errorEmail, setErrorEmail] = useState("");

    function DropdownCity() {
        return (<DropdownButton id="dropdown-basic-button" size="sm" title={selectedCity}>
            {cities.map((city, index) => {
                return (<Dropdown.Item key={index} onClick={() => setSelectedCity(city)}>{city}</Dropdown.Item>)
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
            if (phone === "" || !checkPhone(phone)) {
                setErrorPhone("請輸入有效的聯絡電話");
                output = false;
            }
            if (email === "" || !checkEmail(email)) {
                setErrorEmail("請輸入有效的電子信箱");
                output = false;
            }
            // if output == true => update info to counselor model
            return output;
        }
    }))

    return (
        <div className={"PersonalInfo"}>
            <Typography variant="h6" gutterBottom>
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
                <Grid item xs={12}>
                    <div>
                        <span style={{ color: errorCity === "" ? 'rgba(0, 0, 0, 0.6)' : '#d32f2f' }}>地區 *</span>
                        {DropdownCity()}
                        <FormHelperText error={errorCity !== ""}>{errorCity}</FormHelperText>
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
                    <p>上傳一張你的照片</p>
                    <input accept="image/*" onChange={(e) => upload(e)} className={classes.input} id="icon-button-file" type="file" />
                    <label htmlFor="icon-button-file">
                        <IconButton color="primary" aria-label="upload picture" component="span">
                            <PhotoCamera />
                        </IconButton>
                        <img src={image} alt=""></img>
                    </label>
                </Grid>
            </Grid>
        </div>

    );

})


export default PersonalInfo;

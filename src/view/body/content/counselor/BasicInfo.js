import "./basicInfo.css";
import { Grid, TextField, FormHelperText, IconButton, Checkbox, DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText } from "@mui/material";
import Typography from "@material-ui/core/Typography";
import { useState, forwardRef, useImperativeHandle } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Counselor, counselorInfo } from '../../../../dataContract/counselor';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { checkEmail } from "../../../../common/method";
import PhotoCamera from '@material-ui/icons/PhotoCamera';
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
const BasicInfo = forwardRef((props, ref) => {
    const classes = useStyles();
    const cities = ["基隆市", "台北市", "新北市", "桃園縣", "新竹市", "新竹縣", "苗栗縣", "台中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "台南市", "高雄市", "屏東縣", "台東縣", "花蓮縣", "宜蘭縣", "澎湖縣", "金門縣", "連江縣", "海外"];

    const upload = (event) => {
        let imageUrl = URL.createObjectURL(event.target.files[0]);
        setPhoto(imageUrl);
    }
    const [disabled, setDisabled] = useState(true);
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
    const initialBasicInfo = () => {
        setFirstName(counselorInfo.UserName.Name.FirstName);
        setLastName(counselorInfo.UserName.Name.LastName);
        setAddress(counselorInfo.Address);
        setSelectedCity(counselorInfo.Location);
        setPhone(counselorInfo.Phone);
        setEmail(counselorInfo.Email);
        setGender(counselorInfo.Gender);
        setPhoto(counselorInfo.Photo);
        setShortIntro(counselorInfo.ShortIntroduction);
        setLongIntro(counselorInfo.LongIntroduction);
    }
    useImperativeHandle(ref, () => ({
        checkAllInput() {
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
    useEffect(() => {
        initialBasicInfo();
    })
    return (
        <div className={"BasicInfo"} style={{ height: '100%', overflowY: 'scroll' }}>
            <Typography style={{ marginTop: 10 }} variant="h6" gutterBottom>
                會員基本資料
            </Typography>
            <div style={{ marginTop: 10, marginBottom: 20, color: 'red' }}>
                <span> *如需變更資料，請聯繫客服 </span>
            </div>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <div>
                        <span>姓氏: </span>
                        <span>{lastName}</span>
                    </div>

                </Grid>
                <Grid item xs={12} sm={6}>
                    <div>
                        <span>名字: </span>
                        <span>{firstName}</span>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <div>
                        <span>地區: </span>
                        <span>{selectedCity}</span>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <div>
                        <span>性別: </span>
                        <span>{gender}</span>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div>
                        <span>居住地址: </span>
                        <span>{address}</span>
                    </div>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <div>
                        <span>聯絡電話: </span>
                        <span>{phone}</span>
                    </div>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <div>
                        <span>e-mail: </span>
                        <span>{email}</span>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div>
                        <p>簡介:</p>
                        <span>{shortIntro}</span>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div>
                        <p>詳細自我介紹:</p>
                        <span>{longIntro}</span>
                    </div>
                </Grid>
            </Grid>
        </div>

    );

})

export default BasicInfo;
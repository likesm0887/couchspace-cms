import {Outlet} from "react-router-dom";
import {Checkbox, FormControlLabel, Grid, IconButton, TextField} from "@mui/material";
import "./PersonalInfo.css"
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import {useState} from "react";

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
function PersonalInfo() {
    const classes = useStyles();
    const [image,setImage] = useState("")
    const upload = (event) => {

       let imageUrl= URL.createObjectURL(event.target.files[0]);
        setImage(imageUrl)
    }

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
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="lastName"
                        name="lastName"
                        label="名子"
                        fullWidth
                        autoComplete="family-name"
                        variant="standard"
                    />
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
                    />
                </Grid>
                <Grid item xs={12}>
                    <p>上傳一張你的照片</p>
                    <input accept="image/*" onChange={(e)=>upload(e)} className={classes.input} id="icon-button-file" type="file" />
                    <label htmlFor="icon-button-file">

                        <IconButton color="primary" aria-label="upload picture" component="span">
                            <PhotoCamera />
                        </IconButton>
                        <img src={image}></img>
                    </label>

                </Grid>
            </Grid>

        </div>

    );

}


export default PersonalInfo;

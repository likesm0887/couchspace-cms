import { Grid, TextField } from "@mui/material";
import "./Consultation.css";
import Typography from "@material-ui/core/Typography";
import { useState } from "react";
import { forwardRef, useImperativeHandle } from "react";
import { Counselor, License, counselorInfo } from "../../dataContract/counselor";

const CertificateInfo = forwardRef((props, ref) => {

    /// info
    const [licenseNumber, setLicenseNumber] = useState(counselorInfo.License.LicenseNumber); // 證照編號
    const [licenseIssuing, setLicenseIssuing] = useState(counselorInfo.License.LicenseIssuing); // 發證單位
    const [licenseTitle, setLicenseTitle] = useState(counselorInfo.License.LicenseTitle);
    const [errorLicenseNumber, setErrorLicenseNumber] = useState("");
    const [errorLicenseIssuing, setErrorLicenseIssuing] = useState("");
    const [errorLicenseTitle, setErrorLicenseTitle] = useState("");
    function ClearAllError() {
        setErrorLicenseNumber("");
        setErrorLicenseIssuing("");
        setErrorLicenseTitle("");
    }
    useImperativeHandle(ref, () => ({
        checkAllInput() {
            ClearAllError();
            var output = true;

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
            // whether output is true or false => update info to counselor model
            let info = new License();
            info.LicenseTitle = licenseTitle;
            info.LicenseNumber = licenseNumber;
            info.LicenseIssuing = licenseIssuing;
            counselorInfo.updateCertificateInfo = info;
            console.log("counselorInfo", counselorInfo);
            return output;
        }
    }))

    return (
        <div className={"ConsultationInfo"}>
            <Typography style={{ marginTop: 10 }} variant="h6" gutterBottom>
                {"相關諮商證照"}
            </Typography>

            <Grid container spacing={3}>
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
            </Grid>
            <div style={{ height: 30 }}></div>
        </div>

    );

})


export default CertificateInfo;

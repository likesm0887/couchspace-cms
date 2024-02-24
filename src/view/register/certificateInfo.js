import { Grid, TextField } from "@mui/material";
import "./Consultation.css";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { forwardRef, useImperativeHandle } from "react";
import { Counselor, License, counselorInfo } from "../../dataContract/counselor";

const CertificateInfo = forwardRef((props, ref) => {

    /// info
    const [licenseNumber, setLicenseNumber] = useState(counselorInfo.License.LicenseNumber); // 證照編號
    const [licenseIssuing, setLicenseIssuing] = useState(counselorInfo.License.LicenseIssuing); // 發證單位
    const [licenseTitle, setLicenseTitle] = useState(counselorInfo.License.LicenseTitle); // 證照名稱
    const [phone, setPhone] = useState(counselorInfo.Phone); // 機構電話
    const [address, setAddress] = useState(counselorInfo.Address); // 機構地址
    const [institution, setInstitution] = useState(counselorInfo.InstitutionTemp); // 機構名稱

    const [errorLicenseNumber, setErrorLicenseNumber] = useState("");
    const [errorLicenseIssuing, setErrorLicenseIssuing] = useState("");
    const [errorLicenseTitle, setErrorLicenseTitle] = useState("");
    const [errorPhone, setErrorPhone] = useState("");
    const [errorAddress, setErrorAddress] = useState("");
    const [errorInstitution, setErrorInstitution] = useState("");
    function ClearAllError() {
        setErrorLicenseNumber("");
        setErrorLicenseIssuing("");
        setErrorLicenseTitle("");
        setErrorAddress("");
        setErrorPhone("");
        setErrorInstitution("");
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
            let info = new Counselor();
            info.License.LicenseTitle = licenseTitle;
            info.License.LicenseNumber = licenseNumber;
            info.License.LicenseIssuing = licenseIssuing;
            info.Phone = phone;
            info.Address = address;
            info.InstitutionTemp = institution;
            counselorInfo.updateCertificateInfo = info.License;
            counselorInfo.updateInstitution = info;
            // console.log("counselorInfo", counselorInfo);
            return output;
        }
    }))

    return (
        <div className={"ConsultationInfo"}>
            <Typography style={{ marginTop: 10, fontSize: 20 }} gutterBottom>
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
            </Grid>
            <div style={{ height: 30 }}></div>
        </div>

    );

})


export default CertificateInfo;

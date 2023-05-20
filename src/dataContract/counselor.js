export class Token {
    constructor() {
        this.AccessToken = "";
        this.RefreshToken = "";
    }
}

export class LoginData {
    constructor() {
        this.user_id = "";
        this.token = new Token();
    }
}

export class Register {
    constructor() {
        this.email = "";
        this.password = "";
    }
}

export class ForgetPassword {
    constructor() {
        this.email = "";
        this.redirect = "";
    }
}

export class ResetPassword {
    constructor() {
        this.email = "";
        this.token = "";
        this.newPassword = "";
    }
}

export class Name {
    constructor() {
        this.FirstName = "";
        this.LastName = "";
    }
}

export class UserName {
    constructor() {
        this.NickName = "";
        this.Name = new Name();
    }
}

export class ConsultingFee {
    constructor() {
        this.Type = 0;
        this.Time = 0;
        this.Fee = 0;
    }
}
export class Expertise {
    constructor() {
        this.Skill = "";
        this.MoreAbout = []; // detailed description
    }
}
export class Counselor {
    constructor() {
        this.ID = "";
        this.UserName = new UserName();
        this.Photo = "";
        this.CoverImage = "";
        this.Seniority = 0;
        this.Educational = "";
        this.Position = "Clinical Psychologist";
        this.ShortIntroduction = "嗨，親愛的你 是不是有睡不著的問題? \n 我們都希望每天都有個好覺";
        this.LongIntroduction = "";
        this.Location = "台北市內湖區成功路四段";
        this.LicenseNumber = "諮心字第004493號";
        this.LicenseIssuing = "";
        this.Accumulative = 100;
        this.ExpertisesInfo = "";
        this.ConsultingFees = [];
        this.Gender = "";
        this.Tags = [];
        this.InstitutionID = "";
        this.AppointmentTimeID = "";
    }


    set setCounselorInfo(info: Counselor) {
        this.ID = info.ID;
        this.UserName = info.UserName;
        this.Photo = info.Photo;
        this.CoverImage = info.CoverImage;
        this.Seniority = info.Seniority
        this.Educational = info.Educational;
        this.Position = info.Position;
        this.ShortIntroduction = info.ShortIntroduction;
        this.LongIntroduction = info.LongIntroduction;
        this.Location = info.Location;
        this.LicenseNumber = info.LicenseNumber;
        this.LicenseIssuing = info.LicenseIssuing;
        this.Accumulative = info.Accumulative;
        this.ExpertisesInfo = info.ExpertisesInfo;
        this.ConsultingFees = info.ConsultingFees;
        this.Gender = info.Gender;
        this.Tags = info.Tags;
        this.InstitutionID = info.InstitutionID;
        this.AppointmentTimeID = info.AppointmentTimeID;
    }
}

export let counselorInfo = new Counselor();


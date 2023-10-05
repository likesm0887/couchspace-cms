export const WeekType = Object.freeze({ "NONE": "NULL", "Monday": "Monday", "Tuesday": "Tuesday", "Wednesday": "Wednesday", "Thursday": "Thursday", "Friday": "Friday", "Saturday": "Saturday", "Sunday": "Sunday" })
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
export class ConsultingType {
    constructor() {
        this.Label = "";
        this.Value = "";
    }
}

export class ConsultingFee {
    constructor() {
        this.Type = new ConsultingType();
        this.Time = 0;
        this.Fee = 0;
    }
}
export class Expertise {
    constructor() {
        this.Skill = "";
    }
}
export class BusinessTime {
    constructor() {
        this.WeekOfDay = WeekType.NONE;
        this.Periods = [];
    }
}

export class Period {
    constructor() {
        this.StartTime = "0:00";
        this.EndTime = "0:00";
    }
}

export class OverrideTime {
    constructor() {
        this.Unavailable = true;
        this.DayTime = new Date().toLocaleDateString('zh-CN');
        this.Periods = [];
    }
}
export class AppointmentTime {
    constructor() {
        this.ID = "";
        this.BusinessTimes = [];
        this.OverrideTimes = [];
    }
}
export class License {
    constructor() {
        this.LicenseNumber = ""; // 諮商編號
        this.LicenseIssuing = "";  // 發證單位
        this.LicenseTitle = "";
    }
}
export class Counselor {
    constructor() {
        this.ID = "";
        // personal info
        this.UserName = new UserName(); // 姓名
        this.Photo = ""; // 大頭照
        this.CoverImage = ""; // 大頭照
        this.Location = "台北市"; // 地區

        this.Address = ""; // 地址
        this.Gender = ""; // 性別
        this.ShortIntroduction = ""; // 簡介
        this.LongIntroduction = ""; // 詳細自我介紹
        this.Phone = "";
        this.Email = "";

        // counselor info
        this.Languages = [] // 語言 英文 中文
        this.Seniority = ""; // 經歷
        this.Educational = ""; // 學歷
        this.Position = ""; // 職稱
        this.Accumulative = 0;
        this.ExpertisesInfo = ""; // 專長
        this.Expertises = []; // 專項
        this.ConsultingFees = []; // 諮商項目

        // certificate info
        this.License = new License();

        // others
        this.Tags = [];
        this.InstitutionID = "";
        this.AppointmentTimeID = "";

        // business times
        this.BusinessTimes = [];

        // override times
        this.OverrideTimes = [];
    }


    set setCounselorInfo(info: Counselor) {
        this.ID = info.ID;

        // personal info
        this.UserName = info.UserName;
        this.Photo = info.Photo;
        this.CoverImage = info.CoverImage;
        this.Location = info.Location;

        this.Address = info.Address;
        this.Gender = info.Gender;
        this.ShortIntroduction = info.ShortIntroduction;
        this.LongIntroduction = info.LongIntroduction;
        this.Phone = info.Phone;
        this.Email = info.Email;

        // counselor info
        this.Languages = info.Languages;
        this.Seniority = info.Seniority;
        this.Educational = info.Educational;
        this.Position = info.Position;
        this.Accumulative = info.Accumulative;
        this.ExpertisesInfo = info.ExpertisesInfo;
        this.Expertises = info.Expertises;
        this.ConsultingFees = info.ConsultingFees;

        // certificate info
        this.License = info.License;

        // others
        this.Tags = info.Tags;
        this.InstitutionID = info.InstitutionID;
        this.AppointmentTimeID = info.AppointmentTimeID;
    }

    set updatePersonalInfo(info: Counselor) {
        this.UserName = info.UserName;
        this.Photo = info.Photo;
        this.CoverImage = info.CoverImage;
        this.Location = info.Location;
        this.Address = info.Address;
        this.Gender = info.Gender;
        this.ShortIntroduction = info.ShortIntroduction;
        this.LongIntroduction = info.LongIntroduction;
        this.Phone = info.Phone;
        this.Email = info.Email;
    }
    set updateCounselorInfo(info: Counselor) {
        this.Languages = info.Languages;
        this.Seniority = info.Seniority;
        this.Educational = info.Educational;
        this.Position = info.Position;
        this.Accumulative = info.Accumulative;
        // this.LicenseNumber = info.LicenseNumber;
        // this.LicenseIssuing = info.LicenseIssuing;
        this.Expertises = info.Expertises;
        this.ExpertisesInfo = info.ExpertisesInfo;
        this.ConsultingFees = info.ConsultingFees;
    }
    set updateCertificateInfo(info: License) {
        this.License = info;
    }
    set updateBusinessTimes(businessTimes: BusinessTime[]) {
        if (businessTimes == null) return;
        this.BusinessTimes = [];
        for (let i = 0; i < businessTimes.length; i++) {
            this.BusinessTimes.push(businessTimes[i]);
        }

    }
    set updateOverrideTimes(overrideTimes: OverrideTime[]) {
        if (overrideTimes == null) return;
        this.OverrideTimes = [];
        for (let i = 0; i < overrideTimes.length; i++) {
            this.OverrideTimes.push(overrideTimes[i]);
        }
    }
    set clearAll(info: Counselor) {
        this.ID = "";
        // personal info
        this.UserName = new UserName(); // 姓名
        this.Photo = ""; // 大頭照
        this.CoverImage = ""; // 大頭照
        this.Location = "台北市"; // 地區

        this.Address = ""; // 地址
        this.Gender = ""; // 性別
        this.ShortIntroduction = ""; // 簡介
        this.LongIntroduction = ""; // 詳細自我介紹
        this.Phone = "";
        this.Email = "";

        // counselor info
        this.Languages = [] // 語言 英文 中文
        this.Seniority = ""; // 經歷
        this.Educational = ""; // 學歷
        this.Position = ""; // 職稱
        this.Accumulative = 0;
        this.ExpertisesInfo = ""; // 專長
        this.Expertises = []; // 專項
        this.ConsultingFees = []; // 諮商項目

        // certificate info
        this.License = new License();

        // others
        this.Tags = [];
        this.InstitutionID = "";
        this.AppointmentTimeID = "";

        // business times
        this.BusinessTimes = [];

        // override times
        this.OverrideTimes = [];
    }
    set updatePhoto(imageUrl) {
        this.Photo = imageUrl;
        this.CoverImage = imageUrl;
    }
}

export let counselorInfo = new Counselor();
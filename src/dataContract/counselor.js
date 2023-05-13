export class Token {
    AccessToken = "";
    RefreshToken = "";
}

export class LoginData {
    user_id = "";
    token = new Token();
}

export class Register {
    email = "";
    password = "";
}

export class ForgetPassword {
    email = "";
    redirect = "";
}

export class ResetPassword {
    email = "";
    token = "";
    newPassword = "";
}

export class Name {
    FirstName = "";
    LastName = "";
}

export class UserName {
    NickName = "";
    Name = new Name();
}

export class ConsultingFee {
    Type = 0;
    Time = 0;
    Fee = 0;
}
export class Expertise {
    Skill = "";
    MoreAbout = []; // detailed description
}
export class Counselor {
    UserName = new UserName();
    Photo = "";
    CoverImage = "";
    Seniority = 0;
    Position = "Clinical Psychologist";
    Introduction = "嗨，親愛的你 是不是有睡不著的問題? \n 我們都希望每天都有個好覺";
    Location = "台北市內湖區成功路四段";
    LicenseNumber = "諮心字第004493號";
    Accumulative = 100;
    ConsultingFees = [];
    Tags = [];
    Expertises = [];
    InstitutionID = "";
}

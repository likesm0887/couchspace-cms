export class ReservedTime {
    Date = "2022-05-06 12:50:45";
    StartTime = "09:00";
    EndTime = "15:00";
    Total = 360;
}

export class TimeUpdateRecord {
    Time = new ReservedTime();
    TimeStamp = "2023-05-13 11:16:22";
}

export class Appointment {
    AppointmentID = "e0721569-9fbe-4e68-a3c6-103d6460c152";
    UserID = "152ce7a6-f313-4829-a564-6b0fb0aa9a4f";
    UserName = "卡斯柏";
    CounselorID = "67f2ece9-4d05-4885-8aae-0d99989a5a82";
    CounselorName = "陳郁欣";
    Time = new ReservedTime();
    Fee = 2000;
    Service = 0;
    ProblemStatement = "失戀";
    SpecialRequirement = "需要背景音樂";
    TimeUpdateRecord = [];
    Status = "ROOMCREATED";
    RoomID = "e67a7980-749b-4b6b-8665-6d91ff29fa54";

}

import {RegisterService} from "./RegisterService";
import {AppointmentService} from "./AppointmentService";
import {CounselorService} from "./CounselorService";
import {MeditationService} from "./MeditationService";
const service = new RegisterService("http://localhost:9000");

export const appointmentService = new AppointmentService("http://localhost:9000");

export const counselorService = new CounselorService("http://localhost:9000");

export const meditationService = new MeditationService("http://localhost:9000");

export const boot = () => {
    service.login("ace@gmail.com","test123");
}




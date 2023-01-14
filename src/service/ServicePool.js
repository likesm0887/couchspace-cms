
import {RegisterService} from "./RegisterService";
import {AppointmentService} from "./AppointmentService";
import {CounselorService} from "./CounselorService";
import {MeditationService} from "./MeditationService";


//const baseUrl = "http://localhost:9000"
 const baseUrl = "https://couchspace-test.azurewebsites.net"
const service = new RegisterService(baseUrl);

export const appointmentService = new AppointmentService(baseUrl);

export const counselorService = new CounselorService(baseUrl);

export const meditationService = new MeditationService(baseUrl);

export const boot = () => {
    service.login("ace@gmail.com","test123");
}





import {RegisterService} from "./RegisterService";
import {AppointmentService} from "./AppointmentService";
import {CounselorService} from "./CounselorService";
import {MeditationService} from "./MeditationService";
import {MemberService} from "./MemberService";
import cookie from 'react-cookies'
import {createStore} from "redux"
import {Provider} from "react-redux"
import { ConsoleSqlOutlined } from "@ant-design/icons";
import reducers from "./redux/reducers/reducers.js";
import store from "./redux/store/store.js"
//let baseUrl =  cookie.load("url")?"https://couchspace-test.azurewebsites.net":cookie.load("url");
 const baseUrl = "https://couchspace-prod.azurewebsites.net"
 //const baseUrl = "https://couchspace-test.azurewebsites.net"
 //const baseUrl = "https://couchspace-test.azurewebsites.net"
 //const baseUrl = "http://localhost:9000"
 store.subscribe((state)=>{
    console.log(store.getState())
    //baseUrl=store.getState()
 })

const service = new RegisterService(baseUrl);

export const appointmentService = new AppointmentService(baseUrl);

export const counselorService = new CounselorService(baseUrl);

export const meditationService = new MeditationService(baseUrl);

export const memberService = new MemberService(baseUrl);

export const boot = () => {
    service.login("admin@gmail.com","admin");
}




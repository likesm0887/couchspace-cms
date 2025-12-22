import { boot } from "./service/ServicePool";
import {
  BrowserRouter,
  Outlet,
  HashRouter,
  Route,
  Routes,
} from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Login from "./view/login/login";
import Login2 from "./view/body/admin/Login";
import Home from "./view/home/Home";
import Meditation from "./view/body/content/Meditation";
import Repair from "./view/body/content/Repairing";
import BasicInfo from "./view/body/content/counselor/BasicInfo";
import CounselingInfo from "./view/body/content/counselor/CounselingInfo";
import CounselingManagement from "./view/body/content/counselor/CounselingManagement";
import Music from "./view/body/admin/Music";
import Admin from "./view/body/admin/Admin";
import Consultation from "./view/body/content/counsulation/Consultation";
import AppointmentDetail from "./view/body/content/counsulation/AppointmentDetail";
import { Register } from "./view/register/register";
import Counseling from "./view/body/content/counsulation/Counseling";
import Course from "./view/body/admin/Course.js";
import Category from "./view/body/admin/Category";
import Teacher from "./view/body/admin/Teacher";
import Setting from "./view/body/admin/Setting";
import User from "./view/body/admin/User";
import Membership from "./view/body/admin/Membership";
import Counselor from "./view/body/admin/Counselor";
import Banner from "./view/body/admin/Banner";
import CounselorBanner from "./view/body/admin/CounselorBanner";
import Appointments from "./view/body/admin/Appointments";
import PromoCode from "./view/body/admin/Promo_code";
import Reports from "./view/body/admin/Reports";
import DeepLinkRedirector from "./view/deeplink/DeepLinkRedirector.js";
import ProtectedRoute from "./utility/ProtectedRoute.js";
function App() {
  // registerServiceWorker()
  // Notification()
  boot();
  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />}></Route>
        <Route element={<ProtectedRoute redirectPath={"/login"} isAdmin={true} />}>
          <Route path="admin" element={<Admin />}>
            <Route path="course" element={<Course />}></Route>
            <Route path="banner" element={<Banner />}></Route>
            <Route path="music" element={<Music />}></Route>
            <Route path="category" element={<Category />}></Route>
            <Route path="teacher" element={<Teacher />}></Route>
            <Route path="user" element={<User />}></Route>
            <Route path="setting" element={<Setting />}></Route>
            <Route path="membership" element={<Membership />}></Route>
            <Route path="counselor" element={<Counselor />}></Route>
            <Route path="counselorBanner" element={<CounselorBanner />}></Route>
            <Route path="appointments" element={<Appointments />}></Route>
            <Route path="promocode" element={<PromoCode />}></Route>
            <Route path="reports" element={<Reports />}></Route>
          </Route>
        </Route>
        <Route path="couchspace-cms/register" element={<Register />} />

        <Route path="couchspace-cms/" element={<Login />} />
        <Route element={<ProtectedRoute redirectPath={"/couchspace-cms"} isAdmin={false} />}>
          <Route path="couchspace-cms/home/consultation/counseling/:id" element={<Counseling />} />
          <Route path="couchspace-cms/home" element={<Home />}>
            <Route>
              <Route index element={<Consultation />} />
              <Route>
                <Route path="consultation" element={<Consultation />} />
                <Route>
                  <Route
                    path="consultation/:id"
                    element={<AppointmentDetail />}
                  />
                </Route>
              </Route>
              <Route path="meditation" element={<Meditation />} />
              <Route path="repair" element={<Repair />} />
              <Route path="basicInfo" element={<BasicInfo />} />
              <Route path="counselingInfo" element={<CounselingInfo />} />
              <Route
                path="counselingManagement"
                element={<CounselingManagement />}
              />
            </Route>
          </Route>
        </Route>
        <Route
          path="/deeplink/player/:deeplinkUrl"
          element={
            <DeepLinkRedirector />
          }
        />
      </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

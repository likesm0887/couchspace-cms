import { boot } from "./service/ServicePool";
import React, { Suspense } from "react";
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
import DeepLinkRedirector from "./view/deeplink/DeepLinkRedirector.js";
import ProtectedRoute from "./utility/ProtectedRoute.js";

// Lazy imports
const Music = React.lazy(() => import("./view/body/admin/Music"));
const Admin = React.lazy(() => import("./view/body/admin/Admin"));
const Consultation = React.lazy(() => import("./view/body/content/counsulation/Consultation"));
const AppointmentDetail = React.lazy(() => import("./view/body/content/counsulation/AppointmentDetail"));
const Counseling = React.lazy(() => import("./view/body/content/counsulation/Counseling"));
const Course = React.lazy(() => import("./view/body/admin/Course.js"));
const Category = React.lazy(() => import("./view/body/admin/Category"));
const Teacher = React.lazy(() => import("./view/body/admin/Teacher"));
const Setting = React.lazy(() => import("./view/body/admin/Setting"));
const User = React.lazy(() => import("./view/body/admin/User"));
const Membership = React.lazy(() => import("./view/body/admin/Membership"));
const Counselor = React.lazy(() => import("./view/body/admin/Counselor"));
const Banner = React.lazy(() => import("./view/body/admin/Banner"));
const CounselorBanner = React.lazy(() => import("./view/body/admin/CounselorBanner"));
const Appointments = React.lazy(() => import("./view/body/admin/Appointments"));
const PromoCode = React.lazy(() => import("./view/body/admin/Promo_code"));
const Reports = React.lazy(() => import("./view/body/admin/Reports"));
const Register = React.lazy(() => import("./view/register/register"));
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
          <Route path="admin" element={<Suspense fallback={<div>Loading Admin...</div>}><Admin /></Suspense>}>
            <Route path="course" element={<Suspense fallback={<div>Loading...</div>}><Course /></Suspense>}></Route>
            <Route path="banner" element={<Suspense fallback={<div>Loading...</div>}><Banner /></Suspense>}></Route>
            <Route path="music" element={<Suspense fallback={<div>Loading...</div>}><Music /></Suspense>}></Route>
            <Route path="category" element={<Suspense fallback={<div>Loading...</div>}><Category /></Suspense>}></Route>
            <Route path="teacher" element={<Suspense fallback={<div>Loading...</div>}><Teacher /></Suspense>}></Route>
            <Route path="user" element={<Suspense fallback={<div>Loading...</div>}><User /></Suspense>}></Route>
            <Route path="setting" element={<Suspense fallback={<div>Loading...</div>}><Setting /></Suspense>}></Route>
            <Route path="membership" element={<Suspense fallback={<div>Loading...</div>}><Membership /></Suspense>}></Route>
            <Route path="counselor" element={<Suspense fallback={<div>Loading...</div>}><Counselor /></Suspense>}></Route>
            <Route path="counselorBanner" element={<Suspense fallback={<div>Loading...</div>}><CounselorBanner /></Suspense>}></Route>
            <Route path="appointments" element={<Suspense fallback={<div>Loading...</div>}><Appointments /></Suspense>}></Route>
            <Route path="promocode" element={<Suspense fallback={<div>Loading...</div>}><PromoCode /></Suspense>}></Route>
            <Route path="reports" element={<Suspense fallback={<div>Loading...</div>}><Reports /></Suspense>}></Route>
          </Route>
        </Route>
        <Route path="couchspace-cms/register" element={<Suspense fallback={<div>Loading...</div>}><Register /></Suspense>} />

        <Route path="couchspace-cms/" element={<Login />} />
        <Route element={<ProtectedRoute redirectPath={"/couchspace-cms"} isAdmin={false} />}>
          <Route path="couchspace-cms/home/consultation/counseling/:id" element={<Suspense fallback={<div>Loading...</div>}><Counseling /></Suspense>} />
          <Route path="couchspace-cms/home" element={<Home />}>
            <Route>
              <Route index element={<Suspense fallback={<div>Loading...</div>}><Consultation /></Suspense>} />
              <Route>
                <Route path="consultation" element={<Suspense fallback={<div>Loading...</div>}><Consultation /></Suspense>} />
                <Route>
                  <Route
                    path="consultation/:id"
                    element={<Suspense fallback={<div>Loading...</div>}><AppointmentDetail /></Suspense>}
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

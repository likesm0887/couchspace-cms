import { createBrowserRouter } from 'react-router-dom';
import Login from './view/body/admin/Login';
import Admin from './view/body/admin/Admin';
import { ProtectedRoute } from './routes/ProtectedRoute.tsx';

// Import other existing components
import Home from './view/home/Home';
import Meditation from './view/body/content/Meditation';
import Repair from './view/body/content/Repairing';
import BasicInfo from './view/body/content/counselor/BasicInfo';
import CounselingInfo from './view/body/content/counselor/CounselingInfo';
import CounselingManagement from './view/body/content/counselor/CounselingManagement';
import Music from './view/body/admin/Music';
import Consultation from './view/body/content/counsulation/Consultation';
import AppointmentDetail from './view/body/content/counsulation/AppointmentDetail';
import { Register } from './view/register/register';
import Counseling from './view/body/content/counsulation/Counseling';
import Course from './view/body/admin/Course.js';
import Category from './view/body/admin/Category';
import Teacher from './view/body/admin/Teacher';
import Setting from './view/body/admin/Setting';
import User from './view/body/admin/User';
import Membership from './view/body/admin/Membership';
import Counselor from './view/body/admin/Counselor';
import Banner from './view/body/admin/Banner';
import CounselorBanner from './view/body/admin/CounselorBanner';
import Appointments from './view/body/admin/Appointments';
import PromoCode from './view/body/admin/Promo_code';
import DeepLinkRedirector from './view/deeplink/DeepLinkRedirector.js';
import UserLogin from './view/login/login';

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "course",
        element: <Course />
      },
      {
        path: "banner",
        element: <Banner />
      },
      {
        path: "music",
        element: <Music />
      },
      {
        path: "category",
        element: <Category />
      },
      {
        path: "teacher",
        element: <Teacher />
      },
      {
        path: "user",
        element: <User />
      },
      {
        path: "setting",
        element: <Setting />
      },
      {
        path: "membership",
        element: <Membership />
      },
      {
        path: "counselor",
        element: <Counselor />
      },
      {
        path: "counselorBanner",
        element: <CounselorBanner />
      },
      {
        path: "appointments",
        element: <Appointments />
      },
      {
        path: "promocode",
        element: <PromoCode />
      }
    ]
  },
  {
    path: "couchspace-cms/register",
    element: <Register />
  },
  {
    path: "couchspace-cms/",
    element: <UserLogin />
  },
  {
    path: "couchspace-cms/home/consultation/counseling/:id",
    element: <Counseling />
  },
  {
    path: "couchspace-cms/home",
    element: <Home />,
    children: [
      {
        index: true,
        element: <Consultation />
      },
      {
        path: "consultation",
        element: <Consultation />
      },
      {
        path: "consultation/:id",
        element: <AppointmentDetail />
      },
      {
        path: "meditation",
        element: <Meditation />
      },
      {
        path: "repair",
        element: <Repair />
      },
      {
        path: "basicInfo",
        element: <BasicInfo />
      },
      {
        path: "counselingInfo",
        element: <CounselingInfo />
      },
      {
        path: "counselingManagement",
        element: <CounselingManagement />
      }
    ]
  },
  {
    path: "/deeplink/player/:deeplinkUrl",
    element: <DeepLinkRedirector />
  }
]);
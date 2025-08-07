import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {MainLayout} from "../src/Layout/MainLayout";
import {Home} from "./Pages/Home";
import BorrowPage from "./Pages/BorrowPage";
import LendPage from "./Pages/LendPage";
import StudyMaterialsPage from "./Pages/StudyMaterialsPage";
import ClassSchedulesPage from "./Pages/ClassSchedulesPage";
import CollageEventsPage from "./Pages/CollageEventsPage";
import ContactUsPage from "./Pages/ContactUsPage";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import AuthProvider from "./context/AuthContext";
import MyOrdersPage from "./Pages/MyOrdersPage";
import ProfilePage from "./Pages/ProfilePage";
import Dashboard from "./components/Admin/Dashboard";
import SellerDashboardPage from "./Pages/SellerDashboardPage";
import './App.css';
import VerifyEmail from "./components/Auth/VerifyEmail";
import ResendVerification from "./components/Auth/ResendVerification";

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: '/home',
          element: <Home />,
        },
        {
          path: '/borrow',
          element: <ProtectedRoute><BorrowPage /></ProtectedRoute>,
        },
        {
          path: '/lend',
          element: <ProtectedRoute><LendPage /></ProtectedRoute>,
        },
        {
          path: '/studymaterials',
          element: <StudyMaterialsPage />,
        },
        {
          path: '/classschedule',
          element: <ClassSchedulesPage />,
        },
        {
          path: '/collegeevents',
          element: <CollageEventsPage />,
        },
        {
          path: '/contactus',
          element: <ContactUsPage />,
        },
        {
          path: '/login',
          element: <Login />,
        },
        {
          path: '/signup',
          element: <Signup />,
        },
        {
          path: '/verify-email',
          element: <VerifyEmail />,
        },
        {
          path: '/resend-verification',
          element: <ResendVerification />,
        },
        {
          path: '/my-orders',
          element: <ProtectedRoute><MyOrdersPage /></ProtectedRoute>,
        },
        {
          path: '/profile',
          element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
        },
        {
          path: '/admin',
          element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
        },
        {
          path: '/seller-dashboard',
          element: <ProtectedRoute><SellerDashboardPage /></ProtectedRoute>,
        }
      ]
    }
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
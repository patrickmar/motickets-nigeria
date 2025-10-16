import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Details from "./pages/details";
import PublicRoute from "./components/PublicRoute";
import "./App.css";
import Checkout from "./pages/checkout";
import Success from "./pages/success";
import Search from "./pages/search";
import AllEvents from "./pages/all";
import Organisers from "./pages/organisers";
import Terms from "./pages/terms";
import Faq from "./pages/faq";
import Profile from "./pages/profile";
import Philosophy from "./pages/philosophy";
import Login from "./pages/auth/login";
import ContactUs from "./pages/contactus";
import CreateEventForm from "./pages/create";
import { Toaster } from "react-hot-toast";
import Register from "./pages/auth/register";
import HostLayer from "./components/HostLayout";
import Dashboard from "./pages/dashboard";
import UserProfile from "./pages/auth/User/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ProfileChange from "./pages/auth/User/UserProfile/ProfileChange";
import ForgotPassword from "./pages/auth/User/UserProfile/ForgotPassword";
import EditEventForm from "./pages/dashboard/EditEventForm";
import AvatarUploadForm from "./pages/auth/User/UserProfile/AvatarUploadForm";
import ResetPassword from "./pages/auth/User/UserProfile/ResetPassword";
import FinancialTable from "./pages/dashboard/Financial";
import Blog from "./pages/blog";
import BlogDetailsPage from "./components/BlogDetailsPage";
import { HelmetProvider } from "react-helmet-async";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ✅ Create a query client instance
const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        <BrowserRouter>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route index path="/" element={<Home />} />
              <Route path="/details/:id" element={<Details />} />
              <Route path="/search/:query" element={<Search />} />
              <Route path="/events" element={<AllEvents />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/organisers" element={<Organisers />} />
              <Route path="/faq" element={<Terms />} />
              <Route path="/terms" element={<Faq />} />
              <Route path="/corporate-profile" element={<Profile />} />
              <Route path="/corporate-philosophy" element={<Philosophy />} />
              <Route path="/success" element={<Success />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetailsPage />} />

              <Route
                path="/create-event"
                element={
                  <ProtectedRoute>
                    <CreateEventForm />
                  </ProtectedRoute>
                }
              />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route
                path="/dashboard/avatar_upload"
                element={
                  <ProtectedRoute>
                    <AvatarUploadForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route path="/host" element={<HostLayer />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile_change"
                element={
                  <ProtectedRoute>
                    <ProfileChange />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/update-event/:sn"
                element={
                  <ProtectedRoute>
                    <EditEventForm />
                  </ProtectedRoute>
                }
              />
              <Route path="/password/forgot" element={<ForgotPassword />} />
              <Route
                path="/password/reset/:token"
                element={<ResetPassword />}
              />
            </Route>
          </Routes>
          <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;

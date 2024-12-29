import Authentication from "./Components/Authentication";
import Feed from "./Components/homecomponents/Feed";
import NewPost from "./Components/postsComponents/NewPost";
import Profile from "./Components/userProfileComponents/Profile";
import EditProfile from "./Components/userProfileComponents/EditProfile";
import ForgotPassword from "./Components/FogotPassword";
import { Route, Routes } from "react-router-dom";
import { UserProvider } from "./Components/UserContext";
import SharedPost from "./Components/sharedComponents/SharedPost";
import SharedProfile from "./Components/sharedComponents/SharedProfile";
import PrivacyPolicy from "./Components/OAuth Consent Screen Components/PrivacyPolicy";
import TermsOfUse from "./Components/OAuth Consent Screen Components/TermsOfUse";
import AboutUs from "./Components/OAuth Consent Screen Components/AboutUs";

import "./App.css";
import { useEffect } from "react";
function App() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("appinstalled", () => {
        console.log("installed");
      });
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log(
              "Service Worker registered with scope:",
              registration.scope
            );

            registration.addEventListener("updatefound", () => {
              const newWorker = registration.installing;
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed") {
                  if (navigator.serviceWorker.controller) {
                    console.log("New content is available, please refresh");
                  } else {
                    console.log("Content is cached for offline use");
                  }
                }
              });
            });
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error.message);
          });
      });

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("New Service Worker activated");
      });
    } else {
      console.log("Service Workers are not supported in this browser");
    }
  }, []);

  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Authentication />} />
        <Route path="/signup" element={<Authentication />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/newpost" element={<NewPost />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/post/:postID" element={<SharedPost />} />
        <Route path="/profile/:userID" element={<SharedProfile />} />
        <Route path="/termsofuse" element={<TermsOfUse />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/aboutus" element={<AboutUs />} />
      </Routes>
    </UserProvider>
  );
}

export default App;

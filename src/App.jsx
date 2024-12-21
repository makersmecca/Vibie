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

import "./App.css";
function App() {
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
      </Routes>
    </UserProvider>
  );
}

export default App;

import Authentication from "./Components/Authentication";
import Feed from "./Components/homecomponents/feed";
import NewPost from "./Components/homecomponents/NewPost";
import Profile from "./Components/userProfileComponents/Profile";
import EditProfile from "./Components/userProfileComponents/EditProfile";
import { Route, Routes } from "react-router-dom";
import "./App.css";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Authentication />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/newpost" element={<NewPost />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/editprofile" element={<EditProfile />} />
    </Routes>
  );
}

export default App;

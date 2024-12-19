import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { auth, db } from "../../auth/firebaseAuth";
import { doc, getDoc } from "firebase/firestore";
import { UserContext } from "../UserContext";
import MyPosts from "./MyPosts";
import person from "/profile.png";
import { Client, Storage } from "appwrite";
// import Navbar from "../Navbar";
// import bg9 from "/bgImg/bg9.jpeg";
const Profile = () => {
  getAuth();
  const { currentUser } = useContext(UserContext);
  const Navigate = useNavigate();
  const [popUp, setPopUp] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const [bannerImgUrl, setBannerImgUrl] = useState("");

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(`${import.meta.env.VITE_APPWRITE_PROJECT_ID}`);

  const storage = new Storage(client);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser?.email) {
          const userDocRef = doc(db, "users", currentUser.email);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUsername(
              userData.username === ""
                ? currentUser.displayName
                : userData.username
            );
            setBio(userData.bio);
            setProfileImgUrl(
              userData.profileImgUrl === "" ? person : userData.profileImgUrl
            );
            setBannerImgUrl(userData.bannerImgUrl);
          } else {
            console.log("No such document!");
            setUsername(currentUser.displayName);
            setBio("");
            setProfileImgUrl(person);
            setBannerImgUrl("");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handlePopup = () => {
    setPopUp((prev) => !prev);
  };

  const handleLogOut = () => {
    console.log("Logging out");
    auth
      .signOut()
      .then(() => {
        console.log("User signed out successfully");
        Navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <div className="flex flex-col">
      {/* profile banner */}
      <div className="flex justify-center">
        <div className="relative w-full md:w-[800px]">
          <Link to="/feed">
            <div className="absolute left-5 top-6 z-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="white"
                className="bi bi-arrow-left"
                stroke="white"
                strokeWidth="1"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                />
              </svg>
            </div>
          </Link>
          <div
            className={`bg-gray-400 rounded-b-2xl ${
              bannerImgUrl === "" ? "w-full md:w-[800px] h-[150px]" : ""
            }`}
          >
            {bannerImgUrl !== "" && (
              <img
                src={bannerImgUrl}
                className="w-full md:w-[800px] h-[150px] rounded-b-2xl"
              />
            )}
          </div>
        </div>
      </div>
      {/* profile picture */}
      <div className="absolute top-[13%] md:top-[15%] left-[5%] sm:left-[10%] lg:left-[30%]">
        <img
          src={profileImgUrl}
          className="md:relative w-[96px] h-[96px] rounded-full bg-white"
        />
      </div>
      {/* edit profile button */}
      <div className="flex items-center justify-end px-2 w-full sm:w-[80%] lg:w-[50%] mt-5 self-center gap-4">
        {/* logout button */}
        <button
          className={`${
            popUp ? "rotate-45" : "rotate-0"
          } transition-all ease-in-out`}
          onClick={handlePopup}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            className="bi bi-gear"
            viewBox="0 0 16 16"
          >
            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
          </svg>
        </button>
        {/* Popup Menu */}
        {popUp && (
          <div className="absolute mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1" role="menu" aria-orientation="vertical">
              <button
                onClick={handleLogOut}
                className="w-full text-left text-lg px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Logout
              </button>
              {/* Add more menu items as needed */}
              <button
                onClick={() => {
                  /* Add handler */
                }}
                className="w-full text-left px-4 py-2 text-lg font-medium text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Settings
              </button>
            </div>
          </div>
        )}
        <Link to="/editprofile">
          <button className="border-[1px] border-black rounded-2xl w-[200px] md:w-[300px] py-1 text-black font-semibold font-Lexend text-lg">
            Edit Profile
          </button>
        </Link>
      </div>
      {/* username */}
      <div className="self-center w-full sm:w-[80%] lg:w-[50%] mt-10 text-3xl font-semibold font-Lexend px-7">
        {username}
      </div>
      {/* bio */}
      <div className="self-center w-full sm:w-[80%] lg:w-[50%] px-7 mt-3">
        {bio}
      </div>
      {/* user's posts */}
      <div className="self-center w-full sm:w-[80%] lg:w-[50%] mx-2 px-7 text-xl md:text-2xl font-medium sticky top-0 bg-white py-4">
        My Posts
      </div>
      {/* div showing the user's posts */}
      <div className="overflow-y-auto flex justify-center">
        <MyPosts />
      </div>

      {/* create new post button */}
      <Link to="/newpost">
        <div className="rounded-full h-[60px] w-[60px] fixed z-10 bottom-6 right-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            fill="currentColor"
            className="bi bi-plus-circle-fill"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
          </svg>
        </div>
      </Link>
    </div>
  );
};
export default Profile;

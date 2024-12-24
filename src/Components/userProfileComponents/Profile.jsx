import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { auth, db } from "../../auth/firebaseAuth";
import { doc, getDoc } from "firebase/firestore";
import { UserContext } from "../UserContext";
import MyPosts from "./MyPosts";
import person from "/profile.png";
import { Client, Storage } from "appwrite";
import NewPostButton from "../postsComponents/NewPostButton";
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

  const [isLoading, setIsLoading] = useState(true);

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
            setIsLoading(false);
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
            <div className="absolute left-5 top-6 z-10 bg-gray-700 bg-opacity-70 rounded-full w-[35px] h-[35px] flex justify-center items-center hover:-translate-x-1 transition-all ease-in-out">
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
              bannerImgUrl === ""
                ? `w-full md:w-[800px] h-[150px] flex justify-center items-center ${
                    isLoading && "animate-pulse"
                  }`
                : ""
            }`}
          >
            {bannerImgUrl !== "" ? (
              <img
                src={bannerImgUrl}
                className="w-full md:w-[800px] h-[150px] rounded-b-2xl"
              />
            ) : (
              <svg
                className={`w-10 h-10 text-gray-200 ${
                  isLoading ? "animate-pulse" : "opacity-0"
                }`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18"
              >
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
              </svg>
            )}
          </div>
        </div>
      </div>
      {/* profile picture */}
      <div className="absolute top-[13%] md:top-[15%] left-[5%] sm:left-[10%] lg:left-[30%]">
        <div className="w-[100px] h-[100px] bg-white rounded-full flex items-center justify-center">
          {isLoading ? (
            <svg
              className="md:relative w-[94px] h-[94px] text-gray-400 animate-pulse"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
          ) : (
            <img
              src={profileImgUrl}
              className="md:relative w-[94px] h-[94px] rounded-full bg-white"
            />
          )}
        </div>
      </div>
      {/* edit profile button */}
      <div className="flex items-center justify-end px-2 w-full md:w-[800px] mt-5 self-center gap-4">
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
          <button className="border-[1px] border-black rounded-2xl w-[200px] md:w-[300px] py-1 text-black font-semibold font-Lexend text-lg hover:bg-gray-100 transition-all ease-in-out">
            Edit Profile
          </button>
        </Link>
      </div>
      {/* username */}
      <div className="self-center w-full md:w-[800px] mt-10 text-3xl font-semibold font-Lexend px-7">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-3 my-3 bg-gray-200 rounded-full w-32 mb-2"></div>
          </div>
        ) : (
          <>{username}</>
        )}
      </div>
      {/* bio */}
      <div className="self-center w-full md:w-[800px] px-7 mt-3">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-3 bg-gray-200 rounded-full w-[300px] mb-2"></div>
          </div>
        ) : (
          <>{bio}</>
        )}
      </div>
      {/* user's posts */}
      <div
        className="self-center w-full md:w-[800px] mx-2 px-7 text-xl md:text-2xl font-Lexend font-medium sticky top-0 bg-white py-4 cursor-pointer"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        My Posts
      </div>
      {/* div showing the user's posts */}
      <div className="overflow-y-auto flex justify-center">
        <MyPosts />
      </div>

      {/* create new post button */}
      <NewPostButton />
    </div>
  );
};
export default Profile;

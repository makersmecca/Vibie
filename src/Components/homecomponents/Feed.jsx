import { Link } from "react-router-dom";
import Posts from "../postsComponents/Posts";
import { useState, useContext, useEffect, useCallback } from "react";
import { UserContext } from "../UserContext";
import { db } from "../../auth/firebaseAuth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import person from "/profile.png";

const Feed = () => {
  const { currentUser } = useContext(UserContext);
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
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
          setProfileImgUrl(
            userData.profileImgUrl === "" ? person : userData.profileImgUrl
          );
          setIsLoading(false);
        } else {
          console.log("No such document!");
          setUsername(currentUser.displayName);
          setProfileImgUrl(person);
          await setDoc(
            doc(db, "users", currentUser.email),
            {
              username: currentUser.displayName,
              bio: "",
              profileImgUrl: "",
              bannerImgUrl: "",
            },
            { merge: true }
          );
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <div className="flex flex-col items-center">
      <div className="pt-10 bg-white w-full z-10 flex flex-col md:items-center">
        <div className="md:flex md:justify-start w-full sm:w-[60%] lg:w-[30%]">
          <Link to="/profile">
            <div className="h-16 items-center flex px-5 gap-7">
              {isLoading ? (
                <>
                  <svg
                    className="w-20 h-20 text-gray-400 animate-pulse"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                  </svg>
                </>
              ) : (
                <img src={profileImgUrl} className="w-20 h-20 rounded-full" />
              )}

              <div className="mt-5">
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-2.5 bg-gray-200 rounded-full  w-32 mb-2"></div>
                    <div className="w-28 h-2 bg-gray-200 rounded-full "></div>
                  </div>
                ) : (
                  <>
                    <div className="opacity-65 font-medium">Welcome Back</div>
                    <div className="font-Lexend font-medium text-xl">
                      {username}
                    </div>
                  </>
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div className="md:flex md:justify-start w-full md:w-[30%] px-7 py-5 mt-[15px] text-2xl font-semibold font-Lexend sticky top-0 bg-white">
        Feeds
      </div>

      {/* Add padding-top to create space for fixed header */}
      <div className="mt-[10px] overflow-y-auto flex justify-center">
        <Posts />
      </div>

      <Link to="/newpost">
        <div className="rounded-full h-[60px] w-[60px] fixed z-10 bottom-6 right-6 hover:scale-[90%]">
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
export default Feed;

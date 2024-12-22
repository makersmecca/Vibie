import { Link } from "react-router-dom";
import Posts from "../postsComponents/Posts";
import { useState, useContext, useEffect, useCallback } from "react";
import { UserContext } from "../UserContext";
import { db } from "../../auth/firebaseAuth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import person from "/profile.png";
import NewPostButton from "../postsComponents/NewPostButton";

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
      <div className="pt-10 bg-white md:w-[800px] w-full z-10 flex flex-col">
        <div className="w-full sm:w-[80%] md:self-center">
          <Link to="/profile">
            <div className="px-5 w-full flex items-center">
              <div className="flex gap-7 w-full">
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
              <div className="pt-3 text-xl font-Pacifico w-[100px]">Vibie</div>
            </div>
          </Link>
        </div>
      </div>
      <div
        className="md:flex md:justify-start w-full md:w-[600px] px-7 py-5 mt-[15px] text-2xl font-semibold font-Lexend sticky top-0 bg-white cursor-pointer"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Feeds
      </div>

      {/* Add padding-top to create space for fixed header */}
      <div className="mt-[10px] overflow-y-auto flex justify-center">
        <Posts />
      </div>

      <NewPostButton />
    </div>
  );
};
export default Feed;

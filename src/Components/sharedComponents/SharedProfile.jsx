import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { db } from "../../auth/firebaseAuth";
import { Link } from "react-router-dom";
import { Client, Storage } from "appwrite";
import { UserContext } from "../UserContext";
import ShareButton from "./ShareButton";
import person from "/profile.png";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  orderBy,
} from "firebase/firestore";
import LikeButton from "../LikeButton";

const SharedProfile = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  //states for storing user details
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const [bannerImgUrl, setBannerImgUrl] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const { currentUser } = useContext(UserContext);

  const [mediaElements, setMediaElements] = useState({});
  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(`${import.meta.env.VITE_APPWRITE_PROJECT_ID}`);

  const bucketId = `${import.meta.env.VITE_APPWRITE_BUCKET_ID}`;

  const storage = new Storage(client);

  const getFileType = async (bucketId, fileId) => {
    try {
      const file = await storage.getFile(bucketId, fileId);
      return file.mimeType; // This will return the MIME type of the file
    } catch (error) {
      console.error("Error getting file type:", error);
      throw error;
    }
  };

  const currentLocation = useLocation();

  const { userID } = useParams();
  //   console.log(userID);

  useEffect(() => {
    setIsLoading(true);
    const fetchUserData = async () => {
      try {
        if (userID) {
          const userDocRef = doc(db, "users", userID);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUsername(userData.username);
            setProfileImgUrl(
              userData.profileImgUrl === "" ? person : userData.profileImgUrl
            );
            setBannerImgUrl(
              userData.bannerImgUrl === "" ? "" : userData.bannerImgUrl
            );
            setBio(userData.bio);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [currentLocation]);

  useEffect(() => {
    setIsLoading(true);
    const fetchUserPosts = async () => {
      try {
        if (!userID) return;

        const postsRef = collection(db, "userPosts", userID, "posts");
        const q = query(postsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const userPosts = querySnapshot.docs.map((doc) => {
          const postData = doc.data();
          return {
            id: doc.id,
            ...postData,
            userId: userID, // ensure userId is included
            likeCount: postData.likeCount || 0,
            likedBy: postData.likedBy || [],
          };
        });

        setPosts(userPosts);

        // Pre-render media elements for each post
        const mediaPromises = userPosts.map(async (post) => {
          // console.log(post.mediaUrl);
          const fileId = post.mediaUrl.includes("/preview")
            ? post.mediaUrl.split("/files/")[1].split("/preview")[0]
            : post.mediaUrl.split("/files/")[1].split("/view")[0];

          // console.log(fileId);
          const mimeType = await getFileType(bucketId, fileId);

          // console.log(mimeType);

          if (mimeType.startsWith("image/")) {
            return {
              id: post.id,
              element: (
                <img
                  className="rounded-xl w-[90%] max-h-[300px] self-center"
                  src={post.mediaUrl}
                  alt=""
                />
              ),
            };
          }
          if (mimeType.startsWith("video/")) {
            return {
              id: post.id,
              element: (
                <video
                  controls
                  className="rounded-xl w-[90%] max-h-[300px] self-center"
                  src={post.mediaUrl}
                >
                  <source src={post.mediaUrl} />
                  Your browser does not support the video tag.
                </video>
              ),
            };
          }
        });

        const resolvedMedia = await Promise.all(mediaPromises);
        const mediaMap = {};
        resolvedMedia.forEach((item) => {
          if (item) {
            mediaMap[item.id] = item.element;
          }
        });
        setMediaElements(mediaMap);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPosts();
  }, [currentLocation, currentUser]);

  return (
    <div className="flex flex-col">
      {/* profile banner */}
      <div className="flex justify-center">
        <div className="relative w-full md:w-[800px]">
          <Link to={currentUser?.email ? "/feed" : "/"}>
            <div className="absolute left-5 top-6 z-10 bg-gray-600 bg-opacity-70 rounded-full w-[35px] h-[35px] flex justify-center items-center hover:-translate-x-1 transition-all ease-in-out shadow-lg shadow-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="white"
                className="bi bi-arrow-left "
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
                ? `w-full md:w-[800px] h-[150px] ${
                    isLoading &&
                    "animate-pulse flex justify-center items-center"
                  }`
                : ""
            }`}
          >
            {isLoading && (
              <svg
                className="w-10 h-10 text-gray-200 animate-pulse"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18"
              >
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
              </svg>
            )}
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

      {/* username */}
      <div className="publicUserName self-center w-full md:w-[800px] mt-[90px] text-3xl font-semibold font-Lexend px-7 dark:text-white text-black">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-3 my-3 bg-gray-200 rounded-full w-32 mb-2"></div>
          </div>
        ) : (
          <>{username}</>
        )}
      </div>
      {/* bio */}
      <div className="publicUserBio self-center w-full md:w-[800px] px-7 mt-3 dark:text-white text-black">
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
        className="self-center w-full md:w-[800px] mx-2 px-7 text-xl md:text-2xl font-medium sticky top-0 bg-white dark:bg-black text-black dark:text-white py-4"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Posts
      </div>
      {isLoading ? (
        <>
          <div className="flex justify-center items-center h-40 gap-5">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin fill-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <div className="animate-pulse font-Lexend">Loading Posts...</div>
          </div>
        </>
      ) : (
        <div className="overflow-y-auto flex justify-center">
          <div className="flex flex-col gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="w-[350px] rounded-2xl shadow bg-gray-200 flex flex-col py-5 mb-4"
              >
                <div className="flex justify-between items-center">
                  <div className="w-full h-16 items-center flex px-5 gap-7">
                    <div className="w-[52px] h-[52px] bg-white rounded-full flex items-center justify-center">
                      <img
                        src={profileImgUrl}
                        className="w-12 h-12 rounded-full"
                      />
                    </div>
                    <div className="">
                      <div className="font-Lexend font-medium text-xl">
                        {username}
                      </div>
                    </div>
                  </div>
                </div>
                {mediaElements[post.id]}

                <div className="flex justify-between px-5 mt-5 items-center">
                  <LikeButton
                    postId={post.id}
                    userId={post.userId}
                    initialLikeCount={post.likeCount}
                    initialLikedBy={post.likedBy}
                    currentUser={currentUser}
                  />
                  <ShareButton postId={post.id} />
                </div>
                <div className="text-sm font-Lexend text-start text-gray-500 px-5 mt-2 ms-0.5">
                  {post.createdAt?.seconds
                    ? new Date(
                        post.createdAt.seconds * 1000
                      ).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default SharedProfile;

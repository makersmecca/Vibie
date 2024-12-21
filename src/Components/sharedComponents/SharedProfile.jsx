import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { db } from "../../auth/firebaseAuth";
import { Link } from "react-router-dom";
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

const SharedProfile = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  //states for storing user details
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const [bannerImgUrl, setBannerImgUrl] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

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
          } else {
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
            liked: postData.likedBy?.includes(userID) || false,
          };
        });

        setPosts(userPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPosts();
  }, [currentLocation]);

  return (
    <div className="flex flex-col">
      {/* profile banner */}
      <div className="flex justify-center">
        <div className="relative w-full md:w-[800px]">
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
        <div className="w-[100px] h-[100px] bg-white rounded-full flex items-center justify-center">
          <img
            src={profileImgUrl}
            className="md:relative w-[94px] h-[94px] rounded-full bg-white"
          />
        </div>
      </div>

      {/* username */}
      <div className="self-center w-full md:w-[800px] mt-[90px] text-3xl font-semibold font-Lexend px-7">
        {username}
      </div>
      {/* bio */}
      <div className="self-center w-full md:w-[800px] px-7 mt-3">{bio}</div>
      {/* user's posts */}
      <div className="self-center w-full md:w-[800px] mx-2 px-7 text-xl md:text-2xl font-medium sticky top-0 bg-white py-4">
        Posts
      </div>
      {/* div showing the user's posts */}
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

              <img
                className="rounded-xl w-[90%] max-h-[300px] self-center"
                src={post.mediaUrl}
                alt=""
              />

              <div className="flex justify-between px-5 mt-5 items-center">
                <div className="flex items-center justify-between w-[60px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="#ff708f"
                    className="bi bi-heart-fill ms-1"
                    viewBox="0 0 16 16"
                    onClick={() => handleLikes(post.id)}
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                    />
                  </svg>

                  <span className="text-lg text-gray-600 font-medium font-Lexend">
                    {post.likeCount || 0}
                  </span>
                </div>
                <ShareButton postId={post.id} />
              </div>
              <div className="text-sm font-Lexend text-start text-gray-500 px-5 mt-2 ms-0.5">
                {post.createdAt?.seconds
                  ? new Date(post.createdAt.seconds * 1000).toLocaleDateString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : ""}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SharedProfile;

import { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import { db } from "../../auth/firebaseAuth";
import {
  collection,
  query,
  doc,
  getDoc,
  getDocs,
  orderBy,
} from "firebase/firestore";

import bg9 from "/bgImg/bg9.jpeg";
const MyPosts = () => {
  const { currentUser } = useContext(UserContext);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [profileImgUrl, setProfileImgUrl] = useState("");
  const [username, setUsername] = useState("");

  const handleLikes = () => {
    if (liked) setLikeCount((prev) => prev - 1);
    else setLikeCount((prev) => prev + 1);
    setLiked((prev) => !prev);
  };
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
            setProfileImgUrl(
              userData.profileImgUrl === "" ? person : userData.profileImgUrl
            );
          } else {
            console.log("No such document!");
            setUsername(currentUser.displayName);
            setProfileImgUrl(person);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        // console.log(currentUser.email);
        if (!currentUser?.email) return;

        // Reference to the posts subcollection
        const postsRef = collection(
          db,
          "userPosts",
          currentUser.email,
          "posts"
        );

        // Create query to order posts by timestamp
        const q = query(postsRef, orderBy("createdAt", "desc"));

        const querySnapshot = await getDocs(q);

        const userPosts = [];
        querySnapshot.forEach((doc) => {
          userPosts.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setPosts(userPosts);
        console.log(userPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPosts();
  }, [currentUser]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // No posts state
  if (posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">No posts yet</p>
      </div>
    );
  }

  const handleEditPost = () => {
    // Handle edit post logic here
  };

  return (
    <div className="flex flex-col gap-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="w-[350px] rounded-2xl shadow bg-gray-200 flex flex-col py-5 mb-4"
        >
          <div className="flex justify-between items-center">
            <Link to="/profile">
              <div className="w-full h-16 items-center flex px-5 gap-7">
                <div className="w-[52px] h-[52px] bg-white rounded-full flex items-center justify-center">
                  <img src={profileImgUrl} className="w-12 h-12 rounded-full" />
                </div>
                <div className="">
                  <div className="font-Lexend font-medium text-xl">
                    {username}
                  </div>
                </div>
              </div>
            </Link>
            <div onClick={handleEditPost} className="w-[50px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-three-dots"
                viewBox="0 0 16 16"
              >
                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
              </svg>
            </div>
          </div>

          <div className="p-5">
            <p className="mb-2 font-Lexend text-md ">{post.caption}</p>
          </div>
          <img
            className="rounded-xl w-[90%] max-h-[300px] self-center"
            src={post.mediaUrl}
            alt=""
          />

          <div className="flex justify-between px-5 mt-5 items-center">
            <div className="flex items-center justify-between w-[60px]">
              {liked ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="#ff708f"
                  className="bi bi-heart-fill ms-1"
                  viewBox="0 0 16 16"
                  onClick={handleLikes}
                >
                  <path
                    fillRule="evenodd"
                    d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="#4b5563"
                  className="bi bi-heart ms-1"
                  viewBox="0 0 16 16"
                  onClick={handleLikes}
                >
                  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                </svg>
              )}

              <span className="text-lg text-gray-600 font-medium font-Lexend">
                {post.likeCount || 0}
              </span>
            </div>
            <button className="bg-slate-300 rounded-full w-[100px] py-1.5 px-1 flex items-center justify-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-send-fill mt-0.5"
                viewBox="0 0 16 16"
              >
                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
              </svg>
              <span className="font-Lexend">Share</span>
            </button>
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
  );
};
export default MyPosts;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../auth/firebaseAuth";
import { Link } from "react-router-dom";

const PostDetails = () => {
  const { postID } = useParams(); // Get postID from the URL
  history.pushState(null, "", `/post/${postID}`);
  const [post, setPost] = useState(null);
  const [postUser, setPostUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user profile data using userId
  const fetchUserProfile = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return {
          username: userDoc.data().username,
          profileImgUrl: userDoc.data().profileImgUrl,
          bio: userDoc.data().bio,
          bannerImgUrl: userDoc.data().bannerImgUrl,
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const globalDocRef = doc(db, "globalPosts", postID);
        const docSnap = await getDoc(globalDocRef);

        if (docSnap.exists()) {
          setPost(docSnap.data());
          const userProfile = await fetchUserProfile(docSnap.data().userId);
          setPostUser(userProfile);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postID]);

  if (loading)
    return (
      <div className="flex w-full justify-center h-screen items-center animate-pulse font-Lexend font-lg">
        Loading Post...
      </div>
    );

  if (!post)
    return (
      <div className="flex w-full justify-center h-screen items-center animate-pulse font-Lexend font-lg">
        Uh oh! Post not found
      </div>
    );

  return (
    <div className="flex w-full justify-center h-screen items-center">
      <div className="fixed top-0 w-full font-Pacifico px-10 py-5 text-3xl bg-gray-200 flex justify-between items-center">
        <Link to="/">InstaVibe</Link>
        <div className="text-xl">#join the vibetribe</div>
      </div>
      <div
        key={post.id}
        className="w-[350px] rounded-2xl shadow bg-gray-200 flex flex-col py-5 mb-4"
      >
        <div className="w-full h-16 items-center flex px-5 gap-7">
          {postUser.profileImgUrl ? (
            <img
              src={userProfile.profileImgUrl}
              className="w-14 h-14 rounded-full object-cover"
              alt={`${postUser.username}'s profile`}
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center">
              {postUser.username.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <div className="font-Lexend font-medium text-xl">
              {postUser.username}
            </div>
          </div>
        </div>

        <div className="p-5">
          <p className="mb-3 font-normal text-black">{post.caption}</p>
        </div>

        {post.mediaUrl && (
          <img
            className="rounded-xl w-[90%] h-[300px] self-center object-cover"
            src={post.mediaUrl}
            alt="Post content"
          />
        )}

        <div className="flex justify-between px-5 mt-5 items-center">
          <div className="flex items-center justify-between w-[60px]">
            <button disabled>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#ff708f"
                className="bi bi-heart-fill ms-1"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                />
              </svg>
            </button>
            <span className="text-lg text-gray-600 font-medium font-Lexend">
              {post.likeCount || 0}
            </span>
          </div>
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
    </div>
  );
};

export default PostDetails;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../auth/firebaseAuth";
import { Link } from "react-router-dom";

const PostDetails = () => {
  const { postID } = useParams();
  const [post, setPost] = useState(null);
  const [postUser, setPostUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState("");

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
      } else {
        console.error("No such document!");
        return (
          <div className="flex w-full justify-center h-screen items-center font-Lexend text-lg">
            Uh oh! Something went wrong
          </div>
        );
      }
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
          setUserID(docSnap.data().userId);
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

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen gap-4">
  //       {/* <div className="animate-spin rounded-full h-8 w-8 border-t-[2px] border-gray-900"></div> */}
  //       <svg
  //         aria-hidden="true"
  //         className="w-8 h-8 text-gray-200 animate-spin fill-gray-600"
  //         viewBox="0 0 100 101"
  //         fill="none"
  //         xmlns="http://www.w3.org/2000/svg"
  //       >
  //         <path
  //           d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
  //           fill="currentColor"
  //         />
  //         <path
  //           d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
  //           fill="currentFill"
  //         />
  //       </svg>
  //       <div className="animate-pulse font-Lexend">Loading Post...</div>
  //     </div>
  //   );
  // }

  // if (!post)
  //   return (
  //     <div className="flex w-full justify-center h-screen items-center font-Lexend font-lg">
  //       Uh oh! Post not found
  //     </div>
  //   );

  return (
    <div className="flex w-full justify-center h-screen items-center">
      <div className="fixed top-0 w-full font-Pacifico px-10 py-5 text-3xl bg-gray-200 flex justify-between items-center">
        <Link to="/">Vibie</Link>
        <div className="text-xl">#join the vibetribe</div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-screen gap-4">
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
          <div className="animate-pulse font-Lexend">Loading Post...</div>
        </div>
      ) : post ? (
        <div
          key={post.id}
          className="w-[350px] rounded-2xl shadow bg-gray-200 flex flex-col py-5 mb-4"
        >
          <Link to={`/profile/${userID}`}>
            <div className="w-full h-16 items-center flex px-5 gap-7">
              {postUser.profileImgUrl ? (
                <img
                  src={postUser.profileImgUrl}
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
          </Link>

          <div className="p-5">
            <p className="mb-3 font-normal text-black">{post.caption}</p>
          </div>
          <>
            {post.mediaUrl && (
              <img
                className="rounded-xl w-[90%] h-[300px] self-center object-cover"
                src={post.mediaUrl}
                alt="Post content"
              />
            )}
          </>
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
            <div className="text-sm font-Lexend text-start text-gray-500 px-5 ms-0.5">
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
      ) : (
        <div className="flex w-full justify-center h-screen items-center font-Lexend font-lg">
          Uh oh! Post not found
        </div>
      )}
    </div>
  );
};

export default PostDetails;

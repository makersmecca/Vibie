import { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import { db } from "../../auth/firebaseAuth";
import { useLocation } from "react-router-dom";
import person from "/profile.png";
import {
  collection,
  query,
  getDoc,
  orderBy,
  updateDoc,
  increment,
  onSnapshot,
  doc,
  writeBatch,
} from "firebase/firestore";

const Posts = () => {
  const { currentUser } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Single useEffect for real-time updates
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const postsQuery = query(
      collection(db, "globalPosts"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      postsQuery,
      async (snapshot) => {
        try {
          const postsPromises = snapshot.docs.map(async (doc) => {
            const postData = doc.data();
            const userProfile = await fetchUserProfile(postData.userId);

            return {
              id: doc.id,
              ...postData,
              userProfile: userProfile || {
                username: "Unknown User",
                profileImgUrl: null,
                bio: "",
                bannerImgUrl: null,
              },
              isLiked: false, // You can implement like status logic here
            };
          });

          const postsWithProfiles = await Promise.all(postsPromises);
          setPosts(postsWithProfiles);
          setIsLoading(false);
        } catch (error) {
          console.error("Error processing posts:", error);
          setError("Failed to load posts");
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleLikes = async (postId, userId) => {
    try {
      // Find the current post first
      const currentPost = posts.find((p) => p.id === postId);
      if (!currentPost) return;

      // Calculate the new like count
      const newLikeCount =
        (currentPost.likeCount || 0) + (currentPost.liked ? -1 : 1);

      // Update posts state with optimistic update
      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              liked: !post.liked,
              likeCount: newLikeCount,
            };
          }
          return post;
        })
      );

      // Create references to both documents that need to be updated
      const userPostRef = doc(db, "userPosts", userId, "posts", postId);
      const globalPostRef = doc(db, "globalPosts", postId);

      // Update both documents in parallel using Promise.all
      await Promise.all([
        updateDoc(userPostRef, {
          likeCount: newLikeCount,
        }),
        updateDoc(globalPostRef, {
          likeCount: increment(currentPost.liked ? -1 : 1), // Set the exact new count
        }),
      ]);
    } catch (error) {
      console.error("Error updating likes:", error);
      // Revert the optimistic update if either update fails
      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post.id === postId) {
            const newLikeCount = (post.likeCount || 0) + (post.liked ? 1 : -1);
            return {
              ...post,
              liked: !post.liked,
              likeCount: newLikeCount,
            };
          }
          return post;
        })
      );
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  if (posts.length === 0) {
    return <div>No posts available</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="w-[350px] rounded-2xl shadow bg-gray-200 flex flex-col py-5 mb-4"
        >
          <div className="w-full h-16 items-center flex px-5 gap-7">
            {post.userProfile.profileImgUrl ? (
              <img
                src={post.userProfile.profileImgUrl}
                className="w-14 h-14 rounded-full object-cover"
                alt={`${post.userProfile.username}'s profile`}
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center">
                {post.userProfile.username.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <div className="font-Lexend font-medium text-xl">
                {post.userProfile.username}
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
              <button onClick={() => handleLikes(post.id, post.userId)}>
                {post.isLiked ? (
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
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="#4b5563"
                    className="bi bi-heart ms-1"
                    viewBox="0 0 16 16"
                  >
                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                  </svg>
                )}
              </button>
              <span className="text-lg text-gray-600 font-medium font-Lexend">
                {post.likeCount || 0}
              </span>
            </div>

            {/* Share button */}
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

export default Posts;

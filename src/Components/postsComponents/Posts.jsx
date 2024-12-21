import { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import { db } from "../../auth/firebaseAuth";
import { Link } from "react-router-dom";
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
import ShareButton from "../sharedComponents/ShareButton";

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

            // Check if current user's email is in the likedBy array
            const isLiked =
              postData.likedBy?.includes(currentUser?.email) || false;

            return {
              id: doc.id,
              ...postData,
              userProfile: userProfile || {
                username: "Unknown User",
                profileImgUrl: null,
                bio: "",
                bannerImgUrl: null,
              },
              liked: isLiked,
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
  }, [currentUser]);

  const handleLikes = async (postId, userId) => {
    try {
      if (!currentUser?.email) return; // Ensure user is logged in

      // Get references to both documents
      const userPostRef = doc(db, "userPosts", userId, "posts", postId);
      const globalPostRef = doc(db, "globalPosts", postId);

      // Get current state of both documents
      const [userPostDoc, globalPostDoc] = await Promise.all([
        getDoc(userPostRef),
        getDoc(globalPostRef),
      ]);

      if (!userPostDoc.exists() || !globalPostDoc.exists()) {
        console.error("Post not found");
        return;
      }

      // Check if user has already liked the post
      const userPostData = userPostDoc.data();
      const globalPostData = globalPostDoc.data();
      const isLiked = userPostData.likedBy?.includes(currentUser.email);

      // Create batch write
      const batch = writeBatch(db);

      if (isLiked) {
        // Remove like
        batch.update(userPostRef, {
          likeCount: increment(-1),
          likedBy: userPostData.likedBy.filter(
            (email) => email !== currentUser.email
          ),
        });

        batch.update(globalPostRef, {
          likeCount: increment(-1),
          likedBy: globalPostData.likedBy.filter(
            (email) => email !== currentUser.email
          ),
        });
      } else {
        // Add like
        batch.update(userPostRef, {
          likeCount: increment(1),
          likedBy: [...(userPostData.likedBy || []), currentUser.email],
        });

        batch.update(globalPostRef, {
          likeCount: increment(1),
          likedBy: [...(globalPostData.likedBy || []), currentUser.email],
        });
      }

      // Commit the batch
      await batch.commit();

      // Update local state
      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              liked: !isLiked,
              likeCount: isLiked ? post.likeCount - 1 : post.likeCount + 1,
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error("Error updating likes:", error);
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
          <Link
            to={
              post.userId === currentUser.email
                ? "/profile"
                : `/profile/${post.userId}`
            }
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
          </Link>

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
                {post.liked ? (
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
  );
};

export default Posts;

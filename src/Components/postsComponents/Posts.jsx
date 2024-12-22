import { useState, useEffect, useContext, useCallback } from "react";
import { Client, Storage } from "appwrite";
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

          // Pre-render media elements for each post
          const mediaPromises = postsWithProfiles.map(async (post) => {
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

  const handleLikes = useCallback(
    async (postId, userId) => {
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
    },
    [currentUser]
  );

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40 gap-5">
        {/* <div className="animate-spin rounded-full h-8 w-8 border-t-[2px] border-gray-900"></div> */}
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
    );
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
            <p className="mb-3 font-normal text-black font-Lexend">
              {post.caption}
            </p>
          </div>

          {/* {post.mediaUrl && (
            <img
              className="rounded-xl w-[90%] h-[300px] self-center object-cover"
              src={post.mediaUrl}
              alt="Post content"
            />
          )} */}
          {mediaElements[post.id]}

          <div className="flex justify-between px-5 mt-5 items-center">
            <div className="flex items-center justify-between w-[60px]">
              <button onClick={() => handleLikes(post.id, post.userId)}>
                {post.liked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="#ff708f"
                    className="bi bi-heart-fill ms-1 cursor-pointer"
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
                    className="bi bi-heart ms-1 cursor-pointer"
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

          <div className="text-sm font-Lexend text-start text-gray-500 ps-5 pe-6 mt-2 ms-0.5">
            {post.createdAt?.seconds ? (
              <div className="flex gap-3">
                <div>
                  {new Date(post.createdAt.seconds * 1000).toLocaleDateString(
                    "en-US",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                  ,
                </div>
                <div>
                  {new Date(post.createdAt.seconds * 1000).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    }
                  )}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;

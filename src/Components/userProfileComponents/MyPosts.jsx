import { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import { db } from "../../auth/firebaseAuth";
import { useLocation } from "react-router-dom";
import person from "/profile.png";
import { Client, Storage } from "appwrite";
import {
  collection,
  query,
  doc,
  getDoc,
  getDocs,
  orderBy,
  updateDoc,
  increment,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import ShareButton from "../ShareButton";

// import bg9 from "/bgImg/bg9.jpeg";
const MyPosts = () => {
  const { currentUser } = useContext(UserContext);
  const currentLocation = useLocation();

  //Appwrite Consts
  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(`${import.meta.env.VITE_APPWRITE_PROJECT_ID}`);

  const storage = new Storage(client);

  //states to store post related details
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //states for storing user details
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const [username, setUsername] = useState("");

  //states to handle post editing
  const [activeMenu, setActiveMenu] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editedCaption, setEditedCaption] = useState("");

  useEffect(() => {
    setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  //load posts created by the current user
  useEffect(() => {
    setIsLoading(true);
    const fetchUserPosts = async () => {
      try {
        if (!currentUser?.email) return;

        const postsRef = collection(
          db,
          "userPosts",
          currentUser.email,
          "posts"
        );
        const q = query(postsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const userPosts = querySnapshot.docs.map((doc) => {
          const postData = doc.data();
          return {
            id: doc.id,
            ...postData,
            liked: postData.likedBy?.includes(currentUser.email) || false,
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
  }, [currentUser, currentLocation]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // No posts state
  if (!isLoading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">No posts yet</p>
      </div>
    );
  }

  const handleLikes = async (postId) => {
    try {
      // Find the current post
      const currentPost = posts.find((p) => p.id === postId);
      if (!currentPost) return;

      // Create references to both documents
      const userPostRef = doc(
        db,
        "userPosts",
        currentUser.email,
        "posts",
        postId
      );
      const globalPostRef = doc(db, "globalPosts", postId);

      // Get the current state of both documents
      const [userPostDoc, globalPostDoc] = await Promise.all([
        getDoc(userPostRef),
        getDoc(globalPostRef),
      ]);

      const userPostData = userPostDoc.data();
      const globalPostData = globalPostDoc.data();

      // Check if user has already liked the post
      const userLikedPost = userPostData.likedBy?.includes(currentUser.email);

      // Prepare the update data
      const updateData = {
        likeCount: userLikedPost ? increment(-1) : increment(1),
        likedBy: userLikedPost
          ? userPostData.likedBy.filter((email) => email !== currentUser.email)
          : [...(userPostData.likedBy || []), currentUser.email],
      };

      // Optimistic update for UI
      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              liked: !userLikedPost,
              likeCount: userLikedPost
                ? post.likeCount - 1
                : post.likeCount + 1,
            };
          }
          return post;
        })
      );

      // Update both documents in parallel
      await Promise.all([
        updateDoc(userPostRef, updateData),
        updateDoc(globalPostRef, updateData),
      ]);
    } catch (error) {
      console.error("Error updating likes:", error);
      // Revert the optimistic update if the operation fails
      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              liked: !post.liked,
              likeCount: post.liked ? post.likeCount - 1 : post.likeCount + 1,
            };
          }
          return post;
        })
      );
    }
  };

  const handleEditPost = (postId) => {
    setActiveMenu(activeMenu === postId ? null : postId);
  };
  const startEditing = (post) => {
    setEditingPost(post);
    setEditedCaption(post.caption);
    setActiveMenu(null);
  };

  const cancelEditing = () => {
    setEditingPost(null);
    setEditedCaption("");
  };

  const saveEdit = async () => {
    if (!editingPost) return;

    try {
      const postRef = doc(
        db,
        "userPosts",
        currentUser.email,
        "posts",
        editingPost.id
      );
      await updateDoc(postRef, {
        caption: editedCaption,
      });

      // Update local state
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === editingPost.id
            ? { ...post, caption: editedCaption }
            : post
        )
      );

      setEditingPost(null);
      setEditedCaption("");
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      try {
        await storage.deleteFile(
          `${import.meta.env.VITE_APPWRITE_BUCKET_ID}`,
          String(postId)
        );
      } catch (storageError) {
        console.error("Error deleting file from storage:", storageError);
      }
      const batch = writeBatch(db);
      // Delete from userPosts
      const userPostRef = doc(
        db,
        "userPosts",
        currentUser.email,
        "posts",
        postId
      );
      batch.delete(userPostRef);

      // Delete from globalPosts
      const globalPostRef = doc(db, "globalPosts", postId);
      batch.delete(globalPostRef);

      await batch.commit();

      setPosts((currentPosts) =>
        currentPosts.filter((post) => post.id !== postId)
      );
      setActiveMenu(null);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
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
            <div
              onClick={() => handleEditPost(post.id)}
              className="w-[50px] cursor-pointer"
            >
              {activeMenu === post.id ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  stroke="black"
                  strokeWidth="0.5px"
                  className="bi bi-x"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="currentColor"
                  className="bi bi-three-dots"
                  viewBox="0 0 16 16"
                >
                  <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                </svg>
              )}
            </div>
            {activeMenu === post.id && (
              <div className="absolute mt-32 ms-48 flex w-[120px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <button
                    onClick={() => startEditing(post)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Delete Post
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Edit Form */}
          {editingPost?.id === post.id ? (
            <div className="p-5">
              <textarea
                value={editedCaption}
                onChange={(e) => setEditedCaption(e.target.value)}
                className="w-full p-2 border rounded-md mb-2"
                rows="2"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={cancelEditing}
                  className="px-3 py-1 bg-gray-400 rounded-md font-Lexend"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="px-3 py-1 bg-slate-300 rounded-md font-Lexend"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5">
              <p className="mb-2 font-Lexend text-md">{post.caption}</p>
            </div>
          )}
          {/* 
          <div className="p-5">
            <p className="mb-2 font-Lexend text-md ">{post.caption}</p>
          </div> */}
          <img
            className="rounded-xl w-[90%] max-h-[300px] self-center"
            src={post.mediaUrl}
            alt=""
          />

          <div className="flex justify-between px-5 mt-5 items-center">
            <div className="flex items-center justify-between w-[60px]">
              {post.liked ? (
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
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="#4b5563"
                  className="bi bi-heart ms-1"
                  viewBox="0 0 16 16"
                  onClick={() => handleLikes(post.id)}
                >
                  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                </svg>
              )}

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
  );
};
export default MyPosts;

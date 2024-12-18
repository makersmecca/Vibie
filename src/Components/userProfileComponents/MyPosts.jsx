import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import bg9 from "/bgImg/bg9.jpeg";
const MyPosts = () => {
  const { currentUser } = useContext(UserContext);
  const username = currentUser?.displayName;
  const [likeCount, setLikeCount] = useState(24);

  const [liked, setLiked] = useState(false);
  const handleLikes = () => {
    if (liked) setLikeCount((prev) => prev - 1);
    else setLikeCount((prev) => prev + 1);
    setLiked((prev) => !prev);
  };
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <div className="flex flex-col gap-6">
      {arr.map((x) => (
        <div
          key={x}
          className="w-[350px] rounded-2xl shadow bg-gray-200 flex flex-col py-5"
        >
          <Link to="/profile">
            <div className="w-full h-16 items-center flex px-5 gap-7">
              <img src={bg9} className="w-12 h-12 rounded-full" />
              <div className="">
                <div className="font-Lexend font-medium text-xl">
                  {username}
                </div>
              </div>
            </div>
          </Link>

          <div className="p-5">
            <p className="mb-3 font-normal text-black">
              Nature is the best artform. #nature
            </p>
          </div>
          <img
            className="rounded-xl w-[90%] h-[300px] self-center"
            src={bg9}
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
                {likeCount}
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
        </div>
      ))}
    </div>
  );
};
export default MyPosts;

// import { useState, useEffect, useContext } from "react";
// import { UserContext } from "../UserContext";
// import { db } from "../../auth/firebaseAuth";
// import { collection, query, where, getDocs } from "firebase/firestore";

// const MyPosts = () => {
//   const [posts, setPosts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const { currentUser } = useContext(UserContext);

//   // Fetch user's posts
//   useEffect(() => {
//     const fetchUserPosts = async () => {
//       try {
//         const postsRef = collection(db, "posts");
//         const q = query(postsRef, where("userId", "==", currentUser?.uid));
//         const querySnapshot = await getDocs(q);

//         const userPosts = [];
//         querySnapshot.forEach((doc) => {
//           userPosts.push({ id: doc.id, ...doc.data() });
//         });

//         // Sort posts by timestamp (newest first)
//         userPosts.sort((a, b) => b.timestamp - a.timestamp);
//         setPosts(userPosts);
//       } catch (error) {
//         console.error("Error fetching posts:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (currentUser?.uid) {
//       fetchUserPosts();
//     }
//   }, [currentUser]);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-40">
//         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   if (posts.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-40">
//         <p className="text-gray-500">No posts yet</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full md:w-[50%] mx-auto px-4 py-6 space-y-6 overflow-y-auto">
//       {posts.map((post) => (
//         <PostCard key={post.id} post={post} />
//       ))}
//     </div>
//   );
// };

// // Separate PostCard component for better organization
// const PostCard = ({ post }) => {
//   return (
//     <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
//       {/* Post Image */}
//       {post.imageUrl && (
//         <div className="w-full h-48 overflow-hidden">
//           <img
//             src={post.imageUrl}
//             alt="Post"
//             className="w-full h-full object-cover"
//             onError={(e) => {
//               e.target.src = "/default-post-image.jpg"; // Add a default image
//             }}
//           />
//         </div>
//       )}

//       {/* Post Content */}
//       <div className="p-4">
//         {/* Timestamp */}
//         <div className="text-sm text-gray-500 mb-2">
//           {new Date(post.timestamp?.toDate()).toLocaleDateString()}
//         </div>

//         {/* Title */}
//         <h3 className="font-bold text-xl mb-2">{post.title}</h3>

//         {/* Description */}
//         <p className="text-gray-600 mb-4">{post.description}</p>

//         {/* Location */}
//         {post.location && (
//           <div className="flex items-center text-sm text-gray-500 mb-2">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-4 w-4 mr-1"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//               />
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//               />
//             </svg>
//             {post.location}
//           </div>
//         )}

//         {/* Interaction Stats */}
//         <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
//           <div className="flex items-center">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 mr-1"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//               />
//             </svg>
//             {post.likes?.length || 0}
//           </div>

//           <div className="flex items-center">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 mr-1"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
//               />
//             </svg>
//             {post.comments?.length || 0}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyPosts;

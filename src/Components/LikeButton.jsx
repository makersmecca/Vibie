import { useState, useMemo, useEffect } from "react";
import { doc, writeBatch, getDoc, increment } from "firebase/firestore";
// import { db } from "../../firebase/config"; // adjust path as needed
import { db } from "../auth/firebaseAuth";
import { Link } from "react-router-dom";

const LikeButton = ({
  postId,
  userId,
  initialLikeCount,
  initialLikedBy,
  currentUser,
}) => {
  const [likeCount, setLikeCount] = useState(initialLikeCount || 0);
  const [isLiked, setIsLiked] = useState(
    initialLikedBy?.includes(currentUser?.email) || false
  );

  const [displayPopup, setDisplayPopup] = useState(false);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  const handleLike = async () => {
    try {
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

      const userPostData = userPostDoc.data();
      const globalPostData = globalPostDoc.data();
      const currentlyLiked = userPostData.likedBy?.includes(currentUser.email);

      // Create batch write
      const batch = writeBatch(db);

      if (currentlyLiked) {
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
      setIsLiked(!currentlyLiked);
      setLikeCount((prev) => (currentlyLiked ? prev - 1 : prev + 1));
    } catch (error) {
      if (
        error.message.includes(
          "Cannot read properties of null (reading 'email')"
        )
      ) {
        console.log("User is not logged in");
        setDisplayPopup(true);
      }
      // Revert local state on error
      setIsLiked(initialLikedBy?.includes(currentUser?.email) || false);
      setLikeCount(initialLikeCount || 0);
    }
  };

  // Debounced version of handleLike
  const debouncedHandleLike = useMemo(
    () => debounce(handleLike, 500),
    [handleLike]
  );

  useEffect(() => {
    return () => {
      if (debouncedHandleLike.cancel) {
        debouncedHandleLike.cancel();
      }
    };
  }, [debouncedHandleLike]);

  return (
    <>
      {displayPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* popup box */}
          <div className="relative bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            {/* close button */}
            <div
              onClick={() => setDisplayPopup(false)}
              className="absolute top-[-10px] right-[-10px] bg-gray-900 text-white rounded-full h-[30px] w-[30px] flex justify-center items-center cursor-pointer hover:scale-95"
            >
              X
            </div>
            <div className="font-Lexend text-xl">
              Uh Oh, You're not logged in!
            </div>

            <div className="text-lg mt-2 font-Lexend">
              Please Login to continue.
            </div>
            <div className="flex flex-col items-center mt-2">
              <Link to="/">
                <button className="bg-gray-900 w-[250px] md:w-[230px] text-white rounded-full py-1.5 font-Lexend hover:bg-opacity-75">
                  Log In
                </button>
              </Link>

              <div className="mt-5 font-Lexend">
                Do not have an account?{" "}
                <Link to="/signup" className="underline">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between w-[60px]">
        <button
          onClick={debouncedHandleLike}
          aria-label={isLiked ? "Unlike post" : "Like post"}
        >
          {isLiked ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#ff708f"
              className="bi bi-heart-fill ms-1 cursor-pointer hover:scale-110 ease-in-out transition-all animate-likeButton"
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
              className="bi bi-heart ms-1 cursor-pointer hover:scale-110 ease-in-out transition-all"
              viewBox="0 0 16 16"
            >
              <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
            </svg>
          )}
        </button>
        <span className="text-lg text-gray-600 font-medium font-Lexend">
          {likeCount}
        </span>
      </div>
    </>
  );
};

export default LikeButton;

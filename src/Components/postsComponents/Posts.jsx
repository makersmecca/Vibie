import { useState } from "react";
import bg9 from "/bgImg/bg9.jpeg";
import { Link } from "react-router-dom";
const Posts = () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const username = "John Doe";
  const [likeCount, setLikeCount] = useState(24);

  const [liked, setLiked] = useState(false);
  const handleLikes = () => {
    if (liked) setLikeCount((prev) => prev - 1);
    else setLikeCount((prev) => prev + 1);
    setLiked((prev) => !prev);
  };
  return (
    <div className="flex flex-col gap-6">
      {arr.map((x) => (
        <div
          key={x}
          className="w-[350px] rounded-2xl shadow bg-gray-200 flex flex-col py-5"
        >
          <Link to="/profile">
            <div className="w-full h-16 items-center flex px-5 gap-7">
              <img src={bg9} className="w-14 h-14 rounded-full" />
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

export default Posts;

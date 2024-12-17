import bg9 from "/bgImg/bg9.jpeg";
import { Link } from "react-router-dom";
const Posts = () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const likeCount = 24;
  const username = "John Doe";

  return (
    <div class="max-w-[350px] rounded-2xl shadow bg-gray-300 flex flex-col py-5">
      <Link to="/profile">
        <div className="w-full h-16 items-center flex px-5 gap-7">
          <img src={bg9} className="w-14 h-14 rounded-full" />
          <div className="">
            <div className="font-Lexend font-medium text-xl">{username}</div>
          </div>
        </div>
      </Link>

      <div className="p-5">
        <p className="mb-3 font-normal text-black">
          Here are the biggest enterprise technology acquisitions of 2021 so
          far, in reverse chronological order.
        </p>
      </div>
      <img
        className="rounded-xl w-[90%] h-[300px] self-center"
        src={bg9}
        alt=""
      />

      <div className="flex justify-between px-5 mt-5 items-center">
        <div className="flex items-center justify-between w-[60px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="white"
            className="bi bi-heart-fill"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
            />
          </svg>
          <span className="text-lg text-white font-medium font-Lexend">
            {likeCount}
          </span>
        </div>
        <button className="bg-slate-200 rounded-full w-[100px] p-1 flex items-center justify-center gap-1">
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
  );
};

export default Posts;

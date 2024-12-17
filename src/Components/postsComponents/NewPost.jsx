// import Navbar from "../Navbar";
import { useState } from "react";
import { Link } from "react-router-dom";
const NewPost = () => {
  const [postCaption, setPostCaption] = useState("");
  const handlePostCaptionInput = (e) => {
    e.preventDefault();
    setPostCaption(e.target.value);
  };
  return (
    <div className="flex flex-col">
      <div className="p-5 left-5 top-6 flex items-center gap-5">
        <Link to="/feed">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="black"
            className="bi bi-arrow-left"
            stroke="black"
            strokeWidth="0.5px"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
            />
          </svg>
        </Link>
        <div className="text-2xl font-semibold text-black font-Lexend">
          New Post
        </div>
      </div>
      <textarea
        className="bg-gray-200 flex justify-center self-center mt-10 h-[300px] w-[90%] rounded-2xl p-4"
        placeholder="What's on your mind today?"
        value={postCaption}
        onChange={handlePostCaptionInput}
      />
      {/* upload image/video from device */}
      <div></div>

      {/* use the device's camera to click a picture and upload that photo */}
      <div></div>

      <div className="w-full flex justify-center">
        <button className="bg-gray-900 w-[350px] md:w-[300px] text-white rounded-full py-1.5 fixed bottom-[20px] font-Lexend">
          Create Post
        </button>
      </div>
    </div>
  );
};

export default NewPost;

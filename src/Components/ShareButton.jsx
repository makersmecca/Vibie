import { useState, useEffect } from "react";

const ShareButton = ({ postId }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
    console.log(postId);
  };
  return (
    <>
      {showShareMenu && (
        <div className="absolute z-10 bg-white w-[310px] h-[300px] mt-0 mb-[400px] rounded-xl p-5">
          <div>Share now</div>
        </div>
      )}
      <button
        onClick={handleShare}
        className="bg-slate-300 rounded-full w-[100px] py-1.5 px-1 flex items-center justify-center gap-1 hover:scale-90"
      >
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
    </>
  );
};
export default ShareButton;

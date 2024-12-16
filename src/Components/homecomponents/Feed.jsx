import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import bg9 from "/bgImg/bg9.jpeg";

const Feed = () => {
  const username = "new user 1";
  return (
    <div className="">
      <Link to="/profile">
        <div className=" w-full h-16 items-center flex px-5 gap-7 border-b-2 border-black">
          <img src={bg9} className="w-14 h-14 rounded-full" />
          <div>
            <div>Welcome Back</div>
            <div>{username}</div>
          </div>
        </div>
      </Link>

      {/* feed content of photos and videos to be shown here and must be scrollable */}
      <div className="flex-1 overflow-y-auto h-full"></div>

      <Link to="/newpost">
        <div className="rounded-full h-[60px] w-[60px] absolute z-10 bottom-6 right-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            fill="currentColor"
            className="bi bi-plus-circle-fill"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
          </svg>
        </div>
      </Link>
    </div>
  );
};
export default Feed;

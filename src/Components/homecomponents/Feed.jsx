import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import bg9 from "/bgImg/bg9.jpeg";
import Posts from "../postsComponents/Posts";

const Feed = () => {
  const username = "John Doe";
  return (
    <div className="relative h-screen">
      <div className="fixed top-0 pt-10 bg-white w-full z-10 flex flex-col md:items-center">
        <div className="md:flex md:justify-start w-full md:w-[30%]">
          <Link to="/profile">
            <div className="h-16 items-center flex px-5 gap-7">
              <img src={bg9} className="w-20 h-20 rounded-full" />
              <div className="mt-5">
                <div className="opacity-65 font-medium">Welcome Back</div>
                <div className="font-Lexend font-medium text-xl">
                  {username}
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div className="md:flex md:justify-start w-full md:w-[30%] px-7 mt-[40px] mb-[10px] text-2xl font-semibold font-Lexend">
          Feeds
        </div>
      </div>

      {/* Add padding-top to create space for fixed header */}
      <div className="mt-[50px] pt-[180px] overflow-y-auto flex justify-center">
        <Posts />
      </div>

      <Link to="/newpost">
        <div className="rounded-full h-[60px] w-[60px] fixed z-10 bottom-6 right-6 hover:scale-[90%]">
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

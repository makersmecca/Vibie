import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import bg9 from "/bgImg/bg9.jpeg";
const Profile = () => {
  const username = "New User 1";
  const bio = "Lorem ipsum dolor sit amet consectetur, adipisicing elit";
  return (
    <div className="flex flex-col">
      <Link to="/feed">
        <div className="absolute left-5 top-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="white"
            className="bi bi-arrow-left"
            stroke="white"
            strokeWidth="1"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
            />
          </svg>
        </div>
      </Link>

      {/* profile banner */}
      <div className="flex justify-center">
        <img src={bg9} className="w-full md:w-[50%] h-[150px] rounded-b-2xl" />
      </div>
      {/* profile picture */}
      <div className="absolute top-[13%] md:top-[15%] left-[5%] md:left-[30%]">
        <img src={bg9} className="md:relative w-24 h-24 rounded-full " />
      </div>

      {/* edit profile button */}
      <div className="flex justify-end px-2 w-full md:w-[50%] mt-5 self-center">
        <button className="border-[1px] border-black rounded-2xl w-[60%] md:w-[35%] py-1 text-black">
          Edit Profile
        </button>
      </div>

      {/* username */}
      <div className="self-center w-full md:w-[50%] mt-10 text-3xl font-semibold px-7">
        {username}
      </div>

      {/* bio */}
      <div className="self-center w-full px-7 mt-3">{bio}</div>

      {/* user's posts */}
      <div className="self-center w-full md:w-[50%] mt-6 px-7 text-xl font-normal">
        My Posts
      </div>

      {/* create new post button */}
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
export default Profile;

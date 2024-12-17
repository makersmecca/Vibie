import { useState } from "react";
import bg9 from "/bgImg/bg9.jpeg";
import { Link, useNavigate } from "react-router-dom";
const EditProfile = () => {
  const Navigate = useNavigate();
  const [username, setUserName] = useState("New User 1");
  const [bio, setBio] = useState(
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit"
  );

  const handleEditBanner = () => {
    console.log("editing banner");
  };

  const handleEditDP = () => {
    console.log("Editing DP");
  };

  const handleUsernameInput = (e) => {
    e.preventDefault();
    setUserName(e.target.value);
  };

  const handleBioInput = (e) => {
    e.preventDefault();
    setBio(e.target.value);
  };

  const handleSave = () => {
    //apply update logic
    console.log("Changes Saved!");
    Navigate("/profile");
  };
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
            strokeWidth="1.5"
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
        <div className="relative w-full md:w-[800px]">
          <img
            src={bg9}
            className="w-full md:w-[800px] h-[150px] rounded-b-2xl"
          />
          <div
            onClick={handleEditBanner}
            className="absolute bottom-2 right-2 rounded-full w-[30px] h-[30px] bg-gray-300 flex justify-center items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="currentColor"
              stroke="black"
              strokeWidth="0.5px"
              className="bi bi-pen"
              viewBox="0 0 16 16"
            >
              <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
            </svg>
          </div>
        </div>
      </div>
      {/* profile picture */}
      <div className="absolute top-[13%] md:top-[15%] left-[5%] md:left-[30%]">
        <div className="relative">
          <img src={bg9} className="md:relative w-24 h-24 rounded-full " />
          <div
            onClick={handleEditDP}
            className="absolute bottom-2 right-2 rounded-full w-[30px] h-[30px] bg-gray-300 flex justify-center items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="currentColor"
              className="bi bi-pen"
              stroke="black"
              strokeWidth="0.5px"
              viewBox="0 0 16 16"
            >
              <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
            </svg>
          </div>
        </div>
      </div>
      {/* user's details */}
      <div className="w-full flex flex-col">
        <div className="flex flex-col mt-[100px] self-center w-full md:w-[50%] font-Lexend font-light px-7">
          <label htmlFor="username" className="text-xl">
            Name
          </label>
          <input
            id="username"
            type="text"
            className="border-b-[1px] border-black focus:outline-none"
            value={username}
            onChange={handleUsernameInput}
          />
        </div>
        <div className="flex flex-col mt-[100px] self-center w-full md:w-[50%] font-Lexend font-light px-7">
          <label htmlFor="username" className="text-xl">
            Bio
          </label>
          <textarea
            id="username"
            type="text"
            className="border-b-[1px] border-black focus:outline-none"
            value={bio}
            onChange={handleBioInput}
          />
        </div>
      </div>
      <div className="w-full flex justify-center">
        <button
          className="bg-gray-900 w-[300px] text-white rounded-full py-1.5 fixed bottom-[20px] font-Lexend"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};
export default EditProfile;

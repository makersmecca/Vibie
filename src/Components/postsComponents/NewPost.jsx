// import Navbar from "../Navbar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeviceCamera from "./DeviceCamera";
import { Client, Storage } from "appwrite";
import { v4 as uuidv4 } from "uuid";

const NewPost = () => {
  const [postCaption, setPostCaption] = useState("");
  const [files, setFiles] = useState([]);
  const [apwrtResponse, setApwrtResponse] = useState({
    id: "",
    createdAt: "",
    fileName: "",
  });
  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(`${import.meta.env.VITE_APPWRITE_PROJECT_ID}`);

  const storage = new Storage(client);

  const handlePostCaptionInput = (e) => {
    e.preventDefault();
    setPostCaption(e.target.value);
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);

    const maxFileSize = 25 * 1024 * 1024;

    // Validate file sizes
    const validFiles = selectedFiles.filter((file) => file.size <= maxFileSize);
    const invalidFiles = selectedFiles.filter(
      (file) => file.size > maxFileSize
    );

    if (invalidFiles.length > 0) {
      alert(
        `Some files exceeded the ${
          maxFileSize / (1024 * 1024)
        }MB limit and were excluded.`
      );
    }

    setFiles(validFiles);
    // setStatusMessages([]); // Clear status messages for new file selection
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    const promise = storage.createFile(
      `${import.meta.env.VITE_APPWRITE_BUCKET_ID}`,
      uuidv4(),
      files[0]
    );
    promise.then(
      function (response) {
        console.log(response); // Success
        console.log(response.$id);
        console.log(response.name);
        console.log(response.$createdAt);
        setApwrtResponse((prevState) => ({
          ...prevState,
          id: response.$id,
          createdAt: response.$createdAt,
          fileName: response.name,
        }));
      },
      function (error) {
        console.log(error); // Failure
      }
    );
  };

  useEffect(() => {
    const fileUrl = async () => {
      console.log(apwrtResponse);
      try {
        if (apwrtResponse.id !== "") {
          const res = await storage.getFileDownload(
            `${import.meta.env.VITE_APPWRITE_BUCKET_ID}`,
            apwrtResponse.id
          );
          console.log(res);
          const url = await storage.getFilePreview(
            `${import.meta.env.VITE_APPWRITE_BUCKET_ID}`,
            apwrtResponse.id
          );
          console.log(url);
        } else {
          throw new Error("file not found");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fileUrl();
  }, [apwrtResponse]);

  return (
    <div className="flex flex-col min-h-screen">
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
      <div className="w-full py-5 px-7">
        <label className="flex gap-3 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            className="bi bi-folder-plus"
            viewBox="0 0 16 16"
            stroke="currentColor"
            strokeWidth="0.5px"
          >
            <path d="m.5 3 .04.87a2 2 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14H9v-1H2.826a1 1 0 0 1-.995-.91l-.637-7A1 1 0 0 1 2.19 4h11.62a1 1 0 0 1 .996 1.09L14.54 8h1.005l.256-2.819A2 2 0 0 0 13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2m5.672-1a1 1 0 0 1 .707.293L7.586 3H2.19q-.362.002-.683.12L1.5 2.98a1 1 0 0 1 1-.98z" />
            <path d="M13.5 9a.5.5 0 0 1 .5.5V11h1.5a.5.5 0 1 1 0 1H14v1.5a.5.5 0 1 1-1 0V12h-1.5a.5.5 0 0 1 0-1H13V9.5a.5.5 0 0 1 .5-.5" />
          </svg>
          <span className="font-Lexend">Choose Files</span>
          {/* <span className="">
            {files.length > 0
              ? `${files.length} file(s) selected`
              : "No files selected"}
          </span> */}
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className=" hidden"
            accept=".jpg, .jpeg, .png, .mp4, .mov"
          />
        </label>
      </div>

      {/* use the device's camera to click a picture and upload that photo */}
      <div className="w-full py-5 px-7">
        <DeviceCamera />
      </div>

      <div className="w-full flex justify-center">
        <button
          onClick={handleCreatePost}
          className="bg-gray-900 w-[350px] md:w-[300px] text-white rounded-full py-1.5 fixed bottom-[20px] font-Lexend"
        >
          Create Post
        </button>
      </div>
    </div>
  );
};

export default NewPost;

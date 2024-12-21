// import Navbar from "../Navbar";
import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import DeviceCamera from "./DeviceCamera";
import { Client, Storage } from "appwrite";
import { v4 as uuidv4 } from "uuid";
import { UserContext } from "../UserContext";
import { db } from "../../auth/firebaseAuth";
import { doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const NewPost = () => {
  const Navigate = useNavigate();
  getAuth();
  // const [postCaption, setPostCaption] = useState("");
  const [files, setFiles] = useState([]);
  const [apwrtResponse, setApwrtResponse] = useState({
    id: "",
    createdAt: null,
    fileName: "",
    url: "",
    caption: "",
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  //states to check file uploading and successful post creation
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [displayPopup, setDisplayPopup] = useState(false);

  //current user
  const { currentUser } = useContext(UserContext);

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(`${import.meta.env.VITE_APPWRITE_PROJECT_ID}`);

  const storage = new Storage(client);

  const handlePostCaptionInput = (e) => {
    e.preventDefault();
    // setPostCaption(e.target.value);
    setApwrtResponse((prev) => ({
      ...prev,
      caption: e.target.value,
    }));
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);

    const maxFileSize = 25 * 1024 * 1024;

    // Validate file sizes
    const validFiles = selectedFiles.filter(
      (file) => file.size <= maxFileSize && file.size > 0
    );
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
    // Generate preview for the first valid file
    if (validFiles.length > 0) {
      const file = validFiles[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }

    // setStatusMessages([]); // Clear status messages for new file selection
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (apwrtResponse.caption !== "" && files[0] !== null) {
      setIsLoading(true);
      setDisplayPopup(true);
      setUploadStatus("Uploading");
    }
    const promise = storage.createFile(
      `${import.meta.env.VITE_APPWRITE_BUCKET_ID}`,
      uuidv4(),
      files[0]
    );
    promise
      .then((response) => {
        setIsLoading(false);
        setUploadStatus(
          <div className="flex items-center gap-4">
            <span>Uploaded Successfully!</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              className="bi bi-check2-circle"
              viewBox="0 0 16 16"
            >
              <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0" />
              <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
            </svg>
          </div>
        );
        setTimeout(() => {
          setDisplayPopup(false);
          Navigate("/profile");
        }, [1000]);
        // console.log(response); // Success
        // console.log(response.$id);
        // console.log(response.name);
        // console.log(response.$createdAt);
        setApwrtResponse((prevState) => ({
          ...prevState,
          id: response.$id,
          createdAt: response.$createdAt,
          fileName: response.name,
        }));
      })
      .catch((error) => {
        setIsLoading(false);
        setUploadStatus("Uh Oh! Something went wrong");
        setTimeout(() => {
          setDisplayPopup(false);
        }, [1000]);
        console.log(error); // Failure
      });
  };

  const updateFireStore = async () => {
    // console.log("UPDATEFIRESTORE");
    if (apwrtResponse.id !== "") {
      try {
        // Update global posts
        await setDoc(doc(db, "globalPosts", apwrtResponse.id), {
          mediaUrl: String(apwrtResponse.url),
          caption: String(apwrtResponse.caption),
          createdAt: new Date(apwrtResponse.createdAt),
          userId: String(currentUser.email),
          likeCount: Number(0),
          likedBy: [],
        });

        // Update user posts
        await setDoc(
          doc(db, "userPosts", currentUser.email, "posts", apwrtResponse.id),
          {
            mediaUrl: String(apwrtResponse.url),
            caption: String(apwrtResponse.caption),
            createdAt: new Date(apwrtResponse.createdAt),
            userId: String(currentUser.email),
            likeCount: Number(0),
            likedBy: [],
          }
        );
      } catch (error) {
        console.error("Error updating Firestore:", error);
        // Handle the error appropriately - maybe show a user notification
      }
    }
  };

  useEffect(() => {
    const fileUrl = async () => {
      // console.log(apwrtResponse);
      try {
        if (apwrtResponse.id !== "") {
          const url = await storage.getFilePreview(
            `${import.meta.env.VITE_APPWRITE_BUCKET_ID}`,
            apwrtResponse.id
          );
          setApwrtResponse((prevState) => ({
            ...prevState,
            url: url.href,
          }));
          // console.log(url.href);
        } else {
          throw new Error("file not found");
        }
      } catch (error) {
        // console.log(error);
      }
    };

    fileUrl();
  }, [apwrtResponse.id]);

  useEffect(() => {
    // console.log(apwrtResponse);
    updateFireStore();
  }, [apwrtResponse]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="py-5 px-5 left-5 top-6 flex items-center gap-5">
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
      <div className="bg-gray-200 mt-10 h-auto w-[90%] md:w-[800px] rounded-2xl p-4 self-center">
        {previewUrl && (
          <div className="w-full flex justify-center self-center mb-10 mt-5">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-[80%] h-[80%] rounded-lg"
            />
          </div>
        )}
        <textarea
          className="flex justify-center items-start h-full w-full rounded-2xl bg-gray-200 ring-none border-none px-5 py-2"
          placeholder="What's on your mind today?"
          value={apwrtResponse.caption}
          onChange={handlePostCaptionInput}
          rows="4"
        />
      </div>
      {/* upload image/video from device */}
      <div className="w-full py-5 px-7 mt-9 md:w-[800px] self-center">
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
            onChange={handleFileChange}
            className=" hidden"
            accept=".jpg, .jpeg, .png"
          />
        </label>
      </div>

      {/* use the device's camera to click a picture and upload that photo */}
      <div className="w-full py-5 px-7 md:w-[800px] self-center">
        <DeviceCamera />
      </div>

      {displayPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-slate-300 w-[80%] max-w-md h-[100px] p-5 rounded-xl flex items-center justify-center">
            <div className="flex items-center gap-2">
              <span className="font-Lexend">{uploadStatus}</span>
              {isLoading && (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-gray-900 rounded-full border-t-transparent"></div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
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

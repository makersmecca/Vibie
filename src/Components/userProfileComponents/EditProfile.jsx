import { useState, useContext, useEffect } from "react";
// import bg9 from "/bgImg/bg9.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../auth/firebaseAuth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserContext } from "../UserContext";
import person from "/profile.png";
import { getAuth } from "firebase/auth";
import { Client, Storage } from "appwrite";
import { v4 as uuidv4 } from "uuid";

const EditProfile = () => {
  getAuth();
  const { currentUser } = useContext(UserContext);
  const Navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const [bannerImgUrl, setBannerImgUrl] = useState("");
  const [bannerFile, setBannerFile] = useState([]);
  const [profileFile, setProfileFile] = useState([]);
  const [profilePreview, setProfilePreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const [btnMsg, setBtnMsg] = useState("Update");

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(`${import.meta.env.VITE_APPWRITE_PROJECT_ID}`);

  const storage = new Storage(client);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser?.email) {
          const userDocRef = doc(db, "users", currentUser.email);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUsername(
              userData.username === ""
                ? currentUser.displayName
                : userData.username
            );
            setBio(userData.bio);
            setProfileImgUrl(
              userData.profileImgUrl === "" ? person : userData.profileImgUrl
            );
            setBannerImgUrl(userData.bannerImgUrl);
          } else {
            console.log("No such document!");
            setUsername(currentUser.displayName);
            setBio("");
            setProfileImgUrl(person);
            setBannerImgUrl("");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleEditDP = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const maxFileSize = 10 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    // Validate file sizes
    const validFiles = selectedFiles.filter(
      (file) =>
        file.size <= maxFileSize &&
        file.size > 0 &&
        allowedTypes.includes(file.type)
    );
    const invalidFiles = selectedFiles.filter(
      (file) =>
        file.size > maxFileSize ||
        file.size <= 0 ||
        !allowedTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      alert(
        `Please ensure:\n` +
          `- File size is under ${maxFileSize / (1024 * 1024)}MB\n` +
          `- File type is JPG, JPEG, or PNG`
      );
    }

    // Create preview for valid file
    if (validFiles.length > 0) {
      const file = validFiles[0];
      const previewUrl = URL.createObjectURL(file);
      setProfilePreview(previewUrl);
    }

    setProfileFile(validFiles);
  };

  const handleEditBanner = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const maxFileSize = 15 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    // Validate file sizes
    const validFiles = selectedFiles.filter(
      (file) =>
        file.size <= maxFileSize &&
        file.size > 0 &&
        allowedTypes.includes(file.type)
    );
    const invalidFiles = selectedFiles.filter(
      (file) =>
        file.size > maxFileSize ||
        file.size <= 0 ||
        !allowedTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      alert(
        `Please ensure:\n` +
          `- File size is under ${maxFileSize / (1024 * 1024)}MB\n` +
          `- File type is JPG, JPEG, or PNG`
      );
    }

    // Create preview for valid file
    if (validFiles.length > 0) {
      const file = validFiles[0];
      const previewUrl = URL.createObjectURL(file);
      setBannerPreview(previewUrl);
    }

    setBannerFile(validFiles);
  };

  const handlePhotoStorage = async () => {
    try {
      let newProfileUrl = profileImgUrl; // Keep existing URL if no new file
      let newBannerUrl = bannerImgUrl; // Keep existing URL if no new file

      // Upload profile photo if selected
      if (profileFile.length > 0) {
        const profileFileId = uuidv4();
        await storage.createFile(
          `${import.meta.env.VITE_APPWRITE_BUCKET_ID}`,
          profileFileId,
          profileFile[0]
        );

        // Get the URL for the uploaded profile photo
        const profileUrl = storage.getFileView(
          `${import.meta.env.VITE_APPWRITE_BUCKET_ID}`,
          profileFileId
        );
        newProfileUrl = profileUrl.href;
      }

      // Upload banner photo if selected
      if (bannerFile.length > 0) {
        const bannerFileId = uuidv4();
        await storage.createFile(
          `${import.meta.env.VITE_APPWRITE_BUCKET_ID}`,
          bannerFileId,
          bannerFile[0]
        );

        // Get the URL for the uploaded banner photo
        const bannerUrl = storage.getFileView(
          `${import.meta.env.VITE_APPWRITE_BUCKET_ID}`,
          bannerFileId
        );
        newBannerUrl = bannerUrl.href;
      }

      // Update Firestore with new URLs
      await setDoc(
        doc(db, "users", currentUser.email),
        {
          username: username,
          bio: bio,
          profileImgUrl: newProfileUrl,
          bannerImgUrl: newBannerUrl,
        },
        { merge: true }
      ); // Add merge: true to preserve other fields

      // Update state after successful upload and database update
      setProfileImgUrl(newProfileUrl);
      setBannerImgUrl(newBannerUrl);

      console.log("Photos uploaded and database updated successfully!");
      //cleanup
      if (profilePreview) {
        URL.revokeObjectURL(profilePreview);
        setProfilePreview(null);
      }
      if (bannerPreview) {
        URL.revokeObjectURL(bannerPreview);
        setBannerPreview(null);
      }

      return { profileImgUrl: newProfileUrl, bannerImgUrl: newBannerUrl };
    } catch (error) {
      console.error("Error uploading photos:", error);
      throw error;
    }
  };

  const handleSave = async () => {
    setBtnMsg("Updating...");
    try {
      await handlePhotoStorage();
      console.log("Changes Saved!");
      Navigate("/profile");
    } catch (error) {
      console.error("Error saving changes:", error);
      setBtnMsg("Update");
    }
  };

  const handleUsernameInput = (e) => {
    e.preventDefault();
    setUsername(e.target.value.trim());
  };

  const handleBioInput = (e) => {
    e.preventDefault();
    setBio(e.target.value);
  };

  // Cleanup function to revoke object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (profilePreview) {
        URL.revokeObjectURL(profilePreview);
      }
      if (bannerPreview) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, []);

  return (
    <div className="flex flex-col">
      {/* profile banner */}
      <div className="flex justify-center">
        <div className="relative w-full md:w-[800px]">
          <Link to="/profile">
            <div className="absolute left-5 top-6 z-10 bg-gray-700 bg-opacity-70 rounded-full w-[35px] h-[35px] flex justify-center items-center">
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
          <div
            className={`bg-gray-400 rounded-b-2xl ${
              bannerImgUrl === "" ? "w-full md:w-[800px] h-[150px]" : ""
            }`}
          >
            <img
              src={bannerPreview || bannerImgUrl}
              className="w-full md:w-[800px] h-[150px] rounded-b-2xl object-cover"
            />
          </div>
          <label
            // onClick={handleEditBanner}
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
            <input
              type="file"
              onChange={handleEditBanner}
              className=" hidden"
              accept=".jpg, .jpeg, .png"
            />
          </label>
        </div>
      </div>
      {/* profile picture */}
      <div className="absolute top-[13%] md:top-[15%] left-[5%] md:left-[30%]">
        <div className="relative">
          <img
            src={profilePreview || profileImgUrl}
            className="md:relative w-24 h-24 rounded-full bg-white object-cover"
          />
          <label className="absolute bottom-2 right-2 rounded-full w-[30px] h-[30px] bg-gray-300 flex justify-center items-center">
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
            <input
              type="file"
              onChange={handleEditDP}
              className=" hidden"
              accept=".jpg, .jpeg, .png"
            />
          </label>
        </div>
      </div>
      {/* user's details */}
      <div className="w-full md:w-[800px] flex flex-col self-center">
        <div className="flex flex-col mt-[100px] md:mt-[150px] self-center w-full md:w-[600px] font-Lexend font-light px-7">
          <label htmlFor="username" className="text-xl">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="border-b-[1px] border-black focus:outline-none"
            value={username}
            onChange={handleUsernameInput}
          />
        </div>
        <div className="flex flex-col mt-[100px] self-center w-full md:w-[600px] font-Lexend font-light px-7">
          <label htmlFor="username" className="text-xl">
            Bio
          </label>
          <textarea
            id="username"
            type="text"
            className="border-b-[1px] border-black focus:outline-none"
            value={bio}
            onChange={handleBioInput}
            rows="2"
          />
        </div>
      </div>
      <div className="w-full flex justify-center">
        <button
          className={`bg-gray-900 w-[300px] text-white rounded-full py-1.5 fixed bottom-[20px] font-Lexend ${
            btnMsg === "Updating..." && "animate-pulse"
          }`}
          onClick={handleSave}
        >
          {btnMsg}
        </button>
      </div>
    </div>
  );
};
export default EditProfile;

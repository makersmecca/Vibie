import { Link } from "react-router-dom";
import ThemeSwitchButton from "../sharedComponents/ThemeSwitchButton";
import { auth } from "../../auth/firebaseAuth";
import { useNavigate } from "react-router-dom";

const ProfileSettings = () => {
  const Navigate = useNavigate();
  const handleLogOut = () => {
    auth
      .signOut()
      .then(() => {
        Navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <>
      <div className="flex flex-col w-full h-screen md:items-center dark:bg-gray-900 dark:text-white">
        <div className="w-full ps-3 pe-10 py-5 text-3xl bg-gray-200 dark:bg-black flex justify-between items-center align-middle">
          <div className="text-xl flex items-center justify-center align-middle gap-5">
            <Link to="/profile">
              <div className="bg-gray-500 bg-opacity-70 rounded-full w-[35px] h-[35px] flex justify-center items-center hover:-translate-x-1 transition-all ease-in-out">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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
            <div>Settings</div>
          </div>
          <Link to="/" className="font-Pacifico">
            Vibie
          </Link>
        </div>

        {/* Settings Options */}
        <div className="w-full max-w-2xl px-6 py-8">
          <div className="flex flex-col space-y-6">
            {/* Theme Section */}
            <div className="flex flex-col space-y-3">
              <h2 className="text-lg font-semibold">Theme</h2>
              <div className="flex gap-4 w-[100%]">
                <div className="flex w-[100%] items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-500 rounded-md transition-colors">
                  <div>Set theme</div>
                  <div>
                    <ThemeSwitchButton size="sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="flex flex-col space-y-4">
              <h2 className="text-lg font-semibold">Account</h2>
              <Link
                to="/forgotpassword"
                className="px-4 py-3 hover:bg-gray-100 rounded-md transition-colors"
              >
                Change Password
              </Link>
              <button
                onClick={handleLogOut}
                className="px-4 py-3 text-left text-red-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                Log Out
              </button>
            </div>

            {/* Legal */}
            <div className="flex flex-col space-y-4">
              <h2 className="text-lg font-semibold">Legal</h2>
              <Link
                to="/terms"
                className="px-4 py-3 hover:bg-gray-100 rounded-md transition-colors"
              >
                Terms of Use
              </Link>
              <Link
                to="/privacypolicy"
                className="px-4 py-3 hover:bg-gray-100 rounded-md transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/aboutus"
                className="px-4 py-3 hover:bg-gray-100 rounded-md transition-colors"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSettings;

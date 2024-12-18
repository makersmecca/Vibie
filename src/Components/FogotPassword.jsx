import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const Navigate = useNavigate();

  const handleFormInput = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(e);
    // console.log(email);
    await sendPasswordResetEmail(getAuth(), email)
      .then(() => {
        setEmail("");
        setErrorMsg("Password reset email sent!");
        // Navigate("/");
      })
      .catch((err) => {
        console.log(err);
        switch (err.message) {
          case "Firebase: Error (auth/invalid-email).":
            setErrorMsg("Oops! This Email is not valid!");
            break;
          default:
            setErrorMsg("Uh Oh! Something went wrong!");
        }
      });
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="fixed top-0 pt-10 bg-white w-full z-10 flex flex-col md:items-center ps-4">
        <div className="flex items-center w-full md:w-[30%] gap-3">
          <Link to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              className="bi bi-arrow-left"
              viewBox="0 0 16 16"
              stroke="currentcolor"
              strokeWidth="0.5px"
            >
              <path
                fillRule="evenodd"
                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
              />
            </svg>
          </Link>
          <div className="text-2xl font-Lexend font-semibold pb-0.5">
            Forgot Password
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center bg-slate-200 h-[200px] w-[350px] px-5 rounded-xl pt-5">
        <span className="text-xl font-Lexend font-medium">
          Forgot Your Password?
        </span>
        <form className="flex flex-col self-center gap-3 w-full mt-5">
          <div className="flex flex-col w-full">
            <label
              htmlFor="email"
              className="block mb-2 text-lg font-medium ms-1"
            >
              Enter Your Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="vibetribe@social.com"
              className="rounded-lg block w-full p-2 bg-slate-100"
              onChange={handleFormInput}
              value={email}
            />
          </div>
        </form>
        <span className="mt-4 font-Lexend text-md">{errorMsg}</span>
      </div>
      <div className="absolute bottom-[20px] w-full flex justify-center">
        <button
          onClick={handleSubmit}
          className="bg-gray-900 w-[350px] md:w-[300px] text-white rounded-full py-1.5 font-Lexend"
        >
          Send Password Reset Link
        </button>
      </div>
    </div>
  );
};
export default ForgotPassword;

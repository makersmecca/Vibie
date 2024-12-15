import { use } from "react";
import { useState, useEffect } from "react";
const Authentication = () => {
  const [formInput, setFormInput] = useState({
    emailId: "",
    password: "",
  });
  const [ErrorMsg, setErrorMsg] = useState("");
  const [btnMsg, setBtnMsg] = useState("Login");

  const showPw = false;
  const handleInput = () => {};
  const handleShowPW = () => {};
  const handleSubmit = () => {};

  return (
    <>
      <form className="flex flex-col items-start w-full gap-3 mt-4">
        <div className="w-full">
          <label htmlFor="emailId" className="block mb-2 text-lg font-medium">
            Your Email
          </label>
          <input
            onChange={handleInput}
            id="uName"
            type="text"
            name="emailId"
            className="rounded-lg block w-full p-2"
            placeholder="focusing@pomodoro.study"
            value={formInput.emailId}
            required
          />
        </div>
        <div className="w-full">
          <label htmlFor="password" className="block mb-2 text-lg font-medium">
            Password
          </label>

          <span className="flex flex-row items-center gap-3">
            <input
              onChange={handleInput}
              id="pw"
              type={showPw ? "text" : "password"}
              name="password"
              className="rounded-lg p-2 w-11/12"
              placeholder="shh.. secret"
              value={formInput.password}
              required
            />

            <button type="button" onClick={handleShowPW} className="ms-1">
              {showPw ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  className="bi bi-eye-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  className="bi bi-eye-slash-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                  <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                </svg>
              )}
            </button>
          </span>
        </div>
        {location === "/LogIn" ? (
          <Link to="/ForgotPassword">Forgot password?</Link>
        ) : (
          <div className="my-3"></div>
        )}
        <span
          className={`${
            ErrorMsg === "" ? "my-2.5" : "my-0"
          } text-sm text-red-400`}
        >
          {ErrorMsg}
        </span>
        <div className="flex self-center w-full">
          <button
            type="submit"
            className="w-full bg-buttonColor text-white rounded-lg p-2 font-semibold"
            onClick={handleSubmit}
          >
            {/* {location === "/LogIn" ? "Log In" : "Sign Up"} */}
            {btnMsg}
          </button>
        </div>
      </form>
    </>
  );
};

export default Authentication;

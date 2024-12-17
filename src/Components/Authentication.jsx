import { useNavigate } from "react-router-dom";
import BackgroundImages from "./BackgroundImages";
import { useState } from "react";
const Authentication = () => {
  const [formInput, setFormInput] = useState({
    username: "",
    password: "",
  });

  const [showPw, setShowPw] = useState(false);

  const Navigate = useNavigate();

  const handleFormInput = (e) => {
    e.preventDefault();
    setFormInput({ ...formInput, [e.target.name]: e.target.value });
  };
  const handleLogin = (e) => {
    e.preventDefault();
    Navigate("/feed");
  };

  const handleShowPw = (e) => {
    e.preventDefault();
    setShowPw((prevState) => !prevState);
  };
  return (
    <>
      <BackgroundImages />
      <div className="flex justify-center">
        <div className="fixed bottom-0 bg-white border-black md:w-[40%] w-full md:h-[80%] h-[70%] rounded-t-[50px]">
          <span className="flex flex-col items-center w-full font-Pacifico text-[50px] mt-5 md:mt-12">
            Vibesnap
          </span>
          <span className="flex flex-col items-center w-full mt-3 font-Hurricane text-[32px]">
            Join the #vibetribe
          </span>
          <form className="flex flex-col w-full gap-3 mt-5 md:mt-20 items-center">
            <div className="flex flex-col w-[90%] md:w-[70%]">
              <label htmlFor="email" className="block mb-2 text-lg font-medium">
                Your Email
              </label>
              <input
                type="email"
                placeholder="vibetribe@social.com"
                className="rounded-lg block w-full p-2 bg-slate-100"
                name="username"
                onChange={handleFormInput}
                value={formInput.username}
              />
            </div>
            <div className="flex flex-col w-[90%] md:w-[70%]">
              <label
                htmlFor="password"
                className="block mb-2 text-lg font-medium"
              >
                Your Password
              </label>
              <div className="flex">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="password"
                  className="rounded-s-lg block w-full p-2 bg-slate-100"
                  name="password"
                  onChange={handleFormInput}
                  value={formInput.password}
                />
                <button
                  type="button"
                  className="inline-flex items-center px-3 text-sm border rounded-e-lg bg-slate-600"
                  onClick={handleShowPw}
                >
                  {showPw ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="white"
                      className="bi bi-eye-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="white"
                      className="bi bi-eye-slash-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                      <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <span className="mt-4 w-[90%] md:w-[70%]">Forgot Password?</span>
            <button
              type="submit"
              className="bg-slate-600 w-[90%] md:w-[70%] rounded-lg p-2 font-medium mt-4 text-white"
              onClick={handleLogin}
            >
              Log In
            </button>
          </form>
          <div className="flex flex-row items-center font-semibold mt-4">
            <div className="w-[30%] h-px mx-auto mt-1 me-3 bg-black border-0 rounded"></div>{" "}
            or{" "}
            <div className="w-[30%] h-px mx-auto mt-1 ms-3 bg-black border-0 rounded"></div>
          </div>
          <button
            type="button"
            className="flex justify-self-center items-center justify-center bg-slate-600 w-[90%] md:w-[70%] rounded-lg p-2 font-medium mt-4 text-white"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </>
  );
};

export default Authentication;

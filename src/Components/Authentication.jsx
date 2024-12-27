import BackgroundImages from "./BackgroundImages";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../auth/firebaseAuth";
const provider = new GoogleAuthProvider();

const Authentication = () => {
  const activeUser = useContext(UserContext);
  const location = useLocation().pathname;
  const [formInput, setFormInput] = useState({
    username: "",
    password: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [btnMsg, setBtnMsg] = useState("");
  const [googleBtnMsg, setGoogleBtnMsg] = useState(
    <div className="flex items-center gap-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-google"
        viewBox="0 0 16 16"
      >
        <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
      </svg>
      <span>Continue With Google</span>
    </div>
  );
  const Navigate = useNavigate();

  // effect hook to redirect user to feed page if already logged in
  useEffect(() => {
    // console.log(auth.currentUser);
    if (auth.currentUser !== null) {
      Navigate("/feed");
    }
  }, [auth.currentUser, activeUser]);

  useEffect(() => {
    if (location === "/") {
      setBtnMsg("Log In");
    } else {
      setBtnMsg("Sign Up");
    }
    setErrorMsg("");
  }, [location]);

  const handleFormInput = (e) => {
    e.preventDefault();
    setFormInput({ ...formInput, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    location === "/" ? handleLogin(e) : handleSignUp(e);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log("sign up");
    setBtnMsg(
      <>
        <div className="flex justify-center items-center">
          <span className="me-5 animate-pulse">Signing Up</span>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </>
    );
    await createUserWithEmailAndPassword(
      auth,
      formInput.username,
      formInput.password
    )
      .then((usercredential) => {
        // const user = usercredential.user;
        // console.log(user);
        emailverifcationsent();
        setErrorMsg("Verification Email sent!");
        setFormInput({ username: "", password: "" });
        signOut(auth).then(() => Navigate("/"));
      })
      .catch((error) => {
        console.log(error.message);
        setBtnMsg("Sign Up");
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        if (errorCode == "auth/email-already-in-use") {
          setErrorMsg("Email is already in use. Sign in to continue");
          setBtnMsg("Sign Up");
        } else if (errorCode == "auth/invalid-email") {
          setBtnMsg("Sign Up");
          setErrorMsg("Invalid Email Address!");
        }
      });
  };

  const emailverifcationsent = async () => {
    await sendEmailVerification(auth.currentUser).then(() => {
      // setErrorMsg("Verification Email sent!");
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (formInput.username === "" || formInput.password === "") {
      setErrorMsg("Please Enter Credentials");
      return;
    } else {
      setBtnMsg(
        <>
          <div className="flex justify-center items-center">
            <span className="me-5 animate-pulse">Logging In</span>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </>
      );
      await signInWithEmailAndPassword(
        auth,
        formInput.username,
        formInput.password
      )
        .then((userCredential) => {
          return auth.currentUser.reload();
        })
        .then(() => {
          // const user = userCredential.user;
          // console.log(user);
          // console.log(auth.currentUser.emailVerified);
          if (auth.currentUser.emailVerified) {
            setFormInput({ username: "", password: "" });
            setErrorMsg("Logging you in..");
            Navigate("/feed");
          } else {
            setErrorMsg("Please Verify Your Email ID");
            signOut(auth).then(() => Navigate("/"));
            setBtnMsg("Log In");
            emailverifcationsent();
          }
        })
        .catch((err) => {
          setBtnMsg("Log In");
          console.log(err.message);
          switch (err.message) {
            case "Firebase: Error (auth/invalid-email).":
              setErrorMsg("Invalid Email");
              setBtnMsg("Log In");
              break;
            case "Firebase: Error (auth/missing-password).":
              setErrorMsg("Invalid Password");
              setBtnMsg("Log In");
              break;
            case "Firebase: Error (auth/invalid-credential).":
              setErrorMsg("Wrong Password");
              setBtnMsg("Log In");
              break;
            case "Firebase: Error (auth/user-not-found).":
              setErrorMsg("User not found");
              setBtnMsg("Log In");
              break;
            default:
              setErrorMsg("Something went wrong");
              setBtnMsg("Log In");
              break;
          }
        });
    }
  };

  const handleGoogleSignin = () => {
    setGoogleBtnMsg(
      <div className="flex justify-center items-center">
        <span className="me-5 animate-pulse">Working Google Magic</span>
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
    signInWithPopup(auth, provider)
      .then((result) => {
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // const user = result.user;
        Navigate("/feed");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const handleShowPw = (e) => {
    e.preventDefault();
    setShowPw((prevState) => !prevState);
  };

  return (
    <>
      <div className="fixed inset-0">
        <BackgroundImages />
      </div>
      {/* Authentication ui */}
      <div className="absolute inset-x-0 top-[20%] md:top-[5%] h-full flex justify-center">
        <div className="bg-white border-black md:w-[40%] w-[90%] sm:h-[800px] h-full rounded-t-[50px] lg:rounded-b-[50px] shadow-lg py-8 px-4">
          <span className="flex flex-col items-center w-full font-Pacifico text-[50px] xl:mt-12">
            Vibie
          </span>
          <span className="flex flex-col items-center w-full mt-3 font-Hurricane text-[32px] font-medium">
            Join the #vibetribe
          </span>
          <form className="flex flex-col w-full gap-3 mt-2 md:mt-10 items-center">
            <div className="flex flex-col w-[90%] md:w-[70%]">
              <label htmlFor="email" className="block mb-2 text-lg font-medium">
                Your Email
              </label>
              <input
                type="email"
                placeholder="vibetribe@social.com"
                className="rounded-lg block w-full p-2 bg-slate-100"
                name="username"
                id="email"
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
            <span>{errorMsg}</span>
            {location === "/" ? (
              <span className="mt-1 w-[90%] md:w-[70%] underline">
                <Link to="/forgotpassword">Forgot Password? </Link>
              </span>
            ) : (
              <div className="my-5"></div>
            )}
            <button
              type="submit"
              className="bg-slate-600 w-[90%] md:w-[70%] rounded-lg p-2 font-medium mt-4 text-white"
              onClick={handleSubmit}
            >
              {/* {location === "/signup" ? "Sign Up" : "Login"} */}
              {btnMsg}
            </button>
          </form>
          <div className="flex flex-row items-center font-semibold mt-4">
            <div className="w-[30%] h-px mx-auto mt-1 me-3 bg-black border-0 rounded"></div>{" "}
            or{" "}
            <div className="w-[30%] h-px mx-auto mt-1 ms-3 bg-black border-0 rounded"></div>
          </div>
          <div className="flex flex-col items-center">
            <button
              type="button"
              className="bg-slate-600 w-[90%] md:w-[70%] rounded-lg p-2 font-medium mt-4 text-white flex justify-center"
              onClick={handleGoogleSignin}
            >
              {googleBtnMsg}
            </button>
          </div>

          <span className="mt-5 flex flex-col items-center underline">
            {location === "/" ? (
              <Link to="/signup">Don't have an account? Sign up.</Link>
            ) : (
              <Link to="/">Already have an account? Login.</Link>
            )}
          </span>
          <div className="flex flex-col xl:flex-row items-center xl:justify-center mt-4 md:mt-8 px-2 gap-2 xl:gap-6">
            <div className="">©2024 Copyright Vibie</div>
            <div className="flex justify-evenly self-center gap-1 md:gap-2">
              <div className="underline">
                <Link to="/termsofuse">Terms of Use</Link>
              </div>
              <div className="underline">
                <Link to="/privacypolicy">Privacy Policy</Link>
              </div>
              <div className="underline">
                <Link to="/aboutus">About Us</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Authentication;

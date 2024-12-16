import BackgroundImages from "./BackgroundImages";
const Authentication = () => {
  return (
    <>
      <BackgroundImages />
      <div className="flex justify-center">
        <div className="fixed bottom-0 bg-white border-black md:w-[40%] w-full md:h-[80%] h-[60%] rounded-t-[60px] md:rounded-t-[50px]">
          <span className="flex flex-col items-center w-full font-semibold text-2xl mt-8 md:mt-12">
            Heading Text Here
          </span>
          <form className="flex flex-col w-full gap-3 mt-7 md:mt-20 items-center">
            <div className="flex flex-col w-[90%] md:w-[70%]">
              <label htmlFor="email" className="block mb-2 text-lg font-medium">
                Your Email
              </label>
              <input
                type="email"
                placeholder="vibetribe@social.com"
                className="rounded-lg block w-full p-2 bg-slate-100"
              />
            </div>
            <div className="flex flex-col w-[90%] md:w-[70%]">
              <label
                htmlFor="password"
                className="block mb-2 text-lg font-medium"
              >
                Your Password
              </label>
              <input
                type="password"
                placeholder="password"
                className="rounded-lg block w-full p-2 bg-slate-100"
              />
            </div>
            <span className="mt-4 w-[90%] md:w-[70%]">Forgot Password?</span>
            <button
              type="submit"
              className="bg-red-300 w-[90%] md:w-[70%] rounded-lg p-2 font-medium mt-4"
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
            className="flex justify-self-center items-center justify-center bg-red-300 w-[90%] md:w-[70%] rounded-lg p-2 font-medium mt-4"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </>
  );
};

export default Authentication;

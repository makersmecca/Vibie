import { Link } from "react-router-dom";
const NewPostButton = () => {
  return (
    <Link to="/newpost">
      <div className="flex justify-center items-center rounded-full bg-white h-[52px] w-[52px] fixed z-10 bottom-6 right-6 bg-opacity-75 hover:scale-95">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          fill="currentColor"
          className="bi bi-plus-circle-fill"
          viewBox="0 0 16 16"
        >
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
        </svg>
      </div>
    </Link>
  );
};

export default NewPostButton;

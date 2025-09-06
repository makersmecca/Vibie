// import { Link } from "react-router-dom";

// //  ____  _____ ____  ____  _____ ____    _  _____ _____ ____
// // |  _ \| ____|  _ \|  _ \| ____/ ___|  / \|_   _| ____|  _ \
// // | | | |  _| | |_) | |_) |  _|| |     / _ \ | | |  _| | | | |
// // | |_| | |___|  __/|  _ <| |__| |___ / ___ \| | | |___| |_| |
// // |____/|_____|_|   |_| \_\_____\____/_/   \_\_| |_____|____/

// const Navbar = ({ componentName }) => {
//   return (
//     <div>
//       <div className="fixed bottom-0 bg-red-100 flex justify-between w-full px-5 py-2 items-center">
//         {/* FEED */}
//         <Link to="/feed">
//           <div
//             className={`cursor-pointer ${
//               componentName === "feed" ? "opacity-100" : "opacity-75"
//             }`}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="35"
//               height="35"
//               fill="currentColor"
//               className="bi bi-house-fill"
//               viewBox="0 0 16 16"
//             >
//               <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z" />
//               <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z" />
//             </svg>
//           </div>
//         </Link>
//         {/* new post */}
//         <Link to="/newpost">
//           <div
//             className={`cursor-pointer ${
//               componentName === "newpost" ? "opacity-100" : "opacity-75"
//             }`}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="30"
//               height="30"
//               fill="currentColor"
//               className="bi bi-plus-square-fill"
//               viewBox="0 0 16 16"
//             >
//               <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0" />
//             </svg>
//           </div>
//         </Link>

//         {/* ____  _____ ____  ____  _____ ____    _  _____ _____ ____
//         // |  _ \| ____|  _ \|  _ \| ____/ ___|  / \|_   _| ____|  _ \
//         // | | | |  _| | |_) | |_) |  _|| |     / _ \ | | |  _| | | | |
//         // | |_| | |___|  __/|  _ <| |__| |___ / ___ \| | | |___| |_| |
//         // |____/|_____|_|   |_| \_\_____\____/_/   \_\_| |_____|____/ */}

//         {/* profile */}
//         <Link to="/profile">
//           <div
//             className={`cursor-pointer ${
//               componentName === "profile" ? "opacity-100" : "opacity-75"
//             }`}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="35"
//               height="35"
//               fill="currentColor"
//               className="bi bi-person-fill"
//               viewBox="0 0 16 16"
//             >
//               <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
//             </svg>
//           </div>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Navbar;

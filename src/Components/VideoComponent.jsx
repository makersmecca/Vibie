import { useRef, useCallback, useEffect } from "react";
import useIntersectionObserver from "./hooks/useIntersectionObserver";
const VideoComponent = ({ videoUrl }) => {
  const videoRef = useRef(null);

  const handleVideoInView = useCallback((isIntersecting) => {
    if (videoRef.current) {
      if (isIntersecting) {
        // playVideo
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Autoplay prevented:", error);
          });
        }
      } else {
        //pauseVideo
        videoRef.current.pause();
      }
    }
  }, []);

  const intersectionRef = useIntersectionObserver(handleVideoInView, {
    threshold: 0.5,
  });

  //load video when mounted
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [videoUrl]);

  return (
    <div ref={intersectionRef}>
      <video
        controls
        ref={videoRef}
        playsInline
        muted
        loop
        className="rounded-xl w-full self-center"
        src={videoUrl}
      >
        <source src={videoUrl} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoComponent;

import { useState, useRef, useEffect } from "react";

const DeviceCamera = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [files, setFiles] = useState([]); // Add this state for files
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    return () => {
      // Cleanup: stop camera when component unmounts
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      console.log("Starting camera...");
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      console.log("Got media stream:", mediaStream);
      setStream(mediaStream);
      setShowCamera(true);

      if (videoRef.current) {
        console.log("Setting video source...");
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded, playing...");
          videoRef.current.play();
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access camera");
    }
  };

  // Function to capture photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const file = new File([blob], "camera-photo.jpg", {
          type: "image/jpeg",
        });
        setFiles((prev) => [...prev, file]); // This will now work
      }, "image/jpeg");

      stopCamera();
    }
  };

  // Function to stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  return (
    <>
      {/* Camera section */}
      <button onClick={startCamera} className="flex gap-3 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          className="bi bi-camera"
          stroke="currentColor"
          strokeWidth="0.5px"
          viewBox="0 0 16 16"
        >
          <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z" />
          <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" />
        </svg>
        <span className="font-Lexend">Camera</span>
      </button>

      {/* Camera preview */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-[90vw] max-h-[90vh]">
            {" "}
            {/* Add max dimensions */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="rounded-lg w-[640px] h-[480px] object-contain" // Add object-contain
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={capturePhoto}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Capture
              </button>
              <button
                onClick={stopCamera}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default DeviceCamera;

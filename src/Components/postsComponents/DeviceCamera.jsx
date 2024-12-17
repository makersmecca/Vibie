import React, { useRef, useState, useEffect } from "react";

const DeviceCamera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [openCamera, setOpenCamera] = useState(false);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Start the camera
  const startCamera = async () => {
    setOpenCamera((prev) => !prev);
    try {
      const MediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      videoRef.current.srcObject = MediaStream;
      setStream(MediaStream);
    } catch (error) {
      console.error("Error accessing camera: ", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      // Stop all tracks in the stream
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());

      // Reset all states and video source
      videoRef.current.srcObject = null;
      setStream(null);
      setOpenCamera(false);
      setImageFile(null);
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const file = new File([blob], "captured_image.png", {
        type: "image/png",
      });

      setImageFile(file);
    }, "image/png");
  };

  return (
    <div className="">
      <div onClick={openCamera ? stopCamera : startCamera} className="">
        <span className="font-Lexend">
          {openCamera ? (
            <div className="flex gap-3 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-x-lg"
                stroke="currentColor"
                strokeWidth="0.5px"
                viewBox="0 0 16 16"
              >
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
              </svg>
              Close Camera
            </div>
          ) : (
            <div className="flex gap-3">
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
              Camera
            </div>
          )}
        </span>
      </div>

      {openCamera && (
        <div className="w-full space-y-4 mt-5">
          {/* Video Feed */}
          <div className="relative rounded-lg overflow-hidden shadow-lg bg-gray-800">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full max-w-2xl mx-auto"
            />
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            <button onClick={captureImage} className="">
              Capture Image
            </button>
            <button onClick={stopCamera} className="">
              Close Camera
            </button>
          </div>

          {/* Hidden Canvas */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Captured Image Display */}
          {imageFile && (
            <div className="mt-6 p-4 bg-white rounded-lg shadow-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Captured Image:
              </h4>
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Captured"
                  className="w-full max-w-2xl mx-auto"
                />
              </div>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p className="flex items-center">
                  <span className="font-semibold mr-2">File Name:</span>
                  {imageFile.name}
                </p>
                <p className="flex items-center">
                  <span className="font-semibold mr-2">File Size:</span>
                  {(imageFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeviceCamera;

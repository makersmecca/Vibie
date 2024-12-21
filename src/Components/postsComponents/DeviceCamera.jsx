import React, { useRef, useState, useEffect } from "react";

const DeviceCamera = ({ onImageCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [openCamera, setOpenCamera] = useState(false);
  const [stream, setStream] = useState(null);

  const [devices, setDevices] = useState([]);
  const [currentCamera, setCurrentCamera] = useState("user");

  useEffect(() => {
    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const getVideoDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices(videoDevices);
    } catch (error) {
      console.error("Error getting video devices:", error);
    }
  };
  const switchCamera = async () => {
    if (stream) {
      // Stop current stream
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());

      // Toggle camera facing mode
      setCurrentCamera((prev) => (prev === "user" ? "environment" : "user"));

      // Start new stream with different camera
      try {
        const MediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: currentCamera === "user" ? "environment" : "user",
          },
        });

        videoRef.current.srcObject = MediaStream;
        setStream(MediaStream);
      } catch (error) {
        console.error("Error switching camera: ", error);
      }
    }
  };

  // start camera
  const startCamera = async () => {
    setOpenCamera((prev) => !prev);
    try {
      const MediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: currentCamera,
        },
      });

      videoRef.current.srcObject = MediaStream;
      setStream(MediaStream);
      await getVideoDevices(); //available cameras
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
      onImageCapture(file);
      stopCamera();
    }, "image/png");
  };

  return (
    <>
      <div
        onClick={openCamera ? stopCamera : startCamera}
        className="cursor-pointer"
      >
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="flex flex-col items-center gap-4">
            {/* Video Feed */}
            <div className="relative w-[350px] rounded-lg overflow-hidden shadow-lg bg-gray-800">
              <div
                className="absolute z-10 top-3 right-3 cursor-pointer"
                onClick={stopCamera}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="white"
                  className="bi bi-x-circle-fill opacity-80"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                </svg>
              </div>
              <video ref={videoRef} autoPlay playsInline />
            </div>

            {/* Controls */}
            <div className="flex w-full items-center justify-between px-4">
              {/* Empty div for spacing */}
              <div className="w-[40px]"></div>

              {/* Centered capture button */}
              <button
                onClick={captureImage}
                className="rounded-full bg-slate-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="60"
                  height="60"
                  fill="white"
                  className="bi bi-record-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                  <path d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                </svg>
              </button>

              {/* Switch camera button on the right */}
              {devices.length > 1 ? (
                <button
                  onClick={switchCamera}
                  className="bg-gray-800 rounded-full w-[40px] h-[40px] flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="white"
                    className="bi bi-arrow-clockwise"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
                    />
                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                  </svg>
                </button>
              ) : (
                <div className="w-[40px]"></div>
              )}
            </div>

            {/* Hidden Canvas */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      )}
    </>
  );
};

export default DeviceCamera;

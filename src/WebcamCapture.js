import React from "react";
import Webcam from "react-webcam";
import { useAnimationFrame } from "./hooks/useAnimationFrame";

const videoConstraints = {
  width: 400,
  height: 300,
  facingMode: "user"
};

export const WebcamCapture = ({ setSourceImg, setFrameCount }) => {
  const webcamRef = React.useRef(null);
  useAnimationFrame(() => grabFrame());

  const grabFrame = () => {
    if (!webcamRef) return;
    const frameCanvas = webcamRef.current.getCanvas();
    if (!frameCanvas) return;

    if (frameCanvas.width) {
      const resizedCanvas = createSizedCanvas(frameCanvas, 400);
      setSourceImg(resizedCanvas);
      setFrameCount((prev) => prev + 1);
    }
  };

  return (
    <Webcam
      audio={false}
      style={{ position: "fixed", left: -10000 }}
      ref={webcamRef}
      mirrored={true}
      screenshotFormat="image/jpeg"
      videoConstraints={videoConstraints}
    />
  );
};

function createSizedCanvas(sourceImg, w) {
  const outCanvas = document.createElement("canvas");
  const wToHratio = w / sourceImg.width;
  const h = wToHratio * sourceImg.height;

  outCanvas.width = w;
  outCanvas.height = h;
  const ctx = outCanvas.getContext("2d");
  ctx.drawImage(sourceImg, 0, 0, sourceImg.width, sourceImg.height, 0, 0, w, h);

  return outCanvas;
}

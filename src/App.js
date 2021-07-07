import React, { useState, useEffect, useRef } from "react";
import fx from "glfx";
import { WebcamCapture } from "./WebcamCapture";

const App = () => {
  const [fxCanvas, setFxCanvas] = useState(null);
  const [denoiseLevel, setDenoiseLevel] = useState(150);
  const [inkLevel, setInkLevel] = useState(0.5);
  const [frameCount, setFrameCount] = useState(0);
  const [sourceImg, setSourceImg] = useState(null);
  const canvasRef = useRef(null);
  // const experimentCanvasRef = React.useRef(null);

  useEffect(() => {
    if (!fxCanvas) setFxCanvas(fx.canvas());
  }, [fxCanvas]);

  useEffect(() => {
    if (sourceImg && fxCanvas) {
      // var canvas = fx.canvas();
      var texture = fxCanvas.texture(sourceImg);

      // apply the ink filter //edgeWork
      fxCanvas.draw(texture).denoise(denoiseLevel).ink(inkLevel).update();

      // remove everything, but lines
      const inkCanvas = createInkCanvas(fxCanvas);

      const displayCanvas = canvasRef.current;
      drawCanvasToCanvas(inkCanvas, displayCanvas, 3);
    }

    // eslint-disable-next-line
  }, [sourceImg, frameCount, inkLevel]);

  const onInkLevelChange = (e) => setInkLevel(e.target.value);
  const onDenoiseLevel = (e) => setDenoiseLevel(e.target.value);

  return (
    <div className="app">
      <div>
        <span style={{ marginRight: 20 }}>
          INK:{" "}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={inkLevel}
            onChange={onInkLevelChange}
          />
          {inkLevel}
        </span>

        <span>
          DENOISE:{" "}
          <input
            type="range"
            min="0"
            max="255"
            step="1"
            value={denoiseLevel}
            onChange={onDenoiseLevel}
          />
          {denoiseLevel}
        </span>
      </div>

      <canvas ref={canvasRef} />

      <WebcamCapture
        setSourceImg={setSourceImg}
        setFrameCount={setFrameCount}
      />
    </div>
  );
};

export default App;

const drawCanvasToCanvas = (srcCanvas, targCanvas, scale = 1) => {
  targCanvas.width = srcCanvas.width * scale;
  targCanvas.height = srcCanvas.height * scale;

  const ctx = targCanvas.getContext("2d");
  ctx.drawImage(
    srcCanvas,
    0,
    0,
    srcCanvas.width,
    srcCanvas.height,
    0,
    0,
    targCanvas.width,
    targCanvas.height
  );
};

const createInkCanvas = (inputCanvas) => {
  if (!inputCanvas) return;

  const { width: inputW, height: inputH } = inputCanvas;
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = inputW;
  tempCanvas.height = inputH;
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.drawImage(inputCanvas, 0, 0);

  const inputCtx = tempCanvas.getContext("2d");
  if (!inputCtx) return;

  let imgData = inputCtx.getImageData(0, 0, inputW, inputH);
  let pixels = imgData.data;
  let r, g, b, outColour;
  for (let i = 0; i < pixels.length; i += 4) {
    r = pixels[i];
    g = pixels[i + 1];
    b = pixels[i + 2];

    if (r === 0 && g === 0 && b === 0) {
      outColour = 255;
    } else {
      outColour = 0;
    }

    pixels[i] = outColour;
    pixels[i + 1] = outColour;
    pixels[i + 2] = outColour;
  }

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = inputW;
  outputCanvas.height = inputH;
  const outputCtx = outputCanvas.getContext("2d");
  outputCtx.putImageData(imgData, 0, 0);

  return outputCanvas;
};

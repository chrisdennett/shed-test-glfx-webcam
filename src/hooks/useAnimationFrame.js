import React from "react";

const minMsPerFrame = 25;

export const useAnimationFrame = (callback) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = React.useRef();
  const previousTimeRef = React.useRef();

  const animate = (time) => {
    let deltaTime = 0;

    if (previousTimeRef.current !== undefined) {
      deltaTime = time - previousTimeRef.current;
    } else {
      previousTimeRef.current = time;
    }

    if (deltaTime > minMsPerFrame) {
      callback(deltaTime);
      previousTimeRef.current = time;
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }); // Make sure the effect runs only once
};

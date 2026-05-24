import { useEffect, useMemo, useState } from "react";

export const useTypewriter = (text: string, speed = 18) => {
  const [visibleLength, setVisibleLength] = useState(0);

  useEffect(() => {
    setVisibleLength(0);
  }, [text]);

  useEffect(() => {
    if (visibleLength >= text.length) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setVisibleLength((current) => Math.min(text.length, current + 1));
    }, speed);

    return () => window.clearTimeout(timer);
  }, [speed, text, visibleLength]);

  const displayedText = useMemo(() => text.slice(0, visibleLength), [text, visibleLength]);
  const isComplete = visibleLength >= text.length;
  const skip = () => setVisibleLength(text.length);

  return {
    displayedText,
    isComplete,
    skip
  };
};

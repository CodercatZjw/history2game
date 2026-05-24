import { useEffect, useState } from "react";

export function useTypewriter(text: string, speed = 18) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    setVisibleText("");
    if (!text) return;
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(timer);
      }
    }, speed);
    return () => window.clearInterval(timer);
  }, [text, speed]);

  return {
    visibleText,
    done: visibleText.length >= text.length,
    skip: () => setVisibleText(text),
  };
}

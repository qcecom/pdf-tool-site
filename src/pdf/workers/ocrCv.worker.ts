self.onmessage = async () => {
  (self as any).postMessage({ type: "error", message: "OCR unavailable" });
};

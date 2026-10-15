import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const MAX_SECONDS = 120;

// Chrome/Firefox -> webm/opus, Safari -> mp4
const getSupportedMimeType = () => {
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  return (
    types.find((t) => window.MediaRecorder?.isTypeSupported?.(t)) || ""
  );
};

const useVoiceRecorder = (onComplete) => {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);
  const cancelledRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const cleanup = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    recorderRef.current = null;
    setIsRecording(false);
    setSeconds(0);
  }, []);

  // Stop and send
  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") recorder.stop();
  }, []);

  // Stop and discard
  const cancel = useCallback(() => {
    cancelledRef.current = true;
    stop();
  }, [stop]);

  const start = useCallback(async () => {
    if (recorderRef.current) return;

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      toast.error("Voice recording isn't supported in this browser");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined
      );

      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];
      cancelledRef.current = false;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
        const type = recorder.mimeType || mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type });
        const cancelled = cancelledRef.current;
        cleanup();

        if (cancelled) return;
        if (duration < 1) {
          toast.error("Recording too short");
          return;
        }
        onCompleteRef.current?.({ blob, duration });
      };

      recorder.start();
      startTimeRef.current = Date.now();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setSeconds(elapsed);
        if (elapsed >= MAX_SECONDS) stop(); // auto-send at the limit
      }, 250);
    } catch (err) {
      cleanup();
      toast.error(
        err.name === "NotAllowedError"
          ? "Microphone permission denied"
          : "Could not start recording"
      );
    }
  }, [cleanup, stop]);

  // Discard any in-progress recording if the component unmounts
  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== "inactive") recorder.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      clearInterval(timerRef.current);
    };
  }, []);

  return { isRecording, seconds, start, stop, cancel };
};

export default useVoiceRecorder;

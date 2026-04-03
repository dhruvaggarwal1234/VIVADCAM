import { useEffect, useRef, useState } from "react";
import micOn from "./assets/micon.png";
import micOff from "./assets/micoff.png";
import camOff from "./assets/camoff.png";
import camOn from "./assets/camon.png";

function App() {
  const videoRef = useRef();
  const videoTrackRef = useRef(null); // ✅ was missing
  const [stream, setStream] = useState(null);
  const [cam, setCam] = useState(true);
  const [mic, setMic] = useState(true);

  useEffect(() => {
    async function VideoStream() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        videoTrackRef.current = s.getVideoTracks()[0]; // ✅ store track ref
        setStream(s);

        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.log(err.message);
      }
    }

    VideoStream();
  }, []);

  // 🎤 MIC TOGGLE
  const handleMic = () => {
    if (!stream) return;
    const audioTrack = stream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    setMic(audioTrack.enabled);
  };

  // 📷 CAMERA TOGGLE
const handleCam = async () => {
  if (cam) {
    // ✅ Update UI instantly first
    setCam(false);
    // Then stop hardware
    videoTrackRef.current?.stop();
    videoTrackRef.current = null;
  } else {
    // ✅ Update UI instantly first  
    setCam(true);
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const newTrack = newStream.getVideoTracks()[0];
      videoTrackRef.current = newTrack;

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      setCam(false); // revert if failed
      console.log("Camera restart failed:", err.message);
    }
  }
};

  return (
    <main className="bg-[var(--bg-main)] min-h-screen flex p-3">
      <div className="m-10 gap-4 flex flex-col items-center">

        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-[720px] h-[450px] rounded-xl bg-black object-cover"
          />

          {!cam && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-xl">
              <p className="text-white text-lg">Camera is Off</p>
            </div>
          )}
        </div>

        <div className="bg-[var(--bg-card)] px-5 py-3 rounded-xl flex gap-3 shadow-[0_0_20px_var(--bg-card)]">

          {/* 🎤 MIC */}
          <button
            onClick={handleMic}
            className={`p-3 rounded-full transition ${
              mic ? "bg-[var(--bg-card)] hover:bg-white/10" : "bg-red-500 hover:bg-red-300"
            }`}
          >
            <img src={mic ? micOn : micOff} className="w-6 h-6" />
          </button>

          {/* 📷 CAMERA */}
          <button
            onClick={handleCam}
            className={`p-3 rounded-full transition ${
              cam ? "bg-[var(--bg-card)] hover:bg-white/10" : "bg-red-500 hover:bg-red-300"
            }`}
          >
            <img src={cam ? camOn : camOff} className="w-6 h-6" />
          </button>

          {/* ⚙️ SETTINGS */}
          <button className="p-3 rounded-full hover:bg-white/10 transition">
            ⚙️
          </button>

        </div>
      </div>
    </main>
  );
}

export default App;
import { useEffect, useRef, useState } from "react";
import micOn from "./assets/micon.png";
import micOff from "./assets/micoff.png";
import camOff from "./assets/camoff.png";
import camOn from "./assets/camon.png";
import PermissionModel from "./components/PermissionModel";
import { useNavigate, useParams } from "react-router-dom";



function Preview() {
  const videoRef  =useRef(null)
  const audioTrackRef = useRef(null);
  const videoTrackRef = useRef(null);
  const [cam, setCam] = useState(false);
  const [mic, setMic] = useState(false);
  const [name,setName] = useState('')
  const [perModel , SetPerModel] = useState(false);


  const navigate = useNavigate()
  const {id} = useParams()



 
  const handleMic = async () => {
   
    if(mic){
      setMic(false);

      audioTrackRef.current?.stop();
      audioTrackRef.current =null;
    }
    else{
      try{const stream = await navigator.mediaDevices.getUserMedia({audio:true})
      const track =  stream.getAudioTracks()[0];
      audioTrackRef.current=track;
      setMic(true)
      SetPerModel(false)
      setName('')

      }catch(err){
        setMic(false)

        if(err.name==='NotAllowedError'){
          SetPerModel(true)
          setName('Microphone')
        } 
        else{
          console.log("err from mic" , err.name)
        }
      }
    }

  };

const handleCam = async () => {
  if (cam) {
    
    
    videoTrackRef.current?.stop();
    videoTrackRef.current =null;
    

    if(videoRef.current){
      videoRef.current.srcObject= null;
    }

    setCam(false);

  } else {
    try {


      const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const newTrack = newStream.getVideoTracks()[0];

      SetPerModel(false)
      setName('')

      videoTrackRef.current = newTrack;

      if(videoRef.current){
        videoRef.current.srcObject = newStream;
      }

      setCam(true)
    } catch (err) {
      setCam(false);
      if(err.name==='NotAllowedError'){
          SetPerModel(true)
          setName('Camera')
        } 
      console.log("Camera restart failed:", err.message);
    }
  }
};

  return (
    
    <main className="bg-[var(--bg-main)] min-h-screen flex p-3 items-center justify-center gap-40">

      {perModel && <PermissionModel SetPerModel={SetPerModel} name={name}/>}
      <div className="flex flex-rows gap-30"> 

        {/*left side  */}
      
      <div className="m-10 gap-4 flex flex-col items-center">

        
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-[720px] h-[450px] rounded-4xl bg-black object-cover"
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
            className={`p-3 rounded-full  shadow-[1px_1px_1px_1px]   transition  ${
              mic ? "bg-[var(--text-primary)]/80 hover:bg-white/20" : "bg-red-500 hover:bg-red-300"
            }`}
          >
            <img src={mic ? micOn : micOff} className="w-6 h-6" />
          </button>

          {/* 📷 CAMERA */}
          <button
            onClick={handleCam}
            className={`p-3 rounded-full shadow-[1px_1px_1px_1px] transition ${
              cam ? "bg-[var(--text-primary)]/80 hover:bg-white/20" : "bg-red-500 hover:bg-red-300"
            }`}
          >
           <img 
  src={cam ? camOn : camOff} 
  className={`w-6 h-6 ${cam ? 'fill-[var(--text-primary)]' : 'fill-none'}`}
/>
          </button>

          {/* ⚙️ SETTINGS
          <button className="p-3 rounded-full hover:bg-white/10 transition-transform">

            ⚙️
          </button> */}

        </div>


      </div>

      {/* {right side model} */}

      <div className="w-[400px] h-[500px] bg-[var(--bg-card)] rounded-3xl flex flex-col justify-between p-6 text-[var(--text-primary)] shadow-xl border border-white/10 backdrop-blur-md">

  {/* Top Section */}
  <div className="flex items-center justify-between">
    <div className="text-sm opacity-70">Active Users</div>
    <div className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400">
      Live
    </div>
  </div>

  {/* Center Content */}
  <div className="flex flex-col items-center justify-center gap-4 text-center">
    
    <div className="text-5xl font-bold tracking-tight">
      12
    </div>

    <div className="text-sm opacity-70">
      people active now
    </div>

    {/* Mic Status */}
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
      <span className={`w-2 h-2 ${mic?" bg-green-400":"bg-red-500"} rounded-full animate-pulse`}></span>
      <span className="text-sm">Mic {mic? 'is Active':'not Active'}</span>
    </div>

  </div>

      

  {/* Bottom Button */}
  <div>
    <button 
    className="w-full py-3 rounded-xl font-semibold bg-[var(--text-primary)] text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95"
    onClick={() => navigate(`/${id}`)}
    >
      Join Now
    </button>
  </div>

</div>
     </div>
      
    </main>
  );
}

export default Preview;
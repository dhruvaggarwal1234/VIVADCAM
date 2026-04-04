import React from 'react';

export default function PermissionModel({ SetPerModel  , name}) {


   const handlePermission =async() =>{

    if(name === 'Microphone'){
     try{
          const status = await navigator.permissions.query({ name: "microphone" });
          console.log(status)
        setShowModel(false)
     }catch(err){
             console.log("Microphone allow ", err.message)
     }
    }

    }

  return (
  
    <div className=' fixed inset-0 h-screen w-screen bg-black/70 flex justify-center items-center z-20'>

  <div className="h-[50%] w-[50%]  bg-[var(--bg-card)]  flex flex-col items-center justify-center  p-6 rounded-lg relative">

      {/* Close button */}
      <div 
        className="absolute top-3 right-4 cursor-pointer text-left"
        onClick={() => SetPerModel(false)}  
      >
        ✖
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
        {name} Access Needed
      </h2>

      {/* Button */}
      <button
        className="text-[var(--text-primary)] bg-[var(--bg-main)]  hover:bg-white/30 px-4 py-2 rounded-xl transform transition duration-300 hover:scale-110"
        onClick={handlePermission}
      >
        Allow {name}
      </button>

    </div>

    </div>

  );
}
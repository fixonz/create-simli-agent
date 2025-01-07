"use client";
import React from "react";
import SimliAgent from "@/app/SimliAgent";

const Demo: React.FC = () => {
  const onStart = () => {
    console.log("Stream started");
  };

  const onClose = () => {
    console.log("Stream closed");
  };

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center font-abc-repro font-normal text-sm text-white p-8">
  {/* Video box */}
  <div className="relative w-full max-w-[800px] aspect-video bg-effect15White p-6 rounded-xl">
    <SimliAgent onStart={onStart} onClose={onClose} />
  </div>
  
  {/* Button */}
  <div className="mt-4 flex justify-center">
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Start Chat
    </button>
  </div>
</div>

  );
};

export default Demo;

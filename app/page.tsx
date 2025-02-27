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
    <div className="bg-black min-h-screen flex items-center justify-center font-abc-repro font-normal text-sm text-white p-4">
      <div className="w-full max-w-[800px] aspect-video bg-effect15White rounded-xl overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-grow">
            <SimliAgent onStart={onStart} onClose={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;

"use client";
import React, { useState } from "react";
import SimliAgent from "@/app/SimliAgent";

const Demo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const onStart = () => {
    setIsLoading(true);
    setShowPlaceholder(false);
    setTimeout(() => {
      setIsLoading(false);
      console.log("Stream started");
    }, 5000);
  };

  const onClose = () => {
    setShowPlaceholder(true);
    console.log("Stream closed");
  };

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center font-abc-repro font-normal text-sm text-white p-8">
      <div className="w-full max-w-[800px] aspect-video bg-effect15White p-6 rounded-xl">
        {showPlaceholder ? (
          <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: "url('assets/images/profile.jpg')"}}></div>
        ) : (
          <>
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <p>Please wait 5-10 seconds...</p>
              </div>
            ) : (
              <SimliAgent onStart={onStart} onClose={onClose} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Demo;

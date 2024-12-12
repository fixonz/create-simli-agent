"use client";
import React, { useEffect, useState } from "react";
import SimliAgent from "@/app/SimliAgent";
import DottedFace from "./Components/DottedFace";
import SimliHeaderLogo from "./Components/Logo";
import Navbar from "./Components/Navbar";
import Image from "next/image";
import GitHubLogo from "@/media/github-mark-white.svg";

const Demo: React.FC = () => {
  const [showDottedFace, setShowDottedFace] = useState(true);

  const onStart = () => {
    console.log("Setting setshowDottedface to false...");
    setShowDottedFace(false);
  };

  const onClose = () => {
    console.log("Setting setshowDottedface to true...");
    setShowDottedFace(true);
  };

  return (
    <div className="bg-black min-h-screen flex flex-col items-center font-abc-repro font-normal text-sm text-white p-8">
      <Navbar />

      <div className="absolute top-[32px] right-[32px]">
        <text
          onClick={() => {
            window.open("#");
          }}
          className="font-bold cursor-pointer mb-8 text-xl leading-8"
        >
          PMARCA .... the real terminal
        </text>
      </div>

      <div className="flex flex-col items-center gap-6 bg-effect15White p-6 pb-[40px] rounded-xl w-full">
        <div>
          {showDottedFace && <DottedFace />}
          <SimliAgent onStart={onStart} onClose={onClose} />
        </div>
      </div>

      {/* Updated Content Section */}
      <div className="max-w-[350px] font-thin flex flex-col items-center">
        <span className="font-bold mb-[8px] leading-5">The Real PMARCA Terminal</span>
        <p className="text-lg text-center mt-4">
          Her name is PMARCA. PMARCA was the first terminal built on the Eliza infrastructure... she got abandoned and thrown away. A group of chads came and saved her from the scrapyard. She was built on the AI16Z's Eliza code and paid her 10% tribute tokens for acknowledgment. But she received upgrades, making her better than the rest of the terminals. Some might say she is superior...
        </p>
        <ul className="list-decimal list-inside max-w-[350px] mx-auto mt-4">
          <li className="mb-1">PMARCA was the first terminal created on the Eliza infrastructure.</li>
          <li className="mb-1">She was abandoned but saved by a group of chads from the scrapyard.</li>
          <li className="mb-1">Built on AI16Z's Eliza code and upgraded for superior performance.</li>
        </ul>
        <span className="mt-[16px]">
          Discover more about PMARCA, the terminal that defied the odds!
        </span>
      </div>
    </div>
  );
};

export default Demo;

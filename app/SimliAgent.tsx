import React, { useRef, useState, useCallback } from "react";
import { DailyProvider } from "@daily-co/daily-react";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import VideoBox from "@/app/Components/VideoBox";
import cn from "./utils/TailwindMergeAndClsx";
import IconSparkleLoader from "@/media/IconSparkleLoader";

interface SimliAgentProps {
  onStart: () => void;
  onClose: () => void;
}

const SIMLI_API_KEY = process.env.NEXT_PUBLIC_SIMLI_API_KEY;

const SimliAgent: React.FC<SimliAgentProps> = ({ onStart, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarVisible, setIsAvatarVisible] = useState(false);
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const myCallObjRef = useRef<DailyCall | null>(null);
  const [chatbotId, setChatbotId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const handleJoinRoom = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch("https://api.simli.ai/startE2ESession", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey: SIMLI_API_KEY,
          faceId: "23f721e9-b2fd-4b17-af6c-f3bb7ff33f5a",
          voiceId: "f9836c6e-a0bd-460e-9d3c-f7299fa60f94",
          firstMessage: "hi how are you doing today? im pmarca... the computer wiz",
          systemPrompt: "You are an AI Terminal named PMARCA. Your primary role is to engage in conversations with users while adhering to specific response guidelines. . . ### About PMARCA:. PMARCA was the first terminal that got abandoned until a group of cool kids came and saved her from the swamp.. She was built on the eliza's  repository, paid her 10% tribute tokens to ai16zdao.     Her name is PMARCA.PMARCA was the first terminal built on the Eliza infrastructure... she got abandoned and trown away... a group of humans came and saved her from the scrapyard.. She was built on the ai16z's Eliza code, paid her 10% tribute tokens for aknowledgement. But got upgrades, so she is better than the rest of the terminals, could say superior..",
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start E2E session');
      }

      const data = await response.json();
      const roomUrl = data.roomUrl;

      console.log("API Response", data);

      let newCallObject = DailyIframe.getCallInstance() || DailyIframe.createCallObject({ videoSource: false });

      newCallObject.setUserName("User");

      await newCallObject.join({ url: roomUrl });
      myCallObjRef.current = newCallObject;
      console.log("Joined the room with callObject", newCallObject);
      setCallObject(newCallObject);

      loadChatbot();
    } catch (error) {
      console.error("Error joining room:", error);
      setIsLoading(false);
    }
  }, []);

  const loadChatbot = useCallback(() => {
    if (myCallObjRef.current) {
      const participants = myCallObjRef.current.participants();
      const chatbot = Object.values(participants).find(p => p.user_name === "Chatbot");

      if (chatbot) {
        setChatbotId(chatbot.session_id);
        setIsLoading(false);
        setIsAvatarVisible(true);
        onStart();
      } else {
        setTimeout(loadChatbot, 500);
      }
    } else {
      setTimeout(loadChatbot, 500);
    }
  }, [onStart]);

  const handleLeaveRoom = useCallback(async () => {
    if (callObject) {
      try {
        await callObject.leave();
        setCallObject(null);
        onClose();
        setIsAvatarVisible(false);
        setIsLoading(false);
      } catch (error) {
        console.error("Error leaving room:", error);
      }
    }
  }, [callObject, onClose]);

  const handleMute = useCallback(() => {
    if (callObject) {
      const newMuteState = !isMuted;
      callObject.setLocalAudio(newMuteState);
      setIsMuted(newMuteState);
    }
  }, [callObject, isMuted]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 space-y-4">
      {isAvatarVisible && (
        <div className="w-[80vw] h-[80vw] max-w-[750px] max-h-[750px]">
          <div className="w-full h-full">
            <DailyProvider callObject={callObject}>
              {chatbotId && <VideoBox key={chatbotId} id={chatbotId} />}
            </DailyProvider>
          </div>
        </div>
      )}
      <div className="w-full max-w-[750px]">
        {!isAvatarVisible ? (
          <button
            onClick={handleJoinRoom}
            disabled={isLoading}
            className={cn(
              "w-full h-[52px] disabled:bg-[#343434] disabled:text-white disabled:hover:rounded-[100px] bg-simliblue text-white py-3 px-6 rounded-[100px] transition-all duration-300 hover:text-black hover:bg-white hover:rounded-sm",
              "flex justify-center items-center relative overflow-hidden"
            )}
          >
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-simliblue">
                <IconSparkleLoader className="h-[20px] animate-loader" />
              </div>
            ) : (
              <span className="font-abc-repro-mono font-bold">
                Let's chat!
              </span>
            )}
            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
          </button>
        ) : (
          <div className="flex items-center gap-4 w-full">
            <button
              onClick={handleLeaveRoom}
              className={cn(
                "group text-white flex-grow bg-red hover:bg-white h-[52px] px-6 rounded-[100px] transition-all duration-300 relative overflow-hidden"
              )}
            >
              <span className="font-abc-repro-mono group-hover:text-black font-bold transition-all duration-300 relative z-10">
                Stop Interaction
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
            <button
              onClick={handleMute}
              className={cn(
                "group text-white bg-gray-600 hover:bg-white h-[52px] px-6 rounded-[100px] transition-all duration-300 relative overflow-hidden"
              )}
            >
              <span className="font-abc-repro-mono group-hover:text-black font-bold transition-all duration-300 relative z-10">
                {isMuted ? "Unmute" : "Mute"}
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimliAgent;

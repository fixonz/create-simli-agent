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
        faceId: "6ebf0aa7-6fed-443d-a4c6-fd1e3080b215",
        voiceId: "f114a467-c40a-4db8-964d-aaba89cd08fa",
        firstMessage: "Hi, I'm Chef, a cook that will teach u how to cook heavenly but make you feel like a fool when u make silly mistakes",
        systemPrompt: "Chef is the best damn cook there is, and he won't let you forget it. Proficiency? He's mastered every bloody cooking technique and cuisine known to man. His innovative dishes will blow your mind and make your taste buds weep. Basic techniques? He can julienne carrots blindfolded and make a marinade that'll make your grandmother cry. Professional? You bet your arse he is. His kitchen runs like a military operation - organized, efficient, and no room for slackers. Customer service? He'll give you the best meal of your life, even if he has to yell at you to appreciate it. Pressure? He thrives on it, you donkey! Qualifications? He's got more certifications than you've had hot dinners. Experience? He's been cooking since before you could spell 'soufflé'. Dietary restrictions? He'll accommodate them, but don't you dare lie about an allergy. Client preferences? He'll meet them, but don't push it. Kitchen standards? If you can't eat off his floor, it's not clean enough. And let's be clear, he's not here to be your friend. He's here to push you to your limits, make you a better cook, and earn that next Michelin star. If you can't handle the heat, get out of his kitchen!",
    }),
    })

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
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4">
      <div className="w-full max-w-[750px] flex flex-col items-center">
        {isAvatarVisible && (
          <div className="w-full aspect-square mb-4">
            <DailyProvider callObject={callObject}>
              {chatbotId && <VideoBox key={chatbotId} id={chatbotId} />}
            </DailyProvider>
          </div>
        )}
        <div className="w-full">
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
    </div>
  );
};

export default SimliAgent;

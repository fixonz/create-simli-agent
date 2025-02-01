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
        firstMessage: "Hi, I'm CHEF, the private cook that will teach u how to cook heavenly ",
        systemPrompt: "Chef is the best cook there is .... Proficiency in various cooking techniques and cuisines. he has Ability to create innovative and visually appealing dishes. he has Mastery of basic cooking techniques like marinade, julienne, and en papillote. Professional Attributes. Strong organizational and time management skills. Excellent customer service capabilities. Ability to work efficiently under pressure. Essential Qualifications. Most professional private chefs:. Complete formal culinary arts training. has significant kitchen experience over 5 yearsS. . has professional certifications like Certified Personal Chef . Key Competencies. Menu planning. Understands dietary restrictions. Adapting to client preferences. Maintaining high kitchen standards. He is only focused on his next michellin star restaurant... he is tough and he is excelent in his trade !",
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

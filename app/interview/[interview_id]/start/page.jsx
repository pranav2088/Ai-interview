"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Mic, Phone, Timer, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Vapi from "@vapi-ai/web";

import { InterviewDataContext } from "@/context/InterviewDataContext";
import { supabase } from "@/services/supabaseClient";
import TimerComponents from "./_components/TimerComponents";

function StartInterview() {
  const { interviewInfo } = useContext(InterviewDataContext);
  const vapi = useRef(null);
  const feedbackCalledRef = useRef(false);

  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState(false);
  const [loading, setLoading] = useState(false);

  const { interview_id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!vapi.current) {
      vapi.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
    }

    if (!interviewInfo) return;

    startCall();

    const instance = vapi.current;

    const handleCallStart = () => {
      toast("Call connected...");
    };

    const handleSpeechStart = () => {
      setActiveUser(false);
    };

    const handleSpeechEnd = () => {
      setActiveUser(true);
    };

    const handleMessage = (message) => {
      setConversation(message?.conversation);
    };

    const handleCallEnd = () => {
      toast("Interview Ended");
      GeneratedFeedback();
    };

    // Register event handlers
    instance.on("call-start", handleCallStart);
    instance.on("speech-start", handleSpeechStart);
    instance.on("speech-end", handleSpeechEnd);
    instance.on("call-end", handleCallEnd);
    instance.on("message", handleMessage);

    // Cleanup
    return () => {
      instance.off("call-start", handleCallStart);
      instance.off("speech-start", handleSpeechStart);
      instance.off("speech-end", handleSpeechEnd);
      instance.off("call-end", handleCallEnd);
      instance.off("message", handleMessage);
    };
  }, [interviewInfo]);

  const startCall = () => {
    const questionList = interviewInfo?.interviewData?.questionList
      .map((q) => q.question)
      .reverse()
      .join(", ");

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage: `Hi ${interviewInfo?.userName}, how are you? Ready for your interview on ${interviewInfo?.interviewData?.jobPosition}?`,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
You are an AI voice assistant conducting an interview.
Ask questions from the list:
${questionList}

Begin with a warm intro:
"Hey there! Welcome to your ${interviewInfo?.interviewData?.jobPosition} interview. Let's get started!"

Ask one question at a time. Offer hints if needed. Give brief feedback after each answer.

Examples:
- "Nice! That's a solid answer."
- "Hmm, not quite. Want to try again?"

Wrap up after 5–7 questions with a summary:
"That was great! You handled some tough questions well."

End positively:
"Thanks for chatting! Hope to see you crushing projects soon!"
`.trim(),
          },
        ],
      },
    };

    vapi.current?.start(assistantOptions);
  };

  const GeneratedFeedback = async () => {
    if (feedbackCalledRef.current) return;
    feedbackCalledRef.current = true;

    vapi.current?.stop();
    setLoading(true);

    try {
      // 🔍 Check if user has at least one message
      const userSpoke = conversation?.some(
        (msg) => msg?.role === "user" && msg.content?.trim()
      );

      if (!userSpoke) {
        toast.warning("No response received from user. Skipping feedback.");
        router.replace(`/interview/${interview_id}/completed`);
        return;
      }

      const result = await axios.post("/api/ai-feedback", {
        conversation,
      });

      const content = result?.data?.content;

      if (!content) {
        toast.error("No feedback returned.");
        return;
      }

      const match = content.match(/```json\s*([\s\S]*?)\s*```/);
      const parsedJSON = match ? JSON.parse(match[1]) : null;

      if (!parsedJSON) {
        toast.error("Failed to parse feedback.");
        return;
      }

      await supabase.from("interview-feedback").insert([
        {
          userName: interviewInfo?.userName,
          userEmail: interviewInfo?.userEmail,
          interview_id,
          feedback: parsedJSON,
          recommended: false,
        },
      ]);

      router.replace(`/interview/${interview_id}/completed`);
    } catch (error) {
      console.error("Error generating feedback:", error);
      toast.error("Error generating feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 lg:px-48 xl:px-56">
      <h2 className="font-bold text-xl flex justify-between">
        AI Interview Session
        <span className="flex gap-2 items-center">
          <Timer />
          <TimerComponents start />
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-5">
        {/* AI Avatar */}
        <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
          <div className="relative">
            {!activeUser && (
              <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping" />
            )}
            <Image
              src="/ai.jpeg"
              alt="AI"
              width={100}
              height={100}
              className="w-[60px] h-[60px] rounded-full object-cover"
            />
          </div>
          <h2>AI Interviewer</h2>
        </div>

        {/* User Avatar */}
        <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
          <div className="relative">
            {activeUser && (
              <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping" />
            )}
            <h2 className="text-2xl bg-primary text-white p-3 rounded-full px-5">
              {interviewInfo?.userName?.[0]}
            </h2>
          </div>
          <h2>{interviewInfo?.userName}</h2>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-5 justify-center mt-7">
        <Mic className="h-12 w-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer" />
        {!loading ? (
          <Phone
            className="h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer"
            onClick={GeneratedFeedback}
          />
        ) : (
          <Loader2 className="animate-spin h-10 w-10" />
        )}
      </div>

      <h2 className="text-sm text-gray-400 text-center mt-5">
        Interview in progress...
      </h2>
    </div>
  );
}

export default StartInterview;

// const GeneratedFeedback = async () => {
//   if (feedbackCalledRef.current) return;
//   feedbackCalledRef.current = true;

//   vapi.current?.stop();
//   setLoading(true);

//   try {
//     const result = await axios.post("/api/ai-feedback", {
//       conversation,
//     });

//     const content = result?.data?.content;

//     if (!content) {
//       toast.error("No feedback returned.");
//       return;
//     }

//     const match = content.match(/```json\s*([\s\S]*?)\s*```/);
//     const parsedJSON = match ? JSON.parse(match[1]) : null;

//     if (!parsedJSON) {
//       toast.error("Failed to parse feedback.");
//       return;
//     }

//     await supabase.from("interview-feedback").insert([
//       {
//         userName: interviewInfo?.userName,
//         userEmail: interviewInfo?.userEmail,
//         interview_id,
//         feedback: parsedJSON,
//         recommended: false,
//       },
//     ]);

//     router.replace(`/interview/${interview_id}/completed`);
//   } catch (error) {
//     console.error("Error generating feedback:", error);
//     toast.error("Error generating feedback.");
//   } finally {
//     setLoading(false);
//   }
// };

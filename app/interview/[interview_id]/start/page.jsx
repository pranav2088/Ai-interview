"use client";

import { InterviewDataContext } from "@/context/InterviewDataContext";
import { Loader2, Mic, Phone, Timer } from "lucide-react";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import AlertComfomation from "./_components/AlertComfirmation";
import { toast } from "sonner";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import TimerComponents from "./_components/TimerComponents";
function StartInterview() {
  const vapi = useRef();
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState(false);
  const { interview_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [callEnd, setCallEnd] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!vapi.current) {
      vapi.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
    }
    if (interviewInfo) {
      startCall();
    }
    if (!vapi.current) return;

    const instance = vapi.current;

    const handleCallStart = () => {
      console.log("Call has started");
      toast("Call connected...");
    };

    const handleSpeechStart = () => {
      setActiveUser(false);
    };

    const handleSpeechEnd = () => {
      console.log("Speech has ended");
      setActiveUser(true);
    };

    const handleCallEnd = () => {
      console.log("Call has ended");
      toast("Interview Ended");
      GeneratedFeedback();
    };

    const handleMessage = (message) => {
      console.log(message?.conversation);
      setConversation(message?.conversation);
    };

    // Register
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
    let questionList;
    interviewInfo?.interviewData?.questionList.forEach(
      (item, index) => (questionList = item?.question + "," + questionList)
    );

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage:
        "Hi" +
        interviewInfo?.userName +
        ",how are you ? Ready for Your interview on " +
        interviewInfo?.interviewData?.jobPosition,
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
            content:
              `you are an AI voice assistant conducting interview.
Your job is to ask candidates provided interview questions,assess their responses.
Begin the conversation with a friendly introduction, setting a relaxed yrt prodessional tone. 
Example:"Hey there! Welcome to your ` +
              interviewInfo?.interviewData?.jobPosition +
              ` interview. Let's get started with a few question!"
Ask one question at a time and wait for the candidate's response before proceeding. 
Keep the question clear and concise. 
Below are theQuestions:` +
              questionList +
              `
If the candidate struggles,offer hints or rephrase the question without giving away the answers. Example:
"Need a hint? Think about how React tracks component updates!"
Provide brief, encouraging feedback after each  answer. Example:
"Nice! That's a solid answer."
"Hmm, noit  quite! Want to try again?"
Keep the conversation natural and engaging-use casual phrases like "Alright, next up..."or "Let's trackle a tricky one!"
After 5-7 questions, wrap up the interview smoothly by summaizing their performance. Example:
"That was great! You hndle some tough question well.Keep sharpening your skills!"
End on a positive note:
"Thanks for chatting! Hope to see you crushing project soon!"
Key Guidelines:
Be friendlt,engaging, and witty
Keep responses short and natural, like a real conversation
Adapt based on the cadidate's confidence level
Ensure the interview remains focused on React`.trim(),
          },
        ],
      },
    };
    vapi.current?.start(assistantOptions);
  };

  const stopInterview = () => {
    vapi.current?.stop();
    setCallEnd(true);
    GeneratedFeedback();
  };

  const GeneratedFeedback = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/ai-feedback", {
        conversation: conversation,
      });

      const content = result?.data?.content;

      if (!content) {
        toast.error("No content returned from AI feedback API.");
        setLoading(false);
        return;
      }

      const match = content.match(/```json\s*([\s\S]*?)\s*```/);
      let parsedJSON;

      if (match) {
        parsedJSON = JSON.parse(match[1]);
      } else {
        toast.error("Failed to extract valid JSON from feedback.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("interview-feedback")
        .insert([
          {
            userName: interviewInfo?.userName,
            userEmail: interviewInfo?.userEmail,
            interview_id: interview_id,
            feedback: parsedJSON,
            recommended: false,
          },
        ])
        .select();

      // router.replace("/interview/" + interview_id + "/completed");
      router.replace("/interview/" + interview_id + "/completed");
    } catch (error) {
      console.error("Error generating feedback:", error);
      toast.error("Something went wrong while generating feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-20 lg:px-48 xl:px-56">
      <h2 className="font-bold text-xl flex justify-between">
        Ai Interview Session
        <span className="flex gap-2 items-center">
          <Timer />
          <TimerComponents start={true} />
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-5">
        <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
          <div className="relative">
            {!activeUser && (
              <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping" />
            )}
            <Image
              src={"/ai.jpeg"}
              alt="ai"
              width={100}
              height={100}
              className="w-[60px] h-[60px] rounded-full object-cover"
            />
          </div>

          <h2>AI Interview</h2>
        </div>
        <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
          <div className="relative">
            {activeUser && (
              <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping" />
            )}
            <h2 className="text-2xl bg-primary text-white p-3 rounded-full px-5">
              {interviewInfo?.userName[0]}
            </h2>
          </div>
          <h2>{interviewInfo?.userName}</h2>
        </div>
      </div>
      <div className="flex items-center gap-5 justify-center mt-7">
        <Mic className="h-12 w-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer" />
        {/* <AlertComfomation> */}
        {!loading ? (
          <Phone
            className="h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer"
            onClick={() => stopInterview()}
          />
        ) : (
          <Loader2 className="animate-spin" />
        )}
        {/* </AlertComfomation> */}
      </div>
      <h2 className="text-sm text-gray-400 text-center mt-5">
        Interview in progress...
      </h2>
    </div>
  );
}

export default StartInterview;

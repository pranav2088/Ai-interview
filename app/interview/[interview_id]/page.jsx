"use client";

import React, { useContext, useEffect, useState } from "react";
import InterviewHeader from "../_components/InterviewHeader";
import Image from "next/image";
import { Clock, Info, Loader2Icon, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import { toast } from "sonner";
import { InterviewDataContext } from "@/context/InterviewDataContext";

function Interview() {
  const { interview_id } = useParams();
  const [interviewData, setInterviewData] = useState();
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [loading, setLoading] = useState(false);

  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const router = useRouter();

  useEffect(() => {
    interview_id && GetInterviewDetails();
  }, [interview_id]);

  const GetInterviewDetails = async () => {
    setLoading(true);
    try {
      let { data: interviews, error } = await supabase
        .from("interviews")
        .select("jobPosition,jobDescription,duration,type")
        .eq("interview_id", interview_id);
      setInterviewData(interviews[0]);
      if (interviews?.length == 0) {
        toast("Incorrect Interview Link");
        return;
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast("Incorrect Interview Link");
    }
  };

  const onJonInterview = async () => {
    if (!userName || !userEmail || !interview_id) {
      toast("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const { data: interviews, error } = await supabase
        .from("interviews")
        .select("*")
        .eq("interview_id", interview_id);

      if (error || !interviews || interviews.length === 0) {
        toast("Interview not found. Try again.");
        setLoading(false);
        return;
      }

      const interviewInfoData = {
        userName,
        userEmail,
        interviewData: interviews[0],
      };

      // ✅ Step 1: Save in context
      setInterviewInfo(interviewInfoData);

      // ✅ Step 2: Save in localStorage and wait for it
      try {
        localStorage.setItem(
          "interviewInfo",
          JSON.stringify(interviewInfoData)
        );
      } catch (storageError) {
        toast("Failed to save interview info locally.");
        setLoading(false);
        return;
      }

      // ✅ Step 3: Only after data is saved, navigate
      router.push("/interview/" + interview_id + "/start");
    } catch (err) {
      toast("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //   const onJonInterview = async () => {
  //   setLoading(true);

  //   let { data: interviews, error } = await supabase
  //     .from("interviews")
  //     .select("*")
  //     .eq("interview_id", interview_id);

  //   setInterviewInfo({
  //     userName: userName,
  //     userEmail: userEmail,
  //     interviewData: interviews[0],
  //   });
  //   router.push("/interview/" + interview_id + "/start");
  //   setLoading(false);
  // };

  return (
    <div className="px-10 md:px-28 lg:px-48 xl:px-80 pb-20 mt-7">
      <div className="flex flex-col items-center justify-center border rounded-lg bg-white  p-7 lg:px-33 xl:px-52 mb-20 pb-15">
        <h2 className="mt-3">AI Powered Interview Platform</h2>
        <Image
          src="/interview.png"
          alt="logo"
          width={500}
          height={500}
          className="w-[280px] my-6"
        />
        <h2 className="font-bold text-xl ">{interviewData?.jobPosition}</h2>
        <h2 className="flex gap-2 items-center text-gray-500 mt-3">
          <Clock className="h-4 w-4" />
          {interviewData?.duration}
        </h2>
        <div className="w-full">
          <h2>Enter Your Full Name</h2>
          <Input
            placeholder="e.g. John Smith"
            onChange={(event) => setUserName(event.target.value)}
          ></Input>
        </div>

        <div className="w-full">
          <h2>Enter Your Email</h2>
          <Input
            placeholder="e.g. John@gmail.com"
            onChange={(event) => setUserEmail(event.target.value)}
          ></Input>
        </div>

        <div className="p-3 bg-blue-100 flex gap-4 rounded-lg mt-6">
          <Info className="text-primary" />
          <div>
            <h2 className="font-bold ">Before you begin</h2>
            <ul className="">
              <li className="text-sm text-primary">
                - Test your camera and microphone
              </li>
              <li className="text-sm text-primary">
                - Ensure you have stable internet connection
              </li>
              <li className="text-sm text-primary">
                - Find a Quiet place for interview
              </li>
            </ul>
          </div>
        </div>
        <Button
          className={"mt-5 w-full font-bold"}
          disabled={loading || !userName}
          onClick={() => onJonInterview()}
        >
          <Video />
          {loading && <Loader2Icon />}
          Join Interview
        </Button>
      </div>
    </div>
  );
}

export default Interview;

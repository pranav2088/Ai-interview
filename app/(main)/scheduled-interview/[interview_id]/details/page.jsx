"use client";
import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import InterviewDetailsContainer from "./_components/InterviewDetailsContainer";
import CandidatList from "./_components/CandidatList";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function InterviewDetail() {
  const { interview_id } = useParams();
  const [interviewDetail, setInterviewDetail] = useState();
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    user && GetInterviewDetail();
  }, [user]);
  const GetInterviewDetail = async () => {
    const result = await supabase
      .from("interviews")
      .select(
        `jobPosition,jobDescription,type,questionList,duration,interview_id,created_at,interview-feedback(userEmail,userName,feedback,created_at)`
      )
      .eq("userEmail", user?.email)
      .eq("interview_id", interview_id);
    setInterviewDetail(result?.data[0]);
  };

  return (
    <div className="mt-5">
      <div className="flex gap-5 items-center">
        <ArrowLeft onClick={() => router.back()} className="cursor-pointer" />
        <h2 className="font-bold text-2xl"> Interview Detail</h2>
      </div>
      <InterviewDetailsContainer interviewDetail={interviewDetail} />
      <CandidatList candidateList={interviewDetail?.["interview-feedback"]} />
    </div>
  );
}

export default InterviewDetail;

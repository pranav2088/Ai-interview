"use client";

import React, { useContext } from "react";
import Image from "next/image";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";

function Interviewcompleted() {
  const { interviewInfo } = useContext(InterviewDataContext);

  const onCloseInterview = async () => {
    setLoading(true);
    router.push("/interview/" + interview_id);
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 p-6 ">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-10">
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center">
          <Image
            src="/check.png"
            alt="check"
            height={80}
            width={80}
            className="mb-4"
          />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Interview Completed
          </h2>
          <p className="text-gray-600 mb-8">
            Thank you for participating in the AI-driven interview with{" "}
            <span className="font-medium text-blue-600">Alcrutier</span>.
          </p>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div>
            <p className="text-gray-500 font-semibold">Candidate Name</p>
            {/* <p className="text-gray-800">Pranav Shah</p> */}
            <p className="text-gray-800">{interviewInfo?.userName}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold">Email</p>
            {/* <p className="text-gray-800">pranav@gmail.com</p> */}
            <p className="text-gray-800">{interviewInfo?.userEmail}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold">Status</p>
            <p className="text-green-600 font-semibold">Completed</p>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">
            What’s next?
          </h3>
          <p className="text-gray-700">
            Our recruitment team will carefully review your responses within the
            next{" "}
            <span className="font-medium text-blue-700">2-3 working days</span>.
            If your profile matches our requirements, you will be contacted for
            the next steps.
          </p>
          <p className="mt-4 text-gray-600">
            We appreciate your time and effort. Best of luck!
          </p>

          <Button
            className={"mt-5 w-full font-bold"}
            onClick={() => onCloseInterview()}
          >
            <Video />
            {loading && <Loader2Icon />}
            Close
          </Button>

          <Link
            href="/"
            className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300"
          >
            Close
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Interviewcompleted;

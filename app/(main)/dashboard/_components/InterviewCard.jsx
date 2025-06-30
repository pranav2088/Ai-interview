import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, Send } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

function InterviewCard({ interview, viewDetail = false }) {
  // const url = process.env.NEXT_PUBLIC_HOST_URL + "/" + interview?.interview_id;

  const copyLink = () => {
    if (!interview?.interview_id) {
      toast.error("Interview ID is missing!");
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_HOST_URL;
    if (!baseUrl) {
      toast.error("Host URL is not defined in environment variables!");
      return;
    }

    const url = baseUrl + "/" + interview.interview_id;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const onSend = () => {
    const subject = encodeURIComponent("Aicruiter Interview link");
    const body = encodeURIComponent("Interview link: " + url);
    window.location.href = `mailto:example@pranav.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="p-5 bg-white rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="h-[40px] w-[40px] bg-primary rounded-full"></div>
        <h2 className="text-sm">
          {moment(interview?.created_at).format("DD MMM yyyy")}
        </h2>
      </div>

      <h2 className="mt-3 font-bold text-lg">{interview?.jobPosition}</h2>
      <h2 className="mt-2 flex justify-between text-gray-500">
        {interview?.duration}

        <span className="text-green-700">
          {interview["interview-feedback"]?.length}Candidates
        </span>
      </h2>
      {!viewDetail ? (
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={copyLink}
          >
            <Copy className="h-4 w-4" />
            Copy Link
          </Button>
          <Button className="w-full flex items-center justify-center gap-2">
            <Send className="h-4 w-4" onClick={onSend} />
            Send
          </Button>
        </div>
      ) : (
        <div className="mt-7 flex justify-end">
          <Link
            href={
              "/scheduled-interview/" + interview?.interview_id + "/details"
            }
          >
            <Button
              variant="outline"
              className="group flex items-center gap-2 mt-5 w-full"
            >
              View Details
              <ArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default InterviewCard;

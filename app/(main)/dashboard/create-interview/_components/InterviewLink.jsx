import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Copy,
  List,
  Mail,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
function InterviewLink({ interview_id, formData, CreateInterview }) {
  const url = process.env.NEXT_PUBLIC_HOST_URL + "/" + interview_id;

  const GetInterviewUrl = () => {
    return url;
  };

  const onCopyLink = async () => {
    await navigator.clipboard.writeText(url);
    toast("Link Copied");
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <Image
        src={"/check.png"}
        alt="check"
        height={200}
        width={200}
        className="w-[50px] h-[50px]"
      />
      <h2 className="font-bold text-lg mt-4">Your AI Interview is Ready!</h2>
      <p className="mt-3">
        Share This link with your candidate to start your interview process
      </p>
      <div className="w-full p-7 mt-6 rounded-lg bg-white flex flex-col">
        <div className="flex justify-between items-center">
          <h2 className="font-bold">Interview Link</h2>
          <h2 className=" p-1 px-2 text-primary bg-blue-50 rounded">
            Valid for 30 Days
          </h2>
        </div>
        <div className="mt-3 flex gap-3 items-center ">
          <Input defaultValue={GetInterviewUrl()} disabled={false} />
          <Button onClick={() => onCopyLink()}>
            <Copy /> Copy Link
          </Button>
        </div>
        <hr className="my-5" />
        <div className="flex gap-5">
          <h2 className="text-sm text-gray-500 flex gap-2 items-center">
            <Clock className="h-4 w-4" />
            {formData?.duration}
          </h2>
          <h2 className="text-sm text-gray-500 flex gap-2 items-center">
            <List className="h-4 w-4" />
            10 Question
          </h2>
        </div>
      </div>

      <div className="mt-7 bg-white p-5 rounded-lg w-full">
        <h2 className="font-bold">Share via</h2>
        <div className=" flex gap-7 mt-2">
          <Button variant={"outline"} className={""}>
            <Mail />
            Email
          </Button>

          <Button variant={"outline"} className={""}>
            <Mail />
            Slack
          </Button>

          <Button variant={"outline"} className={""}>
            <Mail />
            Whatsapp
          </Button>
        </div>
      </div>
      <div className="flex w-full gap-5 justify-between mt-6">
        <Link href={"/dashboard"}>
          <Button variant={"outline"}>
            <ArrowLeft />
            Back to Dashboard
          </Button>
        </Link>

        <div className="flex justify-end">
          <Button
            onClick={() => CreateInterview()}
            className="group flex items-center gap-2"
          >
            <Plus />
            Create New Interview
            <ArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InterviewLink;

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
function CandidateFeedbackDialog({ candidate }) {
  const feedback = candidate?.feedback?.feedback;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-primary">
          View Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Feedback</DialogTitle>
          <DialogDescription asChild>
            <div className="mt-5">
              <div className="flex items-center justify-between ">
                <div className="flex items-center gap-5">
                  <h2 className="bg-primary p-3 px-4.5 font-bold text-white rounded-full">
                    {candidate?.userName[0]}
                  </h2>
                  <div>
                    <h2 className="font-bold">{candidate?.userName}</h2>
                    <h2 className="text-sm text-gray-500">
                      {candidate?.userEmail}
                    </h2>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <h2 className="text-primary text-2xl font-bold">
                    {(() => {
                      const ratings = feedback?.rating;
                      const values = [
                        ratings?.technicalSkills,
                        ratings?.communication,
                        ratings?.problemSloving,
                        ratings?.experince,
                      ].filter((v) => typeof v === "number");

                      const average =
                        values.length > 0
                          ? (
                              values.reduce((a, b) => a + b, 0) / values.length
                            ).toFixed(1)
                          : "0";

                      return `${average}/10`;
                    })()}
                  </h2>
                </div>
              </div>

              <div className="mt-5">
                <h2 className="font-bold">Skill Assesment</h2>
                <div className="mt-3 grid grid-cols-2 gap-10">
                  <div>
                    <h2 className="flex justify-between">
                      Technical SKills{" "}
                      <span>{feedback?.rating?.technicalSkills}/10</span>
                    </h2>
                    <Progress
                      value={feedback?.rating?.technicalSkills * 10}
                      className={"mt-1"}
                    />
                  </div>

                  <div>
                    <h2 className="flex justify-between">
                      Communication{" "}
                      <span>{feedback?.rating?.communication}/10</span>
                    </h2>
                    <Progress
                      value={feedback?.rating?.communication * 10}
                      className={"mt-1"}
                    />
                  </div>

                  <div>
                    <h2 className="flex justify-between">
                      Problem Sloving{" "}
                      <span>{feedback?.rating?.problemSolving}/10</span>
                    </h2>
                    <Progress
                      value={feedback?.rating?.problemSolving * 10}
                      className={"mt-1"}
                    />
                  </div>

                  <div>
                    <h2 className="flex justify-between">
                      Experince <span>{feedback?.rating?.experience}/10</span>
                    </h2>
                    <Progress
                      value={feedback?.rating?.experience * 10}
                      className={"mt-1"}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <h2 className="font-bold">Performance Summery</h2>
                <div className="p-5 bg-secondary mt-3 rounded-md">
                  {feedback?.summary}
                </div>
              </div>

              <div
                className={`p-5 mt-10 flex items-center justify-between rounded-md ${
                  feedback?.recommendation === "No"
                    ? "bg-red-100"
                    : "bg-green-100"
                }`}
              >
                <div>
                  <h2
                    className={`font-bold ${
                      feedback?.recommendation === "No"
                        ? "text-red-700"
                        : "text-green-700"
                    }`}
                  >
                    Recommendation Msg:
                  </h2>
                  <p
                    className={`${
                      feedback?.recommendation === "No"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {feedback?.recommendationMsg}
                  </p>
                </div>
                <Button
                  className={`${
                    feedback?.recommendation === "No"
                      ? "bg-red-700"
                      : "bg-green-700"
                  }`}
                  disable={true}
                >
                  Send Msg
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CandidateFeedbackDialog;

import { Button } from "@/components/ui/button";
import moment from "moment";
import React from "react";
import CandidateFeedbackDialog from "./CandidateFeedbackDialog";

function CandidatList({ candidateList }) {
  return (
    <div className="">
      <h2 className="font-bold my-5">Candidates ({candidateList?.length})</h2>
      {candidateList?.map((candidate, index) => (
        <div
          key={index}
          className="p-5 flex gap-3 items-center justify-between bg-white rounded-lg mt-5"
        >
          <div className="flex items-center gap-5">
            <h2 className="bg-primary p-3 px-4.5 font-bold text-white rounded-full">
              {candidate?.userName[0]}
            </h2>
            <div>
              <h2 className="font-bold">{candidate?.userName}</h2>
              <h2 className="text-sm text-gray-500">
                Completed on:
                {moment(candidate?.created_at).format("MMM DD, yyyy")}
              </h2>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <h2 className="text-green-600">
              {(() => {
                const ratings = candidate?.feedback?.feedback?.rating;
                const values = [
                  ratings?.technicalSkills,
                  ratings?.communication,
                  ratings?.problemSloving,
                  ratings?.experince,
                ].filter((v) => typeof v === "number"); // avoid undefined/null

                const average =
                  values.length > 0
                    ? (
                        values.reduce((a, b) => a + b, 0) / values.length
                      ).toFixed(1)
                    : "0";

                return `${average}/10`;
              })()}
            </h2>

            <CandidateFeedbackDialog candidate={candidate} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default CandidatList;

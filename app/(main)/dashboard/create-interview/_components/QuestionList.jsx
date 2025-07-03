import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2, Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import QuestionListContainer from "./QuestionListContainer";
import { useUser } from "@/app/provider";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/services/supabaseClient";

function QuestionList({ formData, onCreateLink }) {
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const [questionList, setQuestionList] = useState([]);
  const { user } = useUser();
  useEffect(() => {
    if (formData) {
      GenerateQuestionList();
    }
  }, [formData]);

  const onFinish = async () => {
    setSaveLoading(true);
    const interview_id = uuidv4();
    const { data, error } = await supabase
      .from("interviews")
      .insert([
        {
          ...formData,
          questionList: questionList,
          userEmail: user?.email,
          interview_id: interview_id,
        },
      ])
      .select();

    //Update user credits
    const userUpdate = await supabase
      .from("Users")
      .update({ credits: Number(user?.credits) - 1 })
      .eq("email", user?.email)
      .select();
    setSaveLoading(false);
    onCreateLink(interview_id);
  };

  const GenerateQuestionList = async () => {
    setLoading(true);

    try {
      const result = await axios.post("/api/ai-model", { ...formData });
      const content = result?.data?.content;

      if (typeof content !== "string") {
        toast("No content received from AI.");
        return;
      }

      let parsed = null;

      // First try: Extract from ```json ... ```
      const jsonCodeBlock = content.match(/```json\s*([\s\S]*?)```/i);
      if (jsonCodeBlock) {
        try {
          parsed = JSON.parse(jsonCodeBlock[1]);
        } catch (e) {
          console.error("Failed to parse JSON from ```json block:", e);
        }
      }

      // Fallback: Try to find and fix raw JSON object
      if (!parsed) {
        const fallbackMatch = content.match(/{[\s\S]*}/);
        if (fallbackMatch) {
          let cleaned = fallbackMatch[0];

          // Clean up known formatting errors
          cleaned = cleaned
            .replace(/,\s*}/g, "}") // trailing commas
            .replace(/,\s*]/g, "]") // trailing commas in arrays
            .replace(/(\w+):/g, '"$1":') // ensure keys are quoted (optional, if necessary)
            .replace(/“|”/g, '"'); // fix smart quotes

          try {
            parsed = JSON.parse(cleaned);
          } catch (e) {
            console.error("Cleaned fallback JSON parsing failed:", e);
            toast("AI returned invalid JSON. Please try again.");
          }
        } else {
          toast("No valid JSON structure found in AI response.");
        }
      }

      // If successful, update state
      if (parsed && parsed.interviewQuestions) {
        setQuestionList(parsed.interviewQuestions);
      } else {
        toast("AI response does not contain valid questions.");
      }
    } catch (e) {
      console.error("Error calling AI model:", e);
      toast("Server error while generating questions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div className="p-5 bg-blue-50 rounded-xl border border-primary flex gap-5 items-center">
          <Loader2Icon className="animate-spin" />
          <div>
            <h2 className="font-medium">Generating Interview Questions</h2>
            <p className="text-primary">
              Our AI is crafing personalized questions bases on your job
              position
            </p>
          </div>
        </div>
      )}

      <div>
        <QuestionListContainer questionList={questionList} />
      </div>

      <div className="flex justify-end mt-10">
        <Button onClick={() => onFinish()} disabled={saveLoading}>
          {saveLoading && <Loader2 className="animate-spin" />}
          Create Interview Link & Finish
        </Button>
      </div>
    </div>
  );
}

export default QuestionList;

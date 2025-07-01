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
      const result = await axios.post("/api/ai-model", {
        ...formData,
      });

      const content = result?.data?.content;

      if (typeof content === "string") {
        // Try to extract a ```json block first (AI-friendly format)
        const jsonBlockMatch = content.match(/```json\s*([\s\S]*?)\s*```/i);

        if (jsonBlockMatch) {
          try {
            const parsed = JSON.parse(jsonBlockMatch[1]);
            setQuestionList(parsed.interviewQuestions || []);
          } catch (e) {
            console.error("JSON inside code block is invalid:", e);
            toast("Received malformed JSON from AI response.");
          }
        } else {
          // Fallback: Try to extract a raw JSON object from the text
          const fallbackMatch = content.match(/{[\s\S]*?}/);
          if (fallbackMatch) {
            try {
              const parsed = JSON.parse(fallbackMatch[0]);
              setQuestionList(parsed.interviewQuestions || []);
            } catch (e) {
              console.error("Fallback JSON parsing failed:", e);
              toast("Unable to parse questions. AI returned bad format.");
            }
          } else {
            toast("No valid JSON found in AI response.");
          }
        }
      } else {
        toast("No content received from AI.");
      }
    } catch (e) {
      console.error("Error calling AI model:", e);
      toast("Server error. Try again!");
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

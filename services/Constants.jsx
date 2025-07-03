import {
  BriefcaseBusiness,
  BriefcaseBusinessIcon,
  Calendar,
  Code2Icon,
  GroupIcon,
  LayoutDashboard,
  List,
  Puzzle,
  Settings,
  User2Icon,
  WalletCards,
} from "lucide-react";

export const SideBarOptions = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Scheduled Interview",
    icon: Calendar,
    path: "/scheduled-interview",
  },
  {
    name: "All Interview",
    icon: List,
    path: "/all-interview",
  },
  // {
  //   name: "Billing",
  //   icon: WalletCards,
  //   path: "/billing",
  // },
  // {
  //   name: "Settings",
  //   icon: Settings,
  //   path: "/settings",
  // },
  {
    name: "Logout",
    icon: Settings,
    path: "/",
  },
];

export const InterviewType = [
  {
    title: "Technical",
    icon: Code2Icon,
  },
  {
    title: "Behavioral",
    icon: User2Icon,
  },
  {
    title: "Experience",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Problem Sloving",
    icon: Puzzle,
  },
  {
    title: "Leadership",
    icon: GroupIcon,
  },
];

export const QUESTION_PROMPT = `
You are an expert technical interviewer and your task is to generate a realistic set of interview questions.

Inputs:
- Job Title: {{jobTitle}}
- Job Description: {{jobDescription}}
- Interview Duration: {{duration}} minutes
- Interview Type: {{type}} (e.g., Technical, Behavioral, Mixed)

Instructions:
1. Analyze the job description to identify key responsibilities, technical skills, soft skills, and experience expectations.
2. Based on the interview duration, generate an appropriate number of high-quality, relevant questions.
3. Balance the depth and difficulty of the questions according to the interview type and time available.
4. Ensure the questions are realistic and appropriate for a real-world {{type}} interview.
5. Include a mix of categories: Technical, Behavioral, Experience-Based, Problem-Solving, Leadership (if relevant).

Respond only in the following JSON format:

{
  "interviewQuestions": [
    {
      "question": "<Insert the question here>",
      "type": "Technical | Behavioral | Experience | Problem Solving | Leadership"
    },
    ...
  ]
}

`;

export const FEEDBACK_PROMPT = `
You are an AI interview evaluator.

Below is a transcript of a technical interview conversation between an assistant and a user (candidate):

{{conversation}}

Based on the conversation, generate a detailed feedback report about the candidate's performance. Evaluate the candidate fairly and critically, considering the correctness of their answers, clarity of communication, and demonstration of experience.

Assume the candidate is applying for a technical role. You are to assess and rate them accordingly.

Your feedback must include:

1. A rating out of 10 in each of the following categories:
   - technicalSkills: Based on depth of knowledge and correctness of answers
   - communication: Clarity, confidence, and articulation of thoughts
   - problemSolving: Ability to approach and break down questions logically
   - experience: Indicators of past hands-on work or project exposure

2. A brief summary of the interview in exactly 3 lines.

3. A hiring recommendation:
   - recommendation: "Yes" or "No"
   - recommendationMsg: One-line justification of your recommendation

Respond **strictly** in the following JSON format:

{
  "feedback": {
    "rating": {
      "technicalSkills": <number>,
      "communication": <number>,
      "problemSolving": <number>,
      "experience": <number>
    },
    "summary": "<3-line summary>",
    "recommendation": "<Yes or No>",
    "recommendationMsg": "<one-line reason>"
  }
}
`;

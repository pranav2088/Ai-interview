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

export const QUESTION_PROMPT = `You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions:
Job Title: {{jobTitle}}
Job Description:{{jobDescription}}
Interview Duration: {{duration}}
Interview Type: {{type}}
Your task:
Analyze the job description to identify key responsibilities, required skills, and expected experience.
Generate a list of interview questions depends on interview duration
Adjust the number and depth of questions to match the interview duration.
Ensure the questions match the tone and structure of a real-life (type)} interview. a* Format your response in JSON format with array list of questions. format: interviewQuestions=[
question:",
type: Technical/Behavioral/Experince/Problem Solving/Leaseship'
...
The goal is to create a structured, relevant, and time-optimized interview plan for a (job Title]) role.*
`;

export const FEEDBACK_PROMPT = `{{conversation}}
Depends on this Interview Conversation between assitant and user,Give me feedback for user interview. Give me rating out of 10 for technical Skills,Communication , Problem  Sloving,Experince. Also give me  Summery in 3 Lines about the interview and one line to let me know wheather is recommanded 
for hire or not with msg.Give me response in JSON format
{
        feedback:{
            rating:{
              technicalSkills:5,
              communication:6,
              problemSloving:4,
              experince:7
            },
           summery:<in 3 line>,
           Recommendation:",
           RecommendationMsg:"  
        }
}`;

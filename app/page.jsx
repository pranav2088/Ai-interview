import { Button } from "@/components/ui/button";
import Image from "next/image";
import Provider from "./provider";
import Login from "./auth/page";

export default function Home() {
  return (
    <div>
      <Login />
    </div>
  );
}

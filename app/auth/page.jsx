"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";
import { useRouter } from "next/navigation";

function Login() {
  const router = useRouter();

  //  used to sign In With Google
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://ai-interview-vert-three.vercel.app", // your deployed domain
      },
    });
    //ai-interview-vert-three.vercel.app
    https: if (error) {
      console.error("Error", error.message);
    }
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.push("/dashboard");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center border rounded-2xl p-8">
        <div className="flex items-center flex-col">
          <Image
            src={"/login.jpeg"}
            alt="login"
            width={200}
            height={160}
            className="w-[400px] h-[250px] rounded-2xl"
          />
          <h2 className="text-2xl font-bold text-center mt-5">Welcome to AI</h2>
          <p className="text-gray-500 text-center">Sign In with Google </p>
          <Button className={"mt-7 w-full"} onClick={signInWithGoogle}>
            Login with Google
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;

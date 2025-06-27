"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";

function Login() {
  //  used to sign In With Google
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      console.error("Error", error.message);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center border rounded-2xl p-8">
        <Image
          src={"/logo.png"}
          alt="logo"
          width={200}
          height={150}
          className="w-[100px]"
        />
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

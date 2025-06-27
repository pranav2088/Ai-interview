"use client";

import { UserDetailContext } from "@/context/UserDetailContext";
import { supabase } from "@/services/supabaseClient";
import { Users } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";

function Provider({ children }) {
  const [user, setUser] = useState();
  useEffect(() => {
    CreateNewUser();
  }, []);
  const CreateNewUser = async () => {
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      console.error("Auth error or user not found:", authError);
      return;
    }

    const { data: existingUsers, error: fetchError } = await supabase
      .from("Users")
      .select("*")
      .eq("email", authUser.email);

    if (fetchError) {
      console.error("Error fetching user:", fetchError);
      return;
    }

    if (!existingUsers || existingUsers.length === 0) {
      const { data: newUser, error: insertError } = await supabase
        .from("Users")
        .insert([
          {
            name: authUser.user_metadata?.name || "",
            email: authUser.email,
            picture: authUser.user_metadata?.picture || "",
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting user:", insertError);
        return;
      }

      setUser(newUser);
      return;
    }

    setUser(existingUsers[0]);
  };

  return (
    <UserDetailContext.Provider value={{ user, setUser }}>
      <div>{children}</div>;
    </UserDetailContext.Provider>
  );
}

export default Provider;

export const useUser = () => {
  const context = useContext(UserDetailContext); // ✅ Correct
  if (!context) {
    throw new Error("useUser must be used within a <Provider>");
  }
  return context;
};

"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SideBarOptions } from "@/services/Constants";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import React from "react";
import { supabase } from "@/services/supabaseClient";
import { toast } from "sonner";

export function AppSidebar() {
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (!data.session) {
          toast.error("Auth session missing! Please log in again.");
          router.push("/");
        }
      } catch (e) {
        console.error("Session check error:", e);
        toast.error("Something went wrong while checking auth.");
        router.push("/");
      }
    };

    checkSession();
  }, [router]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error.message);
    } else {
      toast.success("Logged out successfully");
      router.push("/");
    }
  };

  const handleClick = async (item) => {
    if (item.name === "Logout") {
      await handleLogout();
    } else {
      router.push(item.path);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className={"flex items-center mt-5"}>
        <Image
          src={"/logo.png"}
          alt="logo"
          height={100}
          width={100}
          className="w-[150]"
        />
        <Button className={"w-full mt-5"}>
          <Plus />
          Create new Interview{" "}
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarContent>
            <SidebarMenu>
              {SideBarOptions.map((option, index) => (
                <SidebarMenuItem key={index} className={"p-1"}>
                  <SidebarMenuButton
                    onClick={() => handleClick(option)}
                    className={`${path === option.path && "bg-blue-50"}`}
                  >
                    <option.icon
                      className={`${path === option.path && "text-primary"}`}
                    />
                    <span
                      className={`${path === option.path && "text-primary"}`}
                    >
                      {option.name}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

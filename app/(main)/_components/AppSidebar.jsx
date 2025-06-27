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
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const path = usePathname();
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
                    asChild
                    className={`${path == option.path && "bg-blue-50"}`}
                  >
                    <Link href={option.path}>
                      <option.icon
                        className={`${path == option.path && "text-primary"}`}
                      />
                      <span
                        className={`${path == option.path && "text-primary"}`}
                      >
                        {option.name}
                      </span>
                    </Link>
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

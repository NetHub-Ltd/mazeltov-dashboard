"use client";
import React from "react";
import { useAuthenticatedUser } from "@/lib/hooks/useUser";

const Dashboard = () => {
  const user = useAuthenticatedUser();
  return <div>Dashboard Welcome, {user?.user?.name}!
    {/* big and bold welcome message here */}
    
    {/* some analytics cards here, use dummy values for now */}
  
  </div>;
};

export default Dashboard;

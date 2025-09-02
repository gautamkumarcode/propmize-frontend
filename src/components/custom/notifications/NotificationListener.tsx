"use client";

import { useSocketNotifications } from "@/hooks/useSocketNotifications";
import { FC } from "react";

/**
 * Component that listens for real-time notifications via Socket.IO
 * This component doesn't render anything visible, it just sets up the socket listeners
 * 
 * The useSocketNotifications hook handles authentication checks internally
 * and follows React's Rules of Hooks by always being called at the top level
 */
const NotificationListener: FC = () => {
  // Always call hooks at the top level
  useSocketNotifications();
  
  // This component doesn't render anything
  return null;
};

export default NotificationListener;
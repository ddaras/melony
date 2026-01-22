import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./elements/Icon";
import { ThreadList } from "./thread-list";
import { useThreads } from "@/hooks/use-threads";
import { motion, AnimatePresence } from "framer-motion";

interface NavItemProps {
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon, label, active, onClick }: NavItemProps) => (
  <motion.div 
    className="relative group"
    onClick={onClick}
    whileTap={{ scale: 0.92 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    <div className={cn(
      "flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer transition-all duration-300",
      active 
        ? "bg-zinc-100 dark:bg-zinc-800 text-primary shadow-sm" 
        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
    )}>
      <Icon name={icon} size={20} color={active ? "primary" : undefined} />
    </div>
    
    {/* Tooltip */}
    <div className="absolute left-12 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 translate-x-1 group-hover:translate-x-0">
      {label}
      {/* Tooltip Arrow */}
      <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-zinc-900 dark:border-r-zinc-100" />
    </div>
  </motion.div>
);

export function FloatingLayout({ 
  children,
  navPosition = "side"
}: { 
  children: React.ReactNode;
  navPosition?: "side" | "top";
}) {
  const [isChatsOpen, setIsChatsOpen] = useState(false);
  const { createThread } = useThreads();

  const handleNewChat = async () => {
    await createThread();
    setIsChatsOpen(false);
  };

  const isSide = navPosition === "side";

  return (
    <div className="relative min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 text-foreground overflow-hidden font-sans">
      {/* Minimalist Logo */}
      <div className="fixed top-6 left-6 z-50">
        <div className="w-10 h-10 flex items-center justify-center cursor-pointer group">
          <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black transition-transform duration-300 group-hover:scale-110">
            <Icon name="IconInnerShadowTopRight" size={20} className="text-zinc-100 dark:text-zinc-900" />
          </div>
        </div>
      </div>

      {/* Simplified Navigation (Always vertical) */}
      <div className={cn(
        "fixed left-6 z-50 flex flex-col gap-2 transition-all duration-500",
        isSide 
          ? "top-1/2 -translate-y-1/2" 
          : "top-24"
      )}>
        <NavItem icon="IconHome" label="Home" active />
        <NavItem icon="IconSearch" label="Search" />
        <NavItem icon="IconCompass" label="Explore" />
        <NavItem 
          icon="IconMessageCircle" 
          label="Chats" 
          onClick={() => setIsChatsOpen(!isChatsOpen)}
          active={isChatsOpen}
        />
        <NavItem icon="IconHeart" label="Activity" />
        <NavItem icon="IconSquarePlus" label="Create" />
        <NavItem icon="IconUserCircle" label="Profile" />
      </div>

      {/* Chats Sidebar/Popover */}
      <AnimatePresence>
        {isChatsOpen && (
          <>
            {/* Backdrop to close on click outside */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/2 dark:bg-black/10" 
              onClick={() => setIsChatsOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, x: -12, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.96, x: -8, filter: "blur(8px)" }}
              transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 32,
                mass: 0.8
              }}
              className={cn(
                "fixed left-[88px] z-40 w-80 h-[600px] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl overflow-hidden flex flex-col",
                isSide
                  ? "top-1/2 -translate-y-1/2"
                  : "top-24"
              )}
            >
              <div className="p-5 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Recent Chats</h3>
                    <p className="text-xs text-zinc-500 mt-1">Continue where you left off</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                    <Icon name="IconHistory" size={18} />
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-2">
                <ThreadList padding="sm" gap="xs" />
              </div>
              <div className="p-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800">
                <button 
                  onClick={handleNewChat}
                  className="w-full py-2.5 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Icon name="IconPlus" size={16} />
                  New Chat
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Minimalist Bottom Left */}
      <div className="fixed bottom-8 left-8 z-50 flex items-center gap-3">
        <div className="p-2.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer transition-colors">
          <Icon name="IconMenu2" size={20} />
        </div>
        <div className="p-2.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer transition-colors">
          <Icon name="IconSettings" size={20} />
        </div>
      </div>

      {/* Minimalist Bottom Right */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="px-3 py-1.5 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-full border border-zinc-200/50 dark:border-zinc-800/50 text-[10px] font-medium text-zinc-400 tracking-wider uppercase">
          Studio 0.1
        </div>
      </div>

      {/* Main Content */}
      <main className="h-screen w-full flex items-center justify-center">
        <div className="h-full w-full overflow-hidden relative">
          {children}
        </div>
      </main>
    </div>
  );
}

"use client";
import { SessionProvider } from "next-auth/react";
import UserButton from "@/components/user-button";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col bg-[#212121] text-white"> {/* Updated Background Color */}
        {/* Header */}
        <header className="w-full px-4 py-0.2 bg-gray-900 shadow-md flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <Sparkles className="h-6 w-6 text-pink-400" />
            <h1 className="text-xl font-bold">StyleBuddy</h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <UserButton />
          </motion.div>
        </header>

        {/* Main Content */}
        <main className="flex flex-col items-center justify-center flex-grow px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-300"
          >
            Your AI Fashion Companion
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg text-gray-300 mt-4 max-w-lg"
          >
            Get smart outfit recommendations based on your style preferences and the latest trends.
          </motion.p>
        </main>
      </div>
    </SessionProvider>
  );
}

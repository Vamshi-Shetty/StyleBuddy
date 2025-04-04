import Sidebar from "@/components/sidebar";
import Chatbot from "@/components/chatbot";

export default function ChatPage() {
  return (
    <div className="flex h-screen">
      {/* Sidebar stays on the left */}
      {/* <Sidebar /> */}
      
      {/* Chatbot occupies the remaining space */}
      <div className="flex-1 bg-gray-100">
        <Chatbot />
      </div>
    </div>
  );
}

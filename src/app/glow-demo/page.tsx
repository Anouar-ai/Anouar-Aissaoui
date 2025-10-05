
'use client';
import { GlowCard } from "@/components/ui/spotlight-card";
import { Bot, Code, Paintbrush } from "lucide-react";

export default function GlowDemoPage() {
  return (
    <div className="w-screen min-h-screen flex flex-col lg:flex-row items-center justify-center gap-10 bg-gray-950 text-white p-8">
      <GlowCard glowColor="purple">
        <div className="flex flex-col items-center justify-center text-center h-full">
          <Bot size={48} className="mb-4 text-purple-300" />
          <h3 className="text-xl font-bold mb-2">AI Integration</h3>
          <p className="text-sm text-gray-300">
            Leverage the power of generative AI in your applications.
          </p>
        </div>
      </GlowCard>
      <GlowCard glowColor="green">
        <div className="flex flex-col items-center justify-center text-center h-full">
          <Code size={48} className="mb-4 text-green-300" />
          <h3 className="text-xl font-bold mb-2">Secure Backend</h3>
          <p className="text-sm text-gray-300">
            Robust, scalable, and secure backend services.
          </p>
        </div>
      </GlowCard>
      <GlowCard glowColor="orange">
        <div className="flex flex-col items-center justify-center text-center h-full">
          <Paintbrush size={48} className="mb-4 text-orange-300" />
          <h3 className="text-xl font-bold mb-2">Modern UI</h3>
          <p className="text-sm text-gray-300">
            Beautiful and responsive user interfaces with Tailwind CSS.
          </p>
        </div>
      </GlowCard>
    </div>
  );
};

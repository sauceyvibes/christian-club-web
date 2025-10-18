import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Heart, MessageCircle, HelpCircle, Users} from "lucide-react";
import {Cross} from "@phosphor-icons/react";

export default function Layout({ children }) {
  const location = useLocation();
  const isForums = location.pathname.startsWith("/forums") || location.pathname.startsWith("/forum-post" || location.pathname.startsWith("/create-post"));

  const navigation = [
    {
      name: "Questions",
      href: createPageUrl("Questions"),
      icon: HelpCircle,
      description: "Browse anonymous questions"
    },
    {
      name: "Ask Question",
      href: createPageUrl("AskQuestion"),
      icon: MessageCircle,
      description: "Ask anonymously"
    },
    {
      name: "Forums",
      href: createPageUrl("Forums"),
      icon: Users,
      description: "Community discussions"
    }
  ];

  const titleGradient = isForums
  ? "bg-gradient-to-r from-purple-600 to-blue-600" // Forums color
  : "bg-gradient-to-r from-blue-600 to-indigo-700";  // Questions default

    const titlename = isForums
  ? "Downriver Christian Forums" // Forums color
  : "Downriver Christian Questions";  // Questions default

    const iconbg = isForums
  ? "bg-gradient-to-r from-purple-600 to-purple-600" // Forums color
  : "bg-gradient-to-r from-sky-400 to-sky-400";  // Questions default

  const isActive = (href) => location.pathname === href;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <style jsx>{`
        :root {
          --primary-blue: #3b82f6;
          --soft-blue: #dbeafe;
          --warm-white: #fefefe;
          --gentle-gray: #64748b;
          --peace-blue: #1e40af;
        }
        
        .peaceful-shadow {
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06);
        }
        
        .gentle-hover:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px -5px rgba(59, 130, 246, 0.2);
        }
      `}</style>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50 peaceful-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to={createPageUrl("Questions")} className="flex items-center gap-3 hover:opacity-80 transition-all duration-300">
              <div className={`w-10 h-10 ${iconbg} rounded-lg flex items-center justify-center peaceful-shadow`}>
                <Cross className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${titleGradient} bg-clip-text text-transparent`}>
                  {titlename}
                </h1>
                <p className="text-sm text-slate-500 -mt-1">Anonymous Christian Q&A & Forums</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 gentle-hover ${
                    isActive(item.href)
                      ? "bg-blue-100 text-blue-700 peaceful-shadow"
                      : "text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-blue-100 peaceful-shadow">
        <div className="px-4 py-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                isActive(item.href)
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-600 hover:text-blue-700 hover:bg-blue-50"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-slate-500">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-md border-t border-blue-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-400" />
              <p className="text-slate-600">
                A safe space for faith questions and community discussion
              </p>
            </div>
            <p className="text-sm text-slate-500">
              "Ask and it will be given to you; seek and you will find; knock and the door will be opened to you." - Matthew 7:7
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
"use client";

import { Video, Users, Share2, Shield, Brain, Eye } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[38rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-200/70 via-purple-200/60 to-pink-200/60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 translate-x-1/3 translate-y-1/3 rounded-full bg-gradient-to-tr from-emerald-200/60 via-teal-200/50 to-cyan-200/60 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16">
        {/* Header */}
        <header className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
            <Brain className="h-4 w-4" />
            Powered by AI
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Interview Smarter with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              AI Insights
            </span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl">
            Conduct professional video interviews with real-time emotion detection, 
            confidence analysis, and eye contact tracking powered by advanced AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link 
              href="/setup-call"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:shadow-xl hover:-translate-y-0.5"
            >
              <Video className="h-5 w-5" />
              Create Video Call
            </Link>
            
            <Link 
              href="/setup-call"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-800 shadow-lg transition hover:border-gray-400 hover:shadow-xl hover:-translate-y-0.5"
            >
              <Share2 className="h-5 w-5" />
              Join with Link
            </Link>

            <Link 
              href="/test-video"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-orange-300 bg-orange-50 px-8 py-4 text-lg font-semibold text-orange-800 shadow-lg transition hover:border-orange-400 hover:shadow-xl hover:-translate-y-0.5"
            >
              <Video className="h-5 w-5" />
              Test Video
            </Link>
          </div>
        </header>

        {/* Features Grid */}
        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-lg backdrop-blur-sm transition hover:shadow-xl hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white mb-4">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Emotion Detection</h3>
            <p className="text-gray-600">
              Real-time analysis of facial expressions to understand emotional states during interviews.
            </p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-lg backdrop-blur-sm transition hover:shadow-xl hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white mb-4">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Eye Contact Tracking</h3>
            <p className="text-gray-600">
              Monitor engagement levels through advanced eye contact detection algorithms.
            </p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-lg backdrop-blur-sm transition hover:shadow-xl hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              End-to-end encrypted video calls with secure room generation and access control.
            </p>
          </div>
        </section>

        {/* How it Works */}
        <section className="rounded-3xl border border-white/70 bg-white/70 p-8 shadow-lg backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center space-y-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="font-semibold text-gray-900">Create or Join</h3>
              <p className="text-sm text-gray-600">
                Start a new interview room or join with a shared link
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="font-semibold text-gray-900">Enable AI Analysis</h3>
              <p className="text-sm text-gray-600">
                Turn on emotion detection for insightful interview analytics
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="font-semibold text-gray-900">Get Real Insights</h3>
              <p className="text-sm text-gray-600">
                Receive live feedback on confidence, engagement, and emotional responses
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-6 rounded-3xl border border-white/70 bg-gradient-to-br from-blue-600 to-purple-600 p-8 shadow-lg backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-white">
            Ready to Transform Your Interviews?
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Join thousands of professionals who are already using AI-powered insights 
            to make better hiring decisions.
          </p>
          <Link 
            href="/setup-call"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-lg transition hover:shadow-xl hover:-translate-y-0.5"
          >
            <Users className="h-5 w-5" />
            Start Your First Interview
          </Link>
        </section>
      </div>
    </div>
  );
}

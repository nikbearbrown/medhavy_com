import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import PrimaryButton from "@/components/ui/primary-button"
import SecondaryButton from "@/components/ui/secondary-button"

export const metadata: Metadata = {
  title: "Dewey - AI-Powered Educational Intelligence",
  description: "An open-source, agent-based AI educational framework designed to transform how we learn and teach through personalized, interactive experiences",
}

export default function DeweyPage() {
  return (
    <div className="container px-4 md:px-6 mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Dewey</h1>
          <p className="text-xl text-muted-foreground mb-8">
            An open-source, agent-based AI educational framework designed to transform how we learn and teach. Named after educational philosopher John Dewey, this framework orchestrates specialized AI agents to deliver personalized, interactive educational experiences across disciplines.
          </p>
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/videoseries?si=zLM5TzprVSw2H90T&amp;list=PLgOGgHS58rB_FwoBNQrC-4FvHb9lvN3kt"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-12">
          <section>
            <h2 className="text-3xl font-bold mb-6">About the Framework</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>
                The Dewey framework is an open-source platform for AI-powered educational intelligence. This experimental project creates an ecosystem of specialized educational agents orchestrated by a central coordination layer to transform learning experiences for students, educators, and professionals.
              </p>
              
              <p>
                Led by Medhavy, this educational experiment emphasizes learning through building, inviting contributors to discover effective approaches through practical implementation rather than claiming definitive solutions.
              </p>
              
              <h3 className="text-xl font-bold mt-8 mb-4">Agent-Based Architecture</h3>
              
              <p>
                The Dewey framework organizes specialized agents into categories, each focused on different aspects of the educational experience:
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-bold">1. Content Generation Agents</h4>
                  <p className="text-sm">Create personalized learning materials, intelligent AI books, and dynamic educational content tailored to individual learning styles and needs.</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-bold">2. Tutorial Agents</h4>
                  <p className="text-sm">Guide learners through complex topics with step-by-step explanations, Socratic questioning, and adaptive scaffolding techniques.</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-bold">3. Assessment Agents</h4>
                  <p className="text-sm">Analyze learner performance, provide formative feedback, and adapt content difficulty based on demonstrated understanding.</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-bold">4. Simulation Agents</h4>
                  <p className="text-sm">Create interactive learning environments, algorithm visualizations, and scientific simulations for hands-on experiential learning.</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-bold">5. Mentor Agents</h4>
                  <p className="text-sm">Provide personalized guidance, encouragement, and metacognitive support throughout the learning journey.</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-bold">6. Career Development Agents</h4>
                  <p className="text-sm">Assist with resume optimization, mock interviews, and professional skill development for job readiness.</p>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mt-8 mb-4">The Dewey Orchestration Layer</h3>
              
              <p>
                At the heart of the framework is the Dewey orchestration layer, which coordinates the activities of specialized agents to create cohesive educational experiences:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-bold mb-2">Cross-Agent Validation</h4>
                  <p className="text-sm text-muted-foreground">Ensures consistency across educational content and experiences created by different agents.</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-bold mb-2">Dynamic Task Allocation</h4>
                  <p className="text-sm text-muted-foreground">Assigns educational tasks to specialized agents based on learner needs and educational objectives.</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-bold mb-2">Learning Pathway Optimization</h4>
                  <p className="text-sm text-muted-foreground">Creates personalized learning journeys based on individual goals, prior knowledge, and learning styles.</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-bold mb-2">Ethical Guardrails</h4>
                  <p className="text-sm text-muted-foreground">Maintains educational integrity by ensuring AI assists learning rather than bypassing it.</p>
                </div>
              </div>
              
              <p className="mt-8">
                The Dewey orchestration layer ensures these specialized agents collaborate effectively, just as Dewey himself integrated multiple educational approaches. By joining our community, you'll help develop these agentic systems that are already enhancing personalized learning and democratizing access to quality education.
              </p>
              
              <div className="mt-8 flex flex-col md:flex-row gap-4 items-start">
                <a 
                  href="https://github.com/Humanitariansai/Dewey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                    <path d="M9 18c-4.51 2-5-2-7-2"></path>
                  </svg>
                  GitHub: Dewey Framework
                </a>
                
                <a 
                  href="https://youtube.com/playlist?list=PLgOGgHS58rB_FwoBNQrC-4FvHb9lvN3kt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                    <path d="m10 15 5-3-5-3z"></path>
                  </svg>
                  YouTube: Dewey Playlist
                </a>
                
                <a 
                  href="mailto:info@humanitarians.ai"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                  Email: info@humanitarians.ai
                </a>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">Key Projects</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-bold mb-3">Intelligent AI Books (Medhavy)</h3>
                <p className="text-muted-foreground mb-4">
                  Transforming learning through personalized conversational AI books that adapt content to individual learners, solving the "chicken and egg" problem by guiding conversations through dynamic Socratic dialogue.
                </p>
              </div>
              
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-bold mb-3">Subject-Specific Chatbots</h3>
                <p className="text-muted-foreground mb-4">
                  Specialized educational chatbots including Ada (calculus), Newton (physics), and Grace (algorithms) that provide step-by-step guidance through complex concepts with interactive visualizations.
                </p>
              </div>
              
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-bold mb-3">Botspeak</h3>
                <p className="text-muted-foreground mb-4">
                  A comprehensive program teaching people how to effectively communicate with Large Language Models (LLMs) through practical tutorials, democratizing access to AI capabilities.
                </p>
              </div>
              
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-bold mb-3">Case Crackers</h3>
                <p className="text-muted-foreground mb-4">
                  An AI platform revolutionizing management education by generating customized case studies, simulating realistic case interviews, and providing business solution frameworks.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">Get Started</h2>
            <p className="text-muted-foreground mb-6">
              Dewey provides a comprehensive framework for AI-driven educational intelligence. Explore the codebase, watch implementation demos, or join our collaborative development community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
              <PrimaryButton href="https://github.com/Humanitariansai/Dewey">
                Dewey GitHub
              </PrimaryButton>
              <SecondaryButton href="https://youtube.com/playlist?list=PLgOGgHS58rB_FwoBNQrC-4FvHb9lvN3kt">
                Dewey YouTube
              </SecondaryButton>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

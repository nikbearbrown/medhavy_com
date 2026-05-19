import Image from "next/image"
import Link from "next/link"
import { Metadata } from "next"
import CancerTOC from "./CancerTOC"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, BookOpen, BrainCircuit, Search, Microscope, Users, GraduationCap, Presentation } from "lucide-react"

export const metadata: Metadata = {
  title: "Cancer Biology and Therapeutics | Medhavy Textbook",
  description: "An Intelligent Interactive Personalized Textbook and a comprehensive, research-grade resource spanning the full arc of oncology education.",
}



const audiences = [
  { title: "Medical Students", icon: GraduationCap, desc: "Master the complexities of oncology with interactive, personalized study sessions." },
  { title: "Biomedical Researchers", icon: Microscope, desc: "Quickly dive into deep mechanisms and access expert-vetted literature easily." },
  { title: "Educators", icon: Users, desc: "Enhance your curriculum with a dynamic, research-grade resource." },
  { title: "Lecturers", icon: Presentation, desc: "Leverage AI companions to help your students understand 'why' as well as 'what'." }
]

export default function CancerTextbookPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main content link — visible only on keyboard focus */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-md focus:text-sm focus:font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <main id="main-content">
        {/* Hero Section */}
        <section aria-labelledby="hero-heading" className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" aria-hidden="true"></div>
          <div className="container relative mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                  <Badge variant="outline" className="text-teal-800 dark:text-teal-300 border-teal-700/40 dark:border-teal-400/40 bg-teal-500/10 mb-2 py-1 px-3">
                    Medhavy Presents
                  </Badge>
                  <h1 id="hero-heading" className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/none text-teal-800 dark:text-teal-300">
                    Cancer Biology and Therapeutics
                  </h1>
                  <p className="text-xl font-medium text-foreground dark:text-foreground/95">
                    A Thorough Intelligent Textbook
                  </p>
                  <p className="max-w-[600px] text-foreground/70 dark:text-foreground/75 leading-relaxed text-lg">
                    An Intelligent Interactive Personalized Textbook and a comprehensive, research-grade resource spanning the full arc of oncology education.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1 text-sm text-foreground/70 dark:text-foreground/75 border-l-2 border-foreground/30 pl-4">
                    <span className="font-semibold text-foreground">Authors</span>
                    <span>Evin Gultepe, Nicholas Brown, Srinivas Sridhar</span>
                  </div>
                  
                  <ul className="flex flex-wrap items-center gap-3 list-none" aria-label="Book statistics">
                    <li><Badge variant="secondary" className="bg-background/80 backdrop-blur">38 Chapters</Badge></li>
                    <li><Badge variant="secondary" className="bg-background/80 backdrop-blur">4 Appendices</Badge></li>
                    <li><Badge variant="secondary" className="bg-background/80 backdrop-blur">180+ Topics</Badge></li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="#why-medhavy"
                    className="inline-flex h-12 items-center justify-center rounded-md bg-teal-700 dark:bg-teal-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-teal-800 dark:hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    Explore Features
                  </Link>
                  <Link
                    href="#table-of-contents"
                    className="inline-flex h-12 items-center justify-center rounded-md border-2 border-foreground/30 bg-background/50 backdrop-blur px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    View Contents
                  </Link>
                </div>
              </div>

              <div className="mx-auto flex w-full max-w-[500px] items-center justify-center lg:max-w-none">
                <div className="relative group rounded-xl overflow-hidden border border-foreground/10 shadow-2xl bg-black">
                  <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none mix-blend-overlay" aria-hidden="true"></div>
                  <Image
                    src="/images/cancer-cover.png"
                    alt="Cancer Biology and Therapeutics Textbook Cover — featuring a detailed illustration of the tumor microenvironment with labeled T-cells, ECM, and invasion pathways"
                    width={600}
                    height={800}
                    priority
                    className="object-cover w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Medhavy Textbooks Section */}
        <section id="why-medhavy" aria-labelledby="why-medhavy-heading" className="py-20 md:py-32 bg-muted/40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
              <h2 id="why-medhavy-heading" className="text-3xl md:text-4xl font-bold tracking-tight">A textbook you can talk to.</h2>
              <p className="text-lg text-foreground/70 dark:text-foreground/75 leading-relaxed">
                Traditional textbooks give you the information — Medhavy textbooks help you understand it. Every title comes with a built-in AI study companion that has read the entire book, so you can ask questions in plain language and get precise, contextual answers drawn directly from the text — chapter by chapter, concept by concept.
              </p>
              <blockquote className="inline-block mt-4 border-l-4 border-foreground/40 bg-background/50 p-6 rounded-r-xl shadow-sm text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5" aria-hidden="true">
                  <BrainCircuit className="w-24 h-24" />
                </div>
                <p className="text-xl font-medium italic text-foreground/90 relative z-10">
                  &ldquo;Like having an expert explain every page, just to you.&rdquo;
                </p>
              </blockquote>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto" role="list" aria-label="Key features">
              <Card className="bg-background/60 backdrop-blur border-foreground/10 hover:shadow-lg transition-all duration-300" role="listitem">
                <CardHeader>
                  <Search className="w-10 h-10 text-foreground/70 mb-4" aria-hidden="true" />
                  <CardTitle>Ask anything, instantly</CardTitle>
                  <CardDescription className="text-base mt-2">
                    No more hunting through indexes or Googling around the topic. Get immediate answers.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-background/60 backdrop-blur border-foreground/10 hover:shadow-lg transition-all duration-300" role="listitem">
                <CardHeader>
                  <CheckCircle2 className="w-10 h-10 text-foreground/70 mb-4" aria-hidden="true" />
                  <CardTitle>Authoritative resources</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Precise answers drawn from expert-vetted content, ensuring high accuracy and trust.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-background/60 backdrop-blur border-foreground/10 hover:shadow-lg transition-all duration-300" role="listitem">
                <CardHeader>
                  <BrainCircuit className="w-10 h-10 text-foreground/70 mb-4" aria-hidden="true" />
                  <CardTitle>Study smarter</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Whether you&apos;re previewing a chapter or reviewing before an exam, the AI adapts to where you are.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-background/60 backdrop-blur border-foreground/10 hover:shadow-lg transition-all duration-300" role="listitem">
                <CardHeader>
                  <BookOpen className="w-10 h-10 text-foreground/70 mb-4" aria-hidden="true" />
                  <CardTitle>Built for depth</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Ideal for complex subjects like oncology where understanding why matters as much as what.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* TOC Overview Section */}
        <section aria-labelledby="thematic-heading" className="py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-16 max-w-6xl mx-auto items-center">
              <div className="flex-1 space-y-8">
                <div className="space-y-4">
                  <h2 id="thematic-heading" className="text-3xl md:text-4xl font-bold tracking-tight">Thematic Structure</h2>
                  <p className="text-lg text-foreground/70 dark:text-foreground/75">
                    A carefully organized journey through the complexities of cancer biology.
                  </p>
                </div>
                
                <ol className="space-y-4 list-none" aria-label="Textbook parts overview">
                  {[
                    "1. Foundations of Cell Biology & Cancer — Ch. 1–9",
                    "2. Disease Mechanisms & Microenvironment — Ch. 10–16",
                    "3. Prevention, Detection & Diagnosis — Ch. 17–19",
                    "4. Treatment Modalities — Ch. 20–27",
                    "5. Cancer by Disease & System — Ch. 28–35",
                    "6. Supportive Care, Survivorship & Health Systems — Ch. 36–38"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-foreground text-xs font-bold" aria-hidden="true">
                        {item.charAt(0)}
                      </span>
                      <span className="text-foreground/80 font-medium">{item.substring(3)}</span>
                    </li>
                  ))}
                </ol>
                
                <div className="p-4 bg-foreground/5 border border-foreground/15 rounded-lg text-sm text-foreground/80 font-medium">
                  Plus Appendices A–D covering research methodologies
                </div>
              </div>

              {/* Featured Chapter Preview */}
              <div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 to-fuchsia-500/10 rounded-2xl -m-4 blur-xl" aria-hidden="true"></div>
                <Card className="relative overflow-hidden border-foreground/10 bg-background/80 backdrop-blur shadow-2xl">
                  <CardHeader className="bg-muted/50 border-b pb-4">
                    <Badge variant="outline" className="w-fit mb-2">Featured Preview</Badge>
                    <CardTitle className="text-xl">Chapter 2, Section 3</CardTitle>
                    <CardDescription>Hallmarks of Cancer</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 relative">
                    <div className="space-y-4 text-foreground/80 leading-relaxed text-sm relative">
                      <p>
                        The complexity of cancer can be distilled into a logical set of underlying principles, commonly referred to as the &quot;Hallmarks of Cancer.&quot; These hallmarks represent the essential biological capabilities acquired during the multistep development of human tumors. 
                      </p>
                      <p>
                        By conceptualizing cancer not as a single disease, but as a diverse collection of maladies sharing these fundamental traits, researchers and clinicians can better understand tumor pathogenesis. The interplay between these capabilities dictates tumor survival, proliferation, and eventual dissemination...
                      </p>
                      
                      {/* Fade-out overlay */}
                      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent flex items-end justify-center pb-2" aria-hidden="true">
                        <span className="text-sm font-semibold text-foreground underline underline-offset-4 decoration-foreground/40 bg-background/80 px-4 py-2 rounded-full shadow-sm backdrop-blur border border-foreground/15 cursor-default">
                          Read more in the full edition
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Who this book is for */}
        <section aria-labelledby="audience-heading" className="py-20 md:py-32 bg-foreground text-background border-y border-border/10 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-background/5 rounded-full blur-3xl" aria-hidden="true"></div>
          <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-background/5 rounded-full blur-3xl" aria-hidden="true"></div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 id="audience-heading" className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-background">Who this book is for</h2>
              <p className="text-lg text-background/80 max-w-2xl mx-auto">
                Designed for a wide spectrum of the oncology community, adapting its depth to your needs.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto" role="list" aria-label="Target audiences">
              {audiences.map((audience, i) => {
                const Icon = audience.icon
                return (
                  <div key={i} role="listitem" className="group relative bg-background/10 rounded-2xl p-6 hover:bg-background/15 transition-colors border border-background/20 hover:border-background/30">
                    <div className="w-12 h-12 rounded-xl bg-background/15 shadow-sm border border-background/25 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-background" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-background">{audience.title}</h3>
                    <p className="text-background/85 text-sm leading-relaxed">{audience.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Full TOC Section */}
        <section id="table-of-contents" aria-labelledby="toc-heading" className="py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="text-center mb-16 space-y-4">
              <h2 id="toc-heading" className="text-3xl md:text-4xl font-bold tracking-tight">Full Table of Contents</h2>
              <p className="text-lg text-foreground/70 dark:text-foreground/75">
                A comprehensive breakdown of all 38 chapters and 4 appendices.
              </p>
            </div>

            <CancerTOC />
          </div>
        </section>
      </main>
    </div>
  )
}

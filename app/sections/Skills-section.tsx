"use client"

import CardSwap, { Card } from '@/components/CardSwap'
import RotatingText from '@/components/RotatingText'
import ScrollFloat from '@/components/ScrollFloat'
import SpotlightCard from '@/components/SpotlightCard'
import TextType from '@/components/TextType'
import { useState, useEffect, useRef } from 'react'
import { Palette, Code, Server, Network, Monitor, Bug, Database, Cloud, GitBranch, Layers } from 'lucide-react';

const skills = [
  {
    title: "React",
    bg: "bg-gray-800",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    desc: "Component-based UI library for dynamic interfaces",
    percentage: 95,
  },
  {
    title: "Next.js",
    bg: "bg-neutral-800",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    desc: "Full-stack React framework with SSR",
    invert: true,
    percentage: 90,
  },
  {
    title: "Node.js",
    bg: "bg-gray-600",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    desc: "Server-side JavaScript runtime",
    percentage: 88,
  },
  {
    title: "PHP",
    bg: "bg-indigo-900",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    desc: "Server-side scripting for web development",
    percentage: 92,
  },
  {
    title: "Python",
    bg: "bg-blue-900",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    desc: "Versatile programming for automation and data",
    percentage: 85,
  },
  {
    title: "HTML",
    bg: "bg-gray-700",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    desc: "Semantic markup structure",
    percentage: 98,
  },
  {
    title: "CSS",
    bg: "bg-gray-900",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    desc: "Advanced styling and animations",
    percentage: 95,
  },
  {
    title: "JavaScript",
    bg: "bg-slate-800",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    desc: "Dynamic web interactions and logic",
    percentage: 93,
  },
  {
    title: "Tailwind CSS",
    bg: "bg-zinc-800",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
    desc: "Utility-first CSS framework",
    percentage: 90,
  },
  {
    title: "Bootstrap",
    bg: "bg-purple-900",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
    desc: "Responsive component library",
    percentage: 88,
  },
  {
    title: "MySQL",
    bg: "bg-slate-700",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    desc: "Relational database management",
    percentage: 87,
  },
  {
    title: "PostgreSQL",
    bg: "bg-stone-700",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    desc: "Advanced SQL database system",
    percentage: 82,
  },
  {
    title: "Supabase",
    bg: "bg-neutral-700",
    icon: "https://supabase.com/brand-assets/supabase-logo-icon.svg",
    desc: "Backend-as-a-Service platform",
    percentage: 85,
  },
  {
    title: "Express.js",
    bg: "bg-gray-500",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    desc: "Node.js web application framework",
    invert: true,
    percentage: 86,
  },
  {
    title: "Git",
    bg: "bg-red-900",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    desc: "Version control system",
    percentage: 90,
  },
  {
    title: "GitHub",
    bg: "bg-gray-800",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    desc: "Code hosting and collaboration",
    invert: true,
    percentage: 88,
  },
  {
    title: "Figma",
    bg: "bg-slate-800",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
    desc: "UI/UX design and prototyping",
    percentage: 87,
  },
  {
    title: "Postman",
    bg: "bg-orange-900",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg",
    desc: "API development and testing",
    percentage: 83,
  },
  {
    title: "VS Code",
    bg: "bg-blue-800",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
    desc: "Code editor and IDE",
    percentage: 95,
  },
  {
    title: "jQuery",
    bg: "bg-indigo-800",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-original.svg",
    desc: "JavaScript library for DOM manipulation",
    percentage: 80,
  },
]

export default function Skills() {
  const [isVisible, setIsVisible] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const cardSwapRef = useRef<any>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handlePrevCard = () => {
    if (cardSwapRef.current && cardSwapRef.current.swapPrev) {
      cardSwapRef.current.swapPrev();
    }
  };

  const handleNextCard = () => {
    if (cardSwapRef.current && cardSwapRef.current.swapNext) {
      cardSwapRef.current.swapNext();
    }
  };

  return (
    <section id='skills' ref={sectionRef} className="relative z-10 px-6 py-20 -mt-50">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Grid */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-12 items-center mt-30">
          {/* Left Side - Info */}
          <div 
            className={`space-y-4 w-full transition-all duration-1000 ease-out ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-16'
            }`}
          >
            <div className='font-bold'>                               
              <ScrollFloat
                animationDuration={1}
                ease='back.inOut(2)'
                scrollStart='center bottom+=50%'
                scrollEnd='bottom bottom-=40%'
                stagger={0.03}
              >
                What I can Offer?
              </ScrollFloat>
              
            </div>
            
            <h2 className={`text-1xl font-bold bg-gradient-to-r from-gray-400 to-blue-500 bg-clip-text text-transparent transition-all duration-800 ease-out delay-200 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              Core Competencies:
            </h2>

            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 transition-all duration-800 ease-out delay-300 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
            }`}>
              <SpotlightCard
                spotlightColor="rgba(139, 92, 246, 0.2)"
                icon={<Palette className="w-5 h-5 text-blue-400" />}
                title="UI/UX Design"
                description="Figma prototyping and responsive web design"
              />
              <SpotlightCard
                spotlightColor="rgba(139, 92, 246, 0.2)"
                icon={<Code className="w-5 h-5 text-blue-400" />}
                title="Frontend Development"
                description="React, Next.js, and modern JavaScript frameworks"
              />
              <SpotlightCard
                spotlightColor="rgba(139, 92, 246, 0.2)"
                icon={<Server className="w-5 h-5 text-blue-400" />}
                title="Backend Development"
                description="PHP, Node.js, Express.js, and API development"
              />
              <SpotlightCard
                spotlightColor="rgba(139, 92, 246, 0.2)"
                icon={<Database className="w-5 h-5 text-blue-400" />}
                title="Database Management"
                description="MySQL, PostgreSQL, and Supabase integration"
              />
              <SpotlightCard
                spotlightColor="rgba(139, 92, 246, 0.2)"
                icon={<Network className="w-5 h-5 text-blue-400" />}
                title="Networking"
                description="LAN/WAN setup, Cisco config, and troubleshooting"
              />
              <SpotlightCard
                spotlightColor="rgba(139, 92, 246, 0.2)"
                icon={<Monitor className="w-5 h-5 text-blue-400" />}
                title="IT Support"
                description="Hardware troubleshooting and system maintenance"
              />
              <SpotlightCard
                spotlightColor="rgba(139, 92, 246, 0.2)"
                icon={<GitBranch className="w-5 h-5 text-blue-400" />}
                title="Version Control"
                description="Git, GitHub workflows, and team collaboration"
              />
              <SpotlightCard
                spotlightColor="rgba(139, 92, 246, 0.2)"
                icon={<Cloud className="w-5 h-5 text-blue-400" />}
                title="Deployment"
                description="Vercel, IONOS hosting, and cloud platforms"
              />
            </div>

            <h2 className={`text-1xl mt-8 font-bold bg-gradient-to-r from-gray-400 to-blue-500 bg-clip-text text-transparent transition-all duration-800 ease-out delay-400 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              Professional Attributes:
            </h2>
            <h2 className={`flex items-center gap-2 font-bold text-white text-1xl sm:text-2xl md:text-2xl transition-all duration-800 ease-out delay-500 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              <span>I am</span>
              <div className="relative">
                <RotatingText
                  texts={['Detail-oriented.','Team-oriented.','Problem-solver.', 'Quick learner.','Adaptable.', 'Reliable.', 'Innovative.', 'Results-driven.']}
                  mainClassName="px-2 sm:px-3 md:px-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-xl text-white transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/25 hover:-translate-y-1 border border-gray-600 overflow-hidden py-1 sm:py-2 md:py-2 shadow-md"
                  splitLevelClassName="overflow-hidden"
                  staggerFrom="last"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.025}
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={4000}
                />
              </div>
            </h2>
          </div>

          {/* Right Side - Skills Cards with Title */}
          <div 
            className={`w-full flex flex-col items-center transition-all duration-1000 ease-out delay-300 ${
              isVisible 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-16 scale-95'
            }`}
          >
            {/* Section Title */}
            <div className={`mb-8 transition-all duration-800 ease-out delay-600 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              <h2 className="text-1xl sm:text-1xl md:text-1xl font-bold text-white mb-4 text-center">
                Tools and Frameworks
              </h2>
              
              {/* Navigation Arrows */}
              <div className={`flex gap-2 justify-center items-center transition-all duration-800 ease-out delay-700 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}>
                <button
                  onClick={handlePrevCard}
                  onMouseEnter={() => {
                    if (cardSwapRef.current && cardSwapRef.current.pauseAutoPlay) {
                      cardSwapRef.current.pauseAutoPlay();
                    }
                  }}
                  onMouseLeave={() => {
                    if (cardSwapRef.current && cardSwapRef.current.resumeAutoPlay) {
                      cardSwapRef.current.resumeAutoPlay();
                    }
                  }}
                  disabled={showAll}
                  className={`w-8 h-8 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl active:scale-95 ${showAll ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  aria-label="Previous card"
                >
                  <svg 
                    width="12" 
                    height="12" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    <path 
                      d="M15 18L9 12L15 6" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Show All Button */}
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-4 py-1.5 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-600 hover:border-gray-500 rounded-full text-white text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl active:scale-95"
                >
                  {showAll ? 'Show Carousel' : 'Show All'}
                </button>

                <button
                  onClick={handleNextCard}
                  onMouseEnter={() => {
                    if (cardSwapRef.current && cardSwapRef.current.pauseAutoPlay) {
                      cardSwapRef.current.pauseAutoPlay();
                    }
                  }}
                  onMouseLeave={() => {
                    if (cardSwapRef.current && cardSwapRef.current.resumeAutoPlay) {
                      cardSwapRef.current.resumeAutoPlay();
                    }
                  }}
                  disabled={showAll}
                  className={`w-8 h-8 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl active:scale-95 ${showAll ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  aria-label="Next card"
                >
                  <svg 
                    width="12" 
                    height="12" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    <path 
                      d="M9 18L15 12L9 6" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Conditional Rendering: Card Swap or Show All Grid */}
            {!showAll ? (
              // Card Swap Component
              <div className="-mt-10 w-full max-w-md" style={{ height: '600px' }}>
                <CardSwap 
                  ref={cardSwapRef} 
                  skills={skills}
                >
                  {skills.map((skill, i) => (
                    <Card key={i}>
                      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group relative overflow-hidden h-full opacity-100 translate-y-0 scale-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-700/20 to-neutral-600/20 transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
                        
                        <div className="p-6 flex flex-col h-full">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-neutral-500">
                              <img
                                src={skill.icon}
                                alt={skill.title}
                                className={`w-6 h-6 ${skill.invert ? "filter invert" : ""} transition-transform duration-300 group-hover:scale-110`}
                              />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold transition-all duration-300 group-hover:text-white group-hover:translate-x-1 text-neutral-100">
                                {skill.title}
                              </h3>
                            </div>
                          </div>

                          <div className="flex-grow">
                            <p className="text-neutral-300 mb-6">{skill.desc}</p>
                          </div>

                          <div className="mt-auto">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-400">Proficiency</span>
                              <span className="text-2xl font-bold text-white">{skill.percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-300 to-purple-500 rounded-full"
                                style={{ width: `${skill.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </CardSwap>
              </div>
            ) : (
              // Show All Grid - Logo Only
              <div className="w-full max-w-4xl px-4 animate-fadeIn">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-6 md:gap-8">
                  {skills.map((skill, i) => (
                    <div
                      key={i}
                      className="group relative flex flex-col items-center justify-center p-6 bg-neutral-900 border border-neutral-700 rounded-xl hover:border-neutral-500 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-neutral-800/50 cursor-pointer"
                      style={{
                        animation: `fadeInUp 0.5s ease-out ${i * 0.05}s both`
                      }}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-neutral-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10 shadow-lg border border-neutral-600">
                        {skill.title}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-800"></div>
                      </div>
                      
                      {/* Icon */}
                      <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
                        <img
                          src={skill.icon}
                          alt={skill.title}
                          className={`w-full h-full object-contain ${skill.invert ? "filter invert" : ""} transition-all duration-300 group-hover:scale-110`}
                        />
                      </div>
                      
                      {/* Title - visible on mobile, hidden on larger screens */}
                      <p className="mt-2 text-xs text-center text-neutral-300 group-hover:text-white transition-colors duration-300 md:hidden">
                        {skill.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </section>
  )
}
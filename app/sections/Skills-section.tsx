"use client"

import CardSwap, { Card } from '@/components/CardSwap'
import RotatingText from '@/components/RotatingText'
import ScrollFloat from '@/components/ScrollFloat'
import SpotlightCard from '@/components/SpotlightCard'
import TextType from '@/components/TextType'
import { useState, useEffect, useRef } from 'react'
import { Palette, Code, Server, Network, Monitor, Bug } from 'lucide-react';
const skills = [
  {
    title: "React",
    bg: "bg-gray-800",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    desc: "Component-based UI library",
    percentage: 95,
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
    desc: "Styling and animations",
    percentage: 92,
  },
  {
    title: "JavaScript",
    bg: "bg-slate-800",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    desc: "Dynamic web interactions",
    percentage: 90,
  },
  {
    title: "Tailwind",
    bg: "bg-zinc-800",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
    desc: "Utility-first CSS framework",
    percentage: 88,
  },
  {
    title: "Web Design",
    bg: "bg-stone-800",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
    desc: "UI/UX design principles",
    percentage: 85,
  },
  {
    title: "Next.js",
    bg: "bg-neutral-800",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    desc: "Full-stack React framework",
    invert: true,
    percentage: 87,
  },
  {
    title: "Node.js",
    bg: "bg-gray-600",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    desc: "Server-side JavaScript",
    percentage: 82,
  },
  {
    title: "MySQL",
    bg: "bg-slate-700",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    desc: "Relational database",
    percentage: 80,
  },
  {
    title: "MongoDB",
    bg: "bg-zinc-700",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    desc: "NoSQL document database",
    percentage: 78,
  },
  {
    title: "PostgreSQL",
    bg: "bg-stone-700",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    desc: "Advanced SQL database",
    percentage: 75,
  },
  {
    title: "Supabase",
    bg: "bg-neutral-700",
    icon: "https://supabase.com/brand-assets/supabase-logo-icon.svg",
    desc: "Backend-as-a-Service",
    percentage: 73,
  },
  {
    title: "Express.js",
    bg: "bg-gray-500",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    desc: "Node.js web framework",
    invert: true,
    percentage: 77,
  },
]

export default function Skills() {
  const [isVisible, setIsVisible] = useState(false);
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
        {/* Main Content Grid - Changed to flex for better control */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-0 items-center mt-30">
          {/* Left Side - Info (now on top for mobile) */}
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
              <div className='text-base md:text-lg'>
                <TextType
                  text={[
                    "Passionate full-stack developer with expertise in modern web technologies.",
                    "Experienced in UI/UX design, front-end development, and back-end systems.",
                    "Skilled in troubleshooting, IT support, and networking solutions.",
                    "Proficient in database management, API integration, and cloud deployment."
                  ]}
                  typingSpeed={60}
                  pauseDuration={1500}
                  showCursor={true}
                  cursorCharacter="|"
                />
              </div>
            </div>
            
          <h2 className={`text-1xl font-bold bg-gradient-to-r from-gray-400 to-blue-500 bg-clip-text text-transparent transition-all duration-800 ease-out delay-200 ${
  isVisible 
    ? 'opacity-100 translate-y-0' 
    : 'opacity-0 translate-y-8'
}`}>
  Technical Skills:
</h2>

<div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 transition-all duration-800 ease-out delay-300 ${
  isVisible 
    ? 'opacity-100 translate-y-0' 
    : 'opacity-0 translate-y-12'
}`}>
  <SpotlightCard
    spotlightColor="rgba(139, 92, 246, 0.2)" // blue theme
    icon={<Palette className="w-5 h-5 text-blue-400" />}
    title="Web Designing"
    description="Modern UI/UX design with responsive layouts"
  />
  <SpotlightCard
    spotlightColor="rgba(139, 92, 246, 0.2)"
    icon={<Code className="w-5 h-5 text-blue-400" />}
    title="Frontend Development"
    description="Interactive user interfaces and experiences"
  />
  <SpotlightCard
    spotlightColor="rgba(139, 92, 246, 0.2)"
    icon={<Server className="w-5 h-5 text-blue-400" />}
    title="Backend Development"
    description="Server-side logic and API development"
  />
  <SpotlightCard
    spotlightColor="rgba(139, 92, 246, 0.2)"
    icon={<Network className="w-5 h-5 text-blue-400" />}
    title="Networking"
    description="Network configuration and management"
  />
  <SpotlightCard
    spotlightColor="rgba(139, 92, 246, 0.2)"
    icon={<Monitor className="w-5 h-5 text-blue-400" />}
    title="IT Support"
    description="Technical assistance and problem resolution"
  />
  <SpotlightCard
    spotlightColor="rgba(139, 92, 246, 0.2)"
    icon={<Bug className="w-5 h-5 text-blue-400" />}
    title="Troubleshooting"
    description="System maintenance and optimization"
  />
</div>

<h2 className={`text-1xl mt-8 font-bold bg-gradient-to-r from-gray-400 to-blue-500 bg-clip-text text-transparent transition-all duration-800 ease-out delay-400 ${
  isVisible 
    ? 'opacity-100 translate-y-0' 
    : 'opacity-0 translate-y-8'
}`}>
  Soft Skills:
</h2>
<h2 className={`flex items-center gap-2 font-bold text-white text-1xl sm:text-2xl md:text-2xl transition-all duration-800 ease-out delay-500 ${
  isVisible 
    ? 'opacity-100 translate-y-0' 
    : 'opacity-0 translate-y-8'
}`}>
  <span>I am</span>
  <div className="relative">
    <RotatingText
      texts={['Creative.','Reliable.','Flexible.', 'Consistent.','Adaptable.', 'Resilient.', 'Collaborative.', 'Detail-oriented.']}
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
              
              {/* Navigation Arrows - Smaller and below title */}
              <div className={`flex gap-2 justify-center transition-all duration-800 ease-out delay-700 ${
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
                  className="cursor-pointer w-8 h-8 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl active:scale-95"
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
                  className="cursor-pointer w-8 h-8 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl active:scale-95"
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

            {/* Card Swap Component */}
            <div className="-mt-10 w-full max-w-md" style={{ height: '600px' }}>
              <CardSwap 
                ref={cardSwapRef} 
                skills={skills}
              >
                {skills.map((skill, i) => (
                  <Card key={i}>
                    {/* Updated Card Styling */}
                    <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group relative overflow-hidden h-full opacity-100 translate-y-0 scale-100">
                      {/* Animated gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-neutral-700/20 to-neutral-600/20 transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
                      
                      <div className="p-6 flex flex-col h-full">
                        {/* Header with Icon */}
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

                        {/* Description */}
                        <div className="flex-grow">
                          <p className="text-neutral-300 mb-6">{skill.desc}</p>
                        </div>

                        {/* Progress Bar at Bottom */}
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
          </div>
        </div>
      </div>
    </section>
  )
}
import React, { useState, useEffect, useRef } from 'react';
import { Award, Code } from 'lucide-react';
import CertificatesSection from './Certificates-section';
import ProjectsSection from './Project-section';

const CertProj: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'certificates' | 'projects'>('certificates');
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === navRef.current) {
            setIsNavVisible(entry.isIntersecting);
          }
          if (entry.target === contentRef.current) {
            setIsContentVisible(entry.isIntersecting);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (navRef.current) observer.observe(navRef.current);
    if (contentRef.current) observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section id='cert/proj' className="w-full mt-40">
      {/* Simple Navigation */}
      <div 
        ref={navRef}
        className={`flex justify-center -mb-10 mt-40 transition-all duration-700 ease-out ${
          isNavVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="bg-neutral-900 rounded-xl p-1 border border-neutral-700 hover:shadow-lg transition-shadow duration-300">
          <div className="flex">
            <button
              onClick={() => setActiveTab('certificates')}
              className={`cursor-pointer px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'certificates'
                  ? 'bg-neutral-700 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4 inline mr-2" />
              Certificates
            </button>
            
            <button
              onClick={() => setActiveTab('projects')}
              className={`cursor-pointer px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'projects'
                  ? 'bg-neutral-700 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Code className="w-4 h-4 inline mr-2" />
              Projects
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div 
        ref={contentRef}
        className={`transition-all duration-1000 ease-out delay-200 ${
          isContentVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}
      >
        {activeTab === 'certificates' && <CertificatesSection />}
        {activeTab === 'projects' && <ProjectsSection />}
      </div>
      
    </section>
  );
};

export default CertProj;
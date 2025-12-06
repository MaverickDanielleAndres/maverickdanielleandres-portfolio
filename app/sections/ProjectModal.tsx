import React, { useState, useCallback, memo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Calendar, Code, User, Github, ExternalLink, Maximize2, CheckCircle } from 'lucide-react';

// Types
interface Project {
  id: string;
  title: string;
  description: string;
  contribution: string;
  techStack: string[];
  dateCreated: string;
  mainImage: string;
  screenshots: string[];
  features: string[];
  videoUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ScreenshotViewerProps {
  screenshots: string[];
  projectTitle: string;
}

// Screenshot Gallery Component
const ScreenshotViewer = memo<ScreenshotViewerProps>(({ screenshots, projectTitle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [enlargedIndex, setEnlargedIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : screenshots.length - 1));
  }, [screenshots.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < screenshots.length - 1 ? prev + 1 : 0));
  }, [screenshots.length]);

  const handleEnlarge = useCallback((index: number) => {
    setEnlargedIndex(index);
    setIsEnlarged(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const handleCloseEnlarged = useCallback(() => {
    setIsEnlarged(false);
    document.body.style.overflow = 'unset';
  }, []);

  const handleTouchStart = useRef({ x: 0, y: 0 });
  const handleTouchEnd = useRef({ x: 0, y: 0 });

  const onTouchStart = (e: React.TouchEvent) => {
    handleTouchEnd.current.x = e.targetTouches[0].clientX;
    handleTouchEnd.current.y = e.targetTouches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleTouchStart.current.x = e.targetTouches[0].clientX;
    handleTouchStart.current.y = e.targetTouches[0].clientY;
  };

  const onTouchEnd = () => {
    if (!handleTouchStart.current.x || !handleTouchEnd.current.x) return;
    
    const xDiff = handleTouchEnd.current.x - handleTouchStart.current.x;
    const yDiff = handleTouchEnd.current.y - handleTouchStart.current.y;
    
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 50) {
        goToPrevious();
      } else if (xDiff < -50) {
        goToNext();
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEnlarged) return;
      
      switch (e.key) {
        case 'Escape':
          handleCloseEnlarged();
          break;
        case 'ArrowLeft':
          setEnlargedIndex((prev) => (prev > 0 ? prev - 1 : screenshots.length - 1));
          break;
        case 'ArrowRight':
          setEnlargedIndex((prev) => (prev < screenshots.length - 1 ? prev + 1 : 0));
          break;
      }
    };

    if (isEnlarged) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEnlarged, screenshots.length, handleCloseEnlarged]);

  return (
    <>
      {/* Screenshot Gallery */}
      <div className="relative">
        {/* Main Screenshot Display */}
        <div 
          className="relative h-48 sm:h-64 md:h-72 lg:h-80 w-full overflow-hidden rounded-lg bg-neutral-800"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {screenshots.length > 0 && (
            <>
              <img
                src={screenshots[currentIndex]}
                alt={`${projectTitle} screenshot ${currentIndex + 1}`}
                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => handleEnlarge(currentIndex)}
              />
              
              {/* Enlarge button overlay */}
              <button
                onClick={() => handleEnlarge(currentIndex)}
                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-300 hover:scale-110 group border border-white/20 hover:border-white/40 opacity-0 hover:opacity-100"
                aria-label="Enlarge screenshot"
              >
                <Maximize2 className="w-3 h-3 text-white group-hover:scale-110 transition-transform duration-200" />
              </button>

              {/* Navigation arrows - Always visible on mobile */}
              {screenshots.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 rounded-full transition-all duration-300 hover:scale-110 border border-white/30 z-10"
                    aria-label="Previous screenshot"
                  >
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                  
                  <button
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 rounded-full transition-all duration-300 hover:scale-110 border border-white/30 z-10"
                    aria-label="Next screenshot"
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </>
              )}

              {/* Screenshot counter */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                {currentIndex + 1} / {screenshots.length}
              </div>
            </>
          )}
        </div>

        {/* All Screenshots Grid - Shows on small screens */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:hidden">
          {screenshots.map((screenshot, index) => (
            <div
              key={index}
              className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                currentIndex === index 
                  ? 'border-neutral-300 scale-105' 
                  : 'border-neutral-600 hover:border-neutral-500'
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <img
                src={screenshot}
                alt={`${projectTitle} screenshot ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 left-1 bg-black/60 text-white px-1.5 py-0.5 rounded text-xs">
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Thumbnail Navigation - Hidden on small screens */}
        {screenshots.length > 1 && (
          <div 
            ref={scrollContainerRef}
            className="hidden sm:flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {screenshots.map((screenshot, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-10 rounded-md overflow-hidden border-2 transition-all duration-300 ${
                  currentIndex === index 
                    ? 'border-neutral-400 scale-105' 
                    : 'border-neutral-600 hover:border-neutral-500'
                }`}
              >
                <img
                  src={screenshot}
                  alt={`${projectTitle} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Dots indicator - Hidden on small screens since we show all images */}
        <div className="hidden sm:flex justify-center gap-1.5 mt-3">
          {screenshots.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === index 
                  ? 'bg-neutral-300 scale-125' 
                  : 'bg-neutral-600 hover:bg-neutral-500'
              }`}
              aria-label={`Go to screenshot ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Enlarged Screenshot Modal - ALSO USE PORTAL */}
      {isEnlarged && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 bg-black/95 flex items-center justify-center p-4"
          onClick={handleCloseEnlarged}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
            margin: 0,
            padding: '16px'
          }}
        >
          {/* Close Button */}
          <button
            onClick={handleCloseEnlarged}
            className="absolute top-4 right-4 p-3 bg-black/70 hover:bg-red-900/90 rounded-full transition-all duration-300 hover:scale-125 hover:rotate-90 group border-2 border-white/30 hover:border-red-500"
            style={{ zIndex: 100000 }}
            aria-label="Close enlarged view"
          >
            <X className="w-5 h-5 text-white group-hover:text-red-300 transition-colors duration-200" />
          </button>

          {/* Navigation in enlarged view */}
          {screenshots.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEnlargedIndex((prev) => (prev > 0 ? prev - 1 : screenshots.length - 1));
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
                style={{ zIndex: 100000 }}
                aria-label="Previous screenshot"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEnlargedIndex((prev) => (prev < screenshots.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
                style={{ zIndex: 100000 }}
                aria-label="Next screenshot"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </>
          )}

          {/* Enlarged Image */}
          <div className="max-w-[95vw] max-h-[95vh] relative">
            <img
              src={screenshots[enlargedIndex]}
              alt={`${projectTitle} screenshot ${enlargedIndex + 1} enlarged`}
              className="w-full h-full object-contain rounded-lg max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {enlargedIndex + 1} / {screenshots.length}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
});

ScreenshotViewer.displayName = 'ScreenshotViewer';

// Main Project Modal Component
const ProjectModal = memo<ProjectModalProps>(({ project, isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [currentSection, setCurrentSection] = useState(0); // 0: Details, 1: Screenshots
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setCurrentSection(0);
      // Reset body overflow
      document.body.style.overflow = 'unset';
    }, 300);
  }, [onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  const goToSection = useCallback((section: number) => {
    setCurrentSection(section);
  }, []);

  const handleExternalLink = useCallback((url?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }, []);

  // Create modal root element on mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      let root = document.getElementById('modal-root');
      if (!root) {
        root = document.createElement('div');
        root.id = 'modal-root';
        root.style.position = 'fixed';
        root.style.top = '0';
        root.style.left = '0';
        root.style.right = '0';
        root.style.bottom = '0';
        root.style.pointerEvents = 'none';
        root.style.zIndex = '50000';
        document.body.appendChild(root);
      }
      setModalRoot(root);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          handleClose();
          break;
        case 'ArrowLeft':
          setCurrentSection((prev) => (prev > 0 ? prev - 1 : 1));
          break;
        case 'ArrowRight':
          setCurrentSection((prev) => (prev < 1 ? prev + 1 : 0));
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (!isOpen) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen, handleClose]);

  if (!isOpen || !project || !modalRoot) return null;

  const sections = [
    { title: 'Details', key: 'details' },
    { title: 'Screenshots', key: 'screenshots' }
  ];

  const modalContent = (
    <div 
      className={`fixed inset-0 flex items-center justify-center transition-all duration-300 px-2 sm:px-4 ${
        isClosing 
          ? 'bg-black/0 backdrop-blur-none' 
          : 'bg-black/80 backdrop-blur-sm'
      }`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50000,
        pointerEvents: 'auto',
        margin: 0
      }}
    >
      <div 
        className={`relative bg-neutral-900 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-5xl h-[95vh] sm:h-[90vh] md:h-[85vh] max-h-[800px] transition-all duration-300 flex flex-col ${
          isClosing 
            ? 'opacity-0 scale-95 translate-y-4' 
            : 'opacity-100 scale-100 translate-y-0'
        }`}
        style={{ pointerEvents: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-neutral-700 flex-shrink-0 relative">
          <h2 id="modal-title" className="text-base sm:text-lg md:text-xl font-bold text-white truncate pr-16 sm:pr-20">
            {project.title}
          </h2>
          
          {/* External Links */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0 absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2" style={{ zIndex: 50001 }}>
            {project.githubUrl && (
              <button
                onClick={() => handleExternalLink(project.githubUrl)}
                className="p-1 sm:p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-full transition-all duration-300 hover:scale-110 group border border-neutral-600"
                aria-label="View GitHub repository"
              >
                <Github className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-300 group-hover:text-white transition-colors" />
              </button>
            )}
            {project.liveUrl && (
              <button
                onClick={() => handleExternalLink(project.liveUrl)}
                className="p-1 sm:p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-full transition-all duration-300 hover:scale-110 group border border-neutral-600"
                aria-label="View live project"
              >
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-300 group-hover:text-white transition-colors" />
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-1.5 sm:p-2 bg-neutral-800 hover:bg-red-900/80 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-90 group border border-neutral-600 hover:border-red-600"
              style={{ zIndex: 50002 }}
              aria-label="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-300 group-hover:text-red-300 transition-colors" />
            </button>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex border-b border-neutral-700 flex-shrink-0">
          {sections.map((section, index) => (
            <button
              key={section.key}
              onClick={() => goToSection(index)}
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-300 ${
                currentSection === index
                  ? 'text-white bg-neutral-800 border-b-2 border-neutral-400'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Section Content - Scrollable */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {/* Navigation Arrows - Hidden on mobile */}
          <div className="hidden md:flex justify-between items-center p-3 sm:p-4 border-b border-neutral-700/50 flex-shrink-0">
            <button
              onClick={() => setCurrentSection((prev) => (prev > 0 ? prev - 1 : 1))}
              className="flex items-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-all duration-300 hover:scale-105 group border border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-white"
              disabled={currentSection === 0}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            <div className="flex gap-2">
              {sections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSection(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentSection === index 
                      ? 'bg-neutral-300 scale-125' 
                      : 'bg-neutral-600 hover:bg-neutral-500'
                  }`}
                  aria-label={`Go to section ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={() => setCurrentSection((prev) => (prev < 1 ? prev + 1 : 0))}
              className="flex items-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-all duration-300 hover:scale-105 group border border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-white"
              disabled={currentSection === 1}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Content Area - Scrollable */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 scrollbar-thin scrollbar-track-neutral-800 scrollbar-thumb-neutral-600">
            {/* Project Details Section */}
            {currentSection === 0 && (
              <div className="space-y-3 sm:space-y-4 animate-fadeIn animate-slideUp">
                {/* Project Preview */}
                <div className="w-full h-32 sm:h-48 md:h-64 rounded-lg overflow-hidden bg-neutral-800">
                  {project.videoUrl ? (
                    <video
                      src={project.videoUrl}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      aria-label={`${project.title} preview video`}
                    />
                  ) : (
                    <img
                      src={project.mainImage}
                      alt={`${project.title} main image`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  {/* Left Column */}
                  <div className="space-y-3 sm:space-y-4">
                    {/* Date Created */}
                    <div className="animate-fadeIn" style={{animationDelay: '0.1s'}}>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-neutral-300" />
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-neutral-100">Date Created</h3>
                      </div>
                      <p className="text-xs sm:text-sm md:text-base text-neutral-300">
                        {new Date(project.dateCreated).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    {/* Description */}
                    <div className="animate-fadeIn" style={{animationDelay: '0.2s'}}>
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-neutral-100 mb-3">Description</h3>
                      <p className="text-xs sm:text-sm md:text-base text-neutral-300 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech Stack */}
                    <div className="animate-fadeIn" style={{animationDelay: '0.3s'}}>
                      <div className="flex items-center gap-2 mb-3">
                        <Code className="w-4 h-4 text-neutral-300" />
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-neutral-100">Tech Stack</h3>
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {project.techStack.map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gradient-to-r from-neutral-800 to-neutral-700 text-neutral-200 rounded-full text-xs font-medium border border-neutral-600 animate-fadeIn"
                            style={{animationDelay: `${0.4 + index * 0.1}s`}}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-3 sm:space-y-4">
                    {/* Features */}
                    <div className="animate-fadeIn" style={{animationDelay: '0.4s'}}>
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-4 h-4 text-neutral-300" />
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-neutral-100">Features</h3>
                      </div>
                      <ul className="space-y-2">
                        {project.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-xs sm:text-sm md:text-base text-neutral-300 animate-fadeIn"
                            style={{animationDelay: `${0.5 + index * 0.1}s`}}
                          >
                            <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* My Contribution */}
                    <div className="animate-fadeIn" style={{animationDelay: '0.6s'}}>
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-4 h-4 text-neutral-300" />
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-neutral-100">My Contribution</h3>
                      </div>
                      <p className="text-xs sm:text-sm md:text-base text-neutral-300 leading-relaxed">
                        {project.contribution}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Screenshots Section */}
            {currentSection === 1 && (
              <div className="animate-fadeIn animate-slideUp">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-neutral-100 mb-4 sm:mb-6">Project Screenshots</h3>
                <ScreenshotViewer 
                  screenshots={project.screenshots} 
                  projectTitle={project.title}
                />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Section Navigation - Bottom */}
        <div className="md:hidden flex justify-center items-center p-3 border-t border-neutral-700 gap-4 flex-shrink-0">
          <button
            onClick={() => setCurrentSection((prev) => (prev > 0 ? prev - 1 : 1))}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-all duration-300 hover:scale-105 group border border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-white"
            disabled={currentSection === 0}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <div className="flex gap-2">
            {sections.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSection(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentSection === index
                    ? 'bg-neutral-300 scale-125'
                    : 'bg-neutral-600 hover:bg-neutral-500'
                }`}
                aria-label={`Go to section ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSection((prev) => (prev < 1 ? prev + 1 : 0))}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-all duration-300 hover:scale-105 group border border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-white"
            disabled={currentSection === 1}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // Use portal to render modal at a dedicated modal root
  return createPortal(modalContent, modalRoot);
});

ProjectModal.displayName = 'ProjectModal';

// Component with styles injection
const ProjectModalWithStyles: React.FC<ProjectModalProps> = (props) => {
  // Inject styles only once using useEffect inside the component
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const existingStyle = document.getElementById('project-modal-styles');
      if (!existingStyle) {
        const style = document.createElement('style');
        style.id = 'project-modal-styles';
        style.textContent = `
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-in-out forwards;
            opacity: 0;
          }

          .animate-slideUp {
            animation: slideUp 0.4s ease-out forwards;
            opacity: 0;
            transform: translateY(20px);
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }

          .scrollbar-thin {
            scrollbar-width: thin;
          }

          .scrollbar-track-neutral-800::-webkit-scrollbar-track {
            background: rgb(38, 38, 38);
          }

          .scrollbar-thumb-neutral-600::-webkit-scrollbar-thumb {
            background: rgb(82, 82, 82);
            border-radius: 4px;
          }

          .scrollbar-thumb-neutral-600::-webkit-scrollbar-thumb:hover {
            background: rgb(115, 115, 115);
          }

          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }

          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .line-clamp-none {
            display: block;
            -webkit-line-clamp: unset;
            -webkit-box-orient: unset;
            overflow: visible;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  return <ProjectModal {...props} />;
};

export default ProjectModalWithStyles;
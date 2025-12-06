import React, { useState, useCallback, memo, useRef } from 'react';
import { Calendar, Code, ExternalLink, Github, Eye } from 'lucide-react';
import BlurText from '@/components/BlurText';
import ProjectModal from './ProjectModal';

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
  githubUrl?: string;
  liveUrl?: string;
}

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
  index: number;
}

// Mock project data
const projectsData: Project[] = [
  {
    id: '1',
    title: 'Graduates and Alumni DB System',
    description: 'A centralized platform using K-means clustering to manage alumni records and evaluate institutional impact through graduate tracer data.',
    contribution: 'Full-stack development including database design, clustering algorithms implementation, responsive UI/UX design, and deployment configuration.',
    techStack: ['Laravel', 'Blade', 'PHP', 'MySQL', 'JavaScript', 'Tailwind CSS'],
    dateCreated: '2024-01-15',
    mainImage: 'https://via.placeholder.com/600x400/1e40af/ffffff?text=Alumni+Tracer+System',
    screenshots: [
      'https://via.placeholder.com/800x600/1e40af/ffffff?text=Dashboard+View',
      'https://via.placeholder.com/800x600/2563eb/ffffff?text=Alumni+Records',
      'https://via.placeholder.com/800x600/3b82f6/ffffff?text=Analytics+Page',
      'https://via.placeholder.com/800x600/3b82f6/ffffff?text=Analytics+Page',
      'https://via.placeholder.com/800x600/3b82f6/ffffff?text=Analytics+Page',
      'https://via.placeholder.com/800x600/60a5fa/ffffff?text=Reports+Section'
    ],
    githubUrl: 'https://github.com/example/alumni-system',
    liveUrl: 'https://alumni-system.demo.com'
  },
  {
    id: '2',
    title: 'E-Commerce Platform',
    description: 'Modern e-commerce platform with real-time inventory management, payment integration, and advanced analytics dashboard.',
    contribution: 'Led the development of the entire platform including payment gateway integration, inventory management system, and admin dashboard.',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'Redux'],
    dateCreated: '2023-08-20',
    mainImage: 'https://via.placeholder.com/600x400/059669/ffffff?text=E-Commerce+Platform',
    screenshots: [
      'https://via.placeholder.com/800x600/059669/ffffff?text=Product+Catalog',
      'https://via.placeholder.com/800x600/065f46/ffffff?text=Shopping+Cart',
      'https://via.placeholder.com/800x600/047857/ffffff?text=Checkout+Process',
      'https://via.placeholder.com/800x600/0d9488/ffffff?text=Admin+Dashboard'
    ],
    githubUrl: 'https://github.com/example/ecommerce-platform',
    liveUrl: 'https://ecommerce-demo.com'
  },
  {
    id: '3',
    title: 'Task Management System',
    description: 'Collaborative task management application with real-time updates, team collaboration features, and project analytics.',
    contribution: 'Designed and implemented the entire application architecture, real-time communication system, and user interface components.',
    techStack: ['Vue.js', 'Firebase', 'TypeScript', 'Vuetify', 'Socket.io'],
    dateCreated: '2023-05-10',
    mainImage: 'https://via.placeholder.com/600x400/7c3aed/ffffff?text=Task+Management+System',
    screenshots: [
      'https://via.placeholder.com/800x600/7c3aed/ffffff?text=Task+Board',
      'https://via.placeholder.com/800x600/8b5cf6/ffffff?text=Project+Overview',
      'https://via.placeholder.com/800x600/a855f7/ffffff?text=Team+Chat',
      'https://via.placeholder.com/800x600/c084fc/ffffff?text=Analytics+View'
    ],
    githubUrl: 'https://github.com/example/task-management',
    liveUrl: 'https://taskmanager-demo.com'
  }
];

// Custom hook for intersection observer
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const ref = useRef(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersectingNow = entry.isIntersecting;
        setIsIntersecting(isIntersectingNow);
        
        if (isIntersectingNow) {
          setHasIntersected(true);
          setIsExiting(false);
        } else if (hasIntersected && !isIntersectingNow) {
          setIsExiting(true);
        }
      },
      { threshold: 0.1, rootMargin: '-20% 0px', ...options }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [hasIntersected]);

  return { ref, isIntersecting, hasIntersected, isExiting };
};

// Project Card Component
const ProjectCard = memo<ProjectCardProps>(({ project, onViewDetails, index }) => {
  const { ref, hasIntersected, isExiting } = useIntersectionObserver();
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = useCallback(() => {
    onViewDetails(project);
  }, [project, onViewDetails]);

  const handleExternalLink = useCallback((e: React.MouseEvent, url?: string) => {
    e.stopPropagation();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }, []);

  const animationDelay = index * 150;

  return (
    <div 
      ref={ref}
      className={`bg-neutral-900 border border-neutral-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group relative overflow-hidden cursor-pointer ${
        isExiting
          ? 'opacity-70 scale-98'
          : hasIntersected 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-12 scale-95'
      }`}
      style={{
        transitionDelay: `${animationDelay}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Animated gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br from-neutral-700/20 to-neutral-600/20 transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} />

      {/* Card Content */}
      <div className="flex flex-col lg:flex-row h-full">
        {/* Image Section - TOP on mobile, LEFT on desktop */}
        <div className="w-full lg:w-80 h-48 lg:h-auto relative overflow-hidden rounded-t-2xl lg:rounded-l-2xl lg:rounded-t-none">
          <img
            src={project.mainImage}
            alt={`${project.title} preview`}
            className={`w-full h-full object-cover transition-all duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
          <div className={`absolute inset-0 bg-gradient-to-r from-black/30 to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
          
          {/* External Links on Image */}
          <div className={`absolute top-3 right-3 flex gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            {project.githubUrl && (
              <button
                onClick={(e) => handleExternalLink(e, project.githubUrl)}
                className="p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-300 hover:scale-110 group/btn border border-white/20 hover:border-white/40"
                aria-label="View GitHub repository"
              >
                <Github className="w-4 h-4 text-white group-hover/btn:scale-110 transition-transform duration-200" />
              </button>
            )}
            {project.liveUrl && (
              <button
                onClick={(e) => handleExternalLink(e, project.liveUrl)}
                className="p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-300 hover:scale-110 group/btn border border-white/20 hover:border-white/40"
                aria-label="View live project"
              >
                <ExternalLink className="w-4 h-4 text-white group-hover/btn:scale-110 transition-transform duration-200" />
              </button>
            )}
          </div>

          {/* Click to view indicator on mobile */}
          <div className={`lg:hidden absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Tap to view
            </div>
          </div>
        </div>

        {/* Content Section - BOTTOM on mobile, RIGHT on desktop */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-neutral-300" />
              <span className="text-xs sm:text-sm text-neutral-300">
                {new Date(project.dateCreated).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>

            {/* Title */}
            <h3 className={`text-lg sm:text-xl lg:text-2xl font-semibold mb-3 lg:mb-4 transition-all duration-300 ${
              isHovered ? 'text-white translate-x-1' : 'text-neutral-100'
            }`}>
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-neutral-300 leading-relaxed mb-4 lg:mb-6 text-sm sm:text-base line-clamp-3 lg:line-clamp-none">
              {project.description}
            </p>

            {/* Tech Stack */}
            <div className="mb-4 lg:mb-6">
              <div className="flex items-center gap-2 mb-2 lg:mb-3">
                <Code className="w-4 h-4 text-neutral-300" />
                <span className="text-xs sm:text-sm font-medium text-neutral-200">Tech Stack</span>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {project.techStack.slice(0, 4).map((tech, techIndex) => (
                  <span 
                    key={techIndex}
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-300 ${
                      isHovered 
                        ? 'bg-neutral-700 text-neutral-100 scale-105 shadow-lg' 
                        : 'bg-neutral-800 text-neutral-300'
                    }`}
                    style={{
                      transitionDelay: `${techIndex * 50}ms`,
                    }}
                  >
                    {tech}
                  </span>
                ))}
                {project.techStack.length > 4 && (
                  <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full bg-neutral-700 text-neutral-200">
                    +{project.techStack.length - 4} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* View Details Button - Hidden on mobile since card is clickable */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className={`hidden lg:flex items-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-all duration-300 self-start group/btn border border-neutral-600 hover:border-neutral-500 ${
              isHovered ? 'scale-105 shadow-lg' : 'scale-100'
            }`}
          >
            <Eye className="w-4 h-4 text-neutral-300 group-hover/btn:text-white transition-colors" />
            <span className={`text-sm font-medium transition-all duration-300 ${
              isHovered ? 'text-white translate-x-1' : 'text-neutral-300'
            }`}>
              View Details
            </span>
          </button>
        </div>
      </div>

      {/* Hover border effect */}
      <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 pointer-events-none ${
        isHovered ? 'border-neutral-600' : 'border-transparent'
      }`} />
    </div>
  );
});

ProjectCard.displayName = 'ProjectCard';

// Main Projects Component
const ProjectsSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { ref: headerRef, hasIntersected: headerVisible, isExiting: headerExiting } = useIntersectionObserver();

  const handleViewDetails = useCallback((project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  }, []);

  return (
    <section className="relative z-10 px-4 sm:px-6 py-20 mt-10">
      <div className="py-20 -mt-20">
        <div className="max-w-7xl mx-auto">
          <div className='justify-center flex'>
            <h1 className="tracking-tight">
              <BlurText
                text="P R O J E C T S"
                delay={70}
                animateBy="words"
                direction="top"
                className="text-1xl mb-4 text-center -mt-10"
              />
            </h1>
          </div>
          {/* Projects Grid */}
          <div className="space-y-6 sm:space-y-8">
            {projectsData.map((project, index) => (
              <ProjectCard 
                key={project.id}
                project={project} 
                onViewDetails={handleViewDetails}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Project Modal */}
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </section>
  );
};

export default ProjectsSection;
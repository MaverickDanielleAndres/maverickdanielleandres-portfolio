import React, { useState, useCallback, memo, useRef } from 'react';
import { Calendar, Code, ExternalLink, Github, Eye } from 'lucide-react';
import BlurText from '@/components/BlurText';
import ProjectModalWithStyles from './ProjectModal';

// Types
interface Project {
  id: string;
  title: string;
  description: string;
  contribution: string;
  techStack: string[];
  dateCreated: string;
  mainImage: string;
  features: string[];
  videoUrl?: string;
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
    title: 'Web Design UI/UX Collection',
    description:
      'Collection of modern and responsive UI/UX design samples created in Figma, showcasing landing pages, dashboards, and component systems.',
    contribution:
      'End-to-end UI/UX design including wireframing, prototyping, component creation, color systems, typography, and responsive layout design using Figma.',
    techStack: ['Figma', 'UI/UX Design', 'Prototyping', 'Wireframing'],
    dateCreated: '2025',
    mainImage: '/Figma.jpg',
    videoUrl: '/Projects/Figma Designs/vid/figma vid preview.mp4',
    screenshots: [
      '/Projects/Figma Designs/screenshots/maverick.png',
      '/Projects/Figma Designs/screenshots/Screenshot 2025-12-11 204902.png',
            '/Projects/Figma Designs/screenshots/Screenshot 2025-12-12 125848.png',
      '/Projects/Figma Designs/screenshots/Screenshot 2025-12-12 124548.png',
      '/Projects/Figma Designs/screenshots/Screenshot 2025-12-13 224307.png',
      '/Projects/Figma Designs/screenshots/Screenshot 2025-12-13 020916.png',
      '/Projects/Figma Designs/screenshots/Screenshot 2025-12-13 224639.png',
      '/Projects/Figma Designs/screenshots/Screenshot 2025-12-13 224656.png',
       '/Projects/Figma Designs/screenshots/Screenshot 2025-12-11 205433.png'
    ],
    features: [
      'Responsive desktop and mobile layouts',
      'Reusable component system (buttons, cards, forms)',
      'Consistent color palettes and typography tokens',
      'Prototype-ready screens for user testing',
      'Wireframes, mockups, and high-fidelity UI samples'
    ],
    githubUrl: '',
    liveUrl: ''
  },
  {
    id: '2',
    title: 'Learning Management System with AI-Generated Reviewer',
    description:
      'A full LMS designed for 1,000+ students and teachers, featuring AI-powered summarization, auto-generated exam reviewers, flashcards, predictive analytics, chatbot assistance, and a complete grading & class management workflow.',
    contribution:
      'Led the full development of the LMS including system architecture, UI/UX, multi-role authentication, AI modules, analytics dashboard, and deployment on IONOS.',
    techStack: ['PHP', 'HTML', 'CSS', 'Bootstrap', 'JavaScript', 'MySQL'],
    dateCreated: '2025-11-20',
    mainImage: 'https://via.placeholder.com/600x400/3b82f6/ffffff?text=LMS+with+AI+Features',
    videoUrl: '/Projects/Learning Management System/vid/lms vid.mp4',
    screenshots: [
      '/Projects/Learning Management System/screenshots/Priority (1).png',
      '/Projects/Learning Management System/screenshots/Priority (2).png',
      '/Projects/Learning Management System/screenshots/Priority (3).png',
      '/Projects/Learning Management System/screenshots/Priority (4).png',
      '/Projects/Learning Management System/screenshots/Priority (5).png',
      '/Projects/Learning Management System/screenshots/Priority (6).png',
      '/Projects/Learning Management System/screenshots/Priority (7).png',
      '/Projects/Learning Management System/screenshots/Priority (8).png',
      '/Projects/Learning Management System/screenshots/Priority.png',
      '/Projects/Learning Management System/screenshots/Screenshot 2025-12-10 233459.png',
      '/Projects/Learning Management System/screenshots/Screenshot 2025-12-10 234431.png',
      '/Projects/Learning Management System/screenshots/Screenshot 2025-12-10 234456.png',
      '/Projects/Learning Management System/screenshots/Screenshot 2025-12-10 234503.png',
      '/Projects/Learning Management System/screenshots/Screenshot 2025-12-10 234514.png',
      '/Projects/Learning Management System/screenshots/Screenshot 2025-12-10 234520.png',
      '/Projects/Learning Management System/screenshots/Screenshot 2025-12-10 234527.png',
      '/Projects/Learning Management System/screenshots/Screenshot 2025-12-10 234532.png',
      '/Projects/Learning Management System/screenshots/Screenshot 2025-12-10 234540.png',
      '/Projects/Learning Management System/screenshots/Screenshot 2025-12-10 234546.png',
      '/Projects/Learning Management System/screenshots/Screenshot 2025-12-10 234609.png',
      '/Projects/Learning Management System/screenshots/Screenshot 2025-12-10 234615.png',
      '/Projects/Learning Management System/screenshots/Screenshot 2025-12-10 234944.png',
      '/Projects/Learning Management System/screenshots/Screenshot 2025-12-10 234953.png',
      '/Projects/Learning Management System/screenshots/Screenshot 2025-12-10 235000.png',
      '/Projects/Learning Management System/screenshots/Screenshot 2025-12-10 235007.png',
      '/Projects/Learning Management System/screenshots/Screenshot 2025-12-10 235125.png',
      '/Projects/Learning Management System/screenshots/Screenshot 2025-12-10 235140.png',
      '/Projects/Learning Management System/screenshots/Screenshot 2025-12-10 235151.png',
      '/Projects/Learning Management System/screenshots/Screenshot 2025-12-10 235157.png',
      '/Projects/Learning Management System/screenshots/Screenshot 2025-12-10 235229.png',
      '/Projects/Learning Management System/screenshots/Screenshot 2025-12-10 235240.png',
      '/Projects/Learning Management System/screenshots/Screenshot 2025-12-10 235249.png'
    ],
    features: [
      'AI-powered reviewer and flashcard generator',
      'Multi-role authentication with secure login',
      'Student performance analytics and predictions',
      'Complete class, grading, and module management',
      'Deployment with database & hosting optimization'
    ],
    githubUrl: 'https://github.com/example/lms-ai-reviewer',
    liveUrl: 'https://lms-ai.demo.com'
  },
  {
    id: '3',
    title: 'E-Community Engagement Platform',
    description:
      'A modern web platform for community engagement with features including voting & surveys, complaint reporting, real-time messaging, group channels, notifications, community data insights, and sentiment analysis.',
    contribution:
      'Developed the entire system including frontend UI, backend API, real-time messaging, role-based permissions, AI sentiment analysis, and Supabase integration.',
    techStack: [
      'Next.js',
      'React',
      'Tailwind CSS',
      'Node.js',
      'Express',
      'Supabase',
      'PostgreSQL'
    ],
    dateCreated: '2025-11-05',
    mainImage: 'https://via.placeholder.com/600x400/059669/ffffff?text=Community+Platform',
    videoUrl: '/Projects/E-Community/vid/ECOM vid.mp4',
    screenshots: [
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 110325.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 110332.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 110342.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 110351.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 110417.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 110425.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 110435.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 110452.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 110503.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 110518.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 110541.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 110601.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 110614.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 110638.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 110652.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 110701.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 110725.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 110733.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 110804.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 111628.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 111637.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 111702.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 111710.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 111730.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 111751.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 111759.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 111813.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 111845.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 111929.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 111952.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 112007.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 112016.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 112032.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 112048.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 112111.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 112123.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 112141.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 112229.png',
      '/Projects/E-Community/screenshots/Screenshot 2025-12-11 112303.png'
    ],
    features: [
      'Real-time messaging and group channels',
      'AI-powered sentiment analysis for community insights',
      'Voting, surveys, and participatory engagement tools',
      'Role-based access control for admins and users',
      'Supabase authentication and PostgreSQL integration'
    ],
    githubUrl: 'https://github.com/example/community-engagement',
    liveUrl: 'https://community.demo.com'
  },
  {
    id: '4',
    title: 'Barangay Ugong Gym Registration System',
    description:
      'A streamlined membership registration and tracking system for Barangay Ugong gym users featuring automated approvals, ID verification, and centralized user management.',
    contribution:
      'Designed the entire UI and led the development team. Implemented main workflows, registration and user management',
    techStack: ['PHP', 'HTML', 'CSS', 'JS', 'Bootstrap', 'MySQL', 'XML'],
    dateCreated: '2024-11-10',
    mainImage: '/Projects/Gym Registration/preview image/Preview gym.png',
    screenshots: [
      '/Projects/Gym Registration/screenshots/Screenshot 2025-12-11 140203.png',
      '/Projects/Gym Registration/screenshots/Screenshot 2025-12-11 140216.png',
      '/Projects/Gym Registration/screenshots/Screenshot 2025-12-11 140225.png',
      '/Projects/Gym Registration/screenshots/Screenshot 2025-12-11 140242.png',
      '/Projects/Gym Registration/screenshots/Screenshot 2025-12-11 140313.png',
      '/Projects/Gym Registration/screenshots/Screenshot 2025-12-11 140323.png',
      '/Projects/Gym Registration/screenshots/Screenshot 2025-12-11 140343.png',
      '/Projects/Gym Registration/screenshots/Screenshot 2025-12-11 140653.png',
      '/Projects/Gym Registration/screenshots/Screenshot 2025-12-11 140711.png',
      '/Projects/Gym Registration/screenshots/Screenshot 2025-12-11 140757.png',
      '/Projects/Gym Registration/screenshots/Screenshot 2025-12-11 141009.png',
      '/Projects/Gym Registration/screenshots/Screenshot 2025-12-11 141019.png',
      '/Projects/Gym Registration/screenshots/Screenshot 2025-12-11 141029.png',
      '/Projects/Gym Registration/screenshots/Screenshot 2025-12-11 141036.png',
      '/Projects/Gym Registration/screenshots/Screenshot 2025-12-11 141051.png'
    ],
    features: [
      'Automated membership approval workflow',
      'Centralized admin dashboard for user management',
      'Streamlit-powered clean and responsive UI',
      'Integrated logs for attendance and monitoring'
    ],
    githubUrl: 'https://github.com/example/gym-registration',
    liveUrl: 'https://gym.demo.com'
  },
  {
    id: '5',
    title: 'Barangay Health System',
    description:
      'A complete barangay-level health record management system with patient profiles, check-up logs, medicine inventory tracking, and administrative monitoring tools.',
    contribution:
      'Led a 4–6 member development team. Designed full UI/UX and implemented the front-end, back-end CRUD modules, and admin workflows.',
    techStack: ['PHP', 'HTML', 'CSS', 'Bootstrap', 'JavaScript', 'MySQL'],
    dateCreated: '2024-05-18',
    mainImage: '/Projects/Barangay Health System/preview image/Preview.png',
    screenshots: [
      '/Projects/Barangay Health System/screenshots/Screenshot 2025-12-11 133108.png',
      '/Projects/Barangay Health System/screenshots/Screenshot 2025-12-11 133117.png',
      '/Projects/Barangay Health System/screenshots/Screenshot 2025-12-11 133129.png',
      '/Projects/Barangay Health System/screenshots/Screenshot 2025-12-11 133141.png',
      '/Projects/Barangay Health System/screenshots/Screenshot 2025-12-11 133228.png',
      '/Projects/Barangay Health System/screenshots/Screenshot 2025-12-11 133608.png',
      '/Projects/Barangay Health System/screenshots/Screenshot 2025-12-11 133634.png',
      '/Projects/Barangay Health System/screenshots/Screenshot 2025-12-11 133659.png',
      '/Projects/Barangay Health System/screenshots/Screenshot 2025-12-11 133710.png',
      '/Projects/Barangay Health System/screenshots/Screenshot 2025-12-11 133753.png'
    ],
    features: [
      'Complete patient profile and health history records',
      'Check-up logging and medical monitoring workflow',
      'Admin dashboard with CRUD operations',
      'Medicine Inventory Management',
      'Secure login and role-based access',
    ],
    githubUrl: 'https://github.com/example/barangay-health',
    liveUrl: 'https://health.demo.com'
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
      <div className={`absolute inset-0 bg-linear-to-br from-neutral-700/20 to-neutral-600/20 transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} />

      {/* Card Content */}
      <div className="flex flex-col lg:flex-row h-full">
        {/* Video/Image Section - TOP on mobile, LEFT on desktop */}
        <div className="w-full lg:w-80 h-48 lg:h-auto relative overflow-hidden rounded-t-2xl lg:rounded-l-2xl lg:rounded-t-none">
          {project.videoUrl ? (
            <video
              src={project.videoUrl}
              className={`w-full h-full object-cover transition-all duration-500 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img
              src={project.mainImage}
              alt={`${project.title} preview`}
              className={`w-full h-full object-cover transition-all duration-500 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
            />
          )}
          <div className={`absolute inset-0 bg-linear-to-r from-black/30 to-transparent transition-opacity duration-300 ${
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
    <section id='projects' className="relative z-10 px-4 sm:px-6 py-20 mt-10">
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
        <ProjectModalWithStyles
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </section>
  );
};

export default ProjectsSection;
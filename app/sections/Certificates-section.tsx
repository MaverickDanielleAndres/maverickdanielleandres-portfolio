import React, { useState, useCallback, memo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, Calendar, Award, Download, Share2, Maximize2 } from 'lucide-react';

// Types
interface Certificate {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  issuer: string;
  date: string;
  image: string;
  skills: string[];
}

interface CertificateCardProps {
  certificate: Certificate;
  onCardClick: (certificate: Certificate) => void;
  onEnlargeClick: (certificate: Certificate) => void;
  index: number;
}

interface CertificateModalProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
  onEnlargeImage: (certificate: Certificate) => void;
}

interface FullScreenImageModalProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
}

const certificatesData: Certificate[] = [

  {
    id: '1',
    title: 'The Complete Networking Fundamentals Course (CCNA Start)',
    shortDescription: 'Networking fundamentals including CCNA-level concepts, protocols, and hands-on labs.',
    fullDescription: `
A comprehensive course covering the fundamentals of networking including OSI model, IP addressing, routing, switching, VLANs, subnetting, and CCNA preparation. Hands-on labs included.

Instructor: David Bombal
Certificate No.: UC-50ea970c-2821-456a-Bd69-02bae0840888
Certificate URL: ude.my/UC-50ea970c-282f-456a-8d69-02bae0840888
Reference Number: 0004
Hours: 73 total hours`,
    issuer: 'Udemy',
    date: 'Dec 7, 2025',
    image: '/Cetificates/Networking.jpg',
    skills: ['Networking', 'CCNA', 'Cisco', 'Infrastructure']
  },

  {
    id: '2',
    title: 'Figma Essential for UI/UX',
    shortDescription: 'Foundational skills in UI/UX design using Figma for modern product design.',
    fullDescription: `
A complete introduction to Figma covering UI components, auto-layout, prototyping, wireframing, and visual design principles.

Instructor: Learnify IT
Certificate No.: UC-fd7d2c70-9f82-45db-8853-82b844684650
Certificate URL: ude.my/UC-fd7d2c70-9182-45db-8853-82b844684650
Reference Number: 0004
Hours: 4 total hours`,
    issuer: 'Udemy',
    date: 'Aug 13, 2025',
    image: '/Cetificates/Figma Essential for User Interface and User Experience UI UX.jpg',
    skills: ['Figma', 'UI/UX', 'Prototyping', 'Design Systems']
  },

  {
    id: '3',
    title: 'The Complete Full-Stack Web Development Bootcamp',
    shortDescription: 'Full-stack development using HTML, CSS, JS, React, Node, PostgreSQL, APIs, and databases.',
    fullDescription: `
A full-stack bootcamp covering frontend, backend, databases, authentication, deployment, and modern JS development. HTML, CSS, Javascript, Node, React, PostgreSQL, Web3

Instructor: Dr. Angela Yu
Certificate No.: UC-1bcdab1e-303e-4d35-8aaB-ceeeb589183f
Certificate URL: ude.my/UC-1bcdable-303e-4d35-8aa8-ceeeb589f83f
Reference Number: 0004
Hours: 61.5 total hours`,
    issuer: 'Udemy',
    date: 'Aug 8, 2025',
    image: '/Cetificates/The Complete Full-Stack Web Development Bootcamp.jpg',
    skills: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Full-Stack']
  },

  {
    id: '4',
    title: 'GIT, GitLab, GitHub Fundamentals for Software Developers',
    shortDescription: 'Complete version control workflow for modern software development.',
    fullDescription: `
A practical guide to Git fundamentals including commits, branching, merging, GitHub workflows, and GitLab CI basics.

Instructor: MTF Institute of Management, Technology and Finance
Certificate No.: UC-119f2b27-c24a-41de-8874-e2569c3eB651
Certificate URL: ude.my/UC-1f9f2b27-c24a-41de-8874-e2569c3e8651
Reference Number: 0004
Hours: 1 total hour`,
    issuer: 'Udemy',
    date: 'Aug 8, 2025',
    image: '/Cetificates/Git.jpg',
    skills: ['Git', 'GitHub', 'Version Control', 'Collaboration']
  },

  {
    id: '5',
    title: 'Complete MS Office and Web Design Development Course',
    shortDescription: 'MS Office productivity combined with beginner-friendly web design.',
    fullDescription: `
A combined course covering advanced MS Office skills and foundational web design (HTML, CSS, PHP, MySQL, WordPress).

Instructor: Nerding I/O, Zechariah Tech
Certificate No.: UC-a21449e9-249a-4tde-8e56-43b287742ed9
Certificate URL: ude.my/UC-a2f449e9-249a-4fde-8e56-43b287742ed9
Reference Number: 0004
Hours: 10.5 total hours`,
    issuer: 'Udemy',
    date: 'Aug 8, 2025',
    image: '/Cetificates/Ms Office.jpg',
    skills: ['MS Office', 'HTML', 'CSS', 'Web Design']
  },

  {
    id: '6',
    title: 'Hands-On React JS: Beginner to Expert',
    shortDescription: 'React development from fundamentals to advanced component patterns.',
    fullDescription: `
A hands-on React course covering JSX, components, props, state, hooks, routing, and application structure.

Instructor: Learnify IT
Certificate No.: UC-b829430c-7bbd-407b-827a-e6bdc094f4ea
Certificate URL: ude.my/UC-b829430c-7bbd-407b-827a-e6bdc094f4ea
Reference Number: 0004
Hours: 4.5 total hours`,
    issuer: 'Udemy',
    date: 'Aug 8, 2025',
    image: '/Cetificates/React.jpg',
    skills: ['React', 'JavaScript', 'Hooks', 'Frontend']
  },

  {
    id: '7',
    title: 'Web Development Bootcamp with HTML, CSS, PHP, MySQL & WordPress',
    shortDescription: 'Web development fundamentals and CMS-based website creation.',
    fullDescription: `
A beginner-to-intermediate course covering static website design, PHP backend, MySQL database, and WordPress CMS setup.

Instructor: Marcus Menti, Zechariah Tech
Certificate No.: UC-b82f9c7d-dab5-434e-afab-11e1f9b6b446
Certificate URL: ude.my/UC-b82f9c7d-dab5-434e-afab-11e1f9b6b446
Reference Number: 0004
Hours: 13.5 total hours`,
    issuer: 'Udemy',
    date: 'Aug 8, 2025',
    image: '/Cetificates/Web Development Bootcamp with HTML CSS PHP MySQL Wordpress.jpg',
    skills: ['HTML', 'CSS', 'PHP', 'MySQL', 'WordPress']
  },
   {
    id: '8',
    title: 'Information Security Crash Course: Quick Steps to Safety',
    shortDescription: 'Cybersecurity principles, secure coding, data protection, encryption, and lots more to safeguard systems.',
    fullDescription: `
A comprehensive course covering cybersecurity fundamentals including secure coding practices, data protection, encryption techniques, and system security measures.

Instructor: Andrii Piatakha
Certificate No.: UC-18fb0c48-44c8-44b1-86aa-e926d02107f9
Certificate URL: ude.my/UC-18fb0c48-44c8-44b1-86aa-e926d02107f9
Reference Number: 0004
Hours: 7 total hours`,
    issuer: 'Udemy',
    date: 'Oct 30, 2025',
    image: '/Cetificates/Security.png',
    skills: ['Cybersecurity', 'Secure Coding', 'Data Protection', 'Encryption', 'System Security']
  }
];


// Focus trap hook for accessibility
const useFocusTrap = (isOpen: boolean) => {
  const firstFocusableElement = useRef<HTMLElement | null>(null);
  const lastFocusableElement = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    if (focusableElements.length === 0) return;

    firstFocusableElement.current = focusableElements[0];
    lastFocusableElement.current = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement.current) {
            lastFocusableElement.current?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement.current) {
            firstFocusableElement.current?.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstFocusableElement.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  return modalRef;
};

// Custom hook for intersection observer
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
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

// BlurText component for animated text
interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom" | "left" | "right";
  className?: string;
}

const BlurText = ({ text, delay = 50, animateBy = "words", direction = "top", className = "" }: BlurTextProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');

  return (
    <div ref={ref} className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          className={`inline-block transition-all duration-1000 ${
            isVisible ? 'blur-0 opacity-100 translate-y-0' : 'blur-sm opacity-0 translate-y-4'
          }`}
          style={{
            transitionDelay: `${index * delay}ms`,
          }}
        >
          {word}&nbsp;
        </span>
      ))}
    </div>
  );
};

// Full Screen Image Modal Component with Portal
const FullScreenImageModal = memo<FullScreenImageModalProps>(({ certificate, isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
  const modalRef = useFocusTrap(isOpen);

   useEffect(() => {
    if (isOpen && !modalRoot) {
      const root = document.createElement('div');
      root.id = 'certificate-fullscreen-modal-root';
      document.body.appendChild(root);
      setModalRoot(root);
    }

    return () => {
      if (modalRoot && document.body.contains(modalRoot)) {
        document.body.removeChild(modalRoot);
        setModalRoot(null);
      }
    };
  }, [isOpen, modalRoot]);
  
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  }, [onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  }, [handleClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !certificate || !modalRoot) return null;

  const modalContent = (
    <div
      ref={modalRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 60000,
        margin: 0
      }}
      className={`flex items-center justify-center transition-all duration-300 p-2 sm:p-4 lg:p-6 ${
        isClosing
          ? 'bg-black/0'
          : 'bg-black/95'
      }`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Full screen certificate image"
    >
      {/* Close Button - Top Right */}
      <button
        onClick={handleClose}
        className={`absolute top-6 right-6 lg:top-12 lg:right-12 z-61000 p-2 bg-black/70 hover:bg-red-900/90 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-90 group border border-white/30 hover:border-red-500 shadow-lg ${
          isClosing ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
        }`}
        aria-label="Close full screen view"
        style={{
          backdropFilter: 'blur(10px)',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.6)',
          pointerEvents: 'auto'
        }}
      >
        <X className="w-5 h-5 text-white group-hover:text-red-300 transition-all duration-200" />
      </button>

      {/* Full Screen Image */}
      <div className={`relative max-w-2xl max-h-[60vh] mb-16 transition-all duration-300 ${
        isClosing
          ? 'opacity-0 scale-90'
          : 'opacity-100 scale-100'
      }`}>
        <img
          src={certificate.image}
          alt={`${certificate.title} certificate full size`}
          className="w-full h-full object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );

  return createPortal(modalContent, modalRoot);
});

FullScreenImageModal.displayName = 'FullScreenImageModal';

// Updated Certificate Card Component with image below details
const CertificateCard = memo<CertificateCardProps>(({ certificate, onCardClick, onEnlargeClick, index }) => {
  const { ref, hasIntersected, isExiting } = useIntersectionObserver();
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = useCallback(() => {
    onCardClick(certificate);
  }, [certificate, onCardClick]);

  const handleEnlargeClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEnlargeClick(certificate);
  }, [certificate, onEnlargeClick]);

  const animationDelay = index * 150;

  return (
    <div 
      ref={ref}
      className={`bg-neutral-900 border border-neutral-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group relative overflow-hidden h-full ${
        isExiting
          ? 'opacity-70 scale-98'
          : hasIntersected 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-12 scale-95'
      }`}
      style={{
        transitionDelay: `${animationDelay}ms`,
      }}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Animated gradient overlay */}
      <div className={`absolute inset-0 bg-linear-to-br from-neutral-700/20 to-neutral-600/20 transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} />

      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Award className={`w-4 h-4 text-neutral-300 transition-all duration-300 ${
            isHovered ? 'rotate-12 scale-110 text-white' : 'rotate-0 scale-100'
          }`} />
          <span className="text-sm text-neutral-300 font-medium">{certificate.issuer}</span>
          <span className="text-sm text-neutral-500">•</span>
          <span className="text-sm text-neutral-300">{certificate.date}</span>
        </div>

        {/* Title */}
        <h3 className={`text-lg sm:text-xl font-semibold mb-3 transition-all duration-300 ${
          isHovered ? 'text-white translate-x-1' : 'text-neutral-100'
        }`}>
          {certificate.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-neutral-300 leading-relaxed mb-4 grow">
          {certificate.shortDescription}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {certificate.skills.slice(0, 3).map((skill, skillIndex) => (
            <span 
              key={skillIndex}
              className={`px-2 py-1 text-xs rounded-full transition-all duration-300 ${
                isHovered 
                  ? 'bg-neutral-700 text-neutral-100 scale-105' 
                  : 'bg-neutral-800 text-neutral-300'
              }`}
              style={{
                transitionDelay: `${skillIndex * 50}ms`,
              }}
            >
              {skill}
            </span>
          ))}
          {certificate.skills.length > 3 && (
            <span className={`px-2 py-1 text-xs rounded-full transition-all duration-300 ${
              isHovered 
                ? 'bg-neutral-600 text-neutral-100 scale-105' 
                : 'bg-neutral-800 text-neutral-300'
            }`}>
              +{certificate.skills.length - 3} more
            </span>
          )}
        </div>

        {/* Image Section - Now at the bottom */}
        <div className="relative overflow-hidden rounded-xl mt-auto">
          <img
            src={certificate.image}
            alt={`${certificate.title} certificate`}
            className={`w-full h-40 sm:h-48 object-cover transition-all duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
          <div className={`absolute inset-0 bg-linear-to-t from-black/60 to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-40'
          }`} />
          
          {/* Enlarge Button */}
          <button
            onClick={handleEnlargeClick}
            className={`absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-300 hover:scale-110 group/btn border border-white/20 hover:border-white/40 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            aria-label="Enlarge certificate image"
          >
            <Maximize2 className="w-4 h-4 text-white group-hover/btn:scale-110 transition-transform duration-200" />
          </button>

          {/* Click to view overlay */}
          <div className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 ${
            isHovered ? 'text-neutral-200 translate-y-0 opacity-100' : 'text-neutral-400 translate-y-2 opacity-0'
          }`}>
            <div className="flex items-center text-sm">
              <span>Click to view details</span>
              <ExternalLink className={`w-4 h-4 ml-2 transition-transform duration-300 ${
                isHovered ? 'translate-x-1 -translate-y-1' : ''
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Hover border effect */}
      <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 pointer-events-none ${
        isHovered ? 'border-neutral-600' : 'border-transparent'
      }`} />
    </div>
  );
});

CertificateCard.displayName = 'CertificateCard';

// Enhanced Modal Component with Portal
const CertificateModal = memo<CertificateModalProps>(({ certificate, isOpen, onClose, onEnlargeImage }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
  const modalRef = useFocusTrap(isOpen);

  useEffect(() => {
    if (isOpen && !modalRoot) {
      // Create modal root element
      const root = document.createElement('div');
      root.id = 'certificate-modal-root';
      document.body.appendChild(root);
      
      // Add styles to ensure proper rendering
      const style = document.createElement('style');
      style.id = 'certificate-modal-styles';
      style.textContent = `
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in-out forwards;
          opacity: 0;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
          transform: translateY(20px);
          opacity: 0;
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .modal-backdrop {
          backdrop-filter: blur(8px);
        }
      `;
      document.head.appendChild(style);
      setModalRoot(root);
    }

    return () => {
      if (modalRoot && !isOpen) {
        setTimeout(() => {
          if (document.body.contains(modalRoot)) {
            document.body.removeChild(modalRoot);
          }
          const styles = document.getElementById('certificate-modal-styles');
          if (styles) {
            document.head.removeChild(styles);
          }
        }, 300);
        setModalRoot(null);
      }
    };
  }, [isOpen, modalRoot]);

  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsClosing(true);
      setTimeout(onClose, 200);
    }
  }, [onClose]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  }, [onClose]);

  const handleEnlargeImage = useCallback(() => {
    if (!certificate) return;
    onEnlargeImage(certificate);
  }, [certificate, onEnlargeImage]);

  const handleDownload = useCallback(() => {
    if (!certificate) return;
    
    const certificateData = {
      title: certificate.title,
      issuer: certificate.issuer,
      date: certificate.date,
      skills: certificate.skills,
      description: certificate.fullDescription
    };
    
    const dataStr = JSON.stringify(certificateData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${certificate.title.replace(/\s+/g, '_')}_Certificate.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [certificate]);

  const handleShare = useCallback(async () => {
    if (!certificate) return;
    
    const shareData = {
      title: `${certificate.title} Certificate`,
      text: `I earned a certificate in ${certificate.title} from ${certificate.issuer}!`,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`);
        alert('Certificate details copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      try {
        await navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`);
        alert('Certificate details copied to clipboard!');
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
        alert('Unable to share. Please try again.');
      }
    }
  }, [certificate]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  }, [handleClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !certificate || !modalRoot) return null;

  const modalContent = (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50000,
        margin: 0,
        padding: '16px'
      }}
      className={`flex items-center justify-center transition-all duration-300 modal-backdrop ${
        isClosing 
          ? 'bg-black/0' 
          : 'bg-black/80'
      }`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        style={{
          position: 'relative',
          maxWidth: '896px', // max-w-4xl
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: 0
        }}
        className={`bg-neutral-900 rounded-2xl shadow-2xl transition-all duration-300 ${
          isClosing 
            ? 'opacity-0 scale-95 translate-y-4' 
            : 'opacity-100 scale-100 translate-y-0 animate-slideUp'
        }`}
      >
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={handleEnlargeImage}
            className="p-2 bg-neutral-800/90 hover:bg-neutral-700 rounded-full shadow-md transition-all duration-200 hover:shadow-lg hover:scale-110 group border border-neutral-600"
            aria-label="View full screen image"
          >
            <Maximize2 className="w-5 h-5 text-neutral-300 group-hover:text-white transition-colors" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 bg-neutral-800/90 hover:bg-neutral-700 rounded-full shadow-md transition-all duration-200 hover:shadow-lg hover:scale-110 group border border-neutral-600"
            aria-label="Download certificate"
          >
            <Download className="w-5 h-5 text-neutral-300 group-hover:text-white transition-colors" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-neutral-800/90 hover:bg-neutral-700 rounded-full shadow-md transition-all duration-200 hover:shadow-lg hover:scale-110 group border border-neutral-600"
            aria-label="Share certificate"
          >
            <Share2 className="w-5 h-5 text-neutral-300 group-hover:text-white transition-colors" />
          </button>
          <button
            onClick={handleClose}
            className="p-2 bg-neutral-800/90 hover:bg-red-900/80 rounded-full shadow-md transition-all duration-200 hover:shadow-lg hover:scale-110 hover:rotate-90 group border border-neutral-600 hover:border-red-600"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-neutral-300 group-hover:text-red-300 transition-all duration-200" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/2 relative">
            <div className="h-64 md:h-full overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
              <img
                src={certificate.image}
                alt={`${certificate.title} certificate`}
                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={handleEnlargeImage}
              />
              <div className="absolute inset-0 bg-linear-to-t md:bg-linear-to-r from-black/70 to-transparent" />
              
              {/* Overlay Enlarge Button */}
              <button
                onClick={handleEnlargeImage}
                className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/20 transition-opacity duration-300 group"
                aria-label="Click to enlarge image"
              >
                <div className="p-4 bg-black/50 rounded-full group-hover:scale-110 transition-transform duration-200">
                  <Maximize2 className="w-8 h-8 text-white" />
                </div>
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-neutral-300" />
                <span className="text-sm text-neutral-300 font-medium">{certificate.issuer}</span>
                <span className="text-sm text-neutral-500">•</span>
                <Calendar className="w-4 h-4 text-neutral-300" />
                <span className="text-sm text-neutral-300">{certificate.date}</span>
              </div>

              {/* Title */}
              <h2 id="modal-title" className="text-2xl md:text-3xl font-bold text-white mb-4">
                {certificate.title}
              </h2>

              

              {/* Skills */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-neutral-100 mb-3">Skills & Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {certificate.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-linear-to-r from-neutral-800 to-neutral-700 text-neutral-200 rounded-full text-sm font-medium border border-neutral-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Certificate Badge */}
            <div className="bg-linear-to-r from-neutral-800 to-neutral-700 rounded-xl p-4 border border-neutral-600">
              {/* Description */}
              {(() => {
                const parts = certificate.fullDescription.trim().split('\n\n');
                const description = parts[0];
                const details = parts.slice(1).join('\n\n');
                return (
                  <>
                    <p className="text-neutral-300 leading-relaxed mb-4 text-sm md:text-base">
                      {description}
                    </p>
                    <p className="text-neutral-300 leading-relaxed mb-6 text-sm md:text-base">
                      {details.split('\n').map((line, index) => {
                        const trimmed = line.trim();
                        if (trimmed.includes(':')) {
                          const [label, ...valueParts] = trimmed.split(':');
                          const value = valueParts.join(':').trim();
                          return (
                            <span key={index}>
                             <span className='font-bold'>{label}</span>  : <span> </span>
                               {value}<br />
                            </span>
                          );
                        }
                        return <span key={index}>{trimmed}<br /></span>;
                      })}
                    </p>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, modalRoot);
});

CertificateModal.displayName = 'CertificateModal';

// Main Certificates Component
const CertificatesSection: React.FC = () => {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState<boolean>(false);
  const [fullScreenCertificate, setFullScreenCertificate] = useState<Certificate | null>(null);
  const { ref: headerRef, hasIntersected: headerVisible, isExiting: headerExiting } = useIntersectionObserver();

  const handleCardClick = useCallback((certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsModalOpen(true);
  }, []);

  const handleEnlargeClick = useCallback((certificate: Certificate) => {
    setFullScreenCertificate(certificate);
    setIsFullScreenOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCertificate(null), 300);
  }, []);

  const handleEnlargeFromModal = useCallback((certificate: Certificate) => {
    setFullScreenCertificate(certificate);
    setIsFullScreenOpen(true);
  }, []);

  const handleCloseFullScreen = useCallback(() => {
    setIsFullScreenOpen(false);
    setTimeout(() => setFullScreenCertificate(null), 300);
  }, []);

  return (
    <>
      <section id='certificates' className="relative z-10 px-4 sm:px-6 py-20 mt-10">
        <div className="py-20 -mt-20">
          <div className="max-w-7xl mx-auto">
            {/* Animated Header */}
            <div>
              <h1 className="tracking-tight">
                <BlurText
                  text="C E R T I F I C A T E S"
                  delay={70}
                  animateBy="words"
                  direction="top"
                  className="text-1xl mb-4 text-center -mt-10"
                />
              </h1>
            </div>

            {/* Responsive Grid - 3 columns on large screens, 2 on medium, 1 on small */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {certificatesData.map((certificate, index) => (
                <CertificateCard 
                  key={certificate.id}
                  certificate={certificate} 
                  onCardClick={handleCardClick}
                  onEnlargeClick={handleEnlargeClick}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certificate Details Modal - Rendered with Portal */}
      <CertificateModal
        certificate={selectedCertificate}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEnlargeImage={handleEnlargeFromModal}
      />

      {/* Full Screen Image Modal - Rendered with Portal */}
      <FullScreenImageModal
        certificate={fullScreenCertificate}
        isOpen={isFullScreenOpen}
        onClose={handleCloseFullScreen}
      />
    </>
  );
};

export default CertificatesSection;
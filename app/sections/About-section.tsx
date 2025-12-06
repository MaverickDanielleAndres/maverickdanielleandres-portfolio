"use client"

import React, { useState, useEffect, useRef, useCallback, memo, JSX } from 'react';
import { FileText, Github, Linkedin, GraduationCap, Award, X, Facebook, Instagram, Download } from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';
import ScrollFloat from '@/components/ScrollFloat-about';

// Type definitions
interface AcademicAward {
    id: number;
    title: string;
    semester: string;
    gpa: string;
    image: string;
}

interface AwardsModalProps {
    awards: AcademicAward[];
    isOpen: boolean;
    onClose: () => void;
}

interface DownloadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

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
    const ref = useRef<HTMLDivElement>(null);

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
    }, [hasIntersected, options]);

    return { ref, isIntersecting, hasIntersected, isExiting };
};

// Download Modal Component
const DownloadModal = memo<DownloadModalProps>(({ isOpen, onClose }) => {
    const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle');
    const [isClosing, setIsClosing] = useState(false);
    const modalRef = useFocusTrap(isOpen);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setDownloadStatus('idle');
            setIsClosing(false);
        }, 300);
    }, [onClose]);

    const handleDownload = useCallback(() => {
        setDownloadStatus('downloading');
        
        // Simulate download process
        setTimeout(() => {
            // Randomly simulate success or failure for demo
            const success = Math.random() > 0.3; // 70% success rate
            setDownloadStatus(success ? 'success' : 'error');
            
            if (success) {
                // In a real app, you would trigger the actual download here
                // For example: window.open('/path-to-your-cv.pdf', '_blank');
                console.log('Download successful');
            }
            
            // Auto close after showing result
            setTimeout(() => {
                handleClose();
            }, 2000);
        }, 2000);
    }, [handleClose]);

    const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && downloadStatus !== 'downloading') {
            handleClose();
        }
    }, [handleClose, downloadStatus]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape' && downloadStatus !== 'downloading') {
            handleClose();
        }
    }, [handleClose, downloadStatus]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    const getStatusContent = () => {
        switch (downloadStatus) {
            case 'downloading':
                return {
                    type: 'loading',
                    message: 'Downloading CV...',
                    icon: (
                        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    )
                };
            case 'success':
                return {
                    type: 'success',
                    message: 'CV downloaded successfully!',
                    icon: (
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )
                };
            case 'error':
                return {
                    type: 'error',
                    message: 'Download failed. Please try again.',
                    icon: (
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
            default:
                return {
                    type: 'idle',
                    message: 'Ready to download CV?',
                    icon: <Download className="w-5 h-5 text-blue-400" />
                };
        }
    };

    const statusContent = getStatusContent();

    return (
        <div 
            className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
                isClosing 
                    ? 'bg-black/0 backdrop-blur-none' 
                    : 'bg-black/80 backdrop-blur-sm'
            }`}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="download-modal-title"
        >
            <div 
                ref={modalRef}
                className={`px-8 py-5 rounded-xl border backdrop-blur-md shadow-2xl min-w-[320px] max-w-md transform transition-all duration-300 ease-out ${
                    isClosing 
                        ? 'opacity-0 scale-95 translate-y-4' 
                        : 'opacity-100 scale-100 translate-y-0'
                } ${
                    statusContent.type === 'success' 
                        ? 'bg-neutral-900/95 border-green-500/50 shadow-green-500/20' 
                        : statusContent.type === 'error'
                        ? 'bg-neutral-900/95 border-red-500/50 shadow-red-500/20'
                        : statusContent.type === 'loading'
                        ? 'bg-neutral-900/95 border-blue-500/50 shadow-blue-500/20'
                        : 'bg-neutral-900/95 border-neutral-500/50 shadow-neutral-500/20'
                }`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            statusContent.type === 'success' 
                                ? 'bg-green-500/20' 
                                : statusContent.type === 'error'
                                ? 'bg-red-500/20'
                                : statusContent.type === 'loading'
                                ? 'bg-blue-500/20'
                                : 'bg-neutral-500/20'
                        }`}>
                            {statusContent.icon}
                        </div>
                        <p className="font-medium text-neutral-100">{statusContent.message}</p>
                    </div>
                    
                    {downloadStatus !== 'downloading' && (
                        <button
                            onClick={handleClose}
                            className="ml-4 p-1 hover:bg-neutral-800 rounded-full transition-all duration-200"
                            aria-label="Close modal"
                        >
                            <X className="w-4 h-4 text-neutral-400 hover:text-neutral-200" />
                        </button>
                    )}
                </div>
                
                {downloadStatus === 'idle' && (
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={handleDownload}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/20"
                        >
                            Download
                        </button>
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-medium transition-all duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                )}
                
                {downloadStatus === 'error' && (
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={handleDownload}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-red-600/20"
                        >
                            Retry
                        </button>
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-medium transition-all duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
});

DownloadModal.displayName = 'DownloadModal';

// Academic Awards Modal Component
const AcademicAwardsModal = memo<AwardsModalProps>(({ awards, isOpen, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);
    const modalRef = useFocusTrap(isOpen);

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
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    return (
        <div 
            className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
                isClosing 
                    ? 'bg-black/0 backdrop-blur-none' 
                    : 'bg-black/80 backdrop-blur-sm'
            }`}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="awards-modal-title"
        >
            <div 
                ref={modalRef}
                className={`relative bg-neutral-900 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-neutral-700 transition-all duration-300 ${
                    isClosing 
                        ? 'opacity-0 scale-95 translate-y-4' 
                        : 'opacity-100 scale-100 translate-y-0'
                }`}
            >
                {/* Modal Header */}
                <div className="sticky top-0 bg-neutral-900 border-b border-neutral-700 p-6 flex items-center justify-between z-10">
                    <div>
                        <h3 id="awards-modal-title" className="text-2xl font-bold text-white flex items-center gap-3">
                            <Award className="w-7 h-7 text-yellow-500" />
                            Academic Awards
                        </h3>
                        <p className="text-neutral-400 mt-1">Recognition for academic excellence</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-neutral-800 rounded-full transition-all duration-300 group border border-neutral-600 hover:border-red-600"
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6 text-neutral-400 group-hover:text-red-400 transition-colors" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                        {awards.map((award, index) => (
                            <div 
                                key={award.id}
                                className={`bg-neutral-800/50 rounded-xl overflow-hidden border border-neutral-700/50 hover:border-neutral-600 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 animate-fade-in`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="aspect-video bg-neutral-700 flex items-center justify-center relative overflow-hidden">
                                    <img 
                                        src={award.image} 
                                        alt={`${award.title} certificate`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 to-transparent"></div>
                                    <div className="absolute top-3 right-3">
                                        <div className="bg-yellow-500/20 backdrop-blur-sm rounded-full p-2 border border-yellow-500/30">
                                            <Award className="w-5 h-5 text-yellow-400" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h4 className="text-lg font-semibold text-white mb-2">{award.title}</h4>
                                    <p className="text-neutral-300 text-sm mb-1">{award.semester}</p>
                                    <p className="text-neutral-400 text-sm">{award.gpa}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800/30 rounded-lg border border-neutral-700/30">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span className="text-neutral-300 text-sm font-medium">
                                Consistently maintaining high academic standards
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

AcademicAwardsModal.displayName = 'AcademicAwardsModal';

export default function AboutSection(): JSX.Element {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [showAwardsModal, setShowAwardsModal] = useState<boolean>(false);
    const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);
    const sectionRef = useRef<HTMLElement>(null);
    const { ref: headerRef, hasIntersected: headerVisible, isExiting: headerExiting } = useIntersectionObserver();

    // Academic awards data
    const academicAwards: AcademicAward[] = [
        {
            id: 1,
            title: "President's Lister",
            semester: "1st Semester AY 2023-2024",
            gpa: "1.25 GPA",
            image: "/api/placeholder/400/300"
        },
        {
            id: 2,
            title: "Dean's Lister",
            semester: "2nd Semester AY 2022-2023",
            gpa: "1.45 GPA",
            image: "/api/placeholder/400/300"
        },
        {
            id: 3,
            title: "President's Lister",
            semester: "1st Semester AY 2022-2023",
            gpa: "1.30 GPA",
            image: "/api/placeholder/400/300"
        },
        {
            id: 4,
            title: "Dean's Lister",
            semester: "2nd Semester AY 2021-2022",
            gpa: "1.50 GPA",
            image: "/api/placeholder/400/300"
        }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]) => {
                entries.forEach((entry: IntersectionObserverEntry) => {
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

    const handleHireMeClick = (): void => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const handleDownloadResumeClick = (): void => {
        setShowDownloadModal(true);
    };

    const handleGithubClick = (): void => {
        console.log('GitHub clicked');
    };

    const handleFacebookClick = (): void => {
        console.log('Facebook clicked');
    };

    const handleInstagramClick = (): void => {
        console.log('Instagram clicked');
    };

    const handleLinkedinClick = (): void => {
        console.log('LinkedIn clicked');
    };

    const handleAwardsClick = (): void => {
        setShowAwardsModal(true);
    };

    const handleContactClick = (): void => {
        console.log('Contact clicked');
    };

    const handleCloseAwardsModal = useCallback(() => {
        setShowAwardsModal(false);
    }, []);

    const handleCloseDownloadModal = useCallback(() => {
        setShowDownloadModal(false);
    }, []);

    return (
        <>
            <section id='about' ref={sectionRef} className="relative z-10 px-6 py-16 md:py-20 -mt-10 md:mt-10 mb-4 md:mb-8">
                <div className="py-12 md:py-20 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-neutral-400 text-xs leading-snug -mb-4 ml-4">
                        <ScrollFloat
                            animationDuration={1}
                            ease="back.inOut(2)"
                            scrollStart="center bottom+=50%"
                            scrollEnd="bottom bottom-=40%"
                            stagger={0.03}
                        >
                            Get to know me...
                        </ScrollFloat>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid lg:grid-cols-12 gap-20">
                            {/* Left Side - Content Grid */}
                            <div className="lg:col-span-7 space-y-6">
                                {/* Personal Introduction - Full Width */}
                                <div className={`bg-neutral-900 border border-neutral-700 rounded-2xl p-6 transition-all duration-800 ease-out delay-200 hover:border-neutral-600 ${
                                    isVisible 
                                        ? 'opacity-100 translate-y-0' 
                                        : 'opacity-0 translate-y-8'
                                }`}>
                                    <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                                        About Me
                                    </h3>
                                    <p className="text-neutral-300 text-base leading-relaxed mb-4">
                                        Hi, I'm Maverick Danielle P. Andres, a dedicated Information Technology student at Pamantasan ng Lungsod ng Pasig
                                        with a strong passion for web development and technology. Currently pursuing my B.S. in Information Technology
                                        with an impressive GWA of 1.50, I combine academic excellence with hands-on experience in creating innovative
                                        digital solutions.
                                    </p>
                                    <p className="text-neutral-400 text-base leading-relaxed mb-4">
                                        My technical expertise spans across modern web technologies including HTML, CSS, JavaScript, PHP, SQL, Node.js,
                                        Python, and frameworks like React.js, Next.js, Tailwind CSS, and Express.js. I've gained valuable professional
                                        experience working as a Spes Clerk at the Department of Education, where I processed and encoded over 1,000
                                        documents with 99% accuracy, and as a freelance developer delivering end-to-end web applications for student clients.
                                    </p>
                                    <p className="text-neutral-400 text-base leading-relaxed">
                                        Beyond academics, I've led development of comprehensive systems including a Learning Management System with AI features,
                                        an E-Community Engagement Platform, and various barangay management systems. My commitment to continuous learning
                                        is reflected in my Udemy certifications covering full-stack development, networking fundamentals, and UI/UX design.
                                        I believe in leveraging technology to solve real-world problems and am always eager to take on new challenges
                                        in the ever-evolving field of software development.
                                    </p>
                                </div>

                                {/* Education Background */}
                                <div className={`bg-neutral-900 border border-neutral-700 rounded-2xl p-6 transition-all duration-800 ease-out delay-300 hover:border-neutral-600 ${
                                    isVisible 
                                        ? 'opacity-100 translate-y-0' 
                                        : 'opacity-0 translate-y-8'
                                }`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <GraduationCap className="w-5 h-5 text-neutral-300" />
                                        <h4 className="text-lg font-semibold text-white">Education Background</h4>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <h5 className="text-white font-medium">Pamantasan ng Lungsod ng Pasig</h5>
                                            <p className="text-neutral-400 text-sm">B.S. in Information Technology, GWA: 1.50</p>
                                            <p className="text-neutral-400 text-sm">Aug 2022 - May 2026</p>
                                        </div>
                                        <button
                                            onClick={handleAwardsClick}
                                            className="group flex items-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-white text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-1 border border-neutral-600"
                                        >
                                            <Award className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300 text-yellow-500" />
                                            Academic Awards
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons Grid */}
                                <div className={`space-y-3 transition-all duration-800 ease-out delay-500 ${
                                    isVisible 
                                        ? 'opacity-100 translate-y-0 scale-100' 
                                        : 'opacity-0 translate-y-6 scale-95'
                                }`}>
                                    {/* Top Row - Resume and Download Resume */}
                                    <div className="grid grid-cols-2 gap-3">
                                       {/* Hire Me Button */}
                                        <button
                                            onClick={handleHireMeClick}
                                            className="cursor-pointer group relative px-4 py-3 md:px-6 md:py-4 bg-gradient-to-r from-neutral-700 to-neutral-800 hover:from-neutral-600 hover:to-neutral-700 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-xl hover:shadow-black/25 hover:-translate-y-1 border border-neutral-600 text-sm md:text-base"
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2 md:gap-3">
                                                Hire Me
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </button>
                                       {/* Download Resume Button */}
                                        <button
                                            onClick={handleDownloadResumeClick}
                                            className="cursor-pointer group relative px-4 py-3 md:px-6 md:py-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/25 hover:-translate-y-1 border border-gray-600 text-sm md:text-base"
                                        >
                                            <span className="cursor-pointerrelative z-10 flex items-center justify-center gap-2 md:gap-3">
                                                <Download className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-X-1 transition-transform duration-300" />
                                                Download CV
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </button>
                                    </div>

                                    {/* Bottom Row - Social Media Icons */}
                                    <div className="grid grid-cols-4 gap-3">
                                        <button
                                            onClick={handleLinkedinClick}
                                            className="cursor-pointer group px-3 py-3 md:px-4 md:py-4 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-1 border border-neutral-600 hover:border-neutral-500 flex items-center justify-center"
                                        >
                                            <Linkedin className="w-4 h-4 md:w-5 md:h-5 text-neutral-300 group-hover:text-white transition-colors duration-300" />
                                        </button>
                                        {/* GitHub */}
                                        <button
                                            onClick={handleGithubClick}
                                            className="cursor-pointer group px-3 py-3 md:px-4 md:py-4 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-1 border border-neutral-600 hover:border-neutral-500 flex items-center justify-center"
                                        >
                                            <Github className="w-4 h-4 md:w-5 md:h-5 text-neutral-300 group-hover:text-white transition-colors duration-300" />
                                        </button>

                                        {/* Facebook */}
                                        <button
                                            onClick={handleFacebookClick}
                                            className="cursor-pointer group px-3 py-3 md:px-4 md:py-4 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-1 border border-neutral-600 hover:border-neutral-500 flex items-center justify-center"
                                        >
                                             <Facebook className="w-4 h-4 md:w-5 md:h-5 text-neutral-300 group-hover:text-white transition-colors duration-300" />
                                        </button>
                                        {/* Instagram */}
                                        <button
                                            onClick={handleInstagramClick}
                                            className="cursor-pointer group px-3 py-3 md:px-4 md:py-4 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-1 border border-neutral-600 hover:border-neutral-500 flex items-center justify-center"
                                        >
                                             <Instagram className="w-4 h-4 md:w-5 md:h-5 text-neutral-300 group-hover:text-white transition-colors duration-300" />
                                        </button>
                                    </div>
                                </div>

                            </div>

                            {/* Right Side - Profile Card */}
                            <div className="lg:col-span-5">
                                <div 
                                    className={`-mt-10 flex justify-center transition-all duration-1000 ease-out delay-600 ${
                                        isVisible 
                                            ? 'opacity-100 translate-x-0 scale-100' 
                                            : 'opacity-0 translate-x-16 scale-95'
                                    }`}
                                >
                                    <div className="w-full max-w-md">
                                        <ProfileCard
                                            name="Maverick Danielle P. Andres"
                                            title="Web Developer"
                                            handle="andres"
                                            status="Online"
                                            contactText="Contact Me"
                                            avatarUrl="/profilepic.png"
                                            showUserInfo={true}
                                            enableTilt={true}
                                            enableMobileTilt={true}
                                            onContactClick={handleContactClick}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Academic Awards Modal */}
            <AcademicAwardsModal
                awards={academicAwards}
                isOpen={showAwardsModal}
                onClose={handleCloseAwardsModal}
            />
            
            {/* Download Modal */}
            <DownloadModal
                isOpen={showDownloadModal}
                onClose={handleCloseDownloadModal}
            />

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </>
    );
}
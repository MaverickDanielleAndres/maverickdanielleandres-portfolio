'use client';

import { useState } from 'react';

const Footer: React.FC = () => {
  const [currentYear] = useState(new Date().getFullYear());

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/yourusername',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/in/yourusername',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/yourusername',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/yourusername',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      name: 'Email',
      href: 'mailto:maverickdanielle@gmail.com',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'What I Offer', href: '#what-i-offer' },
    { name: 'Projects', href: '#projects' },
    { name: 'Certificates', href: '#certificates' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <footer className="bg-black border-t border-neutral-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8 lg:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            
            {/* Brand Section */}
            <div className="text-center md:text-left space-y-4">
              <div className="group cursor-pointer inline-block">
                <div className="flex items-center justify-center md:justify-start space-x-2 transition-all duration-300 group-hover:scale-105">
                  <div className="w-8 h-8 bg-gradient-to-br from-neutral-200 to-neutral-400 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-3">
                    <span className="text-black font-bold text-sm">M</span>
                  </div>
                  <span className="text-lg font-bold text-neutral-100 group-hover:text-neutral-50 transition-colors duration-300">Maverick Danielle</span>
                </div>
              </div>
              
              <p className="text-neutral-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0 transition-colors duration-300 hover:text-neutral-300">
                Full-stack developer passionate about creating exceptional digital experiences.
              </p>
              
              {/* Social Links */}
              <div>
                <p className="text-neutral-300 font-medium mb-3 text-xs uppercase tracking-wider">Connect with me</p>
                <div className="flex justify-center md:justify-start gap-2">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative text-neutral-500 hover:text-neutral-200 transition-all duration-300 p-2 hover:bg-neutral-900/50 rounded-lg hover:scale-110 hover:rotate-3"
                      aria-label={social.name}
                    >
                      {social.icon}
                      
                      {/* Tooltip */}
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-neutral-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
                        {social.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-left space-y-4">
              <h3 className="text-neutral-200 font-semibold text-base relative inline-block">
                Quick Links
                <div className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-neutral-400 to-transparent"></div>
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={link.name} className="group">
                    <a
                      href={link.href}
                      className="inline-flex items-center text-neutral-400 hover:text-neutral-200 transition-all duration-300 text-sm py-1 hover:translate-x-1"
                      style={{ transitionDelay: `${index * 30}ms` }}
                    >
                      <svg className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-1 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="text-center md:text-left space-y-4">
              <h3 className="text-neutral-200 font-semibold text-base relative inline-block">
                Get In Touch
                <div className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-neutral-400 to-transparent"></div>
              </h3>
              <div className="space-y-3">
                {/* Location */}
                <div className="cursor-pointer group flex items-start justify-center md:justify-start space-x-2 text-sm text-neutral-400 hover:text-neutral-200 transition-all duration-300">
                  <svg
                    className="w-4 h-4 text-neutral-500 mt-0.5 group-hover:text-neutral-300 transition-colors duration-300 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Philippines</span>
                </div>

                {/* Email (now below Philippines) */}
                <div className="group flex items-start justify-center md:justify-start space-x-2 text-sm text-neutral-400 hover:text-neutral-200 transition-all duration-300">
                  <svg
                    className="w-4 h-4 text-neutral-500 mt-0.5 group-hover:text-neutral-300 transition-colors duration-300 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a
                    href="mailto:maverickdanielle@gmail.com"
                    className="hover:underline"
                  >
                    maverickdanielle@gmail.com
                  </a>
                </div>

                {/* Availability */}
                <div className=" group flex items-start justify-center md:justify-start space-x-2 text-sm text-neutral-400 hover:text-neutral-200 transition-all duration-300">
                  <svg
                    className="w-4 h-4 text-neutral-500 mt-0.5 group-hover:text-neutral-300 transition-colors duration-300 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="cursor-pointer text-center md:text-left">
                    <span className="block">Available for freelance</span>
                    <span className="text-xs text-neutral-500 group-hover:text-neutral-400 transition-colors duration-300">
                      8:00 AM - 11:00 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-neutral-800/50 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 text-center">
            <div className="text-xs text-neutral-500">
              © {currentYear} Maverick Danielle P. Andres. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-neutral-500">
              <span>Built with Next.js</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
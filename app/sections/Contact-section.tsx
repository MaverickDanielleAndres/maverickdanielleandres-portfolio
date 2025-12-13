'use client';

import { useState, useEffect } from 'react';
import DarkVeil from '@/components/background/DarkVeil';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ type, message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000] animate-pop-in">
      <div className={`
        px-8 py-5 rounded-xl border backdrop-blur-md shadow-2xl min-w-[320px] max-w-md
        transform transition-all duration-300 ease-out
        ${type === 'success' 
          ? 'bg-neutral-900/95 border-green-500/50 text-green-400 shadow-green-500/20' 
          : 'bg-neutral-900/95 border-red-500/50 text-red-400 shadow-red-500/20'
        }
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
              ${type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'}
            `}>
              {type === 'success' ? (
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <p className="font-medium text-neutral-100">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-1 text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800 rounded-lg transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [notification, setNotification] = useState({
    isVisible: false,
    type: 'success' as 'success' | 'error',
    message: ''
  });

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return undefined;
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return undefined;
      
      case 'subject':
        if (!value.trim()) return 'Subject is required';
        if (value.trim().length < 5) return 'Subject must be at least 5 characters';
        return undefined;
      
      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 20) return 'Message must be at least 20 characters';
        return undefined;
      
      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof ContactFormData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
    setFocusedField(null);
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ isVisible: true, type, message });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotification('error', 'Please fix the errors below');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
        showNotification('success', 'Thank you! Your message has been sent successfully.');
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showNotification('error', 'Sorry, there was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (fieldName: string, hasError: boolean) => `
    w-full px-4 py-3 bg-black/60 backdrop-blur-sm border rounded-lg
    text-neutral-100 placeholder-neutral-400
    transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-neutral-600/50
    hover:bg-black/70
    ${hasError 
      ? 'border-red-500/60 focus:border-red-500 focus:bg-red-950/30' 
      : focusedField === fieldName 
        ? 'border-neutral-400 bg-black/70' 
        : 'border-neutral-600 hover:border-neutral-500'
    }
  `;

  return (
    <>
      <Notification {...notification} onClose={hideNotification} />
      
      <section id='contact' className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Beams Background */}
        <div className="absolute inset-0 z-0">
          
<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <DarkVeil />
</div>
        </div>
        
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        
        {/* Content */}
        <div className="max-w-6xl mx-auto relative z-20">
          <div className="grid lg:grid-cols-5 gap-16 items-start">
            {/* Contact Info - Smaller column */}
            <div className="lg:col-span-2 space-y-8 animate-slide-in-left">
              <div>
                <h3 className="text-2xl font-semibold text-neutral-100 mb-8">
                  Get In Touch
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-5 rounded-xl bg-black/60 backdrop-blur-sm border border-neutral-700 hover:border-neutral-600 transition-all duration-300 hover:bg-black/70">
                    <div className="w-12 h-12 bg-neutral-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-6 h-6 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400 uppercase tracking-wider font-medium">Email</p>
                      <p className="text-neutral-100 text-lg">maverickdanielle@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-5 rounded-xl bg-black/60 backdrop-blur-sm border border-neutral-700 hover:border-neutral-600 transition-all duration-300 hover:bg-black/70">
                    <div className="w-12 h-12 bg-neutral-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-6 h-6 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400 uppercase tracking-wider font-medium">Based in</p>
                      <p className="text-neutral-100 text-lg">Pasig City, Philippines</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-black/60 backdrop-blur-sm border border-neutral-600">
                <h4 className="font-semibold text-neutral-100 mb-3 text-lg">Quick Response</h4>
                <p className="text-neutral-300 leading-relaxed">
                  I typically respond within 24 hours. Looking forward to discussing your project!
                </p>
              </div>
            </div>

            {/* Contact Form - Larger column */}
            <div className="lg:col-span-3 animate-slide-in-right">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-200 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={handleBlur}
                      placeholder="John Doe"
                      className={inputClasses('name', !!errors.name)}
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-400 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-200 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={handleBlur}
                      placeholder="john@example.com"
                      className={inputClasses('email', !!errors.email)}
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-400 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-neutral-200 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={handleBlur}
                    placeholder="Project Collaboration"
                    className={inputClasses('subject', !!errors.subject)}
                  />
                  {errors.subject && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-neutral-200 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={handleBlur}
                    placeholder="Tell me about your project, timeline, and how I can help bring your vision to life..."
                    className={`${inputClasses('message', !!errors.message)} resize-none`}
                  />
                  {errors.message && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.message}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-neutral-400">
                    {formData.message.length}/20 characters minimum
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    w-full py-4 px-8 rounded-lg font-semibold text-base
                    transition-all duration-300 ease-in-out
                    transform hover:scale-[1.02] active:scale-[0.98]
                    focus:outline-none focus:ring-2 focus:ring-neutral-600/50
                    ${isSubmitting 
                      ? 'bg-neutral-700/80 backdrop-blur-sm text-neutral-400 cursor-not-allowed' 
                      : 'bg-neutral-200 text-black hover:bg-neutral-100 hover:shadow-xl hover:shadow-neutral-900/30'
                    }
                    relative overflow-hidden group
                  `}
                >
                  <span className=" cursor-pointer relative z-10 flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Sending Message...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </span>
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-300 to-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </form>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slide-in-left {
            from { opacity: 0; transform: translateX(-40px); }
            to { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes slide-in-right {
            from { opacity: 0; transform: translateX(40px); }
            to { opacity: 1; transform: translateX(0); }
          }

          @keyframes slide-down {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fade-in {
            animation: fade-in 1s ease-out forwards;
          }
          
          .animate-slide-in-left {
            animation: slide-in-left 1s ease-out 0.3s forwards;
            opacity: 0;
          }
          
          .animate-slide-in-right {
            animation: slide-in-right 1s ease-out 0.5s forwards;
            opacity: 0;
          }

          .animate-slide-down {
            animation: slide-down 0.3s ease-out forwards;
          }
        `}</style>
      </section>
    </>
  );
};

export default ContactSection;
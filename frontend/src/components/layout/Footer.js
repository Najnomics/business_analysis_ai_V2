import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Footer = () => {
  const { colors } = useTheme();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '/features' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'API Documentation', href: '/docs' },
        { name: 'Integrations', href: '/integrations' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Elite Global AI', href: 'https://www.eliteglobalai.com/about' },
        { name: 'Success Stories', href: 'https://www.eliteglobalai.com/success-stories' },
        { name: 'Solutions', href: 'https://www.eliteglobalai.com/solutions' },
        { name: 'Contact', href: 'https://www.eliteglobalai.com/contact' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Community', href: '/community' },
        { name: 'Help Center', href: '/help' },
        { name: 'Blog', href: '/blog' },
        { name: 'Tutorials', href: '/tutorials' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'GDPR', href: '/gdpr' }
      ]
    }
  ];

  const socialLinks = [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/company/elite-global-ai/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/@eliteglobalai?si=N2Lf-y8JU4wnb2ay',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2 6a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/eliteglobalai_?igsh=bzNsbXVna3Q2dnJi',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.017 7.062a3.955 3.955 0 00-3.955 3.955 3.955 3.955 0 003.955 3.955 3.955 3.955 0 003.955-3.955 3.955 3.955 0 00-3.955-3.955zm0 6.553a2.598 2.598 0 110-5.196 2.598 2.598 0 010 5.196zM15.797 6.915a.925.925 0 11-1.85 0 .925.925 0 011.85 0zM19.071 7.84a6.128 6.128 0 00-1.67-4.342 6.128 6.128 0 00-4.342-1.67c-1.712-.097-6.838-.097-8.55 0a6.128 6.128 0 00-4.342 1.67 6.128 6.128 0 00-1.67 4.342c-.097 1.712-.097 6.838 0 8.55a6.128 6.128 0 001.67 4.342 6.128 6.128 0 004.342 1.67c1.712.097 6.838.097 8.55 0a6.128 6.128 0 004.342-1.67 6.128 6.128 0 001.67-4.342c.097-1.712.097-6.838 0-8.55zm-1.647 10.42a3.506 3.506 0 01-1.974 1.974c-1.367.543-4.61.417-6.118.417-1.508 0-4.751.126-6.118-.417a3.506 3.506 0 01-1.974-1.974c-.543-1.367-.417-4.61-.417-6.118 0-1.508-.126-4.751.417-6.118a3.506 3.506 0 011.974-1.974c1.367-.543 4.61-.417 6.118-.417 1.508 0 4.751-.126 6.118.417a3.506 3.506 0 011.974 1.974c.543 1.367.417 4.61.417 6.118 0 1.508.126 4.751-.417 6.118z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'X (Twitter)',
      href: 'https://x.com/EliteglobalAI?t=A43oBep-s12UjzqxT0BmOw&s=09',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M11.25 3.5h2.5L10.5 7.75 14.75 16.5h-2.5L9.5 11.75 6.25 16.5h-2.5L7 12.25 3.25 3.5h2.5L8.5 8.25 11.25 3.5z" />
        </svg>
      )
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/profile.php?id=61556668897673&mibextid=LQQJ4d',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  return (
    <footer 
      className="mt-20 border-t"
      style={{ 
        backgroundColor: colors.backgroundTint,
        borderColor: colors.border
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="https://static.wixstatic.com/media/8f4d64_a953bdcb801f4716878cca06470b74cbf000.jpg"
                alt="Elite Global AI"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-lg font-bold" style={{ color: colors.primary }}>
                  Somna AI
                </h3>
                <p className="text-xs" style={{ color: colors.textSecondary }}>
                  by Elite Global AI
                </p>
              </div>
            </div>
            <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
              Next-generation AI-powered business analysis platform transforming ideas into actionable strategies.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-all hover:scale-110"
                  style={{ 
                    backgroundColor: colors.background,
                    color: colors.textSecondary
                  }}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold mb-4" style={{ color: colors.text }}>
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : '_self'}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : ''}
                      className="text-sm hover:opacity-80 transition-opacity"
                      style={{ color: colors.textSecondary }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div 
          className="pt-8 border-t flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
          style={{ borderColor: colors.border }}
        >
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              © {new Date().getFullYear()} Somna AI. All rights reserved.
            </p>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Powered by{' '}
              <a 
                href="https://www.eliteglobalai.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold hover:opacity-80 transition-opacity"
                style={{ color: colors.primary }}
              >
                Elite Global AI
              </a>
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.success }}
              ></div>
              <span className="text-sm" style={{ color: colors.textSecondary }}>
                All systems operational
              </span>
            </div>
            
            <div className="text-sm" style={{ color: colors.textSecondary }}>
              v2.0.0
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
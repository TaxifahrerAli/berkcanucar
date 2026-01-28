/* ============================================
   BERK CAN UCAR - PERSONAL WEBSITE
   JavaScript functionality
   ============================================ */

(function() {
    'use strict';

    // ==========================================
    // LANGUAGE TOGGLE
    // ==========================================
    const translations = {
        de: 'de',
        en: 'en'
    };

    let currentLang = localStorage.getItem('lang') || detectLanguage();

    function detectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('de') ? 'de' : 'en';
    }

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;
        
        // Update page title
        document.title = lang === 'de' 
            ? 'Berk Can Ucar | Informatik-Student'
            : 'Berk Can Ucar | Computer Science Student';
        
        // Update all translatable elements
        document.querySelectorAll('[data-de][data-en]').forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = text;
                } else {
                    el.textContent = text;
                }
            }
        });
        
        // Update toggle button
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.querySelector('.lang-text').textContent = lang === 'de' ? 'EN' : 'DE';
        }
    }

    // Initialize language
    document.addEventListener('DOMContentLoaded', () => {
        setLanguage(currentLang);
        
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                setLanguage(currentLang === 'de' ? 'en' : 'de');
            });
        }
    });

    // ==========================================
    // EMAIL PROTECTION
    // ==========================================
    document.addEventListener('DOMContentLoaded', () => {
        const emailEl = document.getElementById('email-protection');
        if (emailEl) {
            const user = emailEl.getAttribute('data-user');
            const domain = emailEl.getAttribute('data-domain');
            if (user && domain) {
                const email = user + '@' + domain;
                const link = document.createElement('a');
                link.href = 'mai' + 'lto:' + email;
                link.textContent = email;
                emailEl.parentNode.replaceChild(link, emailEl);
            }
        }
    });

    // ==========================================
    // SCROLL REVEAL ANIMATIONS
    // ==========================================
    const revealElements = () => {
        const elements = document.querySelectorAll('.scroll-reveal');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-delay') || 0;
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                        
                        // Trigger skills grid animation
                        if (entry.target.classList.contains('skills-section')) {
                            const skillsGrid = entry.target.querySelector('.skills-grid');
                            if (skillsGrid) {
                                skillsGrid.classList.add('revealed');
                            }
                        }
                    }, parseInt(delay));
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -80px 0px'
        });

        elements.forEach(el => observer.observe(el));
    };

    document.addEventListener('DOMContentLoaded', revealElements);

    // ==========================================
    // NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    // ==========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip modal links
            if (href === '#impressum' || href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navHeight = navbar?.offsetHeight || 0;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // PARALLAX EFFECT FOR FLOATING SHAPES
    // ==========================================
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const shapes = document.querySelectorAll('.shape');
                
                shapes.forEach((shape, i) => {
                    const speed = 0.05 + (i * 0.02);
                    shape.style.transform = `translateY(${scrollY * speed}px)`;
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    });

    // ==========================================
    // CURSOR GLOW EFFECT (Desktop only)
    // ==========================================
    if (window.matchMedia('(pointer: fine)').matches) {
        const cursorGlow = document.createElement('div');
        cursorGlow.style.cssText = `
            position: fixed;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
            opacity: 0;
        `;
        document.body.appendChild(cursorGlow);

        let cursorX = 0, cursorY = 0;
        let currentX = 0, currentY = 0;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            cursorGlow.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
        });

        function animateCursor() {
            const ease = 0.1;
            currentX += (cursorX - currentX) * ease;
            currentY += (cursorY - currentY) * ease;
            
            cursorGlow.style.left = currentX + 'px';
            cursorGlow.style.top = currentY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        
        animateCursor();
    }

    // ==========================================
    // PROJECT CARD TILT EFFECT
    // ==========================================
    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // ==========================================
    // TYPING EFFECT FOR HERO (optional enhancement)
    // ==========================================
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const originalDE = heroSubtitle.getAttribute('data-de');
        const originalEN = heroSubtitle.getAttribute('data-en');
        
        // Text is already set, no additional typing needed
    }

    // ==========================================
    // MODAL CLOSE ON ESC
    // ==========================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (window.location.hash === '#impressum') {
                history.pushState('', document.title, window.location.pathname);
            }
        }
    });

    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                history.pushState('', document.title, window.location.pathname);
            }
        });
    });

    // ==========================================
    // CONSOLE EASTER EGG
    // ==========================================
    console.log('%c👋 Hey there, fellow developer!', 'font-size: 20px; font-weight: bold;');
    console.log('%cInterested in the code? Feel free to connect on LinkedIn!', 'font-size: 14px; color: #6366f1;');

})();

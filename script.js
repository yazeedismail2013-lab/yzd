document.addEventListener('DOMContentLoaded', () => {

    // --- PAGE LOADER ---
    const loader = document.getElementById('pageLoader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }, 600);
    });
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
    }, 2000);

    // --- SCROLL PROGRESS & STICKY HEADER ---
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scrollProgress');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Pre-calculate section offsets to prevent layout thrashing on scroll
    let cachedSectionOffsets = [];
    function cacheOffsets() {
        cachedSectionOffsets = Array.from(sections).map(sec => ({
            id: sec.getAttribute('id'),
            top: sec.offsetTop - 120
        })).sort((a, b) => a.top - b.top);
    }
    
    // Defer offset calculation slightly to ensure final layout is rendered
    setTimeout(cacheOffsets, 500);
    window.addEventListener('resize', cacheOffsets);

    // Throttle scroll events using requestAnimationFrame
    let scrollTicker = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicker) {
            window.requestAnimationFrame(() => {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                
                if (scrollProgress) {
                    scrollProgress.style.width = scrollPercent + '%';
                }

                if (header) {
                    if (scrollTop > 50) {
                        header.classList.add('sticky');
                    } else {
                        header.classList.remove('sticky');
                    }
                }

                let currentSec = '';
                for (let i = 0; i < cachedSectionOffsets.length; i++) {
                    if (scrollTop >= cachedSectionOffsets[i].top) {
                        currentSec = cachedSectionOffsets[i].id;
                    } else {
                        break; // Stop early since offsets are sorted sequentially
                    }
                }

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentSec}`) {
                        link.classList.add('active');
                    }
                });

                scrollTicker = false;
            });
            scrollTicker = true;
        }
    });

    // --- MOBILE MENU TOGGLE ---
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars';
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.querySelector('i').className = 'fa-solid fa-bars';
        });
    });

    // --- THEME TOGGLE (LIGHT / DARK) ---
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        
        const icon = themeToggle.querySelector('i');
        if (newTheme === 'light') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    });

    // --- INTERACTIVE SERVICE FILTERING ---
    const serviceTabs = document.querySelectorAll('#services .filter-tab');
    const serviceCards = document.querySelectorAll('.service-card');

    serviceTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            serviceTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filterValue = tab.getAttribute('data-filter');

            serviceCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // --- INTERACTIVE PORTFOLIO FILTERING ---
    const portfolioTabs = document.querySelectorAll('#portfolioTabs .filter-tab');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    portfolioTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            portfolioTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filterValue = tab.getAttribute('data-filter');

            portfolioCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // --- BEFORE / AFTER IMAGE SLIDER ---
    const baSlider = document.getElementById('baSlider');
    const baAfter = document.getElementById('baAfter');
    const baLine = document.getElementById('baLine');
    const baHandle = document.getElementById('baHandle');

    if (baSlider) {
        baSlider.addEventListener('input', (e) => {
            const sliderValue = e.target.value;
            baAfter.style.width = sliderValue + '%';
            baLine.style.left = sliderValue + '%';
            baHandle.style.left = sliderValue + '%';
        });
    }

    // --- TESTIMONIALS SLIDER ---
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide === 0) ? slides.length - 1 : currentSlide - 1;
            showSlide(currentSlide);
        });

        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide === slides.length - 1) ? 0 : currentSlide + 1;
            showSlide(currentSlide);
        });
        
        setInterval(() => {
            currentSlide = (currentSlide === slides.length - 1) ? 0 : currentSlide + 1;
            showSlide(currentSlide);
        }, 8000);
    }

    // --- STATS ANIMATED COUNTERS ---
    const counterElements = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'), 10);
                const duration = 2000;
                const stepTime = 30;
                const steps = duration / stepTime;
                const increment = target / steps;
                let current = 0;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target + (target === 99 ? '%' : '+');
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current) + '+';
                    }
                }, stepTime);

                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));

    // --- FAQ ACCORDION ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-answer').style.maxHeight = '0px';
            });

            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // --- MODAL POPUPS (TERMS, PRIVACY & EMAIL) ---
    const termsModal = document.getElementById('termsModal');
    const privacyModal = document.getElementById('privacyModal');
    const emailModal = document.getElementById('emailModal');
    
    const openTerms = document.getElementById('openTerms');
    const openPrivacy = document.getElementById('openPrivacy');
    const openEmails = document.querySelectorAll('.open-email-btn');
    
    const closeTerms = document.getElementById('closeTermsModal');
    const closePrivacy = document.getElementById('closePrivacyModal');
    const closeEmail = document.getElementById('closeEmailModal');

    function toggleModal(modal, action) {
        if (!modal) return;
        if (action === 'open') {
            modal.classList.add('active');
        } else {
            modal.classList.remove('active');
        }
    }

    if (openTerms) openTerms.addEventListener('click', () => toggleModal(termsModal, 'open'));
    if (openPrivacy) openPrivacy.addEventListener('click', () => toggleModal(privacyModal, 'open'));
    if (openEmails.length > 0) {
        openEmails.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleModal(emailModal, 'open');
            });
        });
    }
    
    if (closeTerms) closeTerms.addEventListener('click', () => toggleModal(termsModal, 'close'));
    if (closePrivacy) closePrivacy.addEventListener('click', () => toggleModal(privacyModal, 'close'));
    if (closeEmail) closeEmail.addEventListener('click', () => toggleModal(emailModal, 'close'));

    [termsModal, privacyModal, emailModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) toggleModal(modal, 'close');
            });
        }
    });

    // --- WHATSAPP PURCHASE FLOW FORM ---
    const purchaseModal = document.getElementById('purchaseModal');
    const closePurchase = document.getElementById('closePurchaseModal');
    const serviceCardsSelect = document.querySelectorAll('.service-select-card');
    const purchaseForm = document.getElementById('purchaseForm');
    const selectedServiceTitle = document.getElementById('selectedServiceTitle');
    let selectedService = '';

    function openPurchaseFlow(presetService = '') {
        purchaseModal.classList.add('active');
        
        if (presetService) {
            selectedService = presetService;
            
            serviceCardsSelect.forEach(card => {
                card.classList.remove('selected');
                if (card.getAttribute('data-service') === presetService) {
                    card.classList.add('selected');
                }
            });
            
            selectedServiceTitle.textContent = `Ordering: ${presetService}`;
            purchaseForm.style.display = 'flex';
            
            setTimeout(() => {
                purchaseForm.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            selectedService = '';
            serviceCardsSelect.forEach(c => c.classList.remove('selected'));
            purchaseForm.style.display = 'none';
        }
    }

    const orderButtons = document.querySelectorAll('.open-purchase-btn');
    orderButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = btn.getAttribute('data-preset');
            openPurchaseFlow(preset || '');
        });
    });

    if (closePurchase) {
        closePurchase.addEventListener('click', () => {
            purchaseModal.classList.remove('active');
        });
    }

    purchaseModal.addEventListener('click', (e) => {
        if (e.target === purchaseModal) {
            purchaseModal.classList.remove('active');
        }
    });

    serviceCardsSelect.forEach(card => {
        card.addEventListener('click', () => {
            serviceCardsSelect.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            selectedService = card.getAttribute('data-service');
            selectedServiceTitle.textContent = `Ordering: ${selectedService}`;
            purchaseForm.style.display = 'flex';
            
            setTimeout(() => {
                purchaseForm.scrollIntoView({ behavior: 'smooth' });
            }, 200);
        });
    });

    purchaseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('purchaseName').value.trim();
        const mobile = document.getElementById('purchaseMobile').value.trim();
        const whatsapp = document.getElementById('purchaseWhatsApp').value.trim();
        const location = document.getElementById('purchaseLocation').value.trim();

        if (!selectedService) {
            alert('Please select a service package first.');
            return;
        }

        const message = `Hello YZD Web Solutions!\n\nI would like to place a service purchase request. Here are my business details:\n\n` +
                        `• *Service Selected:* ${selectedService}\n` +
                        `• *Client Name:* ${name}\n` +
                        `• *Mobile Number:* ${mobile}\n` +
                        `• *WhatsApp Number:* ${whatsapp}\n` +
                        `• *Business Location:* ${location}\n\n` +
                        `Please schedule our kickoff review and send invoice setups. Thanks!`;

        const encodedMessage = encodeURIComponent(message);
        const waLink = `https://wa.me/919400771619?text=${encodedMessage}`;
        
        window.open(waLink, '_blank');
        purchaseModal.classList.remove('active');
        purchaseForm.reset();
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const scope = document.getElementById('contactProject').value;
            const details = document.getElementById('contactMessage').value.trim();

            const message = `Hello YZD Web Solutions!\n\nI have submitted an inquiry form on the website:\n\n` +
                            `• *Name:* ${name}\n` +
                            `• *Email:* ${email}\n` +
                            `• *Project Scope:* ${scope}\n` +
                            `• *Inquiry Details:* ${details}\n`;

            const encodedMessage = encodeURIComponent(message);
            const waLink = `https://wa.me/919400771619?text=${encodedMessage}`;
            
            window.open(waLink, '_blank');
            contactForm.reset();
        });
    }

    // ==========================================
    // --- ADVANCED ELITE ANIMATIONS ENGINE ---
    // ==========================================

    // Detect touch-enabled devices to skip heavy mousemove tracking
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

    if (!isTouchDevice) {
        // 1. Spotlight Mouse Tracking on Glass Cards (Optimized with Enter/Leave rect caching to prevent layout thrashing)
        const glassCards = document.querySelectorAll('.glass-card, .service-select-card, .stat-card, .pricing-card');
        glassCards.forEach(card => {
            let rect = null;
            card.addEventListener('mouseenter', () => {
                rect = card.getBoundingClientRect();
            });
            card.addEventListener('mousemove', (e) => {
                if (!rect) rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
            card.addEventListener('mouseleave', () => {
                rect = null;
            });
        });

        // 2. Magnetic Buttons Effect (Optimized with Enter/Leave rect caching)
        const magneticButtons = document.querySelectorAll('.btn, .theme-toggle, .social-link');
        magneticButtons.forEach(btn => {
            let rect = null;
            btn.addEventListener('mouseenter', () => {
                rect = btn.getBoundingClientRect();
            });
            btn.addEventListener('mousemove', (e) => {
                if (!rect) rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - (rect.width / 2);
                const y = e.clientY - rect.top - (rect.height / 2);
                btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px) scale(1.02)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                rect = null;
            });
        });

        // 3. Side Glow Orbit/Parallax Mouse Movement (Throttled with requestAnimationFrame)
        const leftGlow = document.querySelector('.side-glow-left');
        const rightGlow = document.querySelector('.side-glow-right');
        let glowTicker = false;
        window.addEventListener('mousemove', (e) => {
            if (!glowTicker) {
                window.requestAnimationFrame(() => {
                    const xPercent = (e.clientX / window.innerWidth) * 30 - 15;
                    const yPercent = (e.clientY / window.innerHeight) * 30 - 15;
                    
                    if (leftGlow) {
                        leftGlow.style.transform = `translate(${xPercent}px, ${yPercent}px)`;
                    }
                    if (rightGlow) {
                        rightGlow.style.transform = `translate(${-xPercent}px, ${-yPercent}px)`;
                    }
                    glowTicker = false;
                });
                glowTicker = true;
            }
        });
    }

    // 4. Automatic Reveal on Scroll Handler
    // Dynamically apply reveal triggers to layout blocks
    const revealElements = document.querySelectorAll(
        'section.section, .showcase-block, .timeline-item, .why-grid, .services-grid, .portfolio-grid, .pricing-grid, .stats-grid, .contact-grid'
    );
    
    revealElements.forEach(el => {
        el.classList.add('reveal-on-scroll');
    });

    const scrollRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                scrollRevealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px 100px 0px' // Trigger earlier as user approaches the element
    });

    revealElements.forEach(el => scrollRevealObserver.observe(el));
});

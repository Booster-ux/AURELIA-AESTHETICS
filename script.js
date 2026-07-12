/**
 * Aurelia Luxury Aesthetics - Client-Side Functionality
 * Implementation of premium interactions, validation, modal, lightbox, and slider controllers.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. CUSTOM CURSOR
    // ==========================================================================
    const cursor = document.getElementById('customCursor');
    
    // Check if device is desktop (has pointer, not touch)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice && cursor) {
        cursor.style.display = 'block';
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });
        
        // Add hover effects for interactive elements
        const hoverInteractives = document.querySelectorAll('a, button, select, input, textarea, .gallery-item, .filter-btn');
        hoverInteractives.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // ==========================================================================
    // 2. STICKY DYNAMIC NAVIGATION BAR & MOBILE MENU
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Add scrolled class when page is scrolled down
    const handleNavbarScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Initial call
    
    // Toggle Mobile Menu
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('active');
            if (isOpen) {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active-menu');
                navbar.classList.remove('active-menu');
                document.body.style.overflow = '';
            } else {
                navMenu.classList.add('active');
                mobileMenuBtn.classList.add('active-menu');
                navbar.classList.add('active-menu');
                document.body.style.overflow = 'hidden'; // Prevent body scroll when menu is active
            }
        });
    }
    
    // Close Mobile Menu on Click and handle smooth scroll offsets
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Close mobile menu if active
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active-menu');
                navbar.classList.remove('active-menu');
                document.body.style.overflow = '';
            }
            
            // Highlight clicked link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Highlight Active Section in Navbar on Scroll
    const highlightActiveNav = () => {
        const scrollY = window.scrollY;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    
    window.addEventListener('scroll', highlightActiveNav);

    // ==========================================================================
    // 3. ABOUT MODAL DIALOG
    // ==========================================================================
    const aboutModal = document.getElementById('aboutModal');
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    
    const openAboutModal = () => {
        aboutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    const closeAboutModal = () => {
        aboutModal.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    if (learnMoreBtn && aboutModal) {
        learnMoreBtn.addEventListener('click', openAboutModal);
    }
    
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeAboutModal);
    }
    
    // Close modal on outside click
    if (aboutModal) {
        aboutModal.addEventListener('click', (e) => {
            if (e.target === aboutModal) {
                closeAboutModal();
            }
        });
    }

    // ==========================================================================
    // 4. GALLERY MATRIX WITH FILTERS AND LIGHTBOX
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
    const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
    const lightboxNextBtn = document.getElementById('lightboxNextBtn');
    
    let currentGalleryList = [];
    let currentLightboxIdx = 0;
    
    // Gallery Filters
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state class
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    // Retrigger simple entrance fade
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Reconstruct list of visible source images for lightbox controls
    const updateLightboxList = () => {
        currentGalleryList = [];
        galleryItems.forEach(item => {
            if (item.style.display !== 'none') {
                const img = item.querySelector('.gallery-img');
                const title = item.querySelector('h4').textContent;
                const category = item.querySelector('span').textContent;
                currentGalleryList.push({
                    src: img.getAttribute('src'),
                    alt: img.getAttribute('alt'),
                    title: title,
                    category: category
                });
            }
        });
    };
    
    // Open Lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            updateLightboxList();
            
            // Find matched item in current visual list
            const clickedImgSrc = item.querySelector('.gallery-img').getAttribute('src');
            currentLightboxIdx = currentGalleryList.findIndex(e => e.src === clickedImgSrc);
            
            if (currentLightboxIdx !== -1) {
                showLightboxImage();
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    const showLightboxImage = () => {
        const item = currentGalleryList[currentLightboxIdx];
        if (item) {
            lightboxImg.setAttribute('src', item.src);
            lightboxImg.setAttribute('alt', item.alt);
            lightboxCaption.innerHTML = `<strong>${item.title}</strong> — <span style="color: #d4af37">${item.category}</span>`;
        }
    };
    
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    const navigateLightboxPrev = () => {
        if (currentGalleryList.length === 0) return;
        currentLightboxIdx = (currentLightboxIdx - 1 + currentGalleryList.length) % currentGalleryList.length;
        showLightboxImage();
    };
    
    const navigateLightboxNext = () => {
        if (currentGalleryList.length === 0) return;
        currentLightboxIdx = (currentLightboxIdx + 1) % currentGalleryList.length;
        showLightboxImage();
    };
    
    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
    if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', navigateLightboxPrev);
    if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', navigateLightboxNext);
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // ==========================================================================
    // 5. TESTIMONIALS SLIDER SECTION
    // ==========================================================================
    const sliderInner = document.getElementById('sliderInner');
    const sliderPrevBtn = document.getElementById('sliderPrevBtn');
    const sliderNextBtn = document.getElementById('sliderNextBtn');
    const slides = document.querySelectorAll('.testimonial-slide');
    const sliderViewport = document.getElementById('sliderViewport');
    
    let activeSlideIndex = 0;
    let autoSlideInterval;
    
    const setSlidePosition = () => {
        if (sliderInner) {
            sliderInner.style.transform = `translateX(-${activeSlideIndex * 100}%)`;
        }
    };
    
    const handleNextSlide = () => {
        if (slides.length === 0) return;
        activeSlideIndex = (activeSlideIndex + 1) % slides.length;
        setSlidePosition();
    };
    
    const handlePrevSlide = () => {
        if (slides.length === 0) return;
        activeSlideIndex = (activeSlideIndex - 1 + slides.length) % slides.length;
        setSlidePosition();
    };
    
    if (sliderNextBtn) sliderNextBtn.addEventListener('click', () => {
        handleNextSlide();
        resetTimer();
    });
    
    if (sliderPrevBtn) sliderPrevBtn.addEventListener('click', () => {
        handlePrevSlide();
        resetTimer();
    });
    
    const startTimer = () => {
        autoSlideInterval = setInterval(handleNextSlide, 6000);
    };
    
    const resetTimer = () => {
        clearInterval(autoSlideInterval);
        startTimer();
    };
    
    // Auto-sliding details
    if (sliderViewport) {
        startTimer();
        
        sliderViewport.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        sliderViewport.addEventListener('mouseleave', startTimer);
        
        // Touch Swipe Supports for Responsive Screens
        let touchStartX = 0;
        let touchEndX = 0;
        
        sliderViewport.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        sliderViewport.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipeGesture();
        }, { passive: true });
        
        const handleSwipeGesture = () => {
            if (touchEndX < touchStartX - 50) {
                handleNextSlide();
                resetTimer();
            }
            if (touchEndX > touchStartX + 50) {
                handlePrevSlide();
                resetTimer();
            }
        };
    }

    // ==========================================================================
    // 6. KEYBOARD DUAL BINDINGS (ESCAPE KEYS, NAVIGATION FOR ACCESSIBILITY)
    // ==========================================================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close about details modal
            if (aboutModal && aboutModal.classList.contains('active')) {
                closeAboutModal();
            }
            // Close image lightboxes
            if (lightbox && lightbox.classList.contains('active')) {
                closeLightbox();
            }
            // Close shared policy modal
            if (policyModal && policyModal.classList.contains('active')) {
                closePolicyModal();
            }
            // Close appointment success modal
            if (successModal && successModal.classList.contains('active')) {
                closeSuccessModal();
            }
        }
        
        // Keyboard gallery pagination
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'ArrowRight') {
                navigateLightboxNext();
            } else if (e.key === 'ArrowLeft') {
                navigateLightboxPrev();
            }
        }
    });

    // ==========================================================================
    // 7. APPOINTMENT FORM CONTROL (SERVICE AUTOMATION & SUBMIT VALIDATIONS)
    // ==========================================================================
    const bookingForm = document.getElementById('bookingForm');
    const serviceSelect = document.getElementById('serviceSelect');
    const submitBtn = document.getElementById('submitBtn');
    const prefDateInput = document.getElementById('prefDate');
    
    // Set minimal date in form to today, preventing past appointment bookings
    if (prefDateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        prefDateInput.min = `${year}-${month}-${day}`;
    }
    
    // Handle specific action click selects ("Book Service" and "Book Now")
    const bookServiceButtons = document.querySelectorAll('.book-service-btn');
    bookServiceButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Resolve nearest card context to extract service value
            const cardEl = btn.closest('.service-card') || btn.closest('.featured-card');
            const serviceKey = cardEl ? cardEl.getAttribute('data-service') : '';
            
            if (serviceKey && serviceSelect) {
                // Find matching option inside select box
                for (let i = 0; i < serviceSelect.options.length; i++) {
                    const opt = serviceSelect.options[i];
                    if (opt.value === serviceKey || opt.text.toLowerCase().includes(serviceKey.toLowerCase())) {
                        serviceSelect.selectedIndex = i;
                        break;
                    }
                }
            }
            
            // Smoothly traverse user down to booking form
            const appointmentSection = document.getElementById('appointment');
            if (appointmentSection) {
                const offsetTop = appointmentSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form Field Specific Validations
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };
    
    const validatePhone = (num) => {
        // Clear non-digit patterns and confirm minimum 10 digits
        const digits = num.replace(/\D/g, '');
        return digits.length >= 10;
    };
    
    const setValidationUI = (element, isValid) => {
        const parent = element.closest('.form-group');
        if (parent) {
            if (isValid) {
                parent.classList.remove('invalid');
            } else {
                parent.classList.add('invalid');
            }
        }
    };
    
    // Form Submit Handler
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameEl = document.getElementById('fullName');
            const emailEl = document.getElementById('emailAddress');
            const phoneEl = document.getElementById('phoneNumber');
            const dateEl = document.getElementById('prefDate');
            const timeEl = document.getElementById('prefTime');
            
            let formStateValid = true;
            
            // Name Check
            const nameVal = nameEl.value.trim();
            if (nameVal === '') {
                setValidationUI(nameEl, false);
                formStateValid = false;
            } else {
                setValidationUI(nameEl, true);
            }
            
            // Email Check
            const emailVal = emailEl.value.trim();
            if (emailVal === '' || !validateEmail(emailVal)) {
                setValidationUI(emailEl, false);
                formStateValid = false;
            } else {
                setValidationUI(emailEl, true);
            }
            
            // Phone Check
            const phoneVal = phoneEl.value.trim();
            if (phoneVal === '' || !validatePhone(phoneVal)) {
                setValidationUI(phoneEl, false);
                formStateValid = false;
            } else {
                setValidationUI(phoneEl, true);
            }
            
            // Service Check
            const serviceVal = serviceSelect.value;
            if (serviceVal === '') {
                setValidationUI(serviceSelect, false);
                formStateValid = false;
            } else {
                setValidationUI(serviceSelect, true);
            }
            
            // Date Check
            const dateVal = dateEl.value;
            const selectedDateStamp = new Date(dateVal).setHours(0,0,0,0);
            const todayStamp = new Date().setHours(0,0,0,0);
            
            if (dateVal === '' || selectedDateStamp < todayStamp) {
                setValidationUI(dateEl, false);
                formStateValid = false;
            } else {
                setValidationUI(dateEl, true);
            }
            
            // Time Check
            const timeVal = timeEl.value;
            if (timeVal === '') {
                setValidationUI(timeEl, false);
                formStateValid = false;
            } else {
                setValidationUI(timeEl, true);
            }
            
            // Trigger Submissions if everything is pristine
            if (formStateValid) {
                // Loading spinner trigger
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
                
                // Simulate aesthetic database mapping delays
                setTimeout(() => {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                    
                    // Populate success confirmation modal details
                    document.getElementById('confirmName').textContent = nameVal;
                    document.getElementById('confirmService').textContent = serviceSelect.options[serviceSelect.selectedIndex].text;
                    
                    // Format dates to friendly styling: October 25, 2026
                    const d = new Date(dateVal);
                    const formattedDateStr = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
                    document.getElementById('confirmDate').textContent = formattedDateStr;
                    document.getElementById('confirmTime').textContent = timeVal;
                    document.getElementById('confirmPhone').textContent = phoneVal;
                    document.getElementById('confirmEmail').textContent = emailVal;
                    
                    // Open Success Modal
                    openSuccessModal();
                    
                    // Reset Form fields
                    bookingForm.reset();
                }, 2000);
            }
        });
    }
    
    // Modal confirmation events
    const successModal = document.getElementById('successModal');
    const successCloseBtn = document.getElementById('successCloseBtn');
    const confirmDoneBtn = document.getElementById('confirmDoneBtn');
    
    const openSuccessModal = () => {
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    const closeSuccessModal = () => {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    if (successCloseBtn) successCloseBtn.addEventListener('click', closeSuccessModal);
    if (confirmDoneBtn) confirmDoneBtn.addEventListener('click', closeSuccessModal);
    
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                closeSuccessModal();
            }
        });
    }

    // ==========================================================================
    // 8. CONTACT FORM CONTROLS & SUCCESS BANNERS
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    const contactSuccessBanner = document.getElementById('contactSuccessBanner');
    const contactSubmitBtn = document.getElementById('contactSubmitBtn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const cName = document.getElementById('contactName');
            const cEmail = document.getElementById('contactEmail');
            const cSubject = document.getElementById('contactSubject');
            const cMessage = document.getElementById('contactMessage');
            
            let contactValid = true;
            
            if (cName.value.trim() === '') {
                setValidationUI(cName, false);
                contactValid = false;
            } else {
                setValidationUI(cName, true);
            }
            
            if (cEmail.value.trim() === '' || !validateEmail(cEmail.value)) {
                setValidationUI(cEmail, false);
                contactValid = false;
            } else {
                setValidationUI(cEmail, true);
            }
            
            if (cSubject.value.trim() === '') {
                setValidationUI(cSubject, false);
                contactValid = false;
            } else {
                setValidationUI(cSubject, true);
            }
            
            if (cMessage.value.trim() === '') {
                setValidationUI(cMessage, false);
                contactValid = false;
            } else {
                setValidationUI(cMessage, true);
            }
            
            if (contactValid) {
                contactSubmitBtn.classList.add('loading');
                contactSubmitBtn.disabled = true;
                
                setTimeout(() => {
                    contactSubmitBtn.classList.remove('loading');
                    contactSubmitBtn.disabled = false;
                    
                    // Show contact confirmation window overlay
                    contactSuccessBanner.classList.add('active');
                    
                    // Wipe form values
                    contactForm.reset();
                    
                    // Hide success banner after 5 seconds
                    setTimeout(() => {
                        contactSuccessBanner.classList.remove('active');
                    }, 5000);
                }, 1500);
            }
        });
    }

    // ==========================================================================
    // 9. TERMS & PRIVACY DYNAMIC POLICY MODAL CONTENT
    // ==========================================================================
    const policyModal = document.getElementById('policyModal');
    const policyTitle = document.getElementById('policyTitle');
    const policyBody = document.getElementById('policyBody');
    const policyCloseBtn = document.getElementById('policyCloseBtn');
    
    const privacyLink = document.getElementById('privacyLink');
    const termsLink = document.getElementById('termsLink');
    
    const closePolicyModal = () => {
        policyModal.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    if (policyCloseBtn) {
        policyCloseBtn.addEventListener('click', closePolicyModal);
    }
    
    if (policyModal) {
        policyModal.addEventListener('click', (e) => {
            if (e.target === policyModal) {
                closePolicyModal();
            }
        });
    }
    
    const openPolicyModal = (type) => {
        if (!policyModal || !policyTitle || !policyBody) return;
        
        document.body.style.overflow = 'hidden';
        policyModal.classList.add('active');
        
        if (type === 'privacy') {
            policyTitle.textContent = 'Privacy Policy';
            policyBody.innerHTML = `
                <p>Last updated: October 2026</p>
                <p>At Aurelia Luxury Aesthetics, we respect your confidentiality. We only capture personal information such as details, names, contact numbers, and emails explicitly supplied via bookings and communication forms.</p>
                <h4>Data Usage Protocols</h4>
                <p>We use your information exclusively to line up your booking schedules, finalize aesthetic consultations, and transmit notifications. Your details are never traded, leased, or distributed to outside networks.</p>
                <h4>Cookies & Tracking</h4>
                <p>Consistent with standard browser operations, we implement cookies strictly to enhance responsive experiences and collect basic diagnostics.</p>
            `;
        } else {
            policyTitle.textContent = 'Terms of Service';
            policyBody.innerHTML = `
                <p>Last updated: October 2026</p>
                <p>Welcome to Aurelia. By navigating this luxury portal or submitting appointment details, you affirm your alignment with our operation terms.</p>
                <h4>Session Cancellations</h4>
                <p>To respect the time of our certified skincare experts, please coordinate calendar cancellations at least 24 hours prior to your scheduled appointments.</p>
                <h4>Wellness Disclaimer</h4>
                <p>Aesthetic treatments and facial care recommendations are individualized and results can vary depending on skin compatibility. Consult experts during scheduling regarding physical allergies.</p>
            `;
        }
    };
    
    if (privacyLink) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            openPolicyModal('privacy');
        });
    }
    
    if (termsLink) {
        termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            openPolicyModal('terms');
        });
    }

    // ==========================================================================
    // 10. BACK-TO-TOP BUTTON
    // ==========================================================================
    const backToTopBtn = document.getElementById('backToTopBtn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400 && backToTopBtn) {
            backToTopBtn.classList.add('show');
        } else if (backToTopBtn) {
            backToTopBtn.classList.remove('show');
        }
    });
    
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================================================
    // 11. SCROLL INTERSECTION OBSERVER FOR FADE-IN ENTRANCES
    // ==========================================================================
    const scrollObservables = document.querySelectorAll('.animate-on-scroll');
    
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observerCallback = (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    obs.unobserve(entry.target); // Trigger once
                }
            });
        };
        
        const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
        scrollObservables.forEach(el => scrollObserver.observe(el));
    } else {
        // Fallback for older browsers
        scrollObservables.forEach(el => el.classList.add('revealed'));
    }

    // Subtly update hero background translation on scroll (parallax effect)
    const heroBg = document.getElementById('heroBg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrollPercentage = window.scrollY / window.innerHeight;
            if (scrollPercentage <= 1) {
                // Map scaling between 1.05 and 1.15
                const scaleVal = 1.05 + (scrollPercentage * 0.1);
                heroBg.style.transform = `scale(${scaleVal})`;
            }
        });
    }
});

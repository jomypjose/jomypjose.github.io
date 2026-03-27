document.addEventListener('DOMContentLoaded', () => {
    /* ================================================
       1. Custom Cursor
       ================================================ */
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    // Only initialize if elements exist and device isn't strictly touch
    if (cursor && follower && matchMedia('(pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Move inner cursor instantly
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Smooth follow for outer ring
        function animateFollower() {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
            
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Add hover effect to interactive elements
        const interactives = document.querySelectorAll('a, button, input, textarea, .project-card, .skill-tag');
        
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
                follower.classList.add('active');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
                follower.classList.remove('active');
            });
        });
    }

    /* ================================================
       2. Navbar Scroll Effect
       ================================================ */
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ================================================
       3. Mobile Menu Toggle
       ================================================ */
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('ph-list', 'ph-x');
            } else {
                icon.classList.replace('ph-x', 'ph-list');
            }
        });

        // Close menu when a link is clicked
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                if(icon) icon.classList.replace('ph-x', 'ph-list');
            });
        });
    }

    /* ================================================
       4. Lenis Smooth Scroll Setup
       ================================================ */
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time)=>{
        lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);

    /* ================================================
       5. GSAP Scroll Animations
       ================================================ */
    // Register Plugin
    gsap.registerPlugin(ScrollTrigger);

    // Initial Load Animations (Hero)
    const tlHero = gsap.timeline();
    tlHero.from(".hero-subtitle", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.2 })
          .from(".hero-title", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .from(".hero-description", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
          .from(".hero-actions .btn", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.2 }, "-=0.6")
          .from(".ambient-bg", { opacity: 0, duration: 2, ease: "power2.inOut" }, "-=1.5");

    // Hero Parallax (moves slightly up slower than scroll)
    gsap.to(".hero-content", {
        y: 150,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // About Section Text Scrub Effect
    gsap.from(".about-text", {
        opacity: 0.2,
        y: 20,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".about-content",
            start: "top 80%",
            end: "top 40%",
            scrub: 1
        }
    });

    gsap.from(".skill-tag", {
        opacity: 0,
        scale: 0.8,
        y: 20,
        stagger: 0.05,
        ease: "back.out(1.7)",
        scrollTrigger: {
            trigger: ".skills-list",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });

    // About Section Image Parallax
    gsap.fromTo(".about-slider-wrapper", 
        { y: 50 },
        {
            y: -50,
            ease: "none",
            scrollTrigger: {
                trigger: ".about-visuals",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        }
    );

    // Projects Section Reveal & Parallax
    gsap.from(".section-header", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".projects",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });

    const projectCards = gsap.utils.toArray('.project-card');
    projectCards.forEach((card, i) => {
        gsap.from(card, {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });

        // Image parallax inside card
        const img = card.querySelector('.project-image');
        if(img) {
            gsap.fromTo(img, 
                { scale: 1.1, y: -20 },
                { 
                    scale: 1, 
                    y: 20,
                    ease: "none",
                    scrollTrigger: {
                        trigger: card,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                }
            );
        }
    });

    // Experience Timeline
    const timelineItems = gsap.utils.toArray('.timeline-item');
    timelineItems.forEach((item, i) => {
        gsap.from(item, {
            x: -50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Footer Reveal
    gsap.from(".footer-cta", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".footer-section",
            start: "top 90%",
            toggleActions: "play none none reverse"
        }
    });

    /* ================================================
       6. Dynamic Year in Footer
       ================================================ */
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /* ================================================
       7. About Image Slider Logic
       ================================================ */
    const track = document.querySelector('.about-slider-track');
    const slides = document.querySelectorAll('.about-slide');
    const nextBtn = document.querySelector('.about-next');
    const prevBtn = document.querySelector('.about-prev');
    const dots = document.querySelectorAll('.about-dot');
    
    if (track && slides.length > 0) {
        let currentIndex = 0;
        
        function updateSlider() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        nextBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider();
        });
        
        prevBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlider();
        });
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateSlider();
            });
        });
        
        // Add swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        track.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});
        
        track.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});
        
        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left
                currentIndex = (currentIndex + 1) % slides.length;
                updateSlider();
            }
            if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateSlider();
            }
        }
    }
});

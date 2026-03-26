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
       4. Scroll Reveal Animations (Intersection Observer)
       ================================================ */
    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    
    document.querySelectorAll('.reveal-element, .fade-up-element').forEach(el => {
        revealObserver.observe(el);
    });

    /* ================================================
       5. Initial Load Animation
       ================================================ */
    // Trigger hero animations right away
    setTimeout(() => {
        document.querySelectorAll('.hero-content.fade-up-element, .hero-visual.fade-up-element').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);

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

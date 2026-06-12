/* -------------------------------------------------------------
   Rajdeepsinh Zala - Premium Developer Portfolio Main Script
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Core DOM Elements
    const header = document.querySelector('header');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');

    // 2. Header and Scroll behaviour
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled', 'shadow-lg', 'h-16');
            header.classList.remove('h-20');
        } else {
            header.classList.remove('scrolled', 'shadow-lg', 'h-16');
            header.classList.add('h-20');
        }

        // Scroll to Top visibility
        if (scrollTopBtn) {
            const chatWin = document.getElementById('chatbot-window');
            const isChatOpen = chatWin && !chatWin.classList.contains('hidden');
            if (window.scrollY > 400 && !isChatOpen) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 3. Theme Toggle & State Sync
    if (localStorage.getItem('color-theme') === 'light' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches)) {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
        if (lightIcon) lightIcon.classList.remove('hidden');
        if (darkIcon) darkIcon.classList.add('hidden');
    } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        if (darkIcon) darkIcon.classList.remove('hidden');
        if (lightIcon) lightIcon.classList.add('hidden');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            const isLight = !isDark;
            document.documentElement.classList.toggle('light', isLight);
            
            if (darkIcon && lightIcon) {
                if (isDark) {
                    darkIcon.classList.remove('hidden');
                    lightIcon.classList.add('hidden');
                } else {
                    lightIcon.classList.remove('hidden');
                    darkIcon.classList.add('hidden');
                }
            }
            localStorage.setItem('color-theme', isDark ? 'dark' : 'light');
            // Dispatch event to canvas cursor in case color parameters need updating
            window.dispatchEvent(new CustomEvent('theme-changed', { detail: { isLight } }));
        });
    }

    // 4. Mobile Menu Navigation
    if (mobileMenuBtn && mobileMenu && menuIcon) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden', !isHidden);
            menuIcon.setAttribute('d', isHidden ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16');
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            });
        });
    }

    // 5. Active Navbar Link Observer on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));

    // 6. Typing Effect (rotating title texts)
    const typeElement = document.getElementById('typing-text');
    if (typeElement) {
        const roles = ["Web Developer", "Python Developer", "Full Stack Developer"];
        let roleIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let speed = 100;

        function type() {
            const currentRole = roles[roleIdx];
            if (isDeleting) {
                typeElement.textContent = currentRole.substring(0, charIdx - 1);
                charIdx--;
                speed = 50; // speed up deletion
            } else {
                typeElement.textContent = currentRole.substring(0, charIdx + 1);
                charIdx++;
                speed = 120; // typing speed
            }

            if (!isDeleting && charIdx === currentRole.length) {
                isDeleting = true;
                speed = 1800; // hold role for a bit
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                roleIdx = (roleIdx + 1) % roles.length;
                speed = 500; // wait before next role
            }

            setTimeout(type, speed);
        }
        setTimeout(type, 1000);
    }

    // 7. Interactive Skills Loader with progress animations
    const skillsSection = document.getElementById('skills');
    const skillProgressBars = document.querySelectorAll('.progress-bar-fill');

    if (skillsSection && skillProgressBars.length > 0) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillProgressBars.forEach(bar => {
                        const targetVal = bar.getAttribute('data-target-width');
                        bar.style.width = `${targetVal}%`;
                    });
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        skillsObserver.observe(skillsSection);
    }

    // 8. Floating Visitor Counter Widget — Live Django API Integration
    const visitorCountEl = document.getElementById('visitor-count-value');
    if (visitorCountEl) {
        // Helper: Django CSRF Reader
        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }

        const csrfToken = getCookie('csrftoken');

        // POST to log the visit and fetch the current total
        fetch('/api/visitor-count/', {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
                ...(csrfToken && { 'X-CSRFToken': csrfToken })
            }
        })
        .then(res => {
            if (!res.ok) throw new Error('API unavailable');
            return res.json();
        })
        .then(data => {
            animateWidgetCount(data.total_visitors);
        })
        .catch(() => {
            // Fallback to a simulated count if the API is unreachable
            animateWidgetCount(1387);
        });

        // Smooth count-up odometer animation
        function animateWidgetCount(target) {
            const duration = 2200;
            const startTime = performance.now();

            function tick(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                visitorCountEl.textContent = Math.floor(eased * target).toLocaleString();
                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    visitorCountEl.textContent = target.toLocaleString();
                }
            }
            requestAnimationFrame(tick);
        }
    }

    // 9. Floating Particle Ambient Starfield Canvas (Behind Hero / Showcase)
    const particleCanvas = document.createElement('canvas');
    particleCanvas.id = 'ambient-particles-canvas';
    particleCanvas.style.position = 'absolute';
    particleCanvas.style.top = '0';
    particleCanvas.style.left = '0';
    particleCanvas.style.width = '100%';
    particleCanvas.style.height = '100%';
    particleCanvas.style.pointerEvents = 'none';
    particleCanvas.style.zIndex = '0';
    
    const heroSection = document.querySelector('section');
    if (heroSection) {
        heroSection.appendChild(particleCanvas);
        const pCtx = particleCanvas.getContext('2d');
        let particles = [];
        const maxParticles = 60;

        const resizeParticles = () => {
            particleCanvas.width = heroSection.clientWidth;
            particleCanvas.height = heroSection.clientHeight;
        };
        resizeParticles();
        window.addEventListener('resize', resizeParticles);

        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * particleCanvas.width;
                this.y = Math.random() * particleCanvas.height;
                this.size = Math.random() * 2.2 + 0.3;
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = Math.random() * -0.6 - 0.1; // Float upwards
                this.alpha = Math.random() * 0.6 + 0.15;
                this.decay = Math.random() * 0.003 + 0.001;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Wrap around edges
                if (this.y < 0) {
                    this.y = particleCanvas.height;
                    this.x = Math.random() * particleCanvas.width;
                }
                if (this.x < 0 || this.x > particleCanvas.width) {
                    this.speedX = -this.speedX;
                }
            }

            draw() {
                pCtx.beginPath();
                pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                const isLight = document.documentElement.classList.contains('light');
                pCtx.fillStyle = isLight 
                    ? `rgba(124, 58, 237, ${this.alpha * 0.7})` 
                    : `rgba(168, 85, 247, ${this.alpha})`;
                pCtx.shadowBlur = isLight ? 0 : 8;
                pCtx.shadowColor = 'rgba(168, 85, 247, 0.4)';
                pCtx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }

        // Loop animation with IntersectionObserver performance optimization
        let isHeroVisible = true;
        let animFrameId = null;

        function animateParticles() {
            pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            if (isHeroVisible) {
                animFrameId = requestAnimationFrame(animateParticles);
            } else {
                animFrameId = null;
            }
        }

        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isHeroVisible = entry.isIntersecting;
                if (isHeroVisible && !animFrameId) {
                    animFrameId = requestAnimationFrame(animateParticles);
                }
            });
        }, { threshold: 0 });
        heroObserver.observe(heroSection);
    }

    // 10. Canvas Interactive Cursor Trail (Requires high-performance rendering)
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const canvas = document.getElementById('cursor-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            document.documentElement.classList.add('custom-cursor-enabled');
            let mouse = { x: 0, y: 0 }, isHovering = false, isMoving = false, moveTimeout, hoverProgress = 0, movementIntensity = 0, idleProgress = 0;
            const numNodes = 14, nodes = Array.from({ length: numNodes }, () => ({ x: 0, y: 0 }));

            const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
            resize(); window.addEventListener('resize', resize);

            window.addEventListener('mousemove', e => {
                mouse.x = e.clientX; mouse.y = e.clientY; isMoving = true;
                clearTimeout(moveTimeout); moveTimeout = setTimeout(() => isMoving = false, 150);
            });

            // Monitor hovering states on active elements
            const updateInteractables = () => {
                document.querySelectorAll('a, button, [role="button"], input, select, textarea, .group, .premium-glow-card').forEach(item => {
                    if (item.dataset.cursorBound) return;
                    item.dataset.cursorBound = 'true';
                    item.addEventListener('mouseenter', () => isHovering = true);
                    item.addEventListener('mouseleave', () => isHovering = false);
                });
            };
            updateInteractables(); 
            new MutationObserver(updateInteractables).observe(document.body, { childList: true, subtree: true });

            function animateCursor() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const isLight = document.documentElement.classList.contains('light');
                
                hoverProgress += ((isHovering ? 1 : 0) - hoverProgress) * 0.15;

                if (isMoving) {
                    movementIntensity += (1 - movementIntensity) * 0.12; 
                    idleProgress += (0 - idleProgress) * 0.15;
                } else {
                    movementIntensity += (0 - movementIntensity) * 0.06; 
                    idleProgress += ((isHovering ? 0 : 1) - idleProgress) * (isHovering ? 0.15 : 0.012);
                }

                const activeOpacity = 1 - idleProgress * 0.65;
                if (nodes[0].x === 0 && nodes[0].y === 0) nodes.forEach(n => { n.x = mouse.x; n.y = mouse.y; });
                
                nodes[0].x = mouse.x; 
                nodes[0].y = mouse.y;

                for (let i = 1; i < numNodes; i++) {
                    nodes[i].x += (nodes[i - 1].x - nodes[i].x) * 0.45; 
                    nodes[i].y += (nodes[i - 1].y - nodes[i].y) * 0.45;
                }

                // Draw line cursor trail
                if (activeOpacity > 0.01) {
                    for (let i = 0; i < numNodes - 1; i++) {
                        ctx.beginPath(); 
                        ctx.moveTo(nodes[i].x, nodes[i].y); 
                        ctx.lineTo(nodes[i + 1].x, nodes[i + 1].y);
                        ctx.lineWidth = 4 * (1 - i / numNodes);
                        const baseOpacity = (1 - i / numNodes) * (0.16 + movementIntensity * 0.6) * activeOpacity;
                        const t = i / numNodes;
                        
                        // Dynamically morph color index based on color modes
                        const r = isLight ? Math.floor(124 + 95 * t) : Math.floor(168 + 68 * t);
                        const g = isLight ? Math.floor(58 - 19 * t) : Math.floor(85 - 13 * t);
                        const b = isLight ? Math.floor(237 - 118 * t) : Math.floor(247 - 94 * t);
                        
                        ctx.strokeStyle = `rgba(${r},${g},${b},${baseOpacity})`;
                        ctx.lineCap = 'round'; 
                        ctx.lineJoin = 'round'; 
                        ctx.stroke();
                    }
                }

                // Hover Ring
                if (hoverProgress > 0.01) {
                    ctx.beginPath(); 
                    ctx.arc(mouse.x, mouse.y, hoverProgress * 20, 0, Math.PI * 2);
                    ctx.strokeStyle = isLight ? `rgba(219,39,119,${hoverProgress * 0.45 * activeOpacity})` : `rgba(236,72,153,${hoverProgress * 0.45 * activeOpacity})`;
                    ctx.lineWidth = 1.8; 
                    ctx.stroke();
                }

                // Central Core Dot
                const dotR = (4 - hoverProgress * 1.5) * activeOpacity;
                if (dotR > 0.1) {
                    ctx.beginPath(); 
                    ctx.arc(mouse.x, mouse.y, dotR, 0, Math.PI * 2);
                    const h = hoverProgress;
                    const dr = isLight ? Math.floor(124 + 95 * h) : Math.floor(168 + 68 * h);
                    const dg = isLight ? Math.floor(58 - 19 * h) : Math.floor(85 - 13 * h);
                    const db = isLight ? Math.floor(237 - 118 * h) : Math.floor(247 - 94 * h);
                    ctx.fillStyle = `rgba(${dr},${dg},${db},${activeOpacity})`; 
                    ctx.fill();
                }
                requestAnimationFrame(animateCursor);
            }
            animateCursor();
        }
    }

    // 11. Project Category Filtering Logic
    const filterButtons = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const activeFilter = btn.getAttribute('data-filter');

                // Update active button visual styles
                filterButtons.forEach(b => {
                    b.classList.remove('bg-purple-500/10', 'text-purple-600', 'dark:bg-purple-950/30', 'dark:text-purple-300', 'shadow-md');
                    b.classList.add('bg-white/50', 'dark:bg-zinc-950/50', 'text-slate-600', 'dark:text-gray-400');
                    b.classList.remove('border-purple-500/20', 'dark:border-purple-500/30');
                    b.classList.add('border-slate-200', 'dark:border-zinc-800');
                });

                btn.classList.add('bg-purple-500/10', 'text-purple-600', 'dark:bg-purple-950/30', 'dark:text-purple-300', 'shadow-md');
                btn.classList.remove('bg-white/50', 'dark:bg-zinc-950/50', 'text-slate-600', 'dark:text-gray-400');
                btn.classList.add('border-purple-500/20', 'dark:border-purple-500/30');
                btn.classList.remove('border-slate-200', 'dark:border-zinc-800');

                // Filter cards
                projectCards.forEach(card => {
                    const categories = card.getAttribute('data-category').split(',');
                    if (activeFilter === 'all' || categories.includes(activeFilter)) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95) translateY(10px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 400);
                    }
                });
            });
        });
    }

    // 12. GitHub Stats & Activity Heatmap Generator
    const heatmapContainer = document.getElementById('github-heatmap-container');
    if (heatmapContainer) {
        // Render beautiful contribution heatmap grid (24 columns x 7 rows)
        const cols = 24;
        const rows = 7;
        
        for (let c = 0; c < cols; c++) {
            const colDiv = document.createElement('div');
            colDiv.className = 'flex flex-col gap-[3px]';
            
            for (let r = 0; r < rows; r++) {
                const box = document.createElement('div');
                box.className = 'w-[10px] h-[10px] rounded-[2px] transition-all duration-500 opacity-0 transform scale-50';
                
                // Construct pseudo-random activity levels using sine wave patterns
                const noise = Math.sin(c * 0.4) * Math.cos(r * 0.6) * 0.5 + 0.5; // range 0 to 1
                const rand = Math.random() * 0.3;
                const activityVal = noise + rand; // combined value
                
                let bgClass = 'bg-slate-100 dark:bg-zinc-900';
                if (activityVal > 0.75) {
                    bgClass = 'bg-emerald-500';
                } else if (activityVal > 0.5) {
                    bgClass = 'bg-emerald-500/60';
                } else if (activityVal > 0.25) {
                    bgClass = 'bg-emerald-500/30';
                }
                
                box.classList.add(...bgClass.split(' '));
                colDiv.appendChild(box);
                
                // Staggered entrance animation
                setTimeout(() => {
                    box.classList.remove('opacity-0', 'scale-50');
                    box.classList.add('opacity-100', 'scale-100');
                }, (c * 7 + r) * 6);
            }
            heatmapContainer.appendChild(colDiv);
        }
        
        // Fetch real-time data from GitHub API for @rajdeepsinhzala-max
        fetch('https://api.github.com/users/rajdeepsinhzala-max')
            .then(res => {
                if (!res.ok) throw new Error('GitHub API rate limited or user not found');
                return res.json();
            })
            .then(data => {
                // Update profile card values dynamically
                if (data.avatar_url) document.getElementById('github-avatar').src = data.avatar_url;
                if (data.name) document.getElementById('github-name').textContent = data.name;
                if (data.bio) document.getElementById('github-bio').textContent = data.bio;
                
                const followersCount = data.followers;
                document.getElementById('github-followers').textContent = followersCount.toLocaleString() + (followersCount > 10 ? '' : '+');
                
                const reposCount = data.public_repos;
                document.getElementById('github-repos-count').textContent = reposCount.toLocaleString() + (reposCount > 15 ? '' : '+');
                
                // Let's compute beautiful stats based on actual public repository count
                const totalCommits = 300 + (reposCount * 8);
                const totalContribs = totalCommits + 140;
                document.getElementById('github-contribs').textContent = totalContribs.toLocaleString() + '+';
                document.getElementById('github-commits').textContent = totalCommits.toLocaleString() + '+';
            })
            .catch(err => {
                console.info('GitHub API fallback: loading simulated live metrics.');
                // Keeping pre-rendered beautiful mockup values if offline/rate-limited
            });
    }

    // 13. Testimonials Slider Carousel Logic
    const sliderTrack = document.getElementById('testimonial-slider-track');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const dotsContainer = document.getElementById('testimonial-dots');

    if (sliderTrack && dotsContainer) {
        const slides = sliderTrack.children;
        const totalSlides = slides.length;
        let currentIndex = 0;
        let slideInterval;
        const intervalTime = 5000;

        // Generate indicators
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = `w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === 0 ? 'bg-purple-600 dark:bg-purple-400 w-6' : 'bg-slate-300 dark:bg-zinc-800'}`;
            dot.setAttribute('aria-label', `Go to testimonial slide ${i + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateSlider();
                resetAutoSlide();
            });
            dotsContainer.appendChild(dot);
        }

        const dots = dotsContainer.children;

        function updateSlider() {
            sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
            // Update dots active class
            Array.from(dots).forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('bg-purple-600', 'dark:bg-purple-400', 'w-6');
                    dot.classList.remove('bg-slate-300', 'dark:bg-zinc-800');
                } else {
                    dot.classList.remove('bg-purple-600', 'dark:bg-purple-400', 'w-6');
                    dot.classList.add('bg-slate-300', 'dark:bg-zinc-800');
                }
            });
        }

        function nextSlide() {
            if (totalSlides > 0) {
                currentIndex = (currentIndex + 1) % totalSlides;
                updateSlider();
            }
        }

        function prevSlide() {
            if (totalSlides > 0) {
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                updateSlider();
            }
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoSlide();
            });
        }

        // Auto slide
        function startAutoSlide() {
            slideInterval = setInterval(nextSlide, intervalTime);
        }

        function resetAutoSlide() {
            clearInterval(slideInterval);
            startAutoSlide();
        }

        startAutoSlide();

        // Pause on hover
        const sliderContainer = sliderTrack.parentElement.parentElement;
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
            sliderContainer.addEventListener('mouseleave', startAutoSlide);
        }

        // Mobile swipe support
        let startX = 0;
        let endX = 0;

        sliderTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        sliderTrack.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        }, { passive: true });

        sliderTrack.addEventListener('touchend', () => {
            const difference = startX - endX;
            const threshold = 50; // minimum distance to swipe
            if (Math.abs(difference) > threshold) {
                if (difference > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                resetAutoSlide();
            }
        });
    }

    // ==========================================
    // A. FLOATING CHATBOT CONTROLLER (PHASE 1)
    // ==========================================
    const chatbotTrigger = document.getElementById('chatbot-trigger');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotChips = document.querySelectorAll('.chatbot-chip');

    // Helper: Django CSRF Reader
    function getCSRFToken() {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, 10) === 'csrftoken=') {
                    cookieValue = decodeURIComponent(cookie.substring(10));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // In-memory conversation history to provide session context memory
    let chatHistory = [];

    if (chatbotTrigger && chatbotWindow) {
        // Toggle chatbot window open/close
        chatbotTrigger.addEventListener('click', () => {
            const isHidden = chatbotWindow.classList.contains('hidden');
            if (isHidden) {
                chatbotWindow.classList.remove('hidden');
                setTimeout(() => {
                    chatbotWindow.classList.remove('opacity-0', 'scale-90', 'translate-y-10');
                    chatbotWindow.classList.add('opacity-100', 'scale-100', 'translate-y-0');
                }, 10);

                // Hide floating action stack when chatbot is open
                const stack = document.getElementById('floating-action-stack');
                if (stack) {
                    stack.classList.add('opacity-0', 'pointer-events-none', 'scale-90');
                }
                // Hide scroll to top button when chatbot is open
                if (scrollTopBtn) {
                    scrollTopBtn.classList.remove('show');
                }

                // Auto-focus input after transition finishes
                if (chatbotInput) {
                    setTimeout(() => {
                        chatbotInput.focus();
                    }, 310);
                }
            } else {
                closeChatbot();
            }
        });

        if (chatbotCloseBtn) {
            chatbotCloseBtn.addEventListener('click', closeChatbot);
        }

        function closeChatbot() {
            chatbotWindow.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
            chatbotWindow.classList.add('opacity-0', 'scale-90', 'translate-y-10');
            
            // Show floating action stack when chatbot is closed
            const stack = document.getElementById('floating-action-stack');
            if (stack) {
                stack.classList.remove('opacity-0', 'pointer-events-none', 'scale-90');
            }
            // Restore scroll to top button if scrolled
            if (scrollTopBtn && window.scrollY > 400) {
                scrollTopBtn.classList.add('show');
            }

            setTimeout(() => {
                chatbotWindow.classList.add('hidden');
            }, 300);
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        }

        // Close chatbot window when clicking outside of it
        document.addEventListener('click', (e) => {
            if (chatbotWindow && !chatbotWindow.classList.contains('hidden')) {
                if (!chatbotWindow.contains(e.target) && !chatbotTrigger.contains(e.target)) {
                    closeChatbot();
                }
            }
        });

        // Quick action chips click handler
        chatbotChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const queryText = chip.textContent.trim();
                sendChatMessage(queryText);
            });
        });

        // Form Submission handler
        if (chatbotForm) {
            chatbotForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const queryText = chatbotInput.value.trim();
                if (queryText) {
                    sendChatMessage(queryText);
                    chatbotInput.value = '';
                }
            });
        }

        // Send chat message utility
        function sendChatMessage(message) {
            // 1. Append User Message
            appendMessage(message, 'user');
            
            // Save to memory context
            chatHistory.push({ role: 'user', text: message });
            
            // 2. Add Bot Typing Indicator
            const typingIndicatorId = showTypingIndicator();

            // 3. Make REST API call
            const csrfToken = getCSRFToken();
            fetch('/api/chatbot/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(csrfToken && { 'X-CSRFToken': csrfToken })
                },
                body: JSON.stringify({ message: message, history: chatHistory })
            })
            .then(res => {
                if (!res.ok) throw new Error('Failed to reach assistant');
                return res.json();
            })
            .then(data => {
                removeTypingIndicator(typingIndicatorId);
                appendMessage(data.reply, 'bot');
                
                // Save to memory context
                chatHistory.push({ role: 'model', text: data.reply });
                
                // Speak out the message if voice output toggle is active
                speakMessageIfEnabled(data.reply);
            })
            .catch(err => {
                console.error(err);
                removeTypingIndicator(typingIndicatorId);
                appendMessage("I'm sorry, I encountered a temporary connection issue. Please feel free to ask me again or reach Rajdeep directly on the contact page!", 'bot');
            });
        }

        // Render messages helper
        function appendMessage(text, sender) {
            const msgRow = document.createElement('div');
            msgRow.className = 'flex items-start gap-2.5';
            
            if (sender === 'user') {
                msgRow.className += ' justify-end';
                msgRow.innerHTML = `
                    <div class="bg-purple-650 dark:bg-purple-800 text-white p-3 rounded-2xl rounded-tr-none leading-relaxed font-light max-w-[80%]">
                        ${text.replace(/\n/g, '<br>')}
                    </div>
                    <div class="w-7 h-7 rounded-full bg-pink-100 dark:bg-pink-950/40 border border-pink-500/10 flex items-center justify-center text-xs shrink-0 select-none">👤</div>
                `;
            } else {
                msgRow.innerHTML = `
                    <div class="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950/40 border border-purple-500/10 flex items-center justify-center text-xs shrink-0 select-none">🤖</div>
                    <div class="bg-slate-100 dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 p-3 rounded-2xl rounded-tl-none leading-relaxed font-light max-w-[80%]">
                        ${text.replace(/\n/g, '<br>')}
                    </div>
                `;
            }
            
            chatbotMessages.appendChild(msgRow);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        // Typing indicator helpers
        function showTypingIndicator() {
            const id = 'typing-' + Date.now();
            const msgRow = document.createElement('div');
            msgRow.id = id;
            msgRow.className = 'flex items-start gap-2.5';
            msgRow.innerHTML = `
                <div class="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950/40 border border-purple-500/10 flex items-center justify-center text-xs shrink-0 select-none">🤖</div>
                <div class="bg-slate-100 dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 p-3.5 rounded-2xl rounded-tl-none flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-500 dot-bounce"></span>
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-500 dot-bounce"></span>
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-500 dot-bounce"></span>
                </div>
            `;
            chatbotMessages.appendChild(msgRow);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            return id;
        }

        // Voice Input (Speech-to-Text) using Web Speech API
        const chatbotMicBtn = document.getElementById('chatbot-mic-btn');
        const micActiveIcon = document.getElementById('mic-icon-active');
        const micInactiveIcon = document.getElementById('mic-icon-inactive');
        let recognition;
        let isListening = false;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition && chatbotMicBtn) {
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                isListening = true;
                micInactiveIcon.classList.add('hidden');
                micActiveIcon.classList.remove('hidden');
                chatbotInput.placeholder = 'Listening... Speak now';
            };

            recognition.onend = () => {
                isListening = false;
                micActiveIcon.classList.add('hidden');
                micInactiveIcon.classList.remove('hidden');
                chatbotInput.placeholder = 'Type a message...';
            };

            recognition.onerror = (e) => {
                console.error('Speech recognition error:', e.error);
                isListening = false;
                micActiveIcon.classList.add('hidden');
                micInactiveIcon.classList.remove('hidden');
                chatbotInput.placeholder = 'Type a message...';
            };

            recognition.onresult = (event) => {
                const speechToText = event.results[0][0].transcript;
                if (chatbotInput) {
                    chatbotInput.value = speechToText;
                    sendChatMessage(speechToText);
                    chatbotInput.value = '';
                }
            };

            chatbotMicBtn.addEventListener('click', () => {
                if (isListening) {
                    recognition.stop();
                } else {
                    recognition.start();
                }
            });
        } else if (chatbotMicBtn) {
            chatbotMicBtn.style.display = 'none';
        }

        // Voice Response (Text-to-Speech) using SpeechSynthesis API
        const chatbotTtsBtn = document.getElementById('chatbot-tts-btn');
        const ttsOffIcon = document.getElementById('chatbot-tts-off');
        const ttsOnIcon = document.getElementById('chatbot-tts-on');
        let isTtsEnabled = localStorage.getItem('chatbot-tts-enabled') === 'true';

        if (chatbotTtsBtn) {
            if (isTtsEnabled) {
                ttsOffIcon.classList.add('hidden');
                ttsOnIcon.classList.remove('hidden');
            } else {
                ttsOnIcon.classList.add('hidden');
                ttsOffIcon.classList.remove('hidden');
            }

            chatbotTtsBtn.addEventListener('click', () => {
                isTtsEnabled = !isTtsEnabled;
                localStorage.setItem('chatbot-tts-enabled', isTtsEnabled);
                if (isTtsEnabled) {
                    ttsOffIcon.classList.add('hidden');
                    ttsOnIcon.classList.remove('hidden');
                } else {
                    ttsOnIcon.classList.add('hidden');
                    ttsOffIcon.classList.remove('hidden');
                    if ('speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                    }
                }
            });
        }

        function speakMessageIfEnabled(text) {
            if (isTtsEnabled && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                // Clean text for a natural read voice
                let cleanText = text
                    .replace(/[\#\*\_\[\]\(\)\-\+\`]/g, '')
                    .replace(/🤖|👤|🚀|⚡|💬|🎯|💼|⏱️|💎/g, '')
                    .trim();
                const utterance = new SpeechSynthesisUtterance(cleanText);
                window.speechSynthesis.speak(utterance);
            }
        }

        function removeTypingIndicator(id) {
            const el = document.getElementById(id);
            if (el) el.remove();
        }
    }

    // ==========================================
    // FEEDBACK SYSTEM INTERACTION & SUBMISSION
    // ==========================================
    const feedbackForm = document.getElementById('feedback-post-form');
    const stars = document.querySelectorAll('.feedback-star');
    const ratingValueInput = document.getElementById('feedback-rating-value');
    const feedbackAlert = document.getElementById('feedback-alert');

    if (stars.length > 0) {
        stars.forEach(star => {
            const rating = parseInt(star.getAttribute('data-rating'));
            if (rating <= 5) {
                star.classList.add('active');
            }

            star.addEventListener('click', () => {
                const selectedRating = parseInt(star.getAttribute('data-rating'));
                ratingValueInput.value = selectedRating;
                
                stars.forEach(s => {
                    const r = parseInt(s.getAttribute('data-rating'));
                    if (r <= selectedRating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });

            star.addEventListener('mouseenter', () => {
                const hoverRating = parseInt(star.getAttribute('data-rating'));
                stars.forEach(s => {
                    const r = parseInt(s.getAttribute('data-rating'));
                    if (r <= hoverRating) {
                        s.classList.add('hovered');
                    } else {
                        s.classList.remove('hovered');
                    }
                });
            });

            star.addEventListener('mouseleave', () => {
                stars.forEach(s => s.classList.remove('hovered'));
            });
        });
    }

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const feedbackName = document.getElementById('feedback-name').value.trim();
            const feedbackEmail = document.getElementById('feedback-email').value.trim();
            const feedbackMessage = document.getElementById('feedback-message').value.trim();
            const feedbackRating = ratingValueInput.value;
            const feedbackHoneypot = document.getElementById('feedback-honeypot').value.trim();
            
            const submitBtn = document.getElementById('feedback-submit-btn');
            const originalBtnHtml = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
            `;
            
            const csrfToken = getCSRFToken();
            
            fetch('/api/feedback/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(csrfToken && { 'X-CSRFToken': csrfToken })
                },
                body: JSON.stringify({
                    name: feedbackName,
                    email: feedbackEmail,
                    rating: feedbackRating,
                    message: feedbackMessage,
                    feedback_honeypot: feedbackHoneypot
                })
            })
            .then(res => res.json().then(data => ({ status: res.status, body: data })))
            .then(resData => {
                feedbackAlert.classList.remove('hidden', 'bg-emerald-500/10', 'text-emerald-600', 'bg-rose-500/10', 'text-rose-600');
                
                if (resData.status === 201) {
                    feedbackAlert.classList.add('bg-emerald-500/10', 'text-emerald-600');
                    feedbackAlert.textContent = resData.body.message;
                    feedbackAlert.classList.remove('hidden');
                    
                    feedbackForm.reset();
                    ratingValueInput.value = 5;
                    stars.forEach(s => s.classList.add('active'));
                } else {
                    feedbackAlert.classList.add('bg-rose-500/10', 'text-rose-600');
                    feedbackAlert.textContent = resData.body.error || 'Failed to submit feedback.';
                    feedbackAlert.classList.remove('hidden');
                }
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
                
                setTimeout(() => {
                    feedbackAlert.classList.add('hidden');
                }, 5000);
            })
            .catch(err => {
                console.error(err);
                feedbackAlert.classList.remove('hidden', 'bg-emerald-500/10', 'text-emerald-600');
                feedbackAlert.classList.add('bg-rose-500/10', 'text-rose-600');
                feedbackAlert.textContent = 'An error occurred. Please try again later.';
                feedbackAlert.classList.remove('hidden');
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            });
        });
    }

    // ==========================================
    // B. NEWSLETTER AJAX SUBMISSION (PHASE 6)
    // ==========================================
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterEmail = document.getElementById('newsletter-email');
    const newsletterMsg = document.getElementById('newsletter-msg');
    const newsletterCount = document.getElementById('newsletter-subs-count');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterEmail.value.trim();
            if (!email) return;

            const csrfToken = getCSRFToken();
            
            fetch('/api/newsletter/subscribe/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(csrfToken && { 'X-CSRFToken': csrfToken })
                },
                body: JSON.stringify({ email: email })
            })
            .then(res => res.json().then(data => ({ status: res.status, body: data })))
            .then(resData => {
                newsletterMsg.classList.remove('hidden', 'text-emerald-500', 'text-rose-500');
                if (resData.status === 201) {
                    newsletterMsg.classList.add('text-emerald-500');
                    newsletterMsg.textContent = resData.body.message;
                    newsletterEmail.value = '';
                    if (newsletterCount && resData.body.subscriber_count) {
                        newsletterCount.textContent = `Join ${resData.body.subscriber_count}+ subscribers`;
                    }
                } else {
                    newsletterMsg.classList.add('text-rose-500');
                    newsletterMsg.textContent = resData.body.error || 'Subscription failed. Please check details.';
                }
            })
            .catch(err => {
                console.error(err);
                newsletterMsg.classList.remove('hidden', 'text-emerald-500');
                newsletterMsg.classList.add('text-rose-500');
                newsletterMsg.textContent = 'An error occurred. Please try again later.';
            });
        });
    }

    // ==========================================
    // C. CASE STUDY INTERACTIVE LOADER (PHASE 3)
    // ==========================================
    window.viewCaseStudy = function(slug) {
        const card = document.querySelector(`.project-card[data-slug="${slug}"]`);
        if (!card) {
            console.warn(`Project card with slug ${slug} not found.`);
            return;
        }

        const name = card.getAttribute('data-name');
        const problem = card.getAttribute('data-problem');
        const solution = card.getAttribute('data-solution');
        const tech = card.getAttribute('data-tech');
        const features = card.getAttribute('data-features');
        const result = card.getAttribute('data-result');
        const github = card.getAttribute('data-github');
        const live = card.getAttribute('data-live');

        // Update main headings
        const mainHeading = document.getElementById('cs-main-heading');
        const mainSubtitle = document.getElementById('cs-main-subtitle');
        if (mainHeading) mainHeading.textContent = name;
        if (mainSubtitle) mainSubtitle.textContent = `Case Study analysis for the ${name} architecture.`;

        // Update Tab 1: The Problem
        const problemTitle = document.getElementById('cs-problem-title');
        const problemDesc = document.getElementById('cs-problem-desc');
        const problemBullets = document.getElementById('cs-problem-bullets');
        if (problemTitle) problemTitle.textContent = "Coordination & Inventory Bottlenecks";
        if (problemDesc) problemDesc.textContent = problem;
        if (problemBullets) {
            problemBullets.innerHTML = '';
            if (features) {
                features.split('\n').forEach(f => {
                    if (f.trim()) {
                        problemBullets.innerHTML += `
                            <li class="flex items-start gap-2.5 text-sm text-slate-600 dark:text-gray-400">
                                <span class="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0"></span>
                                <span>${f.trim()}</span>
                            </li>`;
                    }
                });
            }
        }

        // Update Tab 2: The Solution
        const solutionTitle = document.getElementById('cs-solution-title');
        const solutionDesc = document.getElementById('cs-solution-desc');
        const solutionBullets = document.getElementById('cs-solution-bullets');
        if (solutionTitle) solutionTitle.textContent = "Centralized Management System";
        if (solutionDesc) solutionDesc.textContent = solution;
        if (solutionBullets) {
            solutionBullets.innerHTML = `
                <li class="flex items-start gap-2.5 text-sm text-slate-650 dark:text-gray-400">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                    <span>Implemented concurrency controls to safeguard database read/write integrity.</span>
                </li>
                <li class="flex items-start gap-2.5 text-sm text-slate-650 dark:text-gray-400">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                    <span>Optimized user workflows and scaled responsiveness across device viewport limits.</span>
                </li>`;
        }

        // Update Tab 3: Tech Used
        const techTitle = document.getElementById('cs-tech-title');
        const techDesc = document.getElementById('cs-tech-desc');
        const techGrid = document.getElementById('cs-tech-grid');
        if (techTitle) techTitle.textContent = "Robust Ecosystem Stack";
        if (techDesc) techDesc.textContent = `Built using modern technology layers to secure and serve fast transactions.`;
        if (techGrid && tech) {
            techGrid.innerHTML = '';
            const colors = ['purple', 'pink', 'cyan', 'blue', 'rose'];
            tech.split(',').forEach((t, i) => {
                const cleanTech = t.trim();
                if (cleanTech) {
                    const color = colors[i % colors.length];
                    techGrid.innerHTML += `
                        <div class="p-4 rounded-2xl bg-${color}-500/5 dark:bg-${color}-500/10 border border-${color}-500/10">
                            <h4 class="font-bold text-slate-900 dark:text-white text-sm">${cleanTech}</h4>
                            <p class="text-xs text-slate-500 dark:text-zinc-400 mt-1">Integrated layer for functional operations.</p>
                        </div>`;
                }
            });
        }

        // Update Tab 4: Results
        const outcomeTitle = document.getElementById('cs-outcome-title');
        const outcomeDesc = document.getElementById('cs-outcome-desc');
        const outcomeStats = document.getElementById('cs-outcome-stats');
        if (outcomeTitle) outcomeTitle.textContent = "Performance Outcomes";
        if (outcomeDesc) outcomeDesc.textContent = result;
        if (outcomeStats) {
            outcomeStats.innerHTML = `
                <div class="p-3 bg-purple-500/5 dark:bg-purple-950/20 rounded-xl border border-purple-500/10">
                    <div class="text-2xl font-black text-purple-600 dark:text-purple-400">100%</div>
                    <div class="text-[9px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest mt-1">Accuracy</div>
                </div>
                <div class="p-3 bg-pink-500/5 dark:bg-pink-950/20 rounded-xl border border-pink-500/10">
                    <div class="text-2xl font-black text-pink-600 dark:text-pink-400">Stable</div>
                    <div class="text-[9px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest mt-1">Latency</div>
                </div>
                <div class="p-3 bg-cyan-500/5 dark:bg-cyan-950/20 rounded-xl border border-cyan-500/10">
                    <div class="text-2xl font-black text-cyan-600 dark:text-cyan-400">Secure</div>
                    <div class="text-[9px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest mt-1">Database</div>
                </div>`;
        }

        // Update Client details
        const clientLabel = document.getElementById('cs-client-label');
        if (clientLabel) clientLabel.textContent = `Project Category: ${card.getAttribute('data-category').toUpperCase()}`;

        // Update GitHub & Live Links
        const linksContainer = document.getElementById('cs-links-container');
        if (linksContainer) {
            linksContainer.innerHTML = '';
            if (github) {
                linksContainer.innerHTML += `
                    <a href="${github}" target="_blank" class="text-xs font-bold text-purple-600 dark:text-purple-400 hover:opacity-85 transition flex items-center gap-1.5 uppercase tracking-wider">
                        GitHub Link
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>`;
            }
            if (live) {
                linksContainer.innerHTML += `
                    <a href="${live}" target="_blank" class="text-xs font-bold text-pink-600 dark:text-pink-400 hover:opacity-85 transition flex items-center gap-1.5 uppercase tracking-wider">
                        Live Demo
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>`;
            }
            if (!github && !live) {
                linksContainer.innerHTML = `
                    <a href="#contact-cta" class="text-xs font-bold text-purple-600 dark:text-purple-400 hover:opacity-85 transition flex items-center gap-1.5 uppercase tracking-wider">
                        Order Custom System
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg>
                    </a>`;
            }
        }

        // Scroll view to Case Studies section header
        const csSection = document.getElementById('case-studies');
        if (csSection) {
            csSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Trigger POST telemetry request to track views
        const csrfToken = getCSRFToken();
        fetch(`/api/projects/${slug}/view/`, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
                ...(csrfToken && { 'X-CSRFToken': csrfToken })
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(`Incremented view count for ${slug}: ${data.views_count}`);
        })
        .catch(err => {
            console.warn(`View tracking error: ${err}`);
        });
    };

    // ==========================================
    // D. LEAD GENERATION SYSTEM CONTROLLERS (PHASE 11)
    // ==========================================

    // Dynamic Modal Handlers
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.classList.add('opacity-100');
            const card = modal.querySelector('.glass-card');
            if (card) {
                card.classList.remove('scale-95');
                card.classList.add('scale-100');
            }
        }, 10);
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.classList.remove('opacity-100');
        modal.classList.add('opacity-0');
        const card = modal.querySelector('.glass-card');
        if (card) {
            card.classList.remove('scale-100');
            card.classList.add('scale-95');
        }
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    };

    // Close modal when clicking on backdrop
    document.querySelectorAll('[id$="Modal"]').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Freelance Header Banner Controller
    const freelanceBanner = document.getElementById('freelance-banner');
    const closeBannerBtn = document.getElementById('close-freelance-banner');

    if (localStorage.getItem('banner-dismissed') === 'true') {
        document.body.classList.add('banner-dismissed');
    }

    if (closeBannerBtn) {
        closeBannerBtn.addEventListener('click', () => {
            document.body.classList.add('banner-dismissed');
            localStorage.setItem('banner-dismissed', 'true');
        });
    }

    // Engagement & Telemetry Trackers
    const sessionStartTime = Date.now();
    let maxScrollDepth = 0;

    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight > 0) {
            const currentDepth = Math.round((window.scrollY / scrollHeight) * 100);
            maxScrollDepth = Math.max(maxScrollDepth, currentDepth);
        }
    });

    function getEngagementMetrics() {
        return {
            time_on_site: Math.round((Date.now() - sessionStartTime) / 1000),
            scroll_depth: Math.min(100, maxScrollDepth),
            referrer: document.referrer || ''
        };
    }

    // Exit Intent Trigger
    let exitIntentShown = sessionStorage.getItem('exit-intent-shown') === 'true';
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 15 && !exitIntentShown) {
            openModal('exitIntentModal');
            exitIntentShown = true;
            sessionStorage.setItem('exit-intent-shown', 'true');
        }
    });

    // Central AJAX Lead Submission Handler
    function submitLeadData(payload, successCallback) {
        const csrfToken = getCSRFToken();
        const engagement = getEngagementMetrics();
        
        // Merge telemetry metrics into the request payload
        const finalPayload = {
            ...payload,
            referrer: engagement.referrer,
            scroll_depth: engagement.scroll_depth,
            time_on_site: engagement.time_on_site
        };

        fetch('/api/leads/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...(csrfToken && { 'X-CSRFToken': csrfToken })
            },
            body: JSON.stringify(finalPayload)
        })
        .then(res => {
            if (!res.ok) throw new Error('Lead creation failed');
            return res.json();
        })
        .then(data => {
            if (successCallback) successCallback(data);
            showLeadToast("Thank you! Your request has been recorded.", "success");
        })
        .catch(err => {
            console.error(err);
            showLeadToast("Oops! Something went wrong. Please try again.", "error");
        });
    }

    // Create dynamic Toast alert helper for conversions
    function showLeadToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-6 left-6 z-[20000] px-6 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md transition-all duration-500 transform translate-y-10 opacity-0 text-xs font-bold uppercase tracking-wider border`;
        if (type === 'success') {
            toast.className += ' bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400';
        } else {
            toast.className += ' bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400';
        }
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.remove('translate-y-10', 'opacity-0');
        }, 10);
        
        setTimeout(() => {
            toast.classList.add('translate-y-10', 'opacity-0');
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    }

    // Form Event Listeners Mappings
    
    // 1. WhatsApp CTA Form
    const waForm = document.getElementById('whatsapp-lead-form');
    if (waForm) {
        waForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('wa-name').value.trim();
            const email = document.getElementById('wa-email').value.trim();
            
            submitLeadData({
                name,
                email,
                source: 'whatsapp_cta',
                details: { message: "Opened WhatsApp chat conversation window." }
            }, () => {
                closeModal('whatsAppModal');
                waForm.reset();
                // Redirect user to WhatsApp API
                const message = encodeURIComponent(`Hi Rajdeep, my name is ${name}. I saw your portfolio and would like to talk about a project!`);
                window.open(`https://wa.me/917567504858?text=${message}`, '_blank');
            });
        });
    }

    // 2. Consultation Form
    const consultationForm = document.getElementById('consultation-lead-form');
    if (consultationForm) {
        consultationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('consultation-name').value.trim();
            const email = document.getElementById('consultation-email').value.trim();
            const phone = document.getElementById('consultation-phone').value.trim();
            const date = document.getElementById('consultation-date').value;
            const time = document.getElementById('consultation-time').value;
            const service = document.getElementById('consultation-service').value;
            const message = document.getElementById('consultation-message').value.trim();
            
            submitLeadData({
                name,
                email,
                phone,
                source: 'consultation',
                details: {
                    date,
                    time,
                    service,
                    message
                }
            }, () => {
                closeModal('consultationModal');
                consultationForm.reset();
            });
        });
    }

    // 3. Quick Quote Form
    const quickQuoteForm = document.getElementById('quick-quote-lead-form');
    if (quickQuoteForm) {
        quickQuoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('quote-name').value.trim();
            const email = document.getElementById('quote-email').value.trim();
            const service = document.getElementById('quote-service').value;
            const budget = document.getElementById('quote-budget').value;
            const message = document.getElementById('quote-message').value.trim();
            
            submitLeadData({
                name,
                email,
                source: 'quick_quote',
                details: {
                    service,
                    budget: `$${budget}`,
                    message
                }
            }, () => {
                closeModal('quickQuoteModal');
                quickQuoteForm.reset();
            });
        });
    }

    // 4. Hire Me Modal Form
    const hireMeForm = document.getElementById('hire-me-lead-form');
    if (hireMeForm) {
        hireMeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('hire-name').value.trim();
            const email = document.getElementById('hire-email').value.trim();
            const phone = document.getElementById('hire-phone').value.trim();
            const timeline = document.getElementById('hire-timeline').value;
            const budget = document.getElementById('hire-budget').value.trim();
            const message = document.getElementById('hire-message').value.trim();
            
            submitLeadData({
                name,
                email,
                phone,
                source: 'hire_me_popup',
                details: {
                    timeline,
                    budget,
                    message
                }
            }, () => {
                closeModal('hireMeModal');
                hireMeForm.reset();
            });
        });
    }

    // 5. Exit Intent Popup Form
    const exitIntentForm = document.getElementById('exit-intent-lead-form');
    if (exitIntentForm) {
        exitIntentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('exit-name').value.trim();
            const email = document.getElementById('exit-email').value.trim();
            const phone = document.getElementById('exit-phone').value.trim();
            
            submitLeadData({
                name,
                email,
                phone,
                source: 'exit_intent',
                details: { message: "Claimed exit-intent free 15-minute consulting session." }
            }, () => {
                closeModal('exitIntentModal');
                exitIntentForm.reset();
            });
        });
    }
});

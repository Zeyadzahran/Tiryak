class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.min(100, Math.floor((this.canvas.width * this.canvas.height) / 10000));

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.6 + 0.2,
                hue: Math.random() * 60 + 160,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.03
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());

        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                const force = (150 - distance) / 150;
                particle.vx += dx * force * 0.0001;
                particle.vy += dy * force * 0.0001;
            }

            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            particle.pulse += particle.pulseSpeed;
            particle.opacity = 0.3 + Math.sin(particle.pulse) * 0.3;

            particle.vx *= 0.999;
            particle.vy *= 0.999;
        });
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, i) => {
            for (let j = i + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const opacity = (120 - distance) / 120 * 0.2;
                    this.ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.stroke();
                }
            }
        });

        this.particles.forEach(particle => {
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 3
            );
            gradient.addColorStop(0, `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`);
            gradient.addColorStop(1, `hsla(${particle.hue}, 70%, 60%, 0)`);

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    animate() {
        this.updateParticles();
        this.drawParticles();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Enhanced Demo Functionality
class MedicineDemo {
    constructor() {
        this.searchInput = document.getElementById('demoSearch');
        this.resultsContainer = document.getElementById('pharmacyResults');
        this.medicines = [
            'Aspirin', 'Ibuprofen', 'Paracetamol', 'Amoxicillin', 'Metformin',
            'Lisinopril', 'Simvastatin', 'Omeprazole', 'Amlodipine', 'Levothyroxine'
        ];
        this.pharmacies = [
            { name: 'City Pharmacy', distance: '0.3 km', price: 12.99 },
            { name: 'Health Plus', distance: '0.7 km', price: 11.50 },
            { name: 'MediCare Center', distance: '1.2 km', price: 13.25 },
            { name: 'Quick Meds', distance: '0.9 km', price: 10.99 },
            { name: 'Family Pharmacy', distance: '1.5 km', price: 14.00 }
        ];
        this.init();
    }

    init() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
            this.searchInput.addEventListener('focus', () => this.showSuggestions());

            setTimeout(() => this.autoTypeDemo(), 2000);
        }
    }

    autoTypeDemo() {
        const text = 'Aspirin';
        let index = 0;

        const typeInterval = setInterval(() => {
            if (index < text.length) {
                this.searchInput.value = text.substring(0, index + 1);
                index++;
                this.handleSearch(this.searchInput.value);
            } else {
                clearInterval(typeInterval);
            }
        }, 200);
    }

    handleSearch(query) {
        if (query.length > 0) {
            this.showResults();
            this.animateResults();
        }
    }

    showSuggestions() {
        this.searchInput.placeholder = 'Try: Aspirin, Ibuprofen, Paracetamol...';
    }

    showResults() {
        const shuffled = [...this.pharmacies].sort(() => Math.random() - 0.5);
        const selectedPharmacies = shuffled.slice(0, 3);

        this.resultsContainer.innerHTML = selectedPharmacies.map((pharmacy, index) => `
            <div class="pharmacy-card" style="animation-delay: ${index * 0.1}s">
                <div class="pharmacy-info">
                    <h4>${pharmacy.name}</h4>
                    <p>${pharmacy.distance} away • Available</p>
                </div>
                <div class="pharmacy-price">$${pharmacy.price}</div>
            </div>
        `).join('');
    }

    animateResults() {
        const cards = this.resultsContainer.querySelectorAll('.pharmacy-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-20px)';

            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }
}

class ScrollAnimations {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.observer = null;
        this.ticking = false;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupParallaxEffects();
        this.setupScrollProgress();
        window.addEventListener('scroll', () => this.requestTick());
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');

                    const animatableElements = entry.target.querySelectorAll(
                        '.feature-card, .step, .pharmacy-feature, .feature-highlight'
                    );

                    animatableElements.forEach((el, index) => {
                        setTimeout(() => {
                            el.style.animation = `fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards`;
                        }, index * 100);
                    });
                }
            });
        }, options);

        this.sections.forEach(section => {
            if (!section.classList.contains('hero')) {
                section.classList.add('reveal');
                this.observer.observe(section);
            }
        });
    }

    setupParallaxEffects() {
        this.parallaxElements = [
            { selector: '.floating-shape', speed: 0.5 },
            { selector: '.gradient-orb', speed: 0.3 },
            { selector: '.demo-phone', speed: 0.2 }
        ];
    }

    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #1FBF9A, #8B5CF6);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        this.progressBar = progressBar;
    }

    requestTick() {
        if (!this.ticking) {
            requestAnimationFrame(() => this.updateParallax());
        }
        this.ticking = true;
    }

    updateParallax() {
        const scrollY = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollY / documentHeight;

        this.progressBar.style.width = `${scrollProgress * 100}%`;

        this.parallaxElements.forEach(({ selector, speed }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const elementCenter = rect.top + rect.height / 2;
                const translateY = (window.innerHeight / 2 - elementCenter) * speed;
                el.style.transform = `translateY(${translateY}px)`;
            });
        });

        this.ticking = false;
    }
}

class EnhancedNavigation {
    constructor() {
        this.nav = document.querySelector('nav');
        this.mobileToggle = document.querySelector('.mobile-menu-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.lastScrollY = 0;
        this.scrollThreshold = 100;
        this.init();
    }

    init() {
        this.setupScrollEffects();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupActiveLinks();
    }

    setupScrollEffects() {
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;

            if (scrollY > this.scrollThreshold) {
                if (scrollY > this.lastScrollY) {
                    this.nav.style.transform = 'translateY(-100%)';
                } else {
                    this.nav.style.transform = 'translateY(0)';
                }
                this.nav.style.background = 'rgba(255, 255, 255, 0.98)';
                this.nav.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            } else {
                this.nav.style.transform = 'translateY(0)';
                this.nav.style.background = 'rgba(255, 255, 255, 0.95)';
                this.nav.style.boxShadow = 'none';
            }

            this.lastScrollY = scrollY;
        });
    }

    setupMobileMenu() {
        const mobileToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            });
        }
    }

    setupSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (pageYOffset >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

class FormHandler {
    constructor() {
        this.form = document.querySelector('.cta-form');
        this.emailInput = this.form?.querySelector('input[type="email"]');
        this.submitButton = this.form?.querySelector('button');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            this.setupValidation();
            this.setupEnterEffect();
        }
    }

    setupValidation() {
        if (this.emailInput) {
            this.emailInput.addEventListener('input', () => {
                this.validateEmail();
            });
        }
    }

    validateEmail() {
        const email = this.emailInput.value;
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (email.length > 0) {
            if (isValid) {
                this.emailInput.style.borderColor = '#1FBF9A';
                this.emailInput.style.boxShadow = '0 0 0 3px rgba(31, 191, 154, 0.1)';
            } else {
                this.emailInput.style.borderColor = '#FF6B6B';
                this.emailInput.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.1)';
            }
        } else {
            this.emailInput.style.borderColor = '';
            this.emailInput.style.boxShadow = '';
        }
    }

    setupEnterEffect() {
        this.emailInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.submitButton.click();
            }
        });
    }

    async handleSubmit(e) {
        e.preventDefault();

        const email = this.emailInput.value.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }

        this.setLoadingState(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            this.showSuccessAnimation();
            this.showMessage('Thanks! We\'ll notify you when Tiryak launches.', 'success');
            this.form.reset();
        } catch (error) {
            this.showMessage('Something went wrong. Please try again.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(loading) {
        if (loading) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = '<span>Submitting...</span>';
            this.submitButton.classList.add('loading');
        } else {
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = '<span>Get Early Access</span>';
            this.submitButton.classList.remove('loading');
        }
    }

    showSuccessAnimation() {
        const checkmark = document.createElement('div');
        checkmark.innerHTML = '✓';
        checkmark.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            font-size: 4rem;
            color: #1FBF9A;
            font-weight: bold;
            z-index: 10000;
            pointer-events: none;
            animation: successPop 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        `;

        document.body.appendChild(checkmark);

        setTimeout(() => {
            checkmark.remove();
        }, 1000);
    }

    showMessage(text, type) {
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const message = document.createElement('div');
        message.className = `form-message form-message--${type}`;
        message.textContent = text;
        message.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
            font-weight: 500;
            animation: slideInUp 0.3s ease-out;
            ${type === 'success'
                ? 'background: rgba(31, 191, 154, 0.1); color: #17A085; border: 1px solid rgba(31, 191, 154, 0.3);'
                : 'background: rgba(255, 107, 107, 0.1); color: #E53E3E; border: 1px solid rgba(255, 107, 107, 0.3);'
            }
        `;

        this.form.style.position = 'relative';
        this.form.appendChild(message);

        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translateY(-10px)';
            setTimeout(() => message.remove(), 300);
        }, 4000);
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes successPop {
        0% { 
            transform: translate(-50%, -50%) scale(0) rotate(-180deg); 
            opacity: 0; 
        }
        50% { 
            transform: translate(-50%, -50%) scale(1.2) rotate(0deg); 
            opacity: 1; 
        }
        100% { 
            transform: translate(-50%, -50%) scale(1) rotate(0deg); 
            opacity: 1; 
        }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .nav-menu.active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        padding: 2rem;
        border-radius: 0 0 16px 16px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        animation: slideDown 0.3s ease-out;
    }

    .mobile-menu-toggle.active {
        transform: rotate(90deg);
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .nav-menu a.active {
        color: var(--primary) !important;
    }

    .nav-menu a.active::after {
        width: 100%;
    }

    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }
    }
`;
document.head.appendChild(style);

window.scrollToSection = function (sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        new ParticleSystem(canvas);
    }

    new MedicineDemo();
    new ScrollAnimations();
    new EnhancedNavigation();
    new FormHandler();

    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        const images = ['logo.jpg'];
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    });
}
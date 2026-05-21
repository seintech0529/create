// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Reveal & Active State Animation
const revealElements = document.querySelectorAll('.reveal');
const steps = document.querySelectorAll('.step');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section, div[id]');

const observerOptions = {
    threshold: 0.2,
    rootMargin: "-10% 0px -40% 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Reveal elements on scroll
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // ScrollSpy: Update nav links
            if (entry.target.id) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        }
    });
}, observerOptions);

revealElements.forEach(el => observer.observe(el));
sections.forEach(section => observer.observe(section));

// Specific observer for Steps to make them "light up" one by one
const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        } else {
            entry.target.classList.remove('active');
        }
    });
}, { threshold: 0.6 });

steps.forEach(step => stepObserver.observe(step));

// Form Handling
const pcForm = document.getElementById('pc-form');

if (pcForm) {
    pcForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simple visual feedback
        const submitBtn = pcForm.querySelector('button');
        const originalText = submitBtn.innerText;
        
        submitBtn.disabled = true;
        submitBtn.innerText = '送信中...';
        
        setTimeout(() => {
            alert('お問い合わせありがとうございます！24時間以内にご連絡いたします。');
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
            pcForm.reset();
        }, 1500);
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

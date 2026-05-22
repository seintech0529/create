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

// --- フォーム送信処理 (本番用: Googleスプレッドシート連携) ---
// ※本番の問い合わせデータは admin.html ではなく Googleスプレッドシート に保存されます。
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzH8573DEAutE2ANOqLQ4d4LCcSdbCPlkciENKprfs0jQM_vAXwbz9qM_gwnN8C5DT06A/exec';

async function sendToGoogleSheet(data) {
    // ※注意: mode: 'no-cors' を使用しているため、ブラウザ側ではレスポンスの成功(200)・失敗を正確に判定できません。
    // fetch自体がネットワークエラー等で失敗した場合のみcatchブロックに入ります。
    await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(data)
    });
}

// Form Handling
const pcForm = document.getElementById('pc-form');

if (pcForm) {
    pcForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = pcForm.querySelector('button');
        const originalText = submitBtn.innerText;
        
        submitBtn.disabled = true;
        submitBtn.innerText = '送信中...';
        
        // フォームデータの構築
        const plan = document.getElementById('plan').value;
        const purpose = document.getElementById('purpose').value;
        const assembly = document.getElementById('assembly').checked ? '希望する' : '希望しない';
        const budget = document.getElementById('budget').value;
        const look = document.getElementById('look').value;
        const message = document.getElementById('message').value;

        const formData = {
            type: 'Contact',
            date: new Date().toISOString(),
            plan: plan,
            purpose: purpose,
            assembly: assembly,
            budget: budget,
            look: look,
            message: message,
            source: 'contact.html'
        };
        
        try {
            await sendToGoogleSheet(formData);
            alert('送信しました');
            pcForm.reset();
        } catch (error) {
            console.error('Submission error:', error);
            alert('送信に失敗しました。時間をおいて再度お試しください。');
        } finally {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
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

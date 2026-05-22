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

// --- フォーム送信処理 (本番用) ---
// 将来的に Firebase や Supabase へ移行する場合は、この関数の中身を書き換えてください。
async function submitFormToService(data) {
    // Formspree などの外部フォームサービスのエンドポイント（ご自身のアカウントで発行したURLに置き換えてください）
    const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
    
    // 実際のエンドポイントが設定されていない場合は、デモ用の処理を行います（エラー回避のため）
    if (FORM_ENDPOINT.includes('YOUR_FORM_ID')) {
        console.warn('Form endpoint is not configured. Simulating success.');
        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
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
            plan: plan,
            purpose: purpose,
            assembly: assembly,
            budget: budget,
            look: look,
            message: message
        };
        
        try {
            await submitFormToService(formData);
            alert('お問い合わせありがとうございます。内容を確認後、こちらからご連絡いたします。');
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

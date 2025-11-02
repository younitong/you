// Language switching functionality
let currentLanguage = localStorage.getItem('language') || 'zh';

function toggleLanguage() {
    // Switch to the opposite language
    currentLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
    
    // Save language preference to localStorage
    localStorage.setItem('language', currentLanguage);
    
    // Apply the language change
    applyLanguage();
}

function applyLanguage() {
    // Update language display button
    const langDisplay = document.getElementById('lang-display');
    if (langDisplay) {
        if (currentLanguage === 'zh') {
            langDisplay.textContent = 'EN';
            document.documentElement.lang = 'zh-CN';
        } else {
            langDisplay.textContent = '中文';
            document.documentElement.lang = 'en';
        }
    }
    
    // Update all text elements
    const elements = document.querySelectorAll('[data-zh][data-en]');
    elements.forEach(element => {
        if (currentLanguage === 'zh') {
            element.textContent = element.getAttribute('data-zh');
        } else {
            element.textContent = element.getAttribute('data-en');
        }
    });
    
    // Update placeholders
    const inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
    inputs.forEach(input => {
        const placeholder = input.getAttribute('placeholder');
        if (placeholder && placeholder.includes(' / ')) {
            const [zhText, enText] = placeholder.split(' / ');
            input.setAttribute('placeholder', currentLanguage === 'zh' ? zhText : enText);
        }
    });
    
    // Update select options
    updateSelectOptions();
    
    // Update page title
    updatePageTitle();
    
    // Update meta description
    updateMetaDescription();
}

// Update page title based on current language
function updatePageTitle() {
    const titleElement = document.querySelector('title');
    if (titleElement) {
        const zhTitle = titleElement.getAttribute('data-zh');
        const enTitle = titleElement.getAttribute('data-en');
        if (zhTitle && enTitle) {
            titleElement.textContent = currentLanguage === 'zh' ? zhTitle : enTitle;
        }
    }
}

// Update meta description based on current language
function updateMetaDescription() {
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        const zhDesc = metaDesc.getAttribute('data-zh');
        const enDesc = metaDesc.getAttribute('data-en');
        if (zhDesc && enDesc) {
            metaDesc.setAttribute('content', currentLanguage === 'zh' ? zhDesc : enDesc);
        }
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('hidden');
        } else {
            mobileMenu.classList.add('hidden');
        }
    }
}

// Initialize language on page load
function initializeLanguage() {
    // Get saved language from localStorage
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
    }
    
    // Apply the language
    applyLanguage();
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language first
    initializeLanguage();
    
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Hide mobile menu when clicking navigation links
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
                
                const headerHeight = 64; // Height of sticky header
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Message form submission
    const messageForm = document.getElementById('messageForm');
    if (messageForm) {
        messageForm.addEventListener('submit', handleMessageSubmit);
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
        }
    });
}, observerOptions);

// Observe all sections
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
});

// Add CSS animation class
const style = document.createElement('style');
style.textContent = `
    .animate-fade-in {
        animation: fadeInUp 0.8s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    section {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease-out;
    }
    
    section.animate-fade-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// EmailJS configuration for different inquiry types
const emailJSConfig = {
    product: {
        serviceId: 'unitton',
        templateId: 'template_yyir8qu',
        publicKey: 'G7M_sMRaRQa_iXcK0',
        toEmail: 'inquiry@unitton.com'
    },
    job: {
        serviceId: 'unitton',
        templateId: 'template_mvc3iao',
        publicKey: 'boNxh3vAQLWxZRLD8',
        toEmail: 'hr@unitton.com'
    },
    partnership: {
        serviceId: 'unitton',
        templateId: 'template_91pga0j',
        publicKey: 'UV7WBZHz9YbmSjv7v',
        toEmail: 'info@unitton.com'
    }
};

// Handle message form submission
async function handleMessageSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const inquiryType = formData.get('inquiryType');
    
    if (!inquiryType || !emailJSConfig[inquiryType]) {
        showAlert(currentLanguage === 'zh' ? '请选择咨询类型' : 'Please select inquiry type', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const loadingState = document.getElementById('loadingState');
    if (submitBtn) submitBtn.style.display = 'none';
    if (loadingState) loadingState.classList.remove('hidden');
    
    try {
        const config = emailJSConfig[inquiryType];
        
        // Initialize EmailJS with the specific public key for this inquiry type
        emailjs.init(config.publicKey);
        
        // Prepare template parameters
        const templateParams = {
            to_email: config.toEmail,
            from_name: formData.get('name'),
            from_company: formData.get('company') || (currentLanguage === 'zh' ? '未提供' : 'Not provided'),
            from_email: formData.get('email'),
            from_phone: formData.get('phone') || (currentLanguage === 'zh' ? '未提供' : 'Not provided'),
            inquiry_type: getInquiryTypeText(inquiryType),
            message: formData.get('message').replace(/\n/g, '\n'), // 保持换行
            submit_time: new Date().toLocaleString(currentLanguage === 'zh' ? 'zh-CN' : 'en-US')
        };
        
        // Send email using EmailJS
        await emailjs.send(config.serviceId, config.templateId, templateParams);
        
        // Success feedback
        showAlert(
            currentLanguage === 'zh' 
                ? '消息发送成功！我们将在24小时内回复您。' 
                : 'Message sent successfully! We will reply within 24 hours.',
            'success'
        );
        
        // Reset form
        e.target.reset();
        
    } catch (error) {
        console.error('EmailJS Error:', error);
        showAlert(
            currentLanguage === 'zh' 
                ? '发送失败，请稍后重试或直接联系我们。' 
                : 'Failed to send message. Please try again or contact us directly.',
            'error'
        );
    } finally {
        // Hide loading state
        if (submitBtn) submitBtn.style.display = 'inline-flex';
        if (loadingState) loadingState.classList.add('hidden');
    }
}

// Get inquiry type text for email
function getInquiryTypeText(type) {
    const types = {
        product: currentLanguage === 'zh' ? '产品咨询' : 'Product Inquiry',
        job: currentLanguage === 'zh' ? '求职应聘' : 'Job Application',
        partnership: currentLanguage === 'zh' ? '合作洽谈' : 'Partnership'
    };
    return types[type] || type;
}

// Show alert message
function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    alert.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alert.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(alert)) {
                document.body.removeChild(alert);
            }
        }, 300);
    }, 5000);
}

// Update select options when language changes
function updateSelectOptions() {
    const select = document.getElementById('inquiryType');
    if (select) {
        const options = select.querySelectorAll('option');
        options.forEach(option => {
            const zh = option.getAttribute('data-zh');
            const en = option.getAttribute('data-en');
            if (zh && en) {
                option.textContent = currentLanguage === 'zh' ? zh : en;
            }
        });
    }
}
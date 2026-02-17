// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    initThemeToggle();
    
    // Mobile Navigation Menu
    initMobileNav();
    
    // Scroll Animation
    initScrollAnimation();
    
    // Project Filtering
    initProjectFilter();
    
    // Active Navigation Link
    initActiveNavLink();
    
    // Form Submission
    initContactForm();
});

// Theme Toggle
function initThemeToggle() {
    const themeSwitch = document.getElementById('theme-switch');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use the system preference
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Set the initial theme
    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    } else {
        document.body.removeAttribute('data-theme');
    }
    
    // Toggle theme on button click
    themeSwitch.addEventListener('click', function() {
        let theme;
        
        if (document.body.getAttribute('data-theme') === 'dark') {
            document.body.removeAttribute('data-theme');
            theme = 'light';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            theme = 'dark';
        }
        
        // Save the preference
        localStorage.setItem('theme', theme);
        
        // Add ripple effect on click
        addRippleEffect(themeSwitch);
    });
}

// Mobile Navigation Menu
function initMobileNav() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const nav = document.querySelector('nav');
    const navItems = document.querySelectorAll('nav ul li a');
    
    mobileNavToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        
        if (nav.classList.contains('active')) {
            mobileNavToggle.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Close menu when clicking on a nav item
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
}

// Scroll Animation
function initScrollAnimation() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Initial check for elements in viewport
    checkElementsInViewport();
    
    // Check on scroll
    window.addEventListener('scroll', function() {
        checkElementsInViewport();
    });
    
    function checkElementsInViewport() {
        animatedElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                el.classList.add('animate');
            }
        });
    }
}

// Project Filtering
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Show/hide projects based on filter
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || filter === category) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            // Add ripple effect on click
            addRippleEffect(this);
        });
    });
}

// Active Navigation Link
function initActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
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

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Show loading state
            const submitBtn = document.querySelector('.submit-btn');
            const originalContent = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Prepare form data for Google Sheets
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('subject', subject);
            formData.append('message', message);
            formData.append('timestamp', new Date().toLocaleString());
            
            // Replace with your Google Apps Script URL (the one you'll get after deployment)
            const scriptURL = 'https://script.google.com/macros/s/AKfycbzzV2yUb6lQqS_czK0A9DVugQukh4zJMz_lVNTotwkyO3LTod7D8kTLnMUK0bClkM9S5g/exec';
            
            // Send data to Google Sheets
            fetch(scriptURL, { 
                method: 'POST', 
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    // Reset form
                    contactForm.reset();
                    
                    // Show success message
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    submitBtn.style.backgroundColor = '#28a745';
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                console.error('Error!', error.message);
                submitBtn.innerHTML = '<i class="fas fa-times"></i> Failed to Send';
                submitBtn.style.backgroundColor = '#dc3545';
            })
            .finally(() => {
                setTimeout(() => {
                    submitBtn.innerHTML = originalContent;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                }, 3000);
            });
        });
    }
}

// Ripple Effect Function
function addRippleEffect(element) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Typing Animation for Hero Section
window.addEventListener('load', function() {
    const highlightSpan = document.querySelector('.hero-content h1 .highlight');
    
    if (highlightSpan) {
        const highlightText = highlightSpan.textContent;
        const originalText = highlightText;
        
        // Start with empty text
        highlightSpan.textContent = '';
        
        // Add typing animation for name
        let i = 0;
        const typeInterval = setInterval(function() {
            if (i < originalText.length) {
                highlightSpan.textContent += originalText.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                
                // Add blinking cursor effect
                const cursor = document.createElement('span');
                cursor.classList.add('cursor');
                cursor.textContent = '|';
                highlightSpan.appendChild(cursor);
                
                setTimeout(() => {
                    if (cursor.parentNode === highlightSpan) {
                        cursor.remove();

                        // Remove highlight styling
                        highlightSpan.style.backgroundColor = 'transparent';
                        highlightSpan.style.color = ''; // Reset to default text color if needed
                    }
                }, 1500);
            }
        }, 100);
    }
});

// Parallax Effect for Tech Stack
window.addEventListener('mousemove', function(e) {
    const techStack = document.querySelector('.tech-stack');
    
    if (techStack) {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        
        techStack.style.transform = `perspective(800px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    }
});

// Add some additional CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .cursor {
        animation: blink 1s infinite;
    }
    
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }
`;
document.head.appendChild(style);


// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    function toggleNav() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }

    function closeNav() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }

    // Toggle navigation when hamburger is clicked
    if (hamburger) {
        hamburger.addEventListener('click', toggleNav);
    }

    // Close navigation when a nav link is clicked (mobile)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // Close navigation when clicking outside (mobile)
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
            closeNav();
        }
    });

    // Close navigation on window resize (desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeNav();
        }
    });
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add loading animation for external links
document.addEventListener('DOMContentLoaded', function() {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Add a small loading indicator for external links
            const originalText = this.textContent;
            if (this.classList.contains('btn')) {
                this.style.opacity = '0.7';
                this.style.pointerEvents = 'none';
                
                // Reset after a short delay
                setTimeout(() => {
                    this.style.opacity = '1';
                    this.style.pointerEvents = 'auto';
                }, 1000);
            }
        });
    });
});

// Intersection Observer for fade-in animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.research-card, .project-card, .publication-item, .focus-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// Copy to clipboard functionality for research links
document.addEventListener('DOMContentLoaded', function() {
    // Add copy buttons for important links
    const importantLinks = document.querySelectorAll('a[href*="github.com"], a[href*="zenodo.org"]');
    
    importantLinks.forEach(link => {
        // Add a data attribute to mark as copyable
        link.setAttribute('data-copyable', 'true');
        
        // Add double-click to copy functionality
        link.addEventListener('dblclick', function(e) {
            e.preventDefault();
            const url = this.href;
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(() => {
                    showCopyFeedback(this);
                });
            }
        });
    });
});

function showCopyFeedback(element) {
    const originalText = element.textContent;
    element.textContent = 'Copied!';
    element.style.background = '#27ae60';
    
    setTimeout(() => {
        element.textContent = originalText;
        element.style.background = '';
    }, 1500);
}

// Enhanced accessibility features
document.addEventListener('DOMContentLoaded', function() {
    // Add skip to content link for screen readers
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main landmark if it doesn't exist
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main';
    }
});

// Performance optimization: Lazy load images if any are added later
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Error handling for external resources
window.addEventListener('error', function(e) {
    console.warn('Resource failed to load:', e.target);
    
    // Graceful fallback for failed external links
    if (e.target.tagName === 'A' && e.target.href.includes('github.com')) {
        e.target.style.opacity = '0.6';
        e.target.title = 'This link may require network access';
    }
});

// Analytics placeholder (ready for implementation)
function trackEvent(category, action, label) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', category, action, label);
    
    // Example integration point for Google Analytics
    // gtag('event', action, {
    //     event_category: category,
    //     event_label: label
    // });
}

// Track important interactions
document.addEventListener('DOMContentLoaded', function() {
    // Track external link clicks
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function() {
            const href = this.href;
            if (href.includes('github.com')) {
                trackEvent('External Link', 'Click', 'GitHub Repository');
            } else if (href.includes('zenodo.org')) {
                trackEvent('External Link', 'Click', 'Zenodo Preprint');
            }
        });
    });
    
    // Track navigation usage
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('Navigation', 'Click', this.textContent.trim());
        });
    });
});
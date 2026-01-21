// ============================================
// GIF Data and Labels
// ============================================

const gifSamples = Array.from({length: 36}, (_, i) => `gif/gif${i + 1}.gif`);

const labels = [
    "Self pleasure", "She’s such a tease, you could look at her all day, this view makes your mouth water", "Make her squirt", "Let me make you feel good", "Octavia Red big bouncing boobs",
  "Ripping her ass apart", "Pounding a blonde teen doggystyle", "Do You Like Pool Sex?", "I need someone who likes my honey like that",
  "Cumshot on Nerd", "Amazing ass", "There is still room for one more!", "Sexy Amateur Babe Enjoying a Quickie", "Her boss’s favorite",
  "Teen Cindy Shine gets fucked", "The Perfect Valentine’s", "Anal Cowgirl in Stockings", "Brunette two teens sucks big dick",
  "Ginger teen gets messy facial", "She loves a cock in all her pretty face", "Warming up your ass for what comes next", "Finishing touches & a happy ending",
  "When she is alone at home", "Doggystyle fuck with Amia Miley", "It’s mesmerizing to look at", "Licking that pussy lips feels just nice", "I love her itty bitty titties and how she moves",
  "Madison Ivy sucking cock with passion", "Licking good wet pussy is just so nice", "Naked chick sucking dick", "She is just smashing it in there", "Megan receiving bbc anal doggystyle",
  "Two sisters blowjob", "Ride and grind that big cock", "Adriana Chechik gets demolished by huge dick", "Hot Anal Sex with a Sexy Teen Brunette"
];

const videoURL = 'https://cdn.veporn.com/a-ray-of-cock-sucking-shine-4k.mp4';

// ============================================
// Generate GIF Grid
// ============================================

function generateGIFGrid() {
    const gifGrid = document.querySelector('.gif-grid');
    if (!gifGrid) return;

    for (let i = 0; i < 36; i++) {
        const gifURL = gifSamples[i % gifSamples.length];
        const container = document.createElement('div');
        container.className = 'gif-container';
        
        container.innerHTML = `
            <div class="gif-card">
                <div class="skeleton-loader"></div>
                <img src="${gifURL}" alt="${labels[i]}" class="gif-image" ${i >= 9 ? 'loading="lazy"' : ''} decoding="async" data-video="${videoURL}">
            </div>
            <div class="gif-text">${labels[i]}</div>
        `;
        
        // Add click handler for video playback
        const img = container.querySelector('.gif-image');
        img.addEventListener('click', () => playVideo(videoURL));
        
        gifGrid.appendChild(container);
    }
}

// ============================================
// Video Player Functionality
// ============================================

function playVideo(videoSrc) {
    const videoOverlay = document.getElementById('videoOverlay');
    const videoPlayer = document.getElementById('videoPlayer');
    const closeBtn = document.querySelector('.close-video-btn');
    
    if (!videoOverlay || !videoPlayer) return;
    
    videoPlayer.src = videoSrc;
    videoOverlay.style.display = 'flex';
    videoPlayer.play().catch(err => {
        console.error('Error playing video:', err);
    });
    
    // Close on button click
    if (closeBtn) {
        closeBtn.onclick = function() {
            videoPlayer.pause();
            videoPlayer.src = '';
            videoOverlay.style.display = 'none';
        };
    }
    
    // Close on overlay click (outside video)
    videoOverlay.onclick = function(e) {
        if (e.target === videoOverlay) {
            videoPlayer.pause();
            videoPlayer.src = '';
            videoOverlay.style.display = 'none';
        }
    };
    
    // Close on Escape key
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            videoPlayer.pause();
            videoPlayer.src = '';
            videoOverlay.style.display = 'none';
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

// ============================================
// Performance Optimizations
// ============================================

// Throttle function for scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// Parallax Scrolling Effect
// ============================================

function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.3; // Different speeds for each layer
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
        
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    // Use passive listener for better performance
    window.addEventListener('scroll', requestTick, { passive: true });
}

// ============================================
// Image Loading & Skeleton Loader Management
// ============================================

function initImageLoading() {
    const images = document.querySelectorAll('.gif-image');
    
    // Preload first row (first 9 images)
    const firstRowImages = Array.from(images).slice(0, 9);
    firstRowImages.forEach(img => {
        if (img.complete) {
            handleImageLoad(img);
        } else {
            img.addEventListener('load', () => handleImageLoad(img));
            img.addEventListener('error', () => handleImageError(img));
        }
    });

    // Use Intersection Observer for lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const card = img.closest('.gif-card');
                const skeleton = card ? card.querySelector('.skeleton-loader') : null;
                
                // Load image if not already loaded
                if (!img.classList.contains('loaded')) {
                    if (img.complete) {
                        handleImageLoad(img);
                    } else {
                        img.addEventListener('load', () => handleImageLoad(img));
                        img.addEventListener('error', () => handleImageError(img));
                    }
                }
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px' // Start loading 50px before image enters viewport
    });

    // Observe all images
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

function handleImageLoad(img) {
    img.classList.add('loaded');
    const card = img.closest('.gif-card');
    const skeleton = card ? card.querySelector('.skeleton-loader') : null;
    if (skeleton) {
        skeleton.classList.add('hidden');
    }
}

function handleImageError(img) {
    const card = img.closest('.gif-card');
    const skeleton = card ? card.querySelector('.skeleton-loader') : null;
    if (skeleton) {
        skeleton.classList.add('hidden');
    }
    // Optionally add error state styling
    if (card) {
        card.style.opacity = '0.5';
    }
}

// ============================================
// Smooth Scroll Animations
// ============================================

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.gif-container');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// Pink Lips Animation Controller
// ============================================

function initPinkLips() {
    const lips = document.querySelectorAll('.lip');
    
    // Adjust quantity based on viewport size
    function adjustLipsForViewport() {
        const width = window.innerWidth;
        if (width < 992) {
            // Hide on tablets and mobile
            lips.forEach(lip => {
                lip.style.display = 'none';
            });
        } else {
            // Show on desktop
            lips.forEach(lip => {
                lip.style.display = 'block';
            });
        }
    }
    
    // Initial adjustment
    adjustLipsForViewport();
    
    // Adjust on resize (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(adjustLipsForViewport, 250);
    });
}

// ============================================
// Initialize Everything
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Generate GIF grid first
    generateGIFGrid();
    
    // Then initialize other features
    initParallax();
    initImageLoading();
    initScrollAnimations();
    initPinkLips();
    
    // Add loaded class to body for any CSS that depends on it
    document.body.classList.add('loaded');
});

// ============================================
// Performance: Preload Critical Resources
// ============================================

// Preload first visible images
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const firstImages = document.querySelectorAll('.gif-image');
        Array.from(firstImages).slice(0, 9).forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    });
} else {
    const firstImages = document.querySelectorAll('.gif-image');
    Array.from(firstImages).slice(0, 9).forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    });
}

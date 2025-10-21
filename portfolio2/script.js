// Enhanced Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const themeToggle = document.getElementById('themeToggle');
    const navItems = document.querySelectorAll('.nav-link');
    
    // Create mobile menu overlay
    const mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-menu-overlay';
    document.body.appendChild(mobileOverlay);

    // Mobile Navigation Toggle
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    }

    // Close mobile menu
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Hamburger click event
    hamburger.addEventListener('click', toggleMobileMenu);

    // Overlay click event
    mobileOverlay.addEventListener('click', closeMobileMenu);

    // Close mobile menu when clicking on nav links
    navItems.forEach(link => {
        link.addEventListener('click', (e) => {
            // Update active state
            navItems.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
            
            // Close mobile menu
            closeMobileMenu();
            
            // Smooth scroll to section
            const targetId = link.getAttribute('href');
            if (targetId && targetId !== '#') {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Header scroll effect
    function handleScroll() {
        if (window.scrollY > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }

        // Update active nav link based on scroll position
        updateActiveNavLink();
    }

    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;
        
        navItems.forEach(link => {
            const section = document.querySelector(link.getAttribute('href'));
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionBottom = sectionTop + sectionHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    navItems.forEach(item => item.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.dataset.theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.dataset.theme = newTheme;
        localStorage.setItem('theme', newTheme);
        
        // Update Three.js particles color if initialized
        updateParticlesColor(newTheme);
    });

    // Update Three.js particles color based on theme
    function updateParticlesColor(theme) {
        if (window.particlesMaterial) {
            window.particlesMaterial.color.set(theme === 'dark' ? 0x8b85ff : 0x6c63ff);
        }
    }

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.dataset.theme = savedTheme;

    // Mobile viewport fix
    function fixViewport() {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (window.innerWidth <= 768) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        } else {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
        }
    }

    // Handle orientation changes
    function handleOrientation() {
        setTimeout(fixViewport, 100);
        handleResize();
    }

    // Handle window resize
    function handleResize() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
        
        // Fix contact form layout on mobile
        fixContactFormLayout();
        
        // Reinitialize animations on resize
        initScrollAnimations();
    }

    // Fix contact form layout for mobile
    function fixContactFormLayout() {
        const contactContent = document.querySelector('.contact-content');
        const contactForm = document.querySelector('.contact-form');
        const contactInfo = document.querySelector('.contact-info');
        
        if (window.innerWidth <= 768) {
            if (contactContent) {
                contactContent.classList.add('mobile-stack');
            }
            if (contactForm) {
                contactForm.classList.add('mobile-full-width');
            }
            if (contactInfo) {
                contactInfo.classList.add('mobile-full-width');
            }
        } else {
            if (contactContent) {
                contactContent.classList.remove('mobile-stack');
            }
            if (contactForm) {
                contactForm.classList.remove('mobile-full-width');
            }
            if (contactInfo) {
                contactInfo.classList.remove('mobile-full-width');
            }
        }
    }

    // Initialize scroll animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        document.querySelectorAll('.timeline-card, .experience-card, .project-card, .activity-card, .contact-card, .form-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }

    // Fix form input issues on mobile
    function fixFormInputs() {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Prevent zoom on focus in iOS
            input.addEventListener('focus', function() {
                if (window.innerWidth <= 768) {
                    this.style.fontSize = '16px';
                }
            });
            
            // Restore font size on blur
            input.addEventListener('blur', function() {
                this.style.fontSize = '';
            });
        });
    }

    // Prevent horizontal scrolling
    function preventHorizontalScroll() {
        document.body.style.overflowX = 'hidden';
        document.documentElement.style.overflowX = 'hidden';
    }

    // Event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientation);
    window.addEventListener('load', function() {
        fixViewport();
        fixContactFormLayout();
        fixFormInputs();
        preventHorizontalScroll();
        initScrollAnimations();
    });

    // Initialize
    handleScroll();
    fixViewport();
});

// Initialize EmailJS
emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual EmailJS public key

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const contactForm = document.getElementById('contactForm');
const activityCards = document.querySelectorAll('.activity-card');
const modal = document.getElementById('activityModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const codeContent = document.getElementById('codeContent');
const demoFrame = document.getElementById('demoFrame');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

// Activity Data
const activityData = {
    1: {
        title: "Portfolio",
        code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Portfolio</title>
    <style>
        /* CSS code for Activity 1 */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        
        .container {
            width: 80%;
            margin: auto;
            overflow: hidden;
        }
        
        /* More CSS styles... */
    </style>
</head>
<body>
    <!-- HTML structure for Activity 1 -->
    <header>
        <div class="container">
            <h1>My Portfolio</h1>
            <nav>
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#projects">Projects</a></li>
                </ul>
            </nav>
        </div>
    </header>
    
    <main>
        <!-- Main content for Activity 1 -->
    </main>
    
    <script>
        // JavaScript for Activity 1
        console.log("Portfolio loaded successfully!");
    </script>
</body>
</html>`,
        demo: "activity1/index.html"
    },
    2: {
        title: "Card with Hover Effect",
        code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Card with Hover Effect</title>
    <style>
        .card {
            width: 300px;
            padding: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            margin: 20px auto;
        }
        
        .card:hover {
            transform: translateY(-10px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        
        .card h3 {
            margin-top: 0;
            color: #333;
        }
        
        .card p {
            color: #666;
            line-height: 1.5;
        }
        
        .hidden-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.5s ease;
        }
        
        .card:hover .hidden-content {
            max-height: 200px;
        }
    </style>
</head>
<body>
    <div class="card">
        <h3>Interactive Card</h3>
        <p>This card has a hover effect that lifts it up and reveals hidden content.</p>
        <div class="hidden-content">
            <p>This content is revealed when you hover over the card!</p>
            <button>Learn More</button>
        </div>
    </div>
    
    <script>
        // Additional JavaScript for card functionality
        document.addEventListener('DOMContentLoaded', function() {
            const card = document.querySelector('.card');
            
            card.addEventListener('mouseenter', function() {
                console.log('Card hovered');
            });
            
            card.addEventListener('mouseleave', function() {
                console.log('Card left');
            });
        });
    </script>
</body>
</html>`,
        demo: "activity2/index.html"
    },
    3: {
        title: "Dark Mode",
        code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dark Mode Example</title>
    <style>
        :root {
            --bg-color: #ffffff;
            --text-color: #333333;
            --card-bg: #f8f9fa;
        }
        
        .dark-mode {
            --bg-color: #121212;
            --text-color: #f8f9fa;
            --card-bg: #1e1e1e;
        }
        
        body {
            background-color: var(--bg-color);
            color: var(--text-color);
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            transition: background-color 0.3s, color 0.3s;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .card {
            background: var(--card-bg);
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .toggle-container {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
            margin-right: 10px;
        }
        
        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
        }
        
        .slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        
        input:checked + .slider {
            background-color: #2196F3;
        }
        
        input:checked + .slider:before {
            transform: translateX(26px);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="toggle-container">
            <label class="toggle-switch">
                <input type="checkbox" id="darkModeToggle">
                <span class="slider"></span>
            </label>
            <span>Dark Mode</span>
        </div>
        
        <div class="card">
            <h1>Dark Mode Example</h1>
            <p>This page demonstrates how to implement a dark mode feature using CSS variables and JavaScript.</p>
            <p>Toggle the switch above to change between light and dark themes.</p>
        </div>
        
        <div class="card">
            <h2>How it works</h2>
            <p>The dark mode functionality is achieved by:</p>
            <ul>
                <li>Defining CSS variables for both themes</li>
                <li>Adding a class to the body element when dark mode is active</li>
                <li>Using JavaScript to toggle the class and save the user's preference</li>
            </ul>
        </div>
    </div>
    
    <script>
        const darkModeToggle = document.getElementById('darkModeToggle');
        const body = document.body;
        
        // Check for saved theme preference or respect OS preference
        if (localStorage.getItem('theme') === 'dark' || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme'))) {
            body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }
        
        // Toggle dark mode
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
        });
    </script>
</body>
</html>`,
        demo: "activity3/index.html"
    },
    4: {
        title: "Toggle Dark Mode",
        code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Toggle Dark Mode</title>
    <style>
        :root {
            --primary-color: #6c63ff;
            --bg-color: #ffffff;
            --text-color: #333333;
            --card-bg: #f8f9fa;
            --border-color: #e9ecef;
        }
        
        [data-theme="dark"] {
            --primary-color: #8b85ff;
            --bg-color: #121212;
            --text-color: #f8f9fa;
            --card-bg: #1e1e1e;
            --border-color: #343a40;
        }
        
        body {
            background-color: var(--bg-color);
            color: var(--text-color);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            transition: background-color 0.3s, color 0.3s;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .theme-toggle {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-bottom: 30px;
        }
        
        .toggle-btn {
            background: var(--card-bg);
            border: 2px solid var(--border-color);
            border-radius: 30px;
            padding: 8px 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .toggle-btn:hover {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }
        
        .card {
            background: var(--card-bg);
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            border: 1px solid var(--border-color);
        }
        
        h1 {
            color: var(--primary-color);
            margin-bottom: 20px;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        
        .feature {
            background: var(--bg-color);
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid var(--border-color);
        }
        
        .feature i {
            font-size: 24px;
            color: var(--primary-color);
            margin-bottom: 10px;
        }
    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="container">
        <div class="theme-toggle">
            <button class="toggle-btn" id="themeToggle">
                <i class="fas fa-moon"></i>
                <span>Dark Mode</span>
            </button>
        </div>
        
        <div class="card">
            <h1>Toggle Dark Mode</h1>
            <p>This enhanced dark mode implementation includes a toggle button with icon and text that changes based on the current theme.</p>
            <p>The theme preference is saved in localStorage so it persists between page visits.</p>
        </div>
        
        <div class="card">
            <h2>Features</h2>
            <div class="feature-grid">
                <div class="feature">
                    <i class="fas fa-palette"></i>
                    <h3>Color Variables</h3>
                    <p>Uses CSS custom properties for easy theming</p>
                </div>
                <div class="feature">
                    <i class="fas fa-save"></i>
                    <h3>Persistent</h3>
                    <p>Saves user preference in localStorage</p>
                </div>
                <div class="feature">
                    <i class="fas fa-toggle-on"></i>
                    <h3>Toggle Button</h3>
                    <p>Interactive button with dynamic text</p>
                </div>
                <div class="feature">
                    <i class="fas fa-magic"></i>
                    <h3>Smooth Transitions</h3>
                    <p>Pleasant color transitions between themes</p>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        const toggleIcon = themeToggle.querySelector('i');
        const toggleText = themeToggle.querySelector('span');
        
        // Initialize theme
        function initTheme() {
            const savedTheme = localStorage.getItem('theme');
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
                body.setAttribute('data-theme', 'dark');
                toggleIcon.className = 'fas fa-sun';
                toggleText.textContent = 'Light Mode';
            } else {
                body.removeAttribute('data-theme');
                toggleIcon.className = 'fas fa-moon';
                toggleText.textContent = 'Dark Mode';
            }
        }
        
        // Toggle theme
        function toggleTheme() {
            if (body.getAttribute('data-theme') === 'dark') {
                body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                toggleIcon.className = 'fas fa-moon';
                toggleText.textContent = 'Dark Mode';
            } else {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                toggleIcon.className = 'fas fa-sun';
                toggleText.textContent = 'Light Mode';
            }
        }
        
        // Initialize on page load
        document.addEventListener('DOMContentLoaded', initTheme);
        
        // Add event listener to toggle button
        themeToggle.addEventListener('click', toggleTheme);
    </script>
</body>
</html>`,
        demo: "activity4/index.html"
    },
    5: {
        title: "Grocery List",
        code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Grocery List</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #6c63ff, #ff6584);
            min-height: 100vh;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            padding: 30px;
            width: 100%;
            max-width: 500px;
        }
        
        h1 {
            text-align: center;
            margin-bottom: 25px;
            color: #333;
        }
        
        .input-group {
            display: flex;
            margin-bottom: 20px;
        }
        
        #itemInput {
            flex: 1;
            padding: 12px 15px;
            border: 2px solid #e9ecef;
            border-radius: 8px 0 0 8px;
            font-size: 16px;
            outline: none;
            transition: border-color 0.3s;
        }
        
        #itemInput:focus {
            border-color: #6c63ff;
        }
        
        #addBtn {
            background: #6c63ff;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 0 8px 8px 0;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: background 0.3s;
        }
        
        #addBtn:hover {
            background: #5a52d5;
        }
        
        .controls {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .control-btn {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s;
        }
        
        #highlightBtn {
            background: #ffc107;
            color: #333;
        }
        
        #highlightBtn:hover {
            background: #e0a800;
        }
        
        #removeBtn {
            background: #dc3545;
            color: white;
        }
        
        #removeBtn:hover {
            background: #c82333;
        }
        
        #clearBtn {
            background: #6c757d;
            color: white;
        }
        
        #clearBtn:hover {
            background: #5a6268;
        }
        
        #groceryList {
            list-style: none;
            max-height: 300px;
            overflow-y: auto;
        }
        
        .grocery-item {
            display: flex;
            align-items: center;
            padding: 12px 15px;
            border-bottom: 1px solid #e9ecef;
            transition: background 0.3s;
            animation: fadeIn 0.3s ease;
        }
        
        .grocery-item:last-child {
            border-bottom: none;
        }
        
        .grocery-item:hover {
            background: #f8f9fa;
        }
        
        .grocery-item.highlighted {
            background: #fff3cd;
            font-weight: 600;
        }
        
        .item-text {
            flex: 1;
        }
        
        .delete-btn {
            background: none;
            border: none;
            color: #dc3545;
            cursor: pointer;
            font-size: 16px;
            padding: 5px;
            border-radius: 4px;
            transition: background 0.3s;
        }
        
        .delete-btn:hover {
            background: rgba(220, 53, 69, 0.1);
        }
        
        .empty-state {
            text-align: center;
            padding: 30px;
            color: #6c757d;
        }
        
        .empty-state i {
            font-size: 48px;
            margin-bottom: 15px;
            opacity: 0.5;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Scrollbar styling */
        #groceryList::-webkit-scrollbar {
            width: 6px;
        }
        
        #groceryList::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }
        
        #groceryList::-webkit-scrollbar-thumb {
            background: #c5c5c5;
            border-radius: 3px;
        }
        
        #groceryList::-webkit-scrollbar-thumb:hover {
            background: #a5a5a5;
        }
    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="container">
        <h1><i class="fas fa-shopping-cart"></i> Grocery List</h1>
        
        <div class="input-group">
            <input type="text" id="itemInput" placeholder="Add an item...">
            <button id="addBtn">Add</button>
        </div>
        
        <div class="controls">
            <button class="control-btn" id="highlightBtn">Highlight Last</button>
            <button class="control-btn" id="removeBtn">Remove Last</button>
            <button class="control-btn" id="clearBtn">Clear All</button>
        </div>
        
        <ul id="groceryList">
            <li class="empty-state">
                <i class="fas fa-shopping-basket"></i>
                <p>Your grocery list is empty</p>
                <p>Add some items to get started!</p>
            </li>
        </ul>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const itemInput = document.getElementById('itemInput');
            const addBtn = document.getElementById('addBtn');
            const groceryList = document.getElementById('groceryList');
            const highlightBtn = document.getElementById('highlightBtn');
            const removeBtn = document.getElementById('removeBtn');
            const clearBtn = document.getElementById('clearBtn');
            const emptyState = document.querySelector('.empty-state');
            
            // Load items from localStorage
            let items = JSON.parse(localStorage.getItem('groceryItems')) || [];
            
            // Render items
            function renderItems() {
                groceryList.innerHTML = '';
                
                if (items.length === 0) {
                    groceryList.appendChild(emptyState.cloneNode(true));
                    return;
                }
                
                items.forEach((item, index) => {
                    const li = document.createElement('li');
                    li.className = 'grocery-item';
                    if (item.highlighted) {
                        li.classList.add('highlighted');
                    }
                    
                    li.innerHTML = \`
                        <span class="item-text">\${item.text}</span>
                        <button class="delete-btn" data-index="\${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    \`;
                    
                    groceryList.appendChild(li);
                });
                
                // Add event listeners to delete buttons
                document.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const index = parseInt(this.getAttribute('data-index'));
                        removeItem(index);
                    });
                });
            }
            
            // Add new item
            function addItem() {
                const text = itemInput.value.trim();
                
                if (text === '') {
                    alert('Please enter an item');
                    return;
                }
                
                items.push({
                    text: text,
                    highlighted: false
                });
                
                saveItems();
                renderItems();
                itemInput.value = '';
                itemInput.focus();
            }
            
            // Remove item by index
            function removeItem(index) {
                items.splice(index, 1);
                saveItems();
                renderItems();
            }
            
            // Highlight last item
            function highlightLastItem() {
                if (items.length === 0) {
                    alert('No items to highlight');
                    return;
                }
                
                // Remove highlight from all items
                items.forEach(item => {
                    item.highlighted = false;
                });
                
                // Highlight last item
                items[items.length - 1].highlighted = true;
                
                saveItems();
                renderItems();
            }
            
            // Remove last item
            function removeLastItem() {
                if (items.length === 0) {
                    alert('No items to remove');
                    return;
                }
                
                items.pop();
                saveItems();
                renderItems();
            }
            
            // Clear all items
            function clearAllItems() {
                if (items.length === 0) {
                    alert('List is already empty');
                    return;
                }
                
                if (confirm('Are you sure you want to clear all items?')) {
                    items = [];
                    saveItems();
                    renderItems();
                }
            }
            
            // Save items to localStorage
            function saveItems() {
                localStorage.setItem('groceryItems', JSON.stringify(items));
            }
            
            // Event listeners
            addBtn.addEventListener('click', addItem);
            
            itemInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    addItem();
                }
            });
            
            highlightBtn.addEventListener('click', highlightLastItem);
            removeBtn.addEventListener('click', removeLastItem);
            clearBtn.addEventListener('click', clearAllItems);
            
            // Initial render
            renderItems();
        });
    </script>
</body>
</html>`,
        demo: "activity5/index.html"
    }
};

// Contact Form
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            from_name: document.getElementById('name').value,
            from_email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Send email using EmailJS
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
            .then((response) => {
                alert('Message sent successfully!');
                contactForm.reset();
                
                // Close keyboard on mobile after submission
                if (window.innerWidth <= 768) {
                    document.activeElement.blur();
                }
            }, (error) => {
                alert('Failed to send message. Please try again.');
                console.error('EmailJS Error:', error);
            });
    });
}

// Modal functionality for lab activities
activityCards.forEach(card => {
    const viewCodeBtn = card.querySelector('.view-code-btn');
    const viewDemoBtn = card.querySelector('.view-demo-btn');
    const activityId = card.getAttribute('data-activity');
    
    if (viewCodeBtn) {
        viewCodeBtn.addEventListener('click', () => {
            openModal(activityId, 'code');
        });
    }
    
    if (viewDemoBtn) {
        viewDemoBtn.addEventListener('click', () => {
            openModal(activityId, 'demo');
        });
    }
});

// Open modal with activity content
function openModal(activityId, tab) {
    const activity = activityData[activityId];
    
    if (!activity) {
        alert('Activity data not found');
        return;
    }
    
    modalTitle.textContent = activity.title;
    codeContent.textContent = activity.code;
    demoFrame.src = activity.demo;
    
    // Set active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tab) {
            btn.classList.add('active');
        }
    });
    
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === `${tab}Tab`) {
            pane.classList.add('active');
        }
    });
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Adjust modal for mobile
    if (window.innerWidth <= 768) {
        modal.style.padding = '10px';
    }
}

// Close modal
closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Tab switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        
        // Update active tab button
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active tab pane
        tabPanes.forEach(pane => pane.classList.remove('active'));
        document.getElementById(`${tab}Tab`).classList.add('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced Three.js initialization with theme support
function initThreeJS() {
    if (typeof THREE === 'undefined') return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    document.getElementById('three-bg').appendChild(renderer.domElement);
    
    // Create particles with better distribution
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = window.innerWidth < 768 ? 800 : 1500; // Reduce particles on mobile
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
        
        // Add some color variation
        if (i % 3 === 0) {
            colorArray[i] = Math.random() * 0.3 + 0.7; // Red
        } else if (i % 3 === 1) {
            colorArray[i] = Math.random() * 0.3 + 0.5; // Green
        } else {
            colorArray[i] = Math.random() * 0.3 + 0.9; // Blue
        }
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    // Material with vertex colors
    const particlesMaterial = new THREE.PointsMaterial({
        size: window.innerWidth < 768 ? 0.025 : 0.015, // Larger particles on mobile
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
    });
    
    // Set initial color based on theme
    const currentTheme = document.body.dataset.theme || 'light';
    particlesMaterial.color.set(currentTheme === 'dark' ? 0x8b85ff : 0x6c63ff);
    
    // Store material globally for theme updates
    window.particlesMaterial = particlesMaterial;
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    camera.position.z = 8;
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Touch interaction for mobile
    document.addEventListener('touchmove', (event) => {
        if (event.touches.length > 0) {
            mouseX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
        }
    });
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        // Smooth rotation based on mouse position
        targetRotationX = mouseY * 0.0005;
        targetRotationY = mouseX * 0.0005;
        
        particlesMesh.rotation.x += (targetRotationX - particlesMesh.rotation.x) * 0.05;
        particlesMesh.rotation.y += (targetRotationY - particlesMesh.rotation.y) * 0.05;
        
        // Add subtle automatic rotation
        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += 0.0005;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Performance optimization for mobile
        if (window.innerWidth < 768) {
            particlesMaterial.size = 0.025;
        } else {
            particlesMaterial.size = 0.015;
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    window.cleanupThreeJS = function() {
        window.removeEventListener('resize', handleResize);
        const threeBg = document.getElementById('three-bg');
        if (threeBg) {
            threeBg.innerHTML = '';
        }
    };
}

// Initialize Three.js
if (typeof THREE !== 'undefined') {
    // Only initialize on desktop for better performance, but with mobile support
    if (window.innerWidth >= 768) {
        initThreeJS();
    } else {
        // Lightweight alternative for mobile
        const threeBg = document.getElementById('three-bg');
        if (threeBg) {
            threeBg.style.background = 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)';
            threeBg.style.opacity = '0.1';
        }
    }
    
    // Reinitialize on resize to desktop
    window.addEventListener('resize', function() {
        const threeBg = document.getElementById('three-bg');
        if (window.innerWidth >= 768 && threeBg && threeBg.children.length === 0) {
            initThreeJS();
        } else if (window.innerWidth < 768 && threeBg && threeBg.children.length > 0) {
            window.cleanupThreeJS?.();
            threeBg.style.background = 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)';
            threeBg.style.opacity = '0.1';
        }
    });
}
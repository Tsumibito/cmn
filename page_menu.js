document.addEventListener('DOMContentLoaded', () => {
    // Language buttons
    const langButtonFrMain = document.getElementById('lang_button_fr');
    const langButtonEnMain = document.getElementById('lang_button_en');
    const langButtonFrModal = document.getElementById('lang_button__fr');
    const langButtonEnModal = document.getElementById('lang_button__en');
    
    // Other elements
    const navbarButton = document.getElementById('Navbar_button');
    const topLine = document.getElementById('Top_line');
    const middleLine = document.getElementById('Middle_line');
    const bottomLine = document.getElementById('Bottom_line');
    const navbarMenu = document.getElementById('NavbarMenu');
    const startButton = document.getElementById('Start_button');
    const ageVerificationDiv = document.getElementById('index_sec_div');

    // Ensure all elements are present
    if (!navbarButton || !topLine || !middleLine || !bottomLine || !navbarMenu || 
        !startButton || !ageVerificationDiv || !langButtonFrMain || 
        !langButtonEnMain || !langButtonFrModal || !langButtonEnModal) {
        console.error('One or more required elements are missing on the page.');
        return;
    }

    // Check localStorage availability
    const isLocalStorageAvailable = () => {
        try {
            const testKey = '__test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    };

    // Store original colors
    const originalTopColor = window.getComputedStyle(topLine).backgroundColor;
    const originalMiddleColor = window.getComputedStyle(middleLine).backgroundColor;
    const originalBottomColor = window.getComputedStyle(bottomLine).backgroundColor;

    let isMenuOpen = false;
    let isAnimating = false;

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Setup language buttons based on current URL
    const setupLanguageButtons = () => {
        const currentURL = window.location.href;
        const url = new URL(currentURL);
        const pathname = url.pathname.endsWith('/') ? url.pathname.slice(0, -1) : url.pathname;
        const origin = url.origin;

        const isEnglish = currentURL.includes('/en/');

        let frURL, enURL;

        if (isEnglish) {
            frURL = currentURL.replace('/en/', '/');
            enURL = currentURL;
        } else {
            enURL = `${origin}/en${pathname}`;
            frURL = currentURL;
        }

        langButtonFrMain.href = frURL;
        langButtonEnMain.href = enURL;
        langButtonFrModal.href = frURL;
        langButtonEnModal.href = enURL;
    };

    setupLanguageButtons();

    // Set transitions for navbar lines
    [topLine, middleLine, bottomLine].forEach(line => {
        line.style.transition = 'background-color 0.1s ease, transform 0.3s ease, width 0.3s ease, opacity 0.3s ease';
    });

    // Initialize navbar menu styles
    navbarMenu.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    navbarMenu.style.opacity = '0';
    navbarMenu.style.transform = 'translateY(-100%)';
    navbarMenu.style.display = 'none';
    navbarMenu.style.pointerEvents = 'none';

    // Initialize age verification modal styles
    ageVerificationDiv.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    ageVerificationDiv.style.opacity = '0';
    ageVerificationDiv.style.transform = 'scale(1)';
    ageVerificationDiv.style.display = 'none';

    // Check age verification status
    const checkAgeVerification = () => {
        if (!isLocalStorageAvailable()) {
            console.warn('localStorage is not available. Age verification may not function correctly.');
            return;
        }

        const ageVerifiedData = localStorage.getItem('ageVerified');
        if (ageVerifiedData) {
            try {
                const { timestamp } = JSON.parse(ageVerifiedData);
                const currentTime = Date.now();
                const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

                if ((currentTime - timestamp) < sevenDaysInMs) {
                    ageVerificationDiv.style.display = 'none';
                    return;
                } else {
                    localStorage.removeItem('ageVerified');
                }
            } catch (error) {
                console.error('Error parsing ageVerified data:', error);
                localStorage.removeItem('ageVerified');
            }
        }
        showAgeVerification();
    };

    // Show age verification modal
    const showAgeVerification = () => {
        ageVerificationDiv.style.display = 'flex';
        requestAnimationFrame(() => {
            ageVerificationDiv.style.opacity = '1';
            ageVerificationDiv.style.transform = 'scale(1)';
        });
    };

    // Hide age verification modal
    const hideAgeVerification = async () => {
        ageVerificationDiv.style.opacity = '0';
        ageVerificationDiv.style.transform = 'scale(0.95)';
        await sleep(700);
        ageVerificationDiv.style.display = 'none';
    };

    checkAgeVerification();

    // Navbar hover animations
    navbarButton.addEventListener('mouseenter', async () => {
        if (isAnimating) return;
        await sleep(100);
        topLine.style.backgroundColor = '#FFFFFF';
        await sleep(100);
        middleLine.style.backgroundColor = '#FFFFFF';
        await sleep(100);
        bottomLine.style.backgroundColor = '#FFFFFF';
    });

    navbarButton.addEventListener('mouseleave', async () => {
        if (isAnimating) return;
        await sleep(200);
        topLine.style.backgroundColor = originalTopColor;
        await sleep(100);
        middleLine.style.backgroundColor = originalMiddleColor;
        await sleep(100);
        bottomLine.style.backgroundColor = originalBottomColor;
    });

    // Toggle navbar menu
    navbarButton.addEventListener('click', async (event) => {
        event.stopPropagation();

        if (isAnimating) return;
        isAnimating = true;

        if (!isMenuOpen) {
            isMenuOpen = true;

            middleLine.style.width = '0px';
            middleLine.style.opacity = '0';
            await sleep(300);

            topLine.style.transform = 'rotate(45deg) translateY(-6px)';
            bottomLine.style.transform = 'rotate(-45deg) translateY(6px)';
            await sleep(300);

            navbarMenu.style.display = 'flex';
            navbarMenu.style.pointerEvents = 'auto';
            setTimeout(() => {
                navbarMenu.style.opacity = '1';
                navbarMenu.style.transform = 'translateY(0)';
            }, 10);

            navbarButton.setAttribute('aria-expanded', 'true');
            navbarMenu.setAttribute('aria-hidden', 'false');
        } else {
            isMenuOpen = false;

            navbarMenu.style.opacity = '0';
            navbarMenu.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                navbarMenu.style.display = 'none';
                navbarMenu.style.pointerEvents = 'none';
            }, 300);

            topLine.style.transform = 'rotate(0deg) translateY(0px)';
            bottomLine.style.transform = 'rotate(0deg) translateY(0px)';
            await sleep(300);

            middleLine.style.width = '40px';
            middleLine.style.opacity = '1';

            navbarButton.setAttribute('aria-expanded', 'false');
            navbarMenu.setAttribute('aria-hidden', 'true');
        }

        isAnimating = false;
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (isMenuOpen && !navbarButton.contains(event.target) && !navbarMenu.contains(event.target)) {
            navbarButton.click();
        }
    });

    // Confirm age verification
    startButton.addEventListener('click', async (event) => {
        event.preventDefault();

        if (!isLocalStorageAvailable()) {
            console.warn('localStorage is not available. Cannot set age verification marker.');
            await hideAgeVerification();
            return;
        }

        const ageVerifiedData = {
            timestamp: Date.now()
        };
        localStorage.setItem('ageVerified', JSON.stringify(ageVerifiedData));

        await hideAgeVerification();
    });

    // Prevent language buttons from being intercepted by global event handlers
    const preventLanguageButtonInterference = (button) => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    };

    [langButtonFrMain, langButtonEnMain, langButtonFrModal, langButtonEnModal].forEach(button => {
        preventLanguageButtonInterference(button);
    });

});

/**
 * Interactive Birthday Celebration Website Script
 */

(function () {
    'use strict';

    let currentMode = 'dark';
    
    // --- Security / Lock Screen ---
    // User needs to enter this exact DOB to unlock.
    // Format: DD, MM, YYYY
    const secretDOB = { day: 8, month: 9, year: 2006 }; 
    let isUnlocked = false;

    // --- State Management ---
    const defaultData = {
        name: "My Beautiful Nisba Mirza",
        age: "another gorgeous year",
        letter: "My Dearest Nisba,\n\nHappy Birthday Meri Jaan! Aaj ke is khaas din par main tumhe ye batana chahta hoon ki tum mere liye kya maayne rakhti ho. Tum meri zindagi ki wo roshni ho jisne mere andhere rasto ko roshan kar diya hai.\n\nMain promise karta hoon ki zindagi ki kisi bhi situation mein, chahe achha waqt ho ya bura, main hamesha tumhara hath thame tumhare sath rahunga. Tumhari care karna, tumhe duniya ki har khushi dena meri sabse pehli priority hai. Mujhe nahi pata aage kya hoga, lekin ek promise karta hoon—chahe duniya idhar ki udhar ho jaye, main shadi sirf aur sirf tumse hi karunga.\n\nMain janta hoon ki main baaki sab se alag hoon, aur main hamesha koshish karunga ki tumhare liye is duniya ka sabse best insaan ban sakun. Tum jaisi pyari ladki ko koi ordinary insaan nahi milna chahiye, isliye main tumhare liye hamesha kuch extraordinary bankar dikhaunga.\n\nThank you meri zindagi mein aane ke liye. Tum mera aaj ho, aur mera aane wala har kal bhi tum hi ho. Happy Birthday to the queen of my heart! 🎂🎉💖",
        wishes: [
            "🎂 Wishing my beautiful Nisba Mirza the happiest birthday!",
            "✨ I love you to the moon and back!",
            "💖 You are my world!",
            "🌹 Thank you for being the best partner ever!"
        ]
    };

    const shayaris = {
        hindi: [
            "मेरी ज़िंदगी की सबसे खूबसूरत दुआ हो तुम,\nमेरे हर दर्द की मीठी सी दवा हो तुम।\nजन्मदिन मुबारक हो मेरी जान! ❤️",
            "तुम्हारे आने से ज़िंदगी महक उठी है,\nजैसे किसी वीराने में बहार आ गई हो।\nतुम्हारे बिना मैं कुछ भी नहीं।\nहैप्पी बर्थडे मेरी प्यारी निस्बा मिर्ज़ा। 🌸",
            "हर जन्म में तेरा ही साथ मिले,\nमेरे हाथों में तेरा ही हाथ मिले।\nमेरी दुनिया को इतनी खूबसूरत बनाने के लिए शुक्रिया! ✨"
        ],
        urdu: [
            "میری زندگی کی سب سے خوبصورت غزل ہو تم،\nمیری ہر دعا کا مکمل اثر ہو تم۔\nسالگرہ مبارک میری جان! 🌙",
            "تمہارے ساتھ ہر لمحہ ایک خواب جیسا ہے،\nمیری زندگی میں تمہارا ہونا کسی معجزے سے کم نہیں۔ 💕",
            "تم صرف میری ہم سفر نہیں، میری روح کا سکون ہو۔\nخدا تمہیں ہر خوشی دے۔ 🌹"
        ],
        english: [
            "You are not just my love;\n you are my greatest strength, my peace,\n and my beautiful forever.\n Happy Birthday, my love! 💖",
            "Every day with you is a beautiful addition to my life's journey.\n Thank you for being the most caring and supportive girl in the world. ✨",
            "I don't know what I did to deserve someone as amazing as you,\n but I will spend the rest of my life making sure you know how deeply you are loved. 🌹"
        ]
    };

    let currentLang = 'hindi';
    let currentShayariIndex = 0;
    let appData = { ...defaultData };

    // --- DOM Elements Cache ---
    const heroName = document.getElementById('heroName');
    const heroTagline = document.getElementById('heroTagline');
    const letterRecipient = document.getElementById('letterRecipient');
    const letterBody = document.getElementById('letterBody');
    const candlesRow = document.getElementById('candlesRow');
    const cakeStatus = document.getElementById('cakeStatus');
    const blowCandlesBtn = document.getElementById('blowCandlesBtn');
    const relightCandlesBtn = document.getElementById('relightCandlesBtn');
    const cutCakeBtn = document.getElementById('cutCakeBtn');
    const wishForm = document.getElementById('wishForm');
    const customWishInput = document.getElementById('customWishInput');
    const wishesStream = document.getElementById('wishesStream');
    const balloonContainer = document.getElementById('balloonContainer');
    const scrollCakeBtn = document.getElementById('scrollCakeBtn');
    const scrollShayariBtn = document.getElementById('scrollShayariBtn');
    const scrollLoveBtn = document.getElementById('scrollLoveBtn');
    const scrollVideoBtn = document.getElementById('scrollVideoBtn');
    const shayariTextDisplay = document.getElementById('shayariTextDisplay');
    const nextShayariBtn = document.getElementById('nextShayariBtn');
    const copyShayariBtn = document.getElementById('copyShayariBtn');
    const toastMsg = document.getElementById('toastMsg');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    const shayariTabs = document.querySelectorAll('.shayari-tab');
    
    // Lock Screen Elements
    const lockScreen = document.getElementById('lockScreen');
    const dobDay = document.getElementById('dobDay');
    const dobMonth = document.getElementById('dobMonth');
    const dobYear = document.getElementById('dobYear');
    const unlockBtn = document.getElementById('unlockBtn');
    const lockError = document.getElementById('lockError');

    // Thank You Form Elements
    const thankYouMsg = document.getElementById('thankYouMsg');
    const sendWaBtn = document.getElementById('sendWaBtn');
    const sendSmsBtn = document.getElementById('sendSmsBtn');
    const husbandNumber = "919118918018"; // With country code

    // --- Lock Screen Logic ---
    unlockBtn.addEventListener('click', () => {
        const d = parseInt(dobDay.value);
        const m = parseInt(dobMonth.value);
        const y = parseInt(dobYear.value);

        if (d === secretDOB.day && m === secretDOB.month && y === secretDOB.year) {


            // Immediately hide the lock screen
            lockScreen.classList.add('hidden');
            document.body.classList.add('unlocked');
            isUnlocked = true;
            
            // Play song immediately!
            if (window.soundEngine && !window.soundEngine.isPlayingMusic) {
                window.soundEngine.playHappyBirthdaySong();
                musicToggleBtn.textContent = '🔊';
            }
            
            // Delay heavy visual work just slightly (50ms) to ensure speech starts without lag
            setTimeout(() => {
                if (window.soundEngine) {
                    window.soundEngine.playSparkle();
                    window.soundEngine.playHappyBirthdaySong();
                    musicToggleBtn.textContent = '🔊';
                }
                
                fireConfetti(200, window.innerWidth / 2, window.innerHeight / 2, true);
                
                for (let i = 0; i < 40; i++) {
                    setTimeout(createBalloon, i * 150);
                }
            }, 50);
        } else {
            lockError.textContent = "Incorrect Date of Birth! Please try again.";
            lockError.style.animation = "heartBeat 0.5s ease";
            setTimeout(() => lockError.style.animation = "", 500);
        }
    });

    // --- Music Toggle ---
    musicToggleBtn.addEventListener('click', () => {
        if (window.soundEngine) {
            const isPlaying = window.soundEngine.toggleMusic();
            musicToggleBtn.textContent = isPlaying ? '🔊' : '🔇';
        }
    });

    // --- Theme Toggle ---
    themeToggleBtn.addEventListener('click', () => {
        currentMode = currentMode === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-mode', currentMode);
        themeToggleBtn.textContent = currentMode === 'dark' ? '🌙' : '☀️';
        
        // Switch the audio track based on theme
        if (window.soundEngine) {
            window.soundEngine.setMode(currentMode);
        }
    });

    // --- Toast Notification Helper ---
    function showToast(msg) {
        toastMsg.textContent = msg;
        toastMsg.classList.add('show');
        setTimeout(() => {
            toastMsg.classList.remove('show');
        }, 2200);
    }

    // --- Shayari Management ---
    function displayShayari(index) {
        shayariTextDisplay.style.opacity = '0';
        shayariTextDisplay.style.transform = 'translateY(8px)';
        setTimeout(() => {
            shayariTextDisplay.replaceChildren();
            const text = shayaris[currentLang][index];
            const lines = text.split('\n');
            lines.forEach((line, i) => {
                const lineSpan = document.createElement('span');
                lineSpan.textContent = line;
                shayariTextDisplay.appendChild(lineSpan);
                if (i < lines.length - 1) {
                    shayariTextDisplay.appendChild(document.createElement('br'));
                }
            });
            shayariTextDisplay.style.opacity = '1';
            shayariTextDisplay.style.transform = 'translateY(0)';
        }, 250);
    }

    shayariTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            shayariTabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            currentLang = e.target.getAttribute('data-lang');
            currentShayariIndex = 0;
            displayShayari(currentShayariIndex);
            if (window.soundEngine) window.soundEngine.playSparkle();
        });
    });

    nextShayariBtn.addEventListener('click', () => {
        currentShayariIndex = (currentShayariIndex + 1) % shayaris[currentLang].length;
        displayShayari(currentShayariIndex);
        if (window.soundEngine) {
            window.soundEngine.playSparkle();
        }
    });

    copyShayariBtn.addEventListener('click', () => {
        const textToCopy = shayaris[currentLang][currentShayariIndex];
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast("Quote copied to clipboard! ✨📋");
            }).catch(() => {
                showToast("Copied! ✨");
            });
        } else {
            showToast("Quote selected! ✨");
        }
    });

    // --- Confetti Engine ---
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId = null;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const confettiColors = ['#ff416c', '#8a2387', '#e94057', '#f27121', '#ffd700', '#00f2fe', '#4facfe', '#a8ff78', '#ff758c'];

    class ConfettiParticle {
        constructor(x, y, isBurst = false) {
            this.x = x || Math.random() * canvas.width;
            this.y = y || (isBurst ? canvas.height / 2 : -20);
            this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            this.size = Math.random() * 8 + 4;
            this.speedX = isBurst ? (Math.random() - 0.5) * 18 : (Math.random() - 0.5) * 4;
            this.speedY = isBurst ? (Math.random() - 0.5) * 18 - 4 : Math.random() * 3 + 2;
            this.rotation = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 10;
            this.gravity = 0.15;
            this.opacity = 1;
            this.decay = isBurst ? Math.random() * 0.012 + 0.006 : 0.003;
            this.shape = Math.random() > 0.4 ? 'rect' : 'circle';
        }

        update() {
            this.speedY += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotSpeed;
            this.opacity -= this.decay;
        }

        draw(ctx) {
            if (this.opacity <= 0) return;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.fillStyle = this.color;

            if (this.shape === 'rect') {
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    function fireConfetti(count = 90, x, y, isBurst = true) {
        for (let i = 0; i < count; i++) {
            particles.push(new ConfettiParticle(x, y, isBurst));
        }
        if (!animationFrameId) {
            runConfettiLoop();
        }
    }

    function runConfettiLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw(ctx);
            if (p.opacity <= 0 || p.y > canvas.height + 50) {
                particles.splice(i, 1);
            }
        }

        if (particles.length > 0) {
            animationFrameId = requestAnimationFrame(runConfettiLoop);
        } else {
            animationFrameId = null;
        }
    }

    // --- Balloon Generation System ---
    const balloonColors = ['#ff4b72', '#7000ff', '#00d2ff', '#f39c12', '#2ecc71', '#e84393', '#fdcb6e'];
    const balloonWishes = [
        "🌟 Stay Magical!",
        "🎉 Happy Birthday!",
        "💖 I Love You!",
        "🎂 Best Girl!",
        "🚀 My Everything!",
        "✨ Shine Bright!"
    ];

    function createBalloon() {
        const balloon = document.createElement('div');
        balloon.className = 'floating-balloon';

        const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        balloon.style.backgroundColor = color;
        balloon.style.color = color;

        const leftPos = Math.random() * 85 + 5;
        balloon.style.left = leftPos + 'vw';

        const duration = Math.random() * 6 + 9;
        balloon.style.animationDuration = duration + 's';

        const string = document.createElement('div');
        string.className = 'balloon-string';
        balloon.appendChild(string);

        balloon.addEventListener('click', function (e) {
            popBalloon(balloon, e.clientX, e.clientY, color);
        });

        balloonContainer.appendChild(balloon);

        setTimeout(() => {
            if (balloon.parentNode === balloonContainer) {
                balloonContainer.removeChild(balloon);
            }
        }, duration * 1000);
    }

    function popBalloon(balloonEl, x, y, color) {
        if (window.soundEngine) {
            window.soundEngine.playPop();
        }

        for (let i = 0; i < 14; i++) {
            const p = document.createElement('div');
            p.className = 'pop-particle';
            p.style.backgroundColor = color;
            p.style.left = x + 'px';
            p.style.top = y + 'px';
            document.body.appendChild(p);

            const angle = (Math.PI * 2 * i) / 14;
            const dist = Math.random() * 45 + 20;
            const destX = x + Math.cos(angle) * dist;
            const destY = y + Math.sin(angle) * dist;

            p.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${destX - x}px, ${destY - y}px) scale(0)`, opacity: 0 }
            ], {
                duration: 400,
                easing: 'ease-out',
                fill: 'forwards'
            });

            setTimeout(() => p.remove(), 420);
        }

        const randomWish = balloonWishes[Math.floor(Math.random() * balloonWishes.length)];
        const wishTag = document.createElement('div');
        wishTag.className = 'wish-pill';
        wishTag.textContent = randomWish;
        wishTag.style.position = 'fixed';
        wishTag.style.left = (x - 40) + 'px';
        wishTag.style.top = (y - 20) + 'px';
        wishTag.style.zIndex = '999';
        document.body.appendChild(wishTag);

        wishTag.animate([
            { transform: 'translateY(0)', opacity: 1 },
            { transform: 'translateY(-40px)', opacity: 0 }
        ], {
            duration: 1200,
            easing: 'ease-out',
            fill: 'forwards'
        });

        setTimeout(() => wishTag.remove(), 1250);

        if (balloonEl.parentNode === balloonContainer) {
            balloonContainer.removeChild(balloonEl);
        }
    }

    setInterval(() => {
        if (balloonContainer.children.length < 7) {
            createBalloon();
        }
    }, 2800);

    // --- Typewriter Effect for Letter ---
    let typewriterTimer = null;
    function typeLetter(text) {
        if (typewriterTimer) clearInterval(typewriterTimer);
        letterBody.textContent = "";

        let index = 0;
        typewriterTimer = setInterval(() => {
            if (index < text.length) {
                letterBody.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(typewriterTimer);
                typewriterTimer = null;
            }
        }, 30);
    }

    // --- Render App Content ---
    function renderApp() {
        wishesStream.replaceChildren();
        appData.wishes.forEach(wishText => {
            const pill = document.createElement('div');
            pill.className = 'wish-pill';
            pill.textContent = wishText;
            wishesStream.appendChild(pill);
        });

        typeLetter(appData.letter);
        displayShayari(currentShayariIndex);
    }

    // --- Interactive Cake & Candle Blow Logic ---
    const candles = document.querySelectorAll('.candle-unit');

    function checkAllCandlesBlown() {
        const allBlown = Array.from(candles).every(c => c.classList.contains('blown'));
        if (allBlown) {
            cakeStatus.textContent = "🎉 Yay! All candles blown! May your secret wish come true! 🎂✨";
            if (window.soundEngine) {
                window.soundEngine.playCheer();
                window.soundEngine.playHorn();
            }
            fireConfetti(120, window.innerWidth / 2, window.innerHeight / 2, true);
        }
    }

    candles.forEach(candle => {
        candle.addEventListener('click', () => {
            if (!candle.classList.contains('blown')) {
                candle.classList.add('blown');
                if (window.soundEngine) {
                    window.soundEngine.playBlow();
                }
                checkAllCandlesBlown();
            }
        });
    });

    blowCandlesBtn.addEventListener('click', () => {
        candles.forEach((candle, idx) => {
            setTimeout(() => {
                candle.classList.add('blown');
                if (idx === candles.length - 1) {
                    if (window.soundEngine) window.soundEngine.playBlow();
                    checkAllCandlesBlown();
                }
            }, idx * 120);
        });
    });

    relightCandlesBtn.addEventListener('click', () => {
        candles.forEach(candle => candle.classList.remove('blown'));
        cakeStatus.textContent = "Candles relit! Make another wish, my love! 🕯️✨";
        if (window.soundEngine) {
            window.soundEngine.playSparkle();
        }
    });

    cutCakeBtn.addEventListener('click', () => {
        cakeStatus.textContent = "🎂 A sweet slice for the sweetest girl! Happy Birthday!";
        if (window.soundEngine) {
            window.soundEngine.playSparkle();
            window.soundEngine.playCheer();
        }
        fireConfetti(80, window.innerWidth / 2, window.innerHeight / 2, true);
    });

    // --- Wish Wall Submissions ---
    wishForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const wishText = customWishInput.value.trim();
        if (!wishText) return;

        const pill = document.createElement('div');
        pill.className = 'wish-pill';
        pill.textContent = "✨ " + wishText;
        wishesStream.prepend(pill);

        customWishInput.value = '';
        if (window.soundEngine) window.soundEngine.playSparkle();
        fireConfetti(40, window.innerWidth / 2, window.innerHeight / 2, true);
    });

    // --- Navigation Quick Scroll Buttons ---
    scrollCakeBtn.addEventListener('click', () => document.getElementById('cakeSection').scrollIntoView({ behavior: 'smooth' }));
    scrollShayariBtn.addEventListener('click', () => document.getElementById('shayariSection').scrollIntoView({ behavior: 'smooth' }));
    scrollLoveBtn.addEventListener('click', () => document.getElementById('loveSection').scrollIntoView({ behavior: 'smooth' }));
    scrollVideoBtn.addEventListener('click', () => document.getElementById('videoSection').scrollIntoView({ behavior: 'smooth' }));

    // --- Magical Stars Background (Dark Mode) ---
    function createStars() {
        const starsContainer = document.getElementById('stars-container');
        if (!starsContainer) return;
        
        for (let i = 0; i < 70; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.width = `${Math.random() * 3 + 1}px`;
            star.style.height = star.style.width;
            star.style.left = `${Math.random() * 100}vw`;
            star.style.top = `${Math.random() * 100}vh`;
            star.style.setProperty('--twinkle-dur', `${Math.random() * 3 + 2}s`);
            starsContainer.appendChild(star);
        }
    }
    createStars();

    // --- Surprise Gift Box Logic ---
    const giftBoxBtn = document.getElementById('giftBoxBtn');
    const giftMessage = document.getElementById('giftMessage');
    
    if (giftBoxBtn) {
        giftBoxBtn.addEventListener('click', () => {
            if (!giftBoxBtn.classList.contains('open')) {
                giftBoxBtn.classList.add('open');
                
                if (window.soundEngine) {
                    window.soundEngine.playPop();
                    setTimeout(() => window.soundEngine.playSparkle(), 300);
                }
                
                const rect = giftBoxBtn.getBoundingClientRect();
                fireConfetti(60, rect.left + rect.width / 2, rect.top + rect.height / 2, false);
                
                giftMessage.classList.remove('hidden');
                // Allow display:block to apply before animating opacity
                setTimeout(() => giftMessage.classList.add('show'), 50);
            }
        });
    }

    // --- Thank You Message SMS/WhatsApp Link Updater ---
    function updateThankYouLinks() {
        const msg = thankYouMsg.value || "Thank you so much my love! This is beautiful! ❤️";
        const encodedMsg = encodeURIComponent(msg);
        
        // WhatsApp Link
        sendWaBtn.href = `https://wa.me/${husbandNumber}?text=${encodedMsg}`;
        
        // Standard SMS Link (iOS uses &body=, Android uses ?body=, usually ?body is safer fallback)
        sendSmsBtn.href = `sms:+${husbandNumber}?body=${encodedMsg}`;
    }

    thankYouMsg.addEventListener('input', updateThankYouLinks);
    // Initialize links on load
    updateThankYouLinks();

    // Initial render and setup
    window.addEventListener('load', () => {
        renderApp();
        // Removed automatic confetti and balloons from here since it's now handled by the lock screen unlock event.
    });

})();

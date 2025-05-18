
document.querySelector(".logo a").addEventListener("click", (e) => {
    e.preventDefault(); // Prevent instant jump
    window.scrollTo({
        top: 0,
        behavior: "smooth", // Smooth scrolling effect
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const meetNosleeBtn = document.getElementById('meet-noslee');
    const heroImage = document.querySelector('.hero-image');

    // Create an audio element for the bark sound
    const barkSound = new Audio('sounds/bark.mp3');

    meetNosleeBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Smooth scrolling effect
        });

        // Play bark sound
        barkSound.play();

        // Change the image to "barking.png", make it 20% bigger, move it higher, and bring it in front
        heroImage.style.backgroundImage = "url('images/barking.png')";
        heroImage.style.transform = "scale(1.2) translateY(-50px)"; // Bigger & moves higher
        heroImage.style.zIndex = "10"; // Bring it to the front (above the download button)

        // Return to the original image after 600ms
        setTimeout(() => {
            heroImage.style.backgroundImage = "url('images/BigPicture.png')"; // Change back
            heroImage.style.transform = "scale(1) translateY(0)"; // Reset size & position
            heroImage.style.zIndex = "1"; // Reset layering
        }, 600);
    });

    // 🎁 Popup Logic
    const giftPopup = document.getElementById("gift-popup");
    const thanksPopup = document.getElementById("thanks-popup");
    const downloadArrow = document.getElementById("downloadArrow");

    const popupEmail = document.getElementById("popupEmail");
    const emailError = document.getElementById("emailError");

    function showArrowPrompt() {
        downloadArrow.classList.remove("hidden");
        downloadArrow.classList.add("show");
    
        setTimeout(() => {
            downloadArrow.classList.remove("show");
            downloadArrow.classList.add("hidden");
         }, 7000);
    }

    document.getElementById("popupClose").onclick = () => {
        giftPopup.classList.add("hidden");
        resetPopupForm();
    };

    document.getElementById("thanksClose").onclick = () => thanksPopup.classList.add("hidden");

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    popupEmail.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            document.getElementById("btnSignup").click();
        }
    });



    function startDownload() {
        fetch('https://raw.githubusercontent.com/orona86/NoSleeper---LP/main/testFile.png')
            .then(res => res.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'testFile.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            })
            .catch(err => console.error('Download failed:', err));
    }


    document.querySelectorAll(".gift").forEach((gift) => {
        gift.addEventListener("click", () => {

            giftPopup.classList.add("hidden");
            startDownload();
            showArrowPrompt();
            resetPopupForm();
            thanksPopup.classList.remove("hidden");
        });
    });


    document.getElementById("btnSignup").onclick = () => {
        const email = popupEmail.value.trim();
        if (!validateEmail(email)) {
            emailError.classList.remove("hidden");
            return;
        }

        emailError.classList.add("hidden");
        giftPopup.classList.add("hidden");
        startDownload();
        showArrowPrompt();
        resetPopupForm();
        thanksPopup.classList.remove("hidden");
    };

    document.getElementById("btnSkip").onclick = () => {
        giftPopup.classList.add("hidden");
        startDownload();
        showArrowPrompt();
        resetPopupForm();
        thanksPopup.classList.remove("hidden");

    };
    function resetPopupForm() {
        popupEmail.value = "";
        emailError.classList.add("hidden");
    }


    // ⏱️ Countdown Timer
    let countdown = 16 * 60 + 20;
    const timerEl = document.getElementById("popup-timer");

    const timerInterval = setInterval(() => {
        countdown--;
        const min = String(Math.floor(countdown / 60)).padStart(2, '0');
        const sec = String(countdown % 60).padStart(2, '0');
        if (countdown <= 30) {
            timerEl.classList.add("warning");
        }
        timerEl.textContent = `00:${min}:${sec}`;

        if (countdown <= 0) {
            clearInterval(timerInterval);
            giftPopup.classList.add("hidden");
            resetPopupForm();
        }
    }, 1000);

    // 🐶 Clicking floating NoSlee images opens the popup
    document.querySelectorAll(".floating-noslee-wrapper").forEach(wrapper => {
        wrapper.addEventListener("click", () => {
            giftPopup.classList.remove("hidden");
        });
    });

});



document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".carousel-track");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    let scrollAmount = 0;
    const itemWidth = document.querySelector(".testimonial").offsetWidth + 20; // Space between
    let isUserInteracting = false;

    function moveCarousel() {
        const totalItems = document.querySelectorAll(".carousel-track .testimonial").length;
        const totalWidth = totalItems * itemWidth; // Total width of all items

        if (!isUserInteracting) {
            scrollAmount += autoScrollDirection; // Small continuous movement

            if (scrollAmount >= totalWidth - track.clientWidth) {
                scrollAmount = 0; // Loop back to start only after all 12 items
            }

            track.style.transition = "transform 0.2s linear";
            track.style.transform = `translateX(-${scrollAmount}px)`;
        }
    }


    function handleUserClick(direction) {
        // Move the carousel smoothly when clicking
        scrollAmount += direction * itemWidth * 2; // Moves 2 items per click

        // Prevent scrolling past boundaries
        if (scrollAmount < 0) {
            scrollAmount = track.scrollWidth - track.clientWidth; // Loop to end
        }
        if (scrollAmount > track.scrollWidth - track.clientWidth) {
            scrollAmount = 0; // Loop back to start
        }

        // Smooth animation for the transition
        track.style.transition = "transform 0.4s ease-in-out";
        track.style.transform = `translateX(-${scrollAmount}px)`;
    }

    // Attach event listeners to buttons
    nextBtn.addEventListener("click", () => handleUserClick(1));  // Moves right
    prevBtn.addEventListener("click", () => handleUserClick(-1)); // Moves left

    // Continuous smooth movement - Ensures clicking doesn’t affect auto-scroll
    let autoScrollDirection = 1; // Always moving right
    function moveCarousel() {
        scrollAmount += autoScrollDirection; // Small continuous movement

        if (scrollAmount >= track.scrollWidth - track.clientWidth) {
            scrollAmount = 0; // Loop back to start
        }

        track.style.transition = "transform 0.2s linear"; // Smooth movement
        track.style.transform = `translateX(-${scrollAmount}px)`;
    }

    // Keep auto-scroll running even after clicking
    setInterval(moveCarousel, 30); // Adjust speed here (smaller = smoother)
});

document.addEventListener("DOMContentLoaded", () => {
    const floatingContainer = document.getElementById("floatingNoslee");
    const featureSection = document.getElementById("features"); // your section ID
    const imageSources = [
        "images/noslee1.png",
        "images/noslee2.png",
        "images/noslee3.png",
        "images/noslee4.png",
        "images/noslee5.png"
    ];

    let index = 0;
    // 🔍 Safe positioning helper
    function getSafePosition(imgWidth, imgHeight) {
        const sectionRect = featureSection.getBoundingClientRect();
        const blockers = Array.from(document.querySelectorAll("#features h2, #features .feature"));
        const maxAttempts = 30;

        for (let i = 0; i < maxAttempts; i++) {
            const x = Math.floor(Math.random() * (sectionRect.width - imgWidth));
            const y = Math.floor(Math.random() * (sectionRect.height - imgHeight));

            // The test rect, adjusted to **viewport coordinates** like the blockers
            const testRect = {
                left: sectionRect.left + x,
                top: sectionRect.top + y,
                right: sectionRect.left + x + imgWidth,
                bottom: sectionRect.top + y + imgHeight
            };

            // Check for collision
            const overlaps = blockers.some(el => {
                const rect = el.getBoundingClientRect();
                return !(
                    rect.right < testRect.left ||
                    rect.left > testRect.right ||
                    rect.bottom < testRect.top ||
                    rect.top > testRect.bottom
                );
            });

            if (!overlaps) {
                return { x, y };
            }
        }

        // Still failed? Fallback to center inside section (relative coords)
        return {
            x: sectionRect.width / 2 - imgWidth / 2,
            y: sectionRect.height / 2 - imgHeight / 2
        };
    }


    function showNextImage() {
        // Clear previous image
        floatingContainer.innerHTML = "";

        // Create new image
        const img = document.createElement("img");
        img.src = imageSources[index];
        img.className = "floating-noslee";
        img.title = "Click to stay awake"; // optional tooltip
        img.onclick = () => {
            document.getElementById("gift-popup").classList.remove("hidden");
        };

        floatingContainer.appendChild(img);

        // Random durations
        const fadeInTime = Math.random() * 1000 + 1800;  // 1.8s – 2.8s
        const holdTime = Math.random() * 1500 + 2000;    // 2.0s – 3.5s
        const fadeOutTime = Math.random() * 1000 + 2000; // 2.0s – 3.0s
        const totalTime = fadeInTime + holdTime + fadeOutTime;

        // Apply position
        const sectionRect = featureSection.getBoundingClientRect();
        const padding = 40;
        const maxX = sectionRect.width - 100;
        const maxY = sectionRect.height - 100;
        const { x, y } = getSafePosition(220, 220);
        img.style.left = `${x}px`;
        img.style.top = `${y}px`;


        // Apply dynamic transition for fade-in
        img.style.transition = `opacity ${fadeInTime}ms ease`;
        requestAnimationFrame(() => {
            img.style.opacity = 1;
        });

        // Fade-out after fadeIn + hold
        setTimeout(() => {
            img.style.transition = `opacity ${fadeOutTime}ms ease`;
            img.style.opacity = 0;
        }, fadeInTime + holdTime);

        // Schedule next image after total cycle time
        index = (index + 1) % imageSources.length;
        setTimeout(showNextImage, totalTime);
    }

    // Start loop
    showNextImage();
});

document.addEventListener("DOMContentLoaded", () => {
    const carpetDog = document.getElementById("carpet-dog");
    const carpetImg = carpetDog.querySelector("img");
    const popup = document.getElementById("gift-popup");
    const downloadArrow = document.getElementById("downloadArrow");

    let posX = -200;
    let posY = 200;
    let vx = 0.7 + Math.random() * 0.5;
    let vy = (Math.random() - 0.5) * 0.6;
    let floating = true;
    let direction = "right";

    // ✅ Check if we should freeze motion
    function isDistractionTime() {
        const popupVisible = !popup.classList.contains("hidden");
        const arrowVisible = downloadArrow.classList.contains("show");
        return popupVisible || arrowVisible;
    }

    // ✅ Flip image direction


    // ✅ Floating motion loop
    function floatFreely() {
        if (!floating) return;

        if (isDistractionTime()) {
            requestAnimationFrame(floatFreely);
            return;
        }

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const dogWidth = carpetDog.offsetWidth;
        const dogHeight = carpetDog.offsetHeight;

        // Randomly change direction every few frames
        if (Math.random() < 0.005) {
            vx = 0.4 + (Math.random() - 0.5) * 1.2;
            updateDirection(vx);
        }

        if (Math.random() < 0.005) {
            vy = (Math.random() - 0.5) * 1.2;
        }

        posX += vx;

        posY += vy;

        // Bounce off top/bottom
        if (posY < 100 || posY > screenHeight - 250) {
            vy *= -1;
        }

        //updateDirection(vx);
        carpetDog.style.left = `${posX}px`;
        carpetDog.style.top = `${posY}px`;

        // If offscreen right → fade out, wrap, re-enter
        if (posX > screenWidth + dogWidth) {
            floating = false;
            carpetDog.style.transition = "opacity 0.8s ease";
            carpetDog.style.opacity = "0";

            setTimeout(() => {
                posX = -dogWidth;
                posY = 150 + Math.random() * 120;
                vx = 0.7 + Math.random() * 0.5;
                vy = (Math.random() - 0.5) * 0.6;
                updateDirection(vx);

                carpetDog.style.left = `${posX}px`;
                carpetDog.style.top = `${posY}px`;

                setTimeout(() => {
                    carpetDog.style.opacity = "1";
                    floating = true;
                    requestAnimationFrame(floatFreely);
                }, 400);
            }, 400);
            return;
        }

        requestAnimationFrame(floatFreely);
    }

    requestAnimationFrame(floatFreely);

    // ✅ Hover-to-dodge logic with 20% chance to allow click
    carpetDog.addEventListener("mouseenter", (e) => {
        if (isDistractionTime()) return;

        const allowClick = Math.random() < 0.2;
        if (allowClick) return;

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const dogRect = carpetDog.getBoundingClientRect();
        const dogCenterX = dogRect.left + dogRect.width / 2;
        const dogCenterY = dogRect.top + dogRect.height / 2;

        // 🧠 Determine direction away from mouse
        const dx = dogCenterX - mouseX;
        const dy = dogCenterY - mouseY;
        const magnitude = Math.sqrt(dx * dx + dy * dy);

        const normX = dx / magnitude;
        const normY = dy / magnitude;

        // Multiply for dodge distance
        const dodgeDistance = 300;
        const dodgeX = normX * dodgeDistance;
        const dodgeY = normY * dodgeDistance;

        posX = Math.max(20, Math.min(window.innerWidth - 200, posX + dodgeX));
        posY = Math.max(100, Math.min(window.innerHeight - 250, posY + dodgeY));

        // 💡 Flip image direction based on dodge
        updateDirection(dodgeX);

        carpetDog.style.transition = `left 120ms ease-out, top 120ms ease-out`;
        carpetDog.style.left = `${posX}px`;
        carpetDog.style.top = `${posY}px`;

        // Resume float
        setTimeout(() => {
            vx = 0.7 + Math.random() * 0.5;
            vy = (Math.random() - 0.5) * 0.6;

            // 🧠 Only switch back to right-facing if we actually need to
            if (vx > 0 && direction !== "right") {
                updateDirection(vx);
            }
        }, 500); // give it a bit more time to show the left image

    });

    function updateDirection(currentVX) {
        console.log("updateDirection called with:", currentVX);
        if (currentVX > 0 && direction !== "right") {
            //console.log("Switching to RIGHT");
            carpetImg.src = "images/dog-right.gif";
            direction = "right";
        } else if (currentVX < 0 && direction !== "left") {
            //console.log("Switching to LEFT");
            carpetImg.src = "images/dog-left.gif";
            direction = "left";
        }
    }


    // ✅ Click opens popup — always allowed after a non-dodge
    carpetDog.addEventListener("click", () => {
        if (isDistractionTime()) return;

        popup.classList.remove("hidden");

        // Reset motion
        vx = 0.7 + Math.random() * 0.5;
        vy = (Math.random() - 0.5) * 0.6;
    });
});

// (place this at the end of your DOMContentLoaded callback)
(() => {
    // grabs the first gift in the pop-up and calls its click handler
    const proxyGiftClick = () => document.querySelector('.gift').click();

    // list of the 4 selectors: hero image, hero button, info-section button & gift image
    [
        '.hero-image',
        '.download-btn',
        '.gift-img',
        '.gift-btn',
        '.header-download-btn'
    ].forEach(sel => {
        const el = document.querySelector(sel);
        if (el) el.addEventListener('click', proxyGiftClick);
    });
})();

// ─────── START DROP-IN ───────
(() => {
    // reuse the pop-up gift click
    const proxyGiftClick = () => document.querySelector('.gift').click();

    // 1. header “Download” link
    const hdr = document.querySelector('nav ul li a[href="#download"]');
    if (hdr) {
        hdr.removeAttribute('href');
        hdr.style.cursor = 'pointer';
        hdr.onclick = proxyGiftClick;
    }

    // 2. carpet-dog in testimonials
    const oldDog = document.querySelector('.carpet-dog img');
    if (oldDog) {
        const newDog = oldDog.cloneNode(true);
        oldDog.parentNode.replaceChild(newDog, oldDog);
        newDog.style.cursor = 'pointer';
        newDog.onclick = proxyGiftClick;
    }

    // 3. gift image in “what-you-didn’t-know”
    const giftImg = document.querySelector('.what-you-didnt-know .gift-img');
    if (giftImg) {
        giftImg.style.cursor = 'pointer';
        giftImg.onclick = proxyGiftClick;
    }
})();
// ─────── END DROP-IN ───────

// Smooth scroll for footer nav
document.querySelectorAll('.footer-nav a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const tgt = document.querySelector(link.getAttribute('href'));
        if (tgt) {
            window.scrollTo({ top: tgt.offsetTop, behavior: 'smooth' });
        }
    });
});










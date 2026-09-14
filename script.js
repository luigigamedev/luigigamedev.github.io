const projectData = {
    "lge": {
        title: "LGE: Game Engine",
        description: "Custom C++/OpenGL game engine written from scratch. A learning journey.",
        media: [
            { type: "video", url: "assets/projects/lge/seq01.mp4" }
        ],
        buttons: [
            {
                text: "Github",
                url: "https://github.com/luigigamedev/lge",
                style: "btn-github",
                icon: "fa-brands fa-github",
                iconType: "fa"
            }
        ]
    },
    "car": {
        title: "Arcade/Simcade Car Physics",
        description: "Custom vehicle physics and car controller built for arcade and simcade gameplay. Published on the Unity Asset Store.",
        media: [
            { type: "video", url: "assets/projects/car/multiray.mp4" },
            { type: "video", url: "assets/projects/car/soccar.mp4" },
            { type: "image", url: "assets/projects/car/cardimage.png" },
            { type: "video", url: "assets/projects/car/crash.mp4" },
            { type: "image", url: "assets/projects/car/screenshot03.png" }
        ],
        buttons: [
            {
                text: "Itch.io",
                url: "https://luigigamedev.itch.io/car-controller-demo",
                style: "btn-itchio",
                icon: "assets/ui/icons/itchio.svg",
                iconType: "img"
            },
            {
                text: "Asset Store",
                url: "https://assetstore.unity.com/packages/slug/301925",
                style: "btn-unity",
                icon: "fa-brands fa-unity",
                iconType: "fa"
            }
        ]
    },
    "football": {
        title: "Unreal Football",
        description: "Multiplayer, 3rd-person esports football game. In development. Developed in Unreal with C++ and Bullet3 physics.",
        media: [
            { type: "video", url: "assets/projects/football/seq01.mp4" }
        ]
    },
    "apocalypse": {
        title: "Apocalypse: Party's Over",
        description: "2D side-scrolling beat'em up game featuring the cartoons of Mundo Canibal. Released on Steam. Developed in Unity with C#.",
        developer: "Izyplay Game Studio",
        contribution: "Combat mechanics, stages and boss fights.",
        media: [
            { type: "video", url: "assets/projects/apocalypse/sequence01.mp4" }
        ],
        buttons: [
            {
                text: "Steam",
                url: "https://store.steampowered.com/app/368800",
                style: "btn-steam",
                icon: "fa-brands fa-steam",
                iconType: "fa"
            }
        ]
    },
    "bushido": {
        title: "Bushido Saga: Nightmare of the Samurai",
        description: "Action-adventure RPG game featuring a dynamic combat system with a versatile arsenal of melee and ranged weapons. Released on Steam, Google Play, and Apple. Developed in Unity with C#.",
        developer: "Pandora Game Studio",
        contribution: "Player movement, weapons and equipment systems.",
        media: [
            { type: "video", url: "assets/projects/bushido/seq01.mp4" },
            { type: "image", url: "assets/projects/bushido/ss2.jpg" },
            { type: "image", url: "assets/projects/bushido/ss1.jpg" }
        ],
        buttons: [
            {
                text: "Steam",
                url: "https://store.steampowered.com/app/2496720",
                style: "btn-steam",
                icon: "fa-brands fa-steam",
                iconType: "fa"
            },
            {
                text: "Google Play",
                url: "https://play.google.com/store/apps/details?id=com.pandoragamestudio.samurai",
                style: "btn-googleplay",
                icon: "fa-brands fa-google-play",
                iconType: "fa"
            }
        ]
    }
};

const display = document.getElementById('project-display');
const buttons = document.querySelectorAll('.cartridge-btn');

/**
 * Navigates the carousel and updates button states
 * direction: -1 for left, 1 for right
 */
function scrollCarousel(btn, direction) {
    const container = btn.parentElement;
    const track = container.querySelector('.carousel-track');
    if (!track) return;

    stopTrackVideos(track);

    // Calculate distance based on the visible width of the track
    const scrollAmount = track.clientWidth * direction;
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

/**
 * Directly scrolls to a specific slide index
 */
function goToSlide(track, index) {
    if (!track) return;
    stopTrackVideos(track);
    track.scrollTo({ left: track.clientWidth * index, behavior: 'smooth' });
}

/**
 * Monitors scroll position to disable/enable arrows at boundaries
 */
function updateArrows(track) {
    if (!track) return;
    const container = track.parentElement;
    const prevBtn = container.querySelector('button:first-child');
    const nextBtn = container.querySelector('button:last-child');

    if (!prevBtn || !nextBtn) return;

    // Check if we are at the far left or far right (5px buffer for sub-pixel rounding)
    const isAtStart = track.scrollLeft <= 5;
    const isAtEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;

    prevBtn.style.opacity = isAtStart ? "0.3" : "1";
    prevBtn.style.pointerEvents = isAtStart ? "none" : "auto";

    nextBtn.style.opacity = isAtEnd ? "0.3" : "1";
    nextBtn.style.pointerEvents = isAtEnd ? "none" : "auto";
}

/**
 * Updates active pagination indicator dot based on scroll position
 */
function updateIndicators(track) {
    if (!track || !track.clientWidth) return;
    const displayWrap = track.closest('#project-display');
    if (!displayWrap) return;
    const dots = displayWrap.querySelectorAll('.carousel-dot');
    if (!dots.length) return;

    const index = Math.round(track.scrollLeft / track.clientWidth);
    dots.forEach((dot, i) => {
        const isActive = i === index;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
}

// helper: pause all videos inside a track
function stopTrackVideos(track) {
    if (!track) return;
    const vids = track.querySelectorAll('video');
    vids.forEach(v => v.pause());
}

// helper: find current slide index and autoplay its video (after stopping others)
function playVisibleVideo(track) {
    if (!track || !track.clientWidth) return;
    stopTrackVideos(track);
    const index = Math.round(track.scrollLeft / track.clientWidth);
    const slide = track.children[index];
    if (slide) {
        const vid = slide.querySelector('video');
        if (vid) {
            const playPromise = vid.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Browser prevented autoplay; user can play manually via controls
                });
            }
        }
    }
}

let scrollDebounceTimer = null;
function handleTrackScroll(track) {
    updateArrows(track);
    updateIndicators(track);
    clearTimeout(scrollDebounceTimer);
    scrollDebounceTimer = setTimeout(() => {
        playVisibleVideo(track);
    }, 150);
}

/**
 * Updates active class and aria-expanded state on cartridge buttons
 */
function setActiveCartridge(id) {
    buttons.forEach(btn => {
        const isActive = btn.dataset.id === id;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });
}

/**
 * Opens a project by id, renders the display, and updates history hash
 */
function openProject(id, updateHistory = true) {
    const data = projectData[id];
    if (!data || !display) return;

    setActiveCartridge(id);

    display.style.display = 'flex';

    // 1. Generate Media Slides
    const slidesHtml = data.media.map(item => {
        const content = item.type === 'video'
            ? `<video src="${item.url}" controls playsinline muted preload="metadata"></video>`
            : `<img src="${item.url}" alt="${data.title}" loading="lazy">`;
        return `<div class="slide">${content}</div>`;
    }).join('');

    // 1a. Generate Carousel Indicators (if more than 1 slide)
    const indicatorsHtml = data.media.length > 1
        ? `<div class="carousel-indicators" role="tablist" aria-label="Media Slides">
            ${data.media.map((_, i) => `
                <button class="carousel-dot ${i === 0 ? 'active' : ''}" 
                        data-index="${i}" 
                        role="tab" 
                        aria-selected="${i === 0 ? 'true' : 'false'}" 
                        aria-label="Slide ${i + 1} of ${data.media.length}">
                </button>
            `).join('')}
           </div>`
        : '';

    // 2. Generate Credit Line
    const devCredit = data.developer
        ? `<strong>Credit:</strong> ${data.developer}`
        : `<strong>Personal Project</strong>`;

    // 2a. Optional contribution line (only for non-personal projects)
    const contrib = (data.developer && data.contribution)
        ? `<p><strong>Contribution:</strong> ${data.contribution}</p>`
        : '';

    // 3. Generate Buttons as accessible links
    const buttonsHtml = (data.buttons || []).map(b => {
        const iconHtml = b.iconType === 'img'
            ? `<img src="${b.icon}" class="btn-icon-custom" alt="">`
            : `<i class="${b.icon}"></i>`;
        return `
            <a href="${b.url}" target="_blank" rel="noopener noreferrer" class="btn-base ${b.style}">
                ${iconHtml} ${b.text}
            </a>`;
    }).join('');

    // 4. Render
    display.innerHTML = `
        <div class="display-header">
            <button class="cartridge-ctrl" onclick="closeProject(true)" aria-label="Close Project">&#10006;</button>
        </div>
        <div class="carousel-container">
            <button class="cartridge-ctrl" onclick="scrollCarousel(this, -1)" aria-label="Previous Slide">&#10094;</button>
            <div class="carousel-track">${slidesHtml}</div>
            <button class="cartridge-ctrl" onclick="scrollCarousel(this, 1)" aria-label="Next Slide">&#10095;</button>
        </div>
        ${indicatorsHtml}
        <div class="display-content-wrap">
            <h2>${data.title}</h2>
            <p>${data.description}</p>
            ${contrib}
            <p>${devCredit}</p>
            ${buttonsHtml ? `<div class="project-actions">${buttonsHtml}</div>` : ''}
        </div>
    `;

    const newTrack = display.querySelector('.carousel-track');
    newTrack.addEventListener('scroll', () => handleTrackScroll(newTrack), { passive: true });
    if ('onscrollend' in window) {
        newTrack.addEventListener('scrollend', () => playVisibleVideo(newTrack));
    }

    // Attach click listeners to indicator dots
    const dots = display.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => goToSlide(newTrack, idx));
    });

    updateArrows(newTrack);
    updateIndicators(newTrack);
    playVisibleVideo(newTrack);

    if (updateHistory) {
        history.pushState({ projectId: id }, '', '#' + id);
    }

    display.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Closes the project display, pauses media, and cleans URL hash
 */
function closeProject(updateHistory = true) {
    if (!display) return;

    setActiveCartridge(null);

    const currentTrack = display.querySelector('.carousel-track');
    if (currentTrack) {
        stopTrackVideos(currentTrack);
    }

    // STOP & UNLOAD
    display.innerHTML = '';
    display.style.display = 'none';

    if (updateHistory && window.location.hash) {
        history.pushState(null, '', window.location.pathname + window.location.search);
    }

    // SCROLL TO GRID
    const grid = document.querySelector('.project-grid');
    if (grid) {
        setTimeout(() => { grid.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
    }
}

// Attach click events to cartridge buttons
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        openProject(id, true);
    });
});

// Keyboard Navigation: Escape to close, ArrowLeft/ArrowRight to cycle slides
document.addEventListener('keydown', (e) => {
    if (display.style.display !== 'flex') return;

    if (e.key === 'Escape') {
        closeProject(true);
    } else if (e.key === 'ArrowLeft') {
        const prevBtn = display.querySelector('.carousel-container > .cartridge-ctrl:first-child');
        if (prevBtn && prevBtn.style.pointerEvents !== 'none') {
            scrollCarousel(prevBtn, -1);
        }
    } else if (e.key === 'ArrowRight') {
        const nextBtn = display.querySelector('.carousel-container > .cartridge-ctrl:last-child');
        if (nextBtn && nextBtn.style.pointerEvents !== 'none') {
            scrollCarousel(nextBtn, 1);
        }
    }
});

// Deep linking: Handle browser Back/Forward navigation
window.addEventListener('popstate', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && projectData[hash]) {
        openProject(hash, false);
    } else if (display.style.display === 'flex') {
        closeProject(false);
    }
});

// Deep linking: Automatically open project on initial load if hash is present
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && projectData[hash]) {
        openProject(hash, false);
    }
});

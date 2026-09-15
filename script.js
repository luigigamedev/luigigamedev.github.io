/**
 * @file script.js
 * @description Core interactive logic for Luigi Garcia's game developer portfolio.
 * Manages 3D cartridge state, dynamic project rendering, media carousel, video playback,
 * URL hash routing (deep linking), and keyboard navigation.
 */

// =============================================================================
// 1. DATA MODELS & PROJECT REGISTRY
// =============================================================================

/**
 * @typedef {Object} MediaItem
 * @property {'video'|'image'} type - The media resource type.
 * @property {string} url - Relative path to the video or image asset.
 */

/**
 * @typedef {Object} ProjectButton
 * @property {string} text - User-facing button label.
 * @property {string} url - Target external hyperlink.
 * @property {string} style - CSS class modifier for button styling (e.g. 'btn-steam').
 * @property {string} icon - CSS class for FontAwesome or relative path for SVG icon.
 * @property {'fa'|'img'} iconType - Rendering strategy for the icon asset.
 */

/**
 * @typedef {Object} ProjectData
 * @property {string} title - The official project title.
 * @property {string} description - Brief summary of the gameplay and technical scope.
 * @property {string} [developer] - Studio or entity credited with development.
 * @property {string} [contribution] - Specific engineering responsibilities and mechanics.
 * @property {MediaItem[]} media - Array of showcase media items (videos and screenshots).
 * @property {ProjectButton[]} [buttons] - Interactive external links (Steam, Store, etc.).
 */

/**
 * Registry of portfolio projects indexed by their unique slug identifier.
 * Ordered to match the physical cartridge grid layout.
 * @type {Record<string, ProjectData>}
 */
const projectData = {
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

// =============================================================================
// 2. DOM ELEMENT REFERENCES & STATE
// =============================================================================

/** @type {HTMLElement|null} The expanded cartridge container */
const display = document.getElementById('project-display');

/** @type {NodeListOf<HTMLButtonElement>} All interactive cartridge buttons in the grid */
const buttons = document.querySelectorAll('.cartridge-btn');

/** @type {number|null} Timer ID for debouncing video autoplay checks during scrolling */
let scrollDebounceTimer = null;

// =============================================================================
// 3. MEDIA CAROUSEL & PLAYBACK CONTROLS
// =============================================================================

/**
 * Smoothly scrolls the carousel track horizontally by one slide width.
 * @param {HTMLElement} track - The .carousel-track element.
 * @param {number} direction - -1 to scroll left (previous), 1 to scroll right (next).
 */
function scrollCarousel(track, direction) {
    if (!track) return;
    stopTrackVideos(track);
    const scrollAmount = track.clientWidth * direction;
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

/**
 * Scrolls the carousel track directly to a specific slide index.
 * @param {HTMLElement} track - The .carousel-track element.
 * @param {number} index - 0-based target slide index.
 */
function goToSlide(track, index) {
    if (!track) return;
    stopTrackVideos(track);
    track.scrollTo({ left: track.clientWidth * index, behavior: 'smooth' });
}

/**
 * Updates the disabled appearance and clickability of previous/next arrow buttons
 * based on the carousel track's scroll boundary position.
 * @param {HTMLElement} track - The .carousel-track element.
 */
function updateArrows(track) {
    if (!track) return;
    const container = track.parentElement;
    if (!container) return;

    const prevBtn = container.querySelector('.carousel-prev');
    const nextBtn = container.querySelector('.carousel-next');
    if (!prevBtn || !nextBtn) return;

    // 5px threshold accommodates sub-pixel rounding variances across high-DPI displays
    const isAtStart = track.scrollLeft <= 5;
    const isAtEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;

    prevBtn.style.opacity = isAtStart ? '0.3' : '1';
    prevBtn.style.pointerEvents = isAtStart ? 'none' : 'auto';

    nextBtn.style.opacity = isAtEnd ? '0.3' : '1';
    nextBtn.style.pointerEvents = isAtEnd ? 'none' : 'auto';
}

/**
 * Updates the active visual state and accessibility attributes of pagination dots.
 * @param {HTMLElement} track - The .carousel-track element.
 */
function updateIndicators(track) {
    if (!track || !track.clientWidth || !display) return;
    const dots = display.querySelectorAll('.carousel-dot');
    if (!dots.length) return;

    const index = Math.round(track.scrollLeft / track.clientWidth);
    dots.forEach((dot, i) => {
        const isActive = i === index;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
}

/**
 * Pauses all video elements inside a carousel track.
 * @param {HTMLElement} track - The .carousel-track element.
 */
function stopTrackVideos(track) {
    if (!track) return;
    const videos = track.querySelectorAll('video');
    videos.forEach(v => v.pause());
}

/**
 * Determines the currently visible slide in the track and starts video playback if applicable.
 * @param {HTMLElement} track - The .carousel-track element.
 */
function playVisibleVideo(track) {
    if (!track || !track.clientWidth) return;
    stopTrackVideos(track);

    const index = Math.round(track.scrollLeft / track.clientWidth);
    const activeSlide = track.children[index];
    if (!activeSlide) return;

    const video = activeSlide.querySelector('video');
    if (video) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay blocked by browser policy; user can trigger playback manually via controls
            });
        }
    }
}

/**
 * Unified scroll event handler for the carousel track.
 * Updates controls immediately, then debounces video autoplay detection.
 * @param {HTMLElement} track - The .carousel-track element.
 */
function handleTrackScroll(track) {
    updateArrows(track);
    updateIndicators(track);

    if (scrollDebounceTimer) {
        clearTimeout(scrollDebounceTimer);
    }
    scrollDebounceTimer = setTimeout(() => {
        playVisibleVideo(track);
    }, 150);
}

// =============================================================================
// 4. PROJECT DISPLAY LIFECYCLE & ROUTING
// =============================================================================

/**
 * Synchronizes the active highlight and accessibility attributes across all cartridge buttons.
 * @param {string|null} id - The active project ID, or null to clear all active states.
 */
function setActiveCartridge(id) {
    buttons.forEach(btn => {
        const isActive = btn.dataset.id === id;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });
}

/**
 * Renders the expanded project view for the specified project ID.
 * Generates DOM markup, wires event listeners programmatically, and updates navigation history.
 * @param {string} id - The project identifier matching a key in `projectData`.
 * @param {boolean} [updateHistory=true] - Whether to push a new URL hash state to browser history.
 */
function openProject(id, updateHistory = true) {
    const data = projectData[id];
    if (!data || !display) return;

    setActiveCartridge(id);

    // 1. Generate Media Slides Markup
    const slidesHtml = data.media.map(item => {
        const content = item.type === 'video'
            ? `<video src="${item.url}" controls playsinline muted preload="metadata"></video>`
            : `<img src="${item.url}" alt="${data.title}" loading="lazy">`;
        return `<div class="slide">${content}</div>`;
    }).join('');

    // 2. Generate Carousel Pagination Indicators (if multi-slide)
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

    // 3. Generate Studio Credit & Optional Contribution Lines
    const devCredit = data.developer
        ? `<strong>Credit:</strong> ${data.developer}`
        : `<strong>Personal Project</strong>`;

    const contribHtml = (data.developer && data.contribution)
        ? `<p><strong>Contribution:</strong> ${data.contribution}</p>`
        : '';

    // 4. Generate Accessible Action Buttons
    const buttonsHtml = (data.buttons || []).map(b => {
        const iconHtml = b.iconType === 'img'
            ? `<img src="${b.icon}" class="btn-icon-custom" alt="">`
            : `<i class="${b.icon}"></i>`;
        return `
            <a href="${b.url}" target="_blank" rel="noopener noreferrer" class="btn-base ${b.style}">
                ${iconHtml} ${b.text}
            </a>`;
    }).join('');

    // 5. Render Structure into Display Container
    display.innerHTML = `
        <div class="display-header">
            <button class="cartridge-ctrl close-btn" aria-label="Close Project">&#10006;</button>
        </div>
        <div class="carousel-container">
            <button class="cartridge-ctrl carousel-prev" aria-label="Previous Slide">&#10094;</button>
            <div class="carousel-track">${slidesHtml}</div>
            <button class="cartridge-ctrl carousel-next" aria-label="Next Slide">&#10095;</button>
        </div>
        ${indicatorsHtml}
        <div class="display-content-wrap">
            <h2>${data.title}</h2>
            <p>${data.description}</p>
            ${contribHtml}
            <p>${devCredit}</p>
            ${buttonsHtml ? `<div class="project-actions">${buttonsHtml}</div>` : ''}
        </div>
    `;

    display.style.display = 'flex';

    // 6. Bind Programmatic Event Handlers
    const track = display.querySelector('.carousel-track');
    const closeBtn = display.querySelector('.close-btn');
    const prevBtn = display.querySelector('.carousel-prev');
    const nextBtn = display.querySelector('.carousel-next');
    const dots = display.querySelectorAll('.carousel-dot');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeProject(true));
    }
    if (prevBtn && track) {
        prevBtn.addEventListener('click', () => scrollCarousel(track, -1));
    }
    if (nextBtn && track) {
        nextBtn.addEventListener('click', () => scrollCarousel(track, 1));
    }
    if (track) {
        track.addEventListener('scroll', () => handleTrackScroll(track), { passive: true });
        if ('onscrollend' in window) {
            track.addEventListener('scrollend', () => playVisibleVideo(track));
        }
    }
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            if (track) goToSlide(track, idx);
        });
    });

    // 7. Initialize Control States & Autoplay First Slide
    if (track) {
        updateArrows(track);
        updateIndicators(track);
        playVisibleVideo(track);
    }

    // 8. Push History State (guard against duplicate entries)
    if (updateHistory && window.location.hash !== '#' + id) {
        history.pushState({ projectId: id }, '', '#' + id);
    }

    display.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Closes the project display, halts all playing media, and resets the URL hash.
 * @param {boolean} [updateHistory=true] - Whether to strip the hash from the browser URL history.
 */
function closeProject(updateHistory = true) {
    if (!display) return;

    // Cancel any pending debounced video playback checks
    if (scrollDebounceTimer) {
        clearTimeout(scrollDebounceTimer);
        scrollDebounceTimer = null;
    }

    setActiveCartridge(null);

    const track = display.querySelector('.carousel-track');
    if (track) {
        stopTrackVideos(track);
    }

    // Unload content and hide display
    display.innerHTML = '';
    display.style.display = 'none';

    // Clean URL hash without reloading page
    if (updateHistory && window.location.hash) {
        history.pushState(null, '', window.location.pathname + window.location.search);
    }

    // Smoothly return focus to the cartridge grid
    const grid = document.querySelector('.project-grid');
    if (grid) {
        setTimeout(() => {
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }
}

// =============================================================================
// 5. GLOBAL EVENT LISTENERS & INITIALIZATION
// =============================================================================

// Cartridge button click bindings
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (id) openProject(id, true);
    });
});

// Global keyboard controls: Escape closes project, ArrowLeft/ArrowRight navigates slides
document.addEventListener('keydown', (e) => {
    if (!display || display.style.display !== 'flex') return;

    if (e.key === 'Escape') {
        closeProject(true);
    } else if (e.key === 'ArrowLeft') {
        const track = display.querySelector('.carousel-track');
        const prevBtn = display.querySelector('.carousel-prev');
        if (track && prevBtn && prevBtn.style.pointerEvents !== 'none') {
            scrollCarousel(track, -1);
        }
    } else if (e.key === 'ArrowRight') {
        const track = display.querySelector('.carousel-track');
        const nextBtn = display.querySelector('.carousel-next');
        if (track && nextBtn && nextBtn.style.pointerEvents !== 'none') {
            scrollCarousel(track, 1);
        }
    }
});

// Deep linking: Handle browser Back / Forward history navigation
window.addEventListener('popstate', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && projectData[hash]) {
        openProject(hash, false);
    } else if (display && display.style.display === 'flex') {
        closeProject(false);
    }
});

// Deep linking: Open project automatically on initial page load if hash exists
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && projectData[hash]) {
        openProject(hash, false);
    }
});

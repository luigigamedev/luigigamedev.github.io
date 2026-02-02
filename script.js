const projectData = {
    "project-1": {
        title: "Arcade Raycast Car Controller",
        description: "A physics-based vehicle controller using raycasts for arcade-style handling in Unity. Features suspension simulation and drift mechanics.",
        developer: "Izyplay Game Studio",
        media: [
            { type: "image", url: "images/arcade-car.jpg" },
            { type: "image", url: "images/proto.png" },
            { type: "youtube", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" }
        ],
        buttons: [
            { 
                text: "Source", 
                url: "https://github.com/...", 
                style: "btn-blue", 
                icon: "fa-brands fa-github", 
                iconType: "fa" 
            },
            { 
                text: "Itch.io", 
                url: "https://itch.io/...", 
                style: "btn-red", 
                icon: "assets/icons/itchio.png", // Your custom file
                iconType: "img" 
            }
        ]
    },
    "project-2": {
        title: "Unreal Football",
        description: "A high-performance sports mechanics prototype built in Unreal Engine 5. Focus on animation blending and ball physics.",
        media: [
            { type: "image", url: "images/unreal-football.gif" },
            { type: "image", url: "images/lge.jpg" }
        ],
        buttons: [
            { 
                text: "Source", 
                url: "https://github.com/...", 
                style: "btn-blue", 
                icon: "fa-brands fa-github", 
                iconType: "fa" 
            },
            { 
                text: "Itch.io", 
                url: "https://itch.io/...", 
                style: "btn-red", 
                icon: "assets/icons/itchio.png", // Your custom file
                iconType: "img" 
            }
        ]
    },
    "project-3": {
        title: "LGE Engine",
        description: "A custom 2D game engine built from scratch in C++ focusing on low-level optimization, memory management, and batch rendering.",
        developer: "Izyplay Game Studio",
        media: [
            { type: "image", url: "images/lge.jpg" }
        ],
        buttons: [
            { 
                text: "Source", 
                url: "https://github.com/...", 
                style: "btn-blue", 
                icon: "fa-brands fa-github", 
                iconType: "fa" 
            },
            { 
                text: "Itch.io", 
                url: "https://itch.io/...", 
                style: "btn-red", 
                icon: "assets/icons/itchio.png", // Your custom file
                iconType: "img" 
            }
        ]
    },
    "project-4": {
        title: "Proto",
        description: "Rapid prototyping project exploring procedural generation and player movement constraints.",
        media: [
            { type: "image", url: "images/proto.png" },
            { type: "image", url: "images/arcade-car.jpg" }
        ],
        buttons: [
            { 
                text: "Source", 
                url: "https://github.com/...", 
                style: "btn-blue", 
                icon: "fa-brands fa-github", 
                iconType: "fa" 
            },
            { 
                text: "Itch.io", 
                url: "https://itch.io/...", 
                style: "btn-red", 
                icon: "assets/icons/itchio.png", // Your custom file
                iconType: "img" 
            }
        ]
    }
};

/**
 * Navigates the carousel and updates button states
 * direction: -1 for left, 1 for right
 */
function scrollCarousel(btn, direction) {
    const container = btn.parentElement;
    const track = container.querySelector('.carousel-track');
    
    // Calculate distance based on the visible width of the track
    const scrollAmount = track.clientWidth * direction;
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

/**
 * Monitors scroll position to disable/enable arrows at boundaries
 */
function updateArrows(track) {
    const container = track.parentElement;
    const prevBtn = container.querySelector('button:first-child');
    const nextBtn = container.querySelector('button:last-child');

    // Check if we are at the far left or far right
    // We use a 5px buffer to account for sub-pixel rendering/rounding
    const isAtStart = track.scrollLeft <= 5;
    const isAtEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;

    prevBtn.style.opacity = isAtStart ? "0.3" : "1";
    prevBtn.style.pointerEvents = isAtStart ? "none" : "auto";

    nextBtn.style.opacity = isAtEnd ? "0.3" : "1";
    nextBtn.style.pointerEvents = isAtEnd ? "none" : "auto";
}

function closeProject() {
    const display = document.getElementById('project-display');
    
    // Returns user to top of page to avoid "dead space" jump when box vanishes
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Instantly removes element from layout
    display.style.display = 'none';
}

const display = document.getElementById('project-display');
const buttons = document.querySelectorAll('.cartridge-btn');

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const data = projectData[id];

        if (data) {
            display.style.display = 'flex';

            // 1. Generate Media Slides
            const slidesHtml = data.media.map(item => {
                const content = item.type === 'youtube' 
                    ? `<iframe src="${item.url}" allowfullscreen></iframe>`
                    : `<img src="${item.url}" alt="${data.title}">`;
                return `<div class="slide">${content}</div>`;
            }).join('');

            // 2. Generate Credit Line
            const devCredit = data.developer 
                ? `Credit: <strong>${data.developer}</strong>` 
                : `<strong>Personal Project</strong>`;

            // 3. Generate Buttons
            const buttonsHtml = (data.buttons || []).map(b => {
                const iconHtml = b.iconType === 'img'
                    ? `<img src="${b.icon}" class="btn-icon-custom" alt="">`
                    : `<i class="${b.icon}"></i>`;
                return `
                    <button class="btn-base ${b.style}" onclick="window.open('${b.url}', '_blank')">
                        ${iconHtml} ${b.text}
                    </button>`;
            }).join('');

            // 4. Render
            display.innerHTML = `
                <div class="display-header">
                    <button class="cartridge-ctrl" onclick="closeProject()">&#10006;</button>
                </div>
                <div class="carousel-container">
                    <button class="cartridge-ctrl" onclick="scrollCarousel(this, -1)">&#10094;</button>
                    <div class="carousel-track" onscroll="updateArrows(this)">${slidesHtml}</div>
                    <button class="cartridge-ctrl" onclick="scrollCarousel(this, 1)">&#10095;</button>
                </div>
                <div class="display-content-wrap">
                    <h2>${data.title}</h2>
                    <p>${data.description}</p>
                    <p>${devCredit}</p>
                    <div class="project-actions">${buttonsHtml}</div>
                </div>
            `;

            const newTrack = display.querySelector('.carousel-track');
            updateArrows(newTrack);
            display.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
});

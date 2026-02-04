const projectData = {
    "arcc": {
        title: "Arcade Raycast Car Controller",
        description: "A custom car controller for arcade-style games. Released on the Unity Asset Store.",
        media: [
            { type: "video", url: "assets/projects/arcc/soccar.mp4" },
            { type: "video", url: "assets/projects/arcc/crash.mp4" },
            { type: "image", url: "assets/projects/arcc/cardimage.png" },
            { type: "image", url: "assets/projects/arcc/screenshot03.png" }
        ],
        buttons: [
            { 
                text: "Play on Itch.io", 
                url: "https://luigigamedev.itch.io/arcade-car-controller-v2-demo", 
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
    "apocalypse": {
        title: "Apocalypse: Party's Over",
        description: "A 2D, side-scrolling beat'em up game featuring the cartoons of Mundo Canibal and Piologo Brothers. Released on Steam.",
        developer: "Izyplay Game Stu",
        media: [
            { type: "image", url: "assets/projects/apocalypse/print06.jpg" },
            { type: "video", url: "assets/projects/apocalypse/sequence01.mp4" },
            { type: "image", url: "assets/projects/apocalypse/print06.jpg" }
        ],
        buttons: [
            { 
                text: "Play on Steam", 
                url: "https://store.steampowered.com/app/368800", 
                style: "btn-steam", 
                icon: "fa-brands fa-steam", 
                iconType: "fa" 
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
    
    stopVideos();

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
    
    // STOP & UNLOAD
    display.innerHTML = ''; 
    display.style.display = 'none';
    
    // SCROLL TO GRID
    const grid = document.querySelector('.project-grid'); // Target your grid
    if (grid) 
    {
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function stopVideos() {
    const track = document.querySelector('.carousel-track');
    if (track) 
        {
        const videos = track.querySelectorAll('video');
        videos.forEach(v => v.pause());
    }
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
                const content = item.type === 'video' 
                    ? `<video src="${item.url}" controls playsinline></video>`
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
                    <div class="carousel-track" onscroll="updateArrows(this); stopVideos();">${slidesHtml}</div>
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

const projectData = {
    "project-1": {
        title: "Arcade Raycast Controller",
        description: "A physics-based vehicle controller using raycasts for arcade-style handling in Unity. Features suspension simulation and drift mechanics.",
        media: [
            { type: "image", url: "images/arcade-car.jpg" },
            { type: "image", url: "images/proto.png" },
            { type: "youtube", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" }
        ]
    },
    "project-2": {
        title: "Unreal Football",
        description: "A high-performance sports mechanics prototype built in Unreal Engine 5. Focus on animation blending and ball physics.",
        media: [
            { type: "image", url: "images/unreal-football.gif" },
            { type: "image", url: "images/lge.jpg" }
        ]
    },
    "project-3": {
        title: "LGE Engine",
        description: "A custom 2D game engine built from scratch in C++ focusing on low-level optimization, memory management, and batch rendering.",
        media: [
            { type: "image", url: "images/lge.jpg" }
        ]
    },
    "project-4": {
        title: "Proto",
        description: "Rapid prototyping project exploring procedural generation and player movement constraints.",
        media: [
            { type: "image", url: "images/proto.png" },
            { type: "image", url: "images/arcade-car.jpg" }
        ]
    }
};

const display = document.getElementById('project-display');
const buttons = document.querySelectorAll('.cartridge-btn');

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const data = projectData[id];

        if (data) {
            display.style.display = 'flex';

            const slidesHtml = data.media.map(item => {
                if (item.type === 'youtube') {
                    return `<div class="slide"><iframe src="${item.url}" allowfullscreen></iframe></div>`;
                } else {
                    return `<div class="slide"><img src="${item.url}" alt="${data.title}"></div>`;
                }
            }).join('');

            const prevBtn = data.media.length > 1 
                ? `<button class="cartridge-ctrl" onclick="const t=this.nextElementSibling; t.scrollBy({left: -t.clientWidth, behavior: 'smooth'})">&#10094;</button>` 
                : '';
            
            const nextBtn = data.media.length > 1 
                ? `<button class="cartridge-ctrl" onclick="const t=this.previousElementSibling; t.scrollBy({left: t.clientWidth, behavior: 'smooth'})">&#10095;</button>` 
                : '';

            display.innerHTML = `
                <div class="display-header">
                    <button class="cartridge-ctrl" onclick="closeProject()">&#10006;</button>
                </div>
                <div class="carousel-container">
                    ${prevBtn}
                    <div class="carousel-track">
                        ${slidesHtml}
                    </div>
                    ${nextBtn}
                </div>
                <h2>${data.title}</h2>
                <p>${data.description}</p>
            `;

            display.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
});

function closeProject() {
    const display = document.getElementById('project-display');
    
    // 1. Reset scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 2. Immediate hide
    display.style.display = 'none';
}
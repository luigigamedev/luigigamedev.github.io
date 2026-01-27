const projectData = {
    "project-1": {
        title: "Arcade Raycast Controller",
        description: "A physics-based vehicle controller using raycasts for arcade-style handling in Unity.",
        image: "images/arcade-car.jpg"
    },
    "project-2": {
        title: "Unreal Football",
        description: "A high-performance sports mechanics prototype built in Unreal Engine 5.",
        image: "images/unreal-football.gif"
    },
    "project-3": {
        title: "LGE Engine",
        description: "A custom 2D game engine built from scratch in C++ focusing on low-level optimization.",
        image: "images/lge.jpg"
    },
    "project-4": {
        title: "Proto",
        description: "Rapid prototyping project exploring procedural generation and player movement.",
        image: "images/proto.png"
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

            // Removed the button from here
            display.innerHTML = `
                <img src="${data.image}" alt="${data.title}">
                <h2>${data.title}</h2>
                <p>${data.description}</p>
            `;

            display.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
});
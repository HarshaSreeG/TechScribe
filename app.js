// Team members data
const teamMembers = [
    {
        name: "Sharanya Chanda",
        avatar: "img/sharanya.jpg?height=150&width=150",
        skills: "Full-stack development, AI/ML",
        interests: "Exploring new technologies and their applications in solving real-world problems.",
        hometown: { lat: 17.4065, lon: 78.4772, city: "Hydrebad" }
    },
    {
        name: "Divya Yadavalli",
        avatar: "img/divya.jpg?height=150&width=150",
        skills: "UI/UX Design, Front-end development",
        interests: "Creating intuitive and accessible user interfaces for web and mobile applications.",
        hometown: { lat: 16.3067, lon: 80.4365, city: "Guntur" }
    },
    {
        name: "Adepoju Odunayo",
        avatar: "img/odun.jpg?height=150&width=150",
        skills: "Web Development, Machine Learning",
        interests: "Optimizing deployment processes and building scalable cloud solutions.",
        hometown: { lat: 7.7827, lon: 4.5418, city: "Osogbo" }
    },
    {
        name: "Harsha Sree Gudapati",
        avatar: "img/Harsha.jpg?height=150&width=150",
        skills: "DevOps, Cloud Architecture",
        interests: "Optimizing deployment processes and building scalable cloud solutions.",
        hometown: { lat: 17.0005, lon: 81.8040, city: "Rajahmundry" }
    },
    {
        name: "Perala, Vyshnavi",
        avatar: "img/vashnavi.jpg?height=150&width=150",
        skills: "Software Engineering, System Administration",
        interests: "Providing IT solution to small businesses and organization.",
        hometown: { lat: 19.0760, lon: 72.8777, city: "Rajahmundry" }
    }
];

// Past work data
const pastWork = [
    {
        title: "E-commerce Platform",
        description: "A fully responsive online store with integrated payment gateway.",
        image: "img/ecommerce.jpg?height=200&width=300"
    },
    {
        title: "Task Management App",
        description: "A collaborative tool for teams to organize and track projects.",
        image: "img/task.jpg?height=200&width=300"
    },
    {
        title: "Emotion Awareness App",
        description: "A Web application that allows you to monitor your emotional state",
        image: "img/emotion.png?height=200&width=300"
    }
];

// University of Cincinnati coordinates
const universityOfCincinnati = { lat: 39.1329, lon: -84.5150, city: "Cincinnati" };

// Function to render team profiles
function renderTeamProfiles() {
    const teamProfilesContainer = document.getElementById('team-profiles');
    teamMembers.forEach(member => {
        const memberElement = document.createElement('div');
        memberElement.classList.add('team-member', 'card');
        memberElement.innerHTML = `
            <img src="${member.avatar}" alt="${member.name}">
            <div class="card-content">
                <h3>${member.name}</h3>
                <p><strong>Skills:</strong> ${member.skills}</p>
                <p><strong>Interests:</strong> ${member.interests}</p>
            </div>
        `;
        teamProfilesContainer.appendChild(memberElement);
    });
}

// Function to create a custom icon for map markers
function createCustomIcon(imageUrl) {
    return L.icon({
        iconUrl: imageUrl,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
        className: 'rounded-marker'
    });
}

// Function to initialize the map
function initMap() {
    // Center point that includes Cincinnati, Nigeria, and India
    const centerLat = 20;
    const centerLon = 0;
    const map = L.map('team-map').setView([centerLat, centerLon], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add University of Cincinnati marker
    const uniIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/8074/8074808.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
    L.marker([universityOfCincinnati.lat, universityOfCincinnati.lon], { icon: uniIcon })
        .addTo(map)
        .bindPopup('<b>University of Cincinnati</b>');

    teamMembers.forEach(member => {
        const customIcon = createCustomIcon(member.avatar);
        const startMarker = L.marker([member.hometown.lat, member.hometown.lon], { icon: customIcon })
            .addTo(map)
            .bindPopup(`<b>${member.name}</b><br>${member.hometown.city}`);

        // Create a visually appealing track from hometown to University of Cincinnati
        const trackCoordinates = [
            [member.hometown.lat, member.hometown.lon],
            [universityOfCincinnati.lat, universityOfCincinnati.lon]
        ];
        
        // Create an arc between the two points
        const latlngs = [];
        const steps = 50;
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const lat = member.hometown.lat * (1-t) + universityOfCincinnati.lat * t;
            const lon = member.hometown.lon * (1-t) + universityOfCincinnati.lon * t;
            const alt = Math.sin(Math.PI * t) * 500000; // Max altitude of 500km
            latlngs.push([lat, lon, alt]);
        }

        const track = L.polyline(latlngs, {
            color: getRandomColor(),
            weight: 3,
            opacity: 0.7,
            smoothFactor: 1
        }).addTo(map);

        // Animate avatar along the track
        animateAvatar(map, member, latlngs, customIcon);
    });
}

// Function to generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to animate avatar along the track
function animateAvatar(map, member, coordinates, icon) {
    let step = 0;
    const numSteps = coordinates.length;
    const duration = 80000; // 10 seconds
    const intervalTime = duration / numSteps;

    const movingMarker = L.marker(coordinates[0], { icon: icon }).addTo(map);

    function animate() {
        if (step < numSteps) {
            movingMarker.setLatLng(coordinates[step]);
            step++;
            setTimeout(animate, intervalTime);
        } else {
            movingMarker.bindPopup(`<b>All Team Members</b><br>Arrived at University of Cincinnati`).openPopup();
        }
    }

    animate();
}

// Function to render past work
function renderPastWork() {
    const workGallery = document.getElementById('work-gallery');
    pastWork.forEach(work => {
        const workElement = document.createElement('div');
        workElement.classList.add('card');
        workElement.innerHTML = `
            <img src="${work.image}" alt="${work.title}">
            <div class="card-content">
                <h3>${work.title}</h3>
                <p>${work.description}</p>
            </div>
        `;
        workGallery.appendChild(workElement);
    });
}

// Function to toggle mobile menu
function toggleMobileMenu() {
    const nav = document.querySelector('nav ul');
    nav.classList.toggle('show');
}

// Slider functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(index) {
    if (index < 0) {
        currentSlide = totalSlides - 1;
    } else if (index >= totalSlides) {
        currentSlide = 0;
    } else {
        currentSlide = index;
    }

    const offset = currentSlide * -100;
    document.querySelector('.slider').style.transform = `translateX(${offset}%)`;
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Team slider functionality
const teamSlider = document.getElementById('team-profiles');
let teamSliderPosition = 0;

function moveTeamSlider(direction) {
    const teamMembers = document.querySelectorAll('.team-member');
    const memberWidth = teamMembers[0].offsetWidth + 20; // 20px for margin
    const visibleMembers = 2;

    if (direction === 'next') {
        teamSliderPosition -= memberWidth;
        if (Math.abs(teamSliderPosition) >= (teamMembers.length - visibleMembers + 1) * memberWidth) {
            teamSliderPosition = 0;
        }
    } else {
        teamSliderPosition += memberWidth;
        if (teamSliderPosition > 0) {
            teamSliderPosition = -(teamMembers.length - visibleMembers) * memberWidth;
        }
    }

    teamSlider.style.transform = `translateX(${teamSliderPosition}px)`;
}

function nextTeamSlide() {
    moveTeamSlider('next');
}

function prevTeamSlide() {
    moveTeamSlider('prev');
}

// Initialize the application
function init() {
    renderTeamProfiles();
    initMap();
    renderPastWork();

    // Add event listener for mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    menuToggle.addEventListener('click', toggleMobileMenu);

    // Add event listeners for main slider buttons
    document.querySelector('.slider-button.next').addEventListener('click', nextSlide);
    document.querySelector('.slider-button.prev').addEventListener('click', prevSlide);

    // Add event listeners for team slider buttons
    document.querySelector('.team-next').addEventListener('click', nextTeamSlide);
    document.querySelector('.team-prev').addEventListener('click', prevTeamSlide);

    // Auto-advance main slider every 5 seconds
    setInterval(nextSlide, 5000);
}

// Run the initialization when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
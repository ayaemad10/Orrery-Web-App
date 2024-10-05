 // Initialize the scene, camera, and renderer
 const scene = new THREE.Scene();
 const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
 const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('orreryCanvas'), antialias: true });
 renderer.setSize(window.innerWidth, window.innerHeight);
 renderer.setPixelRatio(window.devicePixelRatio);  // High-resolution rendering

 // Add lighting for better visuals
 const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
 scene.add(ambientLight);

 const pointLight = new THREE.PointLight(0xffffff, 1);
 pointLight.position.set(50, 50, 50);
 scene.add(pointLight);

 // Set up the solar system data
 const SUN_RADIUS = 5;
 const PLANET_RADIUS = 1;
 const ORBIT_SEGMENTS = 256;  // Increased number of segments for smoother orbits
 const SPHERE_SEGMENTS = 64;  // High number of segments for smoother planets

 // Define planet colors
 const planetColor = {
     Mercury: 0x808080,
     Venus: 0xffff00,
     Earth: 0x0000ff,
     Mars: 0xff0000,
     Jupiter: 0xffa500,
     Saturn: 0xffd700,
     Uranus: 0x87cefa,
     Neptune: 0x000080
 };

 // Data for 8 planets (semi-major axis in AU and approximate orbital speed and rotation speed)
 const planets = [
     { name: "Mercury", semiMajorAxis: 0.39 * 50, eccentricity: 0.205, speed: 0.04, rotationSpeed: 0.01, info: "Mercury:The smallest planet in our solar system, fastest planet and nearest to the Sun. Mercury is surface temperatures :extremely hot and cold(can reach highs of 800°F (430°C)). Days: 88 Earth days. Namesake: is appropriately named for the swiftest of the ancient Roman gods. Size: With a radius of 1,516 miles (2,440 kilometers). Distance: 0.4 astronomical units away from the Sun. Moons:Mercury doesn't have moons. Mass: 0.330(1024kg)." },

     { name: "Venus", semiMajorAxis: 0.72 * 50, eccentricity: 0.007, speed: 0.02, rotationSpeed: 0.008, info: "Venus: the third brightest object in the sky after the Sun and Moon and the hottest planet in our solar system with surface temperatures hot enough to melt lead. Days: 224.7 Earth day.Namesake: Venus is named for the ancient Roman goddess of love and beauty, who was known as Aphrodite to the ancient Greeks. Size: Its diameter at its equator is about 7,521 miles (12,104 kilometers). Distance: 0.72 astronomical units. Moons: doesn’t have a moon. Mass: 4.87(1024kg)." },

     { name: "Earth", semiMajorAxis: 1.0 * 50, eccentricity: 0.017, speed: 0.01, rotationSpeed: 0.005, info: "Earth: Our home planet, Earth, has a day that lasts about 24 hours. The name \"Earth\" comes from the Old English word \"eorðe,\" meaning \"ground.\" It is the third-largest planet in our solar system, with a diameter of about 7,917 miles (12,742 kilometers), and it orbits the Sun at an average distance of approximately 93 million miles (150 million kilometers). Earth has one moon, commonly referred to as \"the Moon,\" and is the most massive planet in the terrestrial group, which includes Mercury, Venus, Earth, and Mars." },

     { name: "Mars", semiMajorAxis: 1.52 * 50, eccentricity: 0.093, speed: 0.008, rotationSpeed: 0.006, info: "Mars, often called the Red Planet, is named after the ancient Roman god of war due to its reddish appearance. A Martian day, known as a “sol,” lasts about 24 hours and 37 minutes, slightly longer than an Earth day. Mars is about half the size of Earth, with a diameter of approximately 4,212 miles (6,779 kilometers). It is the fourth planet from the Sun, averaging a distance of 142 million miles (228 million kilometers). Mars has two small moons, Phobos and Deimos, and its mass is roughly 10% that of Earth." },

     { name: "Jupiter", semiMajorAxis: 5.2 * 50, eccentricity: 0.049, speed: 0.002, rotationSpeed: 0.003, info: "Known as the gas giant, Jupiter has a day that lasts a mere 9.92 Earth hours, indicating its rapid spin on its axis. Named after the king of the Roman gods, Jupiter is the largest planet in our solar system, with a diameter more than 11 times that of Earth, capable of swallowing over 1,000 Earths! It orbits the Sun at an average distance of about 5.2 astronomical units (AU), roughly five times the distance between Earth and the Sun. As of 2024, Jupiter has 95 confirmed moons, including the famous Galilean moons: Io, Europa, Ganymede, and Callisto. Jupiter accounts for more than two-thirds of the total mass of all the planets in our solar system combined and features the Great Red Spot, an iconic storm larger than Earth. It is primarily composed of hydrogen and helium, possessing the strongest magnetic field of any planet in the solar system." },
     
     { name: "Saturn", semiMajorAxis: 9.58 * 50, eccentricity: 0.056, speed: 0.001, rotationSpeed: 0.002, info: "Saturn: Often referred to as the pearl of the solar system, Saturn's day is relatively short, lasting about 10.7 hours, making it less than half a day on Earth. Named after the Roman god of agriculture, wealth, and time, Saturn is the second-largest planet in the solar system, approximately nine times the size of Earth. It orbits the Sun at a distance of about 886 million miles (1.4 billion kilometers), which is about nine times the distance between Earth and the Sun. With 83 known moons, including famous ones like Titan, Enceladus, and Rhea, Saturn has the most moons in our solar system. Its mass is about 95 times that of Earth, and its iconic rings are one of its most distinctive features." },

     { name: "Uranus", semiMajorAxis: 19.22 * 50, eccentricity: 0.046, speed: 0.0004, rotationSpeed: 0.001, info: "Uranus: Known as the tilted ice giant, a Uranian day lasts about 17 Earth hours. Uranus is named after the Greek god of the sky and is the third-largest planet in our solar system, with a diameter about four times that of Earth. It is located approximately 1.8 billion miles (2.9 billion kilometers) from the Sun, making it the seventh planet in the solar system. Uranus has 28 known moons, many of which are named after characters from Shakespeare's plays, and it has a mass about 14.5 times that of Earth.." },
    
     { name: "Neptune", semiMajorAxis: 30.05 * 50, eccentricity: 0.010, speed: 0.0003, rotationSpeed: 0.001, info: "Neptune: Referred to as the distant ice giant, a Neptunian day lasts about 16 Earth hours. It is the fourth-largest planet in our solar system, with a diameter about four times that of Earth. Neptune is the farthest planet from the Sun, averaging about 2.8 billion miles away. It has 16 known moons, with Triton being the most famous due to its unique orbit, which goes against the planet’s rotation. Neptune's mass is 17 times that of Earth, making it the third-most-massive planet in our solar system." }
 ];




 // Zoom in on the selected planet
 let isTracking = false; // To determine if we are currently tracking the planet

 function zoomToPlanet(planetName) {
     const planet = planets.find(p => p.name.toLowerCase() === planetName.toLowerCase());
     if (planet) {
         // Stop any existing tracking before starting new tracking
         if (isTracking) {
             cancelAnimationFrame(trackingAnimation);
         }
 
         isTracking = true; // Set tracking state
         displayPlanetInfo(planet); // Display information about the planet
 
         // Set the camera to track the planet
         function trackPlanet() {
             // Calculate the tracking position
             camera.position.x = planet.object.position.x + 20; // Adjust these values for desired distance
             camera.position.y = planet.object.position.y + 10;  // Adjust for vertical angle
             camera.position.z = planet.object.position.z + 20;  // Adjust for desired distance
 
             camera.lookAt(planet.object.position); // Keep the camera looking at the planet
 
             trackingAnimation = requestAnimationFrame(trackPlanet); // Keep tracking in the next frame
         }
 
         trackPlanet(); // Start the tracking
     }
 }
 

 function stopTracking() {
    isTracking = false; // Update tracking state
    cancelAnimationFrame(trackingAnimation); // Stop the tracking animation

    // Reset the camera position
    camera.position.set(0, 20, 100); // Adjust this as necessary for your scene
    camera.lookAt(0, 0, 0); // Look at the center of the scene (or adjust as needed)

    if (currentLabel) {
        scene.remove(currentLabel); // Remove the label from the scene
        currentLabel = null; // Reset the label variable
    }

    // Hide the information box (if necessary)
    const infoBox = document.getElementById('infoBox');
    infoBox.style.display = 'none';
}

function exitPage() {
    // Logic to exit or close the application, e.g., redirect to another page
    window.location.href = "https://www.google.com"; // Replace with your exit action or URL
}

function exitToNasa() {
    // Logic to exit or close the application, e.g., redirect to another page
    window.location.href = "https://www.nasa.gov/"; // Replace with your exit action or URL
}



 //Add search functionality
 document.getElementById('searchButton').addEventListener('click', () => {
     const searchInput = document.getElementById('searchInput').value;
     zoomToPlanet(searchInput);
 });


 // Add the Sun
 const sunGeometry = new THREE.SphereGeometry(SUN_RADIUS, SPHERE_SEGMENTS, SPHERE_SEGMENTS);
 const sunMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
 const sun = new THREE.Mesh(sunGeometry, sunMaterial);
 scene.add(sun);

 // Create planet objects and their orbits
 planets.forEach(planet => {
     // Add the planet
     planet.object = new THREE.Mesh(
         new THREE.SphereGeometry(PLANET_RADIUS, SPHERE_SEGMENTS, SPHERE_SEGMENTS),
         new THREE.MeshStandardMaterial({ color: planetColor[planet.name] })
     );
     scene.add(planet.object);

     // Set a random initial angle for the orbit
     planet.currentAngle = Math.random() * 2 * Math.PI;

     // Create an orbit path (using elliptical curve)
     const orbitGeometry = new THREE.BufferGeometry();
     const orbitPoints = [];

     // High-resolution orbit curve
     for (let i = 0; i <= ORBIT_SEGMENTS; i++) {
         const angle = (i / ORBIT_SEGMENTS) * 2 * Math.PI;
         const x = planet.semiMajorAxis * Math.cos(angle);
         const z = planet.semiMajorAxis * Math.sin(angle);
         orbitPoints.push(new THREE.Vector3(x, 0, z));  // Y-axis is 0 (keeping orbit on the horizontal plane)
     }

     orbitGeometry.setFromPoints(orbitPoints);

     // Create a line to represent the orbit
     const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.7, transparent: true });
     const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
     scene.add(orbitLine);

     planet.orbitLine = orbitLine; // Store the orbit line for later use
 });

 // Set camera position
 camera.position.z = 100; // Initial camera distance 

// Planets names
class PlanetNameManager {
    constructor(planets, camera) {
        this.planets = planets; // Store the planet data
        this.camera = camera; // Store the camera reference
        this.planetNameElements = {}; // Object to hold planet name elements

        // Initialize the planet name elements
        this.createPlanetNameElements();
    }

    /**
     * Creates and positions name elements for each planet.
     */
    createPlanetNameElements() {
        this.planets.forEach(planet => {
            const nameElement = document.createElement('div');
            nameElement.className = 'planet-name';
            nameElement.textContent = planet.name;

            document.body.appendChild(nameElement); // Append to the document body
            this.planetNameElements[planet.name.toLowerCase()] = nameElement; // Store element reference
        });
    }

}


// Usage Example
const planetNameManager = new PlanetNameManager(planets, camera);

 // Event listeners for mouse interactions
 let isDragging = false;
 let previousMousePosition = { x: 0, y: 0 };

 // Handle mouse down event
 document.addEventListener('mousedown', (event) => {
     isDragging = true;
 });

 // Handle mouse up event
 document.addEventListener('mouseup', (event) => {
     isDragging = false;
 });

 // Handle mouse move event
 document.addEventListener('mousemove', (event) => {
     if (isDragging) {
         const deltaX = event.clientX - previousMousePosition.x;
         const deltaY = event.clientY - previousMousePosition.y;

         // Update camera position based on mouse movement
         camera.position.x -= deltaX * 0.1;
         camera.position.y += deltaY * 0.1;
     }

     previousMousePosition = { x: event.clientX, y: event.clientY };
 });

 

 // Display planet information
 function displayPlanetInfo(planet) {
     const infoBox = document.getElementById('infoBox');
     infoBox.textContent = `${planet.name}: ${planet.info}`;
     infoBox.style.display = 'block';
 }


//  Hide planet information
 function hidePlanetInfo() {
     const infoBox = document.getElementById('infoBox');
     infoBox.style.display = 'none';
 }

 // Sidebar Action
 // Get references to the icons
 const searchIcon = document.getElementById('searchIcon');
 const viewIcon = document.getElementById('viewIcon');
 const folderIcon = document.getElementById('folderIcon');
 const soundIcon = document.getElementById('soundIcon');
 const exitIcon = document.getElementById('exitIcon');

 // Get reference to the info box
 const infoBox = document.getElementById('infoBox');

 // Function to display the info box with a message
 function displayInfo(message) {
     infoBox.style.display = 'block';
     infoBox.textContent = message;
 }

 function executeSearch() {
    const input = document.getElementById('searchInput');
    const planetName = input.value.trim(); // Get the input value

    if (planetName) {
        zoomToPlanet(planetName); // Call your existing zoom function
    } else {
        alert('Please enter a planet name.'); // Prompt if the input is empty
    }
}

 // Action for search icon (open a search modal or display a search field)
//  searchIcon.addEventListener('click', function() {
//     displayInfo("Search action triggered! Changing the view...");
//  });

 // Action for view icon (maybe toggle a 3D/2D view in your app)
 viewIcon.addEventListener('click', function() {
    hidePlanetInfo();
     // Add your view switching logic here
 });

 // Action for folder icon (open a file picker or display a list of saved files)
 folderIcon.addEventListener('click', function() {
     displayInfo("Go to Nasa for more information");
     setTimeout(() => {
        exitToNasa();
     }, 3000);
     // Add your file opening logic here
 });

 // Action for sound icon (mute/unmute sound or play sound effect)
 soundIcon.addEventListener('click', function() {
     displayInfo("Latest News");
     // Add your sound control logic here
 });

 // Action for exit icon (maybe log out, close the app, or display an exit prompt)
 exitIcon.addEventListener('click', function() {
     // Add your exit logic here
     if (isTracking){
        stopTracking();
     }else{
        exitPage();
     }
 });


 // Animation loop
function animate() {
    requestAnimationFrame(animate);

    planets.forEach(planet => {
         // Update planet position based on speed and current angle
         planet.currentAngle += planet.speed;  // Adjust the speed for more realistic movement
         planet.object.position.x = planet.semiMajorAxis * Math.cos(planet.currentAngle);
         planet.object.position.z = planet.semiMajorAxis * Math.sin(planet.currentAngle);
    });

    // planetNameManager.updatePlanetNamePositions();
     // Render the scene
        renderer.render(scene, camera);
        
}

 // Add window resize handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

 // Start animation loop
animate();
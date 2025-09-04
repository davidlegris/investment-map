//====================================================================
// Import data files
//====================================================================

import { initializeLeftPanel } from './leftPanel.js';
import { addPolygonLayer, addPointLayer } from './mapLayers.js';
import { selectedLanguage } from './languageSelector.js';

//====================================================================
// Create a global map variable
//====================================================================

let map;

//====================================================================
// Add Search Control
//====================================================================

// Function to create and add the search control
function addSearchControl() {
    // Create search container div
    const searchContainer = document.createElement('div');
    searchContainer.id = 'search-container';
    searchContainer.style.position = 'absolute';
    searchContainer.style.top = '10px';
    searchContainer.style.right = '10px';
    searchContainer.style.zIndex = '1000';
    searchContainer.style.backgroundColor = 'white';
    searchContainer.style.padding = '10px';
    searchContainer.style.borderRadius = '4px';
    searchContainer.style.boxShadow = '0 1px 5px rgba(0,0,0,0.2)';
    searchContainer.style.transition = 'opacity 0.3s ease';

    // Create search input div
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'search-input';
    searchInput.style.width = '200px';
    searchInput.style.padding = '5px';
    searchInput.style.border = '1px solid #ccc';
    searchInput.style.borderRadius = '3px';

    // Set placeholder based on language
    function updateSearchPlaceholder() {
        searchInput.placeholder = selectedLanguage === 'en' 
            ? 'Search Canadian cities...' 
            : 'Rechercher des villes canadiennes...';
    }

    // Add input to container
    searchContainer.appendChild(searchInput);
    document.getElementById('map').appendChild(searchContainer);

    // Show the search container
    searchContainer.style.display = 'block';

    // Initial placeholder update
    updateSearchPlaceholder();

    // Add event listener for search
    searchInput.addEventListener('keypress', async function(e) {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value;
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}, Canada&limit=1`);
                const data = await response.json();
                
                if (data && data.length > 0) {
                    const result = data[0];
                    const lat = parseFloat(result.lat);
                    const lon = parseFloat(result.lon);
                    
                    // Zoom to the location without adding marker
                    map.setView([lat, lon], 12);
                } else {
                    alert(selectedLanguage === 'en' 
                        ? 'Location not found. Please try another search term.'
                        : 'Emplacement non trouvé. Veuillez essayer un autre terme de recherche.');
                }
            } catch (error) {
                console.error('Error searching location:', error);
                alert(selectedLanguage === 'en'
                    ? 'Error searching location. Please try again.'
                    : 'Erreur lors de la recherche. Veuillez réessayer.');
            }
        }
    });

    // Update placeholder when language changes
    document.addEventListener('languageChanged', updateSearchPlaceholder);
    
    // Add collision detection for search bar and floating header
    function checkSearchBarCollision() {
        const searchContainer = document.getElementById('search-container');
        const floatingHeader = document.getElementById('floating-header');
        
        if (!searchContainer || !floatingHeader) return;
        
        const searchRect = searchContainer.getBoundingClientRect();
        const headerRect = floatingHeader.getBoundingClientRect();
        
        // Check if search bar overlaps with floating header
        const isColliding = !(searchRect.right < headerRect.left || 
                             searchRect.left > headerRect.right || 
                             searchRect.bottom < headerRect.top || 
                             searchRect.top > headerRect.bottom);
        
        // Hide search bar if colliding, show if not
        searchContainer.style.opacity = isColliding ? '0' : '1';
        searchContainer.style.pointerEvents = isColliding ? 'none' : 'auto';
    }
    
    // Check collision on window resize and scroll
    window.addEventListener('resize', checkSearchBarCollision);
    window.addEventListener('scroll', checkSearchBarCollision);
    
    // Check collision periodically to handle dynamic layout changes
    setInterval(checkSearchBarCollision, 500);
    
    // Initial collision check
    setTimeout(checkSearchBarCollision, 100);
}

//====================================================================
// Initialize Map
//====================================================================

// Function to initialize the map and map components
function initializeMap() {
    
    // Initialize map with a more reasonable default view for Canada
    map = L.map('map', {
        // Remove the CRS specification to use the default EPSG:4326
        center: [56.0, -106.0],
        zoom: 4,
        zoomControl: false,
        maxZoom: 19,
        minZoom: 3
    });

    // Show the map
    document.getElementById('map').style.display = 'block';
    
    // Add the tiles layer to the map (Basemap) - openstreetmap
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Add zoom control to bottom right
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // Initialize the left panel
    initializeLeftPanel();

    // Add polygon and point layers to the map
    addPolygonLayer(map);
    addPointLayer(map);

    // Add search control
    addSearchControl();
}

// Export the initialization function and map
export { initializeMap, map };

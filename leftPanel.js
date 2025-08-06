import { selectedLanguage } from './languageSelector.js';

//====================================================================
// Default Panel Messages
//====================================================================

// Function to show default message - English
function showDefaultMessageEN() {
    const content = document.getElementById("panel-content");
    content.innerHTML = `
        <div style="padding-left: 0;">
            <p style="font-size: 16px; color: #000000; margin-top: 20px;">Select any community grant data point to learn more.</p>
        </div>
    `;
}

// Function to show default message - French
function showDefaultMessageFR() {
    const content = document.getElementById("panel-content");
    content.innerHTML = `
        <div style="padding-left: 0;">
            <p style="font-size: 16px; color: #000000; margin-top: 20px;">Sélectionnez un point de données de subvention communautaire pour en savoir plus.</p>
        </div>
    `;
}

//====================================================================
// Functionality to initialize the panel
//====================================================================

export function initializeLeftPanel() {
    // Remove any existing panel
    const existingPanel = document.getElementById("side-panel");
    if (existingPanel) {
        existingPanel.remove();
    }
    
    // Create a side panel container
    const sidePanel = document.createElement("div");
    sidePanel.id = "side-panel";
    sidePanel.style.position = "absolute";
    sidePanel.style.left = "2%"; // Position 2% away from the left side
    sidePanel.style.top = "15%"; // Position from top to create a floating effect
    sidePanel.style.width = "20%"; // 20% of the map div horizontally
    sidePanel.style.height = "70%"; // 70% of the map div vertically
    sidePanel.style.backgroundColor = "white";
    sidePanel.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.3)"; // Enhanced shadow for floating effect
    sidePanel.style.borderRadius = "8px"; // Rounded corners for floating appearance
    sidePanel.style.zIndex = "1000";
    sidePanel.style.overflowY = "auto";
    sidePanel.style.padding = "20px";
    sidePanel.style.boxSizing = "border-box";
    sidePanel.style.display = "block"; // Initially visible
    sidePanel.style.transition = "all 0.3s ease"; // Smooth transition for responsive changes

    // Create a header for the panel
    const panelHeader = document.createElement("h2");
    panelHeader.id = "panel-header";
    panelHeader.style.marginTop = "0";
    panelHeader.style.color = "#D71900";
    panelHeader.style.borderBottom = "1px solid #eee";
    panelHeader.style.paddingBottom = "10px";
    panelHeader.textContent = selectedLanguage === 'fr' ? "Points de subvention communautaire" : "Community Grant Points";

    // Create a content container
    const panelContent = document.createElement("div");
    panelContent.id = "panel-content";
    panelContent.style.minHeight = "100px"; // Ensure minimum height
    panelContent.style.padding = "0";
    panelContent.style.marginTop = "0";
    panelContent.style.fontFamily = "inherit"; // Match header font
    panelContent.style.paddingLeft = "0"; // Align with header text

    // Add header and content to panel
    sidePanel.appendChild(panelHeader);
    sidePanel.appendChild(panelContent);
    
    // Add the panel to the map container
    const mapContainer = document.getElementById("map");
    if (mapContainer) {
        mapContainer.appendChild(sidePanel);

        // Show default message initially
        if (selectedLanguage === 'fr') {
            showDefaultMessageFR();
        } else {
            showDefaultMessageEN();    
        }
        
        // Add resize listener for responsive behavior
        window.addEventListener('resize', handleResize);
        
        // Initialize responsive positioning
        handleResize();
    
    } else {
        console.error("Map container not found");
    }
}

// Function to handle window resize for responsive panel positioning
function handleResize() {
    const sidePanel = document.getElementById("side-panel");
    if (!sidePanel) return;
    
    const windowWidth = window.innerWidth;
    
    if (windowWidth <= 768) {
        // Mobile layout - panel at bottom with floating margins
        sidePanel.style.left = windowWidth <= 480 ? "3%" : "2%";
        sidePanel.style.top = "auto";
        sidePanel.style.bottom = windowWidth <= 480 ? "3%" : "2%";
        sidePanel.style.width = windowWidth <= 480 ? "94%" : "96%";
        sidePanel.style.height = windowWidth <= 480 ? "25%" : "40%";
        sidePanel.style.borderRadius = "8px";
        sidePanel.style.boxShadow = "0 -2px 10px rgba(0, 0, 0, 0.3)";
    } else {
        // Desktop layout - panel on left
        sidePanel.style.left = "2%";
        sidePanel.style.top = "15%";
        sidePanel.style.bottom = "auto";
        sidePanel.style.width = "20%";
        sidePanel.style.height = "70%";
        sidePanel.style.borderRadius = "8px";
        sidePanel.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.3)";
    }
}

// ===================================================
// Function to update panel content with selected point(s)
// ===================================================

export function updatePanelContent(props, isMultiple = false) {
    const content = document.getElementById("panel-content");
    
    // Clear existing content first
    content.innerHTML = '';
    
    // Show default message if there are no properties available
    if (!props) {
        if (selectedLanguage === 'fr') {
            showDefaultMessageFR();
        } else {
            showDefaultMessageEN();
        }
        return;
    }

    // Get the count of points for multiple locations
    const pointCount = isMultiple ? props.length : 1;

    // ***If French is selected
    if (selectedLanguage === 'fr') {
        if (isMultiple) {
            // Display multiple points information - Grey Boxes
            content.innerHTML = `
                <div style="padding-left: 0;">
                    <h3 style="color: #4a2b7a; margin-bottom: 15px;">${pointCount} Emplacements</h3>
                    <div style="max-height: 500px; overflow-y: auto;">
                        ${props.map(point => {
                            return `
                                <div style="margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 4px;">
                                    <h4 style="margin: 0 0 8px 0; color: #4a2b7a;">Numéro d'investissement: EXEMPLE</h4>
                                    <p style="margin: 5px 0;"><strong>Allocation:</strong> EXEMPLE</p>
                                    <p style="margin: 5px 0;"><strong>Programme:</strong> EXEMPLE</p>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        } else {
            // Display single point information - No Grey Boxes
            content.innerHTML = `
                <div style="padding-left: 0;">
                    <h3 style="color: #4a2b7a; margin-bottom: 15px;">Numéro d\'investissement: EXEMPLE</h3>
                    <p style="margin: 8px 0;"><strong>Allocation:</strong> EXEMPLE</p>
                    <p style="margin: 8px 0;"><strong>Programme:</strong> EXEMPLE</p>
                </div>
            `;
        }
    } else {
        // English version
        if (isMultiple) {
            // Display multiple points information - Grey Boxes
            content.innerHTML = `
                <div style="padding-left: 0;">
                    <h3 style="color: #4a2b7a; margin-bottom: 15px;">${pointCount} Locations</h3>
                    <div style="max-height: 500px; overflow-y: auto;">
                        ${props.map(point => {
                            console.log('Processing point:', point);
                            return `
                                <div style="margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 4px;">
                                    <h4 style="margin: 0 0 8px 0; color: #4a2b7a;">Investment: SAMPLE</h4>
                                    <p style="margin: 5px 0;"><strong>Allocation: SAMPLE</strong></p>
                                    <p style="margin: 5px 0;"><strong>Program:</strong> SAMPLE</p>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        } else {
            // Display single point information - No Grey Boxes
            console.log('Single point properties:', props);
            content.innerHTML = `
                    <div style="padding-left: 0;">
                        <h3 style="color: #4a2b7a; margin-bottom: 15px;">Investment Number: SAMPLE</h3>
                    <p style="margin: 8px 0;"><strong>Allocation:</strong> SAMPLE</p>
                    <p style="margin: 8px 0;"><strong>Program:</strong> SAMPLE</p>
                </div>
            `;
        }
    }
}


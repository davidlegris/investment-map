//====================================================================
// Imports
//====================================================================
import { initializeMap } from './map.js';
import { updatePopups } from './mapLayers.js';

//====================================================================
// Build Language Selection Popup
//====================================================================

// Create overlay to prevent interaction with map
const overlay = document.createElement("div");
overlay.style.position = "fixed";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = "100%";
overlay.style.height = "100%";
overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
overlay.style.zIndex = "1999";

// Create second overlay for message
const messageOverlay = document.createElement("div");
messageOverlay.style.position = "fixed";
messageOverlay.style.top = "0";
messageOverlay.style.left = "0";
messageOverlay.style.width = "100%";
messageOverlay.style.height = "100%";
messageOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
messageOverlay.style.zIndex = "1999";
messageOverlay.style.display = "none";

// Message popup
const messagePopup = document.createElement("div");
messagePopup.id = "message-popup";
messagePopup.style.position = "fixed";
messagePopup.style.top = "50%";
messagePopup.style.left = "50%";
messagePopup.style.transform = "translate(-50%, -50%)";
messagePopup.style.backgroundColor = "white";
messagePopup.style.padding = "40px";
messagePopup.style.borderRadius = "12px";
messagePopup.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.5)";
messagePopup.style.zIndex = "2000";
messagePopup.style.textAlign = "center";
messagePopup.style.width = "500px";
messagePopup.style.maxWidth = "90%";
messagePopup.style.display = "none";

// Create message title
const messageTitle = document.createElement("h2");
messageTitle.style.marginTop = "0";
messageTitle.style.color = "#D71900";
messageTitle.style.fontSize = "24px";
messageTitle.style.marginBottom = "20px";

// Create message content
const messageContent = document.createElement("p");
messageContent.style.fontSize = "16px";
messageContent.style.lineHeight = "1.6";
messageContent.style.marginBottom = "30px";
messageContent.style.color = "#333";

// Create continue button
const continueButton = document.createElement("button");
continueButton.textContent = "Continue";
continueButton.style.padding = "15px 30px";
continueButton.style.backgroundColor = "#D71900";
continueButton.style.color = "white";
continueButton.style.border = "none";
continueButton.style.borderRadius = "6px";
continueButton.style.cursor = "pointer";
continueButton.style.fontSize = "18px";
continueButton.style.minWidth = "120px";
continueButton.style.transition = "background-color 0.3s ease";
continueButton.addEventListener("mouseover", () => {
    continueButton.style.backgroundColor = "#B31400";
});
continueButton.addEventListener("mouseout", () => {
    continueButton.style.backgroundColor = "#D71900";
});

// Add elements to message popup
messagePopup.appendChild(messageTitle);
messagePopup.appendChild(messageContent);
messagePopup.appendChild(continueButton);

// Language selection popup
const languagePopup = document.createElement("div");
languagePopup.id = "language-popup";
languagePopup.style.position = "fixed";
languagePopup.style.top = "50%";
languagePopup.style.left = "50%";
languagePopup.style.transform = "translate(-50%, -50%)";
languagePopup.style.backgroundColor = "white";
languagePopup.style.padding = "40px";
languagePopup.style.borderRadius = "12px";
languagePopup.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.5)";
languagePopup.style.zIndex = "2000";
languagePopup.style.textAlign = "center";
languagePopup.style.width = "400px";
languagePopup.style.maxWidth = "90%";

// Create title
const title = document.createElement("h2");
title.textContent = "Select Language / Choisir la langue";
title.style.marginTop = "0";
title.style.color = "#D71900";
title.style.fontSize = "24px";
title.style.marginBottom = "30px";

// Create buttons container
const buttonsContainer = document.createElement("div");
buttonsContainer.style.marginTop = "20px";
buttonsContainer.style.display = "flex";
buttonsContainer.style.justifyContent = "center";
buttonsContainer.style.gap = "30px";

// Create English button
const englishButton = document.createElement("button");
englishButton.textContent = "English";
englishButton.style.padding = "15px 30px";
englishButton.style.backgroundColor = "#D71900";
englishButton.style.color = "white";
englishButton.style.border = "none";
englishButton.style.borderRadius = "6px";
englishButton.style.cursor = "pointer";
englishButton.style.fontSize = "18px";
englishButton.style.minWidth = "120px";
englishButton.style.transition = "background-color 0.3s ease";
englishButton.addEventListener("mouseover", () => {
    englishButton.style.backgroundColor = "#B31400";
});
englishButton.addEventListener("mouseout", () => {
    englishButton.style.backgroundColor = "#D71900";
});

// Create French button
const frenchButton = document.createElement("button");
frenchButton.textContent = "Français";
frenchButton.style.padding = "15px 30px";
frenchButton.style.backgroundColor = "#D71900";
frenchButton.style.color = "white";
frenchButton.style.border = "none";
frenchButton.style.borderRadius = "6px";
frenchButton.style.cursor = "pointer";
frenchButton.style.fontSize = "18px";
frenchButton.style.minWidth = "120px";
frenchButton.style.transition = "background-color 0.3s ease";
frenchButton.addEventListener("mouseover", () => {
    frenchButton.style.backgroundColor = "#B31400";
});
frenchButton.addEventListener("mouseout", () => {
    frenchButton.style.backgroundColor = "#D71900";
});

// Add elements to popup
languagePopup.appendChild(title);
buttonsContainer.appendChild(englishButton);
buttonsContainer.appendChild(frenchButton);
languagePopup.appendChild(buttonsContainer);

// Add overlay and popup to body
document.body.appendChild(overlay);
document.body.appendChild(languagePopup);
document.body.appendChild(messageOverlay);
document.body.appendChild(messagePopup);

//====================================================================
// Language Selection
//====================================================================

// Store selected language
let selectedLanguage = 'en'; // Default to English

// Function to update header title
function updateHeaderTitle() {
    const englishText = document.getElementById('english-text');
    const frenchText = document.getElementById('french-text');
    
    if (selectedLanguage === 'en') {
        englishText.style.display = 'block';
        frenchText.style.display = 'none';
    } else {
        englishText.style.display = 'none';
        frenchText.style.display = 'block';
    }
}

// Function to handle language selection
function selectLanguage(language) {
    selectedLanguage = language;
    languagePopup.style.display = "none";
    overlay.style.display = "none";
    
    // Show message overlay with language-specific content
    if (language === 'en') {
        messageTitle.textContent = "Welcome";
        messageContent.textContent = "I created this application during my internship with United Way Centraide Canada. The original application was designed to assist the organization visualize their investments in relation to demographic characteristics of served areas. As much of this data is sensitive, I have generalized the application, while maintaining most of the original form and functionality. All investment data in the application is fabricated, while the demographic data represents the actual data from the 2021 Census.";
        continueButton.textContent = "Continue";
    } else {
        messageTitle.textContent = "Bienvenue";
        messageContent.textContent = " J’ai créé cette application durant mon stage chez Centraide United Way Canada. L’application originale avait été conçue pour aider l’organisation à visualiser ses investissements en lien avec les caractéristiques démographiques des zones desservies. Comme une grande partie de ces données est sensible, j’ai généralisé l’application tout en conservant la majeure partie de sa forme et de ses fonctionnalités originales. Toutes les données d’investissement dans l’application sont fictives, tandis que les données démographiques proviennent réellement du Recensement de 2021.";
        continueButton.textContent = "Continuer";
    }
    
    messageOverlay.style.display = "block";
    messagePopup.style.display = "block";
}

// Function to handle continue button click
function continueToMap() {
    messageOverlay.style.display = "none";
    messagePopup.style.display = "none";
    
    // Show the map, panel content, and floating header
    document.getElementById('map').style.display = "block";
    document.getElementById('side-panel').style.display = "block";
    document.getElementById('floating-header').style.display = "flex";
    
    // Update header title
    updateHeaderTitle();
    
    // Initialize the map and panel after language selection
    initializeMap();
   
    // Update popup content
    updatePopups();

    // Dispatch language change event
    document.dispatchEvent(new Event('languageChanged'));
}

// Add event listeners
englishButton.addEventListener("click", () => selectLanguage('en'));
frenchButton.addEventListener("click", () => selectLanguage('fr'));
continueButton.addEventListener("click", continueToMap);

// Export the selected language
export { selectedLanguage }; 
//====================================================================
// Imports
//====================================================================

import CDData from './Layers/censusDivision.js';
import grantPoints from './Layers/grants.js';
import { selectedLanguage } from './languageSelector.js';
import { updatePanelContent } from './leftPanel.js';

//====================================================================
// Create Polygon Layers
//====================================================================

// Store the layer reference globally so we can update it
let cdLayer;
let getPopupContent; // Add global variable to store the function

// Function to add the polygon layer to the map
export function addPolygonLayer(map) {
    
    // Convert Web Mercator coordinates to lat/lng - Map is in projected coordinate system, so we need to convert to geographic coordinates
    // ***should update in the future***
    const convertCoordinates = (coords) => {
        if (!coords || !coords.length) return [];
        return coords.map(coord => {
            if (Array.isArray(coord[0])) {
                return convertCoordinates(coord);
            } else {
                
                // Convert Web Mercator to lat/lng
                const x = coord[0];
                const y = coord[1];
                const lng = (x / 20037508.34) * 180;
                let lat = (y / 20037508.34) * 180;
                lat = 180/Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
                return [lng, lat];
            }
        });
    };

    // Create a copy of the GeoJSON with converted coordinates
    const convertedCDData = {
        ...CDData,
        features: CDData.features.map(feature => ({
            ...feature,
            geometry: {
                ...feature.geometry,
                coordinates: convertCoordinates(feature.geometry.coordinates)
            }
        }))
    };

    // *** Ensures Region 3 is on top, otherwise it is underneath another layer***
    convertedCDData.features.sort((a, b) => {
        if (a.properties.CDNAME === "Region 3") return 1;
        if (b.properties.CDNAME === "Region 3") return -1;
        return 0;
    });

    // Get all prevalence values for calculating quantiles
    const allPrevalences = convertedCDData.features
        .map(feature => feature.properties['Prevalence of Low Income'])
        .filter(value => value !== undefined && value !== null);

    // Calculate quantiles for all prevalence values
    const getQuantiles = (values, n) => {
        const sorted = [...values].sort((a, b) => a - b);
        const quantiles = [];
        for (let i = 1; i < n; i++) {
            quantiles.push(sorted[Math.floor((i / n) * sorted.length)]);
        }
        return quantiles;
    };

    // Create a color scale from white to red
    const getColor = (value, quantiles) => {
        if (value <= quantiles[0]) return '#ffffff';
        if (value <= quantiles[1]) return '#ffcccc';
        if (value <= quantiles[2]) return '#ff9999';
        if (value <= quantiles[3]) return '#ff6666';
        return '#ff0000';
    };


    // Create the GeoJSON layer for census divisions
    cdLayer = L.geoJSON(convertedCDData, {
        style: function(feature) {
            const prevalence = feature.properties['Prevalence of Low Income'];
            
            // Calculate quantiles for all prevalence values
            const quantiles = getQuantiles(allPrevalences, 5);
            
            return {
                fillColor: getColor(prevalence, quantiles),
                weight: 1,  // Black border weight
                opacity: 1,  // Full opacity for borders
                color: '#767676',  // Grey
                fillOpacity: 0.7
            };
        },
        onEachFeature: function(feature, layer) {
            
            // Function which puts information in the pop-up box
            getPopupContent = (feature) => {
                
                // If French is selected
                if (selectedLanguage === 'fr') {
                    return `
                        <div style="padding: 10px;">
                            <h3 style="margin: 0 0 10px 0; font-size: 16px;">${feature.properties.CDNAME}</h3>
                            <p style="margin: 5px 0;"><strong>Classification:</strong> EXEMPLE</p>
                            <p style="margin: 5px 0;"><strong>Prévalence du faible revenu:</strong> ${feature.properties['Prevalence of Low Income'] + '%'|| 'N/A'}</p>
                            <p style="margin: 5px 0;"><strong>Superficie:</strong> ${feature.properties.LANDAREA ? feature.properties.LANDAREA.toFixed(2) + ' km²' : 'N/A'}</p>
                        </div>
                    `;
                } else {
                    
                    // If English is selected
                    return `
                        <div style="padding: 10px;">
                            <h3 style="margin: 0 0 10px 0; font-size: 16px;">${feature.properties.CDNAME}</h3>
                            <p style="margin: 5px 0;"><strong>Classification:</strong> SAMPLE</p>
                            <p style="margin: 5px 0;"><strong>Prevalence of Low Income:</strong> ${feature.properties['Prevalence of Low Income'] + '%' || 'N/A'}</p>
                            <p style="margin: 5px 0;"><strong>Land Area:</strong> ${feature.properties.LANDAREA ? feature.properties.LANDAREA.toFixed(2) + ' km²' : 'N/A'}</p>
                        </div>
                    `;
                }
            };

            // Store the feature for later use
            layer.feature = feature;

            // Bind popup to layer with language-specific content
            layer.bindPopup(getPopupContent(feature), {
                maxWidth: 300,
                className: 'custom-popup'
            });

            // Add click functionality
            layer.on({
                click: function(e) {
                    const layer = e.target;
                    map.fitBounds(layer.getBounds(), {
                        padding: [50, 50],
                        maxZoom: 12
                    });
                },
                mouseover: function(e) {
                    const layer = e.target;
                    layer.setStyle({
                        weight: 2,
                        color: '#000',
                        fillOpacity: 0.9
                    });
                },
                mouseout: function(e) {
                    const layer = e.target;
                    layer.setStyle({
                        weight: 1,
                        color: '#666',
                        fillOpacity: 0.7
                    });
                }
            });
        }
    });

    // Add the layer to the map
    cdLayer.addTo(map);
    console.log('Polygon layers added to map');

    // Add zoom-based visibility control
    const ZOOM_THRESHOLD = 11; // Increased threshold to show polygons at higher zoom levels
    
    // Function to update layer visibility based on zoom level
    function updateLayerVisibility() {
        const currentZoom = map.getZoom();
        if (currentZoom > ZOOM_THRESHOLD) {
            if (map.hasLayer(cdLayer)) {
                map.removeLayer(cdLayer);
            }
        } else {
            if (!map.hasLayer(cdLayer)) {
                map.addLayer(cdLayer);
            }
        }
    }

    // Add zoom event listener with debounce
    let zoomTimeout;
    map.on('zoom', function() {
        clearTimeout(zoomTimeout);
        zoomTimeout = setTimeout(updateLayerVisibility, 150); // Wait for zoom to settle
    });
    
    // Get the bounds
    const bounds = cdLayer.getBounds();
    
    // Fit the map to the bounds with padding and a maximum zoom level
    map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 6  // Reduced maxZoom to ensure we see the full extent
    });

    // Force an initial visibility check
    setTimeout(updateLayerVisibility, 100);
}

//====================================================================
// Update Popups
//====================================================================

// Function to update all popups when language changes
export function updatePopups() {
    if (!cdLayer) return;
    
    cdLayer.eachLayer(layer => {
        if (layer.getPopup()) {
            const content = layer.getPopup().getContent();
            const newContent = layer.feature ? getPopupContent(layer.feature) : content;
            layer.setPopupContent(newContent);
        }
    });
}

// Export the getPopupContent function
export { getPopupContent };

//====================================================================
// Creates point layer and creates marker cluster group
//====================================================================

// Assigns size to points based on quant_code
function getSize(quantCode) {
    if (quantCode === undefined || quantCode === null) {
        return 4; // Smallest size for no data
    }
    const value = Number(quantCode);
    
    // Set quantile size
    return value === 5 ? 24 :  // Largest size for quant_code 5
        value === 4 ? 20 :     // Second largest for quant_code 4
        value === 3 ? 16 :      // Medium for quant_code 3
        value === 2 ? 12 :      // Smaller for quant_code 2
        8;                     // Smallest for quant_code 1
}

function createPointLayer() {
    return L.geoJSON(grantPoints, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: getSize(feature.properties.quant_code),
                fillColor: "#4a2b7a",
                outlineColor: "#000",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        }
    });
}

// Adds point layer to map
export function addPointLayer(map) {
    
    // Points are in geographic coordinates, no conversion needed
    const pointLayer = createPointLayer(grantPoints);
    
    // Create marker cluster group with custom configuration
    const markerClusterGroup = L.markerClusterGroup({
        maxClusterRadius: 80,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        disableClusteringAtZoom: 15,
        chunkedLoading: true,
        chunkInterval: 200,
        chunkDelay: 50,
        iconCreateFunction: function(cluster) {
            const count = cluster.getChildCount();
            return L.divIcon({
                html: `<div class="custom-cluster">${count}</div>`,
                className: 'custom-cluster-container',
                iconSize: L.point(40, 40)
            });
        }
    });

    // Group points by location
    const pointsByLocation = {};
    grantPoints.features.forEach(feature => {
        const lng = feature.geometry.coordinates[0];
        const lat = feature.geometry.coordinates[1];
        const key = `${lat},${lng}`;
        if (!pointsByLocation[key]) {
            pointsByLocation[key] = [];
        }
        pointsByLocation[key].push(feature);
    });

    // Add points to the cluster group with small offsets for points at the same location
    Object.entries(pointsByLocation).forEach(([key, points]) => {
        const [lat, lng] = key.split(',').map(Number);
        
        // If there are multiple points at the same location, spread them out in a small circle
        if (points.length > 1) {
            const radius = 0.0001; // Small radius for spreading points (adjust as needed)
            points.forEach((point, index) => {
                const angle = (index / points.length) * 2 * Math.PI;
                const offsetLat = lat + radius * Math.cos(angle);
                const offsetLng = lng + radius * Math.sin(angle);
                
                // Create a marker for each point
                const marker = L.circleMarker([offsetLat, offsetLng], {
                    radius: getSize(point.properties.quant_code),
                    fillColor: "#4a2b7a",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });

                // Store the original point data in the marker
                marker.pointData = point;

                // Add click handler for each marker
                marker.on('click', function() {
                    updatePanelContent(null);
                    updatePanelContent(points, true);
                });

                markerClusterGroup.addLayer(marker);
            });
        } else {

            // Single point at this location
            const marker = L.circleMarker([lat, lng], {
                radius: getSize(points[0].properties.quant_code),
                fillColor: "#4a2b7a",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });

            // Store the original point data in the marker
            marker.pointData = points[0];

            // Add click handler for each marker
            marker.on('click', function() {
                updatePanelContent(null);
                updatePanelContent(points[0], false);
            });

            markerClusterGroup.addLayer(marker);
        }
    });

    // Add cluster group to map
    markerClusterGroup.addTo(map);

    // Add click handler for clusters
    markerClusterGroup.on('clusterclick', function(e) {
        const cluster = e.layer;
        const markers = cluster.getAllChildMarkers();
        console.log(`Cluster clicked with ${markers.length} markers`);
        
        // Clear any existing content first
        updatePanelContent(null);
        
        if (markers.length > 1) {
            
            // Get all points from the markers in this cluster
            const clusterPoints = markers.map(marker => marker.pointData);
            
            // Update left panel with points in this cluster
            updatePanelContent(clusterPoints, true);

            // Zoom to show all points in the cluster
            const bounds = L.latLngBounds(markers.map(m => m.getLatLng()));
            map.fitBounds(bounds, {
                padding: [50, 50],
                maxZoom: 15
            });
        } else if (markers.length === 1) {
            
            // If there's only one marker in the cluster, show its point
            const marker = markers[0];
            updatePanelContent(marker.pointData, false);
        }
    });

    return pointLayer;
}
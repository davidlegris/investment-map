# Application Layers

## Introduction
This folder contains three JavaScript files. Each file contains the geometry and attribute (also known as property) information about one of the layers. This document will outline the steps for updating these layers. You can find more specific information about the layer contents in the map application instruction document. 

## File Components
To better understand this process, let's break the file into three components: the GeoJSON, the variable and the default export statement.

### 1. GeoJSON
This is the core of the code, which contains the properties and geometry of the layer. After creating a GeoJSON layer through the <em>Polygon Workflow</em> or `grant_points.py`, copy the output into the current JavaScript layer file or create a new file. Make sure the extension of the file is `.js` and not `.geojson`.

### 2. Variable
`mapLayers.js` will access each layer through a variable. The correct variable must be used, otherwise it will break the map. Place the following text in front of the GeoJSON data to make it into a variable.

#### `catchmentArea.js`
 + `const UWCData = `

#### `censusDivision.js`
 + `const CDData = `

#### `grants.js`
 + `const grantPoints = `

### 3. Default Export Statement
An export statement is required to ensure `mapLayers.js` can access the variable in the layer files. Ensure the following statements are placed at the end of each file, following the GeoJSON data.

#### `catchmentArea.js`
 + `export default UWCData;`

#### `censusDivision.js`
 + `export default CDData;`

#### `grants.js`
 + `export default grantPoints;`

## Examples:
Example formatting can be found in the three JavaScript layer files: `catchmentArea.js`, `censusDivision.js`, `grants.js`.
# Couches de l'application

## Introduction
Ce dossier contient trois fichiers JavaScript. Chaque fichier contient les informations géométriques et attributaires (également appelées propriétés) d'une des couches. Ce document décrira les étapes pour mettre à jour ces couches. Vous pouvez trouver des informations plus détaillées sur le contenu des couches dans le document d'instructions de l'application cartographique.

## Composants des fichiers
Pour mieux comprendre ce processus, décomposons le fichier en trois composants : le GeoJSON, la variable et l'instruction d'exportation par défaut.

### 1. GeoJSON
C'est le cœur du code, qui contient les propriétés et la géométrie de la couche. Après avoir créé une couche GeoJSON via le <em>Polygon Workflow</em> ou `grant_points.py`, copiez la sortie dans le fichier de couche JavaScript actuel ou créez un nouveau fichier. Assurez-vous que l'extension du fichier est `.js` et non `.geojson`.

### 2. Variable
`mapLayers.js` accédera à chaque couche via une variable. La variable correcte doit être utilisée, sinon la carte ne fonctionnera pas. Placez le texte suivant devant les données GeoJSON pour en faire une variable.

#### `catchmentArea.js`
 + `const UWCData = `

#### `censusDivision.js`
 + `const CDData = `

#### `grants.js`
 + `const grantPoints = `

### 3. Instruction d'exportation par défaut
Une instruction d'exportation est nécessaire pour que `mapLayers.js` puisse accéder à la variable dans les fichiers de couche. Assurez-vous que les instructions suivantes sont placées à la fin de chaque fichier, après les données GeoJSON.

#### `catchmentArea.js`
 + `export default UWCData;`

#### `censusDivision.js`
 + `export default CDData;`

#### `grants.js`
 + `export default grantPoints;`

## Exemples :
Des exemples de formatage peuvent être trouvés dans les trois fichiers de couche JavaScript : `catchmentArea.js`, `censusDivision.js`, `grants.js`. 
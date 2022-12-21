import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { placeService } from './services/place.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onDelete = onDelete

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
        })
        .catch(() => console.log('Error: cannot init map'))

    renderPlacesTable()
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            mapService.centerUserPos(pos)
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}
function onPanTo(lat, lng) {
    console.log('Panning the Map')
    mapService.panTo(lat, lng)
}

function onMyLocation() {
    onGetUserPos()
}


function onDelete(placeId) {
    placeService.remove(placeId)
    renderPlacesTable()
}

function renderPlacesTable() {
    placeService.query().then(places => {
        const elTable = document.querySelector('.loc-table')
        elTable.innerHTML = places.map(place => {
            return `<article class="loc-container">
                <div class="name">${place.name}</div>
                <span class="lat">Lat: ${place.lat}</span>
                <span class="lng">Lng: ${place.lng}</span>
                <span class="weather">Weather: ${place.weather}</span>
                CreatedAt: <div class="created-at">${new Date(place.createdAt)}</div>
                UpdateAt: <div class="updated-at">${new Date(place.updatedAt)}</div>
                <div>
                    <button class="btn-go" onclick="onPanTo(${place.lat},${place.lng})">Go</button>
                    <button class="btn-delete" onclick="onDelete('${place.id}')">Delete</button>
                </div>
            </article>`
        }).join('')
    })
}
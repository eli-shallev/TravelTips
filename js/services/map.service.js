import { utilService } from './util.service.js'
import { placeService } from './place.service.js'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    centerUserPos,
    getLocationByName,
    getNameByLocation,
    addClickEvent
}

// Var that is used throughout this Module (not global)
var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {

    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap)
        })
}

function addClickEvent() {
    gMap.addListener('click', function (event) {
        getNameByLocation(event.latLng.lat(), event.latLng.lng()).then(name => {
            document.querySelector('.curr-loc').innerText = name
            const queryStringParams = `?&lat=${event.latLng.lat()}&lng=${event.latLng.lng()}`
            const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
            window.history.pushState({ path: newUrl }, '', newUrl)

            const newPlace = { id: '', name: name, lat: event.latLng.lat(), lng: event.latLng.lng(), weather: '', createdAt: Date.now(), updatedAt: Date.now() }
            placeService.post(newPlace)
        })

    })
}

function getLocationByName(placeName) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${placeName}&key=AIzaSyB3YTMwlpvpzoH8xqyIROJIRqq4hG_RtyM`
    return axios.get(url).then(loc => {
        const pos = { lat: loc.data.results[0].geometry.location.lat, lng: loc.data.results[0].geometry.location.lng }
        return pos
    })
}

function getNameByLocation(lat, lng) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyB3YTMwlpvpzoH8xqyIROJIRqq4hG_RtyM`
    return axios.get(url).then(res => res.data.results[4].formatted_address)
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyB3YTMwlpvpzoH8xqyIROJIRqq4hG_RtyM'
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function centerUserPos(pos) {
    gMap.setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude })
}
// let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=48,48&key=AIzaSyCs25ULg84X5AAwQgzvEWyf9Caf-68w7Mk`
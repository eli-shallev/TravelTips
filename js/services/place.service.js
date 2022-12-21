import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const PLACE_KEY = 'placeDB'
_createPlaces()

export const placeService = {
    post,   // Create
    get,    // Read
   // put,    // Update
    remove, // Delete
    query,  // List 
}

function query() {
    return storageService.query(PLACE_KEY)
        .then(places => {
            return places
        })
}

function get(placeId) {
    return storageService.get(PLACE_KEY, placeId)
}

function remove(placeId) {
    return storageService.remove(PLACE_KEY, placeId)
}

function post(place) {
    if (place.id) {
        return storageService.put(PLACE_KEY, place)
    } else {
        return storageService.post(PLACE_KEY, place)
    }
}

function getEmptyPlace() {
    return { id: '', name:'', lat:'',lng:'',weather:'',createdAt: Date.now() ,updatedAt: Date.now()  }
}

// post

function _createPlaces() {
    let places = utilService.loadFromStorage(PLACE_KEY)
    if (!places || !places.length) {
        _createDemoPlaces()
    }
}


function _createDemoPlaces() {
    const placesNames = ['Here', 'There', 'EveryWhere']
    const placesLat = [31, 32, 33]
    const placesLng = [31, 32, 33]

    const places = placesNames.map((placeName, i) => {
        return  _createPlace(placeName,placesLat[i],placesLng[i])
    })

    utilService.saveToStorage(PLACE_KEY, places)
}

function _createPlace(name,lat,lng,weather = '') {
    const place = getEmptyPlace()
    place.id = utilService.makeId()
    place.name = name
    place.lat = lat
    place.lng = lng
    place.weather = weather
    return place
}




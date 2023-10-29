import Geocoder from "react-native-geocoding";

Geocoder.init("AIzaSyBFGXrTE3rEbY4-BJcdz3nlut2ons-II2g")

export const searchByAddress = (endereco) => {
    return new Promise((resolve, reject) => {
        Geocoder.from(endereco)
        .then(result => {
            var location = result.results[0].geometry.location
            resolve(location)
        }).catch(error => {
            reject(error)
        })
    })
}
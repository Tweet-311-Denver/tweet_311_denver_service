const fetch = require('node-fetch');
require('dotenv').config();

class Geocode {
  constructor(latLong){
    // assuming constructor latLong = {lat: <num>, long: <num>}
    console.log(latLong)
    this.latLong = latLong
  }

  async fetchAddress() {
    // format: latlng=40.714224,-73.961452
    const latLongString = `${this.latLong.lat},${this.latLong.long}`
    let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLongString}&key=${process.env.GOOGLE_GEOCODE_KEY}`;
    let res = await fetch(url);
    let googleInfo = await res.json();
    console.log(googleInfo)
    return googleInfo
  }

}

module.exports = Geocode

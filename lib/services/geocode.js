const fetch = require('node-fetch');
require('dotenv').config();

class Geocode {
  constructor(latLong){
    this.latLong = latLong
  }

  async fetchAddress() {
    const latLongString = `${this.latLong.lat},${this.latLong.long}`
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLongString}&key=${process.env.GOOGLE_GEOCODE_KEY}`

    try {
      const response = await fetch(url);
      const json = await response.json();
      return json
    } catch (error) {
      return error
    }
  }

}

module.exports = Geocode

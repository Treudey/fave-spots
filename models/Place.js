import PlaceDetailsScreen from "../screens/PlaceDetailsScreen";

class Place {
  constructor(id, title, imageURI, address, lat, lng) {
    this.id = id;
    this.title = title;
    this.imageURI = imageURI;
    this.address = address;
    this.lat = lat;
    this.lng = lng;
  }
}

export default Place;
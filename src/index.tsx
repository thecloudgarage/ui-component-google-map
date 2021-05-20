// CUSTOM JS Google Maps ----------------------------------------------------*/
declare var manywho: any;
declare var google: any;
import * as React from 'react';
import './css/index.css';
class googleMaps extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            zoom: 2,
            maptype: 'roadmap', // terrain // roadmap  //hybrid
            heading: 90,
            tilt: 75,
            place_formatted: '',
            place_id: '',
            place_location: '',
            rotateControl: true,
            lat: 1.2966,
            long: 103.7764,
            markers: [],
        };
    }
    componentDidMount() {
        // Get the component's model, which includes any values bound to it
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        const columns = manywho.component.getDisplayColumns(model.columns);
        // Create the map in an element on the page
        const map = new google.maps.Map(document.getElementById('map-canvas'), {
            center: { lat: this.state.lat, lng: this.state.long },
            zoom: this.state.zoom,
            mapTypeId: this.state.maptype,
            heading: this.state.heading,
            styles: [{
                featureType: 'poi',
                elementType: 'labels',
            }],
            tilt: this.state.tilt,
        });
        // Loop through all the data in the value this component is bound to
        model.objectData.forEach((result: any) => {
            // Assume the latitude is the 1st "display column" set in the page component
            const latitude = result.properties.find((property: any) => property.typeElementPropertyId === columns[0].typeElementPropertyId);
            // Assume the longitude is the 2nd "display column" set in the page component
            const longitude = result.properties.find((property: any) => property.typeElementPropertyId === columns[1].typeElementPropertyId);
            // Assume the name is the 3rd "display column" set in the page component
            const name = result.properties.find((property: any) => property.typeElementPropertyId === columns[2].typeElementPropertyId);
            // Assume the available spots is the 4th "display column" set in the page component
            const country = result.properties.find((property: any) => property.typeElementPropertyId === columns[3].typeElementPropertyId);
            // Assume the total spots is the 5th "display column" set in the page component
            const place = result.properties.find((property: any) => property.typeElementPropertyId === columns[4].typeElementPropertyId);
            // CC Info Window
            const contentString = '<div id="content">' +
              '<div id="siteNotice">' +
              '</div>' +
              '<h5>Place:  ' + place.contentValue + ', ' + country.contentValue + '</h5>' +
              '<hr />' +
              '<a target="blank" href="https://www.google.com/maps/dir/?api=1&origin=1.2966,103.776&destination=' + latitude.contentValue + ',' + longitude.contentValue + '">' +
              'Click for Directions</a> ' +
              '<hr />' +
              '<p>Lat/Long:</p>' + latitude.contentValue + '/' + longitude.contentValue +
              '</div>' +
              '</div>';
            const infowindow = new google.maps.InfoWindow({
                content: contentString,
              });
            // Add the list object as a marker on the map
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(latitude.contentValue, longitude.contentValue),
                map,
                animation: google.maps.Animation.DROP,
                title: name.contentValue,
            });
            // Zoom to 9 when clicking on marker
            google.maps.event.addListener(marker, 'click', function() {
              map.setZoom(3);
              infowindow.open(map, marker);
              });
        });
    }
    render() {
        return (
            <div className="custom-component flex-container">
                <div id="map-canvas"></div>
                <div className="content-wrapper">
                    <div id="autocomplete-input">
                        {/* <input id="ac-input" type='text' placeholder='Enter a location' /> */}
                    </div>
                </div>
            </div>
        );
    }
}
manywho.component.register('google-map', googleMaps);
export default googleMaps;

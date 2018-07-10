import React from 'react';
const { compose, withProps, withStateHandlers } = require('recompose');
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} = require('react-google-maps');
const { InfoBox } = require('react-google-maps/lib/components/addons/InfoBox');

const GMaps = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
    center: { lat: 43.6532, lng: -79.3832 },
  }),
  withStateHandlers(
    () => ({
      isOpen: false,
    }),
    {
      onToggleOpen: ({ isOpen }) => () => ({
        isOpen: !isOpen,
      }),
    },
  ),
  withScriptjs,
  withGoogleMap,
)(props => (
  <GoogleMap defaultZoom={5} defaultCenter={props.center}>
    {props.locationData.map((d, i) => {
      return (
        <span key={i}>
          <InfoBox
            defaultPosition={
              new window.google.maps.LatLng(props.center.lat, props.center.lng)
            }
            options={{ closeBoxURL: ``, enableEventPropagation: true }}
          >
            <div
              style={{
                backgroundColor: `yellow`,
                opacity: 0.75,
                padding: `12px`,
              }}
            >
              <div style={{ fontSize: `16px`, fontColor: `#08233B` }}>
                Hello, Toronto!
              </div>
            </div>
          </InfoBox>
          <Marker
            position={{ lat: d.latitude, lng: d.longitude }}
            onClick={props.onToggleOpen}
          >
            {props.isOpen && (
              <InfoBox
                onCloseClick={props.onToggleOpen}
                options={{ closeBoxURL: ``, enableEventPropagation: true }}
              >
                <div
                  style={{
                    backgroundColor: `yellow`,
                    opacity: 0.75,
                    padding: `12px`,
                  }}
                >
                  <div style={{ fontSize: `16px`, fontColor: `#08233B` }}>
                    {d.name}
                    <br />
                    {d.postal_code}
                  </div>
                </div>
              </InfoBox>
            )}
          </Marker>
        </span>
      );
    })}
  </GoogleMap>
));

export default GMaps;

import React, { useEffect, useRef, useState } from 'react';

const GMap = () => {
  const googleMapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const googleMap = initGoogleMap();
    setMap(googleMap);
  }, []);

  useEffect(() => {
    if (!map) return;

    const routeOptions = new window.google.maps.Polyline({
      strokeOpacity: 0,
      icons: [{
        icon: {
          path: "M 0,-0.1 0,0.1",
          strokeOpacity: 0.8,
          strokeColor: 'red',
          scale: 5,
        },
        offset: "0",
        repeat: "10px",
      }],
    });

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({ polylineOptions: routeOptions });
    const haight = new window.google.maps.LatLng(37.7699298, -122.4469157);
    const oceanBeach = new window.google.maps.LatLng(37.7683909618184, -122.51089453697205);

    const request = {
      origin: haight,
      destination: oceanBeach,
      travelMode: 'WALKING'
    };
    directionsService.route(request, function (response, status) {
      if (status == 'OK') {
        directionsRenderer.setDirections(response);
        directionsRenderer.setMap(map);
        moveMarkerOnRoute(map, response.routes[0].overview_path);
      }
    });
  }, [map])

  const initGoogleMap = () => {
    return new window.google.maps.Map(googleMapRef.current, {
      center: new window.google.maps.LatLng(37.7699298, -122.4469157),
      zoom: 12
    });
  }

  const moveMarkerOnRoute = async (map, pathCoords) => {
    const marker = new window.google.maps.Marker({
      position: pathCoords[0],
      map,
      icon: {
        url: '/person-marker.png',
        scaledSize: new window.google.maps.Size(40, 40),
      },
      optimized: false,
      zIndex: 99
    });

    for (let i = 0; i < pathCoords.length; i++) {
      await animatedMove(marker, marker.getPosition(), pathCoords[i], 0.05);
    }
  }

  const animatedMove = async (marker, moveFrom, moveTo, t, delta = 100) => {
    return new Promise(resolve => {
      const deltalat = (moveTo.lat() - moveFrom.lat()) / delta;
      const deltalng = (moveTo.lng() - moveFrom.lng()) / delta;
      let delay = 10 * t, count = 0;
      for (let i = 0; i < delta; i++) {
        (function (ind) {
          setTimeout(
            function () {
              let lat = marker.position.lat();
              let lng = marker.position.lng();
              lat += deltalat;
              lng += deltalng;
              marker.setPosition(new window.google.maps.LatLng(lat, lng));

              count++
              if (count === delta) {
                resolve(marker);
              }
            }, delay * ind
          );
        })(i)
      }
    })
  }

  return <div
    ref={googleMapRef}
    style={{ width: 600, height: 300 }}
  />
}

export default GMap;
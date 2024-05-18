import { useState, useEffect } from 'react';
import { googleMapsApiKey } from '../../config/config';

const useGoogleMaps = () => {
    const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&callback=initMap`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            setGoogleMapsLoaded(true);
        };
        document.body.appendChild(script);
        window.initMap = () => {
            // Initialize the Google Map instance here
            console.log('Google Maps API loaded successfully');
        };
        return () => {
            document.body.removeChild(script);
            delete window.initMap;

        };
    }, []);

    return googleMapsLoaded;
};

export default useGoogleMaps;

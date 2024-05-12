import { useState, useEffect } from 'react';

const useGoogleMaps = (apiKey) => {
    const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            setGoogleMapsLoaded(true);
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [apiKey]);

    return googleMapsLoaded;
};

export default useGoogleMaps;

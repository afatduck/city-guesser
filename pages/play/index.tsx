import { Loader } from '@googlemaps/js-api-loader';
import randomStreetView from '../../utils/random-streetview';
import { Suspense, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { createLocationKey } from '../../utils/redis/createLocationKey';
import LE from '../../utils/locationEncryption';
import Head from 'next/head';

const Result = dynamic(() => import('../../components/client/result'), { ssr: false });

function Index({googleMapsApiKey, locationKey}: Props) {

    // Init state and refs

    const rsw = useRef<randomStreetView | null>(null);
    const googlestreet = useRef(null);
    const googlemap = useRef(null);
    const usermarker = useRef<any>(null);
    const target = useRef<any>(null);
    const guess = useRef<any>(null);

    const [submitted, setSubmitted] = useState(false);

    // Once component renders

    useEffect(() => {

        // Set up google maps api

        rsw.current = new randomStreetView();
        const loader = new Loader({ apiKey: googleMapsApiKey, version: 'weekly'});

        let street: google.maps.StreetViewPanorama;
        let map: google.maps.Map;

        // Load google maps api

        loader.load().then(() => {

            // Get api from loader

            const google = window.google;

            rsw.current?.setParameters({
                google: google as any,
            })


            // Generate random streetview location

            rsw.current?.getRandomLocation().then((loc: any) =>{

                target.current = [loc[0], loc[1]];

                // Create streetview panorama

                street = new google.maps.StreetViewPanorama(
                    googlestreet.current as any, {
                    position: { lat: loc[0], lng: loc[1] },
                    pov: {heading: 165, pitch: 0},
                    motionTrackingControlOptions: {
                        position: google.maps.ControlPosition.LEFT_BOTTOM
                    },
                    addressControl: false,
                    fullscreenControl: false,
                    linksControl: false,
                    showRoadLabels: false
                    });

                // Create map

                map = new google.maps.Map(googlemap.current as any, {
                    zoom: 0,
                    center: { lat: 0, lng: 0 },
                });

                // Create marker on click

                map.addListener('click', (e: any) => {
                    if (usermarker.current) { usermarker.current.setMap(null); }
                    usermarker.current = new google.maps.Marker({
                        position: e.latLng,
                        map: map
                    });
                    guess.current = [e.latLng.lat(), e.latLng.lng()];
                    document.getElementById("guess-button")?.removeAttribute("disabled");
                });

                // Save location to redis

                const encrypted = LE.encryptLocation([loc[0], loc[1]]);
                fetch('/api/save-location', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        location: encrypted,
                        key: locationKey
                    })
                })
            });
        });
    }, [locationKey]);

    const handleSubmit = () => {
        if (!guess.current) return;
        setSubmitted(true);

        // Submit the result
        fetch("/api/submit-location", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                location: (guess.current as any),
                key: locationKey
            })
        })
    }

    return (
        <>
        <Head>
            <title>Game! | EarthGuesser</title>
        </Head>
        <div className="flex flex-col items-center justify-center h-full relative">
            <div id="street" ref={googlestreet} className="h-full w-full" />

                <div className="absolute bottom-16 md:right-24 z-10 w-80
                    rounded-lg right-[50%] translate-x-[50%] md:translate-x-0">

                    <div id='map' ref={googlemap}
                    className="w-full h-48 rounded-lg mb-6 shadow-md"/>

                    <button type='button' className='bg-green-700
                    text-white font-bold py-2 px-4 rounded-full w-full uppercase
                    disabled:opacity-50 disabled:pointer-events-none shadow-md'
                     id='guess-button' onClick={handleSubmit}>
                        Guess
                    </button>

            </div>
            <Suspense>
                <Result show={submitted} loc1={target.current as any} 
                loc2={guess.current as any}/>
            </Suspense>
        </div>
        </>
    );
}

export async function getServerSideProps() {

    const locationKey = createLocationKey();

    return {
        props: {
            googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
            locationKey: locationKey
        }
    }
}

type Props = {
    googleMapsApiKey: string
    locationKey: string
}

export default Index

import { Loader } from '@googlemaps/js-api-loader';
import randomStreetView from '../../random-streetview';
import { Suspense, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const Result = dynamic(() => import('../../components/client/result'), { ssr: false });

function Index({googleMapsApiKey, location}: Props) {

    const googlestreet = useRef(null);
    const googlemap = useRef(null);
    const usermarker = useRef<any>(null);
    const rsw = useRef<randomStreetView | null>(null);
    const target = useRef<any>(null);
    const userpoint = useRef<any>(null);

    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        rsw.current = new randomStreetView();
        const loader = new Loader({
        apiKey: googleMapsApiKey,
        version: 'weekly',
        });
        let street: google.maps.StreetViewPanorama;
        let map: google.maps.Map;
        loader.load().then(() => {

            rsw.current?.setParameters({
                google: window.google as any,
            })  

            rsw.current?.getRandomLocation().then((loc: any) =>{
                const google = window.google;
                target.current = [loc[0], loc[1]];
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
                });

                map = new google.maps.Map(googlemap.current as any, {
                    zoom: 0,
                    center: { lat: 0, lng: 0 },
                });

                map.addListener('click', (e: any) => {
                    if (usermarker.current) { usermarker.current.setMap(null); }
                    usermarker.current = new google.maps.Marker({
                        position: e.latLng,
                        map: map
                    });
                    userpoint.current = [e.latLng.lat(), e.latLng.lng()];
                    document.getElementById("guess-button")?.removeAttribute("disabled");
                });
        });
    }, []);

    const handleSubmit = () => {
        console.log("koj kurav");
        
        setSubmitted(true);
    }

    return (
        <div className="flex flex-col items-center justify-center h-full relative">
            <div id="street" ref={googlestreet} className="h-full w-full" />

                <div className="absolute bottom-16 md:right-24 z-10 w-80
                    rounded-lg right-[50%] translate-x-[50%] md:translate-x-0">

                    <div id='map' ref={googlemap}
                    className="w-full h-48 rounded-lg mb-6"/>

                    <button type='button' className='bg-green-700 hover:bg-green-800
                    text-white font-bold py-2 px-4 rounded-full w-full uppercase
                    disabled:opacity-50 disabled:pointer-events-none shadow-md'
                     id='guess-button' onClick={handleSubmit}>
                        Guess
                    </button>

            </div>
            {
                submitted &&
                <Suspense>
                    <Result show={true} loc1={target.current as any} 
                    loc2={userpoint.current as any}/>
                </Suspense>
            }
        </div>
    );
}

export async function getServerSideProps() {

    return {
        props: {
            googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
            location: null
        }
    }
}

type Props = {
    googleMapsApiKey: string
    location: [number, number]
}

export default Index

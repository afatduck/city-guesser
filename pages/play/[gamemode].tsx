import { Loader } from '@googlemaps/js-api-loader';
import randomStreetView from '../../utils/random-streetview';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { createLocationKey } from '../../utils/redis/createLocationKey';
import LE from '../../utils/locationEncryption';
import Head from 'next/head';
import { ArrowBackUp } from 'tabler-icons-react';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';

import gamemodes from '../../gamemodes.json';

import earthBounce from "../../public/svg/earth-bounce.svg";
import { randomLocationLoadingMessage } from '../../utils/misc';
import { getSession } from 'next-auth/react';

const Result = dynamic(() => import('../../components/server/result'), { ssr: true });

function Index({googleMapsApiKey, locationKey, gamemode}: Props) {

    const rsw = useRef<randomStreetView | null>(null);
    const streetViewElement = useRef(null);
    const mapElement = useRef(null);
    const marker = useRef<any>(null);
    const targetLocation = useRef<any>(null);
    const guessLocation = useRef<any>(null);
    const streetview = useRef<any>(null);
    const map = useRef<any>(null);
    const loadingMessage = useRef("Getting ready");
    const locKey = useRef(locationKey);

    const [submitted, setSubmitted] = useState(false);
    const [ready, setReady] = useState(false);

    const [r, _refresh] = useState(0);
    const refresh = useCallback(() => _refresh(p => p+1), [_refresh]);

    const saveLocationOnServer = useCallback(async () => {
        if (!locKey.current) return;
        const loc = targetLocation.current
        const encrypted = LE.encryptLocation([loc[0], loc[1]]);
        fetch('/api/save-location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                location: encrypted,
                key: locKey.current,
            })
        })
    }, [targetLocation, locKey]);

    const chackeLocationValidity = useCallback(async (loc: [number, number]) => {
        const checkLocation = new google.maps.StreetViewService()
        const checkLatLng = new google.maps.LatLng(loc[0], loc[1]);
        let valid: boolean = false;
        await checkLocation.getPanorama({ location: checkLatLng, radius: 50 }, (data: any, status: any) => {
            valid = status === "OK";
        });
        return valid;
    }, []);

    const getRandomLocation = useCallback(async () => {
        let loc = [0, 0];
        do {
            let locationPromise: Promise<any>;
            if (gamemode.type === 'RANDOM') {
                rsw.current?.setParameters({
                    google: google as any,
                    polygon: gamemode.polygons as any || false,
                })
                locationPromise = rsw.current?.getRandomLocation() as Promise<any>;
            } else {
                const lSet = gamemode.locations as unknown as number[][];
                const randomIndex = Math.floor(Math.random() * lSet.length);
                locationPromise = Promise.resolve(lSet[randomIndex]);
            }
            loc = await locationPromise;
        } while (!await chackeLocationValidity(loc as any));
        targetLocation.current = loc;
        streetview.current.setPosition({ lat: loc[0], lng: loc[1] });
        await saveLocationOnServer();
        setTimeout(() => { setReady(true) }, 0);
        return loc;
    }, [gamemode, chackeLocationValidity, saveLocationOnServer]);

    useEffect(() => {
        if (typeof google === "undefined" || !map.current) return;
        loadingMessage.current = randomLocationLoadingMessage();
        setReady(false);
        if (marker.current) marker.current.setMap(null);
        guessLocation.current = null;
        map.current.setCenter(gamemode.center);
        map.current.setZoom(gamemode.zoom);
        setSubmitted(false);
        getRandomLocation();
    }, [r, loadingMessage, gamemode, getRandomLocation]);

    useEffect(() => {

        // Set up google maps api
        loadingMessage.current = randomLocationLoadingMessage();
        rsw.current = new randomStreetView();
        const loader = new Loader({ apiKey: googleMapsApiKey, 
            version: 'weekly',
            libraries: ['geometry']
        });

        let street: google.maps.StreetViewPanorama;
        let gmap: google.maps.Map;

        // Load google maps api

        loader.load().then(async () => {

            // Create streetview panorama

            street = new google.maps.StreetViewPanorama(
                streetViewElement.current as any, {
                pov: {heading: 165, pitch: 0},
                motionTrackingControlOptions: {
                    position: google.maps.ControlPosition.LEFT_BOTTOM
                },
                addressControl: false,
                fullscreenControl: false,
                linksControl: false,
                showRoadLabels: false,
                });
            streetview.current = street;

            // Create map

            gmap = new google.maps.Map(mapElement.current as any, {
                zoom: gamemode.zoom,
                center: gamemode.center,
            });

            // Create marker on click

            gmap.addListener('click', (e: any) => {
                if (marker.current) { marker.current.setMap(null); }
                marker.current = new google.maps.Marker({
                    position: e.latLng,
                    map: gmap
                });
                guessLocation.current = [e.latLng.lat(), e.latLng.lng()];
                document.getElementById("guessLocation-button")?.removeAttribute("disabled");
            });
            map.current = gmap;

            getRandomLocation();
            
        });
    }, [locationKey, googleMapsApiKey, gamemode, getRandomLocation]);

    const handleSubmit = useCallback(() => {
        if (!guessLocation.current) return;
        setSubmitted(true);

        if (!locKey.current) return;
        fetch("/api/submit-location", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                location: guessLocation.current,
                key: locKey.current
            })
        }).then(async res => {
            if (res.status === 200) {
                const data = await res.json();
                if (data.newKey) locKey.current = data.newKey;
            }
        })
    }, [guessLocation, locKey]);

    const backCallback = useCallback(() => {
        if (!streetview.current || !targetLocation.current) return
        streetview.current.setPosition({
            lat: targetLocation.current[0],
            lng: targetLocation.current[1]
        });
    }, [targetLocation, streetview]);

    const handleBack = () => backCallback();

    return (
        <>
        <Head>
            <title>{gamemode.name} | Earthguesser</title>
        </Head>
        <div className="flex flex-col items-center justify-center h-full relative">
            <div id="street" ref={streetViewElement} className="h-full w-full" />

                <div className="absolute bottom-16 md:right-24 z-10 w-80
                    rounded-lg right-[50%] translate-x-[50%] md:translate-x-0">

                    <ArrowBackUp className='p-2 bg-neutral-900 box-content
                    rounded-full ml-auto hover:brightness-90 cursor-pointer'
                    onClick={handleBack} />

                    <div id='map' ref={mapElement}
                    className="w-full h-48 rounded-lg my-6 shadow-md"/>

                    <button type='button' className='bg-green-700
                    text-white font-bold py-2 px-4 rounded-full w-full uppercase
                    disabled:opacity-50 disabled:pointer-events-none shadow-md'
                     id='guess-button' onClick={handleSubmit}>
                        guess
                    </button>

            </div>
            <Suspense>
                <Result show={submitted}
                loc1={targetLocation.current as any} 
                loc2={guessLocation.current as any}
                multiplier={gamemode.multiplier}
                refresh={refresh}/>
            </Suspense>
            {!ready && <div className='w-full h-full absolute bg-neutral-900 z-10
            flex items-center justify-center'>
                <div className='flex flex-col items-center fade-in-down'>
                    <Image src={earthBounce} alt="Bouncing earth svg."
                    width={64} height={64} />
                    <p className='text-sm text-neutral-400 mt-2'>
                        {loadingMessage.current}
                    </p>
                </div>
            </div>}
        </div>
        </>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {

    let gcode = context.query.gamemode;
    if (typeof gcode === 'string') gcode = gcode.toLocaleUpperCase();
    if (typeof gcode !== "string" || !gamemodes.map(gm => gm.code).includes(gcode)) {
        context.res.writeHead(302, {
            Location: '/'
        });
        context.res.end();
        return { props: {} };
    }

    const locationKey = (await getSession(context))?.user ? createLocationKey(gcode) : null;

    context.res.setHeader("set-cookie", 
        `gamemode=${gcode};\
        path=/;\
        same-site=strict;\
        max-age=31536000;\
        httponly\
    `);

    return {
        props: {
            googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
            locationKey,
            gamemode: gamemodes.find(gm => gm.code === gcode)
        }
    }
}

interface Props {
    googleMapsApiKey: string
    locationKey: string | null
    gamemode: typeof gamemodes[number]
}

export default Index

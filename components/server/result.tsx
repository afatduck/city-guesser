import React, { useEffect } from 'react'
import { getCenter, getDistance, getPoints, getZoom } from '../../utils/distance'
import { ResultMessages } from '../../utils/result-messages'

import styles from "../../styles/component-styles/result.module.css"

const distanceToString = (distance: number) => {
    if (distance < 1000) {
        return `${distance} m`
    } else {
        return `${(distance / 1000).toFixed(2)} km`
    }
}

function Result({loc1, loc2, show}: Props) {

    const resultMap = React.useRef<HTMLDivElement>(null)

    const distance = !show ? 0 : getDistance(loc1[0], loc1[1], loc2[0], loc2[1])
    const center = !show ? [0,0] : getCenter(loc1[0], loc1[1], loc2[0], loc2[1])
    const points = !show ? null : getPoints(distance)

    useEffect(() => {

        if (!show) return;

        // Create map
        const google = window.google
        const map = new google.maps.Map(resultMap.current as HTMLDivElement, {
            zoom: getZoom(distance),
            center: { lat: center[0], lng: center[1] },
            disableDefaultUI: true,
        })

        // Create target marker
        new google.maps.Marker({
            position: { lat: loc1[0], lng: loc1[1] },
            map: map,
            title: 'Target',
        })

        // Create guess marker
        new google.maps.Marker({
            position: { lat: loc2[0], lng: loc2[1] },
            map: map,
            title: 'Your Guess',
        })

        // Create line
        new google.maps.Polyline({
            path: [{lat: loc1[0], lng: loc1[1]}, {lat: loc2[0], lng: loc2[1]}],
            strokeColor: '#f00',
            strokeOpacity: 1.0,
            strokeWeight: 2,
            map: map,
        })

    }, [center, distance, loc1, loc2])

    if (!show) return <></>

  return (
      <div className={'modal-outer ' + styles.body}>

        <div className=''>

            <div className='justify-between flex flex-col items-center gap-8 md:flex-row'>
                <h2 className='font-bold text-4xl'>{ResultMessages(distance)}</h2>
                <p className='text-2xl text-green-500 font-bold'>
                    +{points} points
                </p>
            </div>

            <div className={styles['distance-slider']}>
                <div className={styles['distance-slider-label']}/>
                <div className={styles['distance-slider-center']}>
                    <div className={styles['distance-slider-bar']}/>
                    <span className={styles['distance-slider-value']}>
                        Distance from actual location: {distanceToString(distance)}
                        </span>
                </div>
                <div className={styles['distance-slider-label']}/>
            </div>

            <div ref={resultMap} 
            className="w-full mt-8 h-64 rounded-lg"/>

            <button className='bg-green-700 mt-8
            text-white font-bold py-2 px-4 rounded-full w-full uppercase'
            onClick={() => window.location.reload()}>
                Play Again
            </button>

        </div>

      </div>
  )
}

export default Result


interface Props {
    loc1: [number, number],
    loc2: [number, number],
    show: boolean,
}
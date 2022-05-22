import React, { useEffect } from 'react'
import { getCenter, getDistance, getPoints, getZoom } from '../../utils/distance'
import { ResultMessages } from '../../utils/result-messages'

const distanceToString = (distance: number) => {
    if (distance < 1000) {
        return `${distance} m`
    } else {
        return `${(distance / 1000).toFixed(2)} km`
    }
}

function Result({loc1, loc2, show}: Props) {

    if (!show) return <></>

    const distance = getDistance(loc1[0], loc1[1], loc2[0], loc2[1])
    const center = getCenter(loc1[0], loc1[1], loc2[0], loc2[1])
    const points = getPoints(distance)

    const resultMap = React.useRef<HTMLDivElement>(null)

    useEffect(() => {
        const google = window.google
        const map = new google.maps.Map(resultMap.current as HTMLDivElement, {
            zoom: getZoom(distance),
            center: { lat: center[0], lng: center[1] },
            disableDefaultUI: true,
        })

        new google.maps.Marker({
            position: { lat: loc1[0], lng: loc1[1] },
            map: map,
            title: 'Target',
        })

        new google.maps.Marker({
            position: { lat: loc2[0], lng: loc2[1] },
            map: map,
            title: 'Your Guess',
        })

    }, [])

  return (
      <div className='absolute w-full h-full bg-[#000a] flex justify-center 
      items-center top-0 left-0 z-20'>

        <div className='absolute p-8 w-[90%] lg:w-[50vw] md:p-16 bg-neutral-900 rounded-2xl'>

            <div className='justify-between flex flex-col items-center gap-8 md:flex-row'>
                <h2 className='font-bold text-4xl'>{ResultMessages(distance)}</h2>
                <p className='text-2xl text-green-500 font-bold'>
                    +{points} points
                </p>
            </div>

            <div className='distance-slider'>
                <div className='distance-slider-label'/>
                <div className='distance-slider-center'>
                    <div className='distance-slider-bar'/>
                    <span className='distance-slider-value'>
                        Distance from actual location: {distanceToString(distance)}
                        </span>
                </div>
                <div className='distance-slider-label'/>
            </div>

            <div ref={resultMap} 
            className="w-full mt-8 h-64 rounded-lg"/>

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
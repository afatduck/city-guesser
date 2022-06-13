import React from 'react'

const getColor = (multiplier: number) => {
    if (multiplier === 4) return "text-green-600";
    if (multiplier > 3) return "text-green-500";
    if (multiplier > 2.5) return "text-green-400";
    if (multiplier > 2) return "text-green-300";
    if (multiplier > 1.5) return "text-green-200";
    if (multiplier > 1) return "text-green-100";
    if (multiplier === 1) return "text-white";
    if (multiplier > .8) return "text-red-100";
    if (multiplier > .6) return "text-red-200";
    if (multiplier > .4) return "text-red-300";
    if (multiplier > .2) return "text-red-400";
    if (multiplier > .1) return "text-red-500";
    return "text-red-600";
}

function Multiplier({className, multiplier}: Props) {
  return (
    <p className={`${getColor(multiplier)} ${className}`}>x{multiplier}</p>
  )
}

export default Multiplier

interface Props {
    multiplier: number
    className?: string
}

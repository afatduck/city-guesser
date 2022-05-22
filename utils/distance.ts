function toRadians(degrees: number) {
    return degrees * Math.PI / 180;
}

function toDegrees(radians: number) {
    return radians * 180 / Math.PI;
}

// Get distance in meters between two points on Earth
export function getDistance(lat1: number, lon1: number, lat2:number, lon2:number) {    
    var R = 6371e3; // metres
    var φ1 = toRadians(lat1);
    var φ2 = toRadians(lat2);
    var Δφ = toRadians(lat2 - lat1);
    var Δλ = toRadians(lon2 - lon1);

    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

// Return center between two points
export function getCenter(lat1: number, lon1: number, lat2:number, lon2:number) {
    var lat = (lat1 + lat2) / 2;
    var lon = (lon1 + lon2) / 2;
    return [lat, lon];
}

// Make a inverse exponential function returns a number of points based
// on how close the user was to the target
export function getPoints(distance: number): number {
    return Math.floor((3/Math.exp(distance / 200000)) * 500);
}
         
export function getZoom(distance: number): number {
    if (distance < 1000) {
        return 12;
    } 
    else if (distance < 5000) {
        return 11;
    }
    else if (distance < 10000) {
        return 10;
    }
    else if (distance < 20000) {
        return 9;
    }
    else if (distance < 50000) {
        return 8;
    }
    else if (distance < 100000) {
        return 7;
    }
    else if (distance < 200000) {
        return 6;
    }
    else if (distance < 500000) {
        return 5;
    }
    else if (distance < 1000000) {
        return 4;
    }
    else if (distance < 2000000) {
        return 3;
    }
    else if (distance < 5000000) {
        return 2;
    }
    else if (distance < 10000000) {
        return 1;
    }
    else {
        return 0;
    }
}
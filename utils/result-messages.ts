const AmazingResult = () => {
    const options = ["Amazing!", "Wow!", "Excelent!", "Ace!", "A natural!"];
    return options[Math.floor(Math.random() * options.length)];
}

const GoodResult = () => {
    const options = ["Good!", "Nice!", "Almost there!", "Close one!", "On the right track!"];
    return options[Math.floor(Math.random() * options.length)];
}

const NutralResult = () => {
    const options = ["Not bad!", "Not too bad!", "It can pass.", "Could be better.", "It's OK."];
    return options[Math.floor(Math.random() * options.length)];
}

const BadResult = () => {
    const options = ["Yikes.", "A bit off...", "You can do better.", "Not good really.", "It could be worse."];
    return options[Math.floor(Math.random() * options.length)];
}

const TerribleResult = () => {
    const options = ["Terrible!", "Awful!", "This is BAD.", "You're a failure!", "Embarrassing!"];
    return options[Math.floor(Math.random() * options.length)];
}

export const ResultMessages = (distance: number) => {

    // Distance is in meters

    const d = distance / 1000;

    if (d < .5) {
        return AmazingResult();
    }
    else if (d < 10) {
        return GoodResult();
    }
    else if (d < 200) {
        return NutralResult();
    }
    else if (d < 2000) {
        return BadResult();
    }
    else {
        return TerribleResult();
    }

}

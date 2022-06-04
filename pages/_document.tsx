import { Html, Main, NextScript, Head } from "next/document";

export default function Document() {
    return <Html>
        <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
        <meta name="description" content="GeoGuessr rip-off. Guess your location on Earth after being placed on a random Google Streetview location. Earn pointt for your guesses and compete in a global leaderboard." />
        <meta name="keywords" content="GeoGuessr Free, EarthGuesser, Play GeoGuessr for free, Geography games online, Guessing games online, Geuguessr alternatives" />
        </Head>
        <body>
            <Main />
            <NextScript />
        </body>
    </Html>
}
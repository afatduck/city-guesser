declare module 'random-streetview' {
    class randomStreetView {
        getRandomLocation: () => Promise<[number, number]>
        setParameters: (p: any) => void 
    };

    export default randomStreetView;
}
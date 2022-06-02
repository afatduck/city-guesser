/**
 * @name cropImage
 * @description Takes base64 image and crop in percentages and returns a new base64 image
 * @param {Props} props Image to be cropped, and crop percentages.
 * @param {string} props.src Base64 image to be cropped.
 * @param {number} props.x Percentage of the image to be cropped from the left. 
 * @param {number} props.y Percentage of the image to be cropped from the top.
 * @param {number} props.width Percentage of the width of image.
 * @param {number} props.height Percentage of the height of image.
 * @param {number} minHeight Minimum height of the cropped image.
 * @param {number} minWidth Minimum width of the cropped image.
 * @param {square} square If true, the image has to be cropped to a square.
 * 
 * @returns {Promise<string>} Promise resolving to a new base64 image.
 */
export default function cropImage(
    {src, x, y, width, height}: Props,
    minWidth: number = 128,
    minHeight: number = 128,
    square: boolean = true
    ): Promise<string> {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        const image = new Image();
        
        image.src = src;
        image.onload = () => {

            const newWidth = Math.round(image.width * width / 100);
            const newHeight = Math.round(image.height * height / 100);
            const newX = Math.round(image.width * x / 100);
            const newY = Math.round(image.height * y / 100);

            if (newHeight < minHeight || newWidth < minWidth)
                reject('Cropped image is too small.');

            if (square && newWidth !== newHeight)
                reject('Image is not square.');

            canvas.width = newWidth;
            canvas.height = newHeight;

            context.drawImage(image, newX, newY, newWidth, newHeight, 0, 0, newWidth, newHeight);
            const croppedImage = canvas.toDataURL("image/png");
            resolve(croppedImage);
        };
        image.onerror = () => {
            reject('Image not valid.');
        }
    })
}

interface Props {
    src: string
    x: number
    y: number
    width: number
    height: number
}
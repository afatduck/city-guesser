export const shortenNumber = (num: number): string => {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
}

export const formatImageURL = (url: string) => {
    if (url.match(/^https?:\/\//)) return url;
    else if (url.match(/^data:image\/[a-z]+;base64,/)) return url;
    else return `https://storage.googleapis.com/earthguesser-bucket/avatars/${url}`;
}
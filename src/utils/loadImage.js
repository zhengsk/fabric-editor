import Promise from 'bluebird';

export default (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            resolve(img);
        };

        // img.onerror = (err) => {
        //     reject(err);
        // };

        img.src = src;
    });
};
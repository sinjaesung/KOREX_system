exports.register = (files) => {
    const images = [];
    const fileKeys = Object.keys(files);

    fileKeys.forEach(fileKey => {
        const file = files[fileKey];

        if (file.constructor === Object) {
            images.push(file.key);
        };
        
        if (file.constructor === Array) {
            file.forEach(f => {
                images.push(f.key);
            });
        }; 
    });

    return images;
};

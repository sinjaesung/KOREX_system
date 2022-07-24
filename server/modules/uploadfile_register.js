exports.register = (files, data) => {
    console.log('===>>>common upload reigsiter filess:',files,data);
    try {
        let images = [];

        switch (data.folder) {
            case 'board/':
                return files[0].location
            default:
                files.forEach(file => {
                    images.push(file.key)
                });
        
                return images;
        } 
    }
    catch (err) {
      console.log(err)
    }
};

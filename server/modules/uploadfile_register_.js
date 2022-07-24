exports.register_ = (files, data) => {
    console.log('===>>>common upload reigsiter filess:',files,data);
    try {
        let images = [];
        let files_array=Object.keys(files);//만약 다중 namne관련파라미터로 여러개 파일로 넘어온경우. 다중 파라미터name별 객체별로써 객체하가나 하나의 파일이고,배열이라면 여러개파일 name별 여러개파일인것이다.

        switch (data.folder) {
            case 'board/':
                return files[0].location
            default:
                files_array.forEach(file => {
                    console.log('각키값 file:',file, files[file]);//각 키에 대한값은 객체베열일것임. 각 키(name)별 외부순회, 각 키별 파일객체들
                    let file_arrays=files[file];

                    for(let s=0; s<file_arrays.length; s++){
                        let file_item=file_arrays[s];//file items....
                        console.log('각 파일 아이템즈::',file_item);
                        images.push(file_item.key);
                    }
              });
      
              return images;
          } 
    }
    catch (err) {
        console.log(err)
    }
};
  
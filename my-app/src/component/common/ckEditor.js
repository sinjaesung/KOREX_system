import React, { useEffect,useState } from 'react';
 import {CKEditor} from 'ckeditor4-react';

 const Editor= ({input})=> {
    console.log('Editor실행테스트>>:',input);
    
    const [value,setvalue]=useState(input);
   
    useEffect(()=>{
        console.log('value값 변경 및 조회:',value);
    },[value])
return (
<div className="flex flex-col flex-1">  
 <CKEditor

    initData={value}

    config={{
      //editorplaceholder: "hello ...", //tried this
      readOnly:true, //tried this
      //placeholder: "Placeholder text...", //also tried this
      toolbar: [ [ 'Bold', 'Italic', 'Undo', 'Redo', 'Link', 'Unlink', "NumberedList", "BulletedList","Placeholder" ] ]
    }}
   />
   </div> 
   );
};
export default Editor;
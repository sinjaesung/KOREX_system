
// " , " 넣기
function InsertComma(int){
    return (String(int).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'))
}

// 날짜 -> 텍스트 변환
function DateText(date, text){
    let month = String(date.getMonth()+1);
    let _date = String(date.getDate());

    if(month.length == 1){
        month = "0"+String(date.getMonth()+1);
    }
    if(_date.length == 1){
        _date = "0"+String(date.getDate());
    }

    return (`${date.getFullYear()}${text}${month}${text}${_date}`)
}

// 문자열 자르고 "..."넣기
function SliceText(text, int){
    if(String(text).length > int){
        let newText = text;
        newText=newText.substring(0, int) + "...";
        return newText;
    }else{
        return text;
    }

}

function numTokor(num) {
    //!!@@ 211108_이형규> 억단위 넘어가는 숫자는 에러 발생
    // var newNum = num.replace(",", "");
    // newNum = Number(newNum) * 10000;
    var newNum = num * 10000;
    var inputNumber = newNum < 0 ? false : newNum;
  
    var unitWords = ['', '만', '억', '조', '경'];
    var splitUnit = 10000;
    var splitCount = unitWords.length;
    var resultArray = [];
    var resultString = '';
  
    for (var i = 0; i < splitCount; i++) {
      var unitResult = (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);
      unitResult = Math.floor(unitResult);
      if (unitResult > 0) {
        resultArray[i] = unitResult;
      }
    }
  
    for (var i = 0; i < resultArray.length; i++) {
      if (!resultArray[i]) continue;
      resultString = String(resultArray[i]) + unitWords[i] + resultString;
    }
  
    return resultString;
  }

  const insertYMComma = (string) => {
    let newString = string;
    newString.substring(0, 2);
    newString = newString.substring(2, 6);
    newString = newString.replace(/(.{2})/g, "$1.")
    newString = newString.substring(0, 5);
    return newString
  }

  function insertZero(string) {
    let newString = string;
    if (string.length == 1) {
      newString = "0" + string;
    }
    return newString
  }
  
export {InsertComma, DateText, SliceText, numTokor, insertYMComma, insertZero}
function createEle (eleName,classArr,styleObj){
   
    var dom = document.createElement(eleName);

    for(var i = 0;i < classArr.length; i ++){
        dom.classList.add(classArr[i]);
    }

    for(var key in styleObj){
        dom.style[key] = styleObj[key];
    }

    return dom;

}

function setLocal(key,value){
    if(typeof value === "object" && value !== null){
        value = JSON.stringify(value);
    }
    localStorage.setItem(key,value);
}

function getLocal(key,value){
    var value = localStorage.getItem(key,value);
    if(value === null) {return value;};
    if(value[0] === '[' || value[0] === '{') {
        return JSON.parse(value);
      }
      return value;
}

function formatNum (num){
    if(num<10){
        return "0" + num;
    }else{
        return num;
    }

}
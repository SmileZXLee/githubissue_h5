function timeFormat(inputTime){
	if(!inputTime && typeof inputTime !== 'number'){
		return '';
	}
	var localTime = '';
	inputTime = new Date(inputTime).getTime();
	const offset = (new Date()).getTimezoneOffset();
	localTime = (new Date(inputTime - offset * 60000)).toISOString();
	localTime = localTime.substr(0, localTime.lastIndexOf('.'));
	localTime = localTime.replace('T', ' ');
	return localTime;
}

function removeItemFromArr(arr, item) {
   return arr.filter(function(cur,index,src){
        if(cur === item){
            return false;
        }
        return true;
    });
}

module.exports = {
  timeFormat,
  removeItemFromArr
}

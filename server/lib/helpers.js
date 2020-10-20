/**
* Global helpers
*/

function slugify(str) {

	if(str){
    	str = str.toLowerCase().replace(/ /g, '-').replace(/:/g,'-').replace(/&/g,'-').replace(/--/g,'-');
    	str = str.replace(/--/g,'-');
    	return str;
	}else{
		return str;
	}
}

module.exports = {
	slugify:slugify
}
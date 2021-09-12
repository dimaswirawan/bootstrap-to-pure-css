const { promisify } = require('util');
const fs =  require('fs');
const readFilePromise = promisify(fs.readFile);

const readFile = async (path) => {
	return await readFilePromise(path);
}

(async() =>{
	const readCss = await readFile('css/styles.css');
	var raw = readCss.toString();
	raw = raw.replace(/{/g, '|{');
	raw = raw.replace(/}/g, '}|');
	var split_awal = raw.split('@media');

	for (var i = 0; i < split_awal.length; i++) {
		if (i > 0) {
			split_awal[i] = '@media'+split_awal[i];
		}
	}

	var css_media = [];
	var css = [];

	for (var i = 0; i < split_awal.length; i++) {
		var item = {};
		var send_item = false;
		if (i == 0) {
			var split_kedua = split_awal[i].split("|");
			for (var x = 0; x < split_kedua.length; x++) {
				var string = split_kedua[x].replace(/\n/g, '');
				if (string.charAt(0) == "{" && string.length > 1) {
					string = string.replace(/{/g, '');
					string = string.replace(/}/g, '');
					string = string.replace(/  /g, '');
					item.value = string;
					send_item = true;
				}else if (string != "}" && string != ""){
					var last = string.length - 1;
					if (string.charAt(last) == " ") {
						string= string.slice(0, -1);
					}
					item.identifier = string;
					send_item = false;
				}
				if (send_item) {
					if (item.identifier == undefined && item.value == undefined) {
					}else{
						css.push(item);
					}
					item = {};
				}
			}
		}else if (i > 0) {
			var split_kedua = split_awal[i].split("|");
			var flag = false;
			var media_item = {};
			media_item.member = [];
			for (var x = 0; x < split_kedua.length; x++) {
				var string = split_kedua[x].replace(/\n/g, '');
				if (x == 0) {
					var split_cari_media_condition = split_kedua[x].split("(");
					if (split_cari_media_condition[1] == undefined) {
						media_item.media = split_kedua[x].replace(/@media/g, '')
					}else{
						try{
							media_item.media = split_cari_media_condition[1].replace(")");
						}catch(err){
							console.log(split_cari_media_condition)
							console.log(err)
						}
					}
				}else if(x == 1){
					string = string.replace(/{/g, '');
					string = string.replace(/  /g, '');
					var last = string.length - 1;
					if (string.charAt(last) == " ") {
						string= string.slice(0, -1);
					}
					item.identifier = string;			
				}else{
					if (string.charAt(0) == "{" && string.length > 1) {
						string = string.replace(/{/g, '');
						string = string.replace(/}/g, '');
						string = string.replace(/  /g, '');
						item.value = string;
						send_item = true;
					}else if (string != "}" && string != ""){
						var last = string.length - 1;
						if (string.charAt(last) == " ") {
							string= string.slice(0, -1);
						}
						item.identifier = string;
						send_item = false;
					}
					if (flag) {
						if (send_item) {
							if (item.identifier == undefined && item.value == undefined) {
							}else{
								css.push(item);
							}
							item = {};
						}
					}else{
						if (item.identifier == undefined && item.value == undefined) {
						}else{
							media_item.member.push(item)
						}
						item = {};
					}
				}
				if (string == "}") {
					flag = true;
					css_media.push(media_item);
				}
			}
		}
	}
	console.log(css.length)
})();



	// console.log(JSON.stringify(css_media))
	// console.log(css_media[0].member)
	/*
		var ini_css_media = [
								{
									media: "prefers-reduced-motion: no-preference",
									child: [
										{
											identifier : ":root",
											value: "scroll-behavior: smooth;"
										}
									]
								}
							]
		var css_normal = [
							{
								identifier : ":root",
								value: "scroll-behavior: smooth;"
							}
						]
	*/
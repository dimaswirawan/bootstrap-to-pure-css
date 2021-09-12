const { promisify } = require('util');
const fs =  require('fs');
const readFilePromise = promisify(fs.readFile);

const readFile = async (path) => {
	return await readFilePromise(path);
}

(async() =>{
	const readHtml = await readFile(`index.html`);
	var raw = readHtml.toString();
	var data = raw.split('class="');
	data.shift();
	var list_css = [];
	var css = [];
	for (var i = 0; i < data.length; i++) {
		var data_css = data[i].split('"');
		list_css.push(data_css[0]);
	}
	for (var i = 0; i < list_css.length; i++) {
		var data_css = list_css[i].split(" ")
		css = css.concat(data_css);
	}
	let unique = [...new Set(css)];
	// console.log(unique.length)
	// for (var i = 0; i < unique.length; i++) {
	// 	unique[i]
	// }
	fs.writeFile("css.json", JSON.stringify(unique), (err) => {
	});
})();
// const names = ["Mike","Matt","Nancy","Adam","Jenny","Nancy","Carl","Nancy"];
// let unique = [...new Set(names)];
// console.log(unique);
const http = require('http');
//moodul URL päringu parsimisex
const url = require('url');
//moodul failitee haldamisex
const path = require('path');
const fs = require('fs').promises;
const dateTimeET = require('./src/dateTimeET.js');
const pageHead = '<!DOCTYPE html>\n<html lang="et">\n<head>\n\t<meta charset="utf-8">\n\t<title>Karl Marcus Männa, veebiprogrammeerimine</title>\n</head>\n<body>\n';
const pageBanner = '<img src="veebiprogrammeerimine_2026_AA.png" alt="banner">';
const pageBody = '\t<h1>Karl Marcus Männa, veebiprogrammeerimine</h1>\n\t <p>See leht on loodud veebiprogrammeerimise kursusel <a href="https://www.tlu.ee">Tallinna Ülikoolis</a> ning ei sislda tõsiseltvõetavat sisu!</p>\n\t<p>Esialgu tutvusime lihtsalt HTML keelega, peatselt programmeerime.</p>\n\t<hr>';
const pageFoot = '\n</body>\n</html>';

http.createServer(async function(req, res){
	console.log(req.url)
	let currentURL = url.parse(req.url, true);
	console.log('Parsituna: ' + currentURL.pathname);
	
	if(currentURL.pathname === '/'){
		res.writeHead(200, {"Content-type": "text/html"});
		//res.write('Meie veeb käivitus!');
		res.write(pageHead);
		res.write(pageBanner);
		res.write(pageBody);
		res.write('<p>Täna on ' + dateTimeET.weekDayET() + '</p>');
		res.write('<p>Kuupäev on ' + dateTimeET.dateET() + '</p>');
		res.write('<p>Kellaaeg lehe avamisel on ' + dateTimeET.timeET() + '</p>');
		res.write(pageFoot);
		return res.end();
	}
	else if(currentURL.pathname === '/vanasona'){
		res.writeHead(200, {"Content-type": "text/html"});
		//res.write('Meie veeb käivitus!');
		res.write(pageHead);
		res.write(pageBanner);
		res.write('<h1>Tänase päeva vanasõna</h1><p>Siin näed tänaseks loositud Eesti vanasõna.</p><hr>');
		res.write(pageFoot);
		return res.end();
	}
	else if(currentURL.pathname=== '/veebiprogrammeerimine_2026_AA.png'){
		//liidame virtuaalse serveri päris failikataloogidega
		let bannerPath = path.join(__dirname, 'pic', currentURL.pathname);
		try {
			const data = await fs.readFile(bannerPath)
			res.write(200, {"Content-type": "image/png"});
			res.end(data);
		} catch(err) {
			res.writeHead(404, {"Content-type": "text/plain; charset=utf8"});
			return res.end('Pilti ei leitud!');
		}
	}
	
/*	else if(currentURL.pathname=== '/veebiprogrammeerimine_2026_AA.png'){
		//liidame virtuaalse serveri päris failikataloogidega
		let bannerPath = path.join(__dirname, 'pic', currentURL.pathname);
		fs.readFile(bannerPath, (err, data)=>{
			if(err){
				throw(err);
			} else {
				res.writeHead(200, {"Content-type": "image/png"});
				res.end(data);
			}
		});
	} */
	
	else {
		res.end('Viga 404! Ei leia sellist nalja!');
	}
}).listen(5325)
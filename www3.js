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
		res.write('<br><img src="/luna.jpg" alt="Luna" width="400">');
		res.write(pageBody);
		res.write('<p><a href="/vanasona">Vanasõna</a></p>');
		res.write('<p><a href="/kalkulaator">Mäng</a></p>');
		res.write('<p>Täna on ' + dateTimeET.weekDayET() + '</p>');
		res.write('<p>Kuupäev on ' + dateTimeET.dateET() + '</p>');
		res.write('<p>Kellaaeg lehe avamisel on ' + dateTimeET.timeET() + '</p>');
		res.write(pageFoot);
		return res.end();
	}
	else if(currentURL.pathname === '/kalkulaator'){
	res.writeHead(200, {"Content-type": "text/html"});
	res.write(pageHead);
	res.write(pageBanner);
	res.write('<br><img src="/calc.jpg" alt="Calculator" width="300">');

	res.write(`
		<h1>Math game</h1>
		<p>Choose a game mode and test your mental math skills!</p>

		<div id="settings">
			<p>
				<label>
					<input type="radio" name="mode" value="time" checked>
					Time limited
				</label>
			</p>

			<p>
				<label>
					<input type="radio" name="mode" value="amount">
					Amount of calculations
				</label>
			</p>

			<p>
				<label for="gameValue">Seconds or calculations:</label>
				<input type="number" id="gameValue" value="30" min="1">
			</p>

			<button onclick="startGame()">Start game</button>
		</div>

		<div id="game" style="display: none;">
			<h2 id="calculation"></h2>

			<input type="number" id="answer">
			<button onclick="checkAnswer()">Submit</button>

			<p id="message"></p>

			<hr>

			<p>Correct: <span id="correct">0</span></p>
			<p>Mistakes: <span id="mistakes">0</span></p>
			<p>Successful calculations: <span id="calculations">0</span></p>
			<p>Time: <span id="time">0</span> seconds</p>
		</div>

		<div id="results" style="display: none;">
			<h2>Results</h2>

			<p>Correct: <span id="finalCorrect"></span></p>
			<p>Mistakes: <span id="finalMistakes"></span></p>
			<p>Successful calculations: <span id="finalCalculations"></span></p>
			<p>Time: <span id="finalTime"></span> seconds</p>

			<button onclick="location.reload()">Play again</button>
		</div>

		<script>
			let correct = 0;
			let mistakes = 0;
			let calculations = 0;

			let correctAnswer = 0;
			let mode;
			let gameValue;

			let startTime;
			let timer;

			function randomNumber(min, max) {
				return Math.floor(Math.random() * (max - min + 1)) + min;
			}

			function startGame() {
				mode = document.querySelector('input[name="mode"]:checked').value;
				gameValue = Number(document.getElementById("gameValue").value);

				correct = 0;
				mistakes = 0;
				calculations = 0;

				startTime = Date.now();

				document.getElementById("settings").style.display = "none";
				document.getElementById("game").style.display = "block";

				newCalculation();

				timer = setInterval(updateTime, 100);
			}

			function newCalculation() {
				let operators = ["+", "-", "*", "/"];
				let operator = operators[randomNumber(0, operators.length - 1)];

				let number1;
				let number2;

				if (operator === "+") {
					number1 = randomNumber(1, 100);
					number2 = randomNumber(1, 100);
					correctAnswer = number1 + number2;
				}

				else if (operator === "-") {
					number1 = randomNumber(1, 100);
					number2 = randomNumber(1, number1);
					correctAnswer = number1 - number2;
				}

				else if (operator === "*") {
					number1 = randomNumber(1, 100);
					number2 = randomNumber(1, 10);
					correctAnswer = number1 * number2;
				}

				else {
					number1 = randomNumber(1, 100);
					number2 = randomNumber(1, 10);
					correctAnswer = Math.floor(number1 / number2);
				}

				document.getElementById("calculation").textContent =
					number1 + " " + operator + " " + number2 + " =";

				document.getElementById("answer").value = "";
				document.getElementById("answer").focus();
			}

			function checkAnswer() {
				let answer = Number(document.getElementById("answer").value);

				if (answer === correctAnswer) {
					document.getElementById("message").textContent = "Correct!";

					correct++;
					calculations++;

					document.getElementById("correct").textContent = correct;
					document.getElementById("calculations").textContent = calculations;

					if (mode === "amount" && calculations >= gameValue) {
						endGame();
						return;
					}

					newCalculation();
				}

				else {
					document.getElementById("message").textContent = "Try again!";
					mistakes++;

					document.getElementById("mistakes").textContent = mistakes;
					document.getElementById("answer").value = "";
					document.getElementById("answer").focus();
				}
			}

			function updateTime() {
				let totalTime = Math.floor((Date.now() - startTime) / 1000);

				document.getElementById("time").textContent = totalTime;

				if (mode === "time" && totalTime >= gameValue) {
					endGame();
				}
			}

			function endGame() {
				clearInterval(timer);

				let totalTime = Math.round((Date.now() - startTime) / 1000);

				document.getElementById("game").style.display = "none";
				document.getElementById("results").style.display = "block";

				document.getElementById("finalCorrect").textContent = correct;
				document.getElementById("finalMistakes").textContent = mistakes;
				document.getElementById("finalCalculations").textContent = calculations;
				document.getElementById("finalTime").textContent = totalTime;
			}

			document.addEventListener("keydown", function(event) {
				if (event.key === "Enter" &&
					document.getElementById("game").style.display !== "none") {
					checkAnswer();
				}
			});
		</script>
	`);

	res.write('<p><a href="/">Tagasi</a></p>');
	res.write(pageFoot);
	return res.end();
}
	else if(currentURL.pathname === '/vanasona'){
	try {
		let proverbPath = path.join(__dirname, 'txt', 'vanasonad.txt');

		let proverbData = await fs.readFile(proverbPath, 'utf8');

		let proverbs = proverbData
			.split(';')
			.map(proverb => proverb.trim())
			.filter(proverb => proverb !== '');

		let randomIndex = Math.floor(Math.random() * proverbs.length);
		let randomProverb = proverbs[randomIndex];

		res.writeHead(200, {"Content-type": "text/html; charset=utf-8"});
		res.write(pageHead);
		res.write(pageBanner);

		res.write('<h1>Tänane vanasõna</h1>');
		res.write('<p>' + randomProverb + '</p>');

		res.write('<hr>');
		res.write('<p><a href="/">Tagasi</a></p>');

		res.write(pageFoot);
		return res.end();

	} catch (err) {
		res.writeHead(500, {"Content-type": "text/plain; charset=utf-8"});
		return res.end('Vanatarkus sai otsa!');
	}
}
	else if(currentURL.pathname.endsWith('.jpg')){
	let imageName = path.basename(currentURL.pathname);
	let imagePath = path.join(__dirname, 'pic', imageName);

	try {
		const data = await fs.readFile(imagePath);
		res.writeHead(200, {"Content-type": "image/jpeg"});
		return res.end(data);
	} catch (err) {
		res.writeHead(404, {"Content-type": "text/plain; charset=utf-8"});
		return res.end('Pilti ei leitud!');
	}
}

	else if(currentURL.pathname=== '/veebiprogrammeerimine_2026_AA.png'){
		//liidame virtuaalse serveri päris failikataloogidega
		let bannerPath = path.join(__dirname, 'pic', currentURL.pathname);
		try {
			const data = await fs.readFile(bannerPath);
			res.writeHead(200, {"Content-type": "image/png"});
			return res.end(data);
		} catch (err) {
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
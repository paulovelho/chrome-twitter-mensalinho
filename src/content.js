let observer = new MutationObserver(gotRecords);
let headerChecked = false;

function debug(str, data) {
	if(data) {
		console.log("debug: " + str, data);
		return;
	}
	console.log("debug: " + str);
}

function getTip(content) {
	let tip = document.createElement('div');
	tip.classList.add('tooltip');
	tip.innerText = `A arroba ${content} recebeu ilegalmente para fazer propaganda política nas eleições de 2018`;
	tip.style.transform = 'translate("15px", "-100%")';
	return tip;
}

function getWarning() {
	let crimeWarning = document.createElement('span');
	crimeWarning.classList.add("crime-eleitoral");
	crimeWarning.innerHTML = `<b>Este perfil cometeu crime eleitoral!</b></br>Este é um dos envolvidos no escândalo do "<i>mensalinho do twitter</i>": em 2018, este perfil recebeu ilegalmente dinheiro de políticos para fazer campanha eleitoral, propagando pautas positivas disfarçadas de notícia de forma a favorecer certos candidatos.`;

	let warningContainer = document.createElement('div');
	warningContainer.classList.add("crime-eleitoral-container");
	warningContainer.appendChild(crimeWarning);
	return warningContainer;
}

function getIcon(content) {
	let icon = document.createElement('span');
	icon.classList.add("mensalinho");
	icon.innerHTML = "⚡💸";
	let tip = getTip(content);
	icon.appendChild(tip);
	icon.onmousemove = e => {
		tip.style.left = e.offsetX + 'px'
		tip.style.top = (e.offsetY - 30) + 'px';
	};
	return icon;
}

function addAntecedentesCriminais() {
	const description = document.querySelector('[data-testid="UserDescription"]');
	description.appendChild(getWarning());
}

function checkArroba(arroba) {
	const crime_eleitoral = mensalinhos.includes(arroba.toLowerCase());
	return crime_eleitoral;
}

function checkNode(node) {
	if(!node.querySelectorAll) return;
	const selector = "div.r-18u37iz span.css-901oao";
	const ats = node.querySelectorAll(selector);
	var found = false;
	for (var i = 0; i < ats.length; ++i) {
		var content = ats[i].innerHTML;
		if(content[0] != '@') continue;
		if(checkArroba(content)) {
			ats[i].appendChild(getIcon(content));
			found = true;
		}
	}
	return found;
}

function gotRecords(records) {
	records.map((r) => {
		for(var i = 0; i < r.addedNodes.length; i++) {
			checkNode(r.addedNodes[i]);
		}
	});
}

function checkHeader() {
	let container = document.querySelector('.r-ttdzmv');
	console.info("checking header");
	if ( container ) {
		if (checkNode(container)) {
			headerChecked = true;
			window.setTimeout(addAntecedentesCriminais, 1000);
			debug("mensaralho");
		} else debug("header clean");
	} else {
		window.setTimeout(checkHeader, 1000);
	}
}
function checkTimeline() {
	let container = document.querySelector('[role="region"]');
	if ( container ) {
		checkNode(container);
		observer.observe(container, {
			childList: true, // observe direct children
			subtree: true, // and lower descendants too
			characterDataOldValue: true // pass old data to callback
		});
	} else {
		window.setTimeout(checkTimeline, 3000);
	}
}

function limparFicha(){
	var elements = document.getElementsByClassName("mensalinho");
	while(elements.length > 0){
		elements[0].parentNode.removeChild(elements[0]);
	}
}

function looKForCrimes() {
	debug("chasing criminals");
	limparFicha();
	headerChecked = false;
	checkTimeline();
	checkHeader();
}

function Initialize() {
	looKForCrimes();
}

if (document.readyState === 'complete') {
	Initialize()
}
else {
	document.onreadystatechange = function () {
		if (document.readyState === "complete") {
			Initialize()
		}
	}
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	looKForCrimes();
});


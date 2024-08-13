(CSS_PATH = "css/tui.css"), (JS_PATH = "js/tui.js");
function loadDependency(e, t, n) {
	let s = document.head,
		c = document.getElementById("min-style"),
		i =
			"script" === t
				? document.createElement("script")
				: document.createElement("link");
	"script" === t
		? ((i.type = "text/javascript"), (i.src = e))
		: ((i.rel = "stylesheet"), (i.href = e)),
		"script" === t && null != n && ((i.onreadystatechange = n), (i.onload = n)),
		s.appendChild(i),
		c?.remove();
}
loadDependency(CSS_PATH, "link"),
	loadDependency(JS_PATH, "script", function () {
		init();
	});

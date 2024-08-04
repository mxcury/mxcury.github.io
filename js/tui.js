const MAIN_CONTAINER = document.getElementById("main-container");
const SECTION_CONTAINER = document.getElementById("section-container");
const LEFT_SECTION = document.getElementById("left-section");
const RIGHT_SECTION = document.getElementById("right-section");

const HOME_SECTION = document.getElementById("home");
const SKILLS_SECTION = document.getElementById("skills");
const EXPERIENCE_SECTION = document.getElementById("experience");
const PROJECTS_SECTION = document.getElementById("projects");
const FOOTER_SECTION = document.getElementById("footer");
const MAIN_CONTENT_SECTION = document
	.getElementById("main-content")
	?.getElementsByClassName("container-content")[0];

const COLORS = ["text-blue", "text-orange", "text-pink"];

const left_sections = [
	{ name: "home", section: HOME_SECTION, items: [] },
	{
		name: "experience",
		section: EXPERIENCE_SECTION,
		items: [...EXPERIENCE_SECTION.firstElementChild.children[2].children],
	},
	{
		name: "projects",
		section: PROJECTS_SECTION,
		items: [...PROJECTS_SECTION.firstElementChild.children[2].children],
	},
	{
		name: "skills",
		section: SKILLS_SECTION,
		items: [...SKILLS_SECTION.firstElementChild.children[2].children],
	},
];

const currentPosition = {
	sectionIndex: 0,
	sectionItemIndex: 0,
};

const previousPosition = {
	sectionIndex: 0,
	sectionItemIndex: 0,
};

function clamp(min, value, max) {
	return Math.min(Math.max(min, value), max);
}

function isMobile() {
	return window.innerWidth <= 768;
}

function getRandomTextColorClass() {
	return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function colorizeString(str) {
	return str
		.replaceAll("{{", () => `<span class="${getRandomTextColorClass()}">`)
		.replaceAll("}}", "</span>");
}

function isVisibleInScrollView(element, container) {
	const elementTop = element.offsetTop;
	const elementBottom = elementTop + element.clientHeight;

	const containerTop = container.scrollTop;
	const containerBottom = containerTop + container.clientHeight;

	return elementTop >= containerTop && elementBottom <= containerBottom;
}

function onHamburgerMenuPress() {
	const hamburgerButtonElement =
		document.getElementsByName("hamburger-toggle")[0];
	const navContainerElement =
		document.getElementsByClassName("nav-container")[0];

	if (hamburgerButtonElement.checked) {
		LEFT_SECTION.classList.add("menu-open");
		navContainerElement.style.opacity = 1;
	} else {
		LEFT_SECTION.classList.remove("menu-open");
		navContainerElement.style.opacity = 0.9;
	}
}

function closeHamburgerMenu() {
	const hamburgerButtonElement =
		document.getElementsByName("hamburger-toggle")[0];
	hamburgerButtonElement.checked = false;
	LEFT_SECTION.classList.remove("menu-open");
}

function clearMainContent() {
	MAIN_CONTENT_SECTION.innerHTML = "";
	MAIN_CONTENT_SECTION.scrollTo({ top: 0 });
}

async function displayContent() {
	clearMainContent();

	const sectionName = left_sections[currentPosition.sectionIndex].name;

	const response = await fetch(`data/${sectionName}.json`);
	const { data } = await response.json();

	const outerContainerElement = document.createElement("div");
	outerContainerElement.classList.add("outer-paragraph-container");
	const innerContainerElement = document.createElement("div");
	innerContainerElement.classList.add("inner-paragraph-container");

	if (sectionName !== "home") {
		innerContainerElement.classList.add("mt-4");

		const sectionData = data[currentPosition.sectionItemIndex];
		const topElement = document.createElement("div");

		// Check for logo and percentage to display skill details
		if (sectionData.logo && sectionData.percentage) {
			const nameLogoContainer = document.createElement("div");
			nameLogoContainer.classList.add("skill-name-logo-container");

			// Create and append skill name
			const skillNameElement = document.createElement("span");
			skillNameElement.innerHTML = `<span class="skill-name">${sectionData.name}</span>`;
			nameLogoContainer.appendChild(skillNameElement);

			// Create and append skill logo
			const skillLogoElement = document.createElement("img");
			skillLogoElement.src = sectionData.logo;
			skillLogoElement.alt = `${sectionData.name} logo`;
			skillLogoElement.classList.add("skill-logo");
			nameLogoContainer.appendChild(skillLogoElement);

			topElement.appendChild(nameLogoContainer);

			// Create and append progress bar
			const progressBarContainer = document.createElement("div");
			progressBarContainer.classList.add("progress-bar-container");

			const progressBar = document.createElement("pre"); // Use <pre> for preserving whitespace
			progressBar.classList.add("progress-bar");

			// Calculate the progress text
			const percentage = sectionData.percentage;
			const totalLength = 50; // Total length of the bar
			const filledLength = Math.round((percentage / 100) * totalLength);
			const emptyLength = totalLength - filledLength;

			const filledPart = "=".repeat(filledLength);
			const emptyPart = " ".repeat(emptyLength);

			progressBar.innerText = `[${filledPart}${emptyPart}] ${percentage}%`;

			// Append to the container
			progressBarContainer.appendChild(progressBar);
			topElement.appendChild(progressBarContainer);
		} else {
			// Display name for other sections
			const nameElement = document.createElement("h1");
			nameElement.innerHTML = `<span class="skill-name">${sectionData.name}</span>`;
			topElement.appendChild(nameElement);

			const titleElement = document.createElement("h1");
			titleElement.innerHTML =
				sectionData.title != null
					? `<span class="${getRandomTextColorClass()}">${
							sectionData.title
					  }</span>`
					: null;

			const dateElement = document.createElement("h2");
			dateElement.innerHTML =
				sectionData.date != null
					? `<span class="${getRandomTextColorClass()}">${
							sectionData.date
					  }</span>`
					: null;

			const yearElement = document.createElement("h2");
			yearElement.innerHTML =
				sectionData.year != null
					? `[Built in <span class="${getRandomTextColorClass()}">${
							sectionData.year
					  }</span>]`
					: null;

			const technologiesContainerElement = document.createElement("div");
			technologiesContainerElement.classList.add("technologies-row");
			technologiesContainerElement.innerHTML =
				sectionData.technologies?.map((t) => colorizeString(t)).join(" ") ||
				null;

			const githubButtonElement = document.createElement("a");
			githubButtonElement.classList.add("project-button");
			githubButtonElement.href = sectionData?.githubUrl;
			githubButtonElement.target = "_blank";
			githubButtonElement.innerText = "Github";

			const demoButtonElement = document.createElement("a");
			demoButtonElement.classList.add("project-button");
			demoButtonElement.href = sectionData?.demoUrl;
			demoButtonElement.target = "_blank";
			demoButtonElement.innerText = "Demo";

			const buttonsContainerElement = document.createElement("div");
			buttonsContainerElement.classList.add("buttons-container");

			if (sectionData?.githubUrl != null) {
				buttonsContainerElement.appendChild(githubButtonElement);
			}

			if (sectionData?.demoUrl != null) {
				buttonsContainerElement.appendChild(demoButtonElement);
			}

			if (titleElement.innerHTML != null) {
				topElement.appendChild(titleElement);
			}

			if (dateElement.innerHTML != null) {
				topElement.appendChild(dateElement);
			}

			if (yearElement.innerHTML != null) {
				topElement.appendChild(yearElement);
			}

			if (technologiesContainerElement.innerHTML != null) {
				topElement.appendChild(technologiesContainerElement);
			}

			if (buttonsContainerElement.children.length > 0) {
				topElement.appendChild(buttonsContainerElement);
			}
		}

		const imageElements =
			sectionData.images?.map((imagePath) => {
				const imageInnerContainerElement = document.createElement("div");
				imageInnerContainerElement.style.minHeight = "200px";
				imageInnerContainerElement.classList.add("image-inner-container");

				const imageElement = document.createElement("img");
				imageElement.loading = "lazy";
				imageElement.alt = "Project image";
				imageElement.decoding = "async";
				imageElement.src = `../images/assets/${imagePath}`;
				imageElement.classList.add("project-image");

				imageInnerContainerElement.appendChild(imageElement);

				return imageInnerContainerElement;
			}) ?? [];

		sectionData.content.forEach((c, i) => {
			const element = document.createElement("div");

			element.innerHTML = colorizeString(c).replaceAll("\n", "<br>");
			innerContainerElement.appendChild(element);

			if (i < imageElements.length) {
				const imageContainerElement = document.createElement("div");
				imageContainerElement.classList.add("image-container");
				imageContainerElement.appendChild(imageElements[i]);

				innerContainerElement.appendChild(imageContainerElement);
			}
		});

		innerContainerElement.prepend(topElement);
		outerContainerElement.appendChild(innerContainerElement);

		clearMainContent();
		MAIN_CONTENT_SECTION.appendChild(outerContainerElement);

		colorizeCode();
	} else {
		const logoFileName = `images/icons/logo.svg`;
		const logoContainer = document.createElement("div");
		logoContainer.id = "logo-container";

		const logoElement = document.createElement("img");
		logoElement.loading = "eager";
		logoElement.src = logoFileName;
		logoElement.id = "logo";
		logoElement.alt = "Tom Flattery";

		logoContainer.appendChild(logoElement);

		clearMainContent();
		MAIN_CONTENT_SECTION.appendChild(logoContainer);

		data.forEach((d) => {
			const element = document.createElement("div");

			d.content.forEach((c) => {
				const paragraph = document.createElement("p");
				paragraph.innerHTML = colorizeString(c);
				element.appendChild(paragraph);
			});

			innerContainerElement.appendChild(element);
		});

		outerContainerElement.appendChild(innerContainerElement);
		MAIN_CONTENT_SECTION.appendChild(outerContainerElement);
	}
}

function clearSelectionStyling(scrollToTop) {
	if (isMobile()) {
		const selectedElement = document.getElementsByClassName("selected-item")[0];
		const selectedFrameElement =
			document.getElementsByClassName("selected-frame")[0];

		if (selectedElement != null) {
			selectedElement.classList.remove("selected-item");
		}

		if (selectedFrameElement != null) {
			selectedFrameElement.classList.remove("selected-frame");
		}
	}

	const previousSection = left_sections[previousPosition.sectionIndex];

	const previousSectionItemElement =
		previousSection.items[previousPosition.sectionItemIndex];

	const previousSectionItemIndexElement =
		previousSection.section.getElementsByClassName("list-index")[0]
			?.firstElementChild;

	const scrollableContainerElement =
		previousSection.section.getElementsByClassName("ui-list")[0];

	previousSection.section.classList.remove("selected-frame");
	previousSectionItemElement?.classList.remove("selected-item");

	if (previousSectionItemIndexElement != null) {
		previousSectionItemIndexElement.innerText = `1 of ${previousSection.items.length}`;
	}

	if (scrollableContainerElement != null && scrollToTop) {
		scrollableContainerElement.scrollTo({ top: 0 });
	}
}

async function render(scrollToTop = false, isInitialRender = false) {
	if (
		!isMobile() &&
		!isInitialRender &&
		currentPosition.sectionIndex === previousPosition.sectionIndex &&
		currentPosition.sectionItemIndex === previousPosition.sectionItemIndex
	) {
		return;
	}

	const currentSection = left_sections[currentPosition.sectionIndex];

	const currentSectionItemElement =
		currentSection.items?.[currentPosition.sectionItemIndex];

	const currentSectionItemIndexElement =
		currentSection.section.getElementsByClassName("list-index")[0]
			?.firstElementChild;

	const scrollableContainerElement =
		currentSection.section.getElementsByClassName("ui-list")[0];

	clearSelectionStyling(scrollToTop);

	currentSection.section.classList.add("selected-frame");
	currentSectionItemElement?.classList.add("selected-item");

	if (currentSectionItemIndexElement != null) {
		currentSectionItemIndexElement.innerText = `${
			currentPosition.sectionItemIndex + 1
		} of ${currentSection.items.length}`;
	}

	// FIXME: not optimal, sometimes, jumps a bit too far
	// but it doesn't impair the user experience too much
	if (scrollableContainerElement != null && currentSectionItemElement != null) {
		if (
			!isVisibleInScrollView(
				currentSectionItemElement,
				scrollableContainerElement
			) &&
			previousPosition.sectionItemIndex !== currentPosition.sectionItemIndex
		) {
			const gap = parseInt(
				window.getComputedStyle(currentSectionItemElement).gap
			);

			scrollableContainerElement.scrollBy({
				top:
					previousPosition.sectionItemIndex < currentPosition.sectionItemIndex
						? currentSectionItemElement.clientHeight + gap
						: -currentSectionItemElement.clientHeight - gap,
				behavior: "instant",
			});
		}
	}

	if (!isInitialRender) {
		displayContent();
	}

	if (isMobile()) {
		closeHamburgerMenu();
	}
}

function savePreviousPosition() {
	previousPosition.sectionIndex = currentPosition.sectionIndex;
	previousPosition.sectionItemIndex = currentPosition.sectionItemIndex;
}

function goToSection(sectionNumber, itemNumber = 0) {
	savePreviousPosition();

	currentPosition.sectionIndex = clamp(
		0,
		sectionNumber,
		left_sections.length - 1
	);
	currentPosition.sectionItemIndex = clamp(
		0,
		itemNumber,
		left_sections[currentPosition.sectionIndex].items.length - 1
	);
}

function goToNextSection() {
	savePreviousPosition();

	currentPosition.sectionIndex = clamp(
		0,
		currentPosition.sectionIndex + 1,
		left_sections.length - 1
	);
	currentPosition.sectionItemIndex = 0;
}

function goToPreviousSection() {
	savePreviousPosition();

	currentPosition.sectionIndex = clamp(
		0,
		currentPosition.sectionIndex - 1,
		left_sections.length - 1
	);
	currentPosition.sectionItemIndex = 0;
}

function goToNextItem() {
	savePreviousPosition();

	currentPosition.sectionItemIndex = clamp(
		0,
		currentPosition.sectionItemIndex + 1,
		left_sections[currentPosition.sectionIndex].items.length - 1
	);
}

function goToPreviousItem() {
	savePreviousPosition();

	currentPosition.sectionItemIndex = clamp(
		0,
		currentPosition.sectionItemIndex - 1,
		left_sections[currentPosition.sectionIndex].items.length - 1
	);
}

function scrollMainContentDown() {
	MAIN_CONTENT_SECTION?.scrollBy({
		top: MAIN_CONTENT_SECTION.clientHeight / 2,
	});
}

function scrollMainContentUp() {
	MAIN_CONTENT_SECTION?.scrollBy({
		top: -(MAIN_CONTENT_SECTION.clientHeight / 2),
	});
}

function initKeyboardListeners() {
	// CTRL key is only captured on keydown/keyup
	addEventListener("keydown", async (event) => {
		let scrollToTop = false;
		const { key, code, ctrlKey } = event;

		if (key.includes("Arrow") || key.includes("Page")) {
			event.preventDefault();
		}

		if (key === "PageDown" || (ctrlKey && key === "d")) {
			scrollMainContentDown();
			return;
		} else if (key === "PageUp" || (ctrlKey && key === "u")) {
			scrollMainContentUp();
			return;
		} else if (key === "ArrowUp" || key === "k") {
			if (currentPosition.sectionIndex === 0) {
				return;
			}

			goToPreviousItem();
		} else if (key === "ArrowDown" || key === "j") {
			if (currentPosition.sectionIndex === 0) {
				return;
			}

			goToNextItem();
		} else if (key === "ArrowLeft" || key === "h") {
			goToPreviousSection();
			scrollToTop = true;
		} else if (key === "ArrowRight" || key === "l") {
			goToNextSection();
			scrollToTop = true;
		} else if (code.includes("Digit")) {
			const sectionNumber = parseInt(key) - 1;
			goToSection(sectionNumber);
			scrollToTop = true;
		} else {
			// Just here to avoid rendering on every keypress
			return;
		}

		await render(scrollToTop);
	});
}

function initMouseListeners() {
	left_sections.forEach((section, sectionIndex) => {
		section.items.forEach((item, itemIndex) => {
			item.addEventListener("click", async (event) => {
				event.stopPropagation();

				goToSection(sectionIndex, itemIndex);
				await render(sectionIndex !== previousPosition.sectionIndex);
			});
		});

		section.section.addEventListener("click", async () => {
			goToSection(sectionIndex);
			await render(sectionIndex !== previousPosition.sectionIndex);
		});
	});
}

function initTouchListeners() {
	if (!isMobile()) {
		return;
	}

	const hamburgerButtonElement =
		document.getElementsByName("hamburger-toggle")[0];

	hamburgerButtonElement.addEventListener("click", () => {
		onHamburgerMenuPress();
	});
}

function pipes() {
	const pipeElement = document.querySelector(".pipes");
	const container = document.getElementById("pipes");

	function calculateGridSize() {
		const containerWidth = container.clientWidth;
		const containerHeight = container.clientHeight;
		const charWidth = 8; // Approximate width of a character in pixels
		const charHeight = 16; // Approximate height of a character in pixels

		const cols = Math.floor(containerWidth / charWidth);
		const rows = Math.floor(containerHeight / charHeight);

		return { rows, cols };
	}

	let { rows, cols } = calculateGridSize();

	let grid = Array(rows)
		.fill()
		.map(() => Array(cols).fill(" "));

	const sets = ["│┌┐─└┘"];
	const chars = sets[Math.floor(Math.random() * sets.length)];
	const directions = [
		{ x: 0, y: 1, charIndex: 3 },
		{ x: 1, y: 0, charIndex: 0 },
		{ x: 0, y: -1, charIndex: 3 },
		{ x: -1, y: 0, charIndex: 0 },
	];
	const corners = {
		"0,1:1,0": 2,
		"0,1:-1,0": 5,
		"1,0:0,1": 4,
		"1,0:0,-1": 5,
		"0,-1:1,0": 1,
		"0,-1:-1,0": 4,
		"-1,0:0,1": 1,
		"-1,0:0,-1": 2,
	};

	let x, y, currentDirection;
	let currentColor;
	let initialInterval = 100;
	let intervalIncrement = 0;
	let interval = initialInterval;
	let intervalId;

	function startAtRandomEdge() {
		const edge = Math.floor(Math.random() * 4);
		switch (edge) {
			case 0:
				x = 0;
				y = Math.floor(Math.random() * cols);
				currentDirection = 1;
				break;
			case 1:
				x = Math.floor(Math.random() * rows);
				y = cols - 1;
				currentDirection = 2;
				break;
			case 2:
				x = rows - 1;
				y = Math.floor(Math.random() * cols);
				currentDirection = 3;
				break;
			case 3:
				x = Math.floor(Math.random() * rows);
				y = 0;
				currentDirection = 0;
				break;
		}

		const colors = ["#e5c07b", "#61afef", "#c678dd", "#98c379"];
		currentColor = colors[Math.floor(Math.random() * colors.length)];
	}

	function drawPipe() {
		let newDirection;
		if (Math.random() < 0.7) {
			newDirection = currentDirection;
		} else {
			newDirection = (currentDirection + (Math.random() < 0.5 ? 1 : 3)) % 4;
		}

		const newX = x + directions[newDirection].x;
		const newY = y + directions[newDirection].y;

		if (currentDirection !== newDirection) {
			const key = `${directions[currentDirection].x},${directions[currentDirection].y}:${directions[newDirection].x},${directions[newDirection].y}`;
			grid[x][y] = `<span style="color:${currentColor}">${
				chars[corners[key]] || grid[x][y]
			}</span>`;
		} else {
			grid[x][y] = `<span style="color:${currentColor}">${
				chars[directions[currentDirection].charIndex]
			}</span>`;
		}

		if (newX >= 0 && newX < rows && newY >= 0 && newY < cols) {
			x = newX;
			y = newY;
			currentDirection = newDirection;
		} else {
			startAtRandomEdge();
		}

		let output = "";
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				output += grid[i][j];
			}
			output += "\n";
		}
		pipeElement.innerHTML =
			"<pre style='white-space: pre'>" + output + "</pre>";

		// Increase the interval by 10 milliseconds
		interval += intervalIncrement;
		// Clear the current interval
		clearInterval(intervalId);
		// Set a new interval with the updated interval time
		intervalId = setInterval(drawPipe, interval);
	}

	startAtRandomEdge();
	intervalId = setInterval(drawPipe, interval);

	window.addEventListener("resize", () => {
		// Stop the current interval
		clearInterval(intervalId);

		// Recalculate the grid size based on the new container dimensions
		const newSize = calculateGridSize();
		rows = newSize.rows;
		cols = newSize.cols;

		// Create a new grid with the updated size
		const newGrid = Array(rows)
			.fill()
			.map(() => Array(cols).fill(" "));

		// Copy the existing pipe positions to the new grid
		for (let i = 0; i < Math.min(grid.length, newGrid.length); i++) {
			for (let j = 0; j < Math.min(grid[i].length, newGrid[i].length); j++) {
				newGrid[i][j] = grid[i][j];
			}
		}

		grid = newGrid;

		// Restart the interval to continue drawing pipes
		intervalId = setInterval(drawPipe, interval);
	});
}

async function init() {
	window.onload = pipes;
	initKeyboardListeners();
	initMouseListeners();
	initTouchListeners();

	await render(true, true);
}

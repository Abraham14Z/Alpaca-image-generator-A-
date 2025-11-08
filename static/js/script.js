//Define alpaca parts and available styles
const parts = {
  background: ["blue50", "green50", "red50", "yellow50", "grey70"],
  ears: ["default", "tilt-backward", "tilt-forward"],
  eyes: ["default", "angry", "naughty", "panda", "smart", "star"],
  hair: ["default", "bang", "curls", "elegant", "fancy", "short", "quiff"],
  mouth: ["default", "astonished", "eating", "laugh", "tongue"],
  neck: ["default", "bend-backward", "bend-forward", "thick"],
  leg: ["default", "bubble-tea", "cookie", "game-console", "tilt-backward", "tilt-forward"],
  accessories: ["None", "Earings", "Flower", "Glasses", "Headphone"]
};

// Track current selections
let currentCategory = "hair";
const currentSelections = {
  background: "blue50",
  ears: "default",
  eyes: "default",
  hair: "default",
  mouth: "default",
  neck: "default",
  leg: "default",
  accessories: "none"
};

// Select DOM elements
const styleButtonsContainer = document.querySelector(".styling-container1 div");
const categoryButtons = document.querySelectorAll(".accessorize > div > div > button");
const randomBtn = document.querySelector(".randomBtn");
const downloadBtn = document.querySelector(".downloadBtn");

// Update displayed styles for selected category
function updateStyleButtons(category) {
  styleButtonsContainer.innerHTML = "";
  document.querySelector(".styling-container1 h2").textContent = `Style (${category})`;

  parts[category].forEach(style => {
    const btn = document.createElement("button");
    btn.textContent = style;
    btn.className = (style === currentSelections[category]) ? "default accBtn" : "add-ons accBtn";
    btn.addEventListener("click", () => {
      currentSelections[category] = style;
      updateAlpacaImages();
      updateStyleButtons(category);
    });
    styleButtonsContainer.appendChild(btn);
  });
}

// Update displayed alpaca image layers
function updateAlpacaImages() {
  const layers = {
    ears: document.querySelector("img[src*='ears']"),
    neck: document.querySelector("img[src*='neck']"),
    mouth: document.querySelector("img[src*='mouth']"),
    hair: document.querySelector("img[src*='hair']"),
    eyes: document.querySelector("img[src*='eyes']"),
    leg: document.querySelector("img[src*='leg']"),
    accessories: document.querySelector("img[src*='accessories']"),
  };

  for (const part in layers) {
    if (layers[part]) {
      const style = currentSelections[part];
      if (style)
        layers[part].src = `images/${part}/${style}.png`;
      else
        layers[part].src = "";
    }
  }

  // Change background color for fun
  const container = document.querySelector(".default-style-img");
  container.style.backgroundColor = mapBgColor(currentSelections.background);
}

// Helper: map background names to colors
function mapBgColor(name) {
  const map = {
    blue50: "#B3E5FC",
    green50: "#C8E6C9",
    red50: "#FFCDD2",
    yellow50: "#FFF9C4",
    grey70: "#E0E0E0"
  };
  return map[name] || "#CFE0F3";
}

// Handle category button click
categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach(b => b.classList.remove("default"));
    btn.classList.add("default");
    currentCategory = btn.textContent.trim().toLowerCase();
    updateStyleButtons(currentCategory);
  });
});

// Handle randomize button
randomBtn.addEventListener("click", () => {
  for (const category in parts) {
    const options = parts[category];
    const randomStyle = options[Math.floor(Math.random() * options.length)];
    currentSelections[category] = randomStyle;
  }
  updateAlpacaImages();
  updateStyleButtons(currentCategory);
});

// Handle download button
downloadBtn.addEventListener("click", async () => {
  const container = document.querySelector(".default-style-img");
  const width = 400, height = 400;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;

  // Set background color
  ctx.fillStyle = mapBgColor(currentSelections.background);
  ctx.fillRect(0, 0, width, height);

  const imgElements = container.querySelectorAll("img");
  const loadImages = Array.from(imgElements)
    .filter(img => img.src)
    .map(img => new Promise(resolve => {
      const image = new Image();
      image.src = img.src;
      image.onload = () => resolve(image);
    }));

  Promise.all(loadImages).then(images => {
    images.forEach(img => ctx.drawImage(img, 0, 0, width, height));

    const link = document.createElement("a");
    link.download = "alpaca.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});
// Helper to draw image on canvas (async)
function drawImage(ctx, src, width, height) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // important for local testing
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      resolve();
    };
    img.src = src;
  });
}

// Initialize
updateStyleButtons(currentCategory);
updateAlpacaImages();
async function loadSVG() {
  const response = await fetch("assets/site-map.svg");
  const svgText = await response.text();

  document.getElementById("svg-container").innerHTML = svgText;
}

window.demoData = {
  p1: { available: 686 },
  p2: { available: 241 },
  p5: { available: 112 }
};

function createBadges() {
  const container = document.getElementById("map-container");

  Object.keys(lotConfig).forEach((lot) => {
    const badge = document.createElement("div");

    badge.id = `badge-${lot}`;
    badge.className = "parking-badge";

    badge.innerHTML = `
      <div class="parking-count">0</div>
      <div class="parking-sub">SPACES</div>
    `;

    container.appendChild(badge);
  });
}

function getStatus(available, capacity) {
  const ratio = available / capacity;

  if (ratio > 0.3) return "green";
  if (ratio > 0.1) return "yellow";

  return "red";
}

function animateNumber(el, start, end, duration = 800) {
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min(
      (now - startTime) / duration,
      1
    );

    const value = Math.round(
      start + (end - start) * progress
    );

    el.textContent = value;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function updateTimestamp() {
  const el = document.getElementById("update-time");

  if (el) {
    el.textContent =
      "Last Updated: " +
      new Date().toLocaleTimeString();
  }
}

function colorParkingFill(lot, status) {

  const colors = {
    green: "#31a354",
    yellow: "#f4b400",
    red: "#d93025"
  };

  const fills =
    document.querySelectorAll(
      `[id^="${lot}-fill"]`
    );

  fills.forEach(fill => {
    fill.style.fill =
      colors[status];
  });

}

  const fill = document.getElementById(`${lot}-fill`);

  if (fill) {
    fill.style.fill = colors[status];
  }
}

function renderMap() {
  Object.entries(lotConfig).forEach(([lot, cfg]) => {
    const badge = document.getElementById(
      `badge-${lot}`
    );

    if (!badge) return;

    badge.style.left = cfg.x + "%";
    badge.style.top = cfg.y + "%";

    badge.classList.remove(
      "status-green",
      "status-yellow",
      "status-red"
    );

    const available =
      demoData[lot].available;

    const status = getStatus(
      available,
      cfg.capacity
    );

    if(status === "yellow"){
badge.style.color = "#1f2937";
}
else{
badge.style.color = "#ffffff";
}

    badge.classList.add(
      `status-${status}`
    );

    colorParkingFill(lot, status);

    const count =
      badge.querySelector(
        ".parking-count"
      );

    animateNumber(
      count,
      parseInt(count.textContent) || 0,
      available
    );
  });

  updateTimestamp();
}

window.renderMap = renderMap;

window.scenarios = {
  normal() {
    demoData.p1.available = 686;
    demoData.p2.available = 241;
    demoData.p5.available = 112;
    renderMap();
  },

  busy() {
    demoData.p1.available = 140;
    demoData.p2.available = 82;
    demoData.p5.available = 37;
    renderMap();
  },

  full() {
    demoData.p1.available = 8;
    demoData.p2.available = 5;
    demoData.p5.available = 2;
    renderMap();
  }
};

window.randomizeParking = function () {
  Object.entries(demoData).forEach(
    ([lot, data]) => {
      data.available = Math.floor(
        Math.random() *
          lotConfig[lot].capacity
      );
    }
  );

  renderMap();
};

window.onload = async function () {
  await loadSVG();

  createBadges();

  renderMap();

  console.log(
    "CityLine Parking Loaded"
  );
};

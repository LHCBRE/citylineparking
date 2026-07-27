alert("APP JS VERSION TEST");
console.log("NEW APP.JS LOADED!");

// =========================
// LOAD SVG
// =========================

async function loadSVG() {

    console.log("Loading SVG...");

    const response = await fetch(
        "assets/site-map.svg"
    );

    const svgText =
        await response.text();

    document.getElementById(
        "svg-container"
    ).innerHTML = svgText;

    console.log("SVG loaded.");

}

// =========================
// CONFIG
// =========================

window.demoData = {

    p1: {
        available: 686
    },

    p2: {
        available: 241
    },

    p5: {
        available: 112
    }

};

// =========================
// BADGES
// =========================

function createBadges() {

    const container =
        document.getElementById(
            "map-container"
        );

    Object.entries(
        lotConfig
    ).forEach(([lot]) => {

        const badge =
            document.createElement("div");

        badge.id =
            "badge-${lot}";

        badge.className =
            "parking-badge";

        badge.innerHTML = "
      <div class="parking-count">0</div>
      <div class="parking-sub">SPACES</div>
    ";

        container.appendChild(
            badge
        );

    });

}

// =========================
// STATUS
// =========================

function getStatus(
    available,
    capacity
) {

    const ratio =
        available / capacity;

    if (ratio > .30) {
        return "green";
    }

    if (ratio > .10) {
        return "yellow";
    }

    return "red";

}

// =========================
// COLOR GARAGES
// =========================

function colorParkingFill(
    lot,
    status
) {

    const colors = {

        green: "#31a354",
        yellow: "#f4b400",
        red: "#d93025"

    };

    const fill =
        document.getElementById(
            "${lot}-fill"
        );

    if (fill) {

        fill.style.fill =
            colors[status];

    }

}

// =========================
// COUNT ANIMATION
// =========================

function animateNumber(
    el,
    start,
    end,
    duration = 600
) {

    const startTime =
        performance.now();

    function step(now) {

        const progress =
            Math.min(
                (now - startTime) /
                duration,
                1
            );

        const value =
            Math.round(
                start +
                ((end - start) *
                    progress)
            );

        el.textContent =
            value;

        if (progress < 1) {

            requestAnimationFrame(
                step
            );

        }

    }

    requestAnimationFrame(
        step
    );

}

// =========================
// TIMESTAMP
// =========================

function updateTimestamp() {

    document.getElementById(
            "update-time"
        ).textContent =
        "Last Updated: " +
        new Date()
        .toLocaleTimeString();

}

// =========================
// RENDER
// =========================

function renderMap() {

    Object.entries(
        lotConfig
    ).forEach(([lot, cfg]) => {

        const badge =
            document.getElementById(
                "badge-${lot}"
            );

        badge.style.left =
            cfg.x + "%";

        badge.style.top =
            cfg.y + "%";

        badge.classList.remove(
            "status-green",
            "status-yellow",
            "status-red"
        );

        const available =
            demoData[lot]
            .available;

        const status =
            getStatus(
                available,
                cfg.capacity
            );

        badge.classList.add(
            "status-${status}"
        );

        colorParkingFill(
            lot,
            status
        );

        const count =
            badge.querySelector(
                ".parking-count"
            );

        animateNumber(
            count,
            parseInt(
                count.textContent
            ) || 0,
            available
        );

    });

    updateTimestamp();

}

// =========================
// DEMO COMMANDS
// =========================

window.renderMap =
    renderMap;

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

            demoData.p1.

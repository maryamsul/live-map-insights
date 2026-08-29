const API_BASE = "https://api.shahedlebanon.com";
let allAttacks = [];
let markers = {};
let activeVillage = null;
let map = null;
let sidebarOpen = false;
let legendOpen = false;
//map
function initMap() {
  map = L.map("map", {
    center: [33.85, 35.9],
    zoom: 8,
    minZoom: 7,
    maxZoom: 14,
    zoomControl: false,
    attributionControl: true,

    maxBounds: [
      [33.0, 34.8],
      [34.8, 36.8]
    ],

    maxBoundsViscosity: 0.9
  });

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors"
    }
  ).addTo(map);
}

//display attacks
function getDotSize(n) {
  if (n >= 50) return 30;
  if (n >= 20) return 22;
  if (n >= 10) return 16;
  if (n >= 3) return 11;

  return 7;
}

function getDotColor(n) {
  if (n >= 50) return "#8b0000";
  if (n >= 20) return "#ff2d2d";
  if (n >= 10) return "#ff5500";
  if (n >= 3) return "#ff8c00";

  return "#ffd700";
}


function getTier(n) {
  if (n >= 50) return 5;
  if (n >= 20) return 4;
  if (n >= 10) return 3;
  if (n >= 3) return 2;

  return 1;
}

function renderMarkers(attacks) {

  Object.values(markers).forEach(marker => {
    map.removeLayer(marker);
  });

  markers = {};

  if (!attacks.length) {
    document.getElementById("empty-state").style.display = "block";
    return;
  }

  document.getElementById("empty-state").style.display = "none";


  attacks.forEach(attack => {

    if (!attack.lat || !attack.lng) {
      return;
    }

    const size = getDotSize(attack.attack_count);
    const color = getDotColor(attack.attack_count);
    const icon = L.divIcon({
      className: "",

      html: `
        <div
          style="
            width:${size}px;
            height:${size}px;
            background:${color};
            border-radius:50%;
            box-shadow:
              0 0 ${size * 1.5}px ${color},
              0 0 ${size * 0.6}px ${color};
            cursor:pointer;
            transition:transform 0.15s;
          "
          onmouseover="this.style.transform='scale(1.4)'"
          onmouseout="this.style.transform='scale(1)'"
        ></div>
      `,

      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });

    const marker = L.marker(
      [attack.lat, attack.lng],
      { icon }
    )
      .addTo(map)

      .bindTooltip(
        `
          <strong>${attack.village_ar}</strong>
          <br>
          <span style="font-family:monospace;font-size:10px;color:#888">
            ${attack.attack_count} غارة
          </span>
        `,
        {
          direction: "top",
          offset: [0, -size / 2]
        }
      )

      .on("click", () => {
        openDetail(attack);
      });


    markers[attack.village_ar] = marker;
  });
}
//sidebar
function renderList(attacks) {
  const list = document.getElementById("village-list");
  list.innerHTML = "";
  if (!attacks.length) {
    list.innerHTML = `
      <div
        style="
          padding:20px;
          text-align:center;
          font-family:monospace;
          font-size:11px;
          color:#3a3530
        "
      >
        لا توجد بيانات
      </div>
    `;

    return;
  }


  const sorted = [...attacks].sort(
    (a, b) => b.attack_count - a.attack_count
  );


  sorted.forEach((attack, index) => {
    const tier = getTier(attack.attack_count);
    const item = document.createElement("div");
    item.className = `village-item tier-${tier}`;
    item.style.animationDelay = `${index * 20}ms`;
    item.dataset.village = attack.village_ar;
    item.innerHTML = `
      <div class="attack-badge tier-${tier}">

        <span class="badge-count">
          ${attack.attack_count}
        </span>

        <span class="badge-label">
          غارة
        </span>

      </div>


      <div class="village-info">

        <div class="village-name-ar">
          ${attack.village_ar}
        </div>

        <div class="village-name-en">
          ${attack.village_en || ""}
        </div>

      </div>
    `;


    item.addEventListener("click", () => {
      openDetail(attack);
      if (attack.lat && attack.lng) {
        map.setView(
          [attack.lat, attack.lng],
          12,
          { animate: true }
        );

      }


      if (window.innerWidth <= 768) {
        toggleSidebar();
      }

    });


    list.appendChild(item);

  });

}

//api
function updateStats(attacks) {
  const totalAttacks = attacks.reduce(
    (sum, attack) => sum + attack.attack_count,
    0
  );


  document.getElementById("stat-villages").textContent =
    attacks.length;


  document.getElementById("stat-attacks").textContent =
    totalAttacks;


  fetch(`${API_BASE}/stats`)
    .then(response => response.json())

    .then(data => {

      // Only use this if stat-testimonies exists in HTML.
      const testimonyStat =
        document.getElementById("stat-testimonies");

      if (testimonyStat) {
        testimonyStat.textContent =
          data.total_testimonies ?? "—";

      }

    })

    .catch(() => {});
}


//sidebar
function setSidebar(open) {

  sidebarOpen = open;


  const sidebar =
    document.getElementById("sidebar");

  const toggleBtn =
    document.getElementById("sidebar-toggle");

  const overlay =
    document.getElementById("sidebar-overlay");


  if (sidebarOpen) {

    sidebar.classList.add("open");

    toggleBtn.classList.add("open");

    overlay.classList.add("visible");

    toggleBtn.textContent = "✕";

    toggleBtn.title = "إخفاء القرى";

  } else {

    sidebar.classList.remove("open");

    toggleBtn.classList.remove("open");

    overlay.classList.remove("visible");

    toggleBtn.textContent = "☰";

    toggleBtn.title = "عرض القرى";

  }

}


function toggleSidebar() {
  setSidebar(!sidebarOpen);
}

//legend
function toggleLegend() {
  legendOpen = !legendOpen;
  const legend =
    document.getElementById("map-legend");

  const toggleBtn =
    document.getElementById("legend-toggle");

  if (legendOpen) {
    legend.classList.add("open");
    toggleBtn.classList.add("active");
  } else {

    legend.classList.remove("open");

    toggleBtn.classList.remove("active");

  }

}

//details
function openDetail(attack) {
  activeVillage = attack.village_ar;
  document
    .querySelectorAll(".village-item")
    .forEach(element => {
      element.classList.toggle(
        "active",
        element.dataset.village === activeVillage
      );

    });


  document.getElementById(
    "detail-village-ar"
  ).textContent = attack.village_ar;


  document.getElementById(
    "detail-village-en"
  ).textContent = attack.village_en || "";


  document.getElementById(
    "detail-count-num"
  ).textContent = attack.attack_count;


  document.getElementById(
    "last-message-box"
  ).textContent = attack.original_msg || "—";


  document
    .getElementById("detail-panel")
    .classList.add("open");


  document.getElementById(
    "testimony-input"
  ).value = "";


  document.getElementById(
    "submit-feedback"
  ).textContent = "";


  loadTestimonies(attack.village_ar);
}


//testimonies
function loadTestimonies(village_ar) {
  const list =
    document.getElementById("testimonies-list");
  list.innerHTML = `
    <div
      style="
        font-family:monospace;
        font-size:10px;
        color:#3a3530;
        padding:10px 0
      "
    >
      جارٍ التحميل...
    </div>
  `;


  fetch(
    `${API_BASE}/testimonies/${encodeURIComponent(village_ar)}`
  )

    .then(response => response.json())
    .then(data => {
      list.innerHTML = "";
      if (!data.length) {
        list.innerHTML = `
          <div class="no-testimonies">
            لا توجد شهادات بعد كن أول من يشهد
          </div>
        `;

        return;
      }


      data.forEach(testimony => {
        const card =
          document.createElement("div");
        card.className =
          "testimony-card";

        const date =
          testimony.created_at
            ? new Date(
                testimony.created_at
              ).toLocaleDateString("ar-LB")
            : "";


        card.innerHTML = `
          <div class="testimony-text">
            ${testimony.message}
          </div>

          <div class="testimony-date">
            ${date}
          </div>
        `;


        list.appendChild(card);

      });

    })

    .catch(() => {

      list.innerHTML = `
        <div class="no-testimonies">
          تعذّر تحميل الشهادات
        </div>
      `;

    });

}

function submitTestimony() {

  const input =
    document.getElementById("testimony-input");

  const feedback =
    document.getElementById("submit-feedback");

  const button =
    document.getElementById("testimony-submit");


  const text = input.value.trim();


  if (!text || !activeVillage) {
    return;
  }


  if (text.length < 5) {

    feedback.textContent =
      "الشهادة قصيرة جداً";

    feedback.style.color =
      "#e74c3c";

    return;
  }


  button.disabled = true;

  feedback.textContent =
    "جارٍ الإرسال...";

  feedback.style.color =
    "#d4a017";


  fetch(`${API_BASE}/testimonies`, {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      village_ar: activeVillage,
      message: text
    })

  })

    .then(response => response.json())

    .then(() => {

      input.value = "";

      feedback.textContent =
        "✓ شهادتك محفوظة";

      feedback.style.color =
        "#27ae60";


      loadTestimonies(activeVillage);

      updateStats(allAttacks);


      setTimeout(() => {
        feedback.textContent = "";
      }, 3000);

    })

    .catch(() => {

      feedback.textContent =
        "خطأ في الإرسال";

      feedback.style.color =
        "#e74c3c";

    })

    .finally(() => {

      button.disabled = false;

    });

}

//get attacks
function fetchAttacks() {
  fetch(`${API_BASE}/attacks`)
    .then(response => response.json())
    .then(data => {
      allAttacks = data;
      renderMarkers(data);
      renderList(data);
      updateStats(data);
    })

    .catch(error => {
      console.error(
        "Failed to fetch attacks:",
        error
      );

    });

}


//searching 
function searchVillages(event) {

  const query =
    event.target.value.trim();


  if (!query) {

    renderList(allAttacks);

    return;
  }


  const filtered =
    allAttacks.filter(attack =>

      attack.village_ar.includes(query) ||

      (
        attack.village_en &&
        attack.village_en
          .toLowerCase()
          .includes(query.toLowerCase())
      )

    );


  renderList(filtered);
}

//any event 

document
  .getElementById("sidebar-toggle")
  .addEventListener("click", event => {

    event.stopPropagation();

    toggleSidebar();

  });


document
  .getElementById("sidebar-overlay")
  .addEventListener("click", event => {

    event.stopPropagation();

    setSidebar(false);

  });


document
  .getElementById("legend-toggle")
  .addEventListener(
    "click",
    toggleLegend
  );


document
  .getElementById("zoom-in")
  .addEventListener("click", () => {

    map.zoomIn();

  });


document
  .getElementById("zoom-out")
  .addEventListener("click", () => {

    map.zoomOut();

  });


document
  .getElementById("testimony-submit")
  .addEventListener(
    "click",
    submitTestimony
  );


document
  .getElementById("detail-close")
  .addEventListener("click", () => {

    document
      .getElementById("detail-panel")
      .classList.remove("open");


    document
      .querySelectorAll(".village-item")
      .forEach(element => {

        element.classList.remove("active");

      });


    activeVillage = null;

  });


document
  .getElementById("search-input")
  .addEventListener(
    "input",
    searchVillages
  );


window.addEventListener(
  "resize",
  () => {

    if (
      window.innerWidth > 768 &&
      sidebarOpen
    ) {

      setSidebar(false);

    }

  }
);

//refresh 
function startAutoRefresh() {
  setInterval(() => {
    fetchAttacks();
  }, 15000);
}


window.addEventListener(
  "load",
  () => {
    initMap();
    fetchAttacks();
    startAutoRefresh();
    setTimeout(() => {
      document
        .getElementById("loading")
        .classList.add("hidden");
      setTimeout(() => {
        const loading =
          document.getElementById("loading");

        if (loading) {
          loading.remove();
        }

      }, 500);

    }, 1600);

  }
);

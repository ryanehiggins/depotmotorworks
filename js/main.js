const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Copy-email fallback for visitors without a configured mail app.
document.querySelectorAll("[data-copy-email]").forEach((button) => {
  button.addEventListener("click", async () => {
    const address = button.dataset.copyEmail;
    try {
      await navigator.clipboard.writeText(address);
      const original = button.textContent;
      button.textContent = "Copied";
      setTimeout(() => { button.textContent = original; }, 1800);
    } catch (_) {
      window.prompt("Copy this email address:", address);
    }
  });
});

// Vehicle Year → Make → Model selectors powered by NHTSA vPIC.
const VPIC = "https://vpic.nhtsa.dot.gov/api/vehicles";
const OTHER = "Other / Not Listed";
let cachedMakes = null;

function addOption(select, value, label = value) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  select.appendChild(option);
}

function resetSelect(select, message) {
  select.innerHTML = "";
  addOption(select, "", message);
  select.disabled = true;
}

async function loadMakes() {
  if (cachedMakes) return cachedMakes;
  const response = await fetch(`${VPIC}/GetMakesForVehicleType/car?format=json`);
  if (!response.ok) throw new Error("Could not load makes");
  const data = await response.json();
  cachedMakes = [...new Set((data.Results || []).map((row) => row.MakeName).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
  return cachedMakes;
}

async function loadModels(make, year) {
  const endpoint = Number(year) > 1995
    ? `${VPIC}/GetModelsForMakeYear/make/${encodeURIComponent(make)}/modelyear/${year}?format=json`
    : `${VPIC}/GetModelsForMake/${encodeURIComponent(make)}?format=json`;
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error("Could not load models");
  const data = await response.json();
  return [...new Set((data.Results || []).map((row) => row.Model_Name).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
}

function setupVehicleSelector(wrapper) {
  const year = wrapper.querySelector("[data-vehicle-year]");
  const make = wrapper.querySelector("[data-vehicle-make]");
  const model = wrapper.querySelector("[data-vehicle-model]");
  const otherMake = wrapper.querySelector("[data-other-make]");
  const otherModel = wrapper.querySelector("[data-other-model]");
  const nextYear = new Date().getFullYear() + 1;

  for (let y = nextYear; y >= 1950; y -= 1) addOption(year, String(y));
  addOption(year, OTHER);

  const showManualMake = (show) => {
    if (!otherMake) return;
    otherMake.hidden = !show;
    otherMake.required = show;
    if (!show) otherMake.value = "";
  };
  const showManualModel = (show) => {
    if (!otherModel) return;
    otherModel.hidden = !show;
    otherModel.required = show;
    if (!show) otherModel.value = "";
  };

  year.addEventListener("change", async () => {
    showManualMake(false); showManualModel(false);
    resetSelect(model, "Select make first");
    if (!year.value) { resetSelect(make, "Select year first"); return; }
    if (year.value === OTHER) {
      resetSelect(make, "Use field below");
      make.disabled = false; make.required = false; addOption(make, OTHER); make.value = OTHER;
      resetSelect(model, "Use field below");
      model.disabled = false; model.required = false; addOption(model, OTHER); model.value = OTHER;
      showManualMake(true); showManualModel(true); return;
    }
    resetSelect(make, "Loading makes…");
    try {
      const makes = await loadMakes();
      make.innerHTML = ""; addOption(make, "", "Select make");
      makes.forEach((item) => addOption(make, item)); addOption(make, OTHER);
      make.disabled = false; make.required = true;
    } catch (_) {
      make.innerHTML = ""; addOption(make, OTHER); make.disabled = false; make.required = false; make.value = OTHER; showManualMake(true);
      model.innerHTML = ""; addOption(model, OTHER); model.disabled = false; model.required = false; model.value = OTHER; showManualModel(true);
    }
  });

  make.addEventListener("change", async () => {
    showManualMake(make.value === OTHER);
    showManualModel(false);
    resetSelect(model, "Select make first");
    if (!make.value) return;
    if (make.value === OTHER) {
      make.required = false;
      model.innerHTML = ""; addOption(model, OTHER); model.disabled = false; model.required = false; model.value = OTHER; showManualModel(true); return;
    }
    make.required = true;
    resetSelect(model, "Loading models…");
    try {
      const models = await loadModels(make.value, year.value);
      model.innerHTML = ""; addOption(model, "", "Select model");
      models.forEach((item) => addOption(model, item)); addOption(model, OTHER);
      model.disabled = false; model.required = true;
    } catch (_) {
      model.innerHTML = ""; addOption(model, OTHER); model.disabled = false; model.required = false; model.value = OTHER; showManualModel(true);
    }
  });

  model.addEventListener("change", () => {
    const isOther = model.value === OTHER;
    model.required = !isOther;
    showManualModel(isOther);
  });
}

document.querySelectorAll(".vehicle-selector").forEach(setupVehicleSelector);

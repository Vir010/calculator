const form = document.getElementById("calcForm");
const resultTotal = document.getElementById("resultTotal");
const resultBreakdown = document.getElementById("resultBreakdown");

const currency = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0
});

function format(value) {
  return currency.format(value);
}

function setAreaError(message) {
  const field = form.querySelector('[name="area"]').closest(".form__field");
  const errorEl = form.querySelector('[data-error-for="area"]');

  if (message) {
    field.classList.add("is-invalid");
    errorEl.textContent = message;
  } else {
    field.classList.remove("is-invalid");
    errorEl.textContent = "";
  }
}

function validateArea(value) {
  const area = Number(value);

  if (!value.trim()) {
    return "Укажите площадь";
  }

  if (Number.isNaN(area) || area <= 0) {
    return "Площадь должна быть больше нуля";
  }

  if (area > 500) {
    return "Максимум 500 м²";
  }

  return "";
}

function renderBreakdown(items) {
  resultBreakdown.innerHTML = items
    .map((item) => `<li><span>${item.label}</span><span>${item.value}</span></li>`)
    .join("");
}

function calculate() {
  const serviceSelect = form.elements.service;
  const rate = Number(serviceSelect.selectedOptions[0].dataset.rate);
  const serviceName = serviceSelect.selectedOptions[0].textContent.split(" — ")[0];

  const area = Number(form.elements.area.value);
  const urgency = Number(form.elements.urgency.value);
  const urgencyLabel = form.elements.urgency.selectedOptions[0].textContent.split(" — ")[0];
  const visit = form.elements.visit.checked;

  const base = rate * area;
  const afterUrgency = base * urgency;
  const urgencyDelta = afterUrgency - base;
  const visitCost = visit ? 500 : 0;
  const total = afterUrgency + visitCost;

  const items = [
    { label: `${serviceName}, ${area} м² × ${format(rate)}`, value: format(base) }
  ];

  if (urgency > 1) {
    items.push({
      label: `${urgencyLabel} (×${urgency})`,
      value: "+ " + format(urgencyDelta)
    });
  }

  if (visit) {
    items.push({
      label: "Выезд мастера для замера",
      value: "+ " + format(visitCost)
    });
  }

  renderBreakdown(items);
  resultTotal.textContent = format(total);
}

form.addEventListener("input", (event) => {
  if (event.target.name === "area") {
    setAreaError(validateArea(event.target.value));
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const areaError = validateArea(form.elements.area.value);
  setAreaError(areaError);

  if (areaError) {
    return;
  }

  calculate();
});
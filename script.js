const APPLIANCES = [
  { name: "Geladeira", watts: 150, quantidade: 1, horas: 24 },
  { name: "Chuveiro", watts: 5500, quantidade: 1, horas: 0.5 },
  { name: "Ar-condicionado", watts: 1200, quantidade: 1, horas: 6 },
  { name: "Televisão", watts: 100, quantidade: 1, horas: 4 },
  { name: "Lavadora", watts: 500, quantidade: 1, horas: 1 },
  { name: "Micro-ondas", watts: 1200, quantidade: 1, horas: 0.5 },
  { name: "Computador", watts: 200, quantidade: 1, horas: 4 },
  { name: "Notebook", watts: 60, quantidade: 1, horas: 5 },
  { name: "Ventilador", watts: 100, quantidade: 2, horas: 6 },
  { name: "Ferro de passar", watts: 1000, quantidade: 1, horas: 0.5 },
  { name: "Forno elétrico", watts: 1500, quantidade: 1, horas: 0.3 },
  { name: "Fritadeira elétrica", watts: 1500, quantidade: 1, horas: 0.4 },
  { name: "Secador", watts: 1500, quantidade: 1, horas: 0.6 },
  { name: "Lava-louças", watts: 1500, quantidade: 1, horas: 1 },
  { name: "Videogame", watts: 200, quantidade: 1, horas: 2 },
  { name: "Cafeteira", watts: 800, quantidade: 1, horas: 0.5 },
  { name: "Roteador", watts: 10, quantidade: 1, horas: 24 },
  { name: "Lâmpadas LED", watts: 8, quantidade: 8, horas: 5 }
];

const DEFAULT_TARIFF_PER_KWH = 0.50;
let tariffPerKwh = DEFAULT_TARIFF_PER_KWH;
const INITIAL_TIPS_MESSAGE = "Preencha os dados e veja as sugestões mais relevantes para sua casa.";
const NO_TIPS_MESSAGE = "Seu consumo está dentro de um valor considerado normal. Continue mantendo hábitos eficientes.";
const ENERGY_SAVING_TIP_RULES = [
  ["chuveiro", 3.5, "Chuveiro está consumindo mais do que o recomendado. Tente reduzir o tempo do banho em alguns minutos."],
  ["ar-condicionado", 8, "Ar-condicionado está muito acima do ideal. Aumente a temperatura um pouco e reduza o uso em horários de pico."],
  ["lampad", 2, "Lâmpadas LED estão sendo usadas por muito tempo. Aproveite mais luz natural e reduza o tempo de iluminação."],
  ["geladeira", 3.5, "Geladeira está consumindo mais do que o esperado. Verifique a vedação da porta e evite abrir muito."],
  ["lavadora", 1.2, "Lavadora está elevando o consumo. Use cargas completas e reduza o número de ciclos."],
  ["micro-ondas", 1.2, "Micro-ondas está consumindo bastante. Prefira outras formas de aquecimento quando possível."],
  ["forno", 1, "Forno elétrico está elevando o gasto. Tente usar o forno somente quando realmente necessário."],
  ["secador", 1.2, "Secador elétrico está muito pesado na conta. Reduza o tempo de uso ou priorize secagem natural."],
  ["computador", 1.5, "Computador está com uso longo. Desligue quando não estiver usando para economizar."],
  ["televisao", 1, "Televisão está consumindo mais do que o ideal. Reduza o tempo de uso e desligue quando não estiver assistindo."],
  ["ventilador", 1.5, "Ventilador está sendo usado muito tempo. Use em horários certos e em conjunto com ventilação natural."],
  ["videogame", 1, "Videogame está consumindo bastante. Reduza o horário de uso e desligue o aparelho quando não estiver em uso."],
  ["roteador", 0.4, "Roteador está ligado por muito tempo. A gestão de rede e uso consciente ajuda a reduzir o consumo."]
];
const RESULT_FIELDS = [
  { elementId: "consumoDiario", resultKey: "consumo_diario", formatter: formatKwh, emptyValue: "0,00 kWh" },
  { elementId: "custoDiario", resultKey: "custo_diario", formatter: formatMoney, emptyValue: "R$ 0,00" },
  { elementId: "consumoHora", resultKey: "consumo_hora", formatter: formatKwh, emptyValue: "0,00 kWh" },
  { elementId: "custoHora", resultKey: "custo_hora", formatter: formatMoney, emptyValue: "R$ 0,00" },
  { elementId: "consumoMensal", resultKey: "consumo_mensal", formatter: formatKwh, emptyValue: "0,00 kWh" },
  { elementId: "custoMensal", resultKey: "custo_mensal", formatter: formatMoney, emptyValue: "R$ 0,00" },
  { elementId: "consumoAnual", resultKey: "consumo_anual", formatter: formatKwh, emptyValue: "0,00 kWh" },
  { elementId: "custoAnual", resultKey: "custo_anual", formatter: formatMoney, emptyValue: "R$ 0,00" }
];

function parseDecimal(value) {
  if (value === "" || value === null || value === undefined) return 0;
  const text = String(value).replace(/\s+/g, "");
  if (text === "") return 0;
  const cleaned = text.includes(",") ? text.replace(/\./g, "").replace(",", ".") : text;
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : 0;
}

function formatMoney(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

function formatKwh(value) {
  return `${Number(value).toFixed(2).replace(".", ",")} kWh`;
}

function renderApplianceCards() {
  const applianceList = document.getElementById("appliance-list");
  applianceList.innerHTML = "";

  APPLIANCES.forEach((appliance) => {
    const applianceCard = document.createElement("div");
    applianceCard.className = "appliance";
    applianceCard.dataset.name = appliance.name;

    applianceCard.innerHTML = `
      <div class="appliance-name">
        ${appliance.name}
        <small>${appliance.watts} W estimados</small>
      </div>

      <div class="field">
        <label>Quantidade</label>
        <input type="text" class="quantidade" value="${appliance.quantidade}" />
      </div>

      <div class="field">
        <label>Horas por dia</label>
        <input type="text" class="horas" value="${appliance.horas}" />
      </div>
    `;

    applianceList.appendChild(applianceCard);
  });
}

function getSelectedAppliances() {
  return [...document.querySelectorAll(".appliance")].map((applianceCard) => ({
    name: applianceCard.dataset.name,
    watts: Number(applianceCard.querySelector(".appliance-name small").textContent.match(/\d+/)[0]),
    quantidade: parseDecimal(applianceCard.querySelector(".quantidade").value),
    horas: parseDecimal(applianceCard.querySelector(".horas").value)
  }));
}

function renderCalculationResults(result) {
  document.title = `REEN | Economia de Energia - ${result.cidade}`;
  document.getElementById("hero-kwh").textContent = result.consumo_diario.toFixed(2).replace(".", ",");
  RESULT_FIELDS.forEach(({ elementId, resultKey, formatter }) => {
    document.getElementById(elementId).textContent = formatter(result[resultKey]);
  });
}

function normalizeApplianceName(name) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function calculateEnergy(appliances) {
  const dailyConsumption = appliances.reduce(
    (total, appliance) => total + appliance.watts * appliance.quantidade * appliance.horas / 1000,
    0
  );
  const dailyCost = dailyConsumption * tariffPerKwh;
  const result = {
    cidade: document.getElementById("cidade").value || "Sua cidade",
    consumo_diario: dailyConsumption,
    custo_diario: dailyCost,
    consumo_hora: dailyConsumption / 24,
    custo_hora: dailyCost / 24,
    consumo_mensal: dailyConsumption * 30,
    custo_mensal: dailyCost * 30,
    consumo_anual: dailyConsumption * 365,
    custo_anual: dailyCost * 365
  };
  const tips = [];

  if (dailyConsumption > 30) {
    tips.push("Seu consumo diário está acima do ideal. Revise o uso do chuveiro, ar-condicionado e outros aparelhos de maior potência.");
  }

  appliances.forEach((appliance) => {
    const dailyKwh = appliance.watts * appliance.quantidade * appliance.horas / 1000;
    const normalizedName = normalizeApplianceName(appliance.name);
    if (dailyKwh <= 0) return;

    ENERGY_SAVING_TIP_RULES.forEach(([keyword, threshold, tip]) => {
      if (normalizedName.includes(keyword) && dailyKwh > threshold && !tips.includes(tip)) {
        tips.push(tip);
      }
    });
  });

  result.dicas = tips;
  return result;
}

function renderTips(tips, emptyMessage = NO_TIPS_MESSAGE) {
  const tipList = document.getElementById("dica-list");
  tipList.innerHTML = "";

  (tips.length > 0 ? tips : [emptyMessage]).forEach((tip) => {
    const tipItem = document.createElement("li");
    tipItem.textContent = tip;
    tipList.appendChild(tipItem);
  });
}

function calculateEnergyUsage() {
  const result = calculateEnergy(getSelectedAppliances());
  renderCalculationResults(result);
  renderTips(result.dicas);
}

function clearCalculationForm() {
  document.getElementById("cidade").value = "";
  document.querySelectorAll(".quantidade, .horas").forEach((input) => {
    input.value = "";
  });
  tariffPerKwh = DEFAULT_TARIFF_PER_KWH;
  document.getElementById("tarifa").value = "0,50";
  document.getElementById("tariff-label").textContent = "Tarifa padrão: R$ 0,50 / kWh";
  document.getElementById("tariff-editor").hidden = true;
  document.getElementById("btnMudarTarifa").setAttribute("aria-expanded", "false");

  document.getElementById("hero-kwh").textContent = "0,00";
  RESULT_FIELDS.forEach(({ elementId, emptyValue }) => {
    document.getElementById(elementId).textContent = emptyValue;
  });

  renderTips([], INITIAL_TIPS_MESSAGE);
}

document.getElementById("calcular").addEventListener("click", calculateEnergyUsage);
document.getElementById("limpar").addEventListener("click", clearCalculationForm);

document.getElementById("btnMudarTarifa").addEventListener("click", (event) => {
  const editor = document.getElementById("tariff-editor");
  editor.hidden = !editor.hidden;
  event.currentTarget.setAttribute("aria-expanded", String(!editor.hidden));
  if (!editor.hidden) {
    document.getElementById("tarifa").value = tariffPerKwh.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    document.getElementById("tarifa").focus();
  }
});

document.getElementById("aplicarTarifa").addEventListener("click", () => {
  tariffPerKwh = parseDecimal(document.getElementById("tarifa").value);
  const isDefaultTariff = tariffPerKwh === DEFAULT_TARIFF_PER_KWH;
  document.getElementById("tariff-label").textContent =
    `${isDefaultTariff ? "Tarifa padrão" : "Tarifa personalizada"}: ${formatMoney(tariffPerKwh)} / kWh`;
  document.getElementById("tariff-editor").hidden = true;
  document.getElementById("btnMudarTarifa").setAttribute("aria-expanded", "false");
  calculateEnergyUsage();
});

document.getElementById("appliance-list").addEventListener("input", (event) => {
  if (event.target.matches(".quantidade, .horas")) {
    event.target.value = event.target.value.replace(/[^0-9,.-]/g, "");
  }
});

document.getElementById("tarifa").addEventListener("input", (event) => {
  event.target.value = event.target.value.replace(/[^0-9,.-]/g, "");
});

document.getElementById("btnSimular").addEventListener("click", () => {
  document.getElementById("calculador").scrollIntoView({ behavior: "smooth" });
});

renderApplianceCards();
calculateEnergyUsage();

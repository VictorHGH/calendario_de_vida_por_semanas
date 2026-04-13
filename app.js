"use strict";

const MAX_WEEK_COLS = 53;
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
const MAX_FINAL_AGE = 100;
const WEEKDAY_NAMES_ES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const PERCENT_FORMATTER = new Intl.NumberFormat("es-ES", {
	minimumFractionDigits: 1,
	maximumFractionDigits: 1
});

const elements = {
	dobInput: document.getElementById("dobInput"),
	ageInput: document.getElementById("ageInput"),
	form: document.getElementById("calendarForm"),
	printBtn: document.getElementById("printBtn"),
	weeklyGuide: document.getElementById("weeklyGuide"),
	weeklyGuideText: document.getElementById("weeklyGuideText"),
	meta: document.getElementById("meta"),
	table: document.getElementById("lifeTable")
};

function weeksBetween(startDate, endDate) {
	return Math.floor((endDate.getTime() - startDate.getTime()) / MS_PER_WEEK);
}

function parseDateInputToUTC(value) {
	const raw = String(value || "").trim();
	if (!raw) return null;

	let year;
	let month;
	let day;

	if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
		const isoParts = raw.split("-").map(Number);
		year = isoParts[0];
		month = isoParts[1];
		day = isoParts[2];
	} else {
		const localMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
		if (!localMatch) return null;

		day = Number(localMatch[1]);
		month = Number(localMatch[2]);
		year = Number(localMatch[3]);
	}

	if (!year || !month || !day) return null;
	if (month < 1 || month > 12 || day < 1 || day > 31) return null;

	const parsed = new Date(Date.UTC(year, month - 1, day));
	if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) {
		return null;
	}

	return parsed;
}

function formatDateUTC(date) {
	const dd = String(date.getUTCDate()).padStart(2, "0");
	const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
	const yyyy = date.getUTCFullYear();
	return dd + "/" + mm + "/" + yyyy;
}

function todayUTC() {
	const now = new Date();
	return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

function addUTCYears(date, years) {
	const copy = new Date(date.getTime());
	copy.setUTCFullYear(copy.getUTCFullYear() + years);
	return copy;
}

function getWeekdayNameES(dateUTC) {
	return WEEKDAY_NAMES_ES[dateUTC.getUTCDay()];
}

function getWeeksPerLifeYear(dobUTC, years) {
	const result = [];
	let previousCumulativeWeeks = 0;

	for (let year = 1; year <= years; year += 1) {
		const anniversary = addUTCYears(dobUTC, year);
		const cumulativeWeeks = weeksBetween(dobUTC, anniversary);
		result.push(cumulativeWeeks - previousCumulativeWeeks);
		previousCumulativeWeeks = cumulativeWeeks;
	}

	return result;
}

function countYearsWithWeeks(weeksPerYear, weekCount) {
	return weeksPerYear.filter(function(weeks) {
		return weeks === weekCount;
	}).length;
}

function formatPercent(value) {
	return PERCENT_FORMATTER.format(value) + "%";
}

function capitalizeFirst(value) {
	if (!value) return "";
	return value.charAt(0).toUpperCase() + value.slice(1);
}

function setPrintScale(rows, cols) {
	const printableWidthMm = 580;
	const printableHeightMm = 800;

	const byWidth = printableWidthMm / (cols + 2.6);
	const byHeight = printableHeightMm / (rows + 1.2);
	const cellMm = Math.max(2.6, Math.min(11, Math.min(byWidth, byHeight)));
	const ageColMm = cellMm * 2.4;
	const dotMm = cellMm * 0.62;

	document.documentElement.style.setProperty("--print-cell", cellMm.toFixed(2) + "mm");
	document.documentElement.style.setProperty("--print-age-col", ageColMm.toFixed(2) + "mm");
	document.documentElement.style.setProperty("--print-dot", dotMm.toFixed(2) + "mm");
}

function buildMetaText(data) {
	const cutoffWeekdayLabel = capitalizeFirst(data.cutoffWeekday);
	const items = [
		"<span class=\"meta-item meta-birth\">Nacimiento: " + formatDateUTC(data.dobUTC) + "</span>",
		"<span class=\"meta-item meta-reference\">Referencia: " + formatDateUTC(data.asOfUTC) + "</span>",
		"<span class=\"meta-item meta-cutoff\">Corte semanal: <span class=\"meta-cutoff-day\">" + cutoffWeekdayLabel + "</span></span>",
		"<span class=\"meta-item meta-lived\">Vividas: " + data.livedWeeks + " (" + formatPercent(data.livedPercent) + ")</span>",
		"<span class=\"meta-item meta-remaining\">Restantes: " + data.remainingWeeks + "</span>",
		"<span class=\"meta-item meta-total\">Totales (" + data.finalAge + " años): " + data.totalWeeks + "</span>",
		"<span class=\"meta-item meta-52\">Años de 52 semanas: " + data.yearsWith52 + "</span>",
		"<span class=\"meta-item meta-53\">Años de 53 semanas: " + data.yearsWith53 + "</span>"
	];

	return items.join("");
}

function setWeeklyGuide(data) {
	if (!elements.weeklyGuide || !elements.weeklyGuideText) return;

	if (!data) {
		elements.weeklyGuide.classList.add("is-empty");
		elements.weeklyGuideText.textContent = "Ingresa tu fecha de nacimiento y edad final (1-100) para ver qué día te toca pintar los puntos.";
		return;
	}

	elements.weeklyGuide.classList.remove("is-empty");
	elements.weeklyGuideText.textContent = "Tu día para pintar los puntos es: " + capitalizeFirst(data.cutoffWeekday) + ".";
}

function clearTable() {
	elements.table.innerHTML = "";
}

function buildPreviewWeeksPerYear(rows) {
	return Array.from({ length: rows }, function() {
		return 0;
	});
}

function appendHeaderRow(cols) {
	const header = document.createElement("tr");
	const ageCorner = document.createElement("th");

	ageCorner.className = "sticky age";
	ageCorner.textContent = "Edad";
	header.appendChild(ageCorner);

	for (let col = 1; col <= cols; col += 1) {
		const weekCell = document.createElement("th");
		weekCell.className = "sticky";
		weekCell.textContent = String(col);
		header.appendChild(weekCell);
	}

	elements.table.appendChild(header);
}

function appendYearRows(rows, cols, weeksPerYear, livedWeeks) {
	let weekIndex = 0;

	for (let row = 0; row < rows; row += 1) {
		const tr = document.createElement("tr");

		const ageCell = document.createElement("th");
		ageCell.className = "age";
		ageCell.textContent = String(row);
		tr.appendChild(ageCell);

		const weeksThisYear = weeksPerYear[row];

		for (let col = 0; col < cols; col += 1) {
			const td = document.createElement("td");

			const dot = document.createElement("span");
			dot.className = "dot";

			if (col < weeksThisYear) {
				weekIndex += 1;
				dot.classList.add(weekIndex <= livedWeeks ? "lived" : "future");
			} else {
				dot.classList.add("extra");
			}

			td.appendChild(dot);
			tr.appendChild(td);
		}

		elements.table.appendChild(tr);
	}
}

function calculateCalendarData(dobUTC, finalAge) {
	const asOfUTC = todayUTC();
	const endUTC = addUTCYears(dobUTC, finalAge);
	const weeksPerYear = getWeeksPerLifeYear(dobUTC, finalAge);
	const cols = Math.min(MAX_WEEK_COLS, Math.max.apply(null, weeksPerYear));
	const totalWeeks = Math.max(0, weeksBetween(dobUTC, endUTC));
	const livedRaw = weeksBetween(dobUTC, asOfUTC);
	const livedWeeks = Math.min(Math.max(0, livedRaw), totalWeeks);
	const livedPercent = totalWeeks > 0 ? (livedWeeks / totalWeeks) * 100 : 0;
	const cutoffWeekday = getWeekdayNameES(dobUTC);

	return {
		dobUTC: dobUTC,
		asOfUTC: asOfUTC,
		finalAge: finalAge,
		rows: finalAge,
		cols: cols,
		cutoffWeekday: cutoffWeekday,
		totalWeeks: totalWeeks,
		livedWeeks: livedWeeks,
		livedPercent: livedPercent,
		remainingWeeks: Math.max(0, totalWeeks - livedWeeks),
		yearsWith52: countYearsWithWeeks(weeksPerYear, 52),
		yearsWith53: countYearsWithWeeks(weeksPerYear, 53),
		weeksPerYear: weeksPerYear
	};
}

function renderCalendar() {
	const dobUTC = parseDateInputToUTC(elements.dobInput.value);
	let finalAge = Number.parseInt(elements.ageInput.value, 10);

	if (!dobUTC || !Number.isFinite(finalAge)) {
		elements.printBtn.disabled = true;
		elements.meta.textContent = "";
		setWeeklyGuide(null);
		setPrintScale(MAX_FINAL_AGE, MAX_WEEK_COLS);
		clearTable();
		appendHeaderRow(MAX_WEEK_COLS);
		appendYearRows(MAX_FINAL_AGE, MAX_WEEK_COLS, buildPreviewWeeksPerYear(MAX_FINAL_AGE), 0);
		return;
	}

	finalAge = Math.max(1, Math.min(MAX_FINAL_AGE, finalAge));
	elements.ageInput.value = String(finalAge);
	elements.printBtn.disabled = false;

	const data = calculateCalendarData(dobUTC, finalAge);
	elements.meta.innerHTML = buildMetaText(data);
	setWeeklyGuide(data);

	setPrintScale(data.rows, data.cols);

	clearTable();
	appendHeaderRow(data.cols);
	appendYearRows(data.rows, data.cols, data.weeksPerYear, data.livedWeeks);
}

function setupEvents() {
	elements.form.addEventListener("submit", function(event) {
		event.preventDefault();
		renderCalendar();
	});

	elements.dobInput.addEventListener("input", renderCalendar);
	elements.ageInput.addEventListener("input", renderCalendar);
	elements.dobInput.addEventListener("change", renderCalendar);
	elements.ageInput.addEventListener("change", renderCalendar);

	elements.printBtn.addEventListener("click", function() {
		window.print();
	});
}

function bootstrap() {
	elements.dobInput.value = "";
	elements.ageInput.value = "";
	setupEvents();
	renderCalendar();
}

bootstrap();

// Skapa root-element
var root = am5.Root.new("chartdiv");

// Sätt tema
root.setThemes([
  am5themes_Animated.new(root)
]);

// Skapa diagrammet
var chart = root.container.children.push(
  am5xy.XYChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomX",
    maxTooltipDistance: 0
  })
);

// Skapa axlar
var xAxis = chart.xAxes.push(
  am5xy.CategoryAxis.new(root, {
    categoryField: "year",
    renderer: am5xy.AxisRendererX.new(root, {})
  })
);

var yAxis = chart.yAxes.push(
  am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {})
  })
);

// Funktion för att läsa CSV och omvandla data
function loadCSV() {
  fetch("https://drive.google.com/uc?export=download&id=1-suj9kSknTchAfFXB5nS-VbT2sY9FQ-q")
    .then(response => response.text())
    .then(text => {
      console.log("CSV-filens innehåll:\n", text); // Debug: Se vad som faktiskt hämtas

      let rows = text.split("\n"); // Dela upp rader
      let headers = rows[0].split(","); // Första raden är rubriker
      let seriesData = {};

      // Skapa datastruktur
      for (let i = 1; i < rows.length; i++) {
        let cols = rows[i].split(",");
        let area = cols[0].trim(); // Trimma eventuella mellanslag
        if (!seriesData[area]) seriesData[area] = [];

        for (let j = 2; j < cols.length; j++) {
          let year = headers[j].trim(); // Trimma årsrubriker
          let value = parseFloat(cols[j]); // Omvandla text till tal
          if (!isNaN(value)) {
            seriesData[area].push({ year, value });
          }
        }
      }

      console.log("Omvandlad data:", seriesData); // Debug: Se omvandlade datan

      // Lägg till serier för varje område
      Object.keys(seriesData).forEach(area => {
        let series = chart.series.push(am5xy.LineSeries.new(root, {
          name: area,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          categoryXField: "year",
          tooltip: am5.Tooltip.new(root, {
            labelText: "{valueY}%"
          })
        }));

        series.data.setAll(seriesData[area]);
      });

      console.log("Data för xAxis:", seriesData[Object.keys(seriesData)[0]]); // Debug: Kolla axelns data
      xAxis.data.setAll(seriesData[Object.keys(seriesData)[0]]);
    })
    .catch(error => console.error("Fel vid inläsning av CSV:", error)); // Debug: Fånga fel
}

// Ladda CSV-filen
loadCSV(); // ✅ NU FINNS FUNKTIONEN!

// Lägg till en legend
var legend = chart.children.push(am5.Legend.new(root, {}));
legend.data.setAll(chart.series.values);

// Lägg till en cursor
chart.set("cursor", am5xy.XYCursor.new(root, {}));
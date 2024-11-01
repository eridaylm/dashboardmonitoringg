import { onCleanup, onMount, createEffect } from "solid-js";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const AgeChart = (props: { isDarkMode: boolean }) => {
  let root: am5.Root | null = null;

  onMount(() => {
    // Create root element
    root = am5.Root.new("chartdiv");

    // Remove the amCharts watermark
    root._logo.dispose();

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        layout: root.verticalLayout,
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
      })
    );

    // Add cursor
    const cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "none",
      })
    );
    cursor.lineY.set("visible", false);

    // Create axes
    const xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 30,
      minWidth: 60,
      visible: true,
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "ageCategory",
        renderer: xRenderer,
      })
    );

    // Create yAxis
    const yRenderer = am5xy.AxisRendererY.new(root, {});
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: yRenderer,
        min: 0,
        max: 4,
        strictMinMax: true,
        extraMin: 0,
        extraMax: 0,
        numberFormat: "#",
        visible: true,
        maxPrecision: 0,
      })
    );

    // Set axis grid lines to invisible
    xRenderer.grid.template.set("strokeOpacity", 0);
    xRenderer.axisFills.template.set("fillOpacity", 0);
    
    yRenderer.grid.template.set("strokeOpacity", 0);
    yRenderer.axisFills.template.set("fillOpacity", 0);

    // Create series
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Age Distribution",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        categoryXField: "ageCategory",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueY}",
        }),
      })
    );

    series.columns.template.setAll({
      width: am5.percent(70),
      strokeOpacity: 0,
    });

    // Fetch data from backend
    async function fetchData() {
      try {
        const response = await fetch("http://127.0.0.1:8080/agechart");
        const ageData = await response.json();

        const data = [
          { ageCategory: "0-5", value: ageData.category_0_5 || 0 },
          { ageCategory: "6-12", value: ageData.category_6_12 || 0 },
          { ageCategory: "13-17", value: ageData.category_13_17 || 0 },
          { ageCategory: "18-20", value: ageData.category_18_20 || 0 },
          { ageCategory: "21-59", value: ageData.category_21_59 || 0 },
          { ageCategory: "60+", value: ageData.category_60_plus || 0 },
        ];

        console.log("Chart Data:", data); // Debugging log

        xAxis.data.setAll(data);
        series.data.setAll(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }

    // Fetch and display data
    fetchData();

    // Animate series and chart on load
    series.appear(1000);
    chart.appear(1000, 100);

    // Clean up on unmount
    onCleanup(() => root?.dispose());
  });

  // Update the chart's label colors when theme changes
  createEffect(() => {
    if (root) {
      const labelColor = props.isDarkMode ? 0xFFFFFF : 0x000000;
      root.container.children.each((child) => {
        if (child instanceof am5xy.XYChart) {
          child.xAxes.each((xAxis) => {
            xAxis.get("renderer").labels.template.set("fill", am5.color(labelColor));
          });
          child.yAxes.each((yAxis) => {
            yAxis.get("renderer").labels.template.set("fill", am5.color(labelColor));
          });
        }
      });
    }
  });

  return (
    <div
      id="chartdiv"
      style={{ "margin-top": "-20px", width: "400px", height: "200px" }}
    ></div>
  );
};

export default AgeChart;

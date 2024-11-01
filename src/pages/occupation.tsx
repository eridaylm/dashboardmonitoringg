import { onMount, createEffect } from 'solid-js';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const OccupationChart = (props: { isDarkMode: boolean }) => {
  let chartDiv!: HTMLDivElement;
  let root: am5.Root | null = null;

  const updateLabelColor = (labelColor: am5.Color) => {
    if (root) {
      root.container.children.each((child) => {
        if (child instanceof am5xy.XYChart) {
          child.xAxes.each((axis) => {
            axis.get("renderer").labels.template.set("fill", labelColor);
          });
          child.yAxes.each((axis) => {
            axis.get("renderer").labels.template.set("fill", labelColor);
          });
        }
      });
    }
  };

  onMount(async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/occupationchart");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      root = am5.Root.new(chartDiv);

      root._logo?.dispose();

      root.setThemes([am5themes_Animated.new(root)]);

      let chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
        paddingLeft: 0,
        paddingRight: 1
      }));

      let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
      cursor.lineY.set("visible", false);

      let xRenderer = am5xy.AxisRendererX.new(root, {
        minGridDistance: 30,
        minorGridEnabled: true
      });

      xRenderer.labels.template.setAll({
        rotation: 0,
        centerY: am5.p50,
        centerX: am5.p50,
        paddingRight: 15
      });

      xRenderer.grid.template.setAll({
        location: 1
      });

      let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        maxDeviation: 0.3,
        categoryField: "name",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
      }));

      let yRenderer = am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1
      });

      let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 0.3,
        renderer: yRenderer
      }));

      let series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: "Occupation",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        sequencedInterpolation: true,
        categoryXField: "name",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueY}",
          dy: -25
        })
      }));

      series.columns.template.setAll({
        cornerRadiusTL: 5,
        cornerRadiusTR: 5,
        strokeOpacity: 0,
        fill: am5.color(0x30a071)
      });

      xAxis.data.setAll(data);
      series.data.setAll(data);

      series.appear(1000);
      chart.appear(1000, 100);

      // Set initial label color based on dark mode
      const initialLabelColor = props.isDarkMode ? am5.color(0xFFFFFF) : am5.color(0x000000);
      updateLabelColor(initialLabelColor);

    } catch (error) {
      console.error('Error setting up chart:', error);
    }
  });

  createEffect(() => {
    const labelColor = props.isDarkMode ? am5.color(0xFFFFFF) : am5.color(0x000000);
    updateLabelColor(labelColor);
  });

  return <div ref={chartDiv} id="chartdiv" style={{ "margin-top": "-25px", "margin-left": "17px", width: "230px", height: "200px" }}></div>;
};

export default OccupationChart;

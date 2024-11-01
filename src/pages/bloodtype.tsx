import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { onCleanup, onMount, createEffect } from "solid-js";

interface BloodTypeData {
  A: number;
  B: number;
  AB: number;
  O: number;
}

const BloodTypeChart = (props: { isDarkMode: boolean }) => {
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
      const response = await fetch("http://127.0.0.1:8080/bloodtypechart");
      if (!response.ok) throw new Error("Network response was not ok");
      const bloodTypeData: BloodTypeData = await response.json();

      console.log("Blood Type Data:", bloodTypeData);

      const chartData = [
        { category: "A", value: bloodTypeData.A },
        { category: "B", value: bloodTypeData.B },
        { category: "AB", value: bloodTypeData.AB },
        { category: "O", value: bloodTypeData.O }
      ];

      root = am5.Root.new("bloodTypeChart");

      root._logo?.dispose();

      root.setThemes([am5themes_Animated.new(root)]);

      let chart = root.container.children.push(
        am5xy.XYChart.new(root, {})
      );

      let xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: "category",
          renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 30
          }),
          tooltip: am5.Tooltip.new(root, {})
        })
      );

      xAxis.data.setAll(chartData);

      let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {})
        })
      );

      let series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: "Blood Type",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          categoryXField: "category",
          stroke: am5.color(0xc40202),
          tooltip: am5.Tooltip.new(root, {
            labelText: "{category}: {valueY}"
          })
        })
      );

      series.data.setAll(chartData);

      // Set initial label color based on dark mode
      const initialLabelColor = props.isDarkMode ? am5.color(0xFFFFFF) : am5.color(0x000000);
      updateLabelColor(initialLabelColor);

      onCleanup(() => {
        root?.dispose();
      });
    } catch (error) {
      console.error("Error fetching blood type data:", error);
    }
  });

  createEffect(() => {
    const labelColor = props.isDarkMode ? am5.color(0xFFFFFF) : am5.color(0x000000);
    updateLabelColor(labelColor);
  });

  return (
    <div id="bloodTypeChart" style={{ "margin-top": "-20px", "margin-left": "10px", width: "1050px", height: "250px" }}></div>
  );
};

export default BloodTypeChart;

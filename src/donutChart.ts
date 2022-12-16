import { ArcElement, Chart, DoughnutController } from "chart.js";
//import "@types/chart.js";

Chart.register(DoughnutController, ArcElement);

export const createDonutChart = (score) => {
  let diff = 100 - score;
  const ctx = document
    .querySelector<HTMLCanvasElement>("#donutChart")
    ?.getContext("2d");

  if (!ctx) {
    return;
  }

  const donutChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: [],
      datasets: [
        {
          label: "Carrier Score",
          data: [score, diff],
          backgroundColor: ["#51be5c", "#053d57"],
          borderColor: [],
          borderWidth: 0,
        },
      ],
    },
    options: {
      cutout: "90%",
      responsive: false,
    },
  });
  return donutChart;
};

export const updateDonutChart = (donutChart, score: number) => {
  let diff = 100 - score;

  donutChart.data.datasets[0].data.pop();
  donutChart.data.datasets[0].data.pop();
  donutChart.data.datasets[0].data.push(score, diff);
  donutChart.update();
};

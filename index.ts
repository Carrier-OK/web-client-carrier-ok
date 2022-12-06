const ENDPOINT = `https://parley-api-t3y3w7eb4a-wl.a.run.app`;
const ATTR_TARGET_NAME = `parley-target`;

interface CarrierData {
  dot_number: number;
  icc_dockets: string;
  legal_name: string;
  physical_address: string;
  telephone_number: string;
  cellphone_number: string;
  carrier_score: number;
  insurance: string;
  operating_authority: string;
  safety_rating_desc: string;
  rebroker_risk: string;
  basic_measure_unsafe_driving: number;
  basic_measure_hours_of_service: number;
  basic_measure_driver_fitness: number;
  basic_measure_controlled_substance: number;
  basic_measure_vehicle_maintence: number;
  basic_alert_unsafe_driving: string;
  basic_alert_hours_of_service: string;
  basic_alert_driver_fitness: string;
  basic_alert_controlled_substance: string;
  basic_alert_vehicle_maintence: string;
}

interface CarrierData2 {
  dot_number: number;
  docket_prefix: string;
  docket_number: number;
  docket: string;
  legal_name: string;
  physical_address: string;
  telephone_number: string;
  cellphone_number: string;
  fax_number: string;
  carrier_score: number;
  insurance: string;
  operating_authority: string;
  safety_rating_desc: string;
  rebroker_risk: string;
  basic_measure_unsafe_driving: number;
  basic_measure_hours_of_service: number;
  basic_measure_driver_fitness: number;
  basic_measure_controlled_substance: number;
  basic_measure_vehicle_maintence: number;
  basic_alert_unsafe_driving: string;
  basic_alert_hours_of_service: string;
  basic_alert_driver_fitness: string;
  basic_alert_controlled_substance: string;
  basic_alert_vehicle_maintence: string;
  inspections_total: number;
  last_inspection_date: string;
  authority_common: string;
  insurance_bipd_on_file: number;
  insurance_bond_on_file: number;
  insurance_cargo_on_file: number;
}

const init = async () => {
  // select UI elements
  const targets: NodeList = document.querySelectorAll(`[${ATTR_TARGET_NAME}]`);
  const loader = document.querySelector<HTMLDivElement>(
    '[data-parley="loader"]'
  );
  if (!loader) return;

  // listen for form submission
  const form = document.querySelector("form");
  if (!form) return;

  // define data fetching function
  const getData = async (num): Promise<CarrierData2 | null> => {
    try {
      const response = await fetch(`${ENDPOINT}/${num}`);
      if (response.status === 404) {
        alert(`No records found for DOT Number ${num}`);
        return null;
      }
      const data: CarrierData2 = await response.json();
      console.log({ data });
      return data;
    } catch (error) {
      console.log({ error });
      return null;
    }
  };

  // UI updating function
  const updateUI = (data: CarrierData2) => {
    targets.forEach((target) => {
      let el = target as Element;
      let val = data[String(el.getAttribute(ATTR_TARGET_NAME))];

      //   console.log(el.getAttribute(ATTR_TARGET_NAME));
      //   console.log({ val });

      if (val === undefined || val === null) {
        val = "No data";
      }
      if (el.getAttribute(ATTR_TARGET_NAME) === "carrier_score") {
        val = val * 100;
      }
      if (
        el.getAttribute(ATTR_TARGET_NAME) === "insurance_bipd_on_file" ||
        el.getAttribute(ATTR_TARGET_NAME) === "insurance_cargo_on_file"
      ) {
        const formatter = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        val = formatter.format(val);
      }
      val = val.toString();

      if (val.toLowerCase() === "false" || val.toLowerCase() === "true") {
        val = val.toLowerCase();
        val = "false" ? "NO" : "YES";
      }
      if (
        el.getAttribute(ATTR_TARGET_NAME) === "telephone_number" ||
        el.getAttribute(ATTR_TARGET_NAME) === "cellphone_number" ||
        el.getAttribute(ATTR_TARGET_NAME) === "fax_number"
      ) {
        if (val.length === 10) {
          val = formatPhoneNumber(val);
        }
      }
      if (val === "") {
        val = "No data";
      }

      //console.log({ 'val after processing': val })
      target.textContent = val;
    });
  };

  // function to run on form submit
  const formSubmit = async (event) => {
    event.preventDefault();
    const dotNumber = form.querySelector<HTMLInputElement>(
      '[parley-form="dot-number"]'
    )?.value;
    // call getData for DOT Number submitted through form
    loader.classList.add("is-visible");
    const data = await getData(dotNumber);
    // Update UI
    if (!data) {
      console.log("error getting carrier data!");
    } else {
      updateUI(data);
    }
    setTimeout(() => {
      loader.classList.remove("is-visible");
    }, 1000);
  };
  form.addEventListener("submit", formSubmit);
};

function formatPhoneNumber(phoneNumberString) {
  var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return null;
}

document.addEventListener("DOMContentLoaded", init);

import { createDonutChart, updateDonutChart } from "./donutChart";

const ENDPOINT = `https://parley-api-t3y3w7eb4a-wl.a.run.app`;
const ATTR_TARGET_NAME = `parley-target`;

enum ParleyUI {
  verified = "verified",
  unverified = "unverified",
}

enum CarrierDataKeys {
  dot_number = "dot_number",
  hyperlink_fmcsa_sms = "hyperlink_fmcsa_sms",
  hyperlink_fmcsa_authority = "hyperlink_fmcsa_authority",
  hyperlink_fmcsa_insurance = "hyperlink_fmcsa_insurance",
  entity_type_desc = "entity_type_desc",
  legal_name = "legal_name",
  authority_date = "authority_date",
  authority_age_months = "authority_age_months",
  mcs150_date = "mcs150_date",
  mcs150_milage = "mcs150_milage",
  last_inspection_date = "last_inspection_date",
  inspections_total = "inspections_total",
  total_power_units = "total_power_units",
  total_drivers = "total_drivers",
  company_contact_primary = "company_contact_primary",
  physical_address = "physical_address",
  hyperlink_physical_address = "hyperlink_physical_address",
  mismatched_physical_address = "mismatched_physical_address",
  physical_address_authority = "physical_address_authority",
  hyperlink_physical_address_authority = "hyperlink_physical_address_authority",
  mailing_address = "mailing_address",
  hyperlink_mailing_address = "hyperlink_mailing_address",
  mismatched_mailing_address = "mismatched_mailing_address",
  mailing_address_authority = "mailing_address_authority",
  hyperlink_mailing_address_authority = "hyperlink_mailing_address_authority",
  telephone_number = "telephone_number",
  cellphone_number = "cellphone_number",
  fax_number = "fax_number",
  email_address = "email_address",
  hyperlink_email_address = "hyperlink_email_address",
  authorized_cargo_string = "authorized_cargo_string",
  hazardous_material_flag = "hazardous_material_flag",
  safety_rating_date = "safety_rating_date",
  safety_rating_desc = "safety_rating_desc",
  crashes_total = "crashes_total",
  crash_fatalities = "crash_fatalities",
  last_crash_date = "last_crash_date",
  basic_measure_unsafe_driving = "basic_measure_unsafe_driving",
  basic_measure_hours_of_service = "basic_measure_hours_of_service",
  basic_measure_driver_fitness = "basic_measure_driver_fitness",
  basic_measure_controlled_substance = "basic_measure_controlled_substance",
  basic_measure_vehicle_maintence = "basic_measure_vehicle_maintence",
  basic_alert_unsafe_driving = "basic_alert_unsafe_driving",
  basic_alert_hours_of_service = "basic_alert_hours_of_service",
  basic_alert_driver_fitness = "basic_alert_driver_fitness",
  basic_alert_controlled_substance = "basic_alert_controlled_substance",
  basic_alert_vehicle_maintence = "basic_alert_vehicle_maintence",
  docket_prefix = "docket_prefix",
  docket_number = "docket_number",
  docket = "docket",
  authority_common = "authority_common",
  authority_contract = "authority_contract",
  authority_broker = "authority_broker",
  insurance_bipd_on_file = "insurance_bipd_on_file",
  insurance_bond_on_file = "insurance_bond_on_file",
  insurance_cargo_on_file = "insurance_cargo_on_file",
  carrier_score = "carrier_score",
  rebroker_risk = "rebroker_risk",
  low_ratio_power_units_to_drivers = "low_ratio_power_units_to_drivers",
  low_ratio_inspections_to_power_units = "low_ratio_inspections_to_power_units",
  low_ratio_inspections_to_age = "low_ratio_inspections_to_age",
  partial_contact_info = "partial_contact_info",
  shares_contact_info = "shares_contact_info",
  shares_address = "shares_address",
  mc_cluster = "mc_cluster",
}

interface CarrierData3 {
  dot_number: number;
  hyperlink_fmcsa_sms: string;
  hyperlink_fmcsa_authority: string;
  hyperlink_fmcsa_insurance: string;
  entity_type_desc: string;
  legal_name: string;
  authority_date: string;
  authority_age_months: number;
  mcs150_date: string;
  mcs150_milage: number;
  last_inspection_date: string;
  inspections_total: number;
  total_power_units: number;
  total_drivers: number;
  company_contact_primary: string;
  physical_address: string;
  hyperlink_physical_address: string;
  mismatched_physical_address: boolean;
  physical_address_authority: string;
  hyperlink_physical_address_authority: string;
  mailing_address: string;
  hyperlink_mailing_address: string;
  mismatched_mailing_address: boolean;
  mailing_address_authority: string;
  hyperlink_mailing_address_authority: string;
  telephone_number: string;
  cellphone_number: string;
  fax_number: string;
  email_address: string;
  hyperlink_email_address: string;
  authorized_cargo_string: string;
  hazardous_material_flag: boolean;
  safety_rating_date: string;
  safety_rating_desc: "Satisfactory" | "Not Conducted";
  crashes_total: number;
  crash_fatalities: number;
  last_crash_date: string;
  basic_measure_unsafe_driving: number;
  basic_measure_hours_of_service: number;
  basic_measure_driver_fitness: number;
  basic_measure_controlled_substance: number;
  basic_measure_vehicle_maintence: number;
  basic_alert_unsafe_driving: boolean;
  basic_alert_hours_of_service: boolean;
  basic_alert_driver_fitness: boolean;
  basic_alert_controlled_substance: boolean;
  basic_alert_vehicle_maintence: boolean;
  docket_prefix: string;
  docket_number: number;
  docket: string;
  authority_common: string;
  authority_contract: string;
  authority_broker: string;
  insurance_bipd_on_file: number;
  insurance_bond_on_file: number;
  insurance_cargo_on_file: number;
  carrier_score: number;
  rebroker_risk: string;
  low_ratio_power_units_to_drivers: boolean;
  low_ratio_inspections_to_power_units: boolean;
  low_ratio_inspections_to_age: boolean;
  partial_contact_info: boolean;
  shares_contact_info: boolean;
  shares_address: boolean;
  mc_cluster: boolean;
}

const sanitizeData = (data): CarrierData3 => {
  for (let property in data) {
    if (data[property] === "false") {
      data[property] = false;
    }
    if (data[property] === "true") {
      data[property] = true;
    }
  }
  return data;
};

let donutChart;

const init = async () => {
  // select UI elements
  donutChart = createDonutChart(75);
  console.log("loaded");
  const targets: NodeList = document.querySelectorAll(`[${ATTR_TARGET_NAME}]`);
  const loader = document.querySelector<HTMLDivElement>(
    '[data-parley="loader"]'
  );
  if (!loader) return;

  // listen for form submission
  const form = document.querySelector("form");
  if (!form) return;

  // define data fetching function
  const getData = async (num): Promise<CarrierData3 | null> => {
    try {
      const response = await fetch(`${ENDPOINT}/${num}`);
      if (response.status === 404) {
        alert(`No records found for DOT Number ${num}`);
        return null;
      }
      const data: CarrierData3 = await response.json();
      // console.log({ data });
      const sanitizedData = sanitizeData(data);
      // console.log({ sanitizedData });
      return sanitizedData;
    } catch (error) {
      console.log({ error });
      return null;
    }
  };

  const formatValue = (target, propName, val) => {
    const currencyFormatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    const decimalFormatter = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    const propNameSplit = propName.split("_");

    if (val === undefined || val === null) {
      val = "No data";
    } else if (propNameSplit.length > 0 && propNameSplit[0] === "hyperlink") {
      val = encodeURI(val);
    } else if (propName === CarrierDataKeys.mismatched_physical_address) {
      console.log("verifying physical address: ", val);
      if (!val) {
        target
          .querySelector(`[parley-ui="${ParleyUI.verified}"]`)
          ?.classList.remove("hide");
        target
          .querySelector(`[parley-ui="${ParleyUI.unverified}"]`)
          ?.classList.add("hide");
      } else {
        target
          .querySelector(`[parley-ui="${ParleyUI.unverified}"]`)
          ?.classList.remove("hide");
        target
          .querySelector(`[parley-ui="${ParleyUI.verified}"]`)
          ?.classList.add("hide");
      }
      return null;
    } else if (propName === CarrierDataKeys.mcs150_milage) {
      val = decimalFormatter.format(val);
    } else if (propName === CarrierDataKeys.carrier_score) {
      updateDonutChart(donutChart, val);
    } else if (propName === CarrierDataKeys.mcs150_date) {
      val = new Date(val);
      val = `(${val.getFullYear()})`;
      console.log({ val });
    } else if (propName === CarrierDataKeys.authorized_cargo_string) {
      val = val.replace(/,/g, " | ");
    } else if (
      propName === CarrierDataKeys.insurance_bipd_on_file ||
      propName === CarrierDataKeys.insurance_cargo_on_file
    ) {
      val = currencyFormatter.format(val);
    } else if (propName === CarrierDataKeys.authority_date) {
      val = new Date(val);
      val = val.toISOString().split("T")[0];
    } else if (
      propName === CarrierDataKeys.low_ratio_inspections_to_age ||
      propName === CarrierDataKeys.low_ratio_inspections_to_power_units ||
      propName === CarrierDataKeys.low_ratio_power_units_to_drivers ||
      propName === CarrierDataKeys.partial_contact_info ||
      propName === CarrierDataKeys.shares_address ||
      propName === CarrierDataKeys.shares_contact_info ||
      propName === CarrierDataKeys.mc_cluster
    ) {
      target.classList.remove("hide");
      if (!val) {
        target.classList.add("hide");
      }
      return null;
    }

    if (val === false) {
      val = "NO";
    }
    if (val === true) {
      val = "YES";
    }

    // convert to string
    val = val.toString();

    if (
      propName === "telephone_number" ||
      propName === "cellphone_number" ||
      propName === "fax_number"
    ) {
      if (val.length === 10) {
        val = formatPhoneNumber(val);
      }
    }
    if (val === "") {
      val = "No data";
    }
    return val;
  };

  // UI updating function
  const updateUI = (data: CarrierData3) => {
    targets.forEach((target) => {
      let el = target as Element;
      let val = data[String(el.getAttribute(ATTR_TARGET_NAME))];
      // console.log({ val });
      let propName = el.getAttribute(ATTR_TARGET_NAME);
      if (!propName) return;
      let formattedVal = formatValue(target, propName, val);

      if (
        formattedVal === "Active" ||
        formattedVal === "Satisfactory" ||
        formattedVal === "LOW"
      ) {
        (target as Element).classList.add("green-glow");
        formattedVal = formattedVal.toUpperCase();
      } else {
        (target as Element).classList.remove("green-glow");
      }

      // console.log({ formattedVal });
      const propNameSplit = propName.split("_");
      if (propNameSplit.length > 0 && propNameSplit[0] === "hyperlink") {
        (target as HTMLAnchorElement).href = formattedVal;
      } else {
        if (formattedVal === null) return; // don't update texdt if we give it a null value
        target.textContent = formattedVal;
      }
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

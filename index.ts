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
    const getData = async (num): Promise<CarrierData | null> => {
        try {
            const response = await fetch(
                `${ENDPOINT}/${num}`
            );
            if (response.status === 404) {
                alert(`No records found for DOT Number ${num}`);
                return null;
            }
            const data: CarrierData = await response.json();
            return data;
        } catch (error) {
            console.log({ error });
            return null;
        }
    };

    // UI updating function
    const updateUI = (data: CarrierData) => {
        targets.forEach((target) => {
            let val = data[String((<Element>target).getAttribute(ATTR_TARGET_NAME))];
            console.log({ val })
            if (val === undefined || val === null) {
                val = "No data";
            }
            val = val.toString()
            if (val.toLowerCase() === "false" || val.toLowerCase() === "true") {
                val = val.toLowerCase();
                val = "false" ? "NO" : "YES";
            }
            if (val === "") {
                val = "No data"
            }
            console.log({ 'val after processing': val })
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

document.addEventListener("DOMContentLoaded", init);

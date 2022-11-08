interface CarrierData {
    CONTR_SUBST_AC: boolean;
    CONTR_SUBST_INSP_W_VIOL: number;
    CONTR_SUBST_MEASURE: number;
    DOT_NUMBER: number;
    DRIVER_INSP_TOTAL: number;
    DRIVER_OOS_INSP_TOTAL: number;
    DRIV_FIT_AC: boolean;
    DRIV_FIT_INSP_W_VIOL: number;
    DRIV_FIT_MEASURE: number;
    HOS_DRIV_AC: boolean;
    HOS_DRIV_INSP_W_VIOL: number;
    HOS_DRIV_MEASURE: number;
    INSP_TOTAL: number;
    UNSAFE_DRIV_AC: boolean;
    UNSAFE_DRIV_INSP_W_VIOL: number;
    UNSAFE_DRIV_MEASURE: number;
    VEHICLE_INSP_TOTAL: number;
    VEHICLE_OOS_INSP_TOTAL: number;
    VEH_MAINT_AC: boolean;
    VEH_MAINT_INSP_W_VIOL: number;
    VEH_MAINT_MEASURE: number;
}


const init = async () => {
    // select UI elements
    const targets: NodeList = document.querySelectorAll('[parley-target]')
    const loader = document.querySelector<HTMLDivElement>('[data-parley="loader"]')
    if (!loader) return

    // listen for form submission
    const form = document.querySelector("form");
    if (!form) return;

    // define data fetching function
    const getData = async (num): Promise<CarrierData | null> => {
        try {
            const response = await fetch(
                `https://parley-api-2gajsirgta-uc.a.run.app/${num}`
            );
            if (response.status === 404) {
                alert(`No records found for DOT Number ${num}`)
                return null
            }
            const data: CarrierData = await response.json();
            return data
        } catch (error) {
            console.log({ error });
            return null
        }
    }

    // UI updating function
    const updateUI = (data: CarrierData) => {
        targets.forEach((target) => {
            let val = data[String((<Element>target).getAttribute('parley-target'))]
            if (typeof val === "string") {
                val = "false" ? "NO" : "YES"
            }
            target.textContent = val
        })
    }

    // function to run on form submit
    const formSubmit = async (event) => {
        event.preventDefault();
        const dotNumber = form.querySelector<HTMLInputElement>('[parley-form="dot-number"]')?.value
        // call getData for DOT Number submitted through form
        loader.classList.add('is-visible')
        const data = await getData(dotNumber)
        // Update UI
        if (!data) {
            console.log('error getting carrier data!')
        } else {
            updateUI(data)
        }
        setTimeout(() => {
            loader.classList.remove('is-visible')
        }, 1000)

    };
    form.addEventListener("submit", formSubmit);
};

document.addEventListener("DOMContentLoaded", init);

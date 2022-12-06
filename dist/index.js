(() => {
  // index.ts
  var ENDPOINT = `https://parley-api-t3y3w7eb4a-wl.a.run.app`;
  var ATTR_TARGET_NAME = `parley-target`;
  var init = async () => {
    const targets = document.querySelectorAll(`[${ATTR_TARGET_NAME}]`);
    const loader = document.querySelector(
      '[data-parley="loader"]'
    );
    if (!loader)
      return;
    const form = document.querySelector("form");
    if (!form)
      return;
    const getData = async (num) => {
      try {
        const response = await fetch(`${ENDPOINT}/${num}`);
        if (response.status === 404) {
          alert(`No records found for DOT Number ${num}`);
          return null;
        }
        const data = await response.json();
        console.log({ data });
        return data;
      } catch (error) {
        console.log({ error });
        return null;
      }
    };
    const updateUI = (data) => {
      targets.forEach((target) => {
        let el = target;
        let val = data[String(el.getAttribute(ATTR_TARGET_NAME))];
        if (val === void 0 || val === null) {
          val = "No data";
        }
        if (el.getAttribute(ATTR_TARGET_NAME) === "carrier_score") {
          val = val * 100;
        }
        if (el.getAttribute(ATTR_TARGET_NAME) === "insurance_bipd_on_file" || el.getAttribute(ATTR_TARGET_NAME) === "insurance_cargo_on_file") {
          const formatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          });
          val = formatter.format(val);
        }
        val = val.toString();
        if (val.toLowerCase() === "false" || val.toLowerCase() === "true") {
          val = val.toLowerCase();
          val = "false" ? "NO" : "YES";
        }
        if (el.getAttribute(ATTR_TARGET_NAME) === "telephone_number" || el.getAttribute(ATTR_TARGET_NAME) === "cellphone_number" || el.getAttribute(ATTR_TARGET_NAME) === "fax_number") {
          if (val.length === 10) {
            val = formatPhoneNumber(val);
          }
        }
        if (val === "") {
          val = "No data";
        }
        target.textContent = val;
      });
    };
    const formSubmit = async (event) => {
      event.preventDefault();
      const dotNumber = form.querySelector(
        '[parley-form="dot-number"]'
      )?.value;
      loader.classList.add("is-visible");
      const data = await getData(dotNumber);
      if (!data) {
        console.log("error getting carrier data!");
      } else {
        updateUI(data);
      }
      setTimeout(() => {
        loader.classList.remove("is-visible");
      }, 1e3);
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
})();
//# sourceMappingURL=index.js.map

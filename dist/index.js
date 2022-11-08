(() => {
  // index.ts
  var init = async () => {
    const targets = document.querySelectorAll("[parley-target]");
    const loader = document.querySelector('[data-parley="loader"]');
    if (!loader)
      return;
    const form = document.querySelector("form");
    if (!form)
      return;
    const getData = async (num) => {
      try {
        const response = await fetch(
          `https://parley-api-2gajsirgta-uc.a.run.app/${num}`
        );
        if (response.status === 404) {
          alert(`No records found for DOT Number ${num}`);
          return null;
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.log({ error });
        return null;
      }
    };
    const updateUI = (data) => {
      targets.forEach((target) => {
        let val = data[String(target.getAttribute("parley-target"))];
        if (typeof val === "string") {
          val = "false" ? "NO" : "YES";
        }
        target.textContent = val;
      });
    };
    const formSubmit = async (event) => {
      event.preventDefault();
      const dotNumber = form.querySelector('[parley-form="dot-number"]')?.value;
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
  document.addEventListener("DOMContentLoaded", init);
})();
//# sourceMappingURL=index.js.map

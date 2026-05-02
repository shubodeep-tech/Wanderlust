document.addEventListener("DOMContentLoaded", () => {
  const filters = document.querySelectorAll(".filter");
  const categoryInput = document.getElementById("category");

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      filters.forEach((f) => f.classList.remove("active"));
      filter.classList.add("active");
      categoryInput.value = filter.dataset.category;
    });
  });
});


let gstOn = false;

document.getElementById("gstToggle")?.addEventListener("change", function () {
  gstOn = this.checked;
  const prices = document.querySelectorAll(".price");

  prices.forEach((el) => {
    const base = Number(el.dataset.price); 
    if (gstOn) {
      el.innerText = "₹ " + Math.round(base * 1.18).toLocaleString("en-IN");
    } else {
      el.innerText = "₹ " + base.toLocaleString("en-IN");
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {

  const filters = document.querySelectorAll(".filter");
  const categoryInput = document.getElementById("category"); 

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {

      filters.forEach(f => f.classList.remove("active"));
      filter.classList.add("active");

      categoryInput.value = filter.dataset.category;

      console.log("Selected category:", categoryInput.value);
    });
  });

});


document.getElementById("gstToggle")?.addEventListener("change", function () {

  const prices = document.querySelectorAll(".price");

  prices.forEach((el) => {
    let base = Number(el.dataset.price);

    if (this.checked) {
      let gst = base * 1.18;
      el.innerText = "₹ " + Math.round(gst).toLocaleString("en-IN");
    } else {
      el.innerText = "₹ " + base.toLocaleString("en-IN");
    }
  });

});
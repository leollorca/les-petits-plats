export default function getTargetInfos(event) {
  switch (event.target.name) {
    case "ingredients":
      return {
        filterTag: document.querySelector(".ingredients"),
        input: document.getElementById("filter__ingredients"),
        list: document.querySelector(".ingredients .filter__list"),
        placeholder: "Ingrédients",
        focusedPlaceholder: "Rechercher un ingrédient",
        dropdownIcon: document.querySelector(".ingredients .filter__icon"),
      };
    case "appareils":
      return {
        filterTag: document.querySelector(".appareils"),
        input: document.getElementById("filter__appareils"),
        list: document.querySelector(".appareils .filter__list"),
        placeholder: "Appareils",
        focusedPlaceholder: "Rechercher un appareil",
        dropdownIcon: document.querySelector(".appareils .filter__icon"),
      };
    case "ustensiles":
      return {
        filterTag: document.querySelector(".ustensiles"),
        input: document.getElementById("filter__ustensiles"),
        list: document.querySelector(".ustensiles .filter__list"),
        placeholder: "Ustensiles",
        focusedPlaceholder: "Rechercher un ustensile",
        dropdownIcon: document.querySelector(".ustensiles .filter__icon"),
      };
  }
}

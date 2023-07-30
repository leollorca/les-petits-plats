export default function getTargetInfos(name) {
  switch (name) {
    case "ingredients":
      return {
        color: "#3282f7",
        filterTag: document.querySelector(".ingredients"),
        input: document.getElementById("filter__ingredients"),
        list: document.querySelector(".ingredients .filter__list"),
        placeholder: "Ingrédients",
        focusedPlaceholder: "Rechercher un ingrédient",
        dropdownIcon: document.querySelector(".ingredients .filter__icon"),
        getMethod: undefined,
      };
    case "appareils":
      return {
        color: "#68d9a4",
        filterTag: document.querySelector(".appareils"),
        input: document.getElementById("filter__appareils"),
        list: document.querySelector(".appareils .filter__list"),
        placeholder: "Appareils",
        focusedPlaceholder: "Rechercher un appareil",
        dropdownIcon: document.querySelector(".appareils .filter__icon"),
        getMethod: undefined,
      };
    case "ustensiles":
      return {
        color: "#ed6454",
        filterTag: document.querySelector(".ustensiles"),
        input: document.getElementById("filter__ustensiles"),
        list: document.querySelector(".ustensiles .filter__list"),
        placeholder: "Ustensiles",
        focusedPlaceholder: "Rechercher un ustensile",
        dropdownIcon: document.querySelector(".ustensiles .filter__icon"),
        getMethod: undefined,
      };
  }
}

const ingredientsList = document.querySelector(".ingredients .filter__list");
ingredientsList.style.backgroundColor = "#3282f7";

const appliancesList = document.querySelector(".appareils .filter__list");
appliancesList.style.backgroundColor = "#68d9a4";

const ustensilsList = document.querySelector(".ustensiles .filter__list");
ustensilsList.style.backgroundColor = "#ed6454";

function getTargetInfos(event) {
  switch (event.target.name) {
    case "ingredients":
      return {
        filterTag: document.querySelector(".ingredients"),
        input: document.getElementById("filter__ingredients"),
        list: ingredientsList,
        placeholder: "Ingrédients",
        focusedPlaceholder: "Rechercher un ingrédient",
        dropdownIcon: document.querySelector(".ingredients .filter__icon"),
      };
    case "appareils":
      return {
        filterTag: document.querySelector(".appareils"),
        input: document.getElementById("filter__appareils"),
        list: appliancesList,
        placeholder: "Appareils",
        focusedPlaceholder: "Rechercher un appareil",
        dropdownIcon: document.querySelector(".appareils .filter__icon"),
      };
    case "ustensiles":
      return {
        filterTag: document.querySelector(".ustensiles"),
        input: document.getElementById("filter__ustensiles"),
        list: ustensilsList,
        placeholder: "Ustensiles",
        focusedPlaceholder: "Rechercher un ustensile",
        dropdownIcon: document.querySelector(".ustensiles .filter__icon"),
      };
  }
}

function inputToOriginalState(event) {
  const { filterTag, input, placeholder } = getTargetInfos(event);

  event.target.value = "";
  event.target.style.opacity = "1";
  event.target.style.width = `100%`;

  filterTag.style.width = `190px`;
  filterTag.style.borderRadius = "5px";
  input.setAttribute("placeholder", placeholder);
}

function inputToFocusState(event) {
  const { filterTag, input, list, focusedPlaceholder } = getTargetInfos(event);

  event.target.style.width = "300px";
  event.target.style.opacity = ".5";

  filterTag.style.width = "300px";
  filterTag.style.borderRadius = "5px";
  input.setAttribute("placeholder", focusedPlaceholder);

  if (list.innerHTML) {
    displayList(event);
  }
}

function displayList(event) {
  const { filterTag, list, focusedPlaceholder } = getTargetInfos(event);

  if (!list.children.length) {
    return;
  }

  if (list.children.length > 40) {
    list.style.gridTemplateRows = "repeat(20, 1fr)";
  } else {
    list.style.gridTemplateRows = "repeat(10, 1fr)";
  }

  // list.style.left = "0";
  list.style.opacity = "1";
  filterTag.style.borderRadius = "5px 5px 0 0";

  const accurateListWidth = list.getBoundingClientRect().width;

  if (list.children.length > 10) {
    list.style.display = "grid";
    filterTag.style.width = `${accurateListWidth}px`;
    event.target.style.width = `${accurateListWidth}px`;
  } else {
    list.style.display = "block";
    list.style.width = "300px";

    Array.from(list.children).forEach((child) => {
      child.style.width = "100%";
    });

    event.target.style.width = "300px";
  }

  event.target.setAttribute("placeholder", focusedPlaceholder);
}

function hideList(event) {
  const { filterTag, list } = getTargetInfos(event);

  filterTag.style.borderRadius = "5px";
  list.style.opacity = "0";
  list.style.display = "grid";
  list.style.width = "unset";
  // list.style.left = "-9999px";
}

document.querySelectorAll(".filter__input").forEach((input) => {
  input.addEventListener("focus", (event) => inputToFocusState(event));
  input.addEventListener("input", (event) => {
    event.target.value
      ? (event.target.style.opacity = "1")
      : (event.target.style.opacity = ".5");

    event.target.value.length > 2 ? displayList(event) : hideList(event);
  });
  input.addEventListener("focusout", (event) => {
    hideList(event);
    inputToOriginalState(event);
  });
});

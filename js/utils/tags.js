// import { recipes } from "../../data/recipes.js";

const filterTags = document.querySelectorAll(".filter__input");

// INGREDIENTS
const ingredientsFilterTag = document.querySelector(".ingredients");
const ingredientsInput = document.getElementById("filter__ingredients");
const ingredientsDropdownIcon = document.querySelector(
  ".ingredients .filter__icon"
);
const ingredientsList = document.querySelector(".ingredients .filter__list");
ingredientsList.style.backgroundColor = "#3282f7";

// APPAREILS
const appliancesFilterTag = document.querySelector(".appareils");
const appliancesInput = document.getElementById("filter__appareils");
const appliancesDropdownIcon = document.querySelector(
  ".appareils .filter__icon"
);
const appliancesList = document.querySelector(".appareils .filter__list");
appliancesList.style.backgroundColor = "#68d9a4";

// USTENSILES
const ustensilsFilterTag = document.querySelector(".ustensiles");
const ustensilsInput = document.getElementById("filter__ustensiles");
const ustensilsDropdownIcon = document.querySelector(
  ".ustensiles .filter__icon"
);
const ustensilsList = document.querySelector(".ustensiles .filter__list");
ustensilsList.style.backgroundColor = "#ed6454";

function inputToOriginalState(event) {
  event.target.value = "";
  event.target.style.opacity = "1";
  event.target.style.width = `100%`;

  const filterName = event.target.getAttribute("name");
  if (filterName === "ingredients") {
    ingredientsFilterTag.style.width = `190px`;
    ingredientsFilterTag.style.borderRadius = "5px";
    ingredientsInput.setAttribute("placeholder", "Ingrédients");
  }
  if (filterName === "appareils") {
    appliancesFilterTag.style.width = `190px`;
    appliancesFilterTag.style.borderRadius = "5px";
    appliancesInput.setAttribute("placeholder", "Appareils");
  }
  if (filterName === "ustensiles") {
    ustensilsFilterTag.style.width = `190px`;
    ustensilsFilterTag.style.borderRadius = "5px";
    ustensilsInput.setAttribute("placeholder", "Ustensiles");
  }
}

function inputToFocusState(event) {
  event.target.style.width = "300px";
  event.target.style.opacity = ".5";

  const filterName = event.target.getAttribute("name");
  if (filterName === "ingredients") {
    ingredientsFilterTag.style.width = "300px";
    ingredientsFilterTag.style.borderRadius = "5px";
    ingredientsInput.setAttribute("placeholder", "Rechercher un ingrédient");
    if (ingredientsList.innerHTML) {
      displayList(event);
    }
  }
  if (filterName === "appareils") {
    appliancesFilterTag.style.width = "300px";
    appliancesFilterTag.style.borderRadius = "5px";
    appliancesInput.setAttribute("placeholder", "Rechercher un appareil");
    if (appliancesList.innerHTML) {
      displayList(event);
    }
  }
  if (filterName === "ustensiles") {
    ustensilsFilterTag.style.width = "300px";
    ustensilsFilterTag.style.borderRadius = "5px";
    ustensilsInput.setAttribute("placeholder", "Rechercher un ustensile");
    if (ustensilsList.innerHTML) {
      displayList(event);
    }
  }
}

function displayList(event) {
  const filterName = event.target.getAttribute("name");
  if (filterName === "ingredients") {
    if(ingredientsList.children.length > 40) {
      ingredientsList.style.gridTemplateRows = "repeat(20, 1fr)";
    } else {
      ingredientsList.style.gridTemplateRows = "repeat(10, 1fr)";
    }
    // ingredientsList.style.left = "0";
    ingredientsList.style.opacity = "1";
    ingredientsFilterTag.style.borderRadius = "5px 5px 0 0";
    const accurateListWidth = ingredientsList.getBoundingClientRect().width;
    if (accurateListWidth > 300) {
      ingredientsList.style.display = "grid";
      ingredientsFilterTag.style.width = `${accurateListWidth}px`;
      event.target.style.width = `${accurateListWidth}px`;
    } else {
      ingredientsList.style.display = "block";
      ingredientsList.style.width = "300px";
      event.target.style.width = "300px";
    }
    event.target.setAttribute("placeholder", "Rechercher un ingrédient");
  }
  if (filterName === "appareils") {
    if(appliancesList.children.length > 40) {
      appliancesList.style.gridTemplateRows = "repeat(20, 1fr)";
    } else {
      appliancesList.style.gridTemplateRows = "repeat(10, 1fr)";
    }
    // appliancesList.style.left = "0";
    appliancesList.style.opacity = "1";
    appliancesFilterTag.style.borderRadius = "5px 5px 0 0";
    const accurateListWidth = appliancesList.getBoundingClientRect().width;
    if (accurateListWidth > 300) {
      appliancesList.style.display = "grid";
      appliancesFilterTag.style.width = `${accurateListWidth}px`;
      event.target.style.width = `${accurateListWidth}px`;
    } else {
      appliancesList.style.display = "block";
      appliancesList.style.width = "300px";
      event.target.style.width = "300px";
    }
    event.target.setAttribute("placeholder", "Rechercher un appareil");
  }
  if (filterName === "ustensiles") {
    if(ustensilsList.children.length > 40) {
      ustensilsList.style.gridTemplateRows = "repeat(20, 1fr)";
    } else {
      ustensilsList.style.gridTemplateRows = "repeat(10, 1fr)";
    }
    // ustensilsList.style.left = "0";
    ustensilsList.style.opacity = "1";
    ustensilsFilterTag.style.borderRadius = "5px 5px 0 0";
    const accurateListWidth = ustensilsList.getBoundingClientRect().width;
    if (accurateListWidth > 300) {
      ustensilsList.style.display = "grid";
      ustensilsFilterTag.style.width = `${accurateListWidth}px`;
      event.target.style.width = `${accurateListWidth}px`;
    } else {
      ustensilsList.style.display = "block";
      ustensilsList.style.width = "300px";
      event.target.style.width = "300px";
    }
    event.target.setAttribute("placeholder", "Rechercher un ustensile");
  }
}

function hideList(inputName) {
  if (inputName === "ingredients") {
    ingredientsList.style.opacity = "0";
    ingredientsList.style.display = "grid";
    ingredientsList.style.width = "unset";
    // ingredientsList.style.left = "-9999px";
  }
  if (inputName === "appareils") {
    appliancesList.style.opacity = "0";
    appliancesList.style.display = "grid";
    appliancesList.style.width = "unset";
    // appliancesList.style.left = "-9999px";
  }
  if (inputName === "ustensiles") {
    ustensilsList.style.opacity = "0";
    ustensilsList.style.display = "grid";
    ustensilsList.style.width = "unset";
    // ustensilsList.style.left = "-9999px";
  }
}

filterTags.forEach((tag) => {
  tag.addEventListener("focus", (event) => inputToFocusState(event));
  tag.addEventListener("input", (event) => {
    if (event.target.value) {
      event.target.style.opacity = "1";
    } else {
      event.target.style.opacity = ".5";
    }

    // const filterName = event.target.getAttribute("name");
    // let currentList;
    // if (filterName === "ingredients") {
    //   currentList = ingredientsList;
    // }
    // if (filterName === "appareils") {
    //   currentList = appliancesList;
    // }
    // if (filterName === "ustensiles") {
    //   currentList = ustensilsList;
    // }

    // if (currentList.innerHTML) {
    //   displayList(event);
    // } else {
    //   inputToFocusState(event);
    //   hideList(event.target.getAttribute("name"));
    // }
  });
  tag.addEventListener("focusout", (event) => {
    hideList(event.target.getAttribute("name"));
    inputToOriginalState(event);
  });
});

function addTag(tagContent, color) {
  const tagsContainer = document.querySelector(".search__tags");
  const tag = document.createElement("div");
  const tagCrossIcon = document.createElement("img");

  tagsContainer.style.display = "flex";
  tag.classList.add("tag");
  tag.innerHTML = tagContent;
  tag.style.backgroundColor = color;
  tagCrossIcon.classList.add("tag__icon");
  tagCrossIcon.setAttribute("src", "./assets/icons/cross.svg");

  tagCrossIcon.addEventListener("click", removeTag);

  tag.appendChild(tagCrossIcon);
  tagsContainer.appendChild(tag);
}

function removeTag(event) {
  const tagsContainer = document.querySelector(".search__tags");
  event.target.parentNode.remove();
  if (!tagsContainer.innerHTML) {
    tagsContainer.style.display = "none";
  }
}

export { addTag };

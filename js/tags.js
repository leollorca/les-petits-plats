import { recipes } from "../data/recipes.js";

// INGREDIENTS
//////////////////////////
const ingredientsWithRecipeId = recipes.reduce((acc, recipe) => {
  recipe.ingredients.forEach((ingredient) => {
    acc.push({
      recipeId: recipe.id,
      name: ingredient.ingredient.toLowerCase(),
    });
  });
  return acc;
}, []);

const ingredientsWithRecipeIds = ingredientsWithRecipeId.reduce(
  (acc, ingredient) => {
    const existingIngredient = acc.find((i) => i.name === ingredient.name);
    if (existingIngredient) {
      existingIngredient.recipeIds.push(ingredient.recipeId);
    } else {
      acc.push({
        name: ingredient.name,
        recipeIds: [ingredient.recipeId],
      });
    }
    return acc;
  },
  []
);

// APPLIANCES
//////////////////////////
const appliancesWithRecipeId = recipes.reduce((acc, recipe) => {
  acc.push({
    recipeId: recipe.id,
    name: recipe.appliance.toLowerCase(),
  });
  return acc;
}, []);

const appliancesWithRecipeIds = appliancesWithRecipeId.reduce(
  (acc, appliance) => {
    const existingAppliance = acc.find((i) => i.name === appliance.name);
    if (existingAppliance) {
      existingAppliance.recipeIds.push(appliance.recipeId);
    } else {
      acc.push({
        name: appliance.name,
        recipeIds: [appliance.recipeId],
      });
    }
    return acc;
  },
  []
);

// USTENSILS
//////////////////////////
const ustensilsWithRecipeId = recipes.reduce((acc, recipe) => {
  recipe.ustensils.forEach((ustensil) => {
    acc.push({
      recipeId: recipe.id,
      name: ustensil.toLowerCase(),
    });
  });
  return acc;
}, []);

const ustensilsWithRecipeIds = ustensilsWithRecipeId.reduce((acc, ustensil) => {
  const existingUstensil = acc.find((i) => i.name === ustensil.name);
  if (existingUstensil) {
    existingUstensil.recipeIds.push(ustensil.recipeId);
  } else {
    acc.push({
      name: ustensil.name,
      recipeIds: [ustensil.recipeId],
    });
  }
  return acc;
}, []);

const ingredientsFilterTags = document.querySelector(".ingredients");
const ingredientsInput = document.getElementById("filter__ingredients");
const ingredientsDropdownIcon = document.querySelector(
  ".ingredients .filter__icon"
);
const ingredientsList = document.querySelector(".filter__list");
ingredientsList.style.backgroundColor = "#3282f7";
ingredientsWithRecipeIds.forEach((ingredient) => {
  //   const ingredientItem = document.createElement("li");
  //   ingredientItem.classList.add("filter__item");
  //   ingredientItem.innerHTML = ingredient.name;
  //   ingredientsList.appendChild(ingredientItem);
});

const appliancesInput = document.getElementById("filter__appareils");
const appliancesList = document.querySelector(".filter__list");

const ustensilsInput = document.getElementById("filter__ustensiles");
const ustensilsList = document.querySelector(".filter__list");

function inputToOriginalState(event) {
  event.target.value = "";
  ingredientsFilterTags.style.width = `170px`;
  ingredientsFilterTags.style.borderRadius = "5px";
  ingredientsInput.setAttribute("placeholder", "Ingrédients");
  ingredientsInput.style.opacity = "1";
  ingredientsInput.style.width = `100%`;
}

function inputToFocusState() {
  ingredientsFilterTags.style.width = "300px";
  ingredientsFilterTags.style.borderRadius = "5px";
  ingredientsInput.setAttribute("placeholder", "Rechercher un ingrédient");
  ingredientsInput.style.width = "300px";
  ingredientsInput.style.opacity = ".5";
}

function displayList() {
  ingredientsList.style.display = "grid";
  ingredientsFilterTags.style.borderRadius = "5px 5px 0 0";
  const accurateListWidth = ingredientsList.getBoundingClientRect().width;
  ingredientsFilterTags.style.width = `${accurateListWidth}px`;
  ingredientsInput.style.width = `${accurateListWidth}px`;
  ingredientsInput.setAttribute("placeholder", "Rechercher un ingrédient");
  ingredientsInput.style.opacity = "1";
}

ingredientsInput.addEventListener("focus", inputToFocusState);

ingredientsInput.addEventListener("input", (event) => {
  if (event.target.value.length > 0) {
    displayList(event);
  } else {
    inputToFocusState();
    ingredientsList.style.display = "none";
  }
});

ingredientsInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    if (event.target.value.length === 0) {
      return;
    }
    addTag(event.target.value);
    event.target.value = "";
    ingredientsInput.style.opacity = ".5";
  }
});

ingredientsInput.addEventListener("focusout", (event) => {
  ingredientsList.style.display = "none";
  inputToOriginalState(event);
});

function addTag(tagContent) {
  const tagsContainer = document.querySelector(".search__tags");
  const tag = document.createElement("div");
  const tagCrossIcon = document.createElement("img");

  tagsContainer.style.display = "flex";
  tag.classList.add("tag");
  tag.innerHTML = tagContent;
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

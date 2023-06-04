import { recipes } from "../data/recipes.js";
import { getRecipeCard } from "./utils/cards.js";
import { addTag } from "./utils/tags.js";

document.querySelector(".search__main").addEventListener("input", (event) => {
  const search = event.target.value;
  const recipesTag = document.querySelector(".recipes");

  recipesTag.innerHTML = "";

  if (event.target.value.length > 2) {
    const results = recipes.filter((recipe) => {
      const regex = new RegExp(search, "gi");
      return (
        recipe.name.match(regex) ||
        recipe.description.match(regex) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.ingredient.match(regex)
        )
      );
    });

    results.forEach((result) => {
      recipesTag.appendChild(getRecipeCard(result));
    });

    const ingredients = getIngredients(results);
    displayIngredients(ingredients);

    const appliances = getAppliances(results);
    displayAppliances(appliances);

    const ustensils = getUstensils(results);
    displayUstensils(ustensils);
  }
});

function getIngredients(recipes) {
  const ingredients = recipes.reduce((acc, recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      if (!acc.includes(ingredient.ingredient.toLowerCase())) {
        acc.push(ingredient.ingredient.toLowerCase());
      }
    });
    return acc;
  }, []);

  return ingredients;
}

function getAppliances(recipes) {
  const appliances = recipes.reduce((acc, recipe) => {
    if (!acc.includes(recipe.appliance.toLowerCase())) {
      acc.push(recipe.appliance.toLowerCase());
    }
    return acc;
  }, []);

  return appliances;
}

function getUstensils(recipes) {
  const ustensils = recipes.reduce((acc, recipe) => {
    if(typeof recipe.ustensils === 'object') {
      recipe.ustensils.forEach((ustensil) => {
        if (!acc.includes(ustensil.toLowerCase())) {
          acc.push(ustensil.toLowerCase());
        }
      });
    } else {
      acc.push(recipe.ustensils.toLowerCase());
    }
    return acc;
  }, []);

  return ustensils;
}

function displayIngredients(ingredients) {
  const ingredientsTag = document.querySelector(".ingredients .filter__list");
  ingredientsTag.innerHTML = "";
  ingredients.forEach((ingredient) => {
    const ingredientTag = document.createElement("li");
    ingredientTag.classList.add("filter__item");
    ingredientTag.classList.add("filter__item--blue");
    ingredientTag.innerText = ingredient;
    ingredientsTag.appendChild(ingredientTag);
    ingredientTag.addEventListener("click", (event) => {
      addTag(event.target.innerText, '#3282f7');
    });
  });
}

function displayAppliances(appliances) {
  const appliancesTag = document.querySelector(".appareils .filter__list");
  appliancesTag.innerHTML = "";
  appliances.forEach((appliance) => {
    const applianceTag = document.createElement("li");
    applianceTag.classList.add("filter__item");
    applianceTag.classList.add("filter__item--green");
    applianceTag.innerText = appliance;
    appliancesTag.appendChild(applianceTag);
    applianceTag.addEventListener("click", (event) => {
      addTag(event.target.innerText, '#ed6454');
    });
  });
}

function displayUstensils(ustensils) {
  const ustensilsTag = document.querySelector(".ustensiles .filter__list");
  ustensilsTag.innerHTML = "";
  ustensils.forEach((ustensil) => {
    const ustensilTag = document.createElement("li");
    ustensilTag.classList.add("filter__item");
    ustensilTag.classList.add("filter__item--red");
    ustensilTag.innerText = ustensil;
    ustensilsTag.appendChild(ustensilTag);
    ustensilTag.addEventListener("click", (event) => {
      addTag(event.target.innerText, '#68d9a4');
    });
  });
}


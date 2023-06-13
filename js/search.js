import { recipes } from "../data/recipes.js";
import { getRecipeCard } from "./utils/cards.js";

document.querySelector(".recipes").innerHTML = 
      "Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.";

let search;
let results = [];
const tags = {
  ingredients: [],
  appliances: [],
  ustensils: [],
}

function getResults(search) {
  return recipes.filter((recipe) => {
    const regex = new RegExp(search, "gi");
    return (
      recipe.name.match(regex) ||
      recipe.description.match(regex) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.ingredient.match(regex)
      )
    );
  });
}

function getResultsWithTags() {
  if(results.length) {
    return results.filter((recipe) => {
      if(tags.ingredients.length && !tags.appliances.length && !tags.ustensils.length) {
        if(getResultsWithIngredients(recipe)) {
          return recipe;
        }
      }
      if(tags.ingredients.length && tags.appliances.length && !tags.ustensils.length) {
        if(getResultsWithIngredients(recipe) && getResultsWithAppliances(recipe)) {
          return recipe;
        }
      }
      if(tags.ingredients.length  && tags.ustensils.length && !tags.appliances.length) {
        if(getResultsWithIngredients(recipe) && getResultsWithUstensils(recipe)) {
          return recipe;
        }
      }
      if(tags.appliances.length && !tags.ingredients.length && !tags.ustensils.length) {
        if(getResultsWithAppliances(recipe)) {
          return recipe;
        }
      }
      if(tags.appliances.length && tags.ustensils.length && !tags.ingredients.length) {
        if(getResultsWithAppliances(recipe) && getResultsWithUstensils(recipe)) {
          return recipe;
        }
      }
      if(tags.ustensils.length && !tags.ingredients.length && !tags.appliances.length) {
        if(getResultsWithUstensils(recipe)) {
          return recipe;
        }
      }
      if(tags.ingredients.length && tags.appliances.length && tags.ustensils.length) {
        if(getResultsWithIngredients(recipe) && getResultsWithAppliances(recipe) && getResultsWithUstensils(recipe)) {
          return recipe;
        }
      }
    });
  }
}

function getResultsWithIngredients(recipe) {
  if(tags.ingredients.length) {
    return tags.ingredients.every((ingredient) => {
      const formattedIngredients = recipe.ingredients.map((ingredient) => {
        return ingredient.ingredient.toLowerCase();
      });
      return formattedIngredients.includes(ingredient.toLowerCase());
    });
  }
}

function getResultsWithAppliances(recipe) {
  return tags.appliances.every((appliance) => {
    const formattedAppliance = recipe.appliance.toLowerCase();
    return formattedAppliance === appliance.toLowerCase();
  });
}

function getResultsWithUstensils(recipe) {
  return tags.ustensils.every((ustensil) => {
    const formattedUstensils = recipe.ustensils.map((ustensil) => {
      return ustensil.toLowerCase();
    });
    return formattedUstensils.includes(ustensil.toLowerCase());
  });
}

function reRenderResults() {
  document.querySelector(".recipes").innerHTML = null;
  if(!results.length) {
    document.querySelector(".recipes").innerHTML = 
      "Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.";
  }
  results.forEach((result) => {
    document.querySelector(".recipes").appendChild(getRecipeCard(result));
  });
  displayTags();
}

function displayTags() {
  displayIngredients(getIngredients(results));
  displayAppliances(getAppliances(results));
  displayUstensils(getUstensils(results));
}

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
  ingredientsTag.innerHTML = null;
  ingredients.forEach((ingredient) => {
    const capitalizedIngredient = ingredient.charAt(0).toUpperCase() +
      ingredient.slice(1);
    if (tags.ingredients.includes(capitalizedIngredient)) {
      return;
    }
    const ingredientTag = document.createElement("li");
    ingredientTag.classList.add("filter__item");
    ingredientTag.classList.add("filter__item--blue");
    ingredientTag.innerText = capitalizedIngredient;
    ingredientsTag.appendChild(ingredientTag);
    ingredientTag.addEventListener("click", (event) => {
      addTag(event.target.innerText, '#3282f7', tags.ingredients);
      tags.ingredients.push(event.target.innerText);
      results = getResultsWithTags();
      reRenderResults();
      Array.from(ingredientsTag.children).forEach((child) => {
        if(child.innerText === event.target.innerText) {
          child.remove();
        }
      });
    });
  });
}

function displayAppliances(appliances) {
  const appliancesTag = document.querySelector(".appareils .filter__list");
  appliancesTag.innerHTML = null;
  appliances.forEach((appliance) => {
    const applianceTag = document.createElement("li");
    applianceTag.classList.add("filter__item");
    applianceTag.classList.add("filter__item--green");
    const capitalizedAppliance = appliance.charAt(0).toUpperCase() +
      appliance.slice(1);
    applianceTag.innerText = capitalizedAppliance;
    appliancesTag.appendChild(applianceTag);
    applianceTag.addEventListener("click", (event) => {
      addTag(event.target.innerText, '#68d9a4', tags.appliances);
      tags.appliances.push(event.target.innerText);
      results = getResultsWithTags();
      reRenderResults();
    });
  });
}

function displayUstensils(ustensils) {
  const ustensilsTag = document.querySelector(".ustensiles .filter__list");
  ustensilsTag.innerHTML = null;
  ustensils.forEach((ustensil) => {
    const ustensilTag = document.createElement("li");
    ustensilTag.classList.add("filter__item");
    ustensilTag.classList.add("filter__item--red");
    const capitalizedUstensil = ustensil.charAt(0).toUpperCase() +
      ustensil.slice(1);
    ustensilTag.innerText = capitalizedUstensil;
    ustensilsTag.appendChild(ustensilTag);
    ustensilTag.addEventListener("click", (event) => {
      addTag(event.target.innerText, '#ed6454', tags.ustensils);
      tags.ustensils.push(event.target.innerText);
      results = getResultsWithTags();
      reRenderResults();
    });
  });
}

document.querySelector(".search__main").addEventListener("input", (event) => {
  search = event.target.value;

  document.querySelector(".recipes").innerHTML = null;
  
  if (search.length > 2) {
    results = getResults(search);
    reRenderResults();
  } else {
    results = [];
    document.querySelectorAll(".filter__list").forEach((list) => {
      list.innerHTML = null;
    });
    document.querySelector(".recipes").innerHTML = 
      "Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.";
  }
  
});

function addTag(tagContent, color, currentTags) {
  const tagsContainer = document.querySelector(".search__tags");
  const tag = document.createElement("div");
  const tagCrossIcon = document.createElement("img");

  tagsContainer.style.display = "flex";
  tag.classList.add("tag");
  tag.innerHTML = tagContent;
  tag.style.backgroundColor = color;
  tagCrossIcon.classList.add("tag__icon");
  tagCrossIcon.setAttribute("src", "./assets/icons/cross.svg");

  tagCrossIcon.addEventListener("click", (event) => {
    removeTag(event, currentTags);
    results = getResults(search);
    if(!document.querySelector(".search__tags").innerHTML) {
      document.querySelector(".search__tags").style.display = "none";
    } else {
      results = getResultsWithTags();
    }
    reRenderResults();
  });

  tag.appendChild(tagCrossIcon);
  tagsContainer.appendChild(tag);
}

function removeTag(event, currentTags) {
  event.target.parentNode.remove();
  const indexOfTag = currentTags.indexOf(event.target.parentNode.innerText);
  currentTags.splice(indexOfTag, 1);
}
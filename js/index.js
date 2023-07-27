import { recipes } from "../data/recipes.js";

import getTargetInfos from "./utils/getTargetInfos.js";
import getRecipeCard from "./utils/getRecipeCard.js";

const state = {
  search: "",
  results: [],
  tags: {
    ingredients: [],
    appliances: [],
    ustensils: [],
  },
};

let { search, results, tags } = state;

function getResults(search) {
  const isSearchValid = search && search.length > 2;
  const isThereTags = [
    ...tags.ingredients,
    ...tags.appliances,
    ...tags.ustensils,
  ].length;

  if (!isSearchValid && !isThereTags) {
    return [];
  }
  if (isSearchValid && isThereTags) {
    return getResultsWithSearchAndTags(search);
  }
  if (isSearchValid && !isThereTags) {
    return getResultsWithOnlySearch(search);
  }
  if (!isSearchValid && isThereTags) {
    return getResultsWithOnlyTags();
  }
}

function getResultsWithOnlySearch(search) {
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

function getResultsWithSearchAndTags(search) {
  results = getResultsWithOnlySearch(search);

  return results.filter((recipe) => {
    if (
      tags.ingredients.length &&
      !tags.appliances.length &&
      !tags.ustensils.length
    ) {
      if (areIngredientsInRecipe(recipe)) {
        return recipe;
      }
    }
    if (
      tags.ingredients.length &&
      tags.appliances.length &&
      !tags.ustensils.length
    ) {
      if (areIngredientsInRecipe(recipe) && areAppliancesInRecipe(recipe)) {
        return recipe;
      }
    }
    if (
      tags.ingredients.length &&
      tags.ustensils.length &&
      !tags.appliances.length
    ) {
      if (areIngredientsInRecipe(recipe) && areUstensilsInRecipe(recipe)) {
        return recipe;
      }
    }
    if (
      tags.appliances.length &&
      !tags.ingredients.length &&
      !tags.ustensils.length
    ) {
      if (areAppliancesInRecipe(recipe)) {
        return recipe;
      }
    }
    if (
      tags.appliances.length &&
      tags.ustensils.length &&
      !tags.ingredients.length
    ) {
      if (areAppliancesInRecipe(recipe) && areUstensilsInRecipe(recipe)) {
        return recipe;
      }
    }
    if (
      tags.ustensils.length &&
      !tags.ingredients.length &&
      !tags.appliances.length
    ) {
      if (areUstensilsInRecipe(recipe)) {
        return recipe;
      }
    }
    if (
      tags.ingredients.length &&
      tags.appliances.length &&
      tags.ustensils.length
    ) {
      if (
        areIngredientsInRecipe(recipe) &&
        areAppliancesInRecipe(recipe) &&
        areUstensilsInRecipe(recipe)
      ) {
        return recipe;
      }
    }
  });
}

function areIngredientsInRecipe(recipe) {
  return tags.ingredients.every((ingredient) => {
    const formattedIngredients = recipe.ingredients.map((ingredient) => {
      return ingredient.ingredient.toLowerCase();
    });
    return formattedIngredients.includes(ingredient.toLowerCase());
  });
}

function areAppliancesInRecipe(recipe) {
  return tags.appliances.every((appliance) => {
    const formattedAppliance = recipe.appliance.toLowerCase();
    return formattedAppliance === appliance.toLowerCase();
  });
}

function areUstensilsInRecipe(recipe) {
  return tags.ustensils.every((ustensil) => {
    const formattedUstensils = recipe.ustensils.map((ustensil) => {
      return ustensil.toLowerCase();
    });
    return formattedUstensils.includes(ustensil.toLowerCase());
  });
}

function getResultsWithOnlyTags() {
  const resultsWithOnlyIngredients = getResultsWithOnlyIngredients(recipes);
  const resultsWithOnlyAppliances = getResultsWithOnlyAppliances(recipes);
  const resultsWithOnlyUstensils = getResultsWithOnlyUstensils(recipes);

  const provisionalResults = [];

  if (resultsWithOnlyIngredients.length) {
    resultsWithOnlyIngredients.forEach((recipe) => {
      provisionalResults.push({ ...recipe, foundBy: "ingredients" });
    });
  }
  if (resultsWithOnlyAppliances.length) {
    resultsWithOnlyAppliances.forEach((recipe) => {
      provisionalResults.push({ ...recipe, foundBy: "appliances" });
    });
  }
  if (resultsWithOnlyUstensils.length) {
    resultsWithOnlyUstensils.forEach((recipe) => {
      provisionalResults.push({ ...recipe, foundBy: "ustensils" });
    });
  }

  const typeOfFirstResult = provisionalResults[0].foundBy;
  const isThereOneTypeOfResult = provisionalResults.every((recipe) => {
    return recipe.foundBy === typeOfFirstResult;
  });

  if (isThereOneTypeOfResult) return provisionalResults;

  return provisionalResults.reduce((acc, recipe, index, array) => {
    let count = 0;

    array.forEach((element) => {
      element.id === recipe.id && count++;
    });

    if (count > 1) {
      const isThereRecipeAlreadyInAcc = acc.some((element) => {
        return element.id === recipe.id;
      });
      if (!isThereRecipeAlreadyInAcc) {
        acc.push(recipe);
      }
    }

    return acc;
  }, []);
}

function getResultsWithOnlyIngredients(recipes) {
  if (tags.ingredients.length) {
    return recipes.filter((recipe) => areIngredientsInRecipe(recipe));
  }
  return [];
}

function getResultsWithOnlyAppliances(recipes) {
  if (tags.appliances.length) {
    return recipes.filter((recipe) => areAppliancesInRecipe(recipe));
  }
  return [];
}

function getResultsWithOnlyUstensils(recipes) {
  if (tags.ustensils.length) {
    return recipes.filter((recipe) => areUstensilsInRecipe(recipe));
  }
  return [];
}

function getIngredients(recipes) {
  return recipes.reduce((acc, recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      if (!acc.includes(ingredient.ingredient.toLowerCase())) {
        acc.push(ingredient.ingredient.toLowerCase());
      }
    });
    return acc;
  }, []);
}

function getAppliances(recipes) {
  return recipes.reduce((acc, recipe) => {
    if (!acc.includes(recipe.appliance.toLowerCase())) {
      acc.push(recipe.appliance.toLowerCase());
    }
    return acc;
  }, []);
}

function getUstensils(recipes) {
  return recipes.reduce((acc, recipe) => {
    if (typeof recipe.ustensils === "object") {
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
}

function render() {
  renderListItems();
  renderResults();
}

function renderListItems() {
  renderIngredientsListItems(getIngredients(results));
  renderAppliancesListItems(getAppliances(results));
  renderUstensilsListItems(getUstensils(results));
}

function renderResults() {
  document.querySelector(".recipes").innerHTML = null;

  results.forEach((result) => {
    document.querySelector(".recipes").appendChild(getRecipeCard(result));
  });
}

function renderIngredientsListItems(ingredients) {
  const ingredientsTag = document.querySelector(".ingredients .filter__list");
  ingredientsTag.innerHTML = null;

  if (results.length === 1 || !ingredients.length) {
    return;
  }

  ingredients.forEach((ingredient) => {
    const capitalizedIngredient =
      ingredient.charAt(0).toUpperCase() + ingredient.slice(1);

    if (tags.ingredients.includes(capitalizedIngredient)) {
      return;
    }

    const ingredientTag = document.createElement("li");
    ingredientTag.classList.add("filter__item");
    ingredientTag.classList.add("filter__item--blue");
    ingredientTag.innerText = capitalizedIngredient;
    ingredientsTag.appendChild(ingredientTag);

    ingredientTag.addEventListener("click", (event) => {
      addTag(event.target.innerText, "#3282f7", tags.ingredients);
      results = getResults(search);
      render();
      removeListItemWhenAdded(ingredientsTag, event.target.innerText);
    });
  });
}

function renderAppliancesListItems(appliances) {
  const appliancesTag = document.querySelector(".appareils .filter__list");
  appliancesTag.innerHTML = null;

  if (results.length === 1 || !appliances.length) {
    return;
  }

  appliances.forEach((appliance) => {
    const capitalizedAppliance =
      appliance.charAt(0).toUpperCase() + appliance.slice(1);

    if (tags.appliances.includes(capitalizedAppliance)) {
      return;
    }

    const applianceTag = document.createElement("li");
    applianceTag.classList.add("filter__item");
    applianceTag.classList.add("filter__item--green");
    applianceTag.innerText = capitalizedAppliance;
    appliancesTag.appendChild(applianceTag);

    applianceTag.addEventListener("click", (event) => {
      addTag(event.target.innerText, "#68d9a4", tags.appliances);
      results = getResults(search);
      render();
      removeListItemWhenAdded(appliancesTag, event.target.innerText);
    });
  });
}

function renderUstensilsListItems(ustensils) {
  const ustensilsTag = document.querySelector(".ustensiles .filter__list");
  ustensilsTag.innerHTML = null;

  if (results.length === 1 || !ustensils.length) {
    return;
  }

  ustensils.forEach((ustensil) => {
    const capitalizedUstensil =
      ustensil.charAt(0).toUpperCase() + ustensil.slice(1);

    if (tags.ustensils.includes(capitalizedUstensil)) {
      return;
    }

    const ustensilTag = document.createElement("li");
    ustensilTag.classList.add("filter__item");
    ustensilTag.classList.add("filter__item--red");
    ustensilTag.innerText = capitalizedUstensil;
    ustensilsTag.appendChild(ustensilTag);

    ustensilTag.addEventListener("click", (event) => {
      addTag(event.target.innerText, "#ed6454", tags.ustensils);
      results = getResults(search);
      render();
      removeListItemWhenAdded(ustensilsTag, event.target.innerText);
    });
  });
}

function removeListItemWhenAdded(list, listItem) {
  Array.from(list.children).forEach((child) => {
    if (child.innerText === listItem) {
      child.remove();
    }
  });
}

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
    render();
    if (!document.querySelector(".search__tags").innerHTML) {
      document.querySelector(".search__tags").style.display = "none";
    }
  });

  tag.appendChild(tagCrossIcon);
  tagsContainer.appendChild(tag);
  currentTags.push(tagContent);
}

function removeTag(event, currentTags) {
  event.target.parentNode.remove();
  const indexOfTag = currentTags.indexOf(event.target.parentNode.innerText);
  currentTags.splice(indexOfTag, 1);
}

/////

function inputToOriginalState(event) {
  const { filterTag, input, placeholder } = getTargetInfos(event);

  input.removeAttribute("readonly");

  event.target.value = "";
  event.target.style.opacity = "1";
  event.target.style.width = `100%`;

  filterTag.style.width = `190px`;
  filterTag.style.borderRadius = "5px";
  input.setAttribute("placeholder", placeholder);
}

function inputToFocusState(event) {
  const { filterTag, input, list, focusedPlaceholder } = getTargetInfos(event);

  if (search) {
    input.setAttribute("readonly", true);
  }

  event.target.style.width = "300px";
  event.target.style.opacity = ".5";

  filterTag.style.width = "300px";
  filterTag.style.borderRadius = "5px";
  input.setAttribute("placeholder", focusedPlaceholder);

  if (list.innerHTML && event.target.value.length > 2) {
    displayList(event);
  }
}

function displayList(event) {
  const { filterTag, list, focusedPlaceholder, dropdownIcon } =
    getTargetInfos(event);

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

  dropdownIcon.style.transform = "rotate(180deg)";
}

function hideList(event) {
  const { filterTag, list, dropdownIcon } = getTargetInfos(event);

  filterTag.style.borderRadius = "5px";
  list.style.opacity = "0";
  list.style.display = "grid";
  list.style.width = "unset";
  // list.style.left = "-9999px";
  dropdownIcon.style.transform = "rotate(0deg)";
}

/////

document.querySelector(".search__main").addEventListener("input", (event) => {
  search = event.target.value;
  results = getResults(search);
  render();
});

document.querySelectorAll(".filter__input").forEach((input) => {
  input.addEventListener("input", (event) => {
    event.target.value
      ? (event.target.style.opacity = "1")
      : (event.target.style.opacity = ".5");

    const search = event.target.value;
    if (search.length > 2) {
      switch (input.name) {
        case "ingredients":
          const ingredients = getIngredients(recipes);
          const filteredIngredients = ingredients.filter((ingredient) => {
            const regex = new RegExp(search, "gi");
            return ingredient.match(regex);
          });
          renderIngredientsListItems(filteredIngredients);
          displayList(event);
          break;
        case "appareils":
          const appliances = getAppliances(recipes);
          const filteredAppliances = appliances.filter((appliance) => {
            const regex = new RegExp(search, "gi");
            return appliance.match(regex);
          });
          renderAppliancesListItems(filteredAppliances);
          displayList(event);
          break;
        case "ustensiles":
          const ustensils = getUstensils(recipes);
          const filteredUstensils = ustensils.filter((ustensil) => {
            const regex = new RegExp(search, "gi");
            return ustensil.match(regex);
          });
          renderUstensilsListItems(filteredUstensils);
          displayList(event);
          break;
      }
    } else {
      switch (input.name) {
        case "ingredients":
          tags.ingredients = [];
          hideList(event);
          break;
        case "appareils":
          tags.appliances = [];
          hideList(event);
          break;
        case "ustensiles":
          tags.ustensils = [];
          hideList(event);
          break;
      }
    }
  });
  input.addEventListener("focus", (event) => inputToFocusState(event));
  input.addEventListener("blur", (event) => {
    hideList(event);
    inputToOriginalState(event);
  });
});

import { recipes } from "../data/recipes.js";
import { getRecipeCard } from "./utils/cards.js";

let search;
let results = [];
const tags = {
  ingredients: [],
  appliances: [],
  ustensils: [],
};

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
      if (getResultsWithIngredients(recipe)) {
        return recipe;
      }
    }
    if (
      tags.ingredients.length &&
      tags.appliances.length &&
      !tags.ustensils.length
    ) {
      if (
        getResultsWithIngredients(recipe) &&
        getResultsWithAppliances(recipe)
      ) {
        return recipe;
      }
    }
    if (
      tags.ingredients.length &&
      tags.ustensils.length &&
      !tags.appliances.length
    ) {
      if (
        getResultsWithIngredients(recipe) &&
        getResultsWithUstensils(recipe)
      ) {
        return recipe;
      }
    }
    if (
      tags.appliances.length &&
      !tags.ingredients.length &&
      !tags.ustensils.length
    ) {
      if (getResultsWithAppliances(recipe)) {
        return recipe;
      }
    }
    if (
      tags.appliances.length &&
      tags.ustensils.length &&
      !tags.ingredients.length
    ) {
      if (getResultsWithAppliances(recipe) && getResultsWithUstensils(recipe)) {
        return recipe;
      }
    }
    if (
      tags.ustensils.length &&
      !tags.ingredients.length &&
      !tags.appliances.length
    ) {
      if (getResultsWithUstensils(recipe)) {
        return recipe;
      }
    }
    if (
      tags.ingredients.length &&
      tags.appliances.length &&
      tags.ustensils.length
    ) {
      if (
        getResultsWithIngredients(recipe) &&
        getResultsWithAppliances(recipe) &&
        getResultsWithUstensils(recipe)
      ) {
        return recipe;
      }
    }
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
    console.log(count);
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

function getResultsWithIngredients(recipe) {
  return tags.ingredients.every((ingredient) => {
    const formattedIngredients = recipe.ingredients.map((ingredient) => {
      return ingredient.ingredient.toLowerCase();
    });
    return formattedIngredients.includes(ingredient.toLowerCase());
  });
}

function getResultsWithOnlyIngredients(recipes) {
  if (tags.ingredients.length) {
    return recipes.filter((recipe) => {
      return tags.ingredients.every((ingredient) => {
        const formattedIngredients = recipe.ingredients.map((ingredient) => {
          return ingredient.ingredient.toLowerCase();
        });
        return formattedIngredients.includes(ingredient.toLowerCase());
      });
    });
  }
  return [];
}

function getResultsWithAppliances(recipe) {
  return tags.appliances.every((appliance) => {
    const formattedAppliance = recipe.appliance.toLowerCase();
    return formattedAppliance === appliance.toLowerCase();
  });
}

function getResultsWithOnlyAppliances(recipes) {
  if (tags.appliances.length) {
    return recipes.filter((recipe) => {
      return tags.appliances.every((appliance) => {
        const formattedAppliance = recipe.appliance.toLowerCase();
        return formattedAppliance === appliance.toLowerCase();
      });
    });
  }
  return [];
}

function getResultsWithUstensils(recipe) {
  return tags.ustensils.every((ustensil) => {
    const formattedUstensils = recipe.ustensils.map((ustensil) => {
      return ustensil.toLowerCase();
    });
    return formattedUstensils.includes(ustensil.toLowerCase());
  });
}

function getResultsWithOnlyUstensils(recipes) {
  if (tags.ustensils.length) {
    return recipes.filter((recipe) => {
      return tags.ustensils.every((ustensil) => {
        const formattedUstensils = recipe.ustensils.map((ustensil) => {
          return ustensil.toLowerCase();
        });
        return formattedUstensils.includes(ustensil.toLowerCase());
      });
    });
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
  renderIngredientsListItems(getIngredients(results));
  renderAppliancesListItems(getAppliances(results));
  renderUstensilsListItems(getUstensils(results));
  renderResults();
}

function renderResults() {
  document.querySelector(".recipes").innerHTML = null;

  results.forEach((result) => {
    document.querySelector(".recipes").appendChild(getRecipeCard(result));
  });
}

function removeListItem(list, listItem) {
  Array.from(list.children).forEach((child) => {
    if (child.innerText === listItem) {
      child.remove();
    }
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
      removeListItem(ingredientsTag, event.target.innerText);
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
      removeListItem(appliancesTag, event.target.innerText);
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
      removeListItem(ustensilsTag, event.target.innerText);
    });
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

document.querySelector(".search__main").addEventListener("input", (event) => {
  search = event.target.value;
  results = getResults(search);
  render();
});

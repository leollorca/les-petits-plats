import { recipes } from "../data/recipes.js";

import createHtmlTag from "./utils/createHtmlTag.js";
import getRecipeCard from "./utils/getRecipeCard.js";
import getTargetInfos from "./utils/getTargetInfos.js";

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

  if (!isSearchValid && !isThereTags) return [];
  if (isSearchValid && isThereTags) return getResultsWithSearchAndTags(search);
  if (isSearchValid && !isThereTags) return getResultsWithOnlySearch(search);
  if (!isSearchValid && isThereTags) return getResultsWithOnlyTags();
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

    array.forEach((element) => element.id === recipe.id && count++);

    if (count > 1) {
      const isThereRecipeAlreadyInAcc = acc.some((element) => {
        return element.id === recipe.id;
      });

      if (!isThereRecipeAlreadyInAcc) acc.push(recipe);
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
  renderListItems("ingredients", getIngredients(results));
  renderListItems("appareils", getAppliances(results));
  renderListItems("ustensiles", getUstensils(results));

  document.querySelector(".recipes").innerHTML = null;
  results.forEach((result) => {
    document.querySelector(".recipes").appendChild(getRecipeCard(result));
  });
}

function renderListItems(name, items) {
  let { color, list } = getTargetInfos(name);

  list.innerHTML = null;

  if (results.length === 1 || !items.length) return;

  items.forEach((item) => {
    const capitalizedItem = item.charAt(0).toUpperCase() + item.slice(1);

    switch (name) {
      case "ingredients":
        if (tags.ingredients.includes(capitalizedItem)) return;
        break;
      case "appareils":
        if (tags.appliances.includes(capitalizedItem)) return;
        break;
      case "ustensiles":
        if (tags.ustensils.includes(capitalizedItem)) return;
    }

    const itemTag = createHtmlTag(
      "li",
      { class: "filter__item" },
      null,
      capitalizedItem
    );
    list.appendChild(itemTag);

    itemTag.addEventListener("click", (event) => {
      switch (name) {
        case "ingredients":
          addTag(event.target.innerText, color, tags.ingredients);
          break;
        case "appareils":
          addTag(event.target.innerText, color, tags.appliances);
          break;
        case "ustensiles":
          addTag(event.target.innerText, color, tags.ustensils);
      }

      results = getResults(search);
      render();
      removeListItemWhenAdded(list, event.target.innerText);
    });
  });
}

function removeListItemWhenAdded(list, listItem) {
  Array.from(list.children).forEach((child) => {
    if (child.innerText === listItem) child.remove();
  });
}

function addTag(tagContent, color, currentTags) {
  const tagCrossIcon = createHtmlTag("img", {
    class: "tag__icon",
    src: "./assets/icons/cross.svg",
  });

  tagCrossIcon.addEventListener("click", (event) => {
    removeTag(event, currentTags);
    results = getResults(search);
    render();
    if (!document.querySelector(".search__tags").innerHTML) {
      document.querySelector(".search__tags").style.display = "none";
    }
  });

  const tagsContainer = document.querySelector(".search__tags");
  tagsContainer.appendChild(
    createHtmlTag(
      "div",
      { class: "tag", style: `background:${color};` },
      null,
      tagContent,
      tagCrossIcon
    )
  );
  tagsContainer.style.display = "flex";

  currentTags.push(tagContent);
}

function removeTag(event, currentTags) {
  event.target.parentNode.remove();
  const indexOfTag = currentTags.indexOf(event.target.parentNode.innerText);
  currentTags.splice(indexOfTag, 1);
}

/////

function inputToOriginalState(event) {
  const { filterTag, input, placeholder } = getTargetInfos(event.target.name);

  input.removeAttribute("readonly");

  event.target.value = "";
  event.target.style.opacity = "1";
  event.target.style.width = `100%`;

  filterTag.style.width = `190px`;
  filterTag.style.borderRadius = "5px";
  input.setAttribute("placeholder", placeholder);
}

function inputToFocusState(event) {
  const { filterTag, input, list, focusedPlaceholder } = getTargetInfos(
    event.target.name
  );

  if (search) input.setAttribute("readonly", true);

  event.target.style.width = "300px";
  event.target.style.opacity = ".5";

  filterTag.style.width = "300px";
  filterTag.style.borderRadius = "5px";
  input.setAttribute("placeholder", focusedPlaceholder);

  if (!event.target.value && !search && !results.length) return;

  displayList(event);
}

function displayList(event) {
  const { filterTag, list, focusedPlaceholder, dropdownIcon } = getTargetInfos(
    event.target.name
  );

  if (!list.children.length) return;

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

    filterTag.style.width = "300px";
    event.target.style.width = "300px";
  }

  list.children.length > 40
    ? (list.style.gridTemplateRows = "repeat(20, 1fr)")
    : (list.style.gridTemplateRows = "repeat(10, 1fr)");

  event.target.setAttribute("placeholder", focusedPlaceholder);

  dropdownIcon.style.transform = "rotate(180deg)";
}

function hideList(event) {
  const { filterTag, list, dropdownIcon } = getTargetInfos(event.target.name);

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
    const search = event.target.value;

    search
      ? (event.target.style.opacity = "1")
      : (event.target.style.opacity = ".5");

    let { getMethod } = getTargetInfos(event.target.name);

    if (search.length > 2) {
      switch (input.name) {
        case "ingredients":
          getMethod = getIngredients;
          break;
        case "appareils":
          getMethod = getAppliances;
          break;
        case "ustensiles":
          getMethod = getUstensils;
          break;
      }

      const filteredResults = getMethod(recipes).filter((result) => {
        const regex = new RegExp(search, "gi");
        return result.match(regex);
      });

      renderListItems(event.target.name, filteredResults);
      displayList(event);
    } else {
      hideList(event);
    }
  });
  input.addEventListener("focus", (event) => inputToFocusState(event));
  input.addEventListener("blur", (event) => {
    hideList(event);
    inputToOriginalState(event);
  });
});

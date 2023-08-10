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

  if (isSearchValid && isThereTags)
    return getResultsWithOnlySearch(search, getResultsWithOnlyTags());

  if (isSearchValid && !isThereTags)
    return getResultsWithOnlySearch(search, recipes);

  if (!isSearchValid && isThereTags) return getResultsWithOnlyTags();
}

function getResultsWithOnlySearch(search, recipes) {
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

function getResultsWithOnlyTags() {
  const resultsWithOnly = {
    ingredients: getResultsWithOnlyIngredients(recipes),
    appliances: getResultsWithOnlyAppliances(recipes),
    ustensils: getResultsWithOnlyUstensils(recipes),
  };

  const provisionalResults = [];

  for (const result in resultsWithOnly) {
    resultsWithOnly[result].forEach((recipe) => {
      provisionalResults.push({ ...recipe, foundBy: result });
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
  renderListItems("appliances", getAppliances(results));
  renderListItems("ustensils", getUstensils(results));

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

    for (const tag in tags) {
      if (tag === name) {
        if (tags[tag].includes(capitalizedItem)) return;

        const itemTag = createHtmlTag(
          "li",
          { class: "filter__item" },
          null,
          capitalizedItem
        );

        list.appendChild(itemTag);

        itemTag.addEventListener("mousedown", () => {
          addTag(capitalizedItem, color, tags[name]);
          results = getResults(search);
          render();
          removeListItemAlreadyChosen(list, capitalizedItem);
        });
      }
    }
  });
}

function removeListItemAlreadyChosen(list, listItem) {
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

function inputToOriginalState(name) {
  const { filterTag, input, placeholder } = getTargetInfos(name);

  input.removeAttribute("readonly");

  input.value = "";
  input.style.opacity = "1";
  input.style.width = `100%`;

  filterTag.style.width = `190px`;
  filterTag.style.borderRadius = "5px";
  input.setAttribute("placeholder", placeholder);

  hideList(name);
}

function inputToFocusState(name) {
  const { filterTag, input, focusedPlaceholder } = getTargetInfos(name);

  if (search) input.setAttribute("readonly", true);

  input.style.width = "300px";
  input.style.opacity = ".5";

  filterTag.style.width = "300px";
  filterTag.style.borderRadius = "5px";
  input.setAttribute("placeholder", focusedPlaceholder);

  if (!input.value && !search && !results.length) return;

  displayList(input.name);
}

function displayList(name) {
  const { filterTag, list, input, focusedPlaceholder, dropdownIcon } =
    getTargetInfos(name);

  if (!list.children.length) return;

  filterTag.style.borderRadius = "5px 5px 0 0";

  if (list.children.length > 10) {
    list.style.display = "inline-grid";

    const accurateListWidth = list.getBoundingClientRect().width;
    filterTag.style.width = `${accurateListWidth}px`;
    input.style.width = `${accurateListWidth}px`;

    list.children.length > 40
      ? (list.style.gridTemplateRows = "repeat(20, 1fr)")
      : (list.style.gridTemplateRows = "repeat(10, 1fr)");
  } else {
    list.style.display = "block";
    list.style.width = "300px";

    Array.from(list.children).forEach((child) => {
      child.style.width = "100%";
    });

    filterTag.style.width = "300px";
    input.style.width = "300px";
  }

  input.setAttribute("placeholder", focusedPlaceholder);

  dropdownIcon.style.transform = "rotate(180deg)";
}

function hideList(name) {
  const { filterTag, list, dropdownIcon } = getTargetInfos(name);

  filterTag.style.borderRadius = "5px";
  list.style.display = "none";
  list.style.width = "unset";
  dropdownIcon.style.transform = "rotate(0deg)";
}

/////

document.querySelector(".search__main").addEventListener("input", (event) => {
  search = event.target.value;
  results = getResults(search);
  render();
});

document.querySelectorAll(".filter__input").forEach((input) => {
  input.addEventListener("input", () => {
    input.value ? (input.style.opacity = "1") : (input.style.opacity = ".5");

    let getMethod;

    if (input.value.length > 2) {
      switch (input.name) {
        case "ingredients":
          getMethod = getIngredients;
          break;
        case "appliances":
          getMethod = getAppliances;
          break;
        case "ustensils":
          getMethod = getUstensils;
          break;
      }

      const filteredResults = getMethod(recipes).filter((result) => {
        const regex = new RegExp(input.value, "gi");
        return result.match(regex);
      });

      renderListItems(input.name, filteredResults);
      displayList(input.name);
    } else {
      hideList(input.name);
    }
  });
  input.addEventListener("focus", () => inputToFocusState(input.name));
  input.addEventListener("blur", () => inputToOriginalState(input.name));
});

import recipes from "../data/recipes.js";

import createHtmlTag from "./utils/createHtmlTag.js";
import getTargetInfos from "./utils/getTargetInfos.js";

import RecipeCard from "./components/RecipeCard.js";

const UI = {
  recipesTag: document.querySelector(".recipes"),
  tagsContainer: document.querySelector(".search__tags"),
};

const state = {
  search: "",
  results: [],
  tags: {
    ingredients: [],
    appliances: [],
    ustensils: [],
  },
};

function getResults(search) {
  const isSearchValid = search.length > 2;
  const isThereTags = [
    ...state.tags.ingredients,
    ...state.tags.appliances,
    ...state.tags.ustensils,
  ].length;

  if (!isSearchValid && !isThereTags) {
    return [];
  }
  if (isSearchValid && isThereTags) {
    return getResultsWithOnlySearch(search, getResultsWithOnlyTags());
  }
  if (isSearchValid && !isThereTags) {
    return getResultsWithOnlySearch(search, recipes);
  }
  if (!isSearchValid && isThereTags) {
    return getResultsWithOnlyTags();
  }
}

function getResultsWithOnlySearch(search, recipes) {
  return recipes.filter((recipe) => {
    return (
      recipe.name.match(new RegExp(search, "gi")) ||
      recipe.description.match(new RegExp(search, "gi")) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.ingredient.match(new RegExp(search, "gi"))
      )
    );
  });
}

function getResultsWithOnlyTags() {
  const resultsWithOnlyOneTypeOfTag = {
    ingredients: getResultsWithOnlyOneTypeOfTag("ingredients"),
    appliances: getResultsWithOnlyOneTypeOfTag("appliances"),
    ustensils: getResultsWithOnlyOneTypeOfTag("ustensils"),
  };

  const provisionalResults = [];

  for (const type in resultsWithOnlyOneTypeOfTag) {
    resultsWithOnlyOneTypeOfTag[type].forEach((recipe) => {
      provisionalResults.push({ ...recipe, foundBy: type });
    });
  }

  const howManyTypesAreThere = provisionalResults.reduce((types, recipe) => {
    if (!types.includes(recipe.foundBy)) {
      types.push(recipe.foundBy);
    }

    return types;
  }, []);

  if (howManyTypesAreThere.length === 1) {
    return provisionalResults;
  }

  return provisionalResults.reduce((results, recipe) => {
    const checker = howManyTypesAreThere.length === 2 ? 1 : 2;

    const howManyTimesIsIn = provisionalResults.filter(
      (element) => element.id === recipe.id
    ).length;

    if (howManyTimesIsIn > checker) {
      const isAlreadyIn = results.some((element) => element.id === recipe.id);

      if (!isAlreadyIn) {
        results.push(recipe);
      }
    }

    return results;
  }, []);
}

function getResultsWithOnlyOneTypeOfTag(name) {
  return recipes.filter((recipe) => {
    return state.tags[name].every((item) => {
      switch (name) {
        case "ingredients":
          return recipe.ingredients
            .map((ingredient) => ingredient.ingredient.toLowerCase())
            .includes(item.toLowerCase());
        case "appliances":
          return recipe.appliance.toLowerCase() === item.toLowerCase();
        case "ustensils":
          return recipe.ustensils
            .map((ustensil) => ustensil.toLowerCase())
            .includes(item.toLowerCase());
      }
    });
  });
}

function getIngredients(recipes) {
  return recipes.reduce((ingredients, recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      if (!ingredients.includes(ingredient.ingredient.toLowerCase())) {
        ingredients.push(ingredient.ingredient.toLowerCase());
      }
    });

    return ingredients;
  }, []);
}

function getAppliances(recipes) {
  return recipes.reduce((appliances, recipe) => {
    if (!appliances.includes(recipe.appliance.toLowerCase())) {
      appliances.push(recipe.appliance.toLowerCase());
    }

    return appliances;
  }, []);
}

function getUstensils(recipes) {
  return recipes.reduce((ustensils, recipe) => {
    if (typeof recipe.ustensils === "object") {
      recipe.ustensils.forEach((ustensil) => {
        if (!ustensils.includes(ustensil.toLowerCase())) {
          ustensils.push(ustensil.toLowerCase());
        }
      });
    } else {
      ustensils.push(recipe.ustensils.toLowerCase());
    }

    return ustensils;
  }, []);
}

function render() {
  renderListItems("ingredients", getIngredients(state.results));
  renderListItems("appliances", getAppliances(state.results));
  renderListItems("ustensils", getUstensils(state.results));

  UI.recipesTag.innerHTML = null;

  if (state.search.length > 2 && !state.results.length) {
    UI.recipesTag.appendChild(
      createHtmlTag(
        "p",
        { class: "recipes__no-results" },
        `Aucune recette ne contient "<strong>${state.search}</strong>", ` +
          `essayez par exemple «tarte aux pommes », « poisson », etc.`
      )
    );

    return;
  }

  state.results.forEach((result) => {
    UI.recipesTag.appendChild(RecipeCard(result));
  });
}

function renderListItems(name, items) {
  const { color, list } = getTargetInfos(name);

  list.innerHTML = null;

  if (state.results.length === 1 || !items.length) return;

  items.forEach((item) => {
    const capitalizedItem = item.charAt(0).toUpperCase() + item.slice(1);

    for (const tag in state.tags) {
      if (tag === name) {
        if (state.tags[tag].includes(capitalizedItem)) return;

        const itemTag = createHtmlTag(
          "li",
          { class: "filter__item" },
          null,
          capitalizedItem
        );

        list.appendChild(itemTag);

        itemTag.addEventListener("mousedown", () => {
          addTag(capitalizedItem, color, state.tags[name]);
          state.results = getResults(state.search);
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

function addTag(content, color, tags) {
  const tagCrossIcon = createHtmlTag("img", {
    class: "tag__icon",
    src: "./assets/icons/cross.svg",
  });

  tagCrossIcon.addEventListener("click", (event) => {
    removeTag(event, tags);
    state.results = getResults(state.search);
    render();
    if (!UI.tagsContainer.innerHTML) {
      UI.tagsContainer.style.display = "none";
    }
  });

  UI.tagsContainer.appendChild(
    createHtmlTag(
      "div",
      { class: "tag", style: `background:${color};` },
      null,
      content,
      tagCrossIcon
    )
  );
  UI.tagsContainer.style.display = "flex";

  tags.push(content);
}

function removeTag(event, tags) {
  event.target.parentNode.remove();

  const indexOfTag = tags.indexOf(event.target.parentNode.innerText);
  tags.splice(indexOfTag, 1);
}

/////

function inputToOriginalState(name) {
  const { filterTag, input, placeholder } = getTargetInfos(name);

  input.removeAttribute("readonly");
  input.setAttribute("placeholder", placeholder);
  input.value = "";
  input.style.opacity = "1";
  input.style.width = `100%`;

  filterTag.style.width = `190px`;
  filterTag.style.borderRadius = "5px";

  hideList(name);
}

function inputToFocusState(name) {
  const { filterTag, input, focusedPlaceholder } = getTargetInfos(name);

  if (state.search) {
    input.setAttribute("readonly", true);
  }
  input.setAttribute("placeholder", focusedPlaceholder);
  input.style.width = "300px";
  input.style.opacity = ".5";

  filterTag.style.width = "300px";
  filterTag.style.borderRadius = "5px";

  if (!input.value && !state.search && !state.results.length) return;

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

document.querySelector(".search__main").addEventListener("input", (event) => {
  state.search = event.target.value;
  state.results = getResults(state.search);
  render();
});

document.querySelectorAll(".filter__input").forEach((input) => {
  const name = input.name;

  input.addEventListener("input", () => {
    input.value ? (input.style.opacity = "1") : (input.style.opacity = ".5");

    if (input.value.length > 2) {
      let resultsToFilter;

      switch (name) {
        case "ingredients":
          resultsToFilter = getIngredients(recipes);
          break;
        case "appliances":
          resultsToFilter = getAppliances(recipes);
          break;
        case "ustensils":
          resultsToFilter = getUstensils(recipes);
          break;
      }

      const filteredResults = resultsToFilter.filter((result) => {
        return result.match(new RegExp(input.value, "gi"));
      });

      renderListItems(name, filteredResults);
      displayList(name);
    } else {
      hideList(name);
    }
  });
  input.addEventListener("focus", () => inputToFocusState(name));
  input.addEventListener("blur", () => inputToOriginalState(name));
});

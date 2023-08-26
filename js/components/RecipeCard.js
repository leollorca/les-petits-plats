import createHtmlTag from "../utils/createHtmlTag.js";

export default function RecipeCard(recipe) {
  const { name, ingredients, time, description, image } = recipe;

  const ingredientsList = ingredients.map((ingredient) => {
    const quantity = ingredient.quantity ? `: ${ingredient.quantity}` : "";
    const unit = ingredient.unit ? `${ingredient.unit}` : "";
    return `<li><strong>${ingredient.ingredient}</strong>${quantity} ${unit}</li>`;
  });

  const cardContent = `
    <img class="recipe__img" src="../assets/images/${image}" alt="${name}"/>
    <div class="recipe__description">
      <div class="recipe__description__top">
        <h2>${name}</h2>
        <span class="time">
          <img src="../assets/icons/montre.svg" alt="chronomètre"/>
          ${time} min
        </span>
      </div>
      <div class="recipe__description__bottom">
        <ul>${ingredientsList.join("")}</ul>
        <p>${description}</p>
      </div>
    </div>
  `;

  return createHtmlTag("li", { class: "recipe" }, cardContent);
}

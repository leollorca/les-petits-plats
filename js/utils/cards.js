const getRecipeCard = (recipe) => {
  const { name, ingredients, time, description } = recipe;

  const card = document.createElement("li");
  const img = document.createElement("div");
  const descriptionContainer = document.createElement("div");
  const topDescriptionPart = document.createElement("div");
  const bottomDescriptionPart = document.createElement("div");
  const nameTag = document.createElement("h2");
  const timeTag = document.createElement("span");
  const timeIcon = document.createElement("img");
  const ingredientsTag = document.createElement("ul");
  const descriptionTag = document.createElement("p");

  card.classList.add("recipe");
  img.classList.add("recipe__img");
  descriptionContainer.classList.add("recipe__description");
  topDescriptionPart.classList.add("recipe__description__top");
  bottomDescriptionPart.classList.add("recipe__description__bottom");
  timeTag.classList.add("time");

  nameTag.innerText = name;
  timeIcon.setAttribute("src", "./assets/icons/montre.svg");
  timeTag.innerText = `${time} min`;
  timeTag.prepend(timeIcon);
  ingredients.forEach((ingredient) => {
    const ingredientTag = document.createElement("li");
    const quantity = ingredient.quantity ? `: ${ingredient.quantity}` : "";
    const unit = ingredient.unit ? `${ingredient.unit}` : "";
    ingredientTag.innerHTML = `<strong>${ingredient.ingredient}</strong>${quantity} ${unit}`;
    ingredientsTag.appendChild(ingredientTag);
  });
  descriptionTag.innerText = description;

  topDescriptionPart.appendChild(nameTag);
  topDescriptionPart.appendChild(timeTag);
  bottomDescriptionPart.appendChild(ingredientsTag);
  bottomDescriptionPart.appendChild(descriptionTag);
  descriptionContainer.appendChild(topDescriptionPart);
  descriptionContainer.appendChild(bottomDescriptionPart);
  card.appendChild(img);
  card.appendChild(descriptionContainer);

  return card;
};

export { getRecipeCard };

const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

// event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});


// get meal list that matches with the ingredients
function getMealList(){
    let searchInputTxt = document.getElementById('search-input').value.trim();
    Header = "db2129aba91046f3a01b292d60dd8560"
    fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${searchInputTxt}&apiKey=${Header}&sort=min-missing-ingredients&number=50`).then(response => response.json()).then(data => {
        let html = "";
        if(data && data.length > 0){
            data.forEach(data => {
                html += `
                    <div class = "meal-item" data-id = "${data.id}">
                        <div class = "meal-img">
                            <img src = "${data.image}" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${data.title}</h3>
                            <a href = "#" class = "recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `;
            });
            mealList.classList.remove('notFound');
        } else{
            html = "Sorry, we didn't find any meal!";
            mealList.classList.add('notFound');
        }

        mealList.innerHTML = html;
    });
}


// get recipe of the meal
function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        const recipeId = mealItem.dataset.id;

        // Fetch recipe details using Spoonacular API
        fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${Header}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data))
        .catch(error => console.error('Error:', error));
    }
}

// create a modal
function mealRecipeModal(meal){
    console.log(meal);
    let html = `
        <h2 class = "recipe-title">${meal.title}</h2>
        <p class = "recipe-category">${meal.dishTypes.join(' - ')}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.instructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.image}" alt = "${meal.title}">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.spoonacularSourceUrl}" target = "_blank">Read Article</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}

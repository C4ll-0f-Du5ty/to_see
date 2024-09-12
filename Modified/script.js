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


document.querySelectorAll('.search-btn').forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      document.querySelectorAll('.search-btn').forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Hide all search bars
      document.querySelectorAll('.search-bar').forEach(bar => bar.classList.remove('active'));
      
      // Show the corresponding search bar
      const searchBarId = this.getAttribute('data-search-type') + '-search';
      document.getElementById(searchBarId).classList.add('active');
    });
  });


  // Updated search functionality based on active input
document.querySelectorAll('#search-bar-container button').forEach(button => {
    button.addEventListener('click', function() {
      const activeSearchBar = document.querySelector('.search-bar.active');
      if (activeSearchBar.id === 'ingredients-search') {
        getMealListByIngredients();
      } else if (activeSearchBar.id === 'dish-name-search') {
        getMealListByName();
      } else if (activeSearchBar.id === 'food-type-search') {
        getMealListByCategory();
      }
    });
  });



// get meal list that matches with the ingredients
function getMealList(){
    let searchInputTxt = document.getElementById('ingredients-input').value.trim();
    const header = "db2129aba91046f3a01b292d60dd8560";
    const loadingIndicator = document.getElementById('loading-indicator');
    const mealList = document.getElementById('meal');

    // Show loading indicator
    loadingIndicator.style.display = "block";
    mealList.innerHTML = ""; // Clear previous results

    fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${searchInputTxt}&apiKey=${header}&sort=min-missing-ingredients&number=50`)
        .then(response => response.json())
        .then(data => {
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

            // Hide loading indicator
            loadingIndicator.style.display = "none";
            mealList.innerHTML = html;
        })
        .catch(error => {
            console.error('Error:', error);

            // Hide loading indicator even on error
            loadingIndicator.style.display = "none";
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


// Search by dish name
function getMealListByName() {
    let searchInputTxt = document.getElementById('dish-name-input').value.trim();
    const header = "db2129aba91046f3a01b292d60dd8560";
    const loadingIndicator = document.getElementById('loading-indicator');
    const mealList = document.getElementById('meal');

    loadingIndicator.style.display = "block";
    mealList.innerHTML = "";

    fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${searchInputTxt}&apiKey=${header}&number=50`)
        .then(response => response.json())
        .then(data => {
            displayMeals(data.results);
        })
        .catch(error => {
            console.error('Error:', error);
            loadingIndicator.style.display = "none";
        });
}

// Search by food type (category)
function getMealListByCategory() {
    let searchInputTxt = document.getElementById('food-type-input').value.trim();
    const header = "db2129aba91046f3a01b292d60dd8560";
    const loadingIndicator = document.getElementById('loading-indicator');
    const mealList = document.getElementById('meal');

    loadingIndicator.style.display = "block";
    mealList.innerHTML = "";

    fetch(`https://api.spoonacular.com/recipes/complexSearch?type=${searchInputTxt}&apiKey=${header}&number=50`)
        .then(response => response.json())
        .then(data => {
            displayMeals(data.results);
        })
        .catch(error => {
            console.error('Error:', error);
            loadingIndicator.style.display = "none";
        });
}


function displayMeals(data) {
    const mealList = document.getElementById('meal');
    let html = "";

    if (data && data.length > 0) {
        data.forEach(meal => {
            html += `
                <div class="meal-item" data-id="${meal.id}">
                    <div class="meal-img">
                        <img src="${meal.image}" alt="food">
                    </div>
                    <div class="meal-name">
                        <h3>${meal.title}</h3>
                        <a href="#" class="recipe-btn">Get Recipe</a>
                    </div>
                </div>
            `;
        });
        mealList.classList.remove('notFound');
    } else {
        html = "Sorry, we didn't find any meal!";
        mealList.classList.add('notFound');
    }

    document.getElementById('loading-indicator').style.display = "none";
    mealList.innerHTML = html;
}

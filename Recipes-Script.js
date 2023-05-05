
document.addEventListener("DOMContentLoaded", () => {
    let recipesArray = new Array();
    //*Read and get and transform data from XML file::
    fetch("recettes.xml")
    .then((response) => { response.text()
    .then(function (xml) {
        let parser = (new window.DOMParser()).parseFromString(xml, "application/xml");
        //let ingredientsList = [];
        //let instructionsList = [];
        let recipeXML=parser.getElementsByTagName("recipe");
        for (let i = 0; i < recipeXML.length; i++) {
            const rId = recipeXML[i].id;
            const rTitle = parser.getElementsByTagName("title")[i].childNodes[0].nodeValue;
            const rCategory = parser.getElementsByTagName("category")[i].childNodes[0].nodeValue;
            const rPreptime = parser.getElementsByTagName("preptime")[i].childNodes[0].nodeValue;
            const rCooktime = parser.getElementsByTagName("cooktime")[i].childNodes[0].nodeValue;
            const rPortion = parser.getElementsByTagName("yield")[i].childNodes[0].nodeValue;
            const rImage = parser.getElementsByTagName("image")[i].childNodes[0].nodeValue;
            
        let ingredientXML = recipeXML[i].getElementsByTagName("ingredient_list");
        const ingredientsList = new Array();
        for (const element of ingredientXML) {
            ingredientsList.push(element.innerHTML.replaceAll('</ingredient>','</li>')
                                                  .replaceAll('<ingredient>','<li>'));
        }
    
        let rInstruction = recipeXML[i].getElementsByTagName("instruction_list");
        const instructionsList = new Array();
        for (const element of rInstruction) {
            instructionsList.push(element.innerHTML.replaceAll('</instruction>','</li>')
                                                    .replaceAll('<instruction>','<li>'));   
            }

       //    //ingredient list
       //let ingredientsList = recipeXmlNode.children[6].innerHTML
       //                    .replaceAll('</ingredient>','</li>')
       //                    .replaceAll('<ingredient>','<li>');
       //                    console.log("ingredientshtml="+ingredientsList);
       //
       ////instruction list
       //
       //let instructionsList = recipeXmlNode.children[7].innerHTML
       //                    .replaceAll('</instruction>','</li>')
       //                    .replaceAll('<instruction>','<li>');
       //                    console.log("instructionshtml="+instructionsList);

          //for (let j = 0; j < parser.getElementsByTagName("recipe").length; j++) {
          //    ingredientsList = parser.getElementsByTagName("ingredient_list")[j].innerHTML
          //                .replaceAll('</ingredient>','</li>')
          //                .replaceAll('<ingredient>','<li>');
          //    instructionsList = parser.getElementsByTagName("instruction_list")[j].innerHTML
          //               .replaceAll('</instruction>','</li>')
          //               .replaceAll('<instruction>','<li>');
          //            }
          console.log("ingredientshtml="+ingredientsList);
          console.log("instructionshtml="+instructionsList);
           
            //*Create object recipe:
            let recipe = new Recipe (
              rId, 
              rTitle, 
              rCategory, 
              rPreptime, 
              rCooktime, 
              rPortion,
              rImage,
              ingredientsList, 
              instructionsList
            );
            //*Create a recipe objects array:
            recipesArray.push(recipe); 
            console.log("recipesArray="+recipesArray);
            
        }
        //*Create HTML elements and display recipes previews in the "Recipes_List-wrap"" container:
        const displayRecipes = (recipes) => { 
           let wrap = document.getElementById("Recipes_List-wrap");
           wrap.innerHTML = "";
           recipes.forEach(recipe => {
               wrap.insertAdjacentHTML('beforeEnd',`<article class="recipePreview" id="${recipe.id}" type="button">
                                                    <img class="img_preview" src="images/${recipe.image}" alt="${recipe.title}"/>
                                                    <h2 id="title">${recipe.title}</h2>
                                                    </article>`);
           });
        }

        displayRecipes(recipesArray);

        //*Create addEventListener an call a function for each menu elements:
        document.getElementById('accueil').addEventListener('click', (e) => { 
            displayRecipes(recipesArray);
            goToHome();
        });
        
        //*Load accueil menu content:
        const goToHome = () => { 
            document.getElementById("Recipe-wrap").style.display = "none";
            document.getElementById("Recipes_List-wrap").style.display = "flex";
        };

        //*Create addEventListener an call a function for each category menu elements:
        [...document.getElementsByClassName('menu filtre-recipe')].forEach(button => {
            button.addEventListener('click', e => { 
                const category = e.target.getAttribute('id')
                const filteredRecipes = getRecipesByCategory(category, recipesArray);
                displayRecipes(filteredRecipes);
                goToHome();
            });
        });

        //*Load category menu content:
        const getRecipesByCategory = (category, recipes) => { 
            return recipes.filter(recipe => { 
                return recipe.category.toLowerCase() === category.toLowerCase();
            });
        }

        //*Create addEventListener an call a function for each Recipe preview button :
        document.addEventListener("click", function(e) {
            const target = e.target.closest(".recipePreview");
            if (target) {
                displayRecipe(target.getAttribute('id'), recipesArray);
            }
        });
        
        console.log(recipesArray);
        
        

        //*Create addEventListener for Searchbar et Display Filtered Receipes:
        let searchInput="";
        document.getElementById('search_bar').addEventListener('search', (e) => {
            searchInput = e.target.value;
            const FoundRecipes = getRecipesSearchBar (searchInput, recipesArray);
                displayRecipes(FoundRecipes);
                goToHome();
        }); 

        //*Filter searchBar input:
        const getRecipesSearchBar = (searchInput, recipes) => { 
            return recipes.filter(recipe=> { 
                return recipe.title.toLowerCase().includes(searchInput.toLowerCase())
                    || recipe.category.toLowerCase().includes(searchInput.toLowerCase())
                    || recipe.ingredients.includes(searchInput.toLowerCase())
                    || recipe.instructions.includes(searchInput.toLowerCase());
            });
        }

        //*Create HTML elements and display the selected recipe content in the "Recipes-wrap"" container:
        const displayRecipe = (id, recipes) => { 
        const recipe = recipes.find(recipe => { 
            return recipe.id == id;
        });
        let wrap = document.getElementById("Recipe-wrap");
        console.log("elements array="+recipe.values);
        wrap.innerHTML = "";
        wrap.insertAdjacentHTML('beforeEnd',`<article id="${recipe.id}" class="Recipe">
                                            <img id="recipe_Image" src="images/${recipe.image}" alt="${recipe.title}"/>
                                            <h2 id="recipe_Title">${recipe.title}</h2>
                                            <p class="prep_cook_portion">Temp de preparation: ${recipe.preptime}</p>
                                            <p class="prep_cook_portion">Temp de cuisson: ${recipe.cooktime}</p>
                                            <p class="prep_cook_portion">Portion: ${recipe.portion}</p>
                                            <h3 class="ingr_instr_title">Ingredients</h3>
                                            <ul id="ingredients">${recipe.ingredients}</ul></br></br>
                                            <h3 class="ingr_instr_title">Preparation</h3>
                                            <ul id="instructions">${recipe.instructions}</ul>
                                            </article>`);
        //*Switch between containers ("Recipes_List-wrap"" and in the "Recipes-wrap":)
        wrap.style.display = "flex";
        document.getElementById("Recipes_List-wrap").style.display = "none";
        }
            });
    });
});


class Recipe {
    id;
    title;
    image;
    category;
    preptime;
    cooktime;
    portion;
    ingredients;
    instructions;

    constructor(id, title, category, preptime, cooktime, portion, image, ingredients, instructions) {
        this.id = id;
        this.title = title;
        this.image = image;
        this.category = category;
        this.preptime= preptime;
        this.cooktime = cooktime;
        this.portion = portion;
        this.ingredients = ingredients;
        this.instructions = instructions;
    }
}
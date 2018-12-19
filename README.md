# MARVEL GROUP PROJECT 

deployed link: https://klynne23.github.io/marvel/

# MARVEL API
https://developer.marvel.com/docs#!/public/getCreatorCollection_get_0
* grab picture of character
* grab character name
* grab description
* grab # of available comics
* grab link to character comics

# TMDB API
https://developers.themoviedb.org/3/search/search-movies
* grab 4 poster images
* grab movie plots and display as overlay to the poster images

# FILE/FOLDER EXPLANATIONS

**.HTML**
* index.html is the main page where all of our content will be generated
* please be very careful when editing, classes and ids are all sensitive to the foundation framework as well as javascript & jquery scripts

**CSS FOLDER**
* app.css is OUR personal stylesheet that will override any built in foundation styles (given they are correctly applied)
* foundation.css is the full foundation (reset) file that holds all of the basic styles (can be directly edited or overriden by app.css)
* foundation.min.css is a minimalized version of the .css file, i have not used it and am leaving it there in case any styles are being pulled from it

**IMAGES FOLDER**
* holds our background image and loading gif/svg

**JS FOLDER**
* app.js is OUR personal file to run all of our scripts
* i am not 100% sure what the files inside the VENDOR folder do or what they are for but I am leaving them alone in case they affect how our page runs since they were provided with the foundation framework

# NOTE
* the Marvel API uses http:// while GitHub uses https:// 
    * Jared provided solution, look at the Marvel ajax URL, we are routing our request through a "middle-man" heroku who will add the required 's' to our URL and allow the content to work on GitHub


# THINGS TO WORK ON
**IMPORTANT**
* fix the modal so that it will display ALL of the responses from the second marvel ajax call
* make the responses clickable so that whichever one the user picks, it will then call both the generateHeroDivs function and getTMBdResponse based on whichever item the user clicked

**TO DO**
* perhaps using the superhero api to get powerstats and character height/weight and display in the character info div
* Marvel API error catch (.catch())
* if there is time, try and refactor to the display poster code
    - turn code into function and pass it variables for each generated poster

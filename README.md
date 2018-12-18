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
* DO NOT CHANGE THIS FILE

**CSS FOLDER**
* app.css is OUR personal stylesheet that will override any built in foundation styles (given they are correctly applied)
* foundation.css is the full foundation (reset) file that holds all of the basic styles (can be directly edited or overriden by app.css)
* foundation.min.css is a minimalized version of the .css file, i have not used it and am leaving it there in case any styles are being pulled from it

**IMAGES FOLDER**
* holds our background image and loading gif/svg

**JS FOLDER**
* app.js is OUR personal file to run all of our scripts
* i am not 100% sure what the files inside the VENDOR folder do or what they are for but I am leaving them alone in case they affect how our page runs since we are using this framework

# THINGS TO WORK ON
**IMPORTANT**
* the Marvel API uses http:// while GitHub uses https:// 
    * Jared provided solution, look at the Marvel ajax URL, we are routing our request through a "middle-man" heroku who will add the required 's' to our URL and allow the content to work on GitHub
    
**LESS IMPORTANT**   
* putting recent searches into local storage
* perhaps using the superhero api to get powerstats and character height/weight and display in the character info div

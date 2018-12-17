# MARVEL GROUP PROJECT 

# MARVEL API
https://developer.marvel.com/docs#!/public/getCreatorCollection_get_0
* grab picture of character
* grab biography
* grab (20) relevant comics
*

# TMDB API
https://developers.themoviedb.org/3/search/search-movies
* API key: 2abf67ce944d23e52af2559a5b7e6668

# IMPORTANT FILE INFORMATION
# .HTML
* index.html is the main page where all of our content will be generated
* DO NOT CHANGE THIS FILE

# CSS FOLDER
* app.css is OUR personal stylesheet that will override any built in foundation styles (given they are correctly applied)
* foundation.css is the full foundation (reset) file that holds all of the basic styles (can be directly edited or overriden by app.css)
* foundation.min.css is a minimalized version of the .css file, i have not used it and am leaving it there in case any styles are being pulled from it

# IMAGES FOLDER
* only image it holds is our background image

# JS FOLDER
* app.js is OUR personal file to run all of our scripts
* i am not 100% sure what the files inside the VENDOR folder do or what they are for but I am leaving them alone in case they affect how our page runs since we are using this framework

# THINGS TO WORK ON
* adding a loading bar or gif to the image div and the character info div for the lag time while the ajax request to the api is loading
* * any time the user presses the submit button, show loading gifs so that the user understands the process is occuring while they wait
* putting recent searches into local storage
* perhaps using the superhero api to get powerstats and character height/weight and display in the character info div
* adding whatever new technology we decide on 
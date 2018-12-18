// array to hold the 5 most recent searches
var recentSearches = [];
// this array is for me to log the charcter names that have the best results
var marvelSearches = ["Wolverine", "Spider-Man", "Iron Man","Thor", "Hulk", "Iron Man", "Black Widow", "Captain America", "Guardians of the Galaxy", "Vision", "Black Panther"];
// this array is just for me to put  issues we should try to account for
var marvelIssues = [{
  Vision: "returns character info and poster from marvel, movies are completely unrelated",
  Antman: "cannot for the life of me figure out how to search for this character and pull any marvel info"

}];


//*************************************************//
// FUNCTION TO PICK UP USER INPUT FROM SEARCH FORM //
//*************************************************//

$("#submit-button").on("click", function (event) {
  event.preventDefault(); //stop form from trying to go to another webpage
  var input = $("#user-input").val().trim(); //grab the user input from the form textbox

  if (input === "") {
    return; // if user searches an empty string, exit function
  }

  updateSearches(input); // call a function to update the searches array for each input
  getMarvelResponse(input); // call the getMarvelResponse function and pass it the input
  // getTMDbResponse(input); // call the getTMDb function and pass it the input

  $("#user-input").val(''); // remove the users input from the form box
}); // end on.click function




//******************************************//
// function to update recent searches array //
//******************************************//

function updateSearches(newSearch) {
  $("#recentSearches").empty(); // empty the div

  // generate header content
  var header1 = $("<h4>");
  header1.text("Most Recent Searches");
  header1.addClass("animated flipInX"); // animated.css
  $("#recentSearches").append(header1);

  var hrDiv = $("<hr>");
  hrDiv.addClass("hr-text");
  hrDiv.attr("data-content", "//");
  hrDiv.addClass("animated fadeIn"); // animated.css
  $("#recentSearches").append(hrDiv);

  // generate div for the list items
  var listDiv = $("<div>");
  listDiv.attr("id", "listItems");
  listDiv.addClass("animated fadeIn"); // animated.css
  $("#recentSearches").append(listDiv);

  $("#recentSearches").addClass("callout animated zoomIn"); // add classes to the div once the content is generated
  $("#recentSearches").css("background-color", "rgba(0, 0, 0, .7)"); // give styling to the div once content is generate

  // check the length of recentSearches array. if it is equal to 5, then we splice
  if (recentSearches.length == 5) {
    recentSearches.splice(0, 1); // splice ( remove recentSearches[0], remove only 1 element )
    recentSearches.push(newSearch); // push newest user input (length returns to 5)
    displayRecentSearches(recentSearches); // call a function to display the user input
  }
  else {
    recentSearches.push(newSearch); // push newest user input into recentSearches array
    displayRecentSearches(recentSearches); // call a function to display the user input
  }
};




//*************************************//
// function to display recent searches //
//*************************************//

function displayRecentSearches(searchArray) {
  var num = searchArray.length; // since we want to display most recent first, we count down the list number, as we loop through the array
  for (var i = 0; i < searchArray.length; i++) {
    var listItem = $("<p>"); // create list item
    listItem.text(num + '. ' + searchArray[i]);
    listItem.addClass("animated fadeIn"); // animated.css
    $("#listItems").prepend(listItem); // prepending assures that the newer searches are display at the top of the list
    num--;
  }
};



//*************************************//
// function to make call to marvel api //
//*************************************//

function getMarvelResponse(characterName) {

  $("#posterImage").empty();  // clear image div
  $("#charInfo").empty(); // clear character info div
  $("movieContent").empty(); // clear the movieContent div

  // //display loading gif/svg, they will display while the ajax call is retrieving the data
  var img = $("<img>");
  img.attr("src", "assets/images/loading.svg");
  img.addClass("imgLoad");

  var img1 = $("<img>");
  img1.attr("src", "assets/images/loading.svg");
  img1.addClass("imgLoad loadChar");

  $("#posterImage").append(img);
  $("#charInfo").append(img1);

  // you need a new ts every request                                                                                    
  var ts = new Date().getTime();
  //creates the hash
  var hash = CryptoJS.MD5(ts + "64db9fdab53906ac65de6ccadc60239d59f68cc1" + "3037032bf180053850405c0db9a5a3ce").toString();
  var superHeroObject;
  var url = 'https://cors-anywhere.herokuapp.com/http://gateway.marvel.com:80/v1/public/characters';
  var flag = 0;



  //********************************************//
  // calling the marvel api and displaying data //
  //********************************************//


  $.ajax({
    url: url,
    method: "GET",
    // nameStartsWith instead of name
    data: { ts: ts, apikey: "3037032bf180053850405c0db9a5a3ce", hash: hash, name: characterName } //use data to pass attributes to query
  }).then(function (response) {

    flag = response.data.count;

    if (flag == 0) {
      alert("no results found");
      // GENERATE VALID CONTENT FOR THIS ERROR

      // display superhero notfound object
      // superheronotfound = {
      //   name: Not found,
      //   Description: not found,
      //   thumbnail: src = "notfound.img",
      //   comic: unavailable
      // }

      // clear all divs except recent searches
    }
    else {

    superHeroObject = response.data.results[0];  // dril down into data to get superhero object
    console.log(response);

    var comicLink = (superHeroObject.urls).find(o => o.type === "comiclink").url; //array of urls from superhero uses find method to find comic link url
    var thumbnail = superHeroObject.thumbnail.path + "." + superHeroObject.thumbnail.extension; //image url

    // call method to display divs
    generateDivs(superHeroObject, thumbnail, comicLink);
  } // end else 
    
  }).then(function (response) {
    
    if (flag != 0 ) {
      getTMDbResponse(superHeroObject.name);
    }
    
  }) // end .then function
  
}; // end getMarvelResponse




//***********************************//
// function to make call to TMDb api //
//***********************************//

function getTMDbResponse(userInput) {
  
  $("#movieContent").empty(); // clear the div 
  var movie = userInput;
  var queryURL = "https://api.themoviedb.org/3/search/movie?api_key=2abf67ce944d23e52af2559a5b7e6668&query=" + movie

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    var movieResponse = response.results;
    console.log(movieResponse);

    // if (movieResponse.length == 0) {
    //   display div that says "no relevent films found"
    // }
    // else {
    // run the below for loop and display movies/posters
    // for loop to display the first 4 movie posters and plots returned
    for (var i = 0; i <= 3; i++) {
      
      var posterURL = "https://image.tmdb.org/t/p/w500" + movieResponse[i].poster_path;
      
      
      var newDiv = $("<div>"); // create a new div for each poster
      newDiv.attr("id", "moviePoster" + i);
      newDiv.addClass("large-3 medium-4 small-6 cell moviePoster animated zoomIn");
      $("#movieContent").append(newDiv);
      
      
      var img = $("<img>"); // create the image element to display the poster
      img.attr("src", posterURL);
      $(newDiv).append(img);
      
    } // end for loop
    
    
    // NOT SURE IF THERE IS A DRY WAY TO DO THIS?
    // create 2 divs for each poster to overlay the plot on hover
    
    //************//
    // POSTER ONE //
    //************//
    
    var overlay = $("<div>"); // create a div to hold the background
    overlay.addClass("overlay");
    overlay.attr("id", "text1");
    $("#moviePoster0").append(overlay);
    
    var text = $("<div>"); // create div text to hold the description
    text.addClass("text");
    text.text(movieResponse[0].overview);
    $("#text1").append(text);
    
    //************//
    // POSTER TWO //
    //************//  
    
    var overlay = $("<div>");
    overlay.addClass("overlay");
    overlay.attr("id", "text2");
    $("#moviePoster1").append(overlay);
    var text = $("<div>");
    text.addClass("text");
    text.text(movieResponse[1].overview);
    $("#text2").append(text);
    
    //**************//
    // POSTER THREE //
    //**************//  
    
    var overlay = $("<div>");
    overlay.addClass("overlay");
    overlay.attr("id", "text3");
    $("#moviePoster2").append(overlay);
    var text = $("<div>");
    text.addClass("text");
    text.text(movieResponse[2].overview);
    $("#text3").append(text);
    
    //*************//
    // POSTER FOUR //
    //*************//  
    
    var overlay = $("<div>");
    overlay.addClass("overlay");
    overlay.attr("id", "text4");
    $("#moviePoster3").append(overlay);
    var text = $("<div>");
    text.addClass("text");
    text.text(movieResponse[3].overview);
    $("#text4").append(text);
    
    // } // end else 
    
  }); // end .then function
}; // end getTMDbResponse function


//***************************//
// GENERATE CONTENT FOR DIVS //
//***************************// 


function generateDivs(superHeroObject, thumbnail, comicLink) {
  $("#posterImage").empty(); // clear image div
  $("#charInfo").empty(); // clear character info div
  

  // generates the h1 and hr elements each time and appends them to charInfo
  var header1 = $("<h1>");
  header1.text("Character Info");
  header1.addClass("animated flipInX"); // animated.css
  $("#charInfo").append(header1);

  var hrDiv = $("<hr>");
  hrDiv.addClass("hr-text");
  hrDiv.attr("data-content", "//");
  hrDiv.addClass("animated fadeIn"); // animated.css
  $("#charInfo").append(hrDiv);

  // Name
  var charName = $("<p>");
  charName.text("Name: " + superHeroObject.name);
  charName.addClass("animated fadeIn"); // animated.css
  $("#charInfo").append(charName);

  // Description
  var charDesc = $("<p>");

  // if statement to handle any characters with no description
  if (superHeroObject.description === "") {
    charDesc.text("Description: No Available Description");
    charDesc.addClass("animated fadeIn"); // animated.css
    $("#charInfo").append(charDesc);
  }
  else {
    charDesc.text("Description: " + superHeroObject.description);
    charDesc.addClass("animated fadeIn"); // animated.css
    $("#charInfo").append(charDesc);
  }

  // Number of available comics
  var numComics = $("<p>");
  numComics.text("# of Available Comics: " + superHeroObject.comics.available);
  numComics.addClass("animated fadeInDown"); // animated.css
  $("#charInfo").append(numComics);

  // Link to Comics
  var charComicLink = $("<p>");
  charComicLink.text("Check some out here: ");
  charComicLink.addClass("animated fadeInDown"); // animated.css
  $(charComicLink).append('<a href=" ' + comicLink + ' " target="_blank">' + superHeroObject.name + ' Comics </a>');
  $("#charInfo").append(charComicLink);

  // Image
  var charImage = $("<img>");
  charImage.attr("src", thumbnail);
  charImage.addClass("animated zoomIn"); // animated.css
  $("#posterImage").append(charImage);


  $("#charInfo").addClass("callout animated zoomIn"); // add classes to the div once the content is generated
  $("#charInfo").css("background-color", "rgba(0, 0, 0, .7)"); // give styling to the div once content is generate
  $("#hrDivider").css("visibility", "visible"); // makes the white divider visible rather then generating it each time

};
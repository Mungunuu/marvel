
// determine if there is anything in local storage
if (JSON.parse(localStorage.getItem("recentSearches")) == null) {
  // if not, initalize recentSeaches Array
  var recentSearches = [];
}

else {
  // if there is content in local storage set the array equal to the local storage value
  var recentSearches = JSON.parse(localStorage.getItem("recentSearches"));
}



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
  $("#movieContent").empty();
  $("#charInfo").removeClass("callout"); // remove classes so it doesnt show while the page loads a new input
  $("#charInfo").css("background-color", "rgba(0, 0, 0, 0)"); // change background to transparent

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
    console.log(recentSearches)
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    displayRecentSearches(recentSearches); // call a function to display the user input
  }
  else {
    recentSearches.push(newSearch); // push newest user input into recentSearches array
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    console.log(recentSearches)
    displayRecentSearches(recentSearches); // call a function to display the user input
  }


};




//*************************************//
// function to display recent searches //
//*************************************//

function displayRecentSearches(searchArray) {

  var object = JSON.parse(localStorage.getItem("recentSearches"));

  var num = searchArray.length; // since we want to display most recent first, we count down the list number, as we loop through the array
  for (var i = 0; i < searchArray.length; i++) {
    var listItem = $("<p>"); // create list item
    listItem.text(num + '. ' + (object[i]));
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
  var flag2 = 0;
  var apikey = "3037032bf180053850405c0db9a5a3ce";



  //********************************************//
  // calling the marvel api and displaying data //
  //********************************************//


  $.ajax({
    url: url,
    method: "GET",
    // nameStartsWith instead of name
    data: { ts: ts, apikey: apikey, hash: hash, name: characterName } //use data to pass attributes to query
  }).then(function (response) {

    flag = response.data.count;

    if (flag == 1) {
      superHeroObject = response.data.results[0];   // dril down into data to get superhero object
      generateHeroDivs(superHeroObject);                // call method to display divs
    } // end else

  }).then(function (response) {
    //###########
    // GENERATE VALID CONTENT FOR THIS ERROR
    if (flag == 0) {
      alert("no results found, do broader search");
      startWithSearch(characterName, ts, apikey, hash, url); // do another ajax, use nameStartsWith instead of name
    }
    //############
  }).then(function (response) {

    if (flag != 0) {
      // make sure we are passing the correct variable to ensure best film return results from tmdb
      getTMDbResponse(superHeroObject.name);
    }

  }) // end .then function


  //**********PATRICK ADD A CATCH ERROR STATEMENT .CATCH()********//

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

    if (movieResponse.length == 0) {

      var newDiv1 = $("<div>"); // create a new div 
      newDiv1.addClass("large-3 medium-3 small-3 cell ");
      $("#movieContent").append(newDiv1);

      var newDiv = $("<div>"); // create a new div 
      newDiv.attr("id", "noMovies");
      newDiv.addClass("large-6 medium-6 small-6 cell animated zoomIn");
      $("#movieContent").append(newDiv);

      var newDiv2 = $("<div>"); // create a new div 
      newDiv2.addClass("large-3 medium-3 small-3 cell");
      $("#movieContent").append(newDiv2);

      var text = $("<p>");
      text.attr('id', "noMovieText");
      text.text("NO MOVIES FOUND");
      $(newDiv).append(text);

    }

    else {
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
      // turn code into a function
      // pass the function "tex1", "movieposter0"
      // do this 3 more times with different variables
      // var a = $("#moviePoster0")
      // var b = "text1"
      //     


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

    } // end else 

  }); // end .then function
}; // end getTMDbResponse function



//***************************//
// GENERATE CONTENT FOR DIVS //
//***************************// 

function generateHeroDivs(superHeroObject) {

  var comicLink = (superHeroObject.urls).find(o => o.type === "comiclink").url; //array of urls from superhero uses find method to find comic link url
  var thumbnail = superHeroObject.thumbnail.path + "." + superHeroObject.thumbnail.extension; //image url

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
  charImage.addClass("animated fadeInLeft"); // animated.css
  $("#posterImage").append(charImage);


  $("#charInfo").addClass("callout animated zoomIn"); // add classes to the div once the content is generated
  $("#charInfo").css("background-color", "rgba(0, 0, 0, .7)"); // give styling to the div once content is generate
  $("#hrDivider").css("visibility", "visible"); // makes the white divider visible rather then generating it each time

};


//*******************************//
// GENERATE NO SUPERHERO CONTENT //
//*******************************// 

function noSuperHero() {

  var thumbnail = "assets/images/not-found.png";

  // clear the divs of any content
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
  charName.text("Name: No Available Name");
  charName.addClass("animated fadeIn"); // animated.css
  $("#charInfo").append(charName);

  // Description
  var charDesc = $("<p>");
  charDesc.text("Description: No Available Description");
  charDesc.addClass("animated fadeIn"); // animated.css
  $("#charInfo").append(charDesc);


  // Number of available comics
  var numComics = $("<p>");
  numComics.text("# of Available Comics: No Comics Found");
  numComics.addClass("animated fadeInDown"); // animated.css
  $("#charInfo").append(numComics);

  // Image
  var charImage = $("<img>");
  charImage.attr("src", thumbnail);
  charImage.addClass("animated zoomIn"); // animated.css
  $("#posterImage").append(charImage);

  $("#charInfo").addClass("callout animated zoomIn"); // add classes to the div once the content is generated
  $("#charInfo").css("background-color", "rgba(0, 0, 0, .7)"); // give styling to the div once content is generate
  $("#hrDivider").css("visibility", "visible"); // makes the white divider visible rather then generating it each time


}

//**********************************************************//
// FUNCTION TO SEARCH FOR NAME STARTS WITH (BROADER SEARCH) //
//**********************************************************// 

function startWithSearch(characterName, ts, apikey, hash, url)  //############
{
  $.ajax({
    url: url,
    method: "GET",
    // nameStartsWith instead of name
    data: { ts: ts, apikey: apikey, hash: hash, nameStartsWith: characterName } //use data to pass attributes to query
  }).then(function (response) {

    var results = response.data.results;
    /******** PATRICK CODING EVERYTHING IN THIS ELSE IF  */
    if (results.length == 1) {
      superHeroObject = results[0];
      // make sure we are passing the correct variable to ensure best film return results from tmdb
      getTMDbResponse(superHeroObject.name);
      generateHeroDivs(superHeroObject);
      flag2 = 0;
    } // end if

    //******** PATRICK CODING EVERYTHING IN THIS ELSE IF  */
    else if (results.length > 1) {
      //create clickable div for modal for each result

      $("xtest").empty();
      for (var i = 0; i < results.length; i++) {

        var choiceDiv = $("<div>");

        var p = $("<p>").text(results[i].name);
        p.attr("data-name-1", results[i]);
        $("choiceDiv").append(p);
        p.addClass("clickModal");
        $("choicesModal").append(choiceDiv);
        // console.log(choiceDiv)


      }
      alert(results[0].name + "  " + results[1].name + "   " + results[2].name)
      flag2 = 0;
      var popup = new Foundation.Reveal($('#choicesModal'));
      popup.open();
      // console.log(popup)

      generateHeroDivs($(this).attr("data-name-1"))  //this is superhero object    ########

    } // end else if

    else {
      alert("no results found");
      flag2 = 1;

      noSuperHero();

      var newDiv1 = $("<div>"); // create a new div 
      newDiv1.addClass("large-3 medium-3 small-3 cell ");
      $("#movieContent").append(newDiv1);

      var newDiv = $("<div>"); // create a new div 
      newDiv.attr("id", "noMovies");
      newDiv.addClass("large-6 medium-6 small-6 cell animated zoomIn");
      $("#movieContent").append(newDiv);

      var newDiv2 = $("<div>"); // create a new div 
      newDiv2.addClass("large-3 medium-3 small-3 cell");
      $("#movieContent").append(newDiv2);

      var text = $("<p>");
      text.attr('id', "noMovieText");
      text.text("NO MOVIES FOUND");
      $(newDiv).append(text);

    }// end else



  }); // end .then function

}; // end startsWithSearch

$(document).on("click", ".clickModal", generateHeroDivs);
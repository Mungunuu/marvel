// $(document).foundation() 

// array to hold the 5 most recent searches
var recentSearches = [];

// function to pick up user input from search form
$("#submit-button").on("click", function (event) {
  //stop form from trying to go to another webpage
  event.preventDefault();

  //grab the user input from the form textbox
  var input = $("#user-input").val().trim();

  // if user searches an empty string, exit function
  if (input === "") {
    return;
  }
  // call a function to display the array each time it is updated.
  updateSearches(input);

  //call the getMarvelResponse function and pass it the input
  getMarvelResponse(input);

  // call the getTMDb function and pass it the input
  getTMBdResponse(input);

  $("#user-input").val('');
}); // end on.click function

// function to update recent searches array
function updateSearches(newSearch) {
  // empty the div
  $("#recentSearches").empty();
  $("#recentSearches").addClass("callout");
  $("#recentSearches").css("background-color", "rgba(0, 0, 0, .7)");


  // generate header content
  var header1 = $("<h4>");
  header1.text("Most Recent Searches");
  $("#recentSearches").append(header1);

  var hrDiv = $("<hr>");
  hrDiv.addClass("hr-text");
  hrDiv.attr("data-content", "//");
  $("#recentSearches").append(hrDiv);

  // generate div for the list items
  var listDiv = $("<div>");
  listDiv.attr("id", "listItems");
  $("#recentSearches").append(listDiv);

  // check the length of recentSearches array. if it is equal to 5 then we splice
  if (recentSearches.length == 5) {
    recentSearches.splice(0, 1); // remove index[0]
    recentSearches.push(newSearch); // push newest input (length returns to 5)
    displayRecentSearches(recentSearches);
  }
  else {
    recentSearches.push(newSearch);
    displayRecentSearches(recentSearches);
  }
};

// function to display recent searches
function displayRecentSearches(searchArray) {
  var num = searchArray.length;
  for (var i = 0; i < searchArray.length; i++) {
    // create list item
    var listItem = $("<p>");
    listItem.text(num + '. ' + searchArray[i]);
    $("#listItems").prepend(listItem);
    // console.log(listItem);
    num--;
  }
};

function getMarvelResponse(characterName) {
  // you need a new ts every request                                                                                    
  var ts = new Date().getTime();
  //creates the hash
  var hash = CryptoJS.MD5(ts + "64db9fdab53906ac65de6ccadc60239d59f68cc1" + "3037032bf180053850405c0db9a5a3ce").toString();
  var superHeroObject;
  var url = 'http://gateway.marvel.com:80/v1/public/characters';

  $.ajax({
    url: url,
    method: "GET",
    data: { ts: ts, apikey: "3037032bf180053850405c0db9a5a3ce", hash: hash, name: characterName } //use data to pass attributes to query
  }).then(function (response) {

    superHeroObject = response.data.results[0];  // dril down into data to get superhero object

    // console.log(superHeroObject);
    // create err0r handling for if superHeroObject is undefined
    // return the function, display an error message?

    //array of urls from superhero uses find method to find comic link url
    var comicLink = (superHeroObject.urls).find(o => o.type === "comiclink").url;

    //image url
    var thumbnail = superHeroObject.thumbnail.path + "." + superHeroObject.thumbnail.extension;

    // clear out any former generated content
    // clear image div
    $("#posterImage").empty();
    // clear character info div
    $("#charInfo").empty();
    // adds the outline/background once content is ready to be put inside div
    $("#charInfo").addClass("callout");
    $("#charInfo").css("background-color", "rgba(0, 0, 0, .7)");

    // this code generates the h1 and hr elements each time and appends them to charInfo
    var header1 = $("<h1>");
    header1.text("Character Info");
    $("#charInfo").append(header1);

    var hrDiv = $("<hr>");
    hrDiv.addClass("hr-text");
    hrDiv.attr("data-content", "//");
    $("#charInfo").append(hrDiv);

    // Name
    var charName = $("<p>");
    charName.text("Name: " + superHeroObject.name);
    $("#charInfo").append(charName);

    // Description
    var charDesc = $("<p>");
    // if statement to handle any characters with no description
    if (superHeroObject.description === "") {
      charDesc.text("Description: No Available Description");
      $("#charInfo").append(charDesc);
    }
    else {
      charDesc.text("Description: " + superHeroObject.description);
      $("#charInfo").append(charDesc);
    }

    // Number of available comics
    var numComics = $("<p>");
    numComics.text("# of Available Comics: " + superHeroObject.comics.available);
    $("#charInfo").append(numComics);

    // Link to Comics
    var charComicLink = $("<p>");
    charComicLink.text("Check some out here: ");
    $(charComicLink).append('<a href=" ' + comicLink + ' " target="_blank">' + superHeroObject.name + ' Comics </a>');
    $("#charInfo").append(charComicLink);

    // Image
    var charImage = $("<img>");
    charImage.attr("src", thumbnail);
    $("#posterImage").append(charImage);

    $("#hrDivider").css("visibility", "visible");

  }) // end .then function
}; // end getMarvelResponse

function getTMBdResponse(userInput) {
  // clear any previous searches
  $("#movieContent").empty();

  var movie = userInput;
  var queryURL = "https://api.themoviedb.org/3/search/movie?api_key=2abf67ce944d23e52af2559a5b7e6668&query=" + movie

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    var movieResponse = response.results;
    // console.log(movieResponse);
    

    for (var i = 0; i<=3; i++) {

      posterURL = "https://image.tmdb.org/t/p/w500" +movieResponse[i].poster_path;

      // create a new div for each image
      var newDiv = $("<div>");
      newDiv.attr("id", "moviePoster" + i);
      newDiv.addClass("large-3 medium-4 small-6 cell moviePoster");
      $("#movieContent").append(newDiv);

      // create the image element to display the poster
      var img = $("<img>");
      img.attr("src", posterURL);
      $(newDiv).append(img);

    } // end for loop

    // NOT SURE IF THERE IS A DRY WAY TO DO THIS?
    // create a div with class overlay to hold the movie description
    var overlay = $("<div>");
    overlay.addClass("overlay");
    overlay.attr("id", "text0")
    $("#moviePoster0").append(overlay);
    // create div text to hold the description
    var text = $("<div>");
    text.addClass("text");
    text.text(movieResponse[0].overview);
    $("#text0").append(text);

    var overlay = $("<div>");
    overlay.addClass("overlay");
    overlay.attr("id", "text1")
    $("#moviePoster1").append(overlay);
    var text = $("<div>");
    text.addClass("text");
    text.text(movieResponse[1].overview);
    $("#text1").append(text);

    var overlay = $("<div>");
    overlay.addClass("overlay");
    overlay.attr("id", "text2")
    $("#moviePoster2").append(overlay);
    var text = $("<div>");
    text.addClass("text");
    text.text(movieResponse[2].overview);
    $("#text2").append(text);

    var overlay = $("<div>");
    overlay.addClass("overlay");
    overlay.attr("id", "text3")
    $("#moviePoster3").append(overlay);
    var text = $("<div>");
    text.addClass("text");
    text.text(movieResponse[3].overview);
    $("#text3").append(text);

  }); // end .then function
}; // end getTMBdResponse function

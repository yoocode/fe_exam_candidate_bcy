//remove each image card 
//show emptyBreedPlaceholderMessage when there is no more image
var numberOfCaughtBreeds = 0;

$("#deleteEachBreed").click(function () {
    if (--numberOfCaughtBreeds == 0) {
        $('#emptyBreedPlaceholderMessage').css("display", "block");
    }

    var card = $(this).parentsUntil($(".card")).parent();
    card.remove();
});

//retrieve breed list
var data = '';

$.getJSON("https://dog.ceo/api/breeds/list", function (result) {
    data = result.message;
});

//set initial stage for no suggestion
$(document).on('click', function (e) {
    $("#searchSuggestions").css("display", "none");
});

//Suggestion list (6 max) 
//wide net by having any letters in the name
$("#myBreedSearcher").keyup(function () {
    let suggestions = $("#searchSuggestions");
    let searchField = $(this).val();
    //set default search
    if (searchField == '') {
        suggestions.css("display", "none");
        return;
    }

    //Breed suggestion
    //regex pattern search with case ignore
    let regex = new RegExp(searchField, "i");
    let count = 0;
    let newSuggestions = "";

    $.each(data, function (key, val) {

        if (count < 6 && val.search(regex) != -1) {
            newSuggestions += "<button type='button' class='list-group-item list-group-item-action' onclick='addBreedToCollection(this.innerHTML)'>" + val + "</button>";
            count++;
        }
    });
    if (count > 0) {
        suggestions.html(newSuggestions);
        suggestions.css("display", "block");
    }
});

//No message when there is image
function hideemptyBreedPlaceholderMessage() {
    if ($('#emptyBreedPlaceholderMessage').is(":visible")) {
        $('#emptyBreedPlaceholderMessage').css("display", "none");
    }
}

//catch random breed
//breed name: use url as a source of the breed name
function catchRandomBreed() {
    $.getJSON("https://dog.ceo/api/breeds/image/random", function (result) {
        var url = result.message;

        // url format: https://dog.ceo/api/img/BREEDNAME/imgURL.jpg)
        var breedNameStartIndex = 24;
        var breedNameEndIndex = url.indexOf('/', breedNameStartIndex);
        var breedName = url.substring(breedNameStartIndex, breedNameEndIndex);

        addBreedToCollection(breedName, result.message);
    });
}

//Add breedName and image url
//use clone method for genericBreedCard element
//set myBreedSearcher to default
function addBreedToCollection(breedName, url) {
    var card = $('#genericBreedCard').clone(true, true);//x & breedName
    $("#myBreedSearcher").val('');

    if (!url) {

        $.getJSON("https://dog.ceo/api/breed/" + breedName + "/images/random", function (result) {
            addCardProperties(card, breedName, result.message);
        });
    } else {
        addCardProperties(card, breedName, url);//breed = breed name
    }
    hideemptyBreedPlaceholderMessage();//hide text
}

//make each card
function addCardProperties(card, breedName, url) {
    card.prop("id", "breedCard" + numberOfCaughtBreeds++);
    card.css("display", "inline-block");

    card.prepend("<img class='card-img-top' src='" + url + "' alt='A cute fluffy pup'>");

    card.find(".card-title")[0].innerHTML = breedName;

    card.appendTo($("#myBreedCol"));
}

//clear all method
function clearAll() {
    numberOfCaughtBreeds = 0;
    $('#emptyBreedPlaceholderMessage').css("display", "block");

    $('#myBreedCol').empty();
}
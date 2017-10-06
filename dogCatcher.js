var numberOfCaughtBreeds = 0;

$("#deleteEachBreed").click(function () {
    if (--numberOfCaughtBreeds == 0) {
        $('#emptyBreedPlaceholderMessage').css("display", "block");
    }

    var card = $(this).parentsUntil($(".card")).parent();
    card.remove();
});

var data = '';

$.getJSON("https://dog.ceo/api/breeds/list", function (result) {
    data = result.message;
});

$(document).on('click', function (e) {//initial stage - no suggestion
    $("#searchSuggestions").css("display", "none");
});

//populate breed name suggestion list (6 max) 
//wide net by having any letters in the name
$("#myBreedSearcher").keyup(function () {
    let suggestions = $("#searchSuggestions");

    let searchField = $(this).val();

    if (searchField == '') {//when search becomes default
        suggestions.css("display", "none");
        return;
    }

    let regex = new RegExp(searchField, "i");//i for ignore case
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

function hideemptyBreedPlaceholderMessage() {
    if ($('#emptyBreedPlaceholderMessage').is(":visible")) {
        $('#emptyBreedPlaceholderMessage').css("display", "none");
    }
}

function catchRandomBreed() {
    $.getJSON("https://dog.ceo/api/breeds/image/random", function (result) {
        var url = result.message;

        // url in the format: https://dog.ceo/api/img/BREEDNAME/imgURL.jpg)
        var breedStartIndex = 24;
        var breedEndIndex = url.indexOf('/', breedStartIndex);
        var breed = url.substring(breedStartIndex, breedEndIndex);

        addBreedToCollection(breed, result.message);
    });

}

function addBreedToCollection(breed, url) {
    var card = $('#genericBreedCard').clone(true, true);//x & breedName
    $("#myBreedSearcher").val('');

    if (!url) {

        $.getJSON("https://dog.ceo/api/breed/" + breed + "/images/random", function (result) {
            addCardProperties(card, breed, result.message);
        });
    } else {
        addCardProperties(card, breed, url);//breed = breed name
    }
    hideemptyBreedPlaceholderMessage();//hide text
}

function addCardProperties(card, breed, url) {
    card.prop("id", "breedCard" + numberOfCaughtBreeds++);
    card.css("display", "inline-block");

    card.prepend("<img class='card-img-top' src='" + url + "' alt='A cute fluffy pup'>");

    card.find(".card-title")[0].innerHTML = breed;

    // var nthColumn = "#myBreedCol" + getNextColumn();
    var nthColumn = "#myBreedCol1";

    // console.log("Appending to " + nthColumn);
    card.appendTo($(nthColumn));
}

function clearAll() {
    numberOfCaughtBreeds = 0;
    $('#emptyBreedPlaceholderMessage').css("display", "block");

    $('#myBreedCol1').empty();
}
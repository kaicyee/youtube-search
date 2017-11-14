let YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';


let RESULT_HTML_TEMPLATE = (
  '<div>' +
    '<a class="js-image-link" href=""><img class="js-image" src=""></a>' +
  '</div>'
);

// function that gets the API
function getDataFromApi(searchTerm, callback) {
  let query = {
    part: 'snippet',
    key: 'AIzaSyBV4cpfvyFArNh_6T0GnswrooEZD_4YNE8',
    q: searchTerm /*+ " in:name"*/,
  };
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

// function that manipulates the API (on callback)
function renderResult(result) {
  let template = $(RESULT_HTML_TEMPLATE);
  template.find(".js-image").attr("src", result.snippet.thumbnails.medium.url);
  template.find(".js-image-link").attr("href", 
  'https://www.youtube.com/watch?v=' + result.id.videoId)
  console.log(result.name);
  return template;
}

function displayYouTubeSearchData(data) {
  let results = data.items.map(function(item, index) {
    return renderResult(item);
  });
  $('.js-search-results').html(results);
}

function watchSubmit() {
  $('.js-search-form').submit(function(event) {
    event.preventDefault();
    let queryTarget = $(event.currentTarget).find('.js-query');
    let query = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getDataFromApi(query, displayYouTubeSearchData);
  });
}

$(watchSubmit);

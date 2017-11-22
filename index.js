let YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';


let RESULT_HTML_TEMPLATE = (
  '<div id="youtube-@type-@youtube-id">' +
    '<h3 class="js-title"></h3>' +
    '<a class="js-image-link" aria-label="youtube-video" href=""><img class="js-image" src="" alt=""><span class="videolink">Click here for YouTube video</span></a>' +
  '</div>'
  //axe doesn't like that div id="youtube-link" because it's repeated to each result but in essence it does the job
  //alt="" will work for acessibility because the title is used for context
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
function renderResult(result, index) {
  console.log(result);

  const html = RESULT_HTML_TEMPLATE
    .replace('@type', result.id.kind.substr(8))
    .replace('@youtube-id', result.id.channelId || result.id.playlistId || result.id.videoId)

  let template = $(html);

  template.find(".js-title").html(result.snippet.title);

  template.find(".js-image").attr("src", result.snippet.thumbnails.medium.url);


  // Performing a match operation for all cases
  switch (result.id.kind) {
    case 'youtube#channel':
      template.find(".js-image-link").attr("href", 'https://www.youtube.com/channel/' + result.id.channelId);
      break;
    case 'youtube#playlist':
      template.find(".js-image-link").attr("href", 'https://www.youtube.com/playlist?list=' + result.id.playlistId);
      break;
    case 'youtube#video':
      template.find(".js-image-link").attr("href", 'https://www.youtube.com/watch?v=' + result.id.videoId);
      break;
  }

  // template.find(".js-image-link").attr("href", 
  // 'https://www.youtube.com/watch?v=' + result.id.videoId)
  console.log(result.name);
  return template;
}

// calling the API function and passing the manipulator as a call back
function displayYouTubeSearchData(data) {
  let results = data.items.map(function(item, index) {
    return renderResult(item, index);
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

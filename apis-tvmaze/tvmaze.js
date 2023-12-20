"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const episodesList = document.querySelector("#episodesList");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */
const missingImg = "https://tinyurl.com/missing-tv";
const TVmazeAPIurl = "http://api.tvmaze.com/";

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
          const response = await axios({
               baseURL: TVmazeAPIurl,
               url: "search/shows",
               method: "GET",
               params: {
                q: term,
               },
          });

return response.data.map(result => {
  const show = result.show;
  return {
    id: show.id ,
    name: show.name,
    summary: show.summary,
    image: show.image ? show.image.medium : missingImg ,
     }
   });
 }


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src= "${show.image}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

$showsList.on("click",".Show-getEpisodes", async function(){ //for displaying eps, does it ugly
  const showId = $(this).closest(".Show").data("show-id");    //may chnage all of this
  const episodes = await getEpisodesOfShow(showId);           //if i remove this whole chunk of code everything will be fine besides dispaying eps
  populateEpisodes(episodes);                                 //it omly displays at bottom of page episodes
  $episodesArea.show();
})
/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const response = await axios({
    baseURL: TVmazeAPIurl,
    url: `shows/${id}/episodes`,
    method: "GET",
  });
    return response.data.map(function(e){
      return {
        id: e.id,
        name: e.name,
        season: e.season,
        number: e.number,
      }
    });
 }

/** Write a clear docstring for this function... */

 function populateEpisodes(episodes) { 
    const clearEpList = document.querySelector("#episodesList");
    clearEpList.innerHTML = "";

    for(let episode of episodes){
      const epNSN = `${episode.name}(season ${episode.season}, episode ${episode.number})`
      const item = document.createElement("li");
       item.textContent = epNSN;
       episodesList.append(item);
    }
 }

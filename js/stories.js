"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <span class="star">
          <i class="far fa-star"></i>
        </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function putFavoritesOnPage() {
  console.debug("putStoriesOnPage");

  $favoritesList.empty();

  console.log(currentUser)

  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favoritesList.append($story);
  }

  $favoritesList.show();
}


// New function: get the data from the form, call the .addStory method
// you wrote, and then put that new story on the page.

async function addNewStoryToPage(evt) {
  console.debug("addNewStoryToPage", evt);
  evt.preventDefault();

  const newStory = {
    title: $("#submit-title").val(), 
    author: $("#submit-author").val(),
    url: $("#submit-url").val(),
    username: currentUser.username,
  }

  await storyList.addStory(currentUser, newStory);
  
  getAndShowStoriesOnStart();
  $submitStoryForm.trigger("reset");
  $submitStoryForm.hide();
}

$submitStoryForm.on("submit", addNewStoryToPage);

async function toggleFavoriteStatus(e) {
  let id = e.target.parentNode.parentNode.id;
  let star = e.target.parentNode.parentNode.children[0].children[0]

  let storyId = storyList.stories.find(story => story.storyId === id)

  if (star.className === "far fa-star") {
    star.className = "fa fa-star"
    await currentUser.addToFavorites(storyId)
  } else {
    star.className = "far fa-star"
    await currentUser.removeFromFavorites(storyId)
  }

  console.log(currentUser.favorites)

}

$allStoriesList.on("click", "i", toggleFavoriteStatus);

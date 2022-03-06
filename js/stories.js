"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
	storyList = await StoryList.getStories();
	$storiesLoadingMsg.remove();

	putStoriesOnPage();
	// putFavoritesOnPage();
	// putUserStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
	// console.debug("generateStoryMarkup", story);

	const hostName = story.getHostName();

	let showStar = Boolean(currentUser);

	return $(`
	<li id="${story.storyId}">
			${showDeleteBtn ? getDeleteBtnHTML() : ""}
			${showStar ? getFavStarHTML(story, currentUser) : ""}
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
	console.debug("putFavoritesOnPage");

	$favoritesList.empty();

	// console.log(currentUser);

	// loop through all of our stories and generate HTML for them
	for (let story of currentUser.favorites) {
		const $story = generateStoryMarkup(story);
		$favoritesList.append($story);
	}

	$favoritesList.show();
}

function putUserStoriesOnPage() {
	console.debug("putUserStoriesOnPage");

	$ownStoriesList.empty();

	// console.log(currentUser);

	// loop through all of our stories and generate HTML for them
	for (let story of currentUser.ownStories) {
		const $story = generateStoryMarkup(story, true);
		$ownStoriesList.append($story);
	}

	$ownStoriesList.show();
}

// New function: get the data from the form, call the .addStory method
// you wrote, and then put that new story on the page.

async function addNewStory(e) {
	console.debug("addNewStory", e);
	e.preventDefault();

	const newStory = {
		title: $("#submit-title").val(),
		url: $("#submit-url").val(),
		author: $("#submit-author").val(),
		username: currentUser.username,
	};

	const story = await storyList.addStory(currentUser, newStory);

	const $story = generateStoryMarkup(story);

	$allStoriesList.prepend($story);

	putStoriesOnPage();
	$submitStoryForm.trigger("reset");
	$submitStoryForm.hide();
}

$submitStoryForm.on("submit", addNewStory);

async function deleteStory(e) {
	console.debug("removeStoryFromPage", e);
	e.preventDefault();

	let storyId = $(e.target).closest("li")[0].id;
	console.dir(storyId);

	// remove story from story list
	await storyList.removeStory(currentUser, storyId);

	// await storyList.removeStory(currentUser, newStory);

	putUserStoriesOnPage();
}

$ownStoriesList.on("click", ".trash-can i", deleteStory);

async function toggleFavoriteStatus(e) {
	console.debug("toggleFavoriteStatus", e);
	let id = e.target.parentNode.parentNode.id;
	let star = e.target.parentNode.parentNode.children[0].children[0];

	let storyId = storyList.stories.find((story) => story.storyId === id);

	if (star.className === "far fa-star") {
		star.className = "fa fa-star";
		await currentUser.addToFavorites(storyId);
	} else {
		star.className = "far fa-star";
		await currentUser.removeFromFavorites(storyId);
	}

	// console.log(currentUser.favorites);
}

$storiesList.on("click", "i", toggleFavoriteStatus);

const getDeleteBtnHTML = () => {
	// if (currentUser) {
	return '<span class="trash-can"><i class="fas fa-trash-alt"></i></span>';
	// }
};

const getFavStarHTML = (story, user) => {
	const isFavorite = user.isFavorite(story);
	const star = isFavorite ? "fa" : "far";
	// console.log(star, isFavorite);
	return `
		<span class="star">
			<i class="${star} fa-star"></i>
		</span>
	`;
};

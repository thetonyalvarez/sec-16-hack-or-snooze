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

function generateStoryMarkup(story, showEditBtn = false, showDeleteBtn = false) {
	console.debug("generateStoryMarkup", story);

	const hostName = story.getHostName();

	let showStar = Boolean(currentUser);

	return $(`
	<li id="${story.storyId}">
			${showStar ? getFavStarHTML(story, currentUser) : ""}
			<a href="${story.url}" target="a_blank" class="story-link">
			${story.title}
			${showEditBtn ? getEditBtnHTML() : ""}
			${showDeleteBtn ? getDeleteBtnHTML() : ""}
			</a>
			<small class="story-hostname">(${hostName})</small>
			<small class="story-author">by ${story.author}</small>
			<small class="story-user">posted by ${story.username}</small>
			${story.username == currentUser.username ? `<form
				class="hidden"
				id="form-${story.storyId}"
				method="post"
			>
				<input id="story-author-input" class="story-author-input">
				<button class="btn btn-primary" type="submit">Update Author</button>
			</form>` : ""}
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
		const $story = generateStoryMarkup(story, true, true);
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


// Edit existing story
/**********************************************/
/**********************************************/
/**********************************************/
/**********************************************/

// QUESTION: How do I pass the "author" properly into the editStory() function in models.js (line 130)?

// So far, I have done the following:

// 1. I created a conditional <form> element with an input and button. This will serve as the way for the user to update the author
// 2. I added the "hidden" class so that it is not visible on load.
// 3. I added an event listener to show the form for the corresponding story only when the "edit" icon is clicked.

// Now, I cannot figure out how to pass the "author" from the form into the function so that the editStory() function can "PATCH" the data in the API and return the updated change to the author field

async function updateAuthor() {
	console.debug("updateAuthor")

	// const newAuthor = {
	// 	author: $("#story-author-input").val(),
	// }
	// console.log(newAuthor),

	// const newStory = {
	// 	title: $("#submit-title").val(),
	// 	url: $("#submit-url").val(),
	// 	author: $("#submit-author").val(),
	// 	username: currentUser.username,
	// };
	

	// const story = await storyList.editStory(currentUser, newStory);

	// console.debug("updateAuthor > story", story)
	// const $story = generateStoryMarkup(story);

	// $allStoriesList.prepend($story);

	// putStoriesOnPage();
	// $submitStoryForm.trigger("reset");
	// $submitStoryForm.hide();
	
	// $submitStoryForm.on("submit", addNewStory);
}


async function editStory(e) {
	console.debug("editStory", e);
	e.preventDefault();

	let $story = $(e.target).closest("li")[0];
	// let $form = $(e.target).closest("form")[0];
	let $storyId = $story.id;

	// updateAuthor(story)

	const form = $story.children[5]
	// const $form = $storyId
	// console.dir($form)
	$(form).show()

	// console.log($(`${$storyId} form`))

	$($story).on("submit", updateAuthor);





	// let author = "tonyauthor4"

	// // remove story from story list
	// let returnedStory = await storyList.editStoryAPI(currentUser, storyId, author);

	// console.log("returned author:", returnedStory.author)

	// story.children[3].innerText = "by " + returnedStory.author

}

$ownStoriesList.on("click", ".edit i", editStory);

/**********************************************/
/**********************************************/
/**********************************************/
/**********************************************/


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

$storiesList.on("click", ".star i", toggleFavoriteStatus);

const getEditBtnHTML = () => {
	return '<span class="edit"><i class="far fa-edit"></i></span>';
};

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

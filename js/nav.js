"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
	console.debug("navAllStories", evt);
	hidePageComponents();
	putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
	console.debug("navLoginClick", evt);
	hidePageComponents();
	$loginForm.show();
	$signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** Show submit form on click on "submit" */

function submitStoryClick(evt) {
	console.debug("submitStoryClick", evt);
	hidePageComponents();
	$allStoriesList.show();
	$submitStoryForm.show();
}

$navSubmit.on("click", submitStoryClick);

/** Show favorites */

function navFavoritesClick(evt) {
	console.debug("navFavoritesClick", evt);
	hidePageComponents();
	putFavoritesOnPage();
	$favoritesList.show();
}

$navFavorites.on("click", navFavoritesClick);

/** Show own stories */

const navMyStoriesClick = (evt) => {
	console.debug("navMyStoriesClick", evt);
	hidePageComponents();
	putUserStoriesOnPage();
	$ownStoriesList.show();
};

$navOwnStories.on("click", navMyStoriesClick);

/** When a user first logins in, update the navbar to reflect that. */

function mobileFlexToBlock(tag) {
	$(tag).removeClass("hidden")
	// $(tag).show();
	if (window.matchMedia('(max-width: 767px)').matches) {
		$(tag).css('display','block')
	} else if (window.matchMedia('(min-width: 768px)').matches) {
		$(tag).css('display','flex')
	}
}

function updateNavOnLogin() {
	console.debug("updateNavOnLogin");
	mobileFlexToBlock(".main-nav-links")
	$navLogin.hide();
	$navLogOut.show();
	$navUserProfile.text(`${currentUser.username}`).show();
}

/** Show user profile */

const navProfileClick = (evt) => {
	console.debug("navProfileClick", evt);
	hidePageComponents();
	showUserProfile();
	$userProfileSection.show();
};

$navUserProfile.on("click", navProfileClick);

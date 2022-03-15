function simulateAsyncCall(request) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			switch (request.method) {
				case "get":
					const user = getUser(request);
					if (user) {
						resolve({ status: 200, posts: user.posts });
					} else {
						resolve({ status: 404, message: "Not Found" });
					}
					break;
				case "post":
					if (passwordIsValid(request)) {
						addToPosts(request);
						resolve({ status: 200, message: "Added Post" });
					} else {
						resolve({ status: 401, message: "Unauthorized" });
					}
					break;
				default:
					resolve({ status: 400, message: "Bad Request" });
			}
		}, 300);
	});
}

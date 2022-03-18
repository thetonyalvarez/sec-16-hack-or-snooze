const { BASE_URL, config } = require("../models.js");
const axios = require("axios");
jest.mock("axios");

class MockUser {
	static login(username, password) {
		return axios
			.post({
				url: `${BASE_URL}/login`,
				config,
				data: { user: { username, password } },
			})
			.then((res) => res.user)
			.catch((error) => {
				console.log("There is an error", error);
			});
	}
}

const mockUser = {
	createdAt: "2022-02-28T03:32:14.031Z",
	favorites: [],
	loginToken: "128f7s9dg",
	name: "tony",
	ownStories: [],
	username: "tonyusername",
};

test("Return user data if login credentials are valid", () => {
	const mockResponse = { user: mockUser };

	axios.post.mockResolvedValue(mockResponse);

	return MockUser.login("tonyusername", "1234").then((data) =>
		expect(data).toEqual(mockUser)
	);
});

test("Return ERROR if login credentials are invalid", () => {
	axios.post.mockRejectedValue("Error: Rejected Value");

	return MockUser.login("tonyusername", "1234").then((data) =>
		expect(data).toEqual(undefined)
	);
});

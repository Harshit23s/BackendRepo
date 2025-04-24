// const axios = require("axios");

// // Function to test the GET route
// const testGetRoute = () => {
//   axios
//     .get(
//       "https://backend-repo-03-harshit-sharmas-projects-62e64f04.vercel.app/"
//     ) // Replace with your Vercel URL
//     .then((response) => {
//       console.log("Response:", response.data);
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// };

// // Run the test
// testGetRoute();

// ---------------------------------
const axios = require("axios");

axios
  .post("http://localhost:8000/api", {
    name: "John Doe",
    email: "john@example.com",
  })
  .then((res) => console.log(res.data))
  .catch((err) => console.error(err.response?.data || err));

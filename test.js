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

const axios = require("axios");

const testData = {
  name: "Harshit",
  email: "harshit@example.com",
  password: "123456",
};

async function runTest() {
  try {
    console.log("Sending to MongoDB...");
    const mongoRes = await axios.post(
      "http://localhost:8000/api/register-mongo",
      testData
    );
    console.log("MongoDB Response:", mongoRes.data);

    console.log("Sending to Google Sheets...");
    const sheetRes = await axios.post(
      "http://localhost:8000/api/register-sheets",
      testData
    );
    console.log("Google Sheets Response:", sheetRes.data);
  } catch (err) {
    console.error("ERROR DETAILS:");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error("Message:", err.message);
    }
  }
}

runTest();

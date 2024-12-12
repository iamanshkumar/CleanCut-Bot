// Select relevant DOM elements
const input = document.getElementById("input"); // File input element
const removeBtn = document.getElementById("removeBtn"); // Remove Background button
const downloadBtn = document.getElementById("downloadBtn"); // Download Image button
const mainDiv = document.querySelector(".main"); // Main container for dynamic content

// Function to remove the background of the image using the remove.bg API
async function removeBg(blob) {
  // Create FormData object and append necessary fields
  const formData = new FormData();
  formData.append("size", "auto"); // Auto-size the output image
  formData.append("image_file", blob); // Attach the image file

  // Make a POST request to the remove.bg API
  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { "X-Api-Key": "API KEY IS REMOVED DUE TO SECURITY REASONS" }, // API key for authentication
    body: formData,
  });

  // If the response is successful, return the processed image data
  if (response.ok) {
    return await response.arrayBuffer(); // Convert response to binary format
  } else {
    // If an error occurs, throw an error with status and message
    throw new Error(`${response.status}: ${response.statusText}`);
  }
}

// Enable the Remove Background button when a file is selected
input.addEventListener("change", () => {
  if (input.files.length > 0) {
    removeBtn.disabled = false; // Enable the button if a file is chosen
  }
});

// Handle click event for the Remove Background button
removeBtn.addEventListener("click", async () => {
  const file = input.files[0]; // Get the selected file
  if (!file) return; // If no file is selected, do nothing

  // Disable buttons to prevent multiple submissions
  removeBtn.disabled = true;
  downloadBtn.disabled = true;

  // Show loading animation while the API processes the image
  const loadingDiv = document.createElement("div");
  loadingDiv.innerHTML = `<p>Loading...</p>`; // Display "Loading..." text
  loadingDiv.classList.add("loading"); // Add a class for styling
  mainDiv.appendChild(loadingDiv); // Append loading message to the main container

  try {
    // Call the remove.bg function to process the image
    const resultData = await removeBg(file);
    const resultBlob = new Blob([resultData]); // Convert processed data to a Blob

    // Create a URL for the processed image and display it
    const imgURL = URL.createObjectURL(resultBlob);
    const resultImg = document.createElement("img");
    resultImg.src = imgURL; // Set the source to the processed image URL
    resultImg.alt = "Processed Image"; // Add alt text for accessibility
    resultImg.classList.add("result-img"); // Add a class for styling
    mainDiv.appendChild(resultImg); // Append the image to the main container

    // Enable the download button and set it up for the processed image
    downloadBtn.disabled = false;
    downloadBtn.addEventListener("click", () => {
      const link = document.createElement("a");
      link.href = imgURL; // Set the link href to the processed image URL
      link.download = "no-bg.png"; // Set the download filename
      link.click(); // Trigger the download
    });
  } catch (error) {
    // Handle errors and display an alert message
    alert(`Error: ${error.message}`);
  } finally {
    // Remove the loading animation and re-enable the Remove Background button
    loadingDiv.remove();
    removeBtn.disabled = false;
  }
});

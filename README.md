# Spotify Recommendation Demo

This project is a demonstration tool developed as part of my CE Project. It accompanies our presentation on the analysis of Spotify's recommendation algorithm. The demo simulates how Spotify recommends songs based on a user's region, listening history, and genre preferences. The application is built with Node.js, HTML, CSS, and JavaScript, and it uses a simple Express server to serve the content.

## Project Overview

The primary goal of this demo is to showcase a simplified version of Spotify's recommendation algorithm. Key features include:

- **Region and Genre Bias:** Initially, the recommendations are based on the user’s selected region. As the user interacts with the demo by playing songs, the algorithm learns their genre preferences and starts recommending similar genres, even from different regions.
- **Promoted Songs:** A fraction of the songs are marked as "Promoted" and receive an additional boost in the recommendation score.
- **Randomized Elements:** The last few recommendations in the list are completely random to simulate diversity in suggestions.
- **Interactive Playback:** Users can play, pause, and navigate between songs with a dynamic, responsive UI.

## Features

- **User Authentication:** Simple login with a username and region selection.
- **Dynamic Recommendations:** Recommendations update based on listening history and genre preference.
- **Themed UI:** Supports dark and light themes with a seamless switch.
- **Custom Player Controls:** Next, previous, and play/pause functionality.
- **Express Server:** Run the demo locally on [127.0.0.1:8000](http://127.0.0.1:8000).

## Installation

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/MasterKraid/Spotify-Recommendation-Analysis
   cd <repository-folder>

2. **Install Dependencies:**

   ```bash
   npm install
3. **Running the Server:**

    ```bash
    node server.js


This project is licensed under the MIT License.

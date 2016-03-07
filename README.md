# Cooee Prototype for EditorsLab
Surface topics and concepts of interest to the audience. Not atomic articles.
## Setup
``````
# Get repo
git clone https://github.com/njenkins/cooee.git
cd cooee

# Install dependencies
npm install

# Populate configs.js with required auth keys.

# Start app
npm start

# Project dashboard will now be accessible at http://localhost:3000/ui

```

## What does this do?
This project will:
* Harvest (n) urls from target listing page
* Extract the plain text from each of these pages
* Use Natural Language Processing to extract and rank concepts from these articles
* Extract the number of interactions on Facebook for the target url and use this number as a multiplier for each found concept
* Aggregate all concept scores and return the top 5
* Use the Flickr API to retrieve a thumbnail image for each concept

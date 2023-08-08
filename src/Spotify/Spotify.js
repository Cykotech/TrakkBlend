const clientId = "d1f6fd9bcb294516b4ae600e4d137f45";
const redirectUri = "http://localhost:5173/callback";
const baseUrl = "https://api.spotify.com";
let accessToken;

// function removeAccessTokenFromUrl() {
//   const { history, location } = window;
//   const { search } = location;
//   if (
//     search &&
//     search.indexOf("access_token") !== -1 &&
//     history &&
//     history.replaceState
//   ) {
//     // remove access_token from url
//     const cleanSearch = search
//       .replace(/(&|\?)access_token([_A-Za-z0-9=.%]+)/g, "")
//       .replace(/^&/, "?");
//     // replace search params with clean params
//     const cleanURL = location.toString().replace(search, cleanSearch);
//     // use browser history API to clean the params
//     history.replaceState({}, "", cleanURL);
//   }
// }

const Spotify = {
  getAccessToken() {
    // Checks if there is an existing access token
    if (accessToken) {
      return accessToken;
    }
    // Accesses the location's url and searches for the requested parameters
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    // .match() returns an array containing a string and the value of the regexp
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      // The first argument is what will happen when the timeout expires
      // The second argument is using expiresIn as the value and multiplying by 1000 to convert to milliseconds
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      // This is a method to alter the browser history without refreshing the page.
      // "Access Token" is the state object to associate the function with
      // null is the title parameter and in this context is ignored
      // "/" will display the root URL without query parameters
      window.history.pushState("Access Token", null, "/");
      // removeAccessTokenFromUrl();
      return accessToken;
      // If either the access token is invalid or expired, will redirect to request a new token
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  search(term) {
    // Calls a valid access token
    const accessToken = this.getAccessToken();
    return (
      // Creates a GET request using the declared url as the first parameter and puts the access token as the second parameter
      fetch(`${baseUrl}/v1/search?type=track&q=${term}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        // Awaits the response and converts the JSON into a JS object
      })
        .then((response) => {
          return response.json();
        })
        // Once the response is converted, if there is no tracks property, then an empty array is returned.
        .then((jsonResponse) => {
          if (!jsonResponse.tracks) {
            return [];
          }
          // Otherwise, the response is mapped as such.
          let trackArray = jsonResponse.tracks.items.map((track) => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
            image: track.album.images[0].url,
          }));
          return trackArray;
        })
    );
  },

  savePlaylist(name, trackUris) {
    const accessToken = this.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    return fetch(`${baseUrl}/v1/me`, { headers: headers })
      .then((response) => response.json())
      .then((jsonResponse) => {
        let userId = jsonResponse.id;
        return fetch(`${baseUrl}/v1/users/${userId}/playlists`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify({name: name})
        })
          .then((response) => response.json())
          .then(jsonResponse => {
            let playlistId = jsonResponse.id;
            return fetch(`${baseUrl}/v1/playlists/${playlistId}/tracks`, {
              headers: headers,
              method: 'POST',
              body: JSON.stringify({uris: trackUris})
            })
          });
      });
  },
};

export default Spotify;

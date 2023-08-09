const clientId = "d1f6fd9bcb294516b4ae600e4d137f45";
const redirectUri = "http://trakkblend.netlify.app/callback";
const baseUrl = "https://api.spotify.com";
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  search(term) {
    const accessToken = this.getAccessToken();
    return fetch(`${baseUrl}/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        if (!jsonResponse.tracks) {
          return [];
        }
        let trackArray = jsonResponse.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
          image: track.album.images[0].url,
        }));
        return trackArray;
      });
  },

  savePlaylist(name, trackUris) {
    if (!name || !trackUris) {
      return;
    }

    const accessToken = this.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    return fetch(`${baseUrl}/v1/me`, { headers: headers })
      .then((response) => response.json())
      .then((jsonResponse) => {
        let userId = jsonResponse.id;
        return fetch(`${baseUrl}/v1/users/${userId}/playlists`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify({ name: name }),
        })
          .then((response) => response.json())
          .then((jsonResponse) => {
            let playlistId = jsonResponse.id;
            return fetch(`${baseUrl}/v1/playlists/${playlistId}/tracks`, {
              headers: headers,
              method: "POST",
              body: JSON.stringify({ uris: trackUris }),
            });
          });
      });
  },
};

export default Spotify;

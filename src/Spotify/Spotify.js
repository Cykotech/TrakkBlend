const clientId = "d1f6fd9bcb294516b4ae600e4d137f45";
const redirectUri = "https://localhost:5173/callback";
const baseUrl = "https://api.spotify.com";
let accessToken;

const Spotify = {
  // getAccessToken() {
  //   if (accessToken) {
  //     return accessToken;
  //   }
  //   const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
  //   const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
  //   if (accessTokenMatch && expiresInMatch) {
  //     accessToken = accessTokenMatch[1];
  //     const expiresIn = Number(expiresInMatch[1]);
  //     window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
  //     window.history.pushState("Access Token", null, "/");
  //     return accessToken;
  //   } else {
  //     const accessUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
  //     window.location = accessUrl;
  //   }
  // },

  // Commented out implicit grant auth flow. Login button in App.jsx calls accountAuthorize. The browser error displays after Spotify authorization.

  accountAuthorize() {
    function generateRandomString(length) {
      let text = "";
      let possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }

    async function generateCodeChallenge(codeVerifier) {
      function base64encode(string) {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");
      }

      const encoder = new TextEncoder();
      const data = encoder.encode(codeVerifier);
      const digest = await window.crypto.subtle.digest("SHA-256", data);

      return base64encode(digest);
    }

    let codeVerifier = generateRandomString(128);

    generateCodeChallenge(codeVerifier).then((codeChallenge) => {
      let state = generateRandomString(16);
      let scope = "user-read-private user-read-email";

      localStorage.setItem("code_verifier", codeVerifier);

      let args = new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        state: state,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
      });

      window.location = "https://accounts.spotify.com/authorize?" + args;
    });
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

const clientId = import.meta.env.VITE_CLIENT_ID;
const redirectUri = "https://trakkblend.netlify.app/callback";
const baseUrl = "https://api.spotify.com";

const Spotify = {
  getAccessToken() {
    let access_token = window.localStorage.getItem("access_token");
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get("code");

    // function isTokenExpired(token) {
    //   if (!token || !token.expires_in) {
    //     return true;
    //   }

    //   const currentTimeInSeconds = Date.now() / 1000;
    //   const expirationTimeInSeconds = token.issued_at + token.expires_in;

    //   return currentTimeInSeconds >= expirationTimeInSeconds;
    // }

    function requestAccessToken() {
      let codeVerifier = localStorage.getItem("code_verifier");

      let body = new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier,
      });

      const response = fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("HTTP status " + response.status);
          }
          return response.json();
        })
        .then((data) => {
          localStorage.setItem("access_token", data.access_token);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      console.log(response);
    }

    // function refreshAccessToken() {
    //   const body = new URLSearchParams({grant_type: "refresh_token", refreshToken: , clientId: clientId})
    //   const response = fetch("https://accounts.spotify.com/api/token", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //     body: body,
    //   })
    //     .then((response) => {
    //       if (!response.ok) {
    //         throw new Error("HTTP status " + response.status);
    //       }
    //       return response.json();
    //     })
    //     .then((data) => {
    //       localStorage.setItem("access_token", data.access_token);
    //     })
    //     .catch((error) => {
    //       console.error("Error:", error);
    //     });
    // }

    if (!access_token) {
      requestAccessToken();
    }

    // if (isTokenExpired(access_token)) {
    //   refreshAccessToken();
    // }

    return access_token;
  },

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

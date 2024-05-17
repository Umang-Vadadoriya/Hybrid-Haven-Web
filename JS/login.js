import { API_RUN, WEB_RUN } from './URLCollection.js'

var APIURL = API_RUN;
var HostURL = WEB_RUN;

export function loadLogin() {
  const clientId = "Ov23lignJITTKppMvFvt";
  const redirectUri = HostURL;
  const scope = `user:email`

  
  // Construct Google OAuth URL with OpenID Connect for ID token
  const authUrl = `https://github.com/login/oauth/select_account?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;

  // Redirect user to Google OAuth URL
  window.location.href = authUrl;
}
  
export async function parseTokenFromUrl() {
  const currentUrl = new URL(window.location.href);
  
  const urlParams = currentUrl.searchParams;
  const code = urlParams.get("code");
  
  return code;
}

export async function getTokenFromCode(code){
    const url = `${APIURL}auth/code?code=${code}`;
    
    let Token = await fetch(url)
    .then((response) => response.text())
    .catch((error) => {
      console.error("Error fetching neighbourhood data:", error);
    });
  return Token;
}

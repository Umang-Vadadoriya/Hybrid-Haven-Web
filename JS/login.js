export function loadLogin() {
  const clientId = "Ov23lignJITTKppMvFvt";
  const redirectUri = "http://127.0.0.1:5500";
  const scope = "email profile openid";

  // Construct Google OAuth URL with OpenID Connect for ID token
  const authUrl = `https://github.com/login/oauth/select_account?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=read`;

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
    const url = `http://34.251.172.36:8080/auth/code?code=${code}`;
    
    let Token = await fetch(url)
    .then((response) => response.text())
    .catch((error) => {
      console.error("Error fetching neighbourhood data:", error);
    });
  return Token;
}

const fetchUserInfo = (idToken) => {
  const decodedToken = parseJwt(idToken);
  const email = decodedToken.email;
  const name = decodedToken.name;

  // Store email and name in session storage
  sessionStorage.setItem("email", email);
  sessionStorage.setItem("name", name);

  console.log("jwt token", idToken);
  console.log("User ID:", decodedToken.sub);
  console.log("Name:", name);
  console.log("Email:", email);

  console.log("session data", sessionStorage.getItem("name"));
};

const parseJwt = (token) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

const logout = () => {
  sessionStorage.clear();
  loadLogin();
};

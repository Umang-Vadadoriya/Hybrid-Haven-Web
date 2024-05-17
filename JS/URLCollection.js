const URLS = Object.freeze({ 
    API_LOCAL: `http://127.0.0.1:8080/`, 
    API_LIVE: `https://hybrid-haven.projects.bbdgrad.com/api/`, 
    WEB_LOCAL: `http://127.0.0.1:5500/`, 
    WEB_LIVE: `https://hybrid-haven.projects.bbdgrad.com/web/`
  });

// export default URLS.API_LOCAL;
export const API_RUN = URLS.API_LIVE;
export const WEB_RUN = URLS.WEB_LIVE;
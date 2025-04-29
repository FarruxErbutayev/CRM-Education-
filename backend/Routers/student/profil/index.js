import studentauth from "./auth/index.js";
import change_password from "./profil/change pasword.js";
import change_photos from "./profil/change photos.js";
import getprofil from "./profil/getprofil.js";
import logout from "./profil/logout.js";
// 
export default [
    { path: "/studentAuth", component: studentauth },
    { path: "/changePassword", component: change_password },
    { path: "/changePhotos", component: change_photos },
    { path: "/getProfile", component: getprofil },
    { path: "/logout", component: logout },
    
];

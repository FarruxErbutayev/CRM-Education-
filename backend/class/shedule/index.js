import router from "./add.js"
import add from "./add.js"
import editer from "./update.js"
import get from "./get.js"
import delete1 from "./delete.js"

export default [
    { path: "/add", route: add },
    {path : "/edit", route : editer},
    {path : "/get", route : get},
    {path : "/delete", route : delete1}
]
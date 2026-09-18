import { getData } from "./data.js"
import { disply_pagination , pagnation  } from "./pagination.js";
import { disply_offers } from "./render.js";

const offers = await getData();
disply_offers(pagnation(1,3,offers));
disply_pagination(offers)


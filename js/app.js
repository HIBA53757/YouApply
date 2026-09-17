import { getData } from "./data.js"
import { disply_offers } from "./render.js"

const offers = await getData();

disply_offers(offers)
import { disply_offers } from "./render.js"

export function pagnation(number,limit,array){
    const start = (number - 1) * limit
    const end = number * limit
    const items = array.slice(start,end)
    return items
}

export function disply_pagination(offers){

const limit_iteam_in_page = 3
const page_limet =  Math.round(offers.length / limit_iteam_in_page)

const div_contain_number_page = document.querySelector("#div_contain_number_page")



for( let i = 1 ; i <= page_limet ; i++){
    const page_number_div = document.createElement("div")
    page_number_div.setAttribute("class","w-9 h-9 flex items-center justify-center rounded-xl bg-blue-700 text-white text-sm font-bold")
    page_number_div.setAttribute("id","page_number_div")
    page_number_div.setAttribute("value",i)
    page_number_div.textContent = i
    div_contain_number_page.appendChild(page_number_div)

}

const page_number_div = document.querySelectorAll("#page_number_div")
page_number_div.forEach(div => {
    div.addEventListener("click",() => {
    const itime_value = div.getAttribute("value")
    const new_offers = pagnation(itime_value,limit_iteam_in_page,offers)
    disply_offers(new_offers)
})
});
}















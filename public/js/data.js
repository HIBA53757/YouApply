export async function getData() {
    try {
        const respons = await fetch("../data/offers.json")
        const data = await respons.json()
        return data
    } catch (error) {
        return error
    }
}









function findSelectedId(){
        const param = new URLSearchParams(window.location.search);
        const oferId = param.get('id')
        return oferId;
}

console.log(findSelectedId());

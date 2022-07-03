export function checkForName(data) {
    console.log("::: Running checkForName :::", data.text)
    event.preventDefault()

    if(data.text == "") {
        alert("Insert text please!")
    } else{
        return true
    }

}

function currentDate() {
    let today = new Date().toISOString().substr(0,10);
    document.querySelectorAll("input[type=date]").forEach(dateElem => {
        dateElem.max = today;
    });
}
onload = currentDate();
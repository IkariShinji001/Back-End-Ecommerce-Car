const splitDate = (date) =>{
    date = date.split("-");
    return {
        day: date[2],
        month: date[1],
        year: date[0],
    }
}

module.exports = splitDate;
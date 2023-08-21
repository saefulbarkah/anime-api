export const slug = (val) => {
    const results = val.split(' ').join('-');
    return results;
};
export const splitString = (val, index, key) => {
    if (!val)
        return;
    const splitPart = val.split(`${key}`);
    const lastPart = splitPart[splitPart.length - index];
    return lastPart;
};
export const fullMonth = (val) => {
    const [day, month] = val.split(' ');
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    console.log(month);
    const toFullMonth = monthNames[monthNames.indexOf(month)];
    const formatted = `${toFullMonth} ${day}`;
    return formatted;
};

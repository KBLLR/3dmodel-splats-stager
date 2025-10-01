export const getFormattedMonth = (date = new Date()) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()];
};

export const getCurrentYear = () => {
    return new Date().getFullYear().toString();
};

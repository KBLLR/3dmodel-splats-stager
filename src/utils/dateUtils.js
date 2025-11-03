/**
 * @file This file contains utility functions for working with dates.
 * @module dateUtils
 */

/**
 * Gets the abbreviated month name from a Date object.
 *
 * @param {Date} [date=new Date()] - The date to get the month from. Defaults to the current date.
 * @returns {string} The abbreviated month name (e.g., 'Jan', 'Feb').
 */
export const getFormattedMonth = (date = new Date()) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()];
};

/**
 * Gets the current year as a string.
 *
 * @returns {string} The current year as a string.
 */
export const getCurrentYear = () => {
    return new Date().getFullYear().toString();
};

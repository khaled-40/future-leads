/**
 * Title: 
 * Description: 
 * Author: MD Khaled Masud Hamim
 * Date: 03/04/2026
 */

const addDays = (days) => {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

// export the function
module.exports = { addDays };
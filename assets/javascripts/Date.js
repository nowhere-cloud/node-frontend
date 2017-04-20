'use strict';

// No Worries, all comments are deleted when compilng

// Get Pretty Printed DateTime
// Adapted from http://stackoverflow.com/questions/10211145/getting-current-date-and-time-in-javascript
// Optimized on ES6
class PrettyDate {
  /**
   * Creates an instance of PrettyDate.
   *
   * @memberOf PrettyDate
   */
  constructor() {
    this.now = new Date();
  }

  /**
   * Get Today's Date
   *
   * @returns {String} Today's Date
   *
   * @memberOf PrettyDate
   */
  getTodayDate() {
    return `${(this.now.getDate() < 10) ? '0' : ''}${this.now.getDate()}/${((this.now.getMonth() + 1) < 10) ? '0' : ''}${this.now.getMonth() + 1}/${this.now.getFullYear()}`;
  }

  /**
   * Get Current Time
   *
   * @returns {String} Current Time
   *
   * @memberOf PrettyDate
   */
  getCurrentTime() {
    return `${(this.now.getHours() < 10) ? '0' : ''}${this.now.getHours()}:${(this.now.getMinutes() < 10) ? '0' : ''}${this.now.getMinutes()}:${(this.now.getSeconds() < 10) ? '0' : ''}${this.now.getSeconds()}`;
  }

  /**
   * Get Created Raw JS Date Object
   *
   * @returns {Date} JavaScript Raw Date Object
   *
   * @memberOf PrettyDate
   */
  getJSDateObj() {
    return this.now;
  }
}

module.exports = PrettyDate;

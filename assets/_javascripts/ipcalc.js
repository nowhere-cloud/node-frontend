'use strict';

/**
 * Denary to Hexadecimal Number
 * @param {[type]} DEC [description]
 */
const DEC2HEX = (DEC) => {
  return parseInt(DEC, 10).toString(16);
};

const DEC2HEXp = (DEC) => {
  let result = parseInt(DEC, 10).toString(16);
  return result.length === 1 ? '0' + result : result;
};

/**
 * Generate Mapped IPv6 from IPv4
 * @param {String} IP4 IPv4
 */
const GenerateIP6 = (IP4) => {
  let splitted = IP4.trim().split('.');
  return `::FFFF:${DEC2HEX(splitted[0])}${DEC2HEXp(splitted[1])}:${DEC2HEX(splitted[2])}${DEC2HEXp(splitted[3])}`;
};

'use strict';

module.exports = function(event, payload) {
  return `{"Event":"${event}","Payload":${payload}}`;
};

const modalName = (modal_name) => {
  const modal = require("../models/" + `${modal_name}` + ".model");
  return modal;
};

module.exports = modalName;

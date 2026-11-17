"use strict";

const uploadFolder = (folder) => {
  return (req, res, next) => {
    req.uploadFolder = folder;
    next();
  };
};

module.exports = uploadFolder;
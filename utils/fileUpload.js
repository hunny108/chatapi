const path = require('path');
const fs = require('fs');

const handleFileUpload = (file) => {
  const uploadPath = path.join(__dirname, '../uploads', file.name);
  file.mv(uploadPath, (err) => {
    if (err) throw err;
  });
  return '/uploads/' + file.name;
};

module.exports = handleFileUpload;
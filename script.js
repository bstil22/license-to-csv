const checker = require('license-checker');
const fs = require('fs');

const removeDuplicates = a => [...new Set(a)];

const transformJSON = (name, item) => {
  return {
    name: name,
    repository: item.repository,
    publisher: item.publisher,
    email: item.email,
    url: item.url,
    licenses: item.licenses,
    license_link: item.licenses && licenseLink(item.licenses)
  };
};

const licenseLink = license => `https://opensource.org/licenses/${license}`;

const buildCSV = rows => {
  try {
    const header = Object.keys(rows[0]);
    let csv = rows.map(row =>
      header.map(fieldName => JSON.stringify(row[fieldName])).join(',')
    );
    csv.unshift(header.join(','));
    return csv.join('\r\n');
  } catch (e) {
    throw new Error(e);
  }
};

checker.init(
  {
    start: process.cwd(),
    exclude: true
  },
  function(err, json) {
    if (err) {
      throw new Error(err);
    } else {
      const modules = removeDuplicates(Object.keys(json));
      const rows = modules.map(module => transformJSON(module, json[module]));
      const CSV = buildCSV(rows);
      fs.writeFile(`${process.cwd()}/enterprise.csv`, CSV, function(err) {
        if (err) {
          throw new Error(err);
        }

        console.log('File Saved Successfully');
      });
    }
  }
);

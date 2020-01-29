const prompt = require("prompt");
const shell = require("shelljs");
const fs = require("fs");
const colors = require("colors/safe");
const path = require("path");

// Set prompt as green and use the "Replace" text
prompt.message = colors.green("Replace");
module.exports = (args, options, logger) => {
  const type = options.type || "styled-function";
  const templatePath = `${__dirname}/../templates/${args.template}/${type}`;
  const localPath = process.cwd();
  const argPath = options.path || "";
  const variables = require(`${templatePath}/_variables`);

  prompt.start().get(variables, (err, result) => {
    const newDir = result[variables[0]];
    const newDirPath = `${localPath}${path.sep}${argPath}${path.sep}${newDir}`;
    console.log(newDirPath);
    if (fs.existsSync(templatePath)) {
      logger.info("Copying files…");
      shell.mkdir("-p", `${argPath}${path.sep}${newDir}`);
      shell.cp("-R", `${templatePath}/*`, newDirPath);
      logger.info("✔ The files have been copied!");
    } else {
      logger.error(`The requested template for ${args.template} wasn't found.`);
      process.exit(1);
    }

    if (fs.existsSync(`${newDirPath}/_variables.js`)) {
      shell.rm(`${newDirPath}/_variables.js`);
    }

    logger.info("Please fill the following values…");

    logger.info(variables[0]);

    shell.mv(
      "-f",
      `${newDirPath}/[COMPONENT].js`,
      `${newDirPath}/${result[variables[0]]}.js`
    );
    shell.cd(newDirPath);
    shell.ls("-Rl", ".").forEach(entry => {
      if (entry.isFile()) {
        variables.forEach(variable => {
          shell.sed(
            "-i",
            `\\[${variable.toUpperCase()}\\]`,
            result[variable],
            entry.name
          );
        });
      }
    });

    logger.info("✔ Success!");
  });
};

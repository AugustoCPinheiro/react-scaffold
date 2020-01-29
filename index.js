#! /usr/bin/env node
const prog = require("caporal");
const createCmd = require("./lib/create");

prog
  .version("1.0.0")
  .command("create", "Create a new artifact")
  .alias("c")
  .argument("<template>", "Template to use")
  .option(
    "--type <type>",
    "Which <type> of the template is going to be created, if not provided, will use styled-function",
    opt => {
      if (!["styled-funtion", "function"].find(curr => curr === opt)) {
        throw new Error("No such template");
      }
      return opt;
    }
  )
  .option(
    "--path <path>",
    "Where to create the folder, if not provided, the folder will be created in ./"
  )
  .action(createCmd);

prog.parse(process.argv);

const fs = require("fs");
const fse = require("fs-extra");
const childProcess = require("child_process");

if (fs.existsSync("./build")) {
  fse.removeSync("./build");
}

childProcess.execSync("ng build", { stdio: "inherit" });

fse.moveSync("./build", "./server/dist/server/build", { overwrite: true });

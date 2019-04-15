const Lbry = require("./lbry");

Promise.all([Lbry.file_delete({ claim_name: "bitcoin" }), Lbry.file_delete({ claim_name: "crypto" })])
  .then(() => {
    console.log("Cleaned up");
    console.log("Starting requests");
    startScript();
  })
  .catch(console.log);

function startScript() {
  const promises = Array(1000)
    .fill(null)
    .map(() => Lbry.resolve({ urls: ["lbry://one"] }));

  setTimeout(() => {
    console.time("resolve");
    Lbry.resolve({ urls: ["lbry://bitcoin"] }).then(() => {
      console.timeEnd("resolve");
    });

    console.time("claim_search");
    Lbry.claim_search({ claim_id: "c51f09467930d70e6c2955093fd8094cc102152a" })
      .then(() => {
        console.timeEnd("claim_search");
      })
      .catch(console.log);

    console.time("get");
    Lbry.get({ uri: "lbry://bitcoin" })
      .then(() => {
        console.timeEnd("get");
      })
      .catch(console.log);

    console.time("get 2");
    Lbry.get({ uri: "lbry://one" })
      .then(() => {
        console.timeEnd("get 2");
      })
      .catch(console.log);
  }, 1500);
}

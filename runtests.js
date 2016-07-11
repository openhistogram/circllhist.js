var test = require('./circllhist_test.js')
test(
  { ok: function() {},
    notok: function(err) {
      console.log(err);
      process.exit(-2);
    }
  }
)

console.log("ok");

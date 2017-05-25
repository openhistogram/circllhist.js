var circllhist = require('./circllhist.js');

function circllhist_test(opts) {
if (!opts) opts = {};
var tcount = 1;
var failed = 0;
var test_desc = "??";
var double_to_hist_bucket = circllhist.prototype.double_to_hist_bucket;
var hist_bucket_to_double = circllhist.prototype.hist_bucket_to_double;
var hist_bucket_to_double_bin_width = circllhist.prototype.hist_bucket_to_double_bin_width
var ok = opts.ok || function() {
  var args = Array.prototype.slice.call(arguments);
  document.write("<pre>ok " + (tcount++) + " - " + test_desc + " " + args.join(" ") + "\n</pre>");
}
var notok = opts.notok || function() {
  var args = Array.prototype.slice.call(arguments);
  document.write("<pre>not ok " + (tcount++) + " - " + test_desc + " " + args.join(" ") + "\n</pre>");
  failed++;
}
function is(expr) { 
  return function () { if(expr) { ok(); } else { notok(); } }
}
function T(name, f) {
  if (f==null) {
    f = name;
    name = "unspecified";
  }
  test_desc = name;
  f();
  test_desc = "??";
}

function double_equals(a,b) {
  var r, diff, max = Math.abs(a);
  if(Math.abs(b) > max) max = Math.abs(b);
  if(max == 0) return true;
  diff = b-a;
  r = diff/max;
  if(Math.abs(r) < 0.0001) return true;
  return false;
}
function bucket_tests() {
  var b;

  b = double_to_hist_bucket(0);
  T("0 = [0,0]", is(b.val == 0 && b.exp == 0));

  b = double_to_hist_bucket(9.9999e-129);
  T("9.9999e-129 = [0,0]", is(b.val == 0 && b.exp == 0));

  b = double_to_hist_bucket(1e-128);
  T("1e-128 = [10,-128]", is(b.val == 10 && b.exp == -128));

  b = double_to_hist_bucket(1.00001e-128);
  T("1.00001e-128 = [10,-128]", is(b.val == 10 && b.exp == -128));

  b = double_to_hist_bucket(1.09999e-128);
  T("1.09999e-128 = [10,-128]", is(b.val == 10 && b.exp == -128));

  b = double_to_hist_bucket(1.1e-128);
  T("1.1e-128 = [11,-128]", is(b.val == 11 && b.exp == -128));

  b = double_to_hist_bucket(1e127);
  T("1e127 = [10,127]", is(b.val == 10 && b.exp == 127));

  b = double_to_hist_bucket(9.999e127);
  T("9.999e127 = [99,127]", is(b.val == 99 && b.exp == 127));

  b = double_to_hist_bucket(1e128);
  T("1e128 = [-1,0]", is(b.val == 0xff && b.exp == 0));

  // negative range

  b = double_to_hist_bucket(-9.9999e-129);
  T("-9.9999e-129 = [0,0]", is(b.val == 0 && b.exp == 0));

  b = double_to_hist_bucket(-1e-128);
  T("-1e-128 = [-10,-128]", is(b.val == -10 && b.exp == -128));

  b = double_to_hist_bucket(-1.00001e-128);
  T("-1.00001e-128 = [-10,-128]", is(b.val == -10 && b.exp == -128));

  b = double_to_hist_bucket(-1.09999e-128);
  T("-1.09999e-128 = [-10,-128]", is(b.val == -10 && b.exp == -128));

  b = double_to_hist_bucket(-1.1e-128);
  T("-1.1e-128 = [-11,-128]", is(b.val == -11 && b.exp == -128));

  b = double_to_hist_bucket(-1e127);
  T("-1e127 = [-10,127]", is(b.val == -10 && b.exp == 127));

  b = double_to_hist_bucket(-9.999e127);
  T("-9.999e127 = [-99,127]", is(b.val == -99 && b.exp == 127));

  b = double_to_hist_bucket(-9.999e127);
  T("-9.999e127 = [-99,127]", is(b.val == -99 && b.exp == 127));

  b = double_to_hist_bucket(-1e128);
  T("-1e128 = [-1,0]", is(b.val == 0xff && b.exp == 0));

  b = double_to_hist_bucket(9.999e127);
  T("9.999e127 = [99,127]", is(b.val == 99 && b.exp == 127));
}

function build(vals) {
  out = new circllhist();
  for(var i=0;i<vals.length;i++)
    out.insert(vals[i], 1);
  return out;
}

function merge_test(s1,s2,expect) {
  return function() {
    h1 = build(s1);
    h2 = build(s2);
    h1.merge(h2);
    if(h1.bvs.length != expect.length) return notok("merge_test wrong buckets " + h1.bvs.length + "!=" + expect.length);
    for(var i=0; i<h1.bvs.length; i++) {
      if (hist_bucket_to_double(h1.bvs[i].bucket) != expect[i][0]) return notok("merge_test bucket value mismatch");
      if (h1.bvs[i].count != expect[i][1]) return notok("merge_test bucket count mismatch");
    }
    return ok("merge_test");
  }
}

function merge_tests() {
  T("m1", merge_test([ 0, 2, 4, 6, 8 ], [ 1, 3, 5, 7, 9 ],
             [ [0,1], [1,1], [2,1], [3,1], [4,1], [5,1], [6,1], [7,1], [8,1], [9,1] ]));
  T("m2", merge_test([ 1, 3, 5, 7, 9 ], [ 0, 2, 4, 6, 8 ],
             [ [0,1], [1,1], [2,1], [3,1], [4,1], [5,1], [6,1], [7,1], [8,1], [9,1] ]));
  T("m3", merge_test([ 0, 3, 5, 7, 9 ], [ 0, 2, 4, 6, 9 ],
             [ [0,2], [2,1], [3,1], [4,1], [5,1], [6,1], [7,1], [9,2] ]));
}

function test1(val, b, w) {
  return function () {
    tin = double_to_hist_bucket(val);
    out = hist_bucket_to_double(tin);
    interval = hist_bucket_to_double_bin_width(tin);
    if(out < 0) interval *= -1.0;
    if(double_equals(b,out)) ok("transitive");
    else notok("(" + val + " bin " + out + " != " + b + ")\n", val, out, b);
    if(double_equals(w,interval)) ok("interval");
    else notok("(" + val + " width " + interval + " != " + w + ")\n", val, interval, w);
  }
}

function mean_test(vals, expected) {
  return function() {
    h = build(vals);
    m = h.approx_mean();
    if(double_equals(m,expected)) ok();
    else notok("(mean() -> " + m + " != " + expected + ")\n");
  }
}
function q_test(vals, tin, expected) {
  return function () {
    var h = build(vals);
    var out = []
    var rv = h.approx_quantile(tin, out);
    if(rv != 0) notok("quantile ->", rv);
    else {
      for(var i=0;i<tin.length;i++) {
        if(!double_equals(out[i], expected[i])) {
          notok("q(" + tin[i] + ") -> " + out[i] + " != " + expected[i]);
          return;
        }
      }
      ok();
    }
  }
}

return function() {
    bucket_tests();
    merge_tests();
  
    T("test1(43.3, 43, 1)", test1(43.3, 43, 1));
    T("test1(99.9, 99, 1)", test1(99.9, 99, 1));
    T("test1(10, 10, 1)", test1(10, 10, 1));
    T("test1(1, 1, 0.1)", test1(1, 1, 0.1));
    T("test1(0.0002, 0.0002, 0.00001)", test1(0.0002, 0.0002, 0.00001));
    T("test1(0.003, 0.003, 0.0001)", test1(0.003, 0.003, 0.0001));
    T("test1(0.3201, 0.32, 0.01)", test1(0.3201, 0.32, 0.01));
    T("test1(0.0035, 0.0035, 0.0001)", test1(0.0035, 0.0035, 0.0001));
    T("test1(-1, -1, -0.1)", test1(-1, -1, -0.1));
    T("test1(-0.00123, -0.0012, -0.0001)", test1(-0.00123, -0.0012, -0.0001));
    T("test1(-987324, -980000, -10000)", test1(-987324, -980000, -10000));
  
    s1= [ 0.123, 0, 0.43, 0.41, 0.415, 0.2201, 0.3201, 0.125, 0.13 ];
    T("mean_test(s1, 0.24444)", mean_test(s1, 0.24444));
  
    var h = [ 1 ];
    var qin = [ 0, 0.25, 0.5, 1 ];
    var qout = [ 1, 1.025, 1.05, 1.1 ];
    T("[ 1 ] <- q[ 0, 0.25, 0.5, 1 ] -> [ 1, 1.025, 1.05, 1.1 ]", q_test(h, qin, qout));
 
    var qin2 = [ 0, 0.95, 0.99, 1.0 ];
    var qout2 = [ 0, 0.4355, 0.4391, 0.44 ];
    T("[s1] <- q[[ 0, 0.95, 0.99, 1.0 ] -> [ 0, 0.4355, 0.4391, 0.44 ]", q_test(s1, qin2, qout2));
  
    var s3 = [ 1.0, 2.0 ];
    var qin3 = [ 0.5 ];
    var qout3 = [ 1.1 ];
    T("[ 1.0, 2.0 ] <- q[ 0.5 ] -> [ 1.1 ]", q_test(s3, 2, qin3, 1, qout3));

    return failed ? false : true;
  }
}

if( typeof exports !== 'undefined' ) {
  if( typeof module !== 'undefined' && module.exports ) {
    exports = module.exports = circllhist_test
  }
  exports.circllhist_test = circllhist_test
}
else {
  root.circllhist_test = circllhist_test
}

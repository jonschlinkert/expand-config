module.exports = [ { orig: 
     { cwd: 'test/fixtures/a',
       src: [ '*.hbs' ],
       dest: 'one/',
       ext: '.md',
       prefixBase: true },
    src: [ 'test/fixtures/a/d.hbs', 'test/fixtures/a/e.hbs' ],
    dest: 'one/' },
  { orig: 
     { cwd: 'test/fixtures/b',
       src: [ '*.hbs' ],
       dest: 'two/',
       ext: '.md',
       prefixBase: true },
    src: [ 'test/fixtures/b/f.hbs' ],
    dest: 'two/' },
  { orig: 
     { cwd: 'test/fixtures/c',
       src: [ '*.hbs' ],
       dest: 'three/',
       ext: '.md',
       prefixBase: true },
    src: [ 'test/fixtures/c/g.hbs' ],
    dest: 'three/' } ];
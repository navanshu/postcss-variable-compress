const postcss = require('postcss');

const plugin = require('./index');

async function run (input, output, opts = []) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined });
  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
}


it('Shorten css variables', async () => {
  await run(
    `:root {
--first-color: #16f;
--second-color: #ff7;
--2: #000;
}

#firstParagraph {
  background-color: var(--first-color);
  color: var(--second-color);
}

#secondParagraph {
  background-color: var(--second-color);
  color: var(--first-color);
}

#container {
  --first-color: #290;
}

#thirdParagraph {
  background-color: var(--first-color);
  color: var(--second-color);
}

.section-title {
  color: var(--primary-color, var(--black, #222));
}`,
    `:root {
--0: #16f;
--1: #ff7;
--2: #000;
}

#firstParagraph {
  background-color: var(--0);
  color: var(--1);
}

#secondParagraph {
  background-color: var(--1);
  color: var(--0);
}

#container {
  --0: #290;
}

#thirdParagraph {
  background-color: var(--0);
  color: var(--1);
}

.section-title {
  color: var(--primary-color, var(--3, #222));
}`,
    [
      '--primary-color',
      '--2'
    ]
  );
});

it('Support reloading. Now the plugin will reset mapped variables', async () => {
  await run(`:root{--first-color: #16f;--second-color: #ff7;}`, `:root{--0: #16f;--1: #ff7;}`, []);
  await run(`:root{--second-color: #ff7;--first-color: #16f;}`, `:root{--0: #ff7;--1: #16f;}`, []);
});
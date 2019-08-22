#!/usr/bin/env node

// ability to require/import TypeScript files
require('ts-node').register({
	typeCheck: false,
	transpileOnly: true,
	files: true,

	// manually supply our own compilerOptions, otherwise if we run this file
	// from another project's location (f.e. from Saffron) then ts-node will use
	// the compilerOptions from that other location, which may not work.
	compilerOptions: require('../tsconfig.json').compilerOptions,
})

require('./cli.ts')
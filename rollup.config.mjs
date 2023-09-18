import pkg from "./package.json" assert { type: "json" };

import { babel } from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

const production = !process.env.ROLLUP_WATCH;
const extensions = [ ".js", ".jsx", ".ts", ".tsx" ];
const pathsToWatch =[ 'src/**' ];

process.env.NODE_ENV = production ? 'production' : '';

const external = [
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.dependencies || {}),
  "react/jsx-runtime"
];

export default [
  {
    input: "./src/index.tsx",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        exports: "named",
        sourcemap: !production,
      },
      {
        file: pkg.module,
        format: "es",
        exports: "named",
        sourcemap: !production,
      },
      // {
      //   name: "react-reducer-ssr",
      //   file: pkg.browser,
      //   format: "umd",
      //   exports: "named",
      //   sourcemap: !production,
      // },
    ],
    external,
    plugins: [
      resolve({
        extensions,
      }),
      commonjs(),
      babel({
        exclude: /^(.+\/)?node_modules\/.+$/,
        extensions,
        babelHelpers: "runtime",
        sourcemap: !production,
        skipPreflightCheck: true
      }),
      production && terser(),
    ],
    watch: {
      paths: pathsToWatch
    }
  }
];

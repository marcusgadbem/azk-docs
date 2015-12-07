/**
 * Documentation: http://docs.azk.io/Azkfile.js
 */

// Adds the systems that shape your system
systems({
  'docs-azk': {
    image: { docker: "azukiapp/node" },

    // Steps to execute before running instances
    provision: [
      "npm i",
      "npm i gitbook-cli", // gitbook-cli has to be installed after gitbook
      "node_modules/.bin/gitbook versions:link node_modules/gitbook 2.5.0",
      "node_modules/.bin/gitbook -v 2.5.0 install content",
    ],
    workdir: "/azk/#{manifest.dir}",
    shell: "/bin/bash",
    command: [
      "node_modules/.bin/gitbook versions:link node_modules/gitbook 2.5.0 && ",
      "node_modules/.bin/gitbook -v 2.5.0 serve --port $HTTP_PORT content"
    ],
    wait: {"retry": 20, "timeout": 2000},
    mounts: {
      '/azk/#{manifest.dir}'              : path("."),
      '/azk/CONTRIBUTING.md'              : path("../CONTRIBUTING.md"),
      '/azk/#{manifest.dir}/node_modules' : persistent("node_modules"),
      '/azk/#{manifest.dir}/content/node_modules': persistent("content/node_modules"),
    },
    scalable: {"default": 1},
    http: {
      // docs-azk.
      domains: [ "#{system.name}.#{azk.default_domain}" ]
    },
    ports: {
      http:       "5000/tcp",
      livereload: "35729:35729/tcp",
    },
  },
});

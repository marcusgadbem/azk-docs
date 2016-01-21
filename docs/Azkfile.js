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
      "gitbook versions:link node_modules/gitbook 2.6.7",
      "gitbook install content",
    ],
    workdir: "/azk/#{manifest.dir}",
    shell: "/bin/bash",
    command: "gitbook versions:link node_modules/gitbook 2.6.7 && gitbook serve --port $HTTP_PORT content --lrport $LIVERELOAD_PORT",
    wait: {"retry": 20, "timeout": 3000},
    mounts: {
      '/azk/#{manifest.dir}'               : sync("."),
      '/azk/CONTRIBUTING.md'               : path("../CONTRIBUTING.md"),
      '/azk/#{manifest.dir}/content/pt-BR/styles' : sync("./content/common/styles"),
      '/azk/#{manifest.dir}/content/en/styles' : sync("./content/common/styles"),
      '/azk/#{manifest.dir}/node_modules'  : persistent("node_modules"),
      '/azk/#{manifest.dir}/content/_book' : persistent("book"),
      '/azk/#{manifest.dir}/content/node_modules': persistent("content/node_modules"),
      '/root/.npm': persistent("npm-cache"),
    },
    scalable: {"default": 1},
    http: {
      // docs-azk.
      domains: [ "#{system.name}.#{azk.default_domain}" ]
    },
    envs: {
      PATH: "/azk/#{manifest.dir}/node_modules/.bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
    },
    ports: {
      http:       "5000/tcp",
      livereload: "35730:35730/tcp",
    },
  },
});

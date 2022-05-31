module.exports = {
  apps: [
    {
      name: "api",
      script: "index.js",
      watch: true,
      // Delay between restart
      watch_delay: 1000,
      ignore_watch: ["node_modules", "public/images"],
    },
  ],
};

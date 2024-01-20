module.exports = {
  apps: [
    {
      name: "JCWDOL-011-02", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/dist/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 3102,
      },
      time: true,
    },
  ],
};

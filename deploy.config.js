module.exports = {
    apps: [
      {
        name: "JCWDOL-012-04", // Format JCWD-{batchcode}-{groupnumber}
        script: "./apps/api/dist/src/index.js",
        env: {
          NODE_ENV: "production",
          PORT: 1204,
        },
        time: true,
      },
    ],
  };
  
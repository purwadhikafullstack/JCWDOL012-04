module.exports = {
    apps: [
      {
        name: "JCWDOL-012-04", // Format JCWD-{batchcode}-{groupnumber}
        script: "./apps/api/src/index.ts",
        env: {
          NODE_ENV: "production",
          PORT: 1204,
        },
        time: true,
      },
    ],
  };
  
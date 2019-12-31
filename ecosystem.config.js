module.exports = {
  apps : [{
    name        : "pull-offers",
    script      : "./pull-offers.js",
    cron_restart: "0 * * * *",
    watch       : false,
    autorestart: false
  },
  {
    name        : "escapes-helper",
    script      : "npm",
    args        : "start",
    watch       : true,
    env: {
      "NODE_ENV": "development",
    },
    env_production : {
       "NODE_ENV": "production"
    }
  }]
}

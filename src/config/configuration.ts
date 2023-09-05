export default () => ({
  port: parseInt(process.env.API_PORT, 10) || 3000,
  mailing: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
  },
});

export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    apiUrl: process.env.API_URL || 'http://localhost:3000',
    database: {
        uri: process.env.DATABASE_URI,
    },
    weatherApiKey: process.env.WEATHER_API_KEY,
});

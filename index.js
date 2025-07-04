const app = require('./app');
const PORT = process.env.PORT || 5000;
require('dotenv').config();


app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());  // Enable Cross-Origin Requests
app.use(bodyParser.json());  // Parse incoming JSON requests

// PostgreSQL client
const client = new Client({
    host: 'dpg-cv3elbl2ng1s73fvca0g-a',
    port: 5432,
    user: 'agallobrian', 
    password: 'TkAVNlmySam1CyEgi6II43fMo5A6a6D5', 
    database: 'agallodb' 
});

// Connect to the database
client.connect();

// Endpoint to handle booking form submission
app.post('/submit-booking', async (req, res) => {
    const { name, contact, service, details } = req.body;

    try {
        // Insert booking data into the PostgreSQL table
        const query = `
            INSERT INTO bookings (name, contact_method, contact_info, service, details)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `;
        const values = [name, contact.includes('@') ? 'email' : 'mobile', contact, service, details];
        
        const result = await client.query(query, values);
        const bookingId = result.rows[0].id;

        // Return success response
        res.status(200).json({ message: 'Booking submitted successfully', bookingId });
    } catch (error) {
        console.error('Error inserting booking:', error);
        res.status(500).json({ message: 'Error submitting booking' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

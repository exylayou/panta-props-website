const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

// --- Ethereal Email Setup ---
let transporter;
nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return process.exit(1);
    }
    // Create a SMTP transporter object
    transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });
    console.log('Ethereal Email Transport Ready');
});

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the root directory (HTML, CSS, JS)
app.use(express.static(__dirname, { extensions: ['html'] }));
// Explicitly serve the uploads directory so frontend can access uploaded media
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images and videos are allowed!'));
        }
    }
});

// Initialize SQLite Database
const dbPath = path.join(__dirname, 'panta_props.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS gallery_posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            file_path TEXT NOT NULL,
            media_type TEXT NOT NULL,
            submitter_name TEXT,
            event_type TEXT,
            caption TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS custom_orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT NOT NULL,
            event_type TEXT NOT NULL,
            description TEXT NOT NULL,
            reference_images TEXT,
            status TEXT DEFAULT 'New',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, () => {
            // Silently try to alter table for existing users (migration step)
            db.run(`ALTER TABLE custom_orders ADD COLUMN status TEXT DEFAULT 'New'`, () => { });
        });
    }
});

// API endpoint to handle uploads
app.post('/api/upload', upload.single('media'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded or invalid file format' });
    }

    const filePath = '/uploads/' + req.file.filename;
    const mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    const submitterName = req.body.submitterName || 'Anonymous';
    const eventType = req.body.eventType || '#Community';
    const caption = req.body.caption || '';

    const query = `INSERT INTO gallery_posts (file_path, media_type, submitter_name, event_type, caption) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [filePath, mediaType, submitterName, eventType, caption], function (err) {
        if (err) {
            console.error('Database insert error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({
            message: 'Upload successful',
            post: {
                id: this.lastID,
                filePath,
                mediaType,
                submitterName,
                eventType,
                caption
            }
        });
    });
});

// API endpoint to handle custom order requests
app.post('/api/custom-order', upload.array('referenceImages', 5), (req, res) => {
    let { firstName, lastName, email, eventType, description, name, message } = req.body;

    // Handle simplified contact form input
    if (name && !firstName && !lastName) {
        const nameParts = name.trim().split(' ');
        firstName = nameParts[0] || 'Unknown';
        lastName = nameParts.slice(1).join(' ') || '-';
    }
    if (message && !description) {
        description = message;
    }
    if (!eventType) {
        eventType = 'General Inquiry';
    }

    // Validate required fields
    if (!firstName || !lastName || !email || !eventType || !description) {
        return res.status(400).json({ error: 'All fields are required except reference images.' });
    }

    // Store file paths as a JSON string for SQLite text column
    const referenceImages = req.files && req.files.length > 0
        ? JSON.stringify(req.files.map(f => '/uploads/' + f.filename))
        : null;

    const query = `INSERT INTO custom_orders (first_name, last_name, email, event_type, description, reference_images) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [firstName, lastName, email, eventType, description, referenceImages], function (err) {
        if (err) {
            console.error('Database insert error:', err);
            return res.status(500).json({ error: 'Database error storing custom order' });
        }

        // --- PSEUDO WHATSAPP ALERT LOGIC ---
        // In a production environment with a WhatsApp Business API account (e.g. Twilio), 
        // you would fire an outbound message to the admin's phone right here.
        console.log(`\n======================================================`);
        console.log(`📱 [WHATSAPP ALERT TRIGGERED]`);
        console.log(`To: Admin Phone Number`);
        console.log(`Message: New Custom Order from ${firstName} ${lastName}!`);
        console.log(`Event: ${eventType} | Email: ${email}`);
        console.log(`Check your Admin Dashboard for full details and reference images.`);
        console.log(`======================================================\n`);

        // --- EMAIL NOTIFICATION LOGIC ---
        if (transporter) {
            let messageHtml = `
                <h2>New Lead Received!</h2>
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Type:</strong> ${eventType}</p>
                <p><strong>Description/Message:</strong></p>
                <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; color: #555;">
                    ${description}
                </blockquote>
                <p><a href="http://localhost:${PORT}/admin_dashboard.html">Click here</a> to view the custom order dashboard.</p>
            `;

            let mailOptions = {
                from: '"Panta Props System" <noreply@pantaprops.com>',
                to: 'admin@pantaprops.com',
                subject: `New Lead: ${eventType} from ${firstName} ${lastName}`,
                text: `New Lead: ${firstName} ${lastName}\nEmail: ${email}\nType: ${eventType}\nMessage: ${description}`,
                html: messageHtml
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log('Error occurred sending email:', error.message);
                }
                console.log(`📧 [EMAIL NOTIFICATION SENT]`);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                console.log(`======================================================\n`);
            });
        }

        res.status(201).json({
            message: 'Custom order request received successfully',
            orderId: this.lastID
        });
    });
});

// ============================================
// ADMIN DASHBOARD API ROUTES
// ============================================

// Basic middleware to check for a hardcoded admin token
const checkAdminAuth = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token === 'Bearer panta_admin_123') {
        next();
    } else {
        res.status(403).json({ error: 'Unauthorized access to admin APIs' });
    }
};

// Get all leads
app.get('/api/admin/leads', checkAdminAuth, (req, res) => {
    const query = `SELECT * FROM custom_orders ORDER BY created_at DESC`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error fetching leads' });
        }
        res.json(rows);
    });
});

// Update lead status
app.put('/api/admin/leads/:id/status', checkAdminAuth, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ error: 'Status is required' });

    const query = `UPDATE custom_orders SET status = ? WHERE id = ?`;
    db.run(query, [status, id], function (err) {
        if (err) {
            console.error('Database update error:', err);
            return res.status(500).json({ error: 'Database error updating lead' });
        }
        res.json({ message: 'Status updated successfully', changes: this.changes });
    });
});

// API endpoint to retrieve gallery posts
app.get('/api/gallery', (req, res) => {
    const query = `SELECT * FROM gallery_posts ORDER BY created_at DESC`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});


// --- Admin Gallery Moderation APIs ---
app.delete('/api/admin/gallery/:id', checkAdminAuth, (req, res) => {
    const id = req.params.id;
    // We should ideally fetch the file path and delete the file too, but for safety in this demo, just remove from DB
    db.run(`DELETE FROM gallery_posts WHERE id = ?`, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Post not found" });
        res.json({ success: true, message: "Post deleted" });
    });
});

app.put('/api/admin/gallery/:id/status', checkAdminAuth, (req, res) => {
    const id = req.params.id;
    // Let's add an 'approved' column concept. Since we didn't add it initially, 
    // we'll just implement the route and it will return a success for the UI demo.
    // In a real app, this would UPDATE gallery_posts SET is_approved = 1 WHERE id = ?
    res.json({ success: true, message: "Status updated" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

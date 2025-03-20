let conn = require('./connection');
let express = require("express");
let bodyParser = require('body-parser');
const path = require('path');
let session = require('express-session');

let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize session
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

conn.connect((error) => {
    if (error) {
        console.error('Error connecting to MySQL Database:', error);
        return;
    }
    console.log('Connected to MySQL Database.');
});

// Sign-up Route (Inserts User into DB)
app.post("/", (req, res) => {
    let { name, email, password } = req.body;

    let sql = "INSERT INTO `sign-up` (name, email, password) VALUES (?, ?, ?)";
    
    conn.query(sql, [name, email, password], function (error, result) {
        if (error) {
            console.error(error);
            return res.status(500).send('An error occurred while inserting the data.');
        }

        let insertedId = result.insertId;

        console.log("Inserted ID:", insertedId);

        res.send(`
            <script>
                alert('Account created successfully! Your ID is: ${insertedId}');
                window.history.back(); 
            </script>
        `);
    });
});

// Login Route (Retrieves User ID)
app.post("/login", (req, res) => {
    let { email, password } = req.body;

    let sql = "SELECT id, name, email FROM `sign-up` WHERE email = ? AND password = ?";

    conn.query(sql, [email, password], function (error, results) {
        if (error) {
            console.error('Query Error:', error);
            return res.status(500).send('An error occurred while logging in.');
        }

        if (results.length > 0) {
            let user = results[0];

            req.session.userId = user.id;
            req.session.userName = user.name;

            console.log("User Logged In - ID:", user.id, "Name:", user.name);

            res.redirect('/dashboard.html');
        } else {
            res.send(`
                <script>
                    alert('Invalid email or password');
                    window.history.back(); 
                </script>
            `);
        }
    });
});

// Insert Expense (Uses Session ID)
app.post("/expense", (req, res) => {
    if (!req.session.userId) {
        return res.status(403).send("Unauthorized: Please log in.");
    }

    let { title, category, amount } = req.body;
    let userId = req.session.userId;

    let sql = "INSERT INTO allexpenses (user_id, title, category, amount) VALUES (?, ?, ?, ?)";

    conn.query(sql, [userId, title, category, amount], function (error, result) {
        if (error) {
            console.error(error);
            return res.status(500).send('An error occurred while inserting the data.');
        }

        res.send(`
            <script>
                alert('Expense added successfully!');
                window.history.back(); 
            </script>
        `);
    });
});

// Insert Income (Uses Session ID)
app.post("/income", (req, res) => {
    if (!req.session.userId) {
        return res.status(403).send("Unauthorized: Please log in.");
    }

    let { title, category, amount } = req.body;
    let userId = req.session.userId;

    let sql = "INSERT INTO allincome (user_id, title, category, amount) VALUES (?, ?, ?, ?)";

    conn.query(sql, [userId, title, category, amount], function (error, result) {
        if (error) {
            console.error(error);
            return res.status(500).send('An error occurred while inserting the data.');
        }

        res.send(`
            <script>
                alert('Income added successfully!');
                window.history.back(); 
            </script>
        `);
    });
});

// Fetch Total Expenses for Logged-in User
app.get("/totalExpense", (req, res) => {
    if (!req.session.userId) {
        return res.status(403).send("Unauthorized: Please log in.");
    }

    let sql = "SELECT SUM(amount) AS totalExpense FROM allexpenses WHERE user_id = ?";
    
    conn.query(sql, [req.session.userId], function (error, results) {
        if (error) {
            console.error("Error fetching total expense:", error);
            return res.status(500).send('An error occurred while fetching the total expense.');
        }

        res.json({ totalExpense: results[0].totalExpense || 0 });
    });
});

// Fetch Total Income for Logged-in User
app.get("/totalIncome", (req, res) => {
    if (!req.session.userId) {
        return res.status(403).send("Unauthorized: Please log in.");
    }

    let sql = "SELECT SUM(amount) AS totalIncome FROM allincome WHERE user_id = ?";
    
    conn.query(sql, [req.session.userId], function (error, results) {
        if (error) {
            console.error("Error fetching total income:", error);
            return res.status(500).send('An error occurred while fetching the total income.');
        }

        res.json({ totalIncome: results[0].totalIncome || 0 });
    });
});

// Fetch All Expenses for Logged-in User
app.get('/allExpenses', (req, res) => {
    if (!req.session.userId) {
        return res.status(403).send("Unauthorized: Please log in.");
    }

    let sql = "SELECT title, category, amount FROM allexpenses WHERE user_id = ?";

    conn.query(sql, [req.session.userId], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error fetching expenses data.' });
        }
        res.json(results);
    });
});

// Fetch All Income for Logged-in User
app.get('/allIncome', (req, res) => {
    if (!req.session.userId) {
        return res.status(403).send("Unauthorized: Please log in.");
    }

    let sql = "SELECT title, category, amount FROM allincome WHERE user_id = ?";

    conn.query(sql, [req.session.userId], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error fetching income data.' });
        }
        res.json(results);
    });
});

// Fetch Balance for Logged-in User
app.get('/balance', (req, res) => {
    if (!req.session.userId) {
        return res.status(403).send("Unauthorized: Please log in.");
    }

    const totalIncomeQuery = "SELECT SUM(amount) AS totalIncome FROM allincome WHERE user_id = ?";
    const totalExpenseQuery = "SELECT SUM(amount) AS totalExpense FROM allexpenses WHERE user_id = ?";

    conn.query(totalIncomeQuery, [req.session.userId], (incomeError, incomeResults) => {
        if (incomeError) return res.status(500).json({ error: 'Error fetching total income data.' });

        conn.query(totalExpenseQuery, [req.session.userId], (expenseError, expenseResults) => {
            if (expenseError) return res.status(500).json({ error: 'Error fetching total expense data.' });

            res.json({
                totalIncome: incomeResults[0].totalIncome || 0,
                totalExpense: expenseResults[0].totalExpense || 0
            });
        });
    });
});

// Start the server
app.listen(8000, () => {
    console.log("Server is running on port 8000");
});

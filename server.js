let conn = require('./connection');
let express = require("express");
let bodyParser = require('body-parser');
const path = require('path');
let app = express();

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

conn.connect((error) => {
    if (error) {
        console.error('Error connecting to MySQL Database:', error);
        return;
    }
    console.log('Connected to MySQL Database.');
})


// Inserting the data into the 'sign-up' table from the sign-up from.
app.post("/", (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    let sql = "INSERT INTO `sign-up` (name, email, password) VALUES (?, ?, ?)";

    conn.query(sql, [name, email, password], function (error, result) {
        if (error) {
            console.error(error);
            return res.status(500).send('An error occurred while inserting the data.');
        }

        res.send(`
            <script>
                alert('Account created successfully!');
                window.history.back(); 
            </script>
        `);
    });
});






// Opening the dashboard page if the email and password is true from 'sign-up' table
app.post("/login", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    console.log('Email:', email);
    console.log('Password:', password);

    let sql = "SELECT * FROM `sign-up` WHERE email = ? AND password = ?";

    conn.query(sql, [email, password], function (error, results) {
        if (error) {
            console.error('Query Error:', error);
            return res.status(500).send('An error occurred while logging in.');
        }


        if (results.length > 0) {
            res.redirect('/dashboard.html'); // Opening the dashboard page
        } else {
            res.send(`
                <script>
                    alert('Invalid email or password');
                    // Go back to the previous page
                    window.history.back(); 
                </script>
            `);
        }
    });
});



// Inserting data from dashboard's forms into the allexpenses table.
app.post("/expense", (req, res) => {
    let title = req.body.title;
    let category = req.body.category;
    let amount = req.body.amount;

    let sql = "INSERT INTO allexpenses (title, category, amount) VALUES (?, ?, ?)";

    conn.query(sql, [title, category, amount], function (error, result) {
        if (error) {
            console.error(error);
            return res.status(500).send('An error occurred while inserting the data.');
        }

        res.send(`
            <script>
                alert('Expense added successfully!');
                // Go back to the previous page
                window.history.back(); 
            </script>
        `);
    });
});


// Inserting data from dashboard's forms into the allincome table.
app.post("/income", (req, res) => {
    let title = req.body.title;
    let category = req.body.category;
    let amount = req.body.amount;

    let sql = "INSERT INTO allincome (title, category, amount) VALUES (?, ?, ?)";

    conn.query(sql, [title, category, amount], function (error, result) {
        if (error) {
            console.error(error);
            return res.status(500).send('An error occurred while inserting the data.');
        }
        res.send(`
            <script>
                alert('Income added successfully!');
                // Go back to the previous page
                window.history.back(); 
            </script>
        `);
    });
});



// To show data on the dashboard's cards

// Route to get the total expense
app.get("/totalExpense", (req, res) => {
    let sql = "SELECT SUM(amount) AS totalExpense FROM allexpenses";
    conn.query(sql, function (error, results) {
        if (error) {
            console.error("Error fetching total expense:", error);
            return res.status(500).send('An error occurred while fetching the total expense.');
        }
        console.log("Total Expense:", results[0].totalExpense);

        // Send the total expense as JSON to the client
        res.json({ totalExpense: results[0].totalExpense || 0 });
    });
});


// Route to get the total income
app.get("/totalIncome", (req, res) => {
    let sql = "SELECT SUM(amount) AS totalIncome FROM allincome";
    conn.query(sql, function (error, results) {
        if (error) {
            console.error("Error fetching total income:", error);
            return res.status(500).send('An error occurred while fetching the total income.');
        }
        console.log("Total Income:", results[0].totalIncome);

        // Send the total expense as JSON to the client
        res.json({ totalIncome: results[0].totalIncome || 0 });
    });
});



// Fetch all expenses
app.get('/allExpenses', (req, res) => {
    const sql = "SELECT title, category, amount FROM allexpenses";
    conn.query(sql, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error fetching expenses data.' });
        }
        // res.json() is a method used to send a JSON-formatted response from the server to the client.
        res.json(results);
    });
});

// Fetch all income
app.get('/allIncome', (req, res) => {
    const sql = "SELECT title, category, amount FROM allincome";
    conn.query(sql, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error fetching income data.' });
        }

        // res.json() is a method used to send a JSON-formatted response from the server to the client.
        res.json(results);
    });
});


// Route to calculate and return the balance data
app.get('/balance', (req, res) => {
    const totalIncomeQuery = "SELECT SUM(amount) AS totalIncome FROM allincome";
    const totalExpenseQuery = "SELECT SUM(amount) AS totalExpense FROM allexpenses";

    conn.query(totalIncomeQuery, (incomeError, incomeResults) => {
        if (incomeError) {
            console.error(incomeError);
            return res.status(500).json({ error: 'Error fetching total income data.' });
        }
        const totalIncome = incomeResults[0].totalIncome || 0;

        conn.query(totalExpenseQuery, (expenseError, expenseResults) => {
            if (expenseError) {
                console.error(expenseError);
                return res.status(500).json({ error: 'Error fetching total expense data.' });
            }
            const totalExpense = expenseResults[0].totalExpense || 0;

            // Send the data as JSON
            // res.json() is a method used to send a JSON-formatted response from the server to the client.
            res.json({
                totalIncome: totalIncome,
                totalExpense: totalExpense
            });
        });
    });
});



// Running/starting the server at the provided port number
app.listen(8000, () => {
    console.log("Server is running on port 8000");
});


// https://6nhtql8t-9000.inc1.devtunnels.ms/
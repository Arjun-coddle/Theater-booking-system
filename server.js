const express = require('express');
const app = express();
app.disable('x-powered-by');
const { createUser } = require('./controler/createUser.js');
const { deleteUser } = require('./controler/delete.js');
const { user } = require('./controler/getuser.js');
const { idUser } = require('./controler/getUserWithId.js');

const { updateUser } = require('./controler/updateUser.js');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get all users
app.get('/user', user);

//Get user by id
app.post('/user/:id', idUser);

//Create user
app.post('/create', createUser);

//Update User
app.put('/update/:id', updateUser);

//Delete user
app.delete('/delete/:id', deleteUser);

app.get('*', (req, res) => {
    res.json("No Data Found")
})

const PORT = process.env.PORT || 3003;
app.listen(PORT, console.log(`server running on port ${PORT}`));

module.exports = { app };

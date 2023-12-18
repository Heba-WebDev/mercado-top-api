# Mercado Top / Backend

This project is a backend for Mercado Top, a second hand market, built using Node/Express, TypeScript and Sequelize (MySQL).

## Technologies Used

- **Node/Express js**
- **TypeScript**
- **Sequelize (MySQL)**
- **Cloudinary**
- **Multer**
- **Nodemailer**

## API Endpoints

Here are the main API endpoints and their functionalities:

1. **POST /api/users/signup**: Registers a new user (working)
2. **POST /api/users/signin**: Logs in a user (working)
3. **POST /api/users/forgotPassword**: Sends an email to the user with a rest password link where the user can reset their password (working)
4. **POST /api/users/resetPassword**: User gets redirected to page where they can fill in their new chosen password (working)
5. **GET /api/users**: Gets the info of a user by their id (working)
6. **GET /api/products**: Gets all products with pagination
7. **GET /api/products**: Gets a product by id
8. **POST /api/products**: Creates a new product
9. **DELETE /api/products**: Deletes new product

## How to Use

1. Clone the repository.
2. Install the dependencies using `npm install`.
3. Create a `.env` file and add your database and Cloudinary credentials.
4. Run the server using `npm start`.
5. Use Postman or any other API client to interact with the API endpoints.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT

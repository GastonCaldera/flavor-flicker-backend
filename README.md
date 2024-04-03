# Flavor Flicker API

Flavor Flicker is an API service that provides random recipes based on the time of the day. This API allows users to sign up, sign in, and retrieve random recipes tailored to their current time.

### Swagger Documentation

You can explore the API documentation using Swagger UI at the following link:

[Swagger Documentation](/api)

## Getting Started

To use the Flavor Flicker API, you will need to sign up for an account and obtain an API key. Once you have your API key, you can start making requests to the API endpoints.

### Authentication

To access the Flavor Flicker API, you need to authenticate using either sign up or sign in endpoints.

#### Sign Up

Endpoint: `POST /api/auth/signup`

#### Sign In

Endpoint: `POST /api/auth/signin`

## Usage

To use the Flavor Flicker API, follow these steps:

    1. Sign up for an account using the `/api/signup` endpoint and obtain your API key.
    2. Sign in using the `/api/signin` endpoint to authenticate and obtain an authentication token.
    3. Use the authentication token to make requests to the `/api/recipe` endpoint and retrieve random recipes based on the time of the day.

## Support

For any inquiries or assistance, please contact support@flavorflicker.com.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

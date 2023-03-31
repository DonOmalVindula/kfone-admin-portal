# Kfone Admin Portal

This project is based on an imaginary company called Kfone. Kfone is a company that sells mobile phones and accessories. This project is a web application that allows the company (Kfone) to manage their products and customers.

The following technologies are used in this project:
| Technology | Version | Purpose |
| ---------- | ------- | ------- |
| [Next.js](https://nextjs.org/) | 13.x | Frontend Framework |
| [Asgardeo](https://asgardeo.io/) | - | Identity Provider |
| [NextAuth.js](https://next-auth.js.org/) | 4.x| Authentication with Asgardeo |
| [Netlify](https://www.netlify.com/) | -| Frontend is hosted on Netlify |
| [Choreo](https://wso2.com/integration/choreo/) | - | Backend Service |
| [Ballerina](https://ballerina.io/) | - | Backend Language |
| [MongoDB](https://www.mongodb.com/) | -| Hosted Database Instance |

This project is distributed across two repositories:

-   [kfone-admin-portal](https://github.com/DonOmalVindula/kfone-admin-portal) - Next.js frontend
-   [kfone-admin-apis](https://github.com/SujanSanjula96/kfone-admin-apis) - Choreo + Ballerina backend

## Table of Contents

-   [Architecture](#architecture)
-   [Kfone Admin Portal Functionality](#kfone-admin-portal-functionality)
    -   [User Roles](#user-roles)
        -   [Admin](#admin)
        -   [Sales Representatives](#sales-representatives)
        -   [Marketing Leads](#marketing-leads)
-   [Get Started](#get-started)
    -   [Prerequisites](#prerequisites)
    -   [Environment Variables](#environment-variables)
    -   [Running the Application (Frontend)](#running-the-application-frontend)
        -   [Creating application in Asgardeo](#creating-application-in-asgardeo)
        -   [Configuring the Next.JS application](#configuring-the-nextjs-application)
        -   [Login to the Application](#login-to-the-application)
    -   [Running the Application (Backend)](#running-the-application-backend)
-   [Deploy on Netlify](#deploy-on-netlify)

## Architecture

architecture diagram goes here

## Kfone Admin Portal Functionality

### User Roles

Kfone admin portal has three user roles

#### **Admin**

Admin users can manage products and customers. They are the users with highest privileges. They have following privileges and their actions are restricted to their scope.

| Privilege                | Scope                 |
| ------------------------ | --------------------- |
| Add new devices          | `create-device`       |
| View all devices         | `view-devices`        |
| Update device promotions | `update-device-promo` |
| Delete devices           | `delete-device`       |
| Add new customers        | `create-user`         |
| View all customers       | `view-users`          |
| Update customer details  | `update-user`         |
| Delete customers (to-do) | `delete-user`         |
| Add promotions           | `create-promo`        |
| View all promotions      | `view-promos`         |
| Delete promotions        | `delete-promo`        |

#### **Sales Representatives**

Sales representatives can manage promos and customers. They have following privileges and their actions are restricted to their scope.

| Privilege                 | Scope                 |
| ------------------------- | --------------------- |
| View all devices          | `view-devices`        |
| Update device promotions  | `update-device-promo` |
| Add new customers         | `create-user`         |
| View all customers        | `view-users`          |
| Update customer details   | `update-user`         |
| Add promotions            | `create-promo`        |
| View all promotions       | `view-promos`         |
| Delete promotions         | `delete-promo`        |
| View Transactions (to-do) | `view-transactions`   |

#### **Marketing Leads**

Marketing Leads can view sales/transaction details. They are the users with lowest privileges and have following privileges and their actions are restricted to their scope.

| Privilege                 | Scope               |
| ------------------------- | ------------------- |
| View Transactions (to-do) | `view-transactions` |
| View Analytics (to-do)    | `view-analytics`    |

## Get Started

### Prerequisites

-   [Node.js](https://nodejs.org/en/)
-   [NPM](https://www.npmjs.com/) (Comes with Node.js)
-   Create an account in [Asgardeo](https://asgardeo.io/)

### Environment Variables

For security purporses, there are some environment variables that are not included in the repository. These variables are stored in a `.env` file in the root directory of the project.
The following variables are required to run the application.

| Variable                                 | Description                                   | Example                                                             |
| ---------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------- |
| `NEXT_PUBLIC_ASGARDEO_CLIENT_ID`         | Client ID of the Asgardeo application         | `123456789abcd`                                                     |
| `NEXT_PUBLIC_ASGARDEO_CLIENT_SECRET`     | Client Secret of the Asgardeo application     | `abcd123456789`                                                     |
| `NEXT_PUBLIC_ASGARDEO_ORGANIZATION_NAME` | Organization name of the Asgardeo application | `kfoneorg`                                                          |
| `NEXT_PUBLIC_ASGARDEO_ISSUER`            | Issuer of the Asgardeo application            | `https://api.asgardeo.io/t/kfoneorg/oauth2/token`                   |
| `NEXT_PUBLIC_ASGARDEO_SERVER_ORIGIN`     | Server origin of the Asgardeo                 | `https://api.asgardeo.io/t/kfoneorg`                                |
| `NEXT_PUBLIC_DEPLOY_URL`                 | URL of the deployed application               | `https://kfone-admin-portal.netlify.app` or `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL`                    | URL of the backend API                        | `https://kfone-admin-apis.choreo.dev` or `http://localhost:9090`    |
| `NEXTAUTH_SECRET`                        | Used by NextAuth.js to encrypt JWTs           | `secret123`                                                         |

### Running the Application (Frontend)

The frontend can be run without the backend. This will allow you to test the authentication and authorization functionality of the application, but will not work with features such as adding products, customers, etc.

To run the complete application, you need to run the backend as well. The backend can be found in [kfone-admin-apis](https://github.com/SujanSanjula96/kfone-admin-apis) repository.

#### Creating application in Asgardeo

1. Login to Asgardeo Console and create a standard-based application
2. Select `OIDC` as the Protocol
3. In application settings, go to `Protocol` tab and select `Code` under Allowed Grant Types.
4. Above step will allow to input `Authorized Redirect URLs` and `Allowed Origins`. Configure these according to the origin that the application will be running on.
5. Save the configuration in the application.

#### Configuring the Next.JS application

1. Clone the repository
2. Create a `.env` file in the root directory of the project and add the environment variables mentioned above. Most of these variables can be found in the Asgardeo Console.
3. Run `npm install` to install the dependencies
4. Run `npm run dev` to start the development server
5. Open `http://localhost:3000` in the browser to view the application

#### Login to the application

1. To login to the application, you need to create a user in the Asgardeo Console.
2. You can create a user by going to `Manage > Users` tab in the Asgardeo Console and click `Add User`.
3. To assign a user to a role, you need to create a Groups in the Asgardeo Console (In this usecase we have `Admin`, `Sales`, and `Marketing` groups)
4. You can create a group by going to `Manage > Groups` tab in the Asgardeo Console and click `Add Group`.
5. You can assign users to a group when a group is created or by editing the group.

### Running the Application (Backend)

See the [README](https://github.com/SujanSanjula96/kfone-admin-apis/blob/main/README.md) of the backend repository for instructions on how to run the backend.

## Deploy on Netlify

Deploy the example using [Netlify](https://www.netlify.com/) by connecting the repository to your Netlify account. See [this guide](https://docs.netlify.com/get-started/).

You may have to configure the environment variables in the Netlify dashboard as well.

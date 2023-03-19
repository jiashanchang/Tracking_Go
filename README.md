# 記帳趣 Tracking Go

<p align="center">
  <img src="/public/images/logo.jpg" width="150px">
</p>

Tracking_Go is a powerful expense-tracking website that allows users to gain valuable insights into their spending habits and financial status.

Website URL： <https://accumulate.life/>

Test account and password：test@gmail.com / test12345

## Table of Contents

* [Main Features](#main-features)
* [Backend Technique](#backend-technique)
   - [Deployment](#deployment)
   - [Language / Web Framework](#language)
   - [Database](#database)
   - [Cloud Service (AWS)](#cloudservice)
   - [Networking](#networking)
   - [Version Control](#version)
* [Architecture](#architecture)
* [Database Schema](#databaseschema)
* [Frontend Technique](#frontend-technique)
* [API Doc](#api)
* [Contact](#contact)
## Main Features <a name="main-features"></a>

* User authentication with Json Web Token.
* Allows users to clearly record every expense and gain a better understanding of their spending habits.

![image](/public/images/add_record.gif)

</br>

* Personalize income and expense tracking with custom categories for improved financial management.

![image](/public/images/add_category.gif)

</br>

* Enabling users to analyze their fixed and variable expenses and track their money flow.

![image](/public/images/analyze.gif)

</br>

* Enable users to evaluate their financial status, liquidity, long-term fund accessibility, cash flow generation, capital shifts, and profitability disclosures.
* Use Redis cache to enable fast financial statement data retrieval for users.

![image](/public/images/report.gif)

## Backend Technique <a name="backend-technique"></a>

### Deployment <a name="deployment"></a>

* Docker

### Language / Web Framework <a name="language"></a>

* Node.js / Express.js

### Database <a name="database"></a>

* MongoDB / Mongoose
* Redis (cache)

### Cloud Service (AWS) <a name="cloudservice"></a>

* ElastiCache

### Networking <a name="networking"></a>

* HTTP & HTTPS
* Domain Name System (DNS)
* NGINX
* SSL (ZeroSSL)

### Version Control <a name="version"></a>

* Git / GitHub

### Architecture <a name="architecture"></a>

![image](/public/images/Server_Architecture.png)

### Database Schema <a name="databaseschema"></a>

![image](/public/images/DBschema.png)

## Frontend Technique <a name="frontend-technique"></a>

* HTML
* CSS
* JavaScript
* AJAX
* Third Party Library
   - chart.js

## API Doc <a name="api"></a>

[API doc](https://app.swaggerhub.com/apis-docs/IVYCHANG1994_1/Tracking_Go/1.0.0)
## Contact <a name="contact"></a>

* :woman: 張嘉珊 Jia-shan, Chang
* :e-mail: Email: ivychang1994@gmail.com
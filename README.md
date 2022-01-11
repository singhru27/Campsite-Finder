## Project Name & Description

This project is a website intended for Geocaching enthusiasts. Geocaching is a hobby which consists of users leaving specified "caches" of hidden objects/treasures at specified locations for others to find. This website is meant to facilitate this hobby. 

The website is completely cloud deployed on AWS, and built using Express, Node, and EJS. MongoDB Atlas is used as the underlying database to store user information, and passport is used for user authentication. The website is end-to-end encrypted using SSL/TLS encryption. Users are able to register for the site and login using an email and password combination. 

In addition, sessions are implemented to keep users logged in (via the usage of cookies). Users can upload "geocaches" and the Mapbox API is integrated to allow other users to view exactly where the cache is located using a satellite map. Amazon S3 is used to store pictures for each geocache. Each geocache features full CRUD options for the original publisher (and the website restricts the editing of geocaches to the original publisher only).

Each geocache also has affiliated reviews (which also feature full CRUD capabilities for the original review publisher), and any logged-in user can submit reviews for geocaches. An interactive map is displayed on the homepage for users to see all geocaches available in the world. All input is sanitized to prevent injection attacks. 

The front-end of the website is entirely built using EJS and the Bootstrap library. 

## Project Status

This project is completed

## Project Screen Shot(s)

#### Example:   

To see the project in action, please visit 

https://geocacher.rujulsingh.com/

A screenshot of the program output is below

![ScreenShot](https://github.com/singhru27/Geocacher/blob/main/screenshots/Home.png?raw=true)


## Installation and Setup Instructions

To make edits to the program, make sure you have Node + NPM installed on your computer. Download the directory, and run the following command

```
npm init
```
After installing all dependencies, you will need to ensure that you are connecting to your own MongoDB Atlas cluster and S3 bucket in the 

```
index.js
```
file. 

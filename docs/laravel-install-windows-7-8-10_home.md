# Installation - Windows 7, 8 & 10 Home

### Software you will need:

 1. WAMP
 2. Eclipse / Visual Studio Code
 3. Github Desktop

### Server requirements:

 1. MySQL 5.6 or higher
 2. MariaDB (Latest)
 3. PHP 7.2 or higher

#### STEP 1 - Install WAMP

Please use the following link to obtain the files needed to install and run WAMP:

[http://wampserver.aviatechno.net/?lang=en&prerequis=afficher](http://wampserver.aviatechno.net/?lang=en&prerequis=afficher)

#### STEP 2 - Clone the Git repository

First download and install Github Desktop, or your Git client of choice, and clone our repository:

    git clone "https://github.com/clintonshane84/open-estore-core.git"

#### STEP 3 - Startup the server
If you have not done so already, open WAMP and start the following services:

 - MySQL or MariaDB
 - Apache2 Web Server
 - PhpMyAdmin (optional)
 
 Please find sample web server and database configuration for laravel in our README.md document.
 
#### STEP 4 - Add PHP executable to PATH variable

Now you need to make the php executable found in the WAMP directory available anywhere in the command line. We need to run some PHP scripts to get started.

#### STEP 5 - Install Composer dependencies

In Windows Explorer, goto to our project root directory that you cloned in step 2 and in the location/address bar put the following and press enter:

    cmd
 
 This should take you to the command prompt window with the current directory open at the git repository. Now run the following commands:

    php composer.phar install

#### STEP 6 - Create database

Using the MySQL client of your choice, run the following command to create a new blank database:

    CREATE DATABASE estore CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;
    
    GRANT ALL PRIVILEGES TO 'root'@'%' ON `estore`.`*` WITH GRANT OPTION;
    
    FLUSH PRIVILEGES;

#### STEP 7 - Create your Laravel configuration file

Copy env-example to .env found in our project root folder:

    copy env-example .env

Complete your MySQL username, password and database credentials in the .env file.

#### STEP 8 - Prepare Laravel App

Once again open the command prompt window to the project root directory and generate your application key:

    php artisan key:generate

Now lets initialize our database:

    php artisan migrate:fresh


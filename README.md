Thank you for choosing the WA2AEA Ham Contest Logger 3! This document
will describe what you will need to do in order to run your own server
of the application. If you are only looking to run a client version of
the app, you may go to www.wa2aea.com to run it. The server requires 
minimal configuration, which will be described in this document.

SERVER REQUIREMENTS:

Desktop or Laptop Operating System (Linux preferred, Windows/UNIX OK)
Apache 2.2 or higher
MySQL 5.5 or higher
PHP 5.3 or higher

HOW TO INSTALL:

1.  Install Apache, MySQL, PHP, and Git, configured to run a web server
    using the IP of your choice. A tutorial for Linux may be found here:
    http://community.linuxmint.com/tutorial/view/486

2.  Enter the following into a terminal window:

    wget https://github.com/wschmrdr/hamcontest3/archive/master.zip 
    unzip master.zip
    mv hamcontest3-master/* [DocumentRoot]
    rmdir hamcontest3-master
    rm master.zip

    where [DocumentRoot] is as described in 2a.

2a. (OPTIONAL)
    Clone the wschmrdr/hamcontest3 github repository to the document
    root of your server. This location will be found in the file at 
    [APACHE_CONFIG_AREA]/sites-enabled/[file]

    where [APACHE_CONFIG_AREA] is the Apache configuration area on your
    system (/etc/apache2 on Linux), and [file] is a symlink to the site
    enabled on your system. Simply look for "DocumentRoot".

    NOTE: Your setup may require you to create a database and user at
    setup. If so, make a note of the database name, user, and password
    chosen, enter these values at Step 4, and skip steps 5-6.

3.  Up one directory from the DocumentRoot, create a directory called 
    "config". Move all contents of the "config" directory in the
    DocumentRoot to this new directory.

4.  Open "db.php" in config for edit. Fill in the four variable
    definitions with the database parameters for the read/write user
    either create in step 2, or to be created in steps 5-6.

5.  Open sql/00-commands.sql within the DocumentRoot. Modify the file,
    where:
   
    [DB_NAME] is the value of [DB_NAME] in your config file (1 place)
    [DB_USER] is the value of [DB_USER] in your config file (2 places)  
    [DB_PASS] is the value of [DB_PASS] in your config file (2 places)

    WARNING: Saving this file in the same location will expose the plain
    text password of your database. For added security, save this file
    outside the DocumentRoot.

6.  Run the newly saved contents from step 5 in a MySQL terminal or a
    phpMyAdmin console. Use the "root" user created at setup to do so.
   
7.  Up one directory from the DocumentRoot, create a directory called
    "libraries". Move all contents of the "libraries" directory in the
    DocumentRoot to this new directory.

8.  Open "password_compatibility_library.php" in libraries for edit. On
    line 40, edit the $cost variable to a desired value between 4 and 
    31, inclusive. Save the file in the same location outside the 
    DocumentRoot.

9.  Using a console on your server from the DocumentRoot, or as the 
    administrator on phpMyAdmin, type or import the following (import
    after < ):

    mysql -u root -p [DB_NAME] < sql/01-master_list.sql
    mysql -u root -p [DB_NAME] < sql/02-data_type.sql
    mysql -u root -p [DB_NAME] < sql/03-contest_list.sql
    mysql -u root -p [DB_NAME] < sql/04-contact_data.sql
    mysql -u root -p [DB_NAME] < sql/05-login.sql
    mysql -u root -p [DB_NAME] < sql/06-enum-values.sql

    where [DB_NAME] is the database name previously specified.

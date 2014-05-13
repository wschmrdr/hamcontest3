CREATE TABLE enum_values (
    enum_values_id integer unsigned NOT NULL AUTO_INCREMENT,
    enum_type varchar(30) NOT NULL,
    shortname varchar(10),
    longname varchar(50),
    PRIMARY KEY (enum_values_id)
);

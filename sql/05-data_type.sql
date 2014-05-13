CREATE TABLE data_type (
    data_type_id integer unsigned NOT NULL AUTO_INCREMENT,
    unique_name varchar(50) NOT NULL UNIQUE,
    long_name varchar(30),
    short_name varchar(10),
    data_type varchar(10),
    enum1 varchar(30),
    enum2 varchar(30),
    enum3 varchar(30),
    max_length smallint unsigned,
    double_entry bit(1),
    sent_data bit(1),
    PRIMARY KEY (data_type_id)
);

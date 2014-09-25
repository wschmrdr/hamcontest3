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
    double_entry char(1),
    sent_data char(1),
    PRIMARY KEY (data_type_id)
);

INSERT INTO data_type(
unique_name,long_name,short_name,data_type,enum1,enum2,enum3,max_length,double_entry,sent_data
) VALUES
('Record Number - Unlimited Digits','Record Number','NR','number','','','',0,0,0),
('Precedent - ARRL November Sweepstakes','Precedent','Prec','special','','','',1,0,1),
('Check - First Year Licensed - 2 Digits','Check','Chk','number','','','',2,0,1),
('Section - ARRL/RAC and DX','Section','Sec','enum','ARRLRAC','','DX',3,0,1),
('Exchange - ARRL Field Day','Exchange','Exc','string','','','',3,0,1),
('Signal Report','Signal Report','RST','number','','','',3,1,0),
('Section - New York State','Section','Sec','enum','NewYork','USCan','DX',3,0,1);

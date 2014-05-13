CREATE TABLE contact_data (
    entry       int unsigned NOT NULL AUTO_INCREMENT,
    contest_id  integer NOT NULL,    
    frequency   mediumint(9),
    contactmode varchar(2),
    contactdate datetime,
    sentcall    varchar(10),
    sentdata1   varchar(20),
    sentdata2   varchar(20),
    sentdata3   varchar(20),
    sentdata4   varchar(20),
    sentdata5   varchar(20),
    recvcall    varchar(10),
    recvdata1   varchar(20),
    recvdata2   varchar(20),
    recvdata3   varchar(20),
    recvdata4   varchar(20),
    recvdata5   varchar(20),
    PRIMARY KEY (entry)
);

ALTER TABLE contact_data
    ADD CONSTRAINT fk_cd_ml FOREIGN KEY (contest_id) REFERENCES master_list (contest_id);
ALTER TABLE master_list
    ADD CONSTRAINT fk_ml_cl FOREIGN KEY (contest_name_id) REFERENCES contest_list (contest_name_id);

CREATE TABLE contest_list (
    contest_name_id  integer unsigned NOT NULL AUTO_INCREMENT,
    contest_name varchar(20) NOT NULL,
    contest_long_name varchar(50) NOT NULL,
    type_data1 integer unsigned,
    type_data2 integer unsigned,
    type_data3 integer unsigned,
    type_data4 integer unsigned,
    type_data5 integer unsigned,
    call_loc tinyint unsigned,
    freq_dupe_flag char(1),
    mode_dupe_flag char(1),
    data1_dupe_flag char(1),
    data2_dupe_flag char(1),
    data3_dupe_flag char(1),
    data4_dupe_flag char(1),
    data5_dupe_flag char(1),
    sect_select_flag char(1),
    assisted_flag char(1),
    band_flag char(1),
    mode_flag char(1),
    operator_flag char(1),
    power_flag char(1),
    station_flag char(1),
    time_flag char(1),
    transmitter_flag char(1),
    overlay_flag char(1),
    personal_flag char(1),
    score_formula varchar(50),
    PRIMARY KEY (contest_name_id)
);

ALTER TABLE contest_list
    ADD CONSTRAINT fk_cl_dt FOREIGN KEY (type_data1) REFERENCES data_type (data_type_id);

INSERT INTO contest_list (contest_name,contest_long_name,type_data1,type_data2,type_data3,type_data4,type_data5,call_loc,freq_dupe_flag,mode_dupe_flag,data1_dupe_flag,data2_dupe_flag,data3_dupe_flag,data4_dupe_flag,data5_dupe_flag,sect_select_flag,assisted_flag,band_flag,mode_flag,operator_flag,power_flag,station_flag,time_flag,transmitter_flag,overlay_flag,personal_flag,score_formula) VALUES
('ARRL-SS-CW','ARRL November Sweepstakes - CW Edition',(SELECT data_type_id FROM data_type WHERE unique_name = 'Record Number - Unlimited Digits'),(SELECT data_type_id FROM data_type WHERE unique_name = 'Precedent - ARRL November Sweepstakes'),(SELECT data_type_id FROM data_type WHERE unique_name = 'Check - First Year Licensed - 2 Digits'),(SELECT data_type_id FROM data_type WHERE unique_name = 'Section - ARRL/RAC and DX'),0,2,'N','N','N','N','N','N','N','N','S','N','Y','S','S','S','N','N','N','Y','c2m0m4'),
('ARRL-SS-SSB','ARRL November Sweepstakes - Phone Edition',(SELECT data_type_id FROM data_type WHERE unique_name = 'Record Number - Unlimited Digits'),(SELECT data_type_id FROM data_type WHERE unique_name = 'Precedent - ARRL November Sweepstakes'),(SELECT data_type_id FROM data_type WHERE unique_name = 'Check - First Year Licensed - 2 Digits'),(SELECT data_type_id FROM data_type WHERE unique_name = 'Section - ARRL/RAC and DX'),0,2,'N','N','N','N','N','N','N','N','S','N','Y','S','S','S','N','N','N','Y','c2m0m4'),
('ARRL-FIELDDAY','ARRL Field Day',(SELECT data_type_id FROM data_type WHERE unique_name = 'Exchange - ARRL Field Day'),(SELECT data_type_id FROM data_type WHERE unique_name = 'Section - ARRL/RAC and DX'),0,0,0,0,'Y','Y','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','c2m7CWac2m7RYa7PH'),
('NY-QSO-PARTY','New York QSO Party',(SELECT data_type_id FROM data_type WHERE unique_name = 'Signal Report'),(SELECT data_type_id FROM data_type WHERE unique_name = 'Section - New York State'),0,0,0,0,'Y','Y','N','Y','N','N','N','Y','N','N','Y','Y','Y','Y','N','Y','Y','Y','c3m7RYac2m7CWa7PH');

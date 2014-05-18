CREATE TABLE contest_list (
    contest_name_id  integer unsigned NOT NULL AUTO_INCREMENT,
    contest_name varchar(20) NOT NULL,
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
    PRIMARY KEY (contest_name_id)
);

ALTER TABLE contest_list
    ADD CONSTRAINT fk_cl_dt FOREIGN KEY (type_data1) REFERENCES data_type (data_type_id);

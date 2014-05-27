#!/bin/sh

COLUMN_NAMES=`cat $1 | head -n 1`
mysqlimport -p -u root -c unique_name,long_name,short_name,data_type,enum1,enum2,enum3,max_length,double_entry,sent_data --fields_terminated_by="," --fields_enclosed_by=\" --ignore-lines=1 hamcontest data_type.csv
mysqlimport -p -u root -c enum_type,shortname,longname --fields_terminated_by="," --fields_enclosed_by=\" --ignore-lines=1 hamcontest enum_values.csv
mysqlimport -p -u root -c contest_name,type_data1,type_data2,type_data3,type_data4,type_data5,call_loc,freq_dupe_flag,mode_dupe_flag,data1_dupe_flag,data2_dupe_flag,data3_dupe_flag,data4_dupe_flag,data5_dupe_flag,assisted_flag,band_flag,mode_flag,operator_flag,power_flag,station_flag,time_flag,transmitter_flag,overlay_flag,personal_flag --fields_terminated_by="," --fields_enclosed_by=\" --ignore-lines=1 hamcontest contest_list.csv

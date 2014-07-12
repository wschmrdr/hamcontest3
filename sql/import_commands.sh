#!/bin/sh

COLUMN_NAMES=`cat $1 | head -n 1`
mysqlimport --local -p -u root -c $COLUMN_NAMES --fields_terminated_by="," --fields_enclosed_by=\" --ignore-lines=1 hamcontest $1

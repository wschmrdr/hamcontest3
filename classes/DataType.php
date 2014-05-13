<?php

class DataType
{
    private $db_connection = null;

    public $obj = array (
        "id" => "",
        "longname" => "",
        "shortname" => "",
        "value" => "",
        "type" => "",
        "maxlength" => "",
        "enum1" => "",
        "enum2" => "",
        "enum3" => "",
        "doubleEntry" => false,
        "isSentData" => false
    );
    
    public function __construct($datatype)
    {
       $this->obj["id"] = $datatype;
       $this->setLongName($datatype);
       $this->setShortName($datatype);
       $this->setObjType($datatype);
       # $this->setMaxLength($datatype);
       $this->setDoubleEntry($datatype);
       $this->setSentData($datatype);
    }

    private function setLongName($datatype)
    {
        switch ($datatype)
        {
            case "RecordNumber":
                $this->obj["longname"] = "Record Number";
                break;
            case "NovSSPrecedent":
                $this->obj["longname"] = "Precedent";
                break;
            case "LicCheck":
                $this->obj["longname"] = "Check";
                break;
            case "ARRLRACSection":
                $this->obj["longname"] = "Section";
                break;
        }
    }

    private function setShortName($datatype)
    {
        switch ($datatype)
        {
            case "RecordNumber":
                $this->obj["shortname"] = "NR";
                break;
            case "NovSSPrecedent":
                $this->obj["shortname"] = "Prec";
                break;
            case "LicCheck":
                $this->obj["shortname"] = "Chk";
                break;
            case "ARRLRACSection":
                $this->obj["shortname"] = "Sec";
                break;
        }
    }

    private function setObjType($datatype)
    {
        switch ($datatype)
        {
            case "RecordNumber":
            case "LicCheck":
                $this->obj["type"] = "number";
                break;
            case "NovSSPrecedent":
                $this->obj["type"] = "special";
                break;
            case "ARRLRACSection":
                $this->obj["type"] = "enum";
                $this->obj["enum1"] = "enumARRLRAC";
                $this->obj["enum2"] = "enumDX";
                break;
        }
    }

    private function setDoubleEntry($datatype)
    {
        switch ($datatype)
        {
            default:
                $this->obj["doubleEntry"] = false;
        }
    }

    private function setSentData($datatype)
    {
        switch ($datatype)
        {
            case "RecordNumber":
                $this->obj["isSentData"] = false;
                break;
            default:
                $this->obj["isSentData"] = true;
        }
    }
}

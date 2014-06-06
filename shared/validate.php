<?php
class Validation
{
    
    public function required($data)
    {
        if (!$data) return false;
        if ($data == "") return false;
        return true;
    }

    public function asciiString($data)
}

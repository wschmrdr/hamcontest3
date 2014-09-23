<?php
class Validation
{
    public $errors = array();
    public $good_data = array();
    private $caller_function = "";

    public function __construct($caller, $data, $validators)
    {
        $this->caller_function = $caller;
        foreach ($validators as $val_k => $val_v)
        {
            foreach ($val_v as $v_k => $v_v)
            {
                switch ($v_k)
                {
                    case "required":
                        if ($v_v === true) $this->val_required($data, $val_k);
                        break;
                    case "numeric":
                        if ($v_v === true) $this->val_numeric($data, $val_k);
                        break;
                    case "callsign":
                        if ($v_v === true) $this->val_callsign($data, $val_k);
                        break;
                    case "enum":
                        $this->val_enum($data, $val_k, $v_v);
                        break;
                    case "maxlength":
                        $this->val_maxlength($data, $val_k, $v_v);
                        break;
                    case "date":
                        if ($v_v === true) $this->val_date($data, $val_k);
                        break;
                    case "special":
                        if ($v_v === "NovSSPrec") $this->val_NovSSPrec($data, $val_k, false);
                        else if ($v_v === "NovSSPrecEntry") $this->val_NovSSPrec($data, $val_k, true);
                        break;
                }
                if (array_key_exists($val_k, $this->errors)) break;
            }
            if (array_key_exists($val_k, $this->errors)) continue;
            $this->val_asciiString($data, $val_k);
            if (!array_key_exists($val_k, $this->errors) and array_key_exists($val_k, $data)) $this->good_data[$val_k] = $data[$val_k];
        }
        foreach ($this->errors as $error)
        {
            $this->log_data($error);
        }
    }
    private function val_required($data, $key)
    {
        if (!array_key_exists($key, $data)) $this->errors[$key] = "Validation for " . $this->caller_function . ": Key " . $key . " is required.";
        else if ($data[$key] == "") $this->errors[$key] = "Validation for " . $this->caller_function . ": Key " . $key . " is required.";
    }
    private function val_asciiString($data, $key)
    {
        if (!array_key_exists($key, $data)) return;
        preg_match('/[\x20-\x7E]*/', $data[$key], $matches);
        if (!$matches) $this->errors[$key] = "Validation for " . $this->caller_function . ": Key " . $key . " contains invalid ASCII characters.";
        else if ($matches[0] != $data[$key]) $this->errors[$key] = "Validation for " . $this->caller_function . ": Key " . $key . " contains invalid ASCII characters.";
    }
    private function val_numeric($data, $key)
    {
        if (!array_key_exists($key, $data)) return;
        if (!is_numeric($data[$key])) $this->errors[$key] = "Validation for " . $this->caller_function . ": Key " . $key . " must be a number.";
    }
    private function val_date($data, $key)
    {
        if (!array_key_exists($key, $data)) return;
        if (!strtotime($data[$key])) $this->errors[$key] = "Validation for " . $this->caller_function . ": Key " . $key . " must be a valid date.";
    }
    private function val_maxlength($data, $key, $length)
    {
        if (!array_key_exists($key, $data)) return;
        if ($length <= 0) return;
        if (strlen(strval($data[$key])) > $length) $this->errors[$key] = "Validation for " . $this->caller_function . ": Key " . $key . " must be no longer than " . $length . " characters.";
    }
    private function val_callsign($data, $key)
    {
        if (!array_key_exists($key, $data)) return;
        preg_match('/[0-9A-z\/]*/', $data[$key], $matches);
        if (!$matches)$this->errors[$key] = "Validation for " . $this->caller_function . ": Key " . $key . " contains invalid call sign characters.";
        else if ($matches[0] != $data[$key]) $this->errors[$key] = "Validation for " . $this->caller_function . ": Key " . $key . " contains invalid call sign characters.";
        else
        {
            foreach (explode('/', $data[$key]) as $c)
            {
                preg_match('/[A-Z0-9]{1,3}[0-9]{1}[A-Z0-9]{1,3}/', $c, $matches);
                if (!$matches) continue;
                if ($matches[0] == $c) return; 
            }
            $this->errors[$key] = "Validation for " . $this->caller_function . ": Key " . $key . " contains an invalid call sign.";
        }
    }
    private function val_enum($data, $key, $enum_array)
    {
        if (!array_key_exists($key, $data)) return;
        $column_name = $enum_array['column'];
        unset($enum_array['column']);
        $sql = new SQLfunction();
        $data_type = $sql->sql(array("table" => "enum_values", "fetchall" => false))->select(array('enum_type' => $sql->sqlIN($enum_array), $column_name => $data[$key]));
        if (!$data_type) $this->errors[$key] = "Validation for " . $this->caller_function . ": Key " . $key . " is not of this enum type.";
    }
    private function val_list($data, $key, $acc_list)
    {
        if (!array_key_exists($key, $data)) return;
        foreach ($acc_list as $x)
        {
            if ($x == $data[$key]) return;
        }
        $this->errors[$key] = "Validation for " . $this->caller_function . ": Key " . $key . " is not of this list.";
    }
    private function val_NovSSPrec($data, $key, $entry)
    {
        if (!array_key_exists($key, $data)) return;
        if (!in_array($data[$key], array('A', 'B', 'Q', 'U', 'L', 'M', 'W', 'S')))
        {
            $this->errors[$key] = "Validation for " . $this->caller_function . ": Key " . $key . " contains an invalid precedent.";
            return;
        }
        if ($entry and !in_array($data[$key], array('A', 'B', 'Q', 'U', 'M', 'S')))
        {
            $this->errors[$key] = "Validation for " . $this->caller_function . ": Key " . $key . " contains an invalid precedent.";
            return;
        }
        if ($entry) return;
        if ($data[$key] == 'S')
        {
            $this->good_data['station_cat'] = "SCHOOL";
            return;
        }
        $this->good_data['assisted_cat'] = in_array($data[$key], array('M', 'W', 'U', 'L')) ? "ASSISTED" : "NON-ASSISTED";
        $this->good_data['operator_cat'] = in_array($data[$key], array('M', 'W')) ? "MULTI-OP" : "SINGLE-OP";
        if ($data[$key] == 'Q') $this->good_data['power_cat'] = "QRP";
        else $this->good_data['power_cat'] = in_array($data[$key], array('A', 'L', 'W')) ? "LOW" : "HIGH";
    }
    private function log_data($log_value)
    {
        include_once($_SERVER['DOCUMENT_ROOT'] . '/classes/Logging.php');
        $log = new Logging();
        touch('/tmp/hamcontest3.txt');
        $log->lfile('/tmp/hamcontest3.txt');
        $log->lwrite($log_value);
        $log->lclose();
    }
}

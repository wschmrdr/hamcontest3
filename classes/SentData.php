<?php

/**
 * Class login
 * handles the user's login and logout process
 */
class SentData
{
    /**
     * @var object The database connection
     */
    private $db_connection = null;
    /**
     * @var array Collection of error messages
     */
    public $errors = array();
    /**
     * @var array Collection of success / neutral messages
     */
    public $messages = array();
    /**
     * @var array Collection of acceptable data
     */
    public $good_data = array();

    /**
     * the function "__construct()" automatically starts whenever an object of this class is created,
     * you know, when you do "$login = new Login();"
     */
    public function __construct()
    {
        $this->validateData();
        if (!empty($this->errors))
            return;
        # $this->writeData();
        echo "<br/></br>";
        foreach ($this->good_data as $key => $value)
        {
            echo "$key $value<br/>";
        }
    }
    // $_SESSION['contest_name'] = $_POST['contest_name'];
    private function validateData()
    {
        // Check the Existence of a Contest
        if (!$_POST['contest_name'] && !is_numeric($_POST['contest_name']))
            $this->errors[] = "Contest does not exist.";
        else $this->good_data["contest_name_id"] = $_POST['contest_name'];
        
        // Check the Existence of a Contest Instance, whether new or old
        if (!$_POST['contest_instance'] && !is_numeric($_POST['contest_instance']))
            $this->errors[] = "Contest Instance does not exist.";
        else $this->good_data["contest_id"] = $_POST['contest_instance'];

        // Load the contest
        $this->db_connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if (!$this->db_connection->set_charset("utf8")) {
            $this->errors[] = $this->db_connection->error;
            return;
        }
        if ($this->db_connection->connect_errno) {
            $this->errors[] = "Database connection problem.";
            return;
        }
        $query = $this->db_connection->query("SELECT * FROM hamcontest.contest_list WHERE contest_name_id = " . $this->good_data['contest_name_id']);
        $contest_temp = $query->fetch_assoc();
        if (!$contest_temp) {
            $this->errors[] = "Contest does not exist. Please contact administrator.";
            return;
        }

        // Now check Sent Data
        // It is only required if it exists in the contest
        for ($x = 0; $x < 6; $x++)
        {
            if ($x == 0) {
                if (!$_POST['data0'] && !preg_match('/[0-9A-Z/]/', strtoupper($_POST['data0'])))
                    $this->errors[] = "Call sign is not in the right format.";
                else $this->good_data["callsign"] = strtoupper($_POST['data0']);
            }
            else {
                if ($contest_temp['type_data' . $x] <= 0) continue;
                $query = $this->db_connection->query("SELECT * FROM hamcontest.data_type WHERE data_type_id = " . $contest_temp['type_data' . $x]);
                $data_type = $query->fetch_assoc();
                if (!$data_type) {
                    $this->errors[] = "Data Type does not exist. Please contact administrator.";
                    continue;
                }
                if ($data_type["sent_data"] == 0) continue;
                switch ($data_type["data_type"]) {
                    case "number":
                        if (!$_POST['data' . $x] && !is_numeric($_POST['data' . $x]))
                            $this->errors[] = $data_type["longname"] . " is not in the right format.";
                        else $this->good_data["x_data" . $x] = $_POST['data' . $x];
                        break;
                    case "string":
                        if (!$_POST['data' . $x] && !preg_match('/[\x20-\x7E]*/', strtoupper($_POST['data' . $x])))
                            $this->errors[] = $data_type["longname"] . " is not in the right format.";
                        else $this->good_data["x_data" . $x] = $_POST['data' . $x];
                        break;
                    case "enum":
                        if (!$_POST['data' . $x])
                            $this->errors[] = $data_type["longname"] . " does not exist.";
                        else {
                            $mysqlString = "SELECT * FROM hamcontest.enum_values WHERE enum_type IN ('" . $data_type['enum1'] . "', '" . $data_type['enum2'] . "', '" . $data_type['enum3'] . "') AND (shortname = '" . $this->db_connection->real_escape_string($_POST['data' . $x]) . "' OR longname = '" . $this->db_connection->real_escape_string($_POST['data' . $x]) . "')";
                            $query = $this->db_connection->query($mysqlString);
                            $enum_value = $query->fetch_assoc();
                            if (!$enum_value)
                                $this->errors[] = $data_type["longname"] . " is not in the right format.";
                            else $this->good_data["x_data" . $x] = $_POST['data' . $x];
                        }
                        break;
                    case "special":
                        if ($data_type["unique_name"] == "Precedent - ARRL November Sweepstakes") {
                            switch ($_POST['data' . $x]) {
                                case 'A':
                                    $this->good_data["x_data" . $x] = $_POST['data' . $x];
                                    $this->good_data["power"] = "LOW";
                                    $this->good_data["operator_cat"] = "SINGLE-OP";
                                    $this->good_data["assisted_cat"] = "NON-ASSISTED";
                                    break;
                                case 'B':
                                    $this->good_data["x_data" . $x] = $_POST['data' . $x];
                                    $this->good_data["power"] = "HIGH";
                                    $this->good_data["operator_cat"] = "SINGLE-OP";
                                    $this->good_data["assisted_cat"] = "NON-ASSISTED";
                                    break;
                                case 'Q':
                                    $this->good_data["x_data" . $x] = $_POST['data' . $x];
                                    $this->good_data["power"] = "QRP";
                                    $this->good_data["operator_cat"] = "SINGLE-OP";
                                    $this->good_data["assisted_cat"] = "NON-ASSISTED";
                                    break;
                                case 'U':
                                    $this->good_data["x_data" . $x] = $_POST['data' . $x];
                                    $this->good_data["power"] = "HIGH";
                                    $this->good_data["operator_cat"] = "SINGLE-OP";
                                    $this->good_data["assisted_cat"] = "ASSISTED";
                                    break;
                                case 'L':
                                    $this->good_data["x_data" . $x] = $_POST['data' . $x];
                                    $this->good_data["power"] = "LOW";
                                    $this->good_data["operator_cat"] = "SINGLE-OP";
                                    $this->good_data["assisted_cat"] = "ASSISTED";
                                    break;
                                case 'M':
                                    $this->good_data["x_data" . $x] = $_POST['data' . $x];
                                    $this->good_data["power"] = "HIGH";
                                    $this->good_data["operator_cat"] = "MULTI-OP";
                                    $this->good_data["assisted_cat"] = "ASSISTED";
                                    break;
                                case 'W':
                                    $this->good_data["x_data" . $x] = $_POST['data' . $x];
                                    $this->good_data["power"] = "LOW";
                                    $this->good_data["operator_cat"] = "MULTI-OP";
                                    $this->good_data["assisted_cat"] = "ASSISTED";
                                    break;
                                case 'S':
                                    $this->good_data["x_data" . $x] = $_POST['data' . $x];
                                    $this->good_data["station_cat"] = "SCHOOL";
                                    break;
                                default:
                                    $this->errors[] = $data_type["longname"] . " is not in the right format.";
                            }
                        }
                        break;
                    default:
                        $this->errors[] = $data_type["longname"] . " is not a recognized type.";
                        
                }
            }
        }


        // Now for the Required Parameters
        if ($contest_temp['assisted_flag'] == "Y") {
            if (!$_POST['data10'])
                $this->errors[] = "Assisted Category does not exist.";
            else {
                $query = $this->db_connection->query("SELECT * 
                                                      FROM hamcontest.enum_values 
                                                      WHERE enum_type='assisted_cat' 
                                                      AND longname = '" . $this->db_connection->real_escape_string($_POST['data10']) . "'");
                $enum_value = $query->fetch_assoc();
                if (!$enum_value)
                    $this->errors[] = "Assisted Category is not in the right format.";
                else $this->good_data["assisted_cat"] = $_POST['data10'];
            }
        }
        if ($contest_temp['band_flag'] == "Y") {
            if (!$_POST['data11'])
                $this->errors[] = "Band Category does not exist.";
            else {
                $query = $this->db_connection->query("SELECT * 
                                                      FROM hamcontest.enum_values 
                                                      WHERE enum_type='band_cat' 
                                                      AND longname = '" . $this->db_connection->real_escape_string($_POST['data11']) . "'");
                $enum_value = $query->fetch_assoc();
                if (!$enum_value)
                    $this->errors[] = "Band Category is not in the right format.";
                else $this->good_data["band_cat"] = $_POST['data11'];
            }
        }
        if ($contest_temp['mode_flag'] == "Y") {
            if (!$_POST['data12'])
                $this->errors[] = "Mode Category does not exist.";
            else {
                $query = $this->db_connection->query("SELECT * 
                                                      FROM hamcontest.enum_values 
                                                      WHERE enum_type='mode_cat' 
                                                      AND longname = '" . $this->db_connection->real_escape_string($_POST['data12']) . "'");
                $enum_value = $query->fetch_assoc();
                if (!$enum_value)
                    $this->errors[] = "Band Category is not in the right format.";
                else $this->good_data["band_cat"] = $_POST['data12'];
            }
        }
        if ($contest_temp['operator_flag'] == "Y") {
            if (!$_POST['data13'])
                $this->errors[] = "Operator Category does not exist.";
            else {
                $query = $this->db_connection->query("SELECT * 
                                                      FROM hamcontest.enum_values 
                                                      WHERE enum_type='operator_cat' 
                                                      AND longname = '" . $this->db_connection->real_escape_string($_POST['data13']) . "'");
                $enum_value = $query->fetch_assoc();
                if (!$enum_value)
                    $this->errors[] = "Operator Category is not in the right format.";
                else $this->good_data["operator_cat"] = $_POST['data13'];
            }
        }
        if ($contest_temp['power_flag'] == "Y") {
            if (!$_POST['data14'])
                $this->errors[] = "Power Category does not exist.";
            else {
                $query = $this->db_connection->query("SELECT * 
                                                      FROM hamcontest.enum_values 
                                                      WHERE enum_type='power_cat' 
                                                      AND longname = '" . $this->db_connection->real_escape_string($_POST['data14']) . "'");
                $enum_value = $query->fetch_assoc();
                if (!$enum_value)
                    $this->errors[] = "Power Category is not in the right format.";
                else $this->good_data["power_cat"] = $_POST['data14'];
            }
        }
        if ($contest_temp['station_flag'] == "Y") {
            if (!$_POST['data15'])
                $this->errors[] = "Station Category does not exist.";
            else {
                $query = $this->db_connection->query("SELECT * 
                                                      FROM hamcontest.enum_values 
                                                      WHERE enum_type='station_cat' 
                                                      AND longname = '" . $this->db_connection->real_escape_string($_POST['data15']) . "'");
                $enum_value = $query->fetch_assoc();
                if (!$enum_value)
                    $this->errors[] = "Station Category is not in the right format.";
                else $this->good_data["station_cat"] = $_POST['data15'];
            }
        }
        if ($contest_temp['time_flag'] == "Y") {
            if (!$_POST['data16'])
                $this->errors[] = "Time Category does not exist.";
            else {
                $query = $this->db_connection->query("SELECT * 
                                                      FROM hamcontest.enum_values 
                                                      WHERE enum_type='time_cat' 
                                                      AND longname = '" . $this->db_connection->real_escape_string($_POST['data16']) . "'");
                $enum_value = $query->fetch_assoc();
                if (!$enum_value)
                    $this->errors[] = "Time Category is not in the right format.";
                else $this->good_data["time_cat"] = $_POST['data16'];
            }
        }
        if ($contest_temp['transmitter_flag'] == "Y") {
            if (!$_POST['data17'])
                $this->errors[] = "Transmitter Category does not exist.";
            else {
                $query = $this->db_connection->query("SELECT * 
                                                      FROM hamcontest.enum_values 
                                                      WHERE enum_type='transmitter_cat' 
                                                      AND longname = '" . $this->db_connection->real_escape_string($_POST['data17']) . "'");
                $enum_value = $query->fetch_assoc();
                if (!$enum_value)
                    $this->errors[] = "Transmitter Category is not in the right format.";
                else $this->good_data["transmitter_cat"] = $_POST['data17'];
            }
        }
        if ($contest_temp['overlay_flag'] == "Y") {
            if (!$_POST['data18'])
                $this->errors[] = "Overlay Category does not exist.";
            else {
                $query = $this->db_connection->query("SELECT * 
                                                      FROM hamcontest.enum_values 
                                                      WHERE enum_type='overlay_cat' 
                                                      AND longname = '" . $this->db_connection->real_escape_string($_POST['data18']) . "'");
                $enum_value = $query->fetch_assoc();
                if (!$enum_value)
                    $this->errors[] = "Overlay Category is not in the right format.";
                else $this->good_data["overlay_cat"] = $_POST['data18'];
            }
        }

        // Now for the Entrant's Data
        if ($contest_temp['personal_flag'] == "Y") {
             if (!$_POST['data20'] && !preg_match('/[\x20-\x7E]*/', strtoupper($_POST['data20'])))
                 $this->errors[] = "Operators is not in the right format.";
             else $this->good_data["operators"] = $_POST['data20'];

             if (!$_POST['data21'] && !preg_match('/[\x20-\x7E]*/', strtoupper($_POST['data21'])))
                 $this->errors[] = "Club is not in the right format.";
             else $this->good_data["club"] = $_POST['data21'];

             if (!$_POST['data22'] && !preg_match('/[\x20-\x7E]*/', strtoupper($_POST['data22'])))
                 $this->errors[] = "Name is not in the right format.";
             else $this->good_data["name"] = $_POST['data22'];

             if (!$_POST['data23'] && !preg_match('/[\x20-\x7E]*/', strtoupper($_POST['data23'])))
                 $this->errors[] = "Address is not in the right format.";
             else $this->good_data["address"] = $_POST['data23'];

             if (!$_POST['data24'] && !preg_match('/[\x20-\x7E]*/', strtoupper($_POST['data24'])))
                 $this->errors[] = "City is not in the right format.";
             else $this->good_data["addresscity"] = $_POST['data24'];

             if (!$_POST['data25'] && !preg_match('/[\x20-\x7E]*/', strtoupper($_POST['data25'])))
                 $this->errors[] = "State is not in the right format.";
             else $this->good_data["addressstate"] = $_POST['data25'];

             if (!$_POST['data26'] && !preg_match('/[\x20-\x7E]*/', strtoupper($_POST['data26'])))
                 $this->errors[] = "Postal Code is not in the right format.";
             else $this->good_data["addresszip"] = $_POST['data26'];

             if (!$_POST['data27'] && !preg_match('/[\x20-\x7E]*/', strtoupper($_POST['data27'])))
                 $this->errors[] = "Country is not in the right format.";
             else $this->good_data["addresscountry"] = $_POST['data27'];
        }
    }
    private function writeData()
    {
        
    }
}

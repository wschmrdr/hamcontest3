<?php

/**
 * Class login
 * handles the user's login and logout process
 */
class ContactData
{
    /**
     * @var object The database connection
     */
    private $db_connection = null;
    /**
     * @var array Collection of Contact Data
     * This will always have the same setup of data, and the only variance
     * will be the data arrays.
     * A date is required, but will be handled exclusively by the database.
     */
    public $contact = array(
        'frequency' => 0,
        'contactmode' => "",
        'sentcall' => "",
        'sentdata' => array(),
        'recvcall' => "",
        'recvdata' => array()
    );

    /**
     * the function "__construct()" automatically starts whenever an object of this class is created,
     * you know, when you do "$login = new Login();"
     */
    public function __construct()
    {
        // create/read session, absolutely necessary
        $this->contact['sentdata'] = $this->getDataParams();
        $this->contact['recvdata'] = $this->getDataParams();
    }

    public function getDataParams()
    {
        require_once("DataType.php");
        switch ($_SESSION['contest_name'])
        {
            case "ARRL-SS-CW":
            case "ARRL-SS-SSB":
                return array(1 => new DataType("Record Number - Unlimited Digits"), 
                             new DataType("Precedent - ARRL November Sweepstakes"), 
                             new DataType("Check - First Year Licensed - 2 Digits"), 
                             new DataType("ARRLRACSection"));
        }
        return array();
    }
    
}

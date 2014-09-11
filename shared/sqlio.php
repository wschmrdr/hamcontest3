<?php
class SQLfunction
{
    private $db_connection = null;
    private $db_db = null;
    private $db_table = null;
    private $db_columns = null;
    private $db_fetchall = null;

    public function __construct()
    {
        include_once($_SERVER['DOCUMENT_ROOT'] . "/classes/Logging.php");
        if (session_id() == '') session_start();
        require_once($_SERVER['DOCUMENT_ROOT'] . "/../config/db.php");
        $this->db_connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if (!$this->db_connection->set_charset("utf8")) throw new Exception($this->db_connection->error);
        if ($this->db_connection->connect_errno) throw new Exception("Cannot connect to database.");
        $this->db_db = DB_NAME;
    }

    private function update_db($db)
    {
        $query = "SHOW DATABASES LIKE '" . $this->db_connection->real_escape_string($db) . "'";
        $this->log_data($query);
        if (mysqli_num_rows($this->db_connection->query($query)) != 1) throw new Exception("Database " . $db . " does not exist.");
        $this->db_db = $this->db_connection->real_escape_string($db);
    }
    private function update_table($table)
    {
        $query = "SHOW TABLES IN " . $this->db_db . " LIKE '" . $this->db_connection->real_escape_string($table) . "'";
        $this->log_data($query);
        if (mysqli_num_rows($this->db_connection->query($query)) != 1) throw new Exception("Table " . $table . " does not exist.");
        $this->db_table = $this->db_connection->real_escape_string($table);
    }
    private function update_columns($columns)
    {
        $first_pass = true;
        foreach ($columns as $k => $c)
        {
            $this->db_columns = ($first_pass) ? "" : $this->db_columns . ",";
            if ($first_pass) $first_pass = false;
            $query = "SHOW COLUMNS IN " .
                     $this->db_db . "." .
                     $this->db_table . " LIKE '" .
                     $this->db_connection->real_escape_string($c) . "'";
            $this->log_data($query);
            if (mysqli_num_rows($this->db_connection->query($query)) != 1) throw new Exception("Column " . $c . " does not exist.");
            if ($k === "MAX") $this->db_columns = $this->db_columns . "MAX(" .
                                                  $this->db_connection->real_escape_string($c) . ") AS " .
                                                  $this->db_connection->real_escape_string($c);
            else if ($k === "COUNT") $this->db_columns = $this->db_columns . "COUNT(" .
                                                         $this->db_connection->real_escape_string($c) . ")";
            else $this->db_columns = $this->db_columns . $this->db_connection->real_escape_string($c);
        }
    }
    private function update_fetchall($fetchall)
    {
        $this->db_fetchall = $fetchall;
    }

    public function sql($args)
    {
        foreach ($args as $k => $v)
        {
            if ($k === "db") $this->update_db($v);
            else if ($k === "table") $this->update_table($v);
            else if ($k === "columns") $this->update_columns($v);
            else if ($k === "fetchall") $this->update_fetchall($v);
        }
        if (!array_key_exists("columns", $args)) $this->db_columns = "*";
        if (!array_key_exists("fetchall", $args)) $this->db_fetchall = true;
        return $this;
    }

    public function select($where = array(), $options = array())
    {
        $sql_string = "SELECT " . $this->db_columns .
                      " FROM " . $this->db_db . "." .
                      $this->db_table . $this->build_where($where);
        if (array_key_exists("order", $options))
        {
            $sql_string = $sql_string . " ORDER BY " . $options['order'];
        }
        $this->log_data($sql_string);
        $sql = $this->db_connection->query($sql_string);
        if (!$this->db_fetchall) return $this->remove_nulls($sql->fetch_array(MYSQL_ASSOC));
        $rows = array();
        while($r = $sql->fetch_array(MYSQL_ASSOC)) {
            $rows[] = $this->remove_nulls($r);
        }
        return $rows;
    }
    public function insert($data)
    {
        $s1 = "";
        $s2 = "";
        $first_pass = true;
        foreach ($data as $k => $v)
        {
            $s1 = ($first_pass) ? $s1 : $s1 . ",";
            $s2 = ($first_pass) ? $s2 : $s2 . ",";
            if ($first_pass) $first_pass = false;
            $s1 = $s1 . $this->db_connection->real_escape_string($k);
            $s2 = $s2 . "'" . $this->db_connection->real_escape_string($v) . "'";
        }
        $sql_string = "INSERT INTO " . $this->db_db . "." . $this->db_table . "(" . $s1 . ") VALUES (" . $s2 . ")";
        $this->log_data($sql_string);
        return ($this->db_connection->query($sql_string)) ? $this->db_connection->insert_id : false;
    }
    public function update($data, $where = array())
    {
        $sql_string = "UPDATE " . $this->db_db . "." . $this->db_table . " SET ";
        $first_pass = true;
        foreach ($data as $k => $v)
        {
            $sql_string = ($first_pass) ? $sql_string : $sql_string . ",";
            if ($first_pass) $first_pass = false;
            $sql_string = $sql_string . $this->db_connection->real_escape_string($k) . "='" .
                                        $this->db_connection->real_escape_string($v) . "'";
        }
        $sql_string = $sql_string . $this->build_where($where);
        $this->log_data($sql_string);
        return $this->db_connection->query($sql_string);
    }
    public function delete($where = array())
    {
        if (count($where) <= 0) throw new Exception("Delete must contain parameters.");
        $sql_string = "DELETE FROM " . $this->db_db . "." . $this->db_table . $this->build_where($where);
        $this->log_data($sql_string);
        return $this->db_connection->query($sql_string);
    }

    private function build_where($where)
    {
        $sql_string = "";
        $first_pass = true;
        foreach ($where as $k => $v)
        {
            $sql_string = ($first_pass) ? $sql_string . " WHERE " : $sql_string . " AND ";
            if ($first_pass) $first_pass = false;
            if (substr($v, 0, 5) === " IN (") $sql_string = $sql_string .
                                                            $this->db_connection->real_escape_string($k) .
                                                            $v;
            else $sql_string = $sql_string .
                               $this->db_connection->real_escape_string($k) . "='" .
                               $this->db_connection->real_escape_string($v) . "'";
        }
        return $sql_string;
    }

    private function log_data($log_value)
    {
        $log = new Logging();
        touch('/tmp/hamcontest3.txt');
        $log->lfile('/tmp/hamcontest3.txt');
        $log->lwrite($log_value);
        $log->lclose();
    }

    private function remove_nulls($row)
    {
        foreach ($row as $k => $v)
        {
            if ($v === null) unset($row[$k]);
        }
        return $row;
    }
    public function sqlIN($array_data)
    {
        $sql_string = " IN (";
        $first_pass = true;
        foreach ($array_data as $x)
        {
            $sql_string = ($first_pass) ? $sql_string : $sql_string . ",";
            if ($first_pass) $first_pass = false;
            $sql_string = $sql_string . "'" . $this->db_connection->real_escape_string($x) . "'";
        }
        $sql_string = $sql_string . ")";
        return $sql_string;
    }
    public function sysdate()
    {
        $sql = $this->db_connection->query("SELECT NOW()");
        $r = $sql->fetch_array(MYSQL_ASSOC);
        return $r['NOW()'];
    }
}

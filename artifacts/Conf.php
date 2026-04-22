<?php

class Conf
{
    private string $dbHost;
    private string $dbPort;
    private string $dbName;
    private string $dbUser;
    private string $dbPass;

    public function __construct()
    {
        $this->dbHost = 'ohrm-db';
        $this->dbPort = '3306';
        if (defined('ENVIRONMENT') && ENVIRONMENT == 'test') {
            $prefix = defined('TEST_DB_PREFIX') ? TEST_DB_PREFIX : '';
            $this->dbName = $prefix . 'test_orangehrm';
        } else {
            $this->dbName = 'orangehrm';
        }
        $this->dbUser = 'orangehrm';
        $this->dbPass = 'Orange123!';
    }

    public function getDbHost(): string
    {
        return $this->dbHost;
    }

    public function getDbPort(): string
    {
        return $this->dbPort;
    }

    public function getDbName(): string
    {
        return $this->dbName;
    }

    public function getDbUser(): string
    {
        return $this->dbUser;
    }

    public function getDbPass(): string
    {
        return $this->dbPass;
    }
}

import pymysql

# Patch Django to use pymysql as a drop-in replacement for mysqlclient (guarantees seamless MySQL support on Windows)
pymysql.install_as_MySQLdb()

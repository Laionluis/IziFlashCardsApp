import { DatabaseConnection } from './DatabaseConnection'

var db = null
export default class DatabaseInit {

    constructor() {
        if (typeof document != 'undefined') //se for web
        {
            // usar cache/local storage ou web sql do chrome
            db = openDatabase('databaseFlashCards', '1.0', 'FlashCard DB', 2 * 1024 * 1024);
            this.InitDb(); 
        } else
        {
            db = DatabaseConnection.getConnection();
            db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
                console.log('Foreign keys turned on')
            );
            this.InitDb();
        }
    }

    InitDb() {
        var sql = [
            //`DROP TABLE IF EXISTS Pasta;`,
            //`DROP TABLE IF EXISTS SubPasta;`,

            `create table if not exists Pasta (
                id integer primary key autoincrement NOT NULL,
                nome text NOT NULL                  
            );`,

            `create table if not exists FlashCard (
                id integer primary key autoincrement NOT NULL,
                idMateria null,
                idAssunto null,
                titulo text NOT NULL,
                FOREIGN KEY (idMateria)
                    REFERENCES Pasta (id)
                        ON DELETE CASCADE,
                FOREIGN KEY (idAssunto)
                    REFERENCES SubPasta (id) 
                        ON DELETE CASCADE                   
            );`,

            `create table if not exists Cards (
                id integer primary key autoincrement NOT NULL,
                frente text NOT NULL,
                verso text NOT NULL,
                idFlashCard integer NOT NULL,
                FOREIGN KEY (idFlashCard)
                    REFERENCES FlashCard (id)       
                        ON DELETE CASCADE           
            );`,

            `create table if not exists SubPasta (
                id integer primary key autoincrement NOT NULL,
                nome text NOT NULL,
                idPasta integer NOT NULL,
                FOREIGN KEY (idPasta)
                    REFERENCES Pasta (id)                  
            );`,
        ];

        db.transaction(
            tx => {
                for (var i = 0; i < sql.length; i++) {
                    console.log("execute sql : " + sql[i]);
                    tx.executeSql(sql[i]);
                }
            }, (error) => {
                console.log("error call back : " + JSON.stringify(error));
                console.log(error);
            }, () => {
                console.log("transaction complete call back ");
            }
        );
    }

}
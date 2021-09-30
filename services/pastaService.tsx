import {DatabaseConnection} from '../database/DatabaseConnection'

const table = "Pasta"
var db = null;

if (typeof document != 'undefined') //se for web
{
    // usar cache/local storage ou web sql do chrome
    db = openDatabase('databaseFlashCards', '1.0', 'FlashCard DB', 2 * 1024 * 1024);
} else
{
    db = DatabaseConnection.getConnection();
}

export async function addData(param) {
    return new Promise((resolve, reject) =>db.transaction(
            tx => {
                tx.executeSql(`insert into ${table} (nome) 
                values (?)`, 
                [param.nome], 
                (_, { insertId, rows }) => {
                    console.log("id insert: " + insertId);
                    resolve(insertId)
                }), (sqlError) => {
                    console.log(sqlError);
                }}, (txError) => {
                console.log(txError);
            }));
}

export async function insereSubPasta(param) {
    return new Promise((resolve, reject) =>db.transaction(
            tx => {
                tx.executeSql(`insert into SubPasta (nome, idPasta) 
                values (?, ?)`, 
                [param.nome, param.idPasta], 
                (_, { insertId, rows }) => {
                    console.log("id insert: " + insertId);
                    resolve(insertId)
                }), (sqlError) => {
                    console.log(sqlError);
                }}, (txError) => {
                console.log(txError);
            }));
}

export async function findAll() {
    let pastas = []; 

    return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select p.id as idPasta, p.nome as pasta, sp.id as idSubpasta, sp.nome as subPasta from Pasta as p left join SubPasta as sp on sp.idPasta = p.id`, [], (_, { rows }) => {        
                var rows_ = rows._array;
                if (typeof document != 'undefined') //se for web    
                    rows_ = rows;
                let data = rows_.length;           
                for (let i = 0; i < rows_.length; i++) {   
                    var pastaAux = {
                        id: rows_[i].idPasta,
                        nome: rows_[i].pasta
                    };     
                    if (rows_[i].idSubpasta != null)
                    {
                        let subpastas = []; 
                        rows_.forEach(element => {
                            if (element.idPasta == pastaAux.id)
                            {
                                var subpastaAux = {
                                    id: element.idSubpasta,
                                    nome: element.subPasta
                                };  
                                if(!subpastas.some(item => subpastaAux.id === item.id))
                                    subpastas.push(subpastaAux);  
                            }
                        });
                        pastaAux.children = subpastas;
                    }
                    if(!pastas.some(item => pastaAux.id === item.id))
                        pastas.push(pastaAux);                   
                }
                resolve(pastas);
            }), (sqlError) => {
                console.log(sqlError);
            }}, (txError) => {
            console.log(txError);
        }))       
}

export async function findAllSubPasta(idPasta) {
    let retorno = []; 
    return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from SubPasta where idPasta = ?`, [idPasta], (_, { rows }) => {        
                var rows_ = rows._array;
                if (typeof document != 'undefined') //se for web    
                    rows_ = rows;
                let data = rows_.length;           
                for (let i = 0; i < rows_.length; i++) {   
                    retorno.push(rows_[i]);                   
                }
                resolve(retorno);
            }), (sqlError) => {
                console.log(sqlError);
            }}, (txError) => {
            console.log(txError);
        }))       
}

export async function findByIdPasta(idPasta) {
    let playList = []; 
    return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${table} where id = ?`, [idPasta], (_, { rows }) => {                
                let data = rows.length;   
                resolve(data > 0);
            }), (sqlError) => {
                console.log(sqlError);
            }}, (txError) => {
            console.log(txError);
        }))       
}

export async function deleteData(idPasta) {
    return new Promise((resolve, reject) =>db.transaction(
            tx => {
                tx.executeSql(`delete from ${table} where idPasta = ?`, 
                [idPasta], 
                (_, results) => {
                    resolve(results.rowsAffected)
                }), (sqlError) => {
                    console.log(sqlError);
                }}, (txError) => {
                console.log(txError);
            }));
}

export default {addData, findAll, findByIdPasta, deleteData, insereSubPasta, findAllSubPasta}


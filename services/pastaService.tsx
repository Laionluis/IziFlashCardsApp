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
            tx.executeSql(`select p.id as idPasta, p.nome as pasta, sp.id as idSubpasta, sp.nome as subPasta, fcPasta.id as idfcPasta, fcPasta.titulo as fcPastaTitulo, fcSubPasta.id as idfcSubPasta, fcSubPasta.titulo as fcSubPastaTitulo
                            from Pasta as p
                            left join SubPasta as sp on sp.idPasta = p.id
                            left join FlashCard as fcPasta on fcPasta.idMateria = p.id 
                            left join FlashCard as fcSubPasta on fcSubPasta.idAssunto = sp.id `, [], (_, { rows }) => {        
                var rows_ = rows._array;
                //console.log(rows_);
                if (typeof document != 'undefined') //se for web    
                    rows_ = rows;
                let data = rows_.length;           
                for (let i = 0; i < rows_.length; i++) {   
                    var pastaAux = {
                        id: rows_[i].idPasta,
                        nome: rows_[i].pasta,
                        ehPai: true
                    };     
                    if (rows_[i].idSubpasta != null)
                    {
                        let subpastas = []; 
                        rows_.forEach(element => {
                            if (element.idPasta == pastaAux.id)
                            {
                                var subpastaAux = {
                                    id: element.idSubpasta,
                                    nome: element.subPasta,
                                    parent: pastaAux.id
                                };  

                                if (rows_[i].idfcSubPasta != null)
                                {
                                    let flashCards = []; 
                                    rows_.forEach(element => {
                                        if (element.idSubpasta == subpastaAux.id)
                                        {
                                            var flashCardAux = {
                                                id: element.idfcSubPasta + '#',
                                                nome: element.fcSubPastaTitulo,
                                                assuntoPai: subpastaAux.id,
                                                ehFlashCard : true
                                            };  
                                            if(!flashCards.some(item => flashCardAux.id === item.id))
                                                flashCards.push(flashCardAux);  
                                        }
                                    });
                                    subpastaAux.children = flashCards;
                                }

                                if(!subpastas.some(item => subpastaAux.id === item.id))
                                    subpastas.push(subpastaAux);  
                            }
                        });
                        pastaAux.children = subpastas;
                    }
                    if (rows_[i].idfcPasta != null)
                    {
                        let flashCards = []; 
                        rows_.forEach(element => {
                            if (element.idPasta == pastaAux.id)
                            {
                                var flashCardAux = {
                                    id: element.idfcPasta + '#',
                                    nome: element.fcPastaTitulo,
                                    materiaPai: pastaAux.id,
                                    ehFlashCard : true
                                };  
                                if(!flashCards.some(item => flashCardAux.id === item.id))
                                    flashCards.push(flashCardAux);  
                            }
                        });
                        if(pastaAux.children == null)
                            pastaAux.children = flashCards;
                        else{
                            for (let index = 0; index < flashCards.length; index++) {
                                const element = flashCards[index];
                                pastaAux.children.push(element);
                            }
                        }
                            
                    }
                    if(!pastas.some(item => pastaAux.id === item.id))
                        pastas.push(pastaAux);                   
                }
                //console.log(pastas);
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
    let pastas = []; 
    return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select p.id as idPasta, p.nome as pasta, sp.id as idSubpasta, sp.nome as subPasta 
                            from Pasta as p 
                            left join SubPasta as sp on sp.idPasta = p.id
                            left join FlashCard as fcPasta on fcPasta.idMateria = p.id 
                            left join FlashCard as fcSubPasta on fcSubPasta.idAssunto = sp.id 
                            where p.id = ?`, [idPasta], (_, { rows }) => {                
                var rows_ = rows._array;
                if (typeof document != 'undefined') //se for web    
                    rows_ = rows;
                let data = rows_.length;           
                for (let i = 0; i < rows_.length; i++) {   
                    var pastaAux = {
                        id: rows_[i].idPasta,
                        nome: rows_[i].pasta,
                        ehPai: true
                    };     
                    if (rows_[i].idSubpasta != null)
                    {
                        let subpastas = []; 
                        rows_.forEach(element => {
                            if (element.idPasta == pastaAux.id)
                            {
                                var subpastaAux = {
                                    id: element.idSubpasta,
                                    nome: element.subPasta,
                                    parent: pastaAux.id
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

export async function deletePasta(idPasta) {
    return new Promise((resolve, reject) =>db.transaction(
            tx => {
                tx.executeSql(`delete from ${table} where id = ?`, 
                [idPasta], 
                (_, results) => {
                    resolve(results.rowsAffected)
                }), (sqlError) => {
                    console.log(sqlError);
                }}, (txError) => {
                console.log(txError);
            }));
}

export async function deleteSubPastaPorPai(idPasta) {
    return new Promise((resolve, reject) =>db.transaction(
            tx => {
                tx.executeSql(`delete from SubPasta where idPasta = ?`, 
                [idPasta], 
                (_, results) => {
                    resolve(results.rowsAffected)
                }), (sqlError) => {
                    console.log(sqlError);
                }}, (txError) => {
                console.log(txError);
            }));
}

export async function deleteSubPastaPorId(idPasta) {
    return new Promise((resolve, reject) =>db.transaction(
            tx => {
                tx.executeSql(`delete from SubPasta where id = ?`, 
                [idPasta], 
                (_, results) => {
                    resolve(results.rowsAffected)
                }), (sqlError) => {
                    console.log(sqlError);
                }}, (txError) => {
                console.log(txError);
            }));
}

export async function atualizarPasta(param) {
    return new Promise((resolve, reject) =>db.transaction(
            tx => {
                tx.executeSql(`update Pasta set nome = ? where id = ?`, 
                [param.nome, param.id], 
                (_, results) => {
                    resolve(results.rowsAffected)
                }), (sqlError) => {
                    console.log(sqlError);
                }}, (txError) => {
                console.log(txError);
            }));
}

export async function atualizarSubPasta(param) {
    return new Promise((resolve, reject) =>db.transaction(
            tx => {
                tx.executeSql(`update SubPasta set nome = ? where id = ?`, 
                [param.nome, param.id], 
                (_, results) => {
                    resolve(results.rowsAffected)
                }), (sqlError) => {
                    console.log(sqlError);
                }}, (txError) => {
                console.log(txError);
            }));
}

export async function insereFlashCard(param) {
    return new Promise((resolve, reject) =>db.transaction(
            tx => {
                tx.executeSql(`insert into FlashCard (titulo, idMateria, idAssunto) 
                values (?, ?, ?)`, 
                [param.titulo, param.idMateria, param.idAssunto], 
                (_, { insertId, rows }) => {
                    console.log("id insert: " + insertId);
                    resolve(insertId)
                }), (sqlError) => {
                    console.log(sqlError);
                }}, (txError) => {
                console.log(txError);
            }));
}

export async function insereCards(param) {
    return new Promise((resolve, reject) =>db.transaction(
            tx => {
                tx.executeSql(`insert into Cards (frente, verso, idFlashCard) 
                values (?, ?, ?)`, 
                [param.frente, param.verso, param.idFlashCard], 
                (_, { insertId, rows }) => {
                    console.log("id insert: " + insertId);
                    resolve(insertId)
                }), (sqlError) => {
                    console.log(sqlError);
                }}, (txError) => {
                console.log(txError);
            }));
}

export async function findAllFlashCards() {
    let pastas = []; 

    return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select fc.id as idFlashCard, fc.titulo as titulo
                            from FlashCard as fc
                            where fc.idAssunto is null and fc.idMateria is null `, [], (_, { rows }) => {        
                var rows_ = rows._array;
                
                if (typeof document != 'undefined') //se for web    
                    rows_ = rows;
                let data = rows_.length;           
                for (let i = 0; i < rows_.length; i++) {   
                    var flashCardAux = {
                        id: rows_[i].idFlashCard + '#',
                        nome: rows_[i].titulo,                        
                        ehFlashCard : true
                    };  
                    
                    if(!pastas.some(item => flashCardAux.id === item.id))
                        pastas.push(flashCardAux);                   
                }
                
                resolve(pastas);
            }), (sqlError) => {
                console.log(sqlError);
            }}, (txError) => {
            console.log(txError);
        }))       
}

export async function findFlashCardPorId(param) {
    let pastas = []; 

    return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select fc.id as idFlashCard, fc.titulo as titulo, fc.idAssunto as idAssunto, COALESCE(fc.idMateria,sp.idPasta) as idMateria, COALESCE(p.nome,psp.nome)  as nomeMateria, sp.nome as nomeAssunto 
                            from FlashCard as fc
                            left join Pasta p on p.id = fc.idMateria 
                            left join SubPasta sp on sp.id = fc.idAssunto 
                            left join Pasta psp on psp.id = sp.idPasta
                            where fc.id = ? `, [param.idFlashCard], (_, { rows }) => {        
                var rows_ = rows._array;
                                
                resolve(rows_[0]);
            }), (sqlError) => {
                console.log(sqlError);
            }}, (txError) => {
            console.log(txError);
        }))       
}

export async function deleteFlashCardsPorMateria(idPasta) {
    return new Promise((resolve, reject) =>db.transaction(
            tx => {
                tx.executeSql(`delete from FlashCard where idPasta = ?`, 
                [idPasta], 
                (_, results) => {
                    resolve(results.rowsAffected)
                }), (sqlError) => {
                    console.log(sqlError);
                }}, (txError) => {
                console.log(txError);
            }));
}

export async function findCardsPorIdFlashCard(idflashcard) {
    let pastas = []; 

    return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select fc.id as id, fc.frente as frente, fc.verso as verso
                            from Cards as fc                           
                            where fc.idFlashCard = ? `, [idflashcard], (_, { rows }) => {        
                var rows_ = rows._array;                                
                resolve(rows_);
            }), (sqlError) => {
                console.log(sqlError);
            }}, (txError) => {
            console.log(txError);
        }))       
}

export default {addData, findAll, findCardsPorIdFlashCard, findAllFlashCards,findFlashCardPorId, findByIdPasta, deletePasta, deleteSubPastaPorPai, deleteSubPastaPorId, insereSubPasta, findAllSubPasta, atualizarPasta, atualizarSubPasta, insereFlashCard, insereCards}


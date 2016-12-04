var todoDB = {};
var indexedDB = window.indexedDB;
todoDB.indexedDB = {};
todoDB.indexedDB.db = null;

function init() {
  todoDB.indexedDB.open();
}   

todoDB.indexedDB.onerror = function(error){
  console.log(error);
}

todoDB.indexedDB.open = function(){
  var v = 1;
  var request = indexedDB.open('todos',v);

  request.onupgradeneeded = function(e){
    var db = request.result;
    var store = db.createObjectStore('todo', {keyPath: 'timeStamp'});
  };

  request.onsuccess = function(e){
    todoDB.indexedDB.db = e.target.result;
    todoDB.indexedDB.getAllTodos();
  };

  request.onfailure = todoDB.indexedDB.onerror;
}

todoDB.indexedDB.addTodo = function(text, checked){
  var db = todoDB.indexedDB.db;
  var trans = db.transaction('todo','readwrite');
  var store = trans.objectStore('todo');

  var data = {
    'text':text,
    'checked': checked,
    'timeStamp': new Date().getTime()
  };

  var request = store.put(data);

  request.oncomplete = function(error){
    todo.indexedDB.getAllTodos();
  };

  request.onerror = function(error){
    console.log('Error adding: ' + error)
  }
}

todoDB.indexedDB.getAllTodos = function(){
  var request = window.indexedDB.open('todos');
  request.onsuccess = function(event){
    var db = todoDB.indexedDB.db;
    var trans = db.transaction('todo','readonly');
    var request = trans.objectStore('todo').openCursor();

    request.onsuccess = function(event){
      var cursor= request.result;

      data.todos = [];

      if (cursor){
        var todo = {
          'key':cursor.key,
          'text':cursor.value.text,
          'checked':cursor.value.checked
        }
        data.todos.push(todo);
        cursor.continue();
      }
    }
  }
}



init();













// var todo = {};
// todo.webdb = {};
// var db;

// todo.webdb.open = function(){
//   var dbSize = 1024 * 1024;
//   todo.webdb.db = openDatabase('To-Do','1','To-Do Manager', dbSize);
//   db = todo.webdb.db;
// }

// todo.webdb.onError = function(tx, e){
//   alert('There has been an error: ' + e.message);
// }

// todo.webdb.onSuccess = function(tx, r){
//   todo.webdb.getAllTodos(loadTodos);
// }

// todo.webdb.createTable = function(){
//   db.transaction(function(tx){
//     tx.executeSql('CREATE TABLE IF NOT EXISTS ' + 
//                   'todo(ID INTEGER PRIMARY KEY ASC, todo TEXT, checked TEXT, added_on DATETIME)',[]);
//   })
// }

// todo.webdb.addTodo = function(todoText, checked){
//   db.transaction(function(tx){
//     var addedOn = new Date();
//     console.log(todoText + ' ' + addedOn + ' '+ checked)
//     tx.executeSql('INSERT INTO todo(todo, checked, added_on) VALUES (?,?,?)',
//     [todoText, checked, addedOn],
//     todo.webdb.onSuccess,
//     todo.webdb.onError);
//   });
// }

// todo.webdb.getAllTodos = function(renderFunc){
//   db.transaction(function(tx){
//     tx.executeSql('SELECT * FROM todo', [], renderFunc, todo.webdb.onError);
//   });
// }

// function loadTodos(tx, response){
//   var rows = response.rows
//   data.todos = [];
//   for (var i = 0; i < rows.length; i++){
//     var row = rows.item(i);
//     var todo = {};
//     todo.text = row.todo;
//     todo.id = row.ID;
//     todo.checked = row.checked === 'true';
//     data.todos.push(todo);
//   }
// }

// todo.webdb.editTodo = function(text, id){
//   db.transaction(function(tx){
//     tx.executeSql('UPDATE todo SET todo=? WHERE ID=?',[text, id],
//       todo.webdb.onSuccess,
//       todo.webdb.onError);
//   });
// }

// todo.webdb.checkTodo = function(boolString, id){
//   db.transaction(function(tx){
//     tx.executeSql('UPDATE todo SET checked=? WHERE ID=?',[boolString, id],
//       todo.webdb.onSuccess,
//       todo.webdb.onError);
//   });
// }

// todo.webdb.deleteTodo = function(id){
//   db.transaction(function(tx){
//     tx.executeSql('DELETE FROM todo WHERE ID=?', [id],
//       todo.webdb.onSuccess,
//       todo.webdb.onError);
//   });
// }

// todo.webdb.deleteAll = function(){
//   db.transaction(function(tx){
//     tx.executeSql('DELETE FROM todo WHERE checked=?', ['true'],
//       todo.webdb.onSuccess,
//       todo.webdb.onError);
//   });
// }

// function init(){
//   todo.webdb.open();
//   todo.webdb.createTable();
//   todo.webdb.getAllTodos(loadTodos);
// }

// init();
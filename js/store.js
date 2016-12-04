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

    data.todos = [];

    request.onsuccess = function(event){
      var cursor= request.result;

      if (cursor){
        var todo = {
          'key':cursor.key,
          'text':cursor.value.text,
          'checked':(cursor.value.checked === "true")
        }
        data.todos.push(todo);
        cursor.continue();
      }
    }
  }
}

function deleteTodo(key){
  var db = todoDB.indexedDB.db;
  var trans = db.transaction('todo','readwrite');
  var store = trans.objectStore('todo');

  var request = store.delete(key);

  trans.oncomplete = function(e){
    todoDB.indexedDB.getAllTodos();
  };

  request.onError = function(e){
    console.log('Error adding: ', e);
  };
};


function deleteAllTodos(){
  var db = todoDB.indexedDB.db;
  var trans = db.transaction('todo','readwrite');
  var store = trans.objectStore('todo');

  var request = store.clear();
}



init();











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
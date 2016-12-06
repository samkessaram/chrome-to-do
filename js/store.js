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

  request.onsuccess = function(){
    todoDB.indexedDB.getAllTodos();
  };

  request.onerror = function(error){
    console.log('Error adding: ' + error)
  }
}

todoDB.indexedDB.getAllTodos = function(){
  var request = window.indexedDB.open('todos');
  request.onsuccess = function(){
    var db = todoDB.indexedDB.db;
    var trans = db.transaction('todo','readonly');
    var request = trans.objectStore('todo').openCursor();

    data.todos = [];

    request.onsuccess = function(){
      var cursor= request.result;

      if (cursor){
        var todo = {
          'key':cursor.key,
          'text':cursor.value.text,
          'checked':(cursor.value.checked)
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

  trans.oncomplete = function(){
    todoDB.indexedDB.getAllTodos();
  };

  request.onError = function(e){
    console.log('Error: ' + e);
  };
};


function deleteAllTodos(){
  var db = todoDB.indexedDB.db;
  var trans = db.transaction('todo','readwrite');
  var store = trans.objectStore('todo');

  var request = store.clear();

  request.onsuccess = function(){
    todoDB.indexedDB.getAllTodos();
  }

  request.onerror = function(e){
    console.log('Error: ' + e);
  }
}

function checkTodo(task){
  var db = todoDB.indexedDB.db;
  var trans = db.transaction('todo','readwrite');
  var store = trans.objectStore('todo');

  var request = store.get(task.key);

  request.onsuccess = function(){
    var todo = request.result;
    todo.checked = task.checked;

    var updateChecked = store.put(todo);

    updateChecked.onsuccess = function(){
      todoDB.indexedDB.getAllTodos();
    }

    updateChecked.onerror = function(e){
      console.log('Error updating: ' + e)
    }
  }

  request.onerror = function(e){
    console.log('Error: ' + e)
  }
}

function checkAllTodos(){
    var request = window.indexedDB.open('todos');
    request.onsuccess = function(){
    var db = todoDB.indexedDB.db;
    var trans = db.transaction('todo','readwrite');
    var store = trans.objectStore('todo');
    var request = store.openCursor();
    var checked = !vm.areAllSelected;

    request.onsuccess = function(){
      var cursor = request.result;

      if (cursor){
        var todo = cursor.value
        todo.checked = checked;

        var updateTodo = store.put(todo);

        updateTodo.onsuccess = function(){
          cursor.continue();
        }

        updateTodo.onerror = function(e){
          console.log('Error updating: ' + e)
        }
      }
    }

    todoDB.indexedDB.getAllTodos();
  }
}

function editTodo(task){
  var db = todoDB.indexedDB.db;
  var trans = db.transaction('todo','readwrite');
  var store = trans.objectStore('todo');

  var request = store.get(task.key);

  request.onsuccess = function(){
    var todo = request.result;
    todo.text = task.text;
    console.log(todo);

    var updateTodo = store.put(todo);

    updateTodo.onsuccess = function(){
      todoDB.indexedDB.getAllTodos();
    }

    updateTodo.onerror = function(e){
      console.log('Error updating: ' + e)
    }
  }

  request.onerror = function(e){
    console.log('Error: ' + e)
  }
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
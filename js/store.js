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

  var todoData = {
    'text':text,
    'checked': checked,
    'timeStamp': new Date().getTime()
  };

  var request = store.put(todoData);

  request.onsuccess = function(){
    data.todos.push(todoData);
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

    allTodos = [];

    request.onsuccess = function(){
      var cursor= request.result;

      if (cursor){
        var todo = {
          'key':cursor.key,
          'text':cursor.value.text,
          'checked':(cursor.value.checked)
        }
        allTodos.push(todo);
        cursor.continue();
      }

      data.todos = allTodos;
    }
  }
}

function deleteTodo(task, arr){
  var db = todoDB.indexedDB.db;
  var trans = db.transaction('todo','readwrite');
  var store = trans.objectStore('todo');

  var request = store.delete(task.key || task.timeStamp);

  trans.oncomplete = function(){
    arr.splice(arr.indexOf(task),1)
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

  var request = store.get(task.key || task.timeStamp);

  request.onsuccess = function(){
    var todo = request.result;
    todo.checked = !task.checked;

    var updateChecked = store.put(todo);

    updateChecked.onsuccess = function(){
      task.checked = !task.checked;
    }

    updateChecked.onerror = function(e){
      console.log('Error updating: ' + e)
    }
  }

  request.onerror = function(e){
    console.log('Error: ' + e)
  }
}

function checkAllTodos(thisVue){
    var request = window.indexedDB.open('todos');
    request.onsuccess = function(){
      var db = todoDB.indexedDB.db;
      var trans = db.transaction('todo','readwrite');
      var store = trans.objectStore('todo');
      var request = store.openCursor();
      var checked = !areAllSelected(thisVue);

      request.onsuccess = function(){
        var cursor = request.result;

        if (cursor){
          var todo = cursor.value
          todo.checked = checked;

          var updateTodo = store.put(todo);

          updateTodo.onsuccess = function(){
            cursor.continue()
          }

          updateTodo.onerror = function(e){
            console.log('Error updating: ' + e)
          }
        }
      }

      for (var i = 0; i < data.todos.length; i++){
        data.todos[i].checked = checked;
      }
  }
}

function editTodo(task,element){
  var db = todoDB.indexedDB.db;
  var trans = db.transaction('todo','readwrite');
  var store = trans.objectStore('todo');

  var request = store.get(task.key || task.timeStamp);

  request.onsuccess = function(){
    var todo = request.result;
    todo.text = task.text;

    var updateTodo = store.put(todo);

    updateTodo.onsuccess = function(){
      element.blur();
    }

    updateTodo.onerror = function(e){
      console.log('Error updating: ' + e);
      alert('Error updating: ' + e);
      todoDB.indexedDB.getAllTodos();
    }
  }

  request.onerror = function(e){
    console.log('Error: ' + e)
  }
}

init();
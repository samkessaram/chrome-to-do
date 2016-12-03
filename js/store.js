var todo = {};
todo.webdb = {};

todo.webdb.open = function(){
  var dbSize = 1024 * 1024;
  todo.webdb.db = openDatabase('To-Do','1','To-Do Manager', dbSize);
}

todo.webdb.onError = function(tx, e){
  alert('There has been an error: ' + e.message);
}

todo.webdb.onSuccess = function(tx, r){
  todo.webdb.getAllTodos(loadTodos);
}

todo.webdb.createTable = function(){
  var db = todo.webdb.db;
  db.transaction(function(tx){
    tx.executeSql('CREATE TABLE IF NOT EXISTS ' + 
                  'todo(ID INTEGER PRIMARY KEY ASC, todo TEXT, checked TEXT, added_on DATETIME)',[]);
  })
}

todo.webdb.addTodo = function(todoText, checked){
  var db = todo.webdb.db;
  db.transaction(function(tx){
    var addedOn = new Date();
    console.log(todoText + ' ' + addedOn + ' '+ checked)
    tx.executeSql('INSERT INTO todo(todo, checked, added_on) VALUES (?,?,?)',
    [todoText, checked, addedOn],
    todo.webdb.onSuccess,
    todo.webdb.onError);
  });
}

todo.webdb.getAllTodos = function(renderFunc){
  var db = todo.webdb.db;
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM todo', [], renderFunc, todo.webdb.onError);
  });
}

function loadTodos(tx, response){
  var rows = response.rows
  data.todos = [];
  for (var i = 0; i < rows.length; i++){
    var row = rows.item(i);
    var todo = {};
    todo.text = row.todo;
    todo.id = row.ID;
    todo.checked = row.checked === 'true';
    data.todos.push(todo);
  }
}

todo.webdb.deleteTodo = function(id){
  var db = todo.webdb.db;
  db.transaction(function(tx){
    tx.executeSql('DELETE FROM todo WHERE ID=?', [id],
      todo.webdb.onSuccess,
      todo.webdb.onError);
  });
}

todo.webdb.deleteAll = function(){
  var db = todo.webdb.db;
  db.transaction(function(tx){
    tx.executeSql('DELETE FROM todo WHERE checked=?', ['false'],
      todo.webdb.onSuccess,
      todo.webdb.onError);
  });
}

function init(){
  todo.webdb.open();
  todo.webdb.createTable();
  todo.webdb.getAllTodos(loadTodos);
}

init();
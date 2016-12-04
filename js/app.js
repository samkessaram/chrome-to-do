var data = {
    todo: "",
    todos: []
  }

var vm = new Vue({
  el: "#todo",

  data: data,

  methods: {
    addTask: function(){
      var task = this.todo.trim();

      if (task){
        this.todos.push({
          text: task,
          checked: false
        });
        todoDB.indexedDB.addTodo(task, false)
        this.todo = "";
      }
    },
    editTask: function(task){
      editTodo();
    },
    checkTask: function(task){
      console.log(task.checked);
      task.checked = !task.checked;
      console.log(task);
      console.log(task.checked);
      checkTodo(task);
    },
    removeTask: function(task){
      var index = this.todos.indexOf(task)
      this.todos.splice(index,1)
      deleteTodo(task.key);
    },
    clearList: function(){
      this.todos = [];
      deleteAllTodos();
    },
    selectAll: function(){
      var trueOrFalse = this.areAllSelected ? false : true

      for( var i = 0; i < this.todos.length; i++){
        this.todos[i].checked = trueOrFalse
        this.checkTask(this.todos[i])
      }
    }
  },

  computed: {
    areAllSelected: function(){
      return this.todos.every(function(task){
        return task.checked
      }) && this.todos.length > 0
    }
  }

});
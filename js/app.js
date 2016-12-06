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
        todoDB.indexedDB.addTodo(task, false)
        this.todo = "";
      }
    },
    editTask: function(task){
      editTodo(task);
    },
    checkTask: function(task){
      checkTodo(task);
    },
    removeTask: function(task){
      deleteTodo(task.key);
    },
    clearList: function(){
      deleteAllTodos();
    },
    selectAll: function(){
      checkAllTodos();
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
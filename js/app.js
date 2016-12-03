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
        todo.webdb.addTodo(task, 'false')
        this.todo = "";
      }
    },
    removeTask: function(task){
      var index = this.todos.indexOf(task)
      this.todos.splice(index,1)
      todo.webdb.deleteTodo(task.id);
      console.log(task);
    },
    clearList: function(){
      // this.todos = [];
      todo.webdb.deleteAll();
    },
    selectAll: function(task){
      var trueOrFalse = this.areAllSelected ? false : true

      for( var i = 0; i < this.todos.length; i++){
        this.todos[i].checked = trueOrFalse
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
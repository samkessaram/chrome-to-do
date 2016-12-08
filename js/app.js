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
    editTask: function(task, element){
      editTodo(task, element);
    },
    checkTask: function(task){
      checkTodo(task);
    },
    removeTask: function(task){
      deleteTodo(task,data.todos);
    },
    clearList: function(){
      if ( window.confirm('Are you sure you want to delete all tasks?') === true ){
        deleteAllTodos();
      }
    },
    selectAll: function(){
      checkAllTodos(this);
    }
  },

  computed: {
    classObject: function(){
      return {
        'fa-square-o': !areAllSelected(this),
        'fa-check-square-o': areAllSelected(this)
      }
    }
  }

});

function areAllSelected(thisVue){
  return thisVue.todos.every(function(task){
    return task.checked
  }) && thisVue.todos.length > 0
}